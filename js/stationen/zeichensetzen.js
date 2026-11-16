/* Walgesang: Stationen „Begleitsatz vorne“, „Begleitsatz hinten“ und „Begleitsatz in der Mitte“ (Zusatz Klasse 4).
   Klassisches Skript, trägt sich in WG.stationen.vorne / .hinten / .mitte ein.
   Braucht WG.config, WG.zeichen, WG.satzUi, WG.daten, WG.teile, WG.stand. Die App ruft oeffnen(ctx), bedienen(e), taste(e).

   Ablauf je Satz: Das Kind setzt die Zeichen und tippt auf „Prüfen“. Falsche Stellen werden markiert, die Rückmeldung
   nennt die erste Stelle. Nach zwei Fehlversuchen gibt es „Lösung zeigen“ (zählt dann nicht als geschafft).
   Erst nach dem Probieren kommt das Fachwort (Lehrplan: erst experimentieren, dann benennen).
   Stufen: leicht nur die nötigen Lücken und ein Bild der Sprechblase (nur leicht, Ingo 16.11.2026),
   mittel alle Lücken, knifflig alle Lücken mit schwereren Sätzen. Gespeichert werden nur runden und stempel. */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};
  WG.stationen = WG.stationen || {};
  const T = () => WG.teile, ST = () => WG.stand, Z = () => WG.zeichen;

  const ART = {
    vorne: {
      titel: 'Begleitsatz vorne', praefix: 'vo', pool: st => WG.daten.saetze[st],
      erstesMal: 'Der Begleitsatz sagt, wer spricht. Hier steht er vorne. Setz die Zeichen in die Lücken.',
      soGehts: ['Lies den Satz. Wer spricht? Was wird gesagt?', 'Tippe eine Lücke an. Tippe dann ein Zeichen unten in der Leiste.', 'Fertig? Tippe auf Prüfen.'],
      fachwort: 'Der Begleitsatz steht vorne. Er endet mit einem Doppelpunkt. Die wörtliche Rede steht in Redezeichen: am Anfang unten, am Ende oben. Das Schlusszeichen steht vor den Redezeichen oben.',
      tipps: ['Wo hört der Begleitsatz auf? Wo fängt die wörtliche Rede an?', 'Am Ende vom Begleitsatz steht ein Doppelpunkt. Dann kommen die Redezeichen unten.', 'Ist die Rede eine Frage, ein Ausruf oder eine Aussage? Das Zeichen dafür steht vor den Redezeichen oben.'],
      stufen: { leicht: 'Nur die Lücken, in die etwas gehört.', mittel: 'Alle Lücken, ohne Sprechblase.', knifflig: 'Längere und schwerere Sätze.' },
      tisch: ['Malt ein Bild mit zwei Personen und einer leeren Sprechblase.', 'Schreibt in die Sprechblase, was jemand sagt.', 'Schreibt den Satz darunter ins Heft: erst wer spricht, dann Doppelpunkt, dann die Rede mit Redezeichen.', 'Kreist die Redezeichen mit einer Farbe ein, den Doppelpunkt mit einer anderen.'],
      motiv: '<rect class="stempel__kugel" x="22" y="47" width="15" height="6" rx="3"/><path class="stempel__welle" d="M22 59h15"/><circle class="stempel__kugel" cx="42.5" cy="45.5" r="2.2"/><circle class="stempel__kugel" cx="42.5" cy="54.5" r="2.2"/><rect class="stempel__welle" x="48" y="38" width="30" height="24" rx="7"/><rect class="stempel__kugel" x="55" y="47" width="16" height="6" rx="3"/>'
    },
    hinten: {
      titel: 'Begleitsatz hinten', praefix: 'hi', pool: st => WG.daten.saetze[st],
      erstesMal: 'Jetzt steht der Begleitsatz hinten. Das ist kniffliger. Probier es aus.',
      soGehts: ['Lies den Satz. Wo steht der Begleitsatz?', 'Tippe eine Lücke an. Tippe dann ein Zeichen unten in der Leiste.', 'Fertig? Tippe auf Prüfen.'],
      fachwort: 'Der Begleitsatz steht hinten. Nach der Rede kommen die Redezeichen oben und ein Komma. Bei einer Aussage fällt der Punkt in der Rede weg. Fragezeichen und Ausrufezeichen bleiben. Am Ende vom ganzen Satz steht ein Punkt.',
      tipps: ['Wo hört die wörtliche Rede auf? Wo fängt der Begleitsatz an?', 'Vor dem Begleitsatz steht ein Komma. Am Ende vom ganzen Satz steht ein Punkt.', 'Ist die Rede eine Aussage? Dann fällt ihr Punkt weg. Fragezeichen und Ausrufezeichen bleiben stehen.'],
      stufen: { leicht: 'Nur die Lücken, in die etwas gehört.', mittel: 'Alle Lücken, ohne Sprechblase.', knifflig: 'Längere und schwerere Sätze.' },
      tisch: ['Nehmt einen Satz aus dem Heft, in dem der Begleitsatz vorne steht.', 'Schreibt ihn auf einen Streifen und schneidet Begleitsatz und Rede auseinander.', 'Legt den Begleitsatz nach hinten. Welche Zeichen ändern sich? Legt sie mit Zeichenkärtchen.', 'Schreibt den neuen Satz auf.'],
      motiv: '<rect class="stempel__welle" x="20" y="38" width="30" height="24" rx="7"/><rect class="stempel__kugel" x="27" y="47" width="16" height="6" rx="3"/><circle class="stempel__kugel" cx="55" cy="54.5" r="2.2"/><path class="stempel__welle" d="M56.4 56l-1.4 3.6"/><rect class="stempel__kugel" x="60" y="47" width="14" height="6" rx="3"/><path class="stempel__welle" d="M60 59h14"/><circle class="stempel__kugel" cx="79" cy="54.5" r="2.2"/>'
    },
    mitte: {
      titel: 'Begleitsatz in der Mitte', praefix: 'mi', pool: st => WG.daten.mitte[st],
      erstesMal: 'Das ist ein Zusatz für Klasse 4. Der Begleitsatz steht mitten in der Rede.',
      soGehts: ['Lies den Satz. Die Rede hat zwei Teile.', 'Tippe eine Lücke an. Tippe dann ein Zeichen unten in der Leiste.', 'Fertig? Tippe auf Prüfen.'],
      fachwort: 'Der Begleitsatz steht in der Mitte. Vor ihm und nach ihm steht ein Komma. Jeder Teil der Rede hat eigene Redezeichen. Der zweite Teil der Rede beginnt klein.',
      tipps: ['Die Rede hat zwei Teile. Wo hört der erste Teil auf?', 'Vor dem Begleitsatz und nach dem Begleitsatz steht ein Komma.', 'Jeder Teil der Rede bekommt Redezeichen: unten am Anfang, oben am Ende.'],
      stufen: { leicht: 'Nur die Lücken, in die etwas gehört.', mittel: 'Alle Lücken, ohne Sprechblase.', knifflig: 'Längere und schwerere Sätze.' },
      tisch: ['Schreibt einen Satz mit wörtlicher Rede auf einen Streifen.', 'Schneidet die Rede an einer passenden Stelle durch und legt den Begleitsatz dazwischen.', 'Welche Zeichen braucht ihr jetzt? Legt sie mit Zeichenkärtchen.'],
      motiv: '<rect class="stempel__welle" x="18" y="40" width="22" height="20" rx="6"/><rect class="stempel__kugel" x="23" y="47" width="12" height="6" rx="3"/><circle class="stempel__kugel" cx="44" cy="54.5" r="2"/><path class="stempel__welle" d="M45.3 56l-1.3 3.2"/><rect class="stempel__kugel" x="48" y="47" width="10" height="6" rx="3"/><path class="stempel__welle" d="M48 59h10"/><circle class="stempel__kugel" cx="62" cy="54.5" r="2"/><path class="stempel__welle" d="M63.3 56l-1.3 3.2"/><rect class="stempel__welle" x="66" y="40" width="22" height="20" rx="6"/><rect class="stempel__kugel" x="71" y="47" width="12" height="6" rx="3"/>'
    }
  };

  function station(ID) {
    const A = ART[ID], P = A.praefix;
    let ctx = null, z = null, hilfeStufe = 0;
    const esc = s => ctx.esc(s);
    const kopf = u => T().kopf(ctx, { titel: A.titel, unterzeile: u, praefix: P });
    const stempelSvg = () => T().stempel(A.motiv);
    const soGehts = offen => T().aufklapper(ctx, { klasse: 'so-gehts', titel: "So geht's", offen, schritte: A.soGehts });
    const amTisch = offen => T().aufklapper(ctx, { klasse: 'am-tisch', titel: 'Am Tisch', offen, schritte: A.tisch, notiz: 'Material: Papierstreifen, Schere, Kärtchen mit Satzzeichen, Heft.' });

    function ansichtStufen() {
      z = null;
      const erst = T().erstesMal(ID);
      ctx.zeigen(`
        ${kopf(A.stufen ? 'Zeichen setzen' : '')}
        ${erst ? `<p class="bela-satz">${esc(A.erstesMal)}</p>` : ''}
        ${beispiel()}
        ${soGehts(erst)}
        ${T().stufenListe(ctx, ID, P, A.stufen)}
        ${amTisch(false)}`, A.titel);
    }
    /* Ein fertiges Beispiel zum Abschauen: Kinder starten über das Beispiel, nicht über Regeltext */
    function beispiel() {
      const d = A.pool('leicht')[0];
      const a = Z().aufbau(d, ID);
      return `<section class="papier beispiel" aria-labelledby="${P}-bsp"><h2 id="${P}-bsp" class="frage-klein">Beispiel</h2>${T().satzMitTeilen(ctx, a)}</section>`;
    }

    function rundeStarten(stufe) {
      const n = T().station(ID).runde;
      z = { stufe, saetze: T().ziehe(A.pool(stufe), n), i: 0, geschafft: [], gespeichertFehler: false };
      aufgabeZeigen();
    }
    function aufgabeZeigen() {
      hilfeStufe = 0;
      const d = z.saetze[z.i];
      const a = Z().aufbau(d, ID);
      z.a = a;
      z.ui = WG.satzUi.neu(a, { nurNoetige: z.stufe === 'leicht', praefix: P + 's' });
      z.versuche = 0; z.fertig = false; z.loesung = false; z.rueck = '';
      ctx.zeigen(`
        ${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Aufgabe ${z.i + 1} von ${z.saetze.length}`)}
        <div class="station-flaeche station-flaeche--satz">
          ${z.stufe === 'leicht' ? blase(d) : ''}
          <section class="papier aufgabe" id="${P}-aufgabe" aria-labelledby="${P}-auftrag">
            <p class="auftrag" id="${P}-auftrag">Setze die Zeichen.</p>
            ${z.ui.html(ctx)}
            <div id="${P}-unten"></div>
          </section>
        </div>`, `Aufgabe ${z.i + 1} – ${A.titel}`);
      unten();
    }
    /* Sprechblase als ruhiges Glasfeld: wer spricht und was (mit Schlusszeichen, ohne Redezeichen). Nur Bild, kein Comic. */
    function blase(d) {
      const wer = d.sprecher ? (d.sprecher === 'ich' ? 'Ich' : d.sprecher.replace(/^(die|der) /, m => m)) : '';
      const rede = ID === 'mitte' ? `${d.rede} ${d.rede2}` : d.rede;
      const schluss = Z().schlussVon(d)[0];
      if (!wer) return '';
      return `<figure class="blase" aria-label="${esc(wer)} spricht.">
          <figcaption class="blase__wer">${esc(wer.charAt(0).toUpperCase() + wer.slice(1))}</figcaption>
          <p class="blase__text" aria-hidden="true">${esc(rede)}${esc(schluss)}</p>
        </figure>`;
    }
    function unten() {
      const ort = ctx.app.querySelector(`#${P}-unten`);
      if (!ort) return;
      const weiter = `<button type="button" class="knopf haupt" data-${P}="weiter">${z.i + 1 < z.saetze.length ? 'Weiter' : 'Zum Rundenende'}</button>`;
      ort.innerHTML = `
        <p class="rueckmeldung" id="${P}-rueck" role="status">${esc(z.rueck)}</p>
        ${z.fertig ? `
          <div class="fachwort${z.loesung ? ' fachwort--loesung' : ''}">
            <h2 class="frage-klein">So heißt das</h2>
            ${T().satzMitTeilen(ctx, z.a)}
            <p>${esc(A.fachwort)}</p>
          </div>
          <p class="knopfreihe">${weiter}</p>`
        : `<p class="knopfreihe">
            <button type="button" class="knopf haupt" data-${P}="pruefen">Prüfen</button>
            ${z.versuche >= 2 ? `<button type="button" class="knopf" data-${P}="loesung">Lösung zeigen</button>` : ''}
          </p>`}`;
    }

    function zaehlen() {
      if (z.geschafft[z.i]) return;
      z.geschafft[z.i] = true;
      if (!ST().istVorschau && ST().rundeGeschafft(ID, z.stufe) === false) z.gespeichertFehler = true;
    }
    function pruefen() {
      if (z.fertig) return;
      const p = z.ui.pruefen();
      z.versuche++;
      if (p.richtig) {
        z.fertig = true; z.ui.sperren();
        z.rueck = z.versuche === 1 ? 'Genau. Alle Zeichen stimmen.' : 'Genau. Jetzt stimmen alle Zeichen.';
        zaehlen();
      } else {
        const n = p.stellen.length;
        z.rueck = `${n === 1 ? 'An einer Stelle' : `An ${n} Stellen`} stimmt es noch nicht. ${Z().hinweis(z.a, p.stellen[0])}`;
      }
      z.ui.zeichnen(ctx);
      unten();
      ctx.ansagen(z.rueck);
      if (z.fertig) { T().leuchten(ctx.app.querySelector(`#${P}-aufgabe .satz`)); T().fokus(ctx, `[data-${P}="weiter"]`); }
      else {
        /* Fokus auf die erste falsche Lücke, damit Tastatur und Bildschirmleser dort weitermachen */
        const erste = p.stellen[0].luecke;
        z.ui.waehle(erste); z.ui.zeichnen(ctx, true);
      }
    }
    function loesung() {
      z.ui.loesungZeigen(); z.fertig = true; z.loesung = true;
      z.rueck = 'Hier ist die Lösung. Schau sie dir genau an.';
      z.ui.zeichnen(ctx); unten(); ctx.ansagen(z.rueck + ' ' + Z().text(z.a));
      T().fokus(ctx, `[data-${P}="weiter"]`);
    }
    function weiter() {
      if (z.i + 1 < z.saetze.length) { z.i++; aufgabeZeigen(); return; }
      const r = T().rundenende(ctx, { id: ID, praefix: P, stufe: z.stufe, geschafft: z.geschafft.filter(Boolean).length, anzahl: z.saetze.length, stempelSvg: stempelSvg(), gespeichertFehler: z.gespeichertFehler });
      ctx.zeigen(`${kopf(`Stufe ${T().STUFENNAME[z.stufe]} · Rundenende`)}${r.html}${amTisch(false)}`, 'Rundenende – ' + A.titel);
      ctx.ansagen(r.text);
      if (r.fehler) ctx.melden(ctx.speicherFehlt);
    }
    function hilfe() {
      if (!z || !z.a) {
        T().dialog(ctx, { titel: 'Tipp von Bela', inhalt: `<div class="tipp">${ctx.belaKlein}<p>Wähle eine Stufe. Ich empfehle dir die Stufe mit dem Wort „empfohlen“. Oben siehst du ein Beispiel.</p></div>`, knoepfe: '<button type="button" class="knopf haupt" data-dialog="zu">Ich probiere es</button>' });
        return;
      }
      const erlaubt = z.versuche ? 3 : 2;
      const bis = Math.min(hilfeStufe, erlaubt - 1);
      T().tippDialog(ctx, { liste: A.tipps, bis, erlaubt, fertig: z.fertig, weiter: () => { hilfeStufe++; hilfe(); } });
    }

    function bedienen(e) {
      const b = e.target.closest(`[data-${P}], [data-${P}s]`);
      if (!b || b.disabled) return false;
      if (z && z.ui && b.dataset[P + 's']) {
        const r = z.ui.klick(ctx, b);
        if (r) { if (r.text) ctx.ansagen(r.text); if (r.geaendert && z.rueck) { z.rueck = ''; const el = ctx.app.querySelector(`#${P}-rueck`); if (el) el.textContent = ''; } }
        return true;
      }
      const w = b.dataset[P];
      if (w === 'stufe') rundeStarten(b.dataset.stufe);
      else if (w === 'stufen') ansichtStufen();
      else if (w === 'hilfe') hilfe();
      else if (w === 'woerter') T().woerter(ctx);
      else if (w === 'pruefen') pruefen();
      else if (w === 'loesung') loesung();
      else if (w === 'weiter') weiter();
      else return false;
      return true;
    }
    function taste(e) {
      if (!z || !z.ui) return false;
      const r = z.ui.taste(ctx, e);
      if (r && r.text) ctx.ansagen(r.text);
      return !!r;
    }

    WG.stationen[ID] = { id: ID, stempelSvg, oeffnen(c) { ctx = c; ansichtStufen(); }, bedienen, taste, zustand: () => z };
  }
  Object.keys(ART).forEach(station);
})();
