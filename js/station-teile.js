/* Walgesang: gemeinsame Teile der Stationen. Vorbild: Chancenbucht js/station-teile.js.
   Klassisches Skript, legt window.WG.teile an.
   Enthält nur Darstellung und Bedienhilfen, keine Fachlogik:
   Kopf, Stufenwahl, Rundenende mit Stempel, Dialog (Hilfe, Wörter), Mischen, Fokus, ruhiges Aufleuchten.
   Regeln: echte Knöpfe, Fokus in Dialoge hinein und zurück, keine style-Attribute, Texte durch esc(). */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};
  const C = () => WG.config;
  const ST = () => WG.stand;
  const STUFENNAME = { leicht: 'leicht', mittel: 'mittel', knifflig: 'knifflig' };
  const station = id => C().stationen.find(s => s.id === id);

  const PFEIL = '<button type="button" class="pfeil-knopf" data-aktion="start" aria-label="Zurück zur Startseite"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7"/></svg></button>';

  /* Zufall: crypto, mit Verwerfen statt Modulo. Auf localhost mit ?startwert=N wiederholbar (Tests). */
  const LOKAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const swWert = new URLSearchParams(location.search).get('startwert');
  let sw = LOKAL && swWert !== null && /^\d{1,9}$/.test(swWert) ? Number(swWert) >>> 0 : null;
  function zahl(n) {
    if (sw !== null) { sw = (sw + 0x6D2B79F5) >>> 0; let t = sw; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return (((t ^ (t >>> 14)) >>> 0) / 4294967296 * n) | 0; }
    const grenze = Math.floor(4294967296 / n) * n, a = new Uint32Array(1);
    do { crypto.getRandomValues(a); } while (a[0] >= grenze);
    return a[0] % n;
  }
  function mischen(liste) {
    const l = liste.slice();
    for (let i = l.length - 1; i > 0; i--) { const j = zahl(i + 1); [l[i], l[j]] = [l[j], l[i]]; }
    return l;
  }
  const ziehe = (liste, n) => mischen(liste).slice(0, n);

  /* Kopf einer Station: Zurück, h1, Unterzeile, Wörter, Hilfe. praefix = data-Attribut der Station (ws, vo …) */
  function kopf(ctx, { titel, unterzeile, praefix }) {
    return `<header class="kopf kopf--station">
        <div class="kopf__reihe">
          ${PFEIL}
          <div class="kopf__mitte">
            <h1>${ctx.esc(titel)}</h1>
            ${unterzeile ? `<p class="unterzeile">${ctx.esc(unterzeile).replace(/(Aufgabe \d+ von \d+)/, '<span class="zusammen">$1</span>')}</p>` : ''}
          </div>
          <div class="kopf__werkzeug">
            <button type="button" class="knopf glas-knopf werkzeug-knopf" data-${praefix}="woerter" aria-haspopup="dialog">Wörter</button>
            <button type="button" class="knopf glas-knopf werkzeug-knopf hilfe-knopf" data-${praefix}="hilfe" aria-haspopup="dialog">${ctx.belaKlein}<span>Hilfe</span></button>
          </div>
        </div>
      </header>`;
  }

  /* Aufklapper (So geht's, Am Tisch) */
  function aufklapper(ctx, { klasse, titel, schritte, notiz, offen }) {
    return `
      <details class="papier ${klasse}"${offen ? ' open' : ''}>
        <summary><h2>${ctx.esc(titel)}</h2></summary>
        <ol>${schritte.map(s => `<li>${ctx.esc(s)}</li>`).join('')}</ol>
        ${notiz ? `<p class="leise">${ctx.esc(notiz)}</p>` : ''}
      </details>`;
  }

  /* Stufenwahl: Empfehlung = erste Stufe ohne Stempel */
  const empfohlen = id => C().stufen.find(st => !ST().hatStempel(id, st)) || 'knifflig';
  const erstesMal = id => C().stufen.every(st => !ST().runden(id, st));
  function stufenListe(ctx, id, praefix, beschreibung) {
    const emp = empfohlen(id);
    return `
      <section class="papier" aria-labelledby="h-stufe">
        <h2 id="h-stufe">Wähle eine Stufe</h2>
        <ul class="stufen-liste">
          ${C().stufen.map(st => `
            <li><button type="button" class="knopf stufe-knopf${st === emp ? ' stufe-knopf--empfohlen' : ''}" data-${praefix}="stufe" data-stufe="${st}">
              <span class="stufe-knopf__name">${ctx.esc(STUFENNAME[st])}</span>
              ${beschreibung && beschreibung[st] ? `<span class="stufe-knopf__was">${ctx.esc(beschreibung[st])}</span>` : ''}
              <span class="stufe-knopf__info">${ST().hatStempel(id, st) ? '<span class="stempel-punkt stempel-punkt--voll" aria-hidden="true"></span> Stempel geschafft' : '<span class="stempel-punkt" aria-hidden="true"></span> Noch kein Stempel'}${st === emp ? ' · empfohlen' : ''}</span>
            </button></li>`).join('')}
        </ul>
      </section>`;
  }

  /* Rundenende: Stempel geben (ab stempelAb geschafften), Text, Knöpfe. Gibt { html, text, fehler } zurück. */
  function rundenende(ctx, { id, praefix, stufe, geschafft, anzahl, stempelSvg, gespeichertFehler }) {
    const ab = station(id).stempelAb;
    const hatteSchon = ST().hatStempel(id, stufe);
    let neu = false, fehler = gespeichertFehler;
    if (geschafft >= ab && !hatteSchon) {
      if (!ST().istVorschau && ST().stempelGeben(id, stufe) === false) fehler = true;
      neu = true;
    }
    const naechste = C().stufen[C().stufen.indexOf(stufe) + 1];
    let text;
    if (geschafft >= ab && neu) text = `Runde geschafft. Du bekommst einen Stempel für die Stufe ${STUFENNAME[stufe]}.`;
    else if (geschafft >= ab) text = 'Runde geschafft. Diesen Stempel hast du schon. Jede Runde übt trotzdem.';
    else text = `Du hast ${geschafft} von ${anzahl} geschafft. Für den Stempel brauchst du ${ab}. Probier noch eine Runde, die Sätze sind dann gemischt.`;
    const weiter = naechste && geschafft >= ab;
    const haupt = weiter ? { stufe: naechste, text: `Weiter mit ${STUFENNAME[naechste]}` } : { stufe, text: `Noch eine Runde ${STUFENNAME[stufe]}` };
    const html = `
      <section class="rundenende${geschafft >= ab ? ' rundenende--geschafft' : ''}" aria-labelledby="h-ende">
        <h2 id="h-ende" class="nurvorlesen">Rundenende</h2>
        <div class="stempel-gross${geschafft >= ab || hatteSchon ? ' stempel-gross--voll' : ''}${neu ? ' stempel-gross--neu' : ''}" aria-hidden="true">${stempelSvg}</div>
        <div class="rundenende__satz">${ctx.belaKlein}<p class="rundenende__text">${ctx.esc(text)}</p></div>
        <p class="knopfreihe knopfreihe--mitte">
          <button type="button" class="knopf haupt rundenende__haupt" data-${praefix}="stufe" data-stufe="${haupt.stufe}">${ctx.esc(haupt.text)}</button>
        </p>
        <p class="knopfreihe knopfreihe--mitte rundenende__weitere">
          ${weiter ? `<button type="button" class="knopf knopf--klein" data-${praefix}="stufe" data-stufe="${stufe}">Noch eine Runde ${ctx.esc(STUFENNAME[stufe])}</button>` : ''}
          <button type="button" class="knopf knopf--klein" data-${praefix}="stufen">Andere Stufe</button>
          <button type="button" class="knopf knopf--klein" data-aktion="start">Zur Startseite</button>
        </p>
      </section>`;
    return { html, text, fehler };
  }
  /* Stempelrahmen (Doppelkreis) um ein eigenes Motiv. Motive nur aus circle, rect, path, ellipse mit den Klassen
     stempel__welle (Linie) und stempel__kugel (Fläche), damit js/urkunde.js sie nachzeichnen kann. */
  const stempel = motiv => `<svg class="stempel-bild" viewBox="0 0 100 100" focusable="false"><circle class="stempel__rand" cx="50" cy="50" r="44"/><circle class="stempel__rand stempel__rand--innen" cx="50" cy="50" r="36"/>${motiv}</svg>`;

  /* ---------- Dialog (ein gemeinsamer <dialog>) ---------- */
  let opener = null, beiTipp = null;
  function dialog(ctx, { titel, inhalt, knoepfe, tipp }) {
    let d = document.getElementById('station-dialog');
    if (!d) {
      d = document.createElement('dialog');
      d.id = 'station-dialog';
      d.className = 'dialog';
      d.setAttribute('aria-labelledby', 'station-dialog-titel');
      document.body.appendChild(d);
      d.addEventListener('close', () => { if (opener && document.contains(opener)) opener.focus(); opener = null; });
      d.addEventListener('click', e => {
        const b = e.target.closest('[data-dialog]');
        if (!b) return;
        if (b.dataset.dialog === 'zu') d.close();
        if (b.dataset.dialog === 'tipp' && beiTipp) beiTipp();
      });
    }
    beiTipp = tipp || null;
    d.innerHTML = `<h2 id="station-dialog-titel">${ctx.esc(titel)}</h2>${inhalt}<p class="knopfreihe">${knoepfe}</p>`;
    if (!d.open) { opener = document.activeElement; d.showModal(); }
    const erster = d.querySelector('[data-dialog="tipp"]:not([disabled]), [data-dialog="zu"]');
    if (erster) erster.focus();
    return d;
  }
  /* Gestufte Tipps. liste: alle Tipps, bis: Index des letzten gezeigten, erlaubt: wie viele gerade erlaubt sind */
  function tippDialog(ctx, { liste, bis, erlaubt, fertig, weiter }) {
    const zu = '<button type="button" class="knopf haupt" data-dialog="zu">Ich probiere es</button>';
    if (fertig) return dialog(ctx, { titel: 'Tipp von Bela', inhalt: `<div class="tipp">${ctx.belaKlein}<p>Du hast es schon geschafft. Tippe auf Weiter.</p></div>`, knoepfe: zu });
    const mehr = bis < erlaubt - 1;
    const wartet = !mehr && erlaubt < liste.length;
    return dialog(ctx, {
      titel: 'Tipp von Bela',
      inhalt: `<div class="tipp">${ctx.belaKlein}<ol class="tipp-liste">${liste.slice(0, bis + 1).map(t => `<li>${ctx.esc(t)}</li>`).join('')}</ol></div>${wartet ? '<p class="leise">Probier es einmal. Danach habe ich noch einen Tipp.</p>' : ''}`,
      knoepfe: `${mehr ? '<button type="button" class="knopf" data-dialog="tipp">Noch ein Tipp</button>' : ''}${zu}`,
      tipp: weiter
    });
  }
  /* Wörter-Dialog: die Fachwörter mit Beispiel. Erst probieren, dann das Fachwort: Der Dialog ist da, wird aber nie aufgedrängt. */
  function woerter(ctx) {
    const Z = WG.zeichen;
    const beispiel = `<p class="wortspeicher__beispiel" aria-label="Beispiel: Lina sagt, Doppelpunkt, Redezeichen unten, Ich habe Hunger, Punkt, Redezeichen oben."><span class="teil-begleit">Lina sagt</span>: <span class="teil-rede">${Z.UNTEN}Ich habe Hunger.${Z.OBEN}</span></p>`;
    return dialog(ctx, {
      titel: 'Wörter zur wörtlichen Rede',
      inhalt: `
      <div class="wortspeicher">
        ${beispiel}
        <table class="wortspeicher__tabelle">
          <tbody>
            ${WG.daten.woerter.map(([w, b]) => `<tr><th scope="row">${ctx.esc(w)}</th><td>${ctx.esc(b)}</td></tr>`).join('')}
          </tbody>
        </table>
        <p class="leise">Unterstrichen: der Begleitsatz. Im Kasten: die wörtliche Rede.</p>
      </div>`,
      knoepfe: '<button type="button" class="knopf haupt" data-dialog="zu">Schließen</button>'
    });
  }

  function fokus(ctx, sel) {
    const el = ctx.app.querySelector(sel);
    if (el && !el.disabled) el.focus({ preventScroll: false });
  }

  /* Ruhiges Aufleuchten nach einer richtigen Antwort: nur transform, kurz, nie bei reduzierter Bewegung */
  function leuchten(el) {
    const ruhig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (el && !ruhig && typeof el.animate === 'function') {
      el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' });
    }
  }

  /* Der fertige Satz mit sichtbaren Teilen (Begleitsatz unterstrichen, Rede im Kasten). Für „So heißt das“.
     eingabe (frei): eigene Zeichen je Lücke, sonst die richtigen. */
  function satzMitTeilen(ctx, a, eingabe) {
    const Z = WG.zeichen;
    const z = eingabe || a.luecken.map(l => l.erlaubt[0]);
    const seg = [];
    for (let i = 0; i <= a.woerter.length; i++) {
      for (const c of z[i] || []) {
        const rede = c === Z.UNTEN || c === Z.OBEN || (['.', '!', '?'].includes(c) && a.luecken[i].rolle !== 'satzEnde');
        seg.push({ t: c, teil: rede ? 'rede' : 'neutral', wort: false });
      }
      if (i < a.woerter.length) seg.push({ t: a.woerter[i], teil: a.teile[i] === 'begleit' ? 'begleit' : 'rede', wort: true });
    }
    seg.forEach((s, k) => {
      const v = seg[k - 1];
      s.raum = !!v && ((s.wort && v.t !== Z.UNTEN) || (s.t === Z.UNTEN && (v.t === ':' || v.t === ',')));
    });
    let html = '', offen = null;
    for (const s of seg) {
      const teil = s.teil === 'neutral' ? null : s.teil;
      if (teil !== offen && !(teil === null && offen)) {
        if (offen) html += '</span>';
        if (s.raum) html += ' ';
        offen = teil;
        if (teil) html += `<span class="teil-${teil}">`;
      } else if (s.raum) html += ' ';
      if (teil === null && offen && !s.raum) { html += '</span>'; offen = null; }
      html += ctx.esc(s.t);
    }
    if (offen) html += '</span>';
    return `<p class="satz-teile" aria-label="${ctx.esc(Z.text(a, eingabe))}">${html}</p>`;
  }

  WG.teile = { PFEIL, STUFENNAME, zahl, mischen, ziehe, kopf, aufklapper, empfohlen, erstesMal, stufenListe, rundenende, stempel, dialog, tippDialog, woerter, fokus, leuchten, satzMitTeilen, station };
})();
