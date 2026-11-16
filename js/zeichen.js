/* Walgesang: Zeichen-Prüflogik für die wörtliche Rede (ohne Darstellung, ohne DOM).
   Klassisches Skript, legt window.WG.zeichen an. Läuft auch in tools/zeichen-test.html.

   Ein Satzdatensatz (js/daten/saetze.js, von Hand geschrieben, Ingo prüft jeden):
     { id, sprecher: 'Tim', verb: 'fragt', zusatz: 'leise' (frei), rede: 'Wie spät ist es', satzart, schluss (frei),
       begleitVorne / begleitHinten (frei, ersetzt die gebildete Form), rede2 (nur Begleitsatz in der Mitte) }
     satzart: 'aussage' | 'frage' | 'ausruf' | 'aufforderung'
     schluss: erlaubte Schlusszeichen der Rede. Ohne Angabe: Aussage '.', Frage '?', Ausruf '!', Aufforderung '!'.
              Alle Sätze nutzen die Vorgabe (Zebra: nach einer Aufforderung „!“, Ingo 16.11.2026). Das Feld bleibt nur für Tests.

   Aus dem Datensatz und der Stellung ('vorne' | 'hinten' | 'mitte') entsteht ein Aufbau:
     woerter: die Wort-Kacheln, teile: zu welchem Teil jedes Wort gehört ('begleit' | 'rede'),
     luecken: n + 1 Lücken (vor dem ersten Wort, zwischen den Wörtern, nach dem letzten),
              je Lücke eine Liste erlaubter Zeichenfolgen (meist genau eine) und eine Rolle für die Rückmeldung.

   Regeln (nach Zebra 3 und Zebra 4, nicht im Duden nachgeprüft, Ingo prüft):
     vorne:  Begleitsatz: „Rede?“            Tim fragt: „Wie spät ist es?“
     hinten: „Rede?“, begleitsatz.           „Wie spät ist es?“, fragt Tim.   „Ich komme gleich“, sagt Mama.
             Nach einer Aussage fällt der Punkt in der Rede weg, ? und ! bleiben. Am Ende ein Punkt.
     mitte:  „Rede eins“, begleitsatz, „rede zwei.“   (zwei Kommas, zweiter Teil klein)
   Groß- und Kleinschreibung steht fest auf den Kacheln und wird nicht geprüft. */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};

  const UNTEN = '„', OBEN = '“';
  const ZEICHEN = [UNTEN, OBEN, ':', ',', '.', '!', '?'];
  const NAME = { [UNTEN]: 'Redezeichen unten', [OBEN]: 'Redezeichen oben', ':': 'Doppelpunkt', ',': 'Komma', '.': 'Punkt', '!': 'Ausrufezeichen', '?': 'Fragezeichen' };
  const SATZART = ['aussage', 'frage', 'ausruf', 'aufforderung'];
  const SCHLUSS = { aussage: ['.'], frage: ['?'], ausruf: ['!'], aufforderung: ['!'] };

  const gross = w => w ? w[0].toLocaleUpperCase('de-DE') + w.slice(1) : w;
  const klein = w => w ? w[0].toLocaleLowerCase('de-DE') + w.slice(1) : w;
  const worte = t => String(t || '').trim().split(/\s+/).filter(Boolean);
  const schlussVon = d => (Array.isArray(d.schluss) && d.schluss.length ? d.schluss.slice() : SCHLUSS[d.satzart].slice());

  /* Begleitsatz vorne: „Tim fragt leise“, hinten: „fragt Tim leise“. Abweichungen stehen im Datensatz. */
  function begleitVorne(d) {
    if (d.begleitVorne) return d.begleitVorne;
    return gross([d.sprecher, d.verb, d.zusatz].filter(Boolean).join(' '));
  }
  function begleitHinten(d) {
    if (d.begleitHinten) return d.begleitHinten;
    /* „ich“ bleibt klein, Namen und Nomen bleiben groß (Kachel kommt so aus dem Datensatz) */
    return [klein(d.verb), d.sprecher, d.zusatz].filter(Boolean).join(' ');
  }

  /* Alle Kombinationen aus Listen von Möglichkeiten: [[a],[b,c]] -> [[a,b],[a,c]] */
  const kreuz = teile => teile.reduce((acc, t) => acc.flatMap(a => t.map(x => a.concat([x]))), [[]]);

  /* Aufbau eines Satzes in einer Stellung */
  function aufbau(d, stellung) {
    const fehler = datensatzFehler(d, stellung);
    if (fehler.length) throw new Error(`Satz ${d && d.id}: ${fehler.join('; ')}`);
    const schluss = schlussVon(d);
    let teile = [];   /* [{ text, teil }] */
    const fuege = (text, teil) => worte(text).forEach(w => teile.push({ text: w, teil }));
    const luecken = [];   /* je Lücke: { erlaubt: [[..], ..], rolle } */
    const leer = () => ({ erlaubt: [[]], rolle: 'innen' });

    if (stellung === 'vorne') {
      fuege(begleitVorne(d), 'begleit');
      fuege(d.rede, 'rede');
    } else if (stellung === 'hinten') {
      fuege(d.rede, 'rede');
      fuege(begleitHinten(d), 'begleit');
    } else {
      fuege(d.rede, 'rede');
      fuege(begleitHinten(d), 'begleit');
      fuege(d.rede2, 'rede2');
    }
    const n = teile.length;
    for (let i = 0; i <= n; i++) luecken.push(leer());
    const letztes = t => { let k = -1; teile.forEach((w, i) => { if (w.teil === t) k = i; }); return k; };
    const erstes = t => teile.findIndex(w => w.teil === t);

    if (stellung === 'vorne') {
      const b = letztes('begleit');
      luecken[b + 1] = { erlaubt: [[':', UNTEN]], rolle: 'vorneNachBegleit' };
      luecken[n] = { erlaubt: schluss.map(s => [s, OBEN]), rolle: 'vorneRedeEnde' };
    } else if (stellung === 'hinten') {
      luecken[0] = { erlaubt: [[UNTEN]], rolle: 'redeAnfang' };
      const r = letztes('rede');
      /* Nach einer Aussage fällt der Punkt weg; ? und ! bleiben. */
      luecken[r + 1] = { erlaubt: schluss.map(s => (s === '.' ? [OBEN, ','] : [s, OBEN, ','])), rolle: 'hintenRedeEnde' };
      luecken[n] = { erlaubt: [['.']], rolle: 'satzEnde' };
    } else {
      luecken[0] = { erlaubt: [[UNTEN]], rolle: 'redeAnfang' };
      luecken[letztes('rede') + 1] = { erlaubt: [[OBEN, ',']], rolle: 'mitteRedeEnde' };
      luecken[letztes('begleit') + 1] = { erlaubt: [[',', UNTEN]], rolle: 'mitteNachBegleit' };
      luecken[n] = { erlaubt: schluss.map(s => [s, OBEN]), rolle: 'mitteRede2Ende' };
      void erstes;
    }
    return { id: d.id, stellung, satzart: d.satzart, woerter: teile.map(t => t.text), teile: teile.map(t => t.teil), luecken, daten: d };
  }

  /* Prüft einen Datensatz auf Vollständigkeit (für Tests und beim Aufbau) */
  function datensatzFehler(d, stellung) {
    const f = [];
    if (!d || typeof d !== 'object') return ['kein Datensatz'];
    if (!d.id) f.push('id fehlt');
    if (!SATZART.includes(d.satzart)) f.push('satzart unbekannt: ' + d.satzart);
    if (!d.rede || !worte(d.rede).length) f.push('rede fehlt');
    if (!(d.begleitVorne || d.begleitHinten) && !(d.sprecher && d.verb)) f.push('sprecher oder verb fehlt');
    const alle = [d.rede, d.rede2, d.sprecher, d.verb, d.zusatz, d.begleitVorne, d.begleitHinten].filter(Boolean).join(' ');
    if (/[„“"':,.!?;]/.test(alle)) f.push('Satzzeichen im Text (gehören nicht in den Datensatz)');
    if (d.rede && worte(d.rede)[0] !== gross(worte(d.rede)[0])) f.push('Rede beginnt klein');
    if (d.schluss && !(Array.isArray(d.schluss) && d.schluss.every(s => ['.', '!', '?'].includes(s)))) f.push('schluss ungültig');
    if (stellung === 'mitte') {
      if (!d.rede2) f.push('rede2 fehlt (mitte)');
      else if (worte(d.rede2)[0] !== klein(worte(d.rede2)[0])) f.push('rede2 beginnt groß (mitte: zweiter Teil klein)');
    }
    if (stellung && !['vorne', 'hinten', 'mitte'].includes(stellung)) f.push('Stellung unbekannt: ' + stellung);
    return f;
  }

  /* Der fertige Satz als Text (erste erlaubte Folge je Lücke) */
  function text(a, eingabe) {
    const z = eingabe || a.luecken.map(l => l.erlaubt[0]);
    let s = '';
    for (let i = 0; i <= a.woerter.length; i++) {
      const zeichen = (z[i] || []).join('');
      /* Leerzeichen: nach : und , und vor „ ; Redezeichen oben und Schlusszeichen kleben am Wort */
      s += zeichen.replace(':' + UNTEN, ': ' + UNTEN).replace(',' + UNTEN, ', ' + UNTEN);
      if (i < a.woerter.length) s += (s && !s.endsWith(UNTEN) ? ' ' : '') + a.woerter[i];
    }
    return s.replace(/\s+/g, ' ').trim();
  }

  /* Vergleich einer Lücke: Art des Fehlers */
  const gleich = (x, y) => x.length === y.length && x.every((c, i) => c === y[i]);
  const zaehle = l => l.reduce((m, c) => (m[c] = (m[c] || 0) + 1, m), {});
  function vergleiche(ist, erlaubt) {
    if (erlaubt.some(e => gleich(ist, e))) return null;
    /* Gegen die ähnlichste erlaubte Folge vergleichen */
    const soll = erlaubt.slice().sort((a, b) => abstand(ist, a) - abstand(ist, b))[0];
    const zi = zaehle(ist), zs = zaehle(soll);
    const fehlt = [], zuviel = [];
    for (const c of ZEICHEN) {
      const d = (zs[c] || 0) - (zi[c] || 0);
      for (let k = 0; k < d; k++) fehlt.push(c);
      for (let k = 0; k < -d; k++) zuviel.push(c);
    }
    let art;
    if (!soll.length) art = 'zuviel';
    else if (!ist.length) art = 'fehlt';
    else if (!fehlt.length && !zuviel.length) art = 'reihenfolge';
    else if (fehlt.length && !zuviel.length) art = 'fehltTeil';
    else if (!fehlt.length && zuviel.length) art = 'zuvielTeil';
    else art = 'falsch';
    return { art, soll, fehlt, zuviel };
  }
  function abstand(a, b) {
    const za = zaehle(a), zb = zaehle(b);
    return ZEICHEN.reduce((s, c) => s + Math.abs((za[c] || 0) - (zb[c] || 0)), 0) + (gleich(a, b) ? 0 : 0.5);
  }

  /* eingabe: je Lücke eine Liste gesetzter Zeichen. Gibt { richtig, stellen: [{ luecke, rolle, ist, soll, art, fehlt, zuviel }] } */
  function pruefe(a, eingabe) {
    const stellen = [];
    a.luecken.forEach((l, i) => {
      const ist = (eingabe[i] || []).filter(c => ZEICHEN.includes(c));
      const v = vergleiche(ist, l.erlaubt);
      if (v) stellen.push(Object.assign({ luecke: i, rolle: l.rolle, ist }, v));
    });
    return { richtig: stellen.length === 0, stellen };
  }

  /* ---------- Rückmeldung zur Stelle (kindgerecht, ohne die Lösung ganz zu verraten) ---------- */
  const wortVor = (a, i) => a.woerter[i - 1];
  const wortNach = (a, i) => a.woerter[i];
  const anf = w => `‚${w}‘`;   /* einfache Anführung für Wörter in der Rückmeldung */
  function ort(a, i) {
    if (i === 0) return `Vor ${anf(wortNach(a, i))}`;
    if (i === a.woerter.length) return `Hinter ${anf(wortVor(a, i))}`;
    return `Zwischen ${anf(wortVor(a, i))} und ${anf(wortNach(a, i))}`;
  }
  const SATZART_WORT = { aussage: 'eine Aussage', frage: 'eine Frage', ausruf: 'ein Ausruf', aufforderung: 'eine Aufforderung' };

  function hinweis(a, s) {
    const i = s.luecke, o = ort(a, i);
    const hat = c => s.ist.includes(c), soll = c => s.soll.includes(c), fehlt = c => s.fehlt.includes(c), zuviel = c => s.zuviel.includes(c);
    const schlussFalsch = ['.', '!', '?'].some(zuviel) && ['.', '!', '?'].some(fehlt);
    switch (s.rolle) {
      case 'innen':
        return `${o} gehört kein Zeichen.`;
      case 'vorneNachBegleit':
        if (s.art === 'reihenfolge') return 'Am Ende vom Begleitsatz kommt zuerst der Doppelpunkt, danach die Redezeichen unten.';
        if (zuviel(OBEN)) return 'Vor der wörtlichen Rede stehen die Redezeichen unten, nicht oben.';
        if (zuviel(',')) return 'Der Begleitsatz steht vorne. Dann endet er mit einem Doppelpunkt, nicht mit einem Komma.';
        if (fehlt(':') && fehlt(UNTEN)) return `${o} fehlt etwas: Der Begleitsatz ist hier zu Ende, und die wörtliche Rede fängt an.`;
        if (fehlt(':')) return 'Der Begleitsatz steht vorne. Er endet mit einem Doppelpunkt.';
        if (fehlt(UNTEN)) return 'Vor der wörtlichen Rede fehlen die Redezeichen unten.';
        return `${o} stimmt etwas nicht. Hier endet der Begleitsatz.`;
      case 'vorneRedeEnde':
      case 'mitteRede2Ende':
        if (s.art === 'reihenfolge') return 'Das Schlusszeichen der Rede steht vor den Redezeichen oben.';
        if (schlussFalsch) return `Die Rede ist ${SATZART_WORT[a.satzart]}. Welches Schlusszeichen passt?`;
        if (zuviel(UNTEN)) return 'Am Ende der Rede stehen die Redezeichen oben, nicht unten.';
        if (zuviel(',')) return 'Hier ist der ganze Satz zu Ende. Ein Komma passt nicht.';
        if (['.', '!', '?'].some(fehlt) && fehlt(OBEN)) return 'Am Ende der Rede fehlen das Schlusszeichen und die Redezeichen oben.';
        if (['.', '!', '?'].some(fehlt)) return `Am Ende der Rede fehlt das Schlusszeichen. Die Rede ist ${SATZART_WORT[a.satzart]}.`;
        if (fehlt(OBEN)) return 'Am Ende der wörtlichen Rede fehlen die Redezeichen oben.';
        if (s.zuviel.length) return 'Hier steht ein Zeichen zu viel.';
        return `${o} stimmt etwas nicht. Hier endet die Rede.`;
      case 'redeAnfang':
        if (zuviel(OBEN) && fehlt(UNTEN)) return 'Am Anfang der Rede stehen die Redezeichen unten, nicht oben.';
        if (fehlt(UNTEN)) return 'Am Anfang der wörtlichen Rede fehlen die Redezeichen unten.';
        return 'Am Anfang steht nur das Redezeichen unten.';
      case 'hintenRedeEnde':
        if (s.art === 'reihenfolge') return soll('?') || soll('!') ? 'Erst kommt das Schlusszeichen, dann die Redezeichen oben, dann das Komma.' : 'Erst kommen die Redezeichen oben, dann das Komma.';
        if (zuviel('.') && a.satzart === 'aussage' && !s.fehlt.length) return 'Der Begleitsatz steht hinten. Dann fällt der Punkt in der Rede weg.';
        if (zuviel(':')) return 'Der Begleitsatz steht hinten. Dann kommt nach der Rede ein Komma, kein Doppelpunkt.';
        if (schlussFalsch) return `Die Rede ist ${SATZART_WORT[a.satzart]}. Welches Zeichen passt?`;
        if (fehlt('?') || fehlt('!')) return `Die Rede ist ${SATZART_WORT[a.satzart]}. Das Zeichen dafür bleibt stehen, auch wenn der Begleitsatz hinten steht.`;
        if (zuviel(UNTEN)) return 'Am Ende der Rede stehen die Redezeichen oben, nicht unten.';
        if (fehlt(',') && fehlt(OBEN)) return 'Nach der Rede fehlen die Redezeichen oben und ein Komma.';
        if (fehlt(',')) return 'Vor dem Begleitsatz fehlt ein Komma.';
        if (fehlt(OBEN)) return 'Am Ende der wörtlichen Rede fehlen die Redezeichen oben.';
        if (zuviel('.')) return 'Der Begleitsatz steht hinten. Dann fällt der Punkt in der Rede weg.';
        return 'Hier steht ein Zeichen zu viel.';
      case 'satzEnde':
        if (fehlt('.') && !s.ist.length) return 'Am Ende vom ganzen Satz fehlt der Punkt.';
        if (hat(OBEN) || hat(UNTEN)) return 'Hier ist der Begleitsatz zu Ende, nicht die Rede. Redezeichen gehören nicht hierhin.';
        if (hat('?') || hat('!')) return 'Der ganze Satz endet hier mit einem Punkt. Das Frage- oder Ausrufezeichen gehört in die Rede.';
        return 'Am Ende vom ganzen Satz steht ein Punkt.';
      case 'mitteRedeEnde':
        if (s.art === 'reihenfolge') return 'Erst kommen die Redezeichen oben, dann das Komma.';
        if (fehlt(',')) return 'Vor dem Begleitsatz fehlt ein Komma.';
        if (fehlt(OBEN)) return 'Hier hört der erste Teil der Rede auf. Es fehlen die Redezeichen oben.';
        return 'Hier steht ein Zeichen zu viel.';
      case 'mitteNachBegleit':
        if (s.art === 'reihenfolge') return 'Erst kommt das Komma, dann die Redezeichen unten.';
        if (fehlt(',')) return 'Nach dem Begleitsatz fehlt ein Komma.';
        if (fehlt(UNTEN)) return 'Hier fängt die Rede wieder an. Es fehlen die Redezeichen unten.';
        if (zuviel(':')) return 'Steht der Begleitsatz in der Mitte, kommt danach ein Komma.';
        return 'Hier steht ein Zeichen zu viel.';
      default:
        return `${o} stimmt etwas nicht.`;
    }
  }

  /* Name für Bildschirmleser: „Doppelpunkt, Redezeichen unten“ */
  const benenne = liste => liste.length ? liste.map(c => NAME[c] || c).join(', ') : 'leer';

  WG.zeichen = { UNTEN, OBEN, ZEICHEN, NAME, SATZART, schlussVon, begleitVorne, begleitHinten, aufbau, datensatzFehler, text, pruefe, hinweis, benenne, kreuz };
})();
