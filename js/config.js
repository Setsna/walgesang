/* Walgesang: alle Einstellungen an einer Stelle.
   Klassisches Skript, legt window.WG.config an. */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};

  WG.config = {
    name: 'Walgesang',
    unterzeile: 'Wer spricht? Was wird gesagt?',
    maskottchen: 'Bela',
    sammelbuch: 'Liederbuch',

    /* Speicher im Browser (Baukasten js/konto-speicher.js):
       localStorage   walgesang-v1.k<kennung>            Stand samt Vorname (für die Anzeige ohne Netz)
                      walgesang-v1.k<kennung>.abgleich   zuletzt abgeglichener Stand
       sessionStorage walgesang-v1-wer                   welches Kind in diesem Tab angemeldet ist
       Die Kennung wird aus dem Code errechnet, der Code selbst steht nicht im Namen. */
    speicher: { schluessel: 'walgesang', schema: 1 },
    codeLaenge: 8,
    nameMaxLaenge: 20,

    /* Gemeinsames Konto: das Firebase-Projekt des Perlentauchers.
       Diese Angaben sind keine Geheimnisse, sie stehen bei jeder Firebase-Seite im Quelltext.
       Geschützt werden die Daten durch die Regeln in der Firebase-Konsole (Block wg_stand, veröffentlicht am 16.11.2026). */
    firebase: {
      apiKey: 'AIzaSyBX3MUJq69uFyejbEiJimGeAtHMER3OCdE',
      authDomain: 'lernplattform-44aa1.firebaseapp.com',
      projectId: 'lernplattform-44aa1',
      storageBucket: 'lernplattform-44aa1.firebasestorage.app',
      messagingSenderId: '213839225177',
      appId: '1:213839225177:web:4cf676269e50c708466c48'
    },
    cloud: {
      kinder: 'kinder',        /* kinder/<code>: Vorname, von der Lehrkraft angelegt (nur lesen) */
      stand: 'wg_stand',       /* wg_stand/<code>: der Stand dieses Kindes in der Walgesang */
      schreibPauseMs: 2500     /* so lange nach der letzten Änderung warten, dann gebündelt schreiben */
    },

    /* Stationen und Stufen. Die Ids sind Teil der Firebase-Regeln (feste Schlüssel 'station:stufe').
       Eine neue Station oder Stufe braucht eine Regeländerung (Regel-Block wg_stand und tools/test/wg-gueltig.js).
       klasse4: Zusatz für Klasse 4 (eingeschobener Begleitsatz), zählt nicht für die Urkunde.
       runde: Aufgaben je Runde, stempelAb: so viele geschafft = Stempel. */
    stationen: [
      { id: 'wer', name: 'Wer spricht?', kurz: 'Begleitsatz und Rede finden', live: true, runde: 6, stempelAb: 5 },
      { id: 'vorne', name: 'Begleitsatz vorne', kurz: 'Doppelpunkt und Redezeichen', live: true, runde: 6, stempelAb: 5 },
      { id: 'hinten', name: 'Begleitsatz hinten', kurz: 'Komma nach der Rede', live: true, runde: 6, stempelAb: 5 },
      { id: 'gespraech', name: 'Gespräch aufschreiben', kurz: 'Wer sagt was?', live: true, runde: 4, stempelAb: 3 },
      { id: 'verben', name: 'Wie wird gesprochen?', kurz: 'Das passende Verb', live: true, runde: 6, stempelAb: 5 },
      { id: 'stimmt', name: 'Kann das stimmen?', kurz: 'Bela prüfen', live: true, runde: 5, stempelAb: 4 },
      { id: 'mitte', name: 'Begleitsatz in der Mitte', kurz: 'Zwei Kommas, zwei Teile', live: true, runde: 6, stempelAb: 5, klasse4: true }
    ],
    stufen: ['leicht', 'mittel', 'knifflig'],

    /* Obergrenze für runden je Schlüssel (wie im Regel-Block) */
    rundenMax: 100000,

    /* Versionsnummer der Bilder, getrennt von ?v=N für js und css */
    bildStand: 3
  };
})();
