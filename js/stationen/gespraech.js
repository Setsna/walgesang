/* Walgesang: Station „Gespräch aufschreiben“.
   Klassisches Skript, trägt sich in WG.stationen.gespraech ein.
   Oben ein ruhiges Bild des Gesprächs: Sprechblasen im Glas-Stil mit Name und Text (ohne Redezeichen).
   Das Kind schreibt das Gespräch Zeile für Zeile auf. Jede Zeile kommt in eine neue Zeile (Sprecherwechsel).
   leicht und mittel: Für jede Zeile gibt es drei fertige Fassungen. Eine stimmt, eine hat einen falschen Sprecher,
   eine hat falsche Zeichen. Die falschen Fassungen werden aus der richtigen gebaut (js/zeichen.js prüft, dass sie falsch sind).
   knifflig: Das Kind setzt die Zeichen jeder Zeile selbst (Satz mit Lücken wie in „Begleitsatz vorne“).
   Geschafft: jede Zeile im ersten oder zweiten Versuch. */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};
  WG.stationen = WG.stationen || {};
  const ID = 'gespraech', P = 'gs';
  const T = () => WG.teile, ST = () => WG.stand, Z = () => WG.zeichen;

  let ctx = null, z = null, hilfeStufe = 0;
  const esc = s => ctx.esc(s);
  const gross = w => w.charAt(0).toUpperCase() + w.slice(1);
  const kopf = u => T().kopf(ctx, { titel: 'Gespräch aufschreiben', unterzeile: u, praefix: P });
  const stempelSvg = () => T().stempel('<path class="stempel__welle" d="M24 34 h28 a5 5 0 0 1 5 5 v8 a5 5 0 0 1 -5 5 h-16 l-7 6 v-6 h-5 a5 5 0 0 1 -5 -5 v-8 a5 5 0 0 1 5 -5z"/><path class="stempel__welle" d="M48 56 h24 a5 5 0 0 1 5 5 v6 a5 5 0 0 1 -5 5 h-3 v5 l-6 -5 h-15 a5 5 0 0 1 -5 -5 v-6 a5 5 0 0 1 5 -5z"/>');
  const STUFEN = { leicht: 'Begleitsatz vorne. Wähle die richtige Zeile.', mittel: 'Vorne und hinten gemischt.', knifflig: 'Du setzt die Zeichen selbst.' };
  const soGehts = offen => T().aufklapper(ctx, { klasse: 'so-gehts', titel: "So geht's", offen, schritte: ['Schau dir das Gespräch oben an. Wer sagt was?', 'Schreib es Zeile für Zeile auf. Jede Person bekommt eine neue Zeile.', 'Achte auf den Sprecher und auf die Zeichen.'] });
  const amTisch = offen => T().aufklapper(ctx, { klasse: 'am-tisch', titel: 'Am Tisch', offen, notiz: 'Material: Comic mit leeren Sprechblasen (selbst gemalt), Heft.', schritte: [
    'Erfindet zu zweit ein kurzes Gespräch oder einen Witz.',
    'Malt einen Comic mit leeren Sprechblasen und schreibt das Gespräch hinein.',
    'Schreibt das Gespräch ins Heft. Jede Person bekommt eine neue Zeile.',
    'Stellt den Begleitsatz einmal nach vorne und einmal nach hinten.'] });

  function ansichtStufen() {
    z = null;
    const erst = T().erstesMal(ID);
    ctx.zeigen(`
      ${kopf('Wer sagt was?')}
      ${erst ? '<p class="bela-satz">Wenn zwei sprechen, schreibt man das Gespräch auf. Jede Person bekommt eine neue Zeile.</p>' : ''}
      ${soGehts(erst)}
      ${T().stufenListe(ctx, ID, P, STUFEN)}
      ${amTisch(false)}`, 'Gespräch aufschreiben');
  }

  /* Falsche Fassungen einer Zeile: falscher Sprecher (anderer Sprecher im Gespräch) und falsche Zeichen */
  function falscheZeichen(a) {
    const r = a.luecken.map(l => l.erlaubt[0].slice());
    const U = Z().UNTEN, O = Z().OBEN;
    const vorschlaege = [];
    if (a.stellung === 'vorne') {
      const b = a.luecken.findIndex(l => l.rolle === 'vorneNachBegleit'), e = a.woerter.length;
      vorschlaege.push(x => { x[b] = [U]; });                          /* Doppelpunkt fehlt */
      vorschlaege.push(x => { x[e] = [O, x[e][0]]; });                 /* Schlusszeichen hinter den Redezeichen */
      vorschlaege.push(x => { x[b] = [':', O]; });                     /* Redezeichen oben am Anfang */
    } else {
      const r1 = a.luecken.findIndex(l => l.rolle === 'hintenRedeEnde');
      if (a.satzart === 'aussage') vorschlaege.push(x => { x[r1] = ['.', O, ',']; });   /* Punkt bleibt stehen */
      else vorschlaege.push(x => { x[r1] = [O, ',']; });                                  /* ? oder ! fällt weg */
      vorschlaege.push(x => { x[r1] = x[r1].filter(c => c !== ','); });                  /* Komma fehlt */
      vorschlaege.push(x => { x[r1] = x[r1].map(c => (c === ',' ? ':' : c)); });          /* Doppelpunkt statt Komma */
    }
    const wahl = vorschlaege[T().zahl(vorschlaege.length)];
    wahl(r);
    return r;
  }
  function fassungen(zeile, gespraech) {
    const a = Z().aufbau(zeile, zeile.stellung);
    const richtig = Z().text(a);
    const andere = gespraech.zeilen.map(x => x.sprecher).find(s => s !== zeile.sprecher);
    const b = Z().aufbau(Object.assign({}, zeile, { sprecher: andere, id: zeile.id + '-s' }), zeile.stellung);
    let f = falscheZeichen(a);
    let tries = 0;
    while (Z().pruefe(a, f).richtig && tries++ < 10) f = falscheZeichen(a);
    return T().mischen([
      { id: 'richtig', text: richtig },
      { id: 'sprecher', text: Z().text(b) },
      { id: 'zeichen', text: Z().text(a, f) }
    ]);
  }

  function rundeStarten(stufe) {
    z = { stufe, gespraeche: T().ziehe(WG.daten.gespraeche[stufe], T().station(ID).runde), i: 0, geschafft: [], gespeichertFehler: false };
    aufgabeZeigen();
  }
  function aufgabeZeigen() {
    hilfeStufe = 0;
    const g = z.gespraeche[z.i];
    Object.assign(z, { g, zeile: 0, fertigeZeilen: [], fehlerJeZeile: [], fertig: false, rueck: '' });
    zeileVorbereiten();
    ctx.zeigen(`
      ${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Aufgabe ${z.i + 1} von ${z.gespraeche.length}`)}
      <div class="station-flaeche">
        <div class="buehne buehne--gespraech" id="${P}-bild">${bild(g)}</div>
        <section class="papier aufgabe" id="${P}-aufgabe" aria-labelledby="${P}-auftrag"></section>
      </div>`, `Aufgabe ${z.i + 1} – Gespräch aufschreiben`);
    panel();
  }
  /* Bild des Gesprächs: abwechselnd links und rechts, ruhige Glasfelder, keine Comic-Umrandung */
  function bild(g) {
    const namen = [...new Set(g.zeilen.map(x => x.sprecher))];
    return `<p class="buehne__titel">${esc(g.ort)}</p>
      <ol class="gespraech-bild" aria-label="Das Gespräch">
        ${g.zeilen.map((x, k) => `<li class="blase blase--${namen.indexOf(x.sprecher) % 2 ? 'rechts' : 'links'}${k < z.zeile || z.fertig ? ' blase--erledigt' : ''}${k === z.zeile && !z.fertig ? ' blase--jetzt' : ''}">
          <span class="blase__wer">${esc(gross(x.sprecher))}</span>
          <span class="blase__text">${esc(x.rede)}${esc(Z().schlussVon(x)[0])}</span>
        </li>`).join('')}
      </ol>`;
  }
  function zeileVorbereiten() {
    const x = z.g.zeilen[z.zeile];
    z.versuche = 0; z.falsch = null;
    if (z.stufe === 'knifflig') { z.a = Z().aufbau(x, x.stellung); z.ui = WG.satzUi.neu(z.a, { praefix: P + 's' }); }
    else z.optionen = fassungen(x, z.g);
  }
  function panel() {
    const ort = ctx.app.querySelector(`#${P}-aufgabe`);
    const x = z.g.zeilen[z.zeile];
    const weiter = `<button type="button" class="knopf haupt" data-${P}="weiter">${z.i + 1 < z.gespraeche.length ? 'Nächstes Gespräch' : 'Zum Rundenende'}</button>`;
    let h = `<h2 class="frage-klein" id="${P}-heft-titel">Dein Heft</h2>
      <ol class="heft" aria-labelledby="${P}-heft-titel">${z.fertigeZeilen.map(t => `<li>${esc(t)}</li>`).join('')}${z.fertig ? '' : '<li class="heft__neu" aria-hidden="true"></li>'}</ol>`;
    if (!z.fertig) {
      const wie = x.stellung === 'vorne' ? 'Der Begleitsatz steht vorne.' : 'Der Begleitsatz steht hinten.';
      if (z.stufe === 'knifflig') {
        h += `<p class="auftrag" id="${P}-auftrag">Zeile ${z.zeile + 1}: ${esc(gross(x.sprecher))} spricht. ${wie} Setze die Zeichen.</p>${z.ui.html(ctx)}
          <p class="rueckmeldung" role="status" id="${P}-rueck">${esc(z.rueck)}</p>
          <p class="knopfreihe"><button type="button" class="knopf haupt" data-${P}="pruefen">Prüfen</button>${z.versuche >= 2 ? `<button type="button" class="knopf" data-${P}="loesung">Lösung zeigen</button>` : ''}</p>`;
      } else {
        h += `<p class="auftrag" id="${P}-auftrag">Zeile ${z.zeile + 1}: Welche Zeile ist richtig?</p>
          <div class="antworten" role="group" aria-labelledby="${P}-auftrag">${z.optionen.map(o => `<button type="button" class="knopf antwort-knopf antwort-knopf--satz${o.id === z.falsch ? ' ist-falsch' : ''}" data-${P}="zeile" data-id="${o.id}">${esc(o.text)}</button>`).join('')}</div>`;
      }
    }
    if (z.fertig || z.stufe !== 'knifflig') h += `<p class="rueckmeldung" role="status" id="${P}-rueck">${esc(z.rueck)}</p>`;
    if (z.fertig) h += `<div class="fachwort"><h2 class="frage-klein">So schreibt man ein Gespräch</h2><p>Jede Person bekommt eine neue Zeile. Der Begleitsatz sagt, wer spricht. Er kann vorne oder hinten stehen.</p></div><p class="knopfreihe">${weiter}</p>`;
    ort.innerHTML = h;
    const b = ctx.app.querySelector(`#${P}-bild`);
    if (b) b.innerHTML = bild(z.g);
  }
  function zeileFertig(text, ok) {
    z.fertigeZeilen.push(text);
    z.fehlerJeZeile.push(!ok);
    if (z.zeile + 1 < z.g.zeilen.length) { z.zeile++; zeileVorbereiten(); }
    else {
      z.fertig = true;
      if (z.fehlerJeZeile.every(f => !f) && !z.geschafft[z.i]) {
        z.geschafft[z.i] = true;
        if (!ST().istVorschau && ST().rundeGeschafft(ID, z.stufe) === false) z.gespeichertFehler = true;
      }
    }
  }
  function waehlen(id) {
    z.ansage = '';
    const o = z.optionen.find(x => x.id === id);
    z.versuche++;
    if (id === 'richtig') { zeileFertig(o.text, z.versuche <= 2); z.rueck = z.fertig ? 'Genau. Das Gespräch ist aufgeschrieben.' : (z.ansage = 'Genau. Weiter mit der nächsten Zeile.', ''); }
    else if (z.versuche >= 2) { const r = z.optionen.find(x => x.id === 'richtig'); zeileFertig(r.text, false); z.rueck = z.fertig ? 'Die richtige Zeile steht jetzt in deinem Heft. Das Gespräch ist fertig.' : (z.ansage = 'Die richtige Zeile steht jetzt in deinem Heft. Weiter mit der nächsten Zeile.', ''); }
    else z.falsch = id, z.rueck = id === 'sprecher' ? 'Schau oben ins Bild: Wer sagt das?' : 'Der Sprecher stimmt. Schau genau auf die Zeichen.';
    panel(); ctx.ansagen(z.rueck || z.ansage || '');
    T().fokus(ctx, z.fertig ? `[data-${P}="weiter"]` : `[data-${P}="zeile"]`);
  }
  function pruefen() {
    z.ansage = '';
    const p = z.ui.pruefen();
    z.versuche++;
    if (p.richtig) { const t = Z().text(z.a); zeileFertig(t, z.versuche <= 2); z.rueck = z.fertig ? 'Genau. Das Gespräch ist aufgeschrieben.' : (z.ansage = 'Genau. Weiter mit der nächsten Zeile.', ''); panel(); T().fokus(ctx, z.fertig ? `[data-${P}="weiter"]` : `[data-${P}s="luecke"]`); }
    else { z.rueck = `${p.stellen.length === 1 ? 'An einer Stelle' : `An ${p.stellen.length} Stellen`} stimmt es noch nicht. ${Z().hinweis(z.a, p.stellen[0])}`; z.ui.zeichnen(ctx); const r = ctx.app.querySelector(`#${P}-rueck`); if (r) r.textContent = z.rueck; if (z.versuche === 2) panel(); z.ui.waehle(p.stellen[0].luecke); z.ui.zeichnen(ctx, true); }
    ctx.ansagen(z.rueck || z.ansage || '');
  }
  function loesung() {
    z.ansage = '';
    const t = Z().text(z.a);
    zeileFertig(t, false);
    z.rueck = z.fertig ? 'Die richtige Zeile steht jetzt in deinem Heft. Das Gespräch ist fertig.' : (z.ansage = 'Die richtige Zeile steht jetzt in deinem Heft. Weiter mit der nächsten Zeile.', '');
    panel(); ctx.ansagen(z.rueck || z.ansage || '');
    T().fokus(ctx, z.fertig ? `[data-${P}="weiter"]` : `[data-${P}s="luecke"]`);
  }
  function weiter() {
    if (z.i + 1 < z.gespraeche.length) { z.i++; aufgabeZeigen(); return; }
    const r = T().rundenende(ctx, { id: ID, praefix: P, stufe: z.stufe, geschafft: z.geschafft.filter(Boolean).length, anzahl: z.gespraeche.length, stempelSvg: stempelSvg(), gespeichertFehler: z.gespeichertFehler });
    ctx.zeigen(`${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Rundenende`)}${r.html}${amTisch(false)}`, 'Rundenende – Gespräch aufschreiben');
    ctx.ansagen(r.text);
    if (r.fehler) ctx.melden(ctx.speicherFehlt);
  }
  function hilfe() {
    if (!z) {
      T().dialog(ctx, { titel: 'Tipp von Bela', inhalt: `<div class="tipp">${ctx.belaKlein}<p>Wähle eine Stufe. Ich empfehle dir die Stufe mit dem Wort „empfohlen“.</p></div>`, knoepfe: '<button type="button" class="knopf haupt" data-dialog="zu">Ich probiere es</button>' });
      return;
    }
    const liste = ['Schau oben ins Bild. Die helle Sprechblase ist jetzt dran. Wer spricht dort?', 'Steht der Begleitsatz vorne, kommt ein Doppelpunkt. Steht er hinten, kommt ein Komma.', 'Bei einer Aussage mit Begleitsatz hinten fällt der Punkt in der Rede weg.'];
    const erlaubt = z.versuche ? 3 : 2;
    T().tippDialog(ctx, { liste, bis: Math.min(hilfeStufe, erlaubt - 1), erlaubt, fertig: z.fertig, weiter: () => { hilfeStufe++; hilfe(); } });
  }
  function bedienen(e) {
    const b = e.target.closest(`[data-${P}], [data-${P}s]`);
    if (!b || b.disabled) return false;
    if (z && z.ui && b.dataset[P + 's']) { const r = z.ui.klick(ctx, b); if (r && r.text) ctx.ansagen(r.text); return true; }
    const w = b.dataset[P];
    if (w === 'stufe') rundeStarten(b.dataset.stufe);
    else if (w === 'stufen') ansichtStufen();
    else if (w === 'hilfe') hilfe();
    else if (w === 'woerter') T().woerter(ctx);
    else if (w === 'zeile') waehlen(b.dataset.id);
    else if (w === 'pruefen') pruefen();
    else if (w === 'loesung') loesung();
    else if (w === 'weiter') weiter();
    else return false;
    return true;
  }
  function taste(e) { if (!z || !z.ui || z.stufe !== 'knifflig') return false; const r = z.ui.taste(ctx, e); if (r && r.text) ctx.ansagen(r.text); return !!r; }
  WG.stationen[ID] = { id: ID, stempelSvg, fassungen, oeffnen(c) { ctx = c; ansichtStufen(); }, bedienen, taste, zustand: () => z };
})();
