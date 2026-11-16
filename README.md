# Walgesang

Lernplattform zur wörtlichen Rede für die Klasse 3 (8 bis 9 Jahre), mit einem Zusatz für Klasse 4.
Die Kinder finden heraus, wer spricht und was gesagt wird. Sie setzen Doppelpunkt, Komma, Redezeichen und Schlusszeichen in Sätze ein, schreiben kurze Gespräche auf und finden passende Wörter für „sagen“.
Begleiter ist Bela, ein Buckelwal. Es gibt keine Punkte, keinen Zeitdruck und keine Ranglisten.

**Adresse:** https://setsna.github.io/walgesang/ (noch nicht veröffentlicht)

Schwesterseite der [Lernlagune](https://lernlagune.de).

## Stationen

Jede Station hat drei Stufen (leicht, mittel, knifflig).

| Station | Was geübt wird |
|---|---|
| Wer spricht? | Begleitsatz und wörtliche Rede finden, Redezeichen erkennen |
| Begleitsatz vorne | Doppelpunkt, Redezeichen und Schlusszeichen setzen |
| Begleitsatz hinten | Komma nach der Rede, der Punkt der Aussage fällt weg, Frage- und Ausrufezeichen bleiben |
| Gespräch aufschreiben | ein Gespräch Zeile für Zeile aufschreiben, Begleitsatz vorne und hinten |
| Wie wird gesprochen? | Wortfeld „sagen“: passende Verben im Begleitsatz |
| Kann das stimmen? | Bela behauptet etwas über die Zeichen, das Kind prüft es |
| Begleitsatz in der Mitte | Zusatz für Klasse 4: zwei Kommas, zwei Paar Redezeichen |

Dazu ein Liederbuch mit allen Stempeln und „Das kann ich schon“ und eine Urkunde als PDF, die auf dem Gerät entsteht.

Grundlage ist der Lehrplan Thüringen Deutsch Grundschule (Lernbereich „Sprache und Sprachgebrauch untersuchen“). Inhaltliche Vorlage für Art und Stufe der Aufgaben ist das Lehrwerk Zebra 3 und 4. Alle Sätze und Texte sind selbst geschrieben.

## Fachliche Grundsätze

- Jeder Satz ist ein Datensatz ohne Satzzeichen (`js/daten/saetze.js`). Die richtige Zeichenfolge rechnet `js/zeichen.js` aus.
- Geprüft wird jede Lücke einzeln. Die Rückmeldung nennt die Stelle und den Grund.
- Erst probieren, dann das Fachwort.

## Was liegt wo?

| Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst der Seite (eine Seite für Anmeldung, Startseite, Stationen, Liederbuch) |
| `js/config.js` | Alle Einstellungen: Stationen, Stufen, Aufgaben je Runde |
| `js/zeichen.js` | Prüflogik der Zeichensetzung (ohne Darstellung) |
| `js/daten/saetze.js` | alle Sätze, Gespräche, Verben und Behauptungen |
| `js/satz-ui.js` | Satz mit Lücken und Zeichenleiste |
| `js/stationen/` | die Stationen |
| `js/station-teile.js` | gemeinsame Teile der Stationen |
| `js/logbuch.js`, `js/urkunde.js` | Liederbuch und Urkunde (PDF ohne Bibliothek) |
| `js/wg-stand.js`, `js/konto-*.js` | Stand des Kindes und gemeinsames Konto der Lernlagune |
| `js/app.js`, `js/erwachsene.js` | Ansichten, Bedienung, Erwachsenenbereich |
| `css/` | Farben und Maße (`tokens.css`), Seite, Stationen |
| `bilder/`, `schriften/` | Bela, Hintergrund, App-Symbole; Andika und Libre Caslon Text (OFL, Lizenztexte liegen bei) |

## Anmeldung und Daten

Die Kinder melden sich mit demselben Zugangscode an wie im Perlentaucher. Gespeichert werden in Firebase (`wg_stand/<code>`) nur Stempel und die Zahl der geschafften Aufgaben je Station und Stufe, kein Vorname, keine gesetzten Zeichen. Die Datenbankregeln erlauben genau die 21 festen Schlüssel. Zurücksetzen und Löschen gehen über den Lehrerbereich des Perlentauchers. Einzelheiten stehen in `datenschutz.html`.

## Veröffentlichen

- Hinter jeder lokalen `js`- und `css`-Datei steht `?v=N`. Bei jeder Änderung wird die Zahl in allen HTML-Dateien hochgezählt, sonst laden Geräte alte Fassungen.
- Die `.gitignore` sperrt alles und gibt nur die fertige Seite frei. Neue Dateien oder Ordner auf oberster Ebene dort eintragen.
- Werkzeuge und Tests liegen außerhalb dieses Repositorys und gehen nicht ins Netz.

## Stand

- 16.11.2026: lokal gebaut, `?v=1`, noch nicht veröffentlicht.
