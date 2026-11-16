/* Walgesang: Station „Wer spricht?“ (Begleitsatz und wörtliche Rede finden).
   Klassisches Skript, trägt sich in WG.stationen.wer ein.
   leicht:   Satz mit Begleitsatz vorne. Zwei Fragen: Wer spricht? Was wird gesagt? (je drei Antworten)
   mittel:   Satz vorne oder hinten. Das Kind tippt alle Wörter der wörtlichen Rede an.
   knifflig: schwerere Sätze vorne oder hinten. Das Kind tippt die Wörter der Rede und die beiden Redezeichen an.
             Das Schlusszeichen in der Rede darf, muss aber nicht dabei sein.
   Erst probieren, dann das Fachwort: Begleitsatz, wörtliche Rede, Redezeichen erscheinen erst nach der Lösung.
   Geschafft: richtig im ersten oder zweiten Versuch. Gespeichert werden nur runden und stempel. */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};
  WG.stationen = WG.stationen || {};
  const ID = 'wer', P = 'ws';
  const T = () => WG.teile, ST = () => WG.stand, Z = () => WG.zeichen;

  let ctx = null, z = null, hilfeStufe = 0;
  const esc = s => ctx.esc(s);
  const kopf = u => T().kopf(ctx, { titel: 'Wer spricht?', unterzeile: u, praefix: P });
  const stempelSvg = () => T().stempel('<path class="stempel__welle" d="M30 36 h40 a6 6 0 0 1 6 6 v14 a6 6 0 0 1 -6 6 h-22 l-10 9 v-9 h-8 a6 6 0 0 1 -6 -6 v-14 a6 6 0 0 1 6 -6z"/><circle class="stempel__kugel" cx="40" cy="49" r="2.6"/><circle class="stempel__kugel" cx="50" cy="49" r="2.6"/><circle class="stempel__kugel" cx="60" cy="49" r="2.6"/>');
  const STUFEN = { leicht: 'Wer spricht? Was wird gesagt?', mittel: 'Tippe die wörtliche Rede an.', knifflig: 'Rede und Redezeichen antippen.' };
  const soGehts = offen => T().aufklapper(ctx, { klasse: 'so-gehts', titel: "So geht's", offen, schritte: ['Lies den Satz.', 'Finde heraus, wer spricht und was gesagt wird.', 'Tippe die Antwort oder die Wörter an. Tippe dann auf Prüfen.'] });
  const amTisch = offen => T().aufklapper(ctx, { klasse: 'am-tisch', titel: 'Am Tisch', offen, notiz: 'Material: Comicseite ohne Text (selbst gemalt), Buntstifte, Heft.', schritte: [
    'Malt zu zweit einen Comic mit drei Bildern. Lasst die Sprechblasen leer.',
    'Schreibt in jede Sprechblase, was die Figur sagt.',
    'Schreibt das Gespräch ins Heft. Unterstreicht den Begleitsatz und malt einen Kasten um die wörtliche Rede.',
    'Lest das Gespräch mit verteilten Rollen vor.'] });

  const nameGross = w => w.charAt(0).toUpperCase() + w.slice(1);
  const wer = d => d.sprecher ? (d.sprecher === 'ich' ? 'Ich' : nameGross(d.sprecher)) : null;

  function ansichtStufen() {
    z = null;
    const erst = T().erstesMal(ID);
    ctx.zeigen(`
      ${kopf('Begleitsatz und Rede finden')}
      ${erst ? '<p class="bela-satz">Ich bin Bela. Wale singen und sprechen mit Lauten. Menschen schreiben auf, was sie sagen. Kannst du herausfinden, wer spricht?</p>' : ''}
      ${soGehts(erst)}
      ${T().stufenListe(ctx, ID, P, STUFEN)}
      ${amTisch(false)}`, 'Wer spricht?');
  }

  function rundeStarten(stufe) {
    const n = T().station(ID).runde;
    let pool = WG.daten.saetze[stufe];
    if (stufe === 'leicht') pool = pool.filter(d => d.sprecher);
    const saetze = T().ziehe(pool, n).map(d => ({ d, stellung: stufe === 'leicht' ? 'vorne' : (T().zahl(2) ? 'hinten' : 'vorne') }));
    z = { stufe, saetze, i: 0, geschafft: [], gespeichertFehler: false };
    aufgabeZeigen();
  }
  /* Knöpfe für die leichte Stufe: richtiger Sprecher und zwei andere aus der Stufe; Rede, Begleitsatz und eine fremde Rede */
  function antwortenLeicht(d, a) {
    const andere = T().mischen(WG.daten.saetze.leicht.filter(x => x.sprecher && x.sprecher !== d.sprecher));
    const namen = T().mischen([wer(d), wer(andere[0]), wer(andere.find(x => wer(x) !== wer(andere[0])))]);
    const redeText = `${d.rede}${Z().schlussVon(d)[0]}`;
    const fremd = andere.find(x => x.rede !== d.rede);
    const reden = T().mischen([
      { id: 'rede', text: redeText },
      { id: 'begleit', text: Z().begleitVorne(d) },
      { id: 'fremd', text: `${fremd.rede}${Z().schlussVon(fremd)[0]}` }
    ]);
    return { namen, reden };
  }
  /* Kacheln für mittel und knifflig: Wörter und (knifflig) Zeichen als Knöpfe */
  function kacheln(a, mitZeichen) {
    const zeichen = a.luecken.map(l => l.erlaubt[0]);
    const k = [];
    for (let i = 0; i <= a.woerter.length; i++) {
      for (const c of zeichen[i]) {
        const rolle = a.luecken[i].rolle;
        const rede = c === Z().UNTEN || c === Z().OBEN;
        const schlussRede = ['.', '!', '?'].includes(c) && rolle !== 'satzEnde';
        k.push({ text: c, zeichen: true, soll: rede ? 'ja' : schlussRede ? 'egal' : 'nein', tippbar: mitZeichen });
      }
      if (i < a.woerter.length) k.push({ text: a.woerter[i], zeichen: false, soll: a.teile[i] === 'begleit' ? 'nein' : 'ja', tippbar: true });
    }
    return k;
  }

  function aufgabeZeigen() {
    hilfeStufe = 0;
    const { d, stellung } = z.saetze[z.i];
    const a = Z().aufbau(d, stellung);
    Object.assign(z, { a, d, versuche: 0, ok: 0, fertig: false, rueck: '', loesung: false, schritt: 'wer', gewaehlt: new Set(), markiert: null });
    if (z.stufe === 'leicht') Object.assign(z, antwortenLeicht(d, a));
    else z.kacheln = kacheln(a, z.stufe === 'knifflig');
    ctx.zeigen(`
      ${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Aufgabe ${z.i + 1} von ${z.saetze.length}`)}
      <section class="papier aufgabe aufgabe--schmal" id="${P}-aufgabe" aria-labelledby="${P}-auftrag"></section>`, `Aufgabe ${z.i + 1} – Wer spricht?`);
    panel();
  }

  function panel() {
    const ort = ctx.app.querySelector(`#${P}-aufgabe`);
    const weiter = `<button type="button" class="knopf haupt" data-${P}="weiter">${z.i + 1 < z.saetze.length ? 'Weiter' : 'Zum Rundenende'}</button>`;
    let h = '';
    if (z.stufe === 'leicht') {
      h += `<p class="satz-gross" id="${P}-satz">${esc(Z().text(z.a))}</p>`;
      const frage = (titel, art, liste, richtig, offen) => `
        <h2 class="frage-klein" id="${P}-auftrag-${art}">${titel}</h2>
        <div class="antworten" role="group" aria-labelledby="${P}-auftrag-${art}">
          ${liste.map(x => `<button type="button" class="knopf antwort-knopf${!offen && x === richtig ? ' ist-richtig' : ''}" data-${P}="${art}" data-wert="${esc(x)}"${offen ? '' : ' disabled'}>${esc(x)}</button>`).join('')}
        </div>`;
      h += `<p class="auftrag nurvorlesen" id="${P}-auftrag">Zwei Fragen zum Satz.</p>`;
      h += frage('Wer spricht?', 'wer', z.namen, wer(z.d), z.schritt === 'wer');
      if (z.schritt !== 'wer') h += frage('Was wird gesagt?', 'was', z.reden.map(r => r.text), z.reden.find(r => r.id === 'rede').text, z.schritt === 'was');
    } else {
      h += `<p class="auftrag" id="${P}-auftrag">${z.stufe === 'knifflig' ? 'Tippe die wörtliche Rede und die beiden Redezeichen an.' : 'Tippe alle Wörter der wörtlichen Rede an.'}</p>`;
      h += `<div class="kachel-satz" role="group" aria-label="Satz zum Antippen">${z.kacheln.map((k, i) => k.tippbar
        ? `<button type="button" class="kachel${k.zeichen ? ' kachel--zeichen' : ''}${z.gewaehlt.has(i) ? ' kachel--an' : ''}${z.markiert && z.markiert.has(i) ? ' kachel--fehler' : ''}" data-${P}="kachel" data-i="${i}" aria-pressed="${z.gewaehlt.has(i)}"${z.fertig ? ' disabled' : ''} aria-label="${esc(k.zeichen ? Z().NAME[k.text] : k.text)}">${esc(k.text)}</button>`
        : `<span class="kachel kachel--fest${k.zeichen ? ' kachel--zeichen' : ''}">${esc(k.text)}</span>`).join('')}</div>`;
      if (!z.fertig) h += `<p class="knopfreihe"><button type="button" class="knopf haupt" data-${P}="pruefen">Prüfen</button>${z.versuche >= 2 ? `<button type="button" class="knopf" data-${P}="loesung">Lösung zeigen</button>` : ''}</p>`;
    }
    h += `<p class="rueckmeldung" role="status">${esc(z.rueck)}</p>`;
    if (z.fertig) h += `
      <div class="fachwort${z.loesung ? ' fachwort--loesung' : ''}">
        <h2 class="frage-klein">So heißt das</h2>
        ${T().satzMitTeilen(ctx, z.a)}
        <ul class="fachwort__liste">
          <li><b>Begleitsatz</b> (unterstrichen): ${esc(z.a.woerter.filter((w, i) => z.a.teile[i] === 'begleit').join(' '))}. Er sagt, wer spricht.</li>
          <li><b>Wörtliche Rede</b> (im Kasten): das, was gesagt wird.</li>
          <li><b>Redezeichen</b>: ${esc(Z().UNTEN)} am Anfang unten, ${esc(Z().OBEN)} am Ende oben.</li>
        </ul>
      </div>
      <p class="knopfreihe">${weiter}</p>`;
    ort.innerHTML = h;
  }

  function zaehlen() {
    if (z.geschafft[z.i]) return;
    z.geschafft[z.i] = true;
    if (!ST().istVorschau && ST().rundeGeschafft(ID, z.stufe) === false) z.gespeichertFehler = true;
  }
  /* leicht: Antwortknopf */
  function antwortLeicht(art, wert) {
    if (z.fertig || art !== z.schritt) return;
    z.versuche++;
    const richtig = art === 'wer' ? wer(z.d) : z.reden.find(r => r.id === 'rede').text;
    if (wert === richtig) {
      z.rueck = art === 'wer' ? `Genau. ${richtig} spricht.` : 'Genau. Das wird gesagt.';
      z.ok = (z.ok || 0) + (z.versuche <= 2 ? 1 : 0);
      if (art === 'wer') { z.schritt = 'was'; z.versuche = 0; }
      else { z.schritt = 'ende'; z.fertig = true; if (z.ok === 2) zaehlen(); }
    } else if (z.versuche >= 2) {
      z.rueck = art === 'wer' ? `Hier ist die Lösung: ${richtig} spricht.` : `Hier ist die Lösung: ${richtig}`;
      if (art === 'wer') { z.schritt = 'was'; z.versuche = 0; } else { z.schritt = 'ende'; z.fertig = true; z.loesung = true; }
    } else {
      const r = art === 'was' && z.reden.find(x => x.text === wert);
      z.rueck = art === 'wer' ? 'Schau auf den Teil ohne Redezeichen. Dort steht, wer spricht.'
        : r && r.id === 'begleit' ? 'Das ist der Teil, der sagt, wer spricht. Was steht in den Redezeichen?' : 'Das steht nicht in diesem Satz. Schau in die Redezeichen.';
    }
    panel();
    ctx.ansagen(z.rueck);
    T().fokus(ctx, z.fertig ? `[data-${P}="weiter"]` : `[data-${P}="${z.schritt}"]:not([disabled])`);
  }
  /* mittel und knifflig: Kacheln prüfen */
  function pruefen() {
    if (z.fertig) return;
    z.versuche++;
    const falschAn = [], fehlt = [];
    z.kacheln.forEach((k, i) => {
      if (!k.tippbar) return;
      if (k.soll === 'ja' && !z.gewaehlt.has(i)) fehlt.push(i);
      if (k.soll === 'nein' && z.gewaehlt.has(i)) falschAn.push(i);
    });
    z.markiert = new Set([...falschAn, ...fehlt]);
    if (!falschAn.length && !fehlt.length) {
      z.fertig = true; z.markiert = null; z.rueck = 'Genau. Das ist die wörtliche Rede.'; zaehlen();
    } else {
      const zeichenFehlt = fehlt.some(i => z.kacheln[i].zeichen);
      const wortFehlt = fehlt.some(i => !z.kacheln[i].zeichen);
      const begleitAn = falschAn.some(i => !z.kacheln[i].zeichen);
      z.rueck = begleitAn ? 'Du hast auch Wörter angetippt, die sagen, wer spricht. Die gehören nicht zur Rede.'
        : wortFehlt ? 'Es fehlen noch Wörter. Alles zwischen den Redezeichen gehört zur Rede.'
        : zeichenFehlt ? 'Die Wörter stimmen. Tippe auch die beiden Redezeichen an.'
        : 'Doppelpunkt, Komma und der Punkt am Satzende gehören nicht zur Rede.';
      z.rueck += ' Die Stellen sind markiert.';
    }
    panel();
    ctx.ansagen(z.rueck);
    if (z.fertig) { T().leuchten(ctx.app.querySelector('.kachel-satz')); T().fokus(ctx, `[data-${P}="weiter"]`); }
  }
  function loesung() {
    z.gewaehlt = new Set(z.kacheln.map((k, i) => (k.tippbar && k.soll === 'ja' ? i : -1)).filter(i => i >= 0));
    z.fertig = true; z.loesung = true; z.markiert = null; z.rueck = 'Hier ist die Lösung. Die wörtliche Rede ist angetippt.';
    panel(); ctx.ansagen(z.rueck); T().fokus(ctx, `[data-${P}="weiter"]`);
  }
  function weiter() {
    if (z.i + 1 < z.saetze.length) { z.i++; aufgabeZeigen(); return; }
    const r = T().rundenende(ctx, { id: ID, praefix: P, stufe: z.stufe, geschafft: z.geschafft.filter(Boolean).length, anzahl: z.saetze.length, stempelSvg: stempelSvg(), gespeichertFehler: z.gespeichertFehler });
    ctx.zeigen(`${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Rundenende`)}${r.html}${amTisch(false)}`, 'Rundenende – Wer spricht?');
    ctx.ansagen(r.text);
    if (r.fehler) ctx.melden(ctx.speicherFehlt);
  }
  function hilfe() {
    if (!z) {
      T().dialog(ctx, { titel: 'Tipp von Bela', inhalt: `<div class="tipp">${ctx.belaKlein}<p>Wähle eine Stufe. Ich empfehle dir die Stufe mit dem Wort „empfohlen“.</p></div>`, knoepfe: '<button type="button" class="knopf haupt" data-dialog="zu">Ich probiere es</button>' });
      return;
    }
    const liste = ['Suche die Redezeichen. Was dazwischen steht, wird gesagt.', 'Der andere Teil sagt, wer spricht. Dort steht oft ein Name und ein Wort wie sagt, fragt oder ruft.', 'Lies den Satz laut, als ob du die Person bist. Was sagst du?'];
    const erlaubt = z.versuche ? 3 : 2;
    T().tippDialog(ctx, { liste, bis: Math.min(hilfeStufe, erlaubt - 1), erlaubt, fertig: z.fertig, weiter: () => { hilfeStufe++; hilfe(); } });
  }

  function bedienen(e) {
    const b = e.target.closest(`[data-${P}]`);
    if (!b || b.disabled) return false;
    const w = b.dataset[P];
    if (w === 'stufe') rundeStarten(b.dataset.stufe);
    else if (w === 'stufen') ansichtStufen();
    else if (w === 'hilfe') hilfe();
    else if (w === 'woerter') T().woerter(ctx);
    else if (w === 'wer' || w === 'was') antwortLeicht(w, b.dataset.wert);
    else if (w === 'kachel') {
      const i = Number(b.dataset.i);
      if (z.gewaehlt.has(i)) z.gewaehlt.delete(i); else z.gewaehlt.add(i);
      if (z.markiert) z.markiert.delete(i);
      b.setAttribute('aria-pressed', String(z.gewaehlt.has(i)));
      b.classList.toggle('kachel--an', z.gewaehlt.has(i));
      b.classList.remove('kachel--fehler');
    }
    else if (w === 'pruefen') pruefen();
    else if (w === 'loesung') loesung();
    else if (w === 'weiter') weiter();
    else return false;
    return true;
  }

  WG.stationen[ID] = { id: ID, stempelSvg, oeffnen(c) { ctx = c; ansichtStufen(); }, bedienen, zustand: () => z };
})();
