/* Walgesang: Station „Kann das stimmen?“. Bela behauptet etwas über die wörtliche Rede, das Kind prüft.
   Klassisches Skript, trägt sich in WG.stationen.stimmt ein.
   Ablauf: Behauptung und Beispielsatz, Antwort „Das stimmt.“ / „Das stimmt nicht.“ (zwei Versuche), dann Belas Schluss.
   leicht: Regeln zum Begleitsatz vorne. mittel: Regeln zum Begleitsatz hinten.
   knifflig: „Dieser Satz ist richtig geschrieben.“ mit richtigen und absichtlich falschen Beispielsätzen.
   Geschafft: richtig im ersten Versuch (bei zwei Antworten ist der zweite Versuch geraten). */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};
  WG.stationen = WG.stationen || {};
  const ID = 'stimmt', P = 'st';
  const T = () => WG.teile, ST = () => WG.stand, Z = () => WG.zeichen;

  let ctx = null, z = null, hilfeStufe = 0;
  const esc = s => ctx.esc(s);
  const kopf = u => T().kopf(ctx, { titel: 'Kann das stimmen?', unterzeile: u, praefix: P });
  const stempelSvg = () => T().stempel('<path class="stempel__welle" d="M57 47l14 14"/><circle class="stempel__welle" cx="44" cy="40" r="15"/><path class="stempel__welle" d="M39 32a5 5 0 1 1 7.5 4.3c-1.7.9-2.5 2.2-2.5 3.9"/><circle class="stempel__kugel" cx="44" cy="46" r="1.9"/>');
  const STUFEN = { leicht: 'Regeln zum Begleitsatz vorne.', mittel: 'Regeln zum Begleitsatz hinten.', knifflig: 'Ist der Satz richtig geschrieben?' };
  const soGehts = offen => T().aufklapper(ctx, { klasse: 'so-gehts', titel: "So geht's", offen, schritte: ['Lies, was Bela sagt.', 'Schau dir den Beispielsatz genau an.', 'Entscheide: Stimmt das?'] });
  const amTisch = offen => T().aufklapper(ctx, { klasse: 'am-tisch', titel: 'Am Tisch: Bela prüfen', offen, notiz: 'Material: Satzstreifen, Stift, zwei Kärtchen „stimmt“ und „stimmt nicht“.', schritte: [
    'Schreibt einen Satz mit wörtlicher Rede auf einen Streifen. Baut absichtlich einen Fehler ein oder nicht.',
    'Tauscht die Streifen. Das andere Kind hebt „stimmt“ oder „stimmt nicht“ hoch.',
    'Zeigt die Stelle mit dem Fehler und verbessert sie.'] });

  function ansichtStufen() {
    z = null;
    const erst = T().erstesMal(ID);
    ctx.zeigen(`
      ${kopf('Bela prüfen')}
      ${erst ? '<p class="bela-satz">Ich sage manchmal etwas über die wörtliche Rede. Manches stimmt, manches nicht. Prüf mich!</p>' : ''}
      ${soGehts(erst)}
      ${T().stufenListe(ctx, ID, P, STUFEN)}
      ${amTisch(false)}`, 'Kann das stimmen?');
  }
  const satzVon = id => [...WG.daten.saetze.leicht, ...WG.daten.saetze.mittel, ...WG.daten.saetze.knifflig].find(d => d.id === id);
  function beispielHtml(b) {
    if (b.beispiel.text) return `<p class="satz-gross beispiel-satz">${esc(b.beispiel.text)}</p>`;
    const a = Z().aufbau(satzVon(b.beispiel.satz), b.beispiel.stellung);
    return /richtig geschrieben/.test(b.behauptung) ? `<p class="satz-gross beispiel-satz">${esc(Z().text(a))}</p>` : T().satzMitTeilen(ctx, a).replace('class="satz-teile"', 'class="satz-teile satz-gross beispiel-satz"');
  }
  function rundeStarten(stufe) {
    z = { stufe, aufgaben: T().ziehe(WG.daten.behauptungen[stufe], T().station(ID).runde), i: 0, geschafft: [], gespeichertFehler: false };
    aufgabeZeigen();
  }
  function aufgabeZeigen() {
    hilfeStufe = 0;
    Object.assign(z, { b: z.aufgaben[z.i], versuche: 0, fertig: false, rueck: '', loesung: false });
    ctx.zeigen(`
      ${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Aufgabe ${z.i + 1} von ${z.aufgaben.length}`)}
      <section class="papier aufgabe aufgabe--schmal" id="${P}-aufgabe" aria-labelledby="${P}-frage"></section>`, `Aufgabe ${z.i + 1} – Kann das stimmen?`);
    panel();
  }
  function panel() {
    const b = z.b, ort = ctx.app.querySelector(`#${P}-aufgabe`);
    const weiter = `<button type="button" class="knopf haupt" data-${P}="weiter">${z.i + 1 < z.aufgaben.length ? 'Weiter' : 'Zum Rundenende'}</button>`;
    const loes = b.stimmt ? 'ja' : 'nein';
    ort.innerHTML = `
      <div class="bela-aussage">${ctx.belaKlein}<div><p class="nurvorlesen">Bela sagt:</p><p class="aussage" id="${P}-frage">„${esc(b.behauptung)}“</p></div></div>
      <h2 class="frage-klein">Beispiel</h2>
      ${beispielHtml(b)}
      <h2 class="frage-klein">Kann das stimmen?</h2>
      <div class="antworten antworten--zwei" role="group" aria-label="Antworten">
        ${[['ja', 'Das stimmt.'], ['nein', 'Das stimmt nicht.']].map(([id, t]) => `<button type="button" class="knopf antwort-knopf${z.fertig && id === loes ? ' ist-richtig' : ''}" data-${P}="antwort" data-id="${id}"${z.fertig ? ' disabled' : ''}>${t}</button>`).join('')}
      </div>
      <p class="rueckmeldung" role="status">${esc(z.rueck)}</p>
      ${z.fertig ? `<div class="tipp tipp--schluss${z.loesung ? ' fachwort--loesung' : ''}">${ctx.belaKlein}<p>${esc(b.erklaerung)}</p></div><p class="knopfreihe">${weiter}</p>` : ''}`;
    ort.classList.toggle('loesung-gezeigt', z.loesung);
  }
  function antwort(id) {
    if (z.fertig) return;
    const b = z.b, loes = b.stimmt ? 'ja' : 'nein';
    z.versuche++;
    if (id === loes) {
      z.fertig = true; z.rueck = 'Gut geprüft.';
      if (z.versuche === 1 && !z.geschafft[z.i]) { z.geschafft[z.i] = true; if (!ST().istVorschau && ST().rundeGeschafft(ID, z.stufe) === false) z.gespeichertFehler = true; }
    } else if (z.versuche >= 2) { z.fertig = true; z.loesung = true; z.rueck = 'Hier ist die Lösung: ' + (b.stimmt ? 'Das stimmt.' : 'Das stimmt nicht.'); }
    else z.rueck = 'Schau dir den Beispielsatz noch einmal genau an. Zeig mit dem Finger auf jedes Zeichen.';
    panel(); ctx.ansagen(z.rueck + (z.fertig ? ' ' + b.erklaerung : ''));
    if (z.fertig) T().leuchten(ctx.app.querySelector(`#${P}-aufgabe .tipp--schluss`));
    T().fokus(ctx, z.fertig ? `[data-${P}="weiter"]` : `[data-${P}="antwort"]`);
  }
  function weiter() {
    if (z.i + 1 < z.aufgaben.length) { z.i++; aufgabeZeigen(); return; }
    const r = T().rundenende(ctx, { id: ID, praefix: P, stufe: z.stufe, geschafft: z.geschafft.filter(Boolean).length, anzahl: z.aufgaben.length, stempelSvg: stempelSvg(), gespeichertFehler: z.gespeichertFehler });
    ctx.zeigen(`${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Rundenende`)}${r.html}${amTisch(false)}`, 'Rundenende – Kann das stimmen?');
    ctx.ansagen(r.text);
    if (r.fehler) ctx.melden(ctx.speicherFehlt);
  }
  function hilfe() {
    if (!z) {
      T().dialog(ctx, { titel: 'Tipp von Bela', inhalt: `<div class="tipp">${ctx.belaKlein}<p>Wähle eine Stufe. Ich empfehle dir die Stufe mit dem Wort „empfohlen“.</p></div>`, knoepfe: '<button type="button" class="knopf haupt" data-dialog="zu">Ich probiere es</button>' });
      return;
    }
    const liste = ['Schau auf den Beispielsatz. Wo steht der Begleitsatz, vorne oder hinten?', 'Zeig auf jedes Zeichen: Doppelpunkt, Komma, Redezeichen, Schlusszeichen. Steht jedes an seinem Platz?', 'Im Wörter-Knopf oben stehen die Regeln.'];
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
    else if (w === 'antwort') antwort(b.dataset.id);
    else if (w === 'weiter') weiter();
    else return false;
    return true;
  }
  WG.stationen[ID] = { id: ID, stempelSvg, oeffnen(c) { ctx = c; ansichtStufen(); }, bedienen, zustand: () => z };
})();
