/* Walgesang: Station „Wie wird gesprochen?“ (Wortfeld „sagen“, passende Verben im Begleitsatz).
   Klassisches Skript, trägt sich in WG.stationen.verben ein.
   Der Satz steht mit allen Zeichen da, im Begleitsatz fehlt das Verb (eine Lücke).
   leicht: drei Verben, eins passt. mittel: vier Verben, eins passt (feinere Unterschiede).
   knifflig: vier Verben, zwei passen, das Kind wählt beide.
   Geschafft: richtig im ersten oder zweiten Versuch. Am Ende jeder Aufgabe wächst die Sammlung „Wörter für sagen“
   (nur für diese Runde, nicht gespeichert). */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};
  WG.stationen = WG.stationen || {};
  const ID = 'verben', P = 've';
  const T = () => WG.teile, ST = () => WG.stand, Z = () => WG.zeichen;

  let ctx = null, z = null, hilfeStufe = 0;
  const esc = s => ctx.esc(s);
  const kopf = u => T().kopf(ctx, { titel: 'Wie wird gesprochen?', unterzeile: u, praefix: P });
  const stempelSvg = () => T().stempel('<path class="stempel__welle" d="M30 58 c6 -14 12 -14 18 0 s12 14 18 0"/><path class="stempel__welle" d="M34 44 c4 -8 8 -8 12 0 s8 8 12 0"/><circle class="stempel__kugel" cx="68" cy="40" r="3"/>');
  const STUFEN = { leicht: 'Drei Verben, eins passt.', mittel: 'Vier Verben, eins passt.', knifflig: 'Vier Verben, zwei passen.' };
  const soGehts = offen => T().aufklapper(ctx, { klasse: 'so-gehts', titel: "So geht's", offen, schritte: ['Lies, was gesagt wird.', 'Überlege: Wie sagt die Person das? Laut, leise, fragend, traurig?', 'Tippe das passende Verb an.'] });
  const amTisch = offen => T().aufklapper(ctx, { klasse: 'am-tisch', titel: 'Am Tisch', offen, notiz: 'Material: Kärtchen, Stift.', schritte: [
    'Schreibt Verben für „sagen“ auf Kärtchen: flüstern, rufen, fragen, jammern, erklären …',
    'Ein Kind zieht ein Kärtchen und sagt einen Satz genau so, wie das Verb es sagt.',
    'Die anderen raten das Verb.',
    'Schreibt den Satz mit Begleitsatz auf.'] });

  function ansichtStufen() {
    z = null;
    const erst = T().erstesMal(ID);
    ctx.zeigen(`
      ${kopf('Das passende Verb')}
      ${erst ? '<p class="bela-satz">Ich kann summen, singen und rufen. Menschen können flüstern, rufen oder jammern. Welches Wort passt?</p>' : ''}
      ${soGehts(erst)}
      ${T().stufenListe(ctx, ID, P, STUFEN)}
      ${amTisch(false)}`, 'Wie wird gesprochen?');
  }

  function rundeStarten(stufe) {
    z = { stufe, aufgaben: T().ziehe(WG.daten.verben[stufe], T().station(ID).runde), i: 0, geschafft: [], gespeichertFehler: false, gesammelt: [] };
    aufgabeZeigen();
  }
  /* Satz mit Verblücke: vorne „Jakob ___: „Hilfe!““, hinten „„Hilfe!“, ___ Jakob.“ */
  function satzHtml(v, verb) {
    const U = Z().UNTEN, O = Z().OBEN;
    const s = Z().schlussVon(v)[0];
    const wer = v.sprecher.charAt(0).toUpperCase() + v.sprecher.slice(1);
    const luecke = `<span class="verb-luecke${verb ? ' verb-luecke--voll' : ''}">${verb ? esc(verb) : '<span class="nurvorlesen">Lücke</span>'}</span>`;
    if (v.stellung === 'vorne') return `<span class="teil-begleit">${esc(wer)} ${luecke}</span>: <span class="teil-rede">${U}${esc(v.rede)}${esc(s)}${O}</span>`;
    const ende = s === '.' ? '' : s;
    return `<span class="teil-rede">${U}${esc(v.rede)}${esc(ende)}${O}</span>, <span class="teil-begleit">${luecke} ${esc(v.sprecher)}</span>.`;
  }
  function aufgabeZeigen() {
    hilfeStufe = 0;
    const v = z.aufgaben[z.i];
    Object.assign(z, { v, versuche: 0, fertig: false, rueck: '', loesung: false, gewaehlt: new Set(), optionen: T().mischen([...v.passt, ...v.passtNicht.slice(0, z.stufe === 'leicht' ? 2 : 3 - (v.passt.length - 1))]) });
    ctx.zeigen(`
      ${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Aufgabe ${z.i + 1} von ${z.aufgaben.length}`)}
      <section class="papier aufgabe aufgabe--schmal" id="${P}-aufgabe" aria-labelledby="${P}-auftrag"></section>`, `Aufgabe ${z.i + 1} – Wie wird gesprochen?`);
    panel();
  }
  function panel() {
    const v = z.v, zwei = v.passt.length > 1;
    const ort = ctx.app.querySelector(`#${P}-aufgabe`);
    const gezeigt = z.fertig ? (z.loesung ? v.passt[0] : [...z.gewaehlt][0]) : (zwei ? null : null);
    const weiter = `<button type="button" class="knopf haupt" data-${P}="weiter">${z.i + 1 < z.aufgaben.length ? 'Weiter' : 'Zum Rundenende'}</button>`;
    ort.innerHTML = `
      <p class="auftrag" id="${P}-auftrag">${zwei ? 'Welche zwei Verben passen? Tippe beide an.' : 'Welches Verb passt?'}</p>
      <p class="satz-gross satz-teile" aria-label="${esc(v.stellung === 'vorne' ? `${v.sprecher} Lücke: ${v.rede}` : `${v.rede}, Lücke ${v.sprecher}`)}">${satzHtml(v, gezeigt)}</p>
      <div class="antworten antworten--verben" role="group" aria-labelledby="${P}-auftrag">
        ${z.optionen.map(o => `<button type="button" class="knopf antwort-knopf${z.fertig && v.passt.includes(o) ? ' ist-richtig' : ''}" data-${P}="verb" data-wert="${esc(o)}" aria-pressed="${z.gewaehlt.has(o)}"${z.fertig ? ' disabled' : ''}>${esc(o)}</button>`).join('')}
      </div>
      ${zwei && !z.fertig ? `<p class="knopfreihe"><button type="button" class="knopf haupt" data-${P}="pruefen"${z.gewaehlt.size === 2 ? '' : ' disabled'}>Prüfen</button></p>` : ''}
      <p class="rueckmeldung" role="status">${esc(z.rueck)}</p>
      ${z.fertig ? `
        <div class="fachwort${z.loesung ? ' fachwort--loesung' : ''}">
          <h2 class="frage-klein">Wörter für „sagen“</h2>
          <p>${esc(v.passt.join(' und '))} ${v.passt.length > 1 ? 'passen' : 'passt'} hier. Solche Verben stehen im Begleitsatz. Sie sagen, <b>wie</b> gesprochen wird.</p>
          ${z.gesammelt.length ? `<p class="leise">Deine Sammlung in dieser Runde: ${esc(z.gesammelt.join(', '))}</p>` : ''}
        </div>
        <p class="knopfreihe">${weiter}</p>` : ''}`;
    if (z.fertig) T().leuchten(ort.querySelector('.satz-gross'));
  }
  function zaehlen() {
    if (z.geschafft[z.i]) return;
    z.geschafft[z.i] = true;
    if (!ST().istVorschau && ST().rundeGeschafft(ID, z.stufe) === false) z.gespeichertFehler = true;
  }
  function sammeln() { for (const w of z.v.passt) if (!z.gesammelt.includes(w)) z.gesammelt.push(w); }
  const RAT = {
    frage: 'Die Person will etwas wissen. Welches Verb passt zu einer Frage?',
    ausruf: 'Die Person sagt das laut oder aufgeregt. Welches Verb passt dazu?',
    aufforderung: 'Die Person will, dass jemand etwas tut. Welches Verb passt dazu?',
    aussage: 'Lies die Rede noch einmal. Ist die Person froh, traurig, leise oder erklärt sie etwas?'
  };
  function waehlen(o) {
    if (z.fertig) return;
    const v = z.v;
    if (v.passt.length > 1) {
      if (z.gewaehlt.has(o)) z.gewaehlt.delete(o); else if (z.gewaehlt.size < 2) z.gewaehlt.add(o);
      panel(); T().fokus(ctx, `[data-${P}="verb"][data-wert="${CSS.escape(o)}"]`);
      return;
    }
    z.versuche++;
    z.gewaehlt = new Set([o]);
    if (v.passt.includes(o)) { z.fertig = true; z.rueck = `Genau: ${o}.`; sammeln(); if (z.versuche <= 2) zaehlen(); }
    else if (z.versuche >= 2) { z.fertig = true; z.loesung = true; z.rueck = `Hier passt besser: ${v.passt[0]}.`; z.gewaehlt = new Set(); sammeln(); }
    else z.rueck = `${o} passt hier nicht so gut. ${RAT[v.satzart]}`;
    panel(); ctx.ansagen(z.rueck + (z.fertig ? ' ' + satzText() : ''));
    T().fokus(ctx, z.fertig ? `[data-${P}="weiter"]` : `[data-${P}="verb"]`);
  }
  function pruefen() {
    const v = z.v;
    z.versuche++;
    const richtig = [...z.gewaehlt].filter(o => v.passt.includes(o)).length;
    if (richtig === 2) { z.fertig = true; z.rueck = 'Genau. Beide passen.'; sammeln(); if (z.versuche <= 2) zaehlen(); }
    else if (z.versuche >= 2) { z.fertig = true; z.loesung = true; z.rueck = `Diese beiden passen: ${v.passt.join(' und ')}.`; sammeln(); }
    else z.rueck = richtig === 1 ? 'Eins davon passt. Das andere passt nicht so gut. Tausch eins aus.' : `Beide passen nicht so gut. ${RAT[v.satzart]}`;
    panel(); ctx.ansagen(z.rueck);
    T().fokus(ctx, z.fertig ? `[data-${P}="weiter"]` : `[data-${P}="verb"]`);
  }
  const satzText = () => { const v = z.v, s = Z().schlussVon(v)[0]; return v.stellung === 'vorne' ? `${v.sprecher.charAt(0).toUpperCase() + v.sprecher.slice(1)} ${v.passt[0]}: ${v.rede}${s}` : `${v.rede}, ${v.passt[0]} ${v.sprecher}.`; };
  function weiter() {
    if (z.i + 1 < z.aufgaben.length) { z.i++; aufgabeZeigen(); return; }
    const r = T().rundenende(ctx, { id: ID, praefix: P, stufe: z.stufe, geschafft: z.geschafft.filter(Boolean).length, anzahl: z.aufgaben.length, stempelSvg: stempelSvg(), gespeichertFehler: z.gespeichertFehler });
    ctx.zeigen(`${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Rundenende`)}${r.html}
      <section class="papier"><h2>Wörter für „sagen“</h2><p>${esc(z.gesammelt.join(', '))}</p></section>${amTisch(false)}`, 'Rundenende – Wie wird gesprochen?');
    ctx.ansagen(r.text);
    if (r.fehler) ctx.melden(ctx.speicherFehlt);
  }
  function hilfe() {
    if (!z) {
      T().dialog(ctx, { titel: 'Tipp von Bela', inhalt: `<div class="tipp">${ctx.belaKlein}<p>Wähle eine Stufe. Ich empfehle dir die Stufe mit dem Wort „empfohlen“.</p></div>`, knoepfe: '<button type="button" class="knopf haupt" data-dialog="zu">Ich probiere es</button>' });
      return;
    }
    const liste = ['Lies die Rede laut. Wie klingt sie?', RAT[z.v.satzart], 'Setz jedes Verb einmal in den Satz und sprich ihn. Was klingt richtig?'];
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
    else if (w === 'verb') waehlen(b.dataset.wert);
    else if (w === 'pruefen') pruefen();
    else if (w === 'weiter') weiter();
    else return false;
    return true;
  }
  WG.stationen[ID] = { id: ID, stempelSvg, oeffnen(c) { ctx = c; ansichtStufen(); }, bedienen, zustand: () => z };
})();
