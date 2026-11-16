/* Walgesang: der Satz mit Lücken und die Zeichenleiste (Darstellung und Bedienung).
   Klassisches Skript, legt window.WG.satzUi an. Fachlogik steht in js/zeichen.js.

   Darstellung im DOM (Entscheidung Mini-Spec Etappe 1): Wort-Kacheln als Text, jede Lücke ist ein echter <button>
   mit Beschriftung („Lücke nach fragt: leer“). Das Kind tippt eine Lücke an und dann ein Zeichen in der Leiste.
   Tasten: Tab geht durch die Lücken und die Leiste, Pfeil links/rechts springt zur nächsten Lücke,
   in einer Lücke setzen : , . ! ? das Zeichen direkt, Rücktaste nimmt das letzte Zeichen weg. Kein Ziehen.
   Fehler werden an der Stelle markiert (Rahmen gestrichelt und Pfeil darunter), nicht nur über die Farbe. */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};
  const Z = () => WG.zeichen;
  const KURZ = { '„': 'unten', '“': 'oben', ':': 'Doppelpunkt', ',': 'Komma', '.': 'Punkt', '!': 'Ausruf', '?': 'Frage' };
  const WEG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6h11v12H9l-6-6z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/></svg>';

  /* aufbau: aus WG.zeichen.aufbau. nurNoetige: nur die Lücken mit Zeichen sind bedienbar (Stufe leicht). */
  function neu(aufbau, { nurNoetige = false, praefix = 'sz' } = {}) {
    const n = aufbau.woerter.length;
    const aktiv = aufbau.luecken.map(l => !nurNoetige || l.erlaubt.some(e => e.length));
    const s = {
      aufbau, praefix, aktiv,
      eingabe: aufbau.luecken.map(() => []),
      auswahl: aktiv.indexOf(true),
      fehler: new Set(),
      gesperrt: false,
      loesung: false
    };

    const name = i => {
      if (i === 0) return `Lücke vor ${aufbau.woerter[0]}`;
      if (i === n) return `Lücke nach ${aufbau.woerter[n - 1]}`;
      return `Lücke nach ${aufbau.woerter[i - 1]}`;
    };
    s.lueckeHtml = (ctx, i) => {
      if (!aktiv[i]) return i === 0 || i === n ? '' : '<span class="raum" aria-hidden="true"></span>';
      const z = s.eingabe[i];
      const fehler = s.fehler.has(i);
      const label = `${name(i)}: ${Z().benenne(z)}${fehler ? '. Hier stimmt etwas nicht.' : ''}`;
      return `<button type="button" class="luecke${z.length ? ' luecke--voll' : ''}${fehler ? ' luecke--fehler' : ''}${s.loesung ? ' luecke--loesung' : ''}" data-${praefix}="luecke" data-i="${i}" aria-pressed="${s.auswahl === i}" aria-label="${ctx.esc(label)}"${s.gesperrt ? ' disabled' : ''}>${z.map(c => `<span class="luecke__zeichen">${ctx.esc(c)}</span>`).join('')}</button>`;
    };
    /* Je Lücke und folgendes Wort eine Gruppe, die nicht umbricht; die letzte Lücke bleibt beim letzten Wort */
    s.satzHtml = ctx => {
      let h = '';
      for (let i = 0; i < n; i++) {
        h += `<span class="wortgruppe">${s.lueckeHtml(ctx, i)}<span class="wort">${ctx.esc(aufbau.woerter[i])}</span>${i === n - 1 ? s.lueckeHtml(ctx, n) : ''}</span>`;
      }
      return h;
    };
    s.html = ctx => `
      <div class="satz-flaeche" id="${praefix}-flaeche">
        <p class="nurvorlesen" id="${praefix}-text">Satz ohne Zeichen: ${ctx.esc(aufbau.woerter.join(' '))}.</p>
        <div class="satz" id="${praefix}-satz" role="group" aria-label="Satz mit Lücken" aria-describedby="${praefix}-text">${s.satzHtml(ctx)}</div>
        <div class="zeichenleiste" role="group" aria-label="Zeichenleiste">
          ${Z().ZEICHEN.map(c => `<button type="button" class="knopf zeichen-knopf" data-${praefix}="zeichen" data-z="${ctx.esc(c)}" aria-label="${ctx.esc(Z().NAME[c])} setzen"${s.gesperrt ? ' disabled' : ''}><span class="zeichen-knopf__glyph" aria-hidden="true">${ctx.esc(c)}</span><span class="zeichen-knopf__name" aria-hidden="true">${ctx.esc(KURZ[c])}</span></button>`).join('')}
          <button type="button" class="knopf zeichen-knopf zeichen-knopf--weg" data-${praefix}="weg" aria-label="Letztes Zeichen aus der Lücke wegnehmen"${s.gesperrt ? ' disabled' : ''}>${WEG}<span class="zeichen-knopf__name" aria-hidden="true">weg</span></button>
        </div>
      </div>`;

    /* Satz neu zeichnen, Fokus auf der gewählten Lücke halten (falls er im Satz war) */
    s.zeichnen = (ctx, fokusLuecke) => {
      const ort = ctx.app.querySelector(`#${praefix}-satz`);
      if (!ort) return;
      const warImSatz = ort.contains(document.activeElement);
      ort.innerHTML = s.satzHtml(ctx);
      ctx.app.querySelectorAll(`#${praefix}-flaeche .zeichen-knopf`).forEach(b => { b.disabled = s.gesperrt; });
      if ((warImSatz || fokusLuecke) && s.auswahl >= 0) {
        const b = ort.querySelector(`[data-i="${s.auswahl}"]`);
        if (b && !b.disabled) b.focus();
      }
    };

    s.waehle = i => { if (aktiv[i] && !s.gesperrt) s.auswahl = i; };
    s.setze = c => {
      if (s.gesperrt || s.auswahl < 0 || !Z().ZEICHEN.includes(c)) return false;
      const l = s.eingabe[s.auswahl];
      if (l.length >= 4) return false;   /* mehr als vier Zeichen braucht keine Lücke */
      l.push(c);
      s.fehler.delete(s.auswahl);
      return true;
    };
    s.weg = () => {
      if (s.gesperrt || s.auswahl < 0) return false;
      const ok = s.eingabe[s.auswahl].pop() !== undefined;
      s.fehler.delete(s.auswahl);
      return ok;
    };
    s.pruefen = () => {
      const p = Z().pruefe(aufbau, s.eingabe);
      s.fehler = new Set(p.stellen.map(x => x.luecke));
      return p;
    };
    s.loesungZeigen = () => {
      s.eingabe = aufbau.luecken.map(l => l.erlaubt[0].slice());
      s.fehler.clear(); s.gesperrt = true; s.loesung = true;
    };
    s.sperren = () => { s.gesperrt = true; };
    const naechste = (i, schritt) => { for (let k = i + schritt; k >= 0 && k <= n; k += schritt) if (aktiv[k]) return k; return i; };

    /* Klicks: gibt { geaendert, text } zurück oder null */
    s.klick = (ctx, b) => {
      const w = b.dataset[praefix];
      if (w === 'luecke') { s.waehle(Number(b.dataset.i)); s.zeichnen(ctx, true); return { text: b.getAttribute('aria-label') + '. Gewählt.' }; }
      if (w === 'zeichen') {
        if (s.auswahl < 0) return { text: 'Tippe zuerst eine Lücke an.' };
        const ok = s.setze(b.dataset.z);
        s.zeichnen(ctx);
        return { geaendert: ok, text: ok ? `${Z().NAME[b.dataset.z]} gesetzt. ${name(s.auswahl)}: ${Z().benenne(s.eingabe[s.auswahl])}.` : 'In diese Lücke passt kein Zeichen mehr.' };
      }
      if (w === 'weg') { const ok = s.weg(); s.zeichnen(ctx); return { geaendert: ok, text: ok ? `Weggenommen. ${name(s.auswahl)}: ${Z().benenne(s.eingabe[s.auswahl])}.` : 'Die Lücke ist schon leer.' }; }
      return null;
    };
    /* Tasten in einer Lücke */
    s.taste = (ctx, e) => {
      const b = e.target.closest(`[data-${praefix}="luecke"]`);
      if (!b || s.gesperrt) return null;
      const i = Number(b.dataset.i);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        s.auswahl = naechste(i, e.key === 'ArrowRight' ? 1 : -1);
        s.zeichnen(ctx, true); e.preventDefault();
        return { text: name(s.auswahl) + ': ' + Z().benenne(s.eingabe[s.auswahl]) };
      }
      if ([':', ',', '.', '!', '?'].includes(e.key)) {
        s.auswahl = i; const ok = s.setze(e.key); s.zeichnen(ctx, true); e.preventDefault();
        return { geaendert: ok, text: ok ? `${Z().NAME[e.key]} gesetzt.` : 'In diese Lücke passt kein Zeichen mehr.' };
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        s.auswahl = i; const ok = s.weg(); s.zeichnen(ctx, true); e.preventDefault();
        return { geaendert: ok, text: ok ? 'Weggenommen.' : 'Die Lücke ist schon leer.' };
      }
      return null;
    };
    return s;
  }

  WG.satzUi = { neu };
})();
