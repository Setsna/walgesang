/* Walgesang: Texte für den Erwachsenenbereich (zwei Aufklapper unter der Startseite).
   Von Ingo freigegeben am 16.11.2026 (Fassung zum Lesen: Dateien/Beispiele-Entwuerfe/erwachsene.md).
   Keine Seitenangaben zu Zebra (Ingo, 16.11.2026). Format wie Chancenbucht:
   Abschnitte: titel, absaetze [Text], liste [[fett, Text]], tabelle { kopf: [..], zeilen: [[..]] }, datenschutzLink.
   Alles läuft in js/app.js durch esc(), es gibt kein HTML in den Texten. */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};
  const DATEN = 'Die Kinder melden sich mit ihrem Zugangscode an. Es ist derselbe wie beim Perlentaucher. Gespeichert werden unter diesem Code nur die Stempel und die Zahl der geschafften Aufgaben je Station und Stufe. Welche Zeichen Ihr Kind gesetzt hat und wie oft es probiert hat, wird nicht gespeichert. So ist der Stand auf jedem Gerät da, in der Schule und zu Hause. Der Stand liegt zusätzlich im Browser des Geräts, damit auch ohne Internet gearbeitet werden kann. Andere Kinder sehen ihn nicht, eine Auswertung für die Lehrkraft gibt es nicht. Löschen lassen können Sie den Stand über die Lehrkraft.';
  const DATEN_URKUNDE = 'Die Urkunde entsteht auf dem Gerät und wird weder gespeichert noch verschickt. Freie Texte kann Ihr Kind im Walgesang nirgends eingeben.';

  WG.erwachsene = {
    eltern: {
      titel: 'Für Eltern',
      abschnitte: [
        { titel: 'Worum es geht', absaetze: [
          'Im Walgesang üben Kinder der Klasse 3 die wörtliche Rede: Wer spricht? Was wird gesagt? Und welche Zeichen gehören dazu?',
          'Die Kinder setzen Doppelpunkt, Komma, Redezeichen und Schlusszeichen in Sätze ein. Sie tippen dafür eine Lücke an und wählen ein Zeichen. Eine Tastatur brauchen sie nicht.',
          'Ist ein Zeichen falsch, zeigt die Seite die Stelle und sagt, was dort nicht passt.'
        ] },
        { titel: 'Die Stationen', liste: [
          ['Wer spricht?', 'Begleitsatz und wörtliche Rede in einem Satz finden.'],
          ['Begleitsatz vorne', 'Doppelpunkt, Redezeichen und Schlusszeichen setzen: Lina sagt: „Ich habe Hunger.“'],
          ['Begleitsatz hinten', 'Komma nach der Rede, der Punkt der Aussage fällt weg: „Ich habe Hunger“, sagt Lina.'],
          ['Gespräch aufschreiben', 'Ein kurzes Gespräch Zeile für Zeile aufschreiben.'],
          ['Wie wird gesprochen?', 'Passende Wörter für „sagen“ finden: flüstern, rufen, jammern, erklären.'],
          ['Kann das stimmen?', 'Bela, der Buckelwal, behauptet etwas über die Zeichen. Ihr Kind prüft es.'],
          ['Begleitsatz in der Mitte', 'Ein Zusatz für Klasse 4: „Morgen“, sagt Papa, „fahren wir ans Meer.“']
        ] },
        { titel: 'Gut zu wissen', absaetze: [
          'Es gibt keinen Zeitdruck und keine Rangliste. Jede Station hat drei Stufen: leicht, mittel und knifflig.',
          'Bela gibt auf Wunsch Tipps. Die Tipps verraten die Lösung nicht.',
          'Freies Schreiben kann die Seite nicht prüfen. Darum gibt es zu jeder Station eine Idee für das Arbeiten am Tisch.'
        ] },
        { titel: 'Tipp für zu Hause', absaetze: [
          'Lesen Sie zusammen einen Comic. Schreiben Sie einen Satz aus einer Sprechblase als wörtliche Rede auf.',
          'Spielen Sie „Wie wird gesprochen?“: Einer sagt einen Satz flüsternd, rufend oder jammernd, der andere rät das Wort.',
          'Fragen Sie Ihr Kind: „Steht der Begleitsatz vorne oder hinten? Welches Zeichen kommt dann?“'
        ] },
        { titel: 'Daten', absaetze: [DATEN, DATEN_URKUNDE], datenschutzLink: true },
        { titel: 'Der Code', absaetze: [
          'Der Code gehört Ihrem Kind. Wer ihn kennt, kann sich damit anmelden. Auf einem fremden Gerät am Ende bitte auf „Abmelden“ tippen.'
        ] }
      ]
    },
    lehrkraefte: {
      titel: 'Für Lehrkräfte',
      abschnitte: [
        { titel: 'Konzept', absaetze: [
          'Wörtliche Rede mit vorangestelltem und nachgestelltem Begleitsatz für Klasse 3, dazu der eingeschobene Begleitsatz als Zusatz für Klasse 4.',
          'Die Kinder setzen Zeichen in Sätze, statt Regeln zu lesen. Geprüft wird die Stelle jedes Zeichens, nicht das Aussehen des Satzes. Die Rückmeldung nennt die Stelle und den Grund, zum Beispiel: „Vor dem Begleitsatz fehlt ein Komma.“',
          'Erst probieren, dann das Fachwort: Begleitsatz, wörtliche Rede und Redezeichen werden nach der Aufgabe am fertigen Satz benannt.'
        ] },
        { titel: 'Prinzip und Umsetzung', tabelle: { kopf: ['Prinzip', 'Umsetzung'], zeilen: [
          ['Handeln statt lesen', 'Lücke antippen, Zeichen wählen, prüfen. Auch mit Tasten bedienbar, ohne Ziehen.'],
          ['Rückmeldung zur Stelle', 'Falsche Lücken werden mit Rahmen und Pfeil markiert, der Text nennt den Grund.'],
          ['Erst probieren, dann benennen', 'Das Fachwort kommt nach der Aufgabe, am fertigen Satz mit unterstrichenem Begleitsatz und eingerahmter Rede.'],
          ['Regeln selbst prüfen', 'Bela stellt Behauptungen auf, die Kinder entscheiden und begründen am Beispiel.'],
          ['Wortfeld sagen', 'Passende Redebegleitverben nach dem Inhalt der Rede wählen, auf knifflig mehrere passende.'],
          ['Differenzierung', 'Drei Stufen je Station. Leicht zeigt nur die nötigen Lücken. Die Seite empfiehlt eine Stufe, das Kind wählt.'],
          ['Hilfe ohne Lösung', 'Gestufte Tipps von Bela. Nach zwei Fehlversuchen kann das Kind die Lösung ansehen, die Aufgabe zählt dann nicht.'],
          ['Kein Druck', 'Keine Zeitmessung, keine Punkte, keine Rangliste.'],
          ['Am Tisch', 'Zu jeder Station eine Idee ohne Gerät: Comic mit leeren Sprechblasen, Satzstreifen, Zeichenkärtchen.']
        ] } },
        { titel: 'Die Stationen und das Heft', absaetze: ['Die Aufgaben knüpfen an Zebra 3 (Klasse 3) und Zebra 4 (Klasse 4) an. Alle Sätze sind neu geschrieben.'], liste: [
          ['Wer spricht?', 'Begleitsatz und wörtliche Rede unterscheiden, Redezeichen erkennen. Wie in Zebra 3 beim Markieren von Begleitsatz und Rede.'],
          ['Begleitsatz vorne', 'Doppelpunkt, Redezeichen und Schlusszeichen setzen. Wie in Zebra 3.'],
          ['Begleitsatz hinten', 'Komma nach der Rede, Wegfall des Punktes, Frage- und Ausrufezeichen bleiben. In Zebra erst in Klasse 4, hier in Klasse 3 vorgezogen.'],
          ['Gespräch aufschreiben', 'Ein Gespräch mit Sprecherwechsel aufschreiben, wie beim Aufschreiben eines Witzes als Gespräch in Zebra 3.'],
          ['Wie wird gesprochen?', 'Wortfeld „sagen“, Redebegleitverben nach dem Inhalt wählen.'],
          ['Kann das stimmen?', 'Regeln zur Zeichensetzung prüfen und an Beispielen begründen.'],
          ['Begleitsatz in der Mitte', 'Eingeschobener Begleitsatz mit zwei Kommas, wie in Zebra 4. Zusatz für Klasse 4, zählt nicht für die Urkunde.']
        ] },
        { titel: 'Lehrplanbezug', absaetze: [
          'LP Thüringen Deutsch Grundschule (Erprobungsfassung 2026), Lernbereich „Sprache und Sprachgebrauch untersuchen“: Satzzeichen (Doppelpunkt, Redebegleitzeichen), Redebegleitsatz (einleitend, nachgestellt, unterbrechend), Wortfelder bilden.',
          'Der Lehrplan trennt diesen Lernbereich nicht nach Klasse 3 und 4. Die Einordnung legt das Schulcurriculum fest.'
        ] },
        { titel: 'Einsatz', absaetze: [
          'Gut als Station im Wochenplan, nach der Einführung im Buch oder als Wiederholung.',
          'Die Ideen „Am Tisch“ ergänzen die Arbeit am Gerät um freies Schreiben, das die Seite nicht prüfen kann.'
        ] },
        { titel: 'Daten', absaetze: [DATEN, DATEN_URKUNDE], datenschutzLink: true }
      ]
    }
  };
})();
