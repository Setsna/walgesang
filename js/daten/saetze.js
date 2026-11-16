/* Walgesang: alle Sätze, von Hand geschrieben (16.11.2026). Von Ingo geprüft am 16.11.2026 („Sätze passen“). Jede Änderung braucht eine neue Prüfung.
   Klassisches Skript, legt window.WG.daten an. Keine Sätze aus Zebra oder anderen Lehrwerken.
   Aufforderungen enden immer mit „!“, auch mit „bitte“ (wie Zebra, Ingo 16.11.2026).
   Im Datensatz stehen keine Satzzeichen. Die richtige Zeichenfolge rechnet js/zeichen.js aus.
   Namen: ausgedacht, keine Namen echter Kinder. Bela ist der Buckelwal der Plattform. */
(() => {
  'use strict';
  const WG = window.WG = window.WG || {};

  /* Grundsätze für Wer spricht?, Begleitsatz vorne und Begleitsatz hinten.
     leicht: Aussage und Frage, kurzer Begleitsatz. mittel: dazu Ausruf, Zusätze wie „leise“.
     knifflig: dazu Aufforderung, ich/wir, längere Begleitsätze (begleitVorne/begleitHinten von Hand). */
  const saetze = {
    leicht: [
      { id: 'l01', sprecher: 'Lina', verb: 'sagt', rede: 'Ich habe Hunger', satzart: 'aussage' },
      { id: 'l02', sprecher: 'Paul', verb: 'fragt', rede: 'Wo ist mein Ball', satzart: 'frage' },
      { id: 'l03', sprecher: 'Mama', verb: 'sagt', rede: 'Das Essen ist fertig', satzart: 'aussage' },
      { id: 'l04', sprecher: 'Ole', verb: 'fragt', rede: 'Darf ich mitspielen', satzart: 'frage' },
      { id: 'l05', sprecher: 'Emma', verb: 'sagt', rede: 'Heute regnet es', satzart: 'aussage' },
      { id: 'l06', sprecher: 'Opa', verb: 'fragt', rede: 'Wer hat meine Brille', satzart: 'frage' },
      { id: 'l07', sprecher: 'Finn', verb: 'sagt', rede: 'Ich kann schon schwimmen', satzart: 'aussage' },
      { id: 'l08', sprecher: 'Ida', verb: 'fragt', rede: 'Kommst du mit zum Strand', satzart: 'frage' },
      { id: 'l09', sprecher: 'Papa', verb: 'sagt', rede: 'Der Bus kommt gleich', satzart: 'aussage' },
      { id: 'l10', sprecher: 'Jana', verb: 'fragt', rede: 'Hast du einen Stift', satzart: 'frage' },
      { id: 'l11', sprecher: 'Bela', verb: 'sagt', rede: 'Ich singe gern', satzart: 'aussage' },
      { id: 'l12', sprecher: 'Noah', verb: 'fragt', rede: 'Was machen wir heute', satzart: 'frage' }
    ],
    mittel: [
      { id: 'm01', sprecher: 'die Lehrerin', verb: 'sagt', rede: 'Wir lesen jetzt eine Geschichte', satzart: 'aussage' },
      { id: 'm02', sprecher: 'Malte', verb: 'ruft', rede: 'Da ist ein Wal', satzart: 'ausruf' },
      { id: 'm03', sprecher: 'Rosa', verb: 'flüstert', rede: 'Das Baby schläft', satzart: 'aussage' },
      { id: 'm04', sprecher: 'Oma', verb: 'fragt', rede: 'Möchtest du noch Tee', satzart: 'frage' },
      { id: 'm05', sprecher: 'Kai', verb: 'antwortet', rede: 'Ich komme gleich', satzart: 'aussage' },
      { id: 'm06', sprecher: 'der Hausmeister', verb: 'ruft', rede: 'Das Tor ist offen', satzart: 'ausruf' },
      { id: 'm07', sprecher: 'Elif', verb: 'fragt', zusatz: 'leise', rede: 'Bist du traurig', satzart: 'frage' },
      { id: 'm08', sprecher: 'Mila', verb: 'erzählt', rede: 'Wir waren im Zoo', satzart: 'aussage' },
      { id: 'm09', sprecher: 'Papa', verb: 'ruft', zusatz: 'laut', rede: 'Das Essen ist fertig', satzart: 'ausruf' },
      { id: 'm10', sprecher: 'Jonas', verb: 'fragt', rede: 'Wann fängt der Film an', satzart: 'frage' },
      { id: 'm11', sprecher: 'Bela', verb: 'ruft', rede: 'Das Meer ist so schön', satzart: 'ausruf' },
      { id: 'm12', sprecher: 'Lina', verb: 'erklärt', rede: 'Wale atmen mit der Lunge', satzart: 'aussage' }
    ],
    knifflig: [
      { id: 'k01', sprecher: 'ich', verb: 'antworte', rede: 'Ich heiße Ole', satzart: 'aussage' },
      { id: 'k02', sprecher: 'Mama', verb: 'sagt', rede: 'Räum bitte dein Zimmer auf', satzart: 'aufforderung' },
      { id: 'k03', sprecher: 'der Trainer', verb: 'ruft', rede: 'Lauf schneller', satzart: 'aufforderung' },
      { id: 'k04', begleitVorne: 'Am Morgen fragt Paul', begleitHinten: 'fragt Paul am Morgen', rede: 'Wo ist meine Mütze', satzart: 'frage' },
      { id: 'k05', begleitVorne: 'Nach der Pause sagt die Lehrerin', begleitHinten: 'sagt die Lehrerin nach der Pause', rede: 'Holt bitte eure Hefte heraus', satzart: 'aufforderung' },
      { id: 'k06', sprecher: 'Ida', verb: 'fragt', zusatz: 'ihren Bruder', rede: 'Hilfst du mir bei den Hausaufgaben', satzart: 'frage' },
      { id: 'k07', sprecher: 'Opa', verb: 'ruft', zusatz: 'aus dem Garten', rede: 'Die Erdbeeren sind reif', satzart: 'ausruf' },
      { id: 'k08', sprecher: 'wir', verb: 'fragen', zusatz: 'den Busfahrer', rede: 'Fährt dieser Bus nach Tamsui', satzart: 'frage' },
      { id: 'k09', sprecher: 'Finn', verb: 'bittet', rede: 'Gib mir bitte das Salz', satzart: 'aufforderung' },
      { id: 'k10', sprecher: 'Bela', verb: 'singt', rede: 'Komm mit mir ins tiefe Meer', satzart: 'aufforderung' },
      { id: 'k11', begleitVorne: 'Plötzlich schreit Noah', begleitHinten: 'schreit Noah plötzlich', rede: 'Da ist eine Spinne', satzart: 'ausruf' },
      { id: 'k12', sprecher: 'Rosa', verb: 'fragt', zusatz: 'die Verkäuferin', rede: 'Wie viel kostet das Eis', satzart: 'frage' }
    ]
  };

  /* Zusatz Klasse 4: Begleitsatz in der Mitte. rede = erster Teil (groß), rede2 = zweiter Teil (klein).
     satzart gilt für den ganzen Redesatz. */
  const mitte = {
    leicht: [
      { id: 'x01', rede: 'Morgen', sprecher: 'Papa', verb: 'sagt', rede2: 'fahren wir ans Meer', satzart: 'aussage' },
      { id: 'x02', rede: 'Heute', sprecher: 'die Lehrerin', verb: 'sagt', rede2: 'schreiben wir eine Geschichte', satzart: 'aussage' },
      { id: 'x03', rede: 'Gestern', sprecher: 'Kai', verb: 'erzählt', rede2: 'habe ich einen Delfin gesehen', satzart: 'aussage' },
      { id: 'x04', rede: 'Weißt du', sprecher: 'Ole', verb: 'fragt', rede2: 'wo mein Schal ist', satzart: 'frage' },
      { id: 'x05', rede: 'Am Samstag', sprecher: 'Mila', verb: 'erzählt', rede2: 'gehen wir in den Zoo', satzart: 'aussage' },
      { id: 'x06', rede: 'Komm', sprecher: 'Lina', verb: 'ruft', rede2: 'wir spielen Fangen', satzart: 'ausruf' }
    ],
    mittel: [
      { id: 'x07', rede: 'Sag mal', sprecher: 'Emma', verb: 'fragt', rede2: 'hast du meine Jacke gesehen', satzart: 'frage' },
      { id: 'x08', rede: 'Pass auf', sprecher: 'der Trainer', verb: 'ruft', rede2: 'der Ball kommt', satzart: 'ausruf' },
      { id: 'x09', rede: 'Zum Glück', sprecher: 'Mama', verb: 'sagt', rede2: 'ist niemand nass geworden', satzart: 'aussage' },
      { id: 'x10', rede: 'Wenn es regnet', sprecher: 'Papa', verb: 'sagt', rede2: 'bleiben wir zu Hause', satzart: 'aussage' },
      { id: 'x11', rede: 'Bitte', sprecher: 'Ida', verb: 'flüstert', rede2: 'sei ganz leise', satzart: 'aufforderung' },
      { id: 'x12', rede: 'Im Winter', sprecher: 'Jonas', verb: 'erklärt', rede2: 'schwimmen viele Buckelwale in warme Meere', satzart: 'aussage' }
    ],
    knifflig: [
      { id: 'x13', rede: 'Ich glaube', sprecher: 'Rosa', verb: 'sagt', rede2: 'der Bus ist schon weg', satzart: 'aussage' },
      { id: 'x14', rede: 'Wo', sprecher: 'Opa', verb: 'fragt', rede2: 'habe ich nur meinen Schlüssel hingelegt', satzart: 'frage' },
      { id: 'x15', rede: 'Schaut mal', sprecher: 'die Lehrerin', verb: 'ruft', rede2: 'dort springt ein Wal aus dem Wasser', satzart: 'ausruf' },
      { id: 'x16', rede: 'Wenn ihr fertig seid', sprecher: 'der Hausmeister', verb: 'sagt', rede2: 'schließe ich die Tür ab', satzart: 'aussage' },
      { id: 'x17', rede: 'Morgen früh', sprecher: 'Noah', verb: 'fragt', rede2: 'fahren wir dann mit der MRT', satzart: 'frage' },
      { id: 'x18', rede: 'Ganz ehrlich', sprecher: 'Malte', verb: 'antwortet', rede2: 'ich habe den Kuchen nicht gegessen', satzart: 'aussage' }
    ]
  };

  /* Wie wird gesprochen? Das Verb fehlt im Begleitsatz. passt: richtige Verben, passtNicht: Ablenker.
     leicht und mittel: genau ein Verb passt. knifflig: zwei Verben passen, das Kind wählt beide. */
  const verben = {
    leicht: [
      { id: 'v01', stellung: 'vorne', sprecher: 'Jakob', rede: 'Hilfe', satzart: 'ausruf', passt: ['ruft'], passtNicht: ['fragt', 'erzählt'] },
      { id: 'v02', stellung: 'vorne', sprecher: 'Lina', rede: 'Wo ist meine Katze', satzart: 'frage', passt: ['fragt'], passtNicht: ['antwortet', 'erzählt'] },
      { id: 'v03', stellung: 'hinten', sprecher: 'Mama', rede: 'Das Baby schläft', satzart: 'aussage', passt: ['flüstert'], passtNicht: ['brüllt', 'jubelt'] },
      { id: 'v04', stellung: 'vorne', sprecher: 'Ole', rede: 'Ich heiße Ole', satzart: 'aussage', passt: ['antwortet'], passtNicht: ['fragt', 'jammert'] },
      { id: 'v05', stellung: 'hinten', sprecher: 'Emma', rede: 'Endlich habe ich Ferien', satzart: 'ausruf', passt: ['jubelt'], passtNicht: ['fragt', 'jammert'] },
      { id: 'v06', stellung: 'vorne', sprecher: 'Opa', rede: 'Mein Knie tut weh', satzart: 'aussage', passt: ['jammert'], passtNicht: ['jubelt', 'fragt'] },
      { id: 'v07', stellung: 'hinten', sprecher: 'Rosa', rede: 'Wie alt bist du', satzart: 'frage', passt: ['fragt'], passtNicht: ['antwortet', 'erklärt'] },
      { id: 'v08', stellung: 'vorne', sprecher: 'der Lehrer', rede: 'Fische atmen mit Kiemen', satzart: 'aussage', passt: ['erklärt'], passtNicht: ['jammert', 'fragt'] },
      { id: 'v09', stellung: 'hinten', sprecher: 'Kai', rede: 'Da kommt der Bus', satzart: 'ausruf', passt: ['ruft'], passtNicht: ['fragt', 'jammert'] },
      { id: 'v10', stellung: 'vorne', sprecher: 'Bela', rede: 'Hörst du mein Lied', satzart: 'frage', passt: ['fragt'], passtNicht: ['antwortet', 'jammert'] }
    ],
    mittel: [
      { id: 'v11', stellung: 'vorne', sprecher: 'Mama', rede: 'Renn nicht über die Straße', satzart: 'aufforderung', passt: ['ermahnt'], passtNicht: ['jubelt', 'fragt', 'erzählt'] },
      { id: 'v12', stellung: 'hinten', sprecher: 'Finn', rede: 'Ich habe keine Lust mehr', satzart: 'aussage', passt: ['jammert'], passtNicht: ['jubelt', 'erklärt', 'fragt'] },
      { id: 'v13', stellung: 'vorne', sprecher: 'Ida', rede: 'Gestern war ich im Aquarium', satzart: 'aussage', passt: ['erzählt'], passtNicht: ['ermahnt', 'fragt', 'befiehlt'] },
      { id: 'v14', stellung: 'hinten', sprecher: 'Paul', rede: 'Das ist ein Geheimnis', satzart: 'aussage', passt: ['flüstert'], passtNicht: ['brüllt', 'jubelt', 'fragt'] },
      { id: 'v15', stellung: 'hinten', sprecher: 'Lea', rede: 'So ein großer Wal', satzart: 'ausruf', passt: ['staunt'], passtNicht: ['ermahnt', 'fragt', 'jammert'] },
      { id: 'v16', stellung: 'vorne', sprecher: 'der Trainer', rede: 'Alle Kinder kommen zu mir', satzart: 'ausruf', passt: ['ruft'], passtNicht: ['flüstert', 'jammert', 'fragt'] },
      { id: 'v17', stellung: 'hinten', sprecher: 'Jonas', rede: 'Warum ist das Meer salzig', satzart: 'frage', passt: ['fragt'], passtNicht: ['erklärt', 'ermahnt', 'jubelt'] },
      { id: 'v18', stellung: 'hinten', sprecher: 'Mila', rede: 'Ich habe den ersten Preis bekommen', satzart: 'ausruf', passt: ['jubelt'], passtNicht: ['jammert', 'flüstert', 'ermahnt'] },
      { id: 'v19', stellung: 'vorne', sprecher: 'Rosa', rede: 'Ich bin hingefallen', satzart: 'aussage', passt: ['schluchzt'], passtNicht: ['jubelt', 'ermahnt', 'fragt'] },
      { id: 'v20', stellung: 'hinten', sprecher: 'Opa', rede: 'Mach bitte das Licht aus', satzart: 'aufforderung', passt: ['bittet'], passtNicht: ['jubelt', 'fragt', 'jammert'] }
    ],
    knifflig: [
      { id: 'v21', stellung: 'vorne', sprecher: 'Mama', rede: 'Zieh deine Jacke an', satzart: 'aufforderung', passt: ['ermahnt', 'ruft'], passtNicht: ['jubelt', 'fragt'] },
      { id: 'v22', stellung: 'hinten', sprecher: 'Ole', rede: 'Wo bist du', satzart: 'frage', passt: ['fragt', 'ruft'], passtNicht: ['antwortet', 'erklärt'] },
      { id: 'v23', stellung: 'vorne', sprecher: 'Ida', rede: 'Der Hund schläft', satzart: 'aussage', passt: ['flüstert', 'sagt'], passtNicht: ['brüllt', 'jubelt'] },
      { id: 'v24', stellung: 'hinten', sprecher: 'Noah', rede: 'Mein Eis ist runtergefallen', satzart: 'aussage', passt: ['jammert', 'schluchzt'], passtNicht: ['jubelt', 'befiehlt'] },
      { id: 'v25', stellung: 'vorne', sprecher: 'die Lehrerin', rede: 'Ein Wal ist kein Fisch', satzart: 'aussage', passt: ['erklärt', 'sagt'], passtNicht: ['jammert', 'fragt'] },
      { id: 'v26', stellung: 'hinten', sprecher: 'Finn', rede: 'Ich habe es geschafft', satzart: 'ausruf', passt: ['jubelt', 'ruft'], passtNicht: ['flüstert', 'jammert'] },
      { id: 'v27', stellung: 'vorne', sprecher: 'Kai', rede: 'Ich komme mit', satzart: 'aussage', passt: ['antwortet', 'sagt'], passtNicht: ['fragt', 'staunt'] },
      { id: 'v28', stellung: 'hinten', sprecher: 'der Lehrer', rede: 'Hört bitte gut zu', satzart: 'aufforderung', passt: ['bittet', 'sagt'], passtNicht: ['jammert', 'fragt'] },
      { id: 'v29', stellung: 'vorne', sprecher: 'Opa', rede: 'Ist das ein Delfin', satzart: 'frage', passt: ['fragt', 'ruft'], passtNicht: ['antwortet', 'erklärt'] },
      { id: 'v30', stellung: 'hinten', sprecher: 'Papa', rede: 'Das schaffst du', satzart: 'ausruf', passt: ['ruft', 'sagt'], passtNicht: ['jammert', 'fragt'] }
    ]
  };

  /* Gespräch aufschreiben. Jede Zeile ist ein Satzdatensatz mit Stellung.
     leicht: alles vorne. mittel: vorne und hinten gemischt. knifflig: das Kind setzt die Zeichen selbst. */
  const gespraeche = {
    leicht: [
      { id: 'g01', ort: 'Am Strand', zeilen: [
        { id: 'g01a', stellung: 'vorne', sprecher: 'Lea', verb: 'fragt', rede: 'Kommst du mit ins Wasser', satzart: 'frage' },
        { id: 'g01b', stellung: 'vorne', sprecher: 'Jakob', verb: 'antwortet', rede: 'Das Wasser ist mir zu kalt', satzart: 'aussage' },
        { id: 'g01c', stellung: 'vorne', sprecher: 'Lea', verb: 'sagt', rede: 'Dann bauen wir eine Sandburg', satzart: 'aussage' }] },
      { id: 'g02', ort: 'In der Pause', zeilen: [
        { id: 'g02a', stellung: 'vorne', sprecher: 'Ole', verb: 'fragt', rede: 'Spielst du mit mir Fangen', satzart: 'frage' },
        { id: 'g02b', stellung: 'vorne', sprecher: 'Elif', verb: 'antwortet', rede: 'Ich muss erst mein Brot essen', satzart: 'aussage' },
        { id: 'g02c', stellung: 'vorne', sprecher: 'Ole', verb: 'sagt', rede: 'Ich warte auf dich', satzart: 'aussage' }] },
      { id: 'g03', ort: 'Beim Frühstück', zeilen: [
        { id: 'g03a', stellung: 'vorne', sprecher: 'Papa', verb: 'fragt', rede: 'Möchtest du Saft', satzart: 'frage' },
        { id: 'g03b', stellung: 'vorne', sprecher: 'Rosa', verb: 'antwortet', rede: 'Ich trinke lieber Milch', satzart: 'aussage' }] },
      { id: 'g04', ort: 'Im Garten', zeilen: [
        { id: 'g04a', stellung: 'vorne', sprecher: 'Opa', verb: 'fragt', rede: 'Hilfst du mir beim Gießen', satzart: 'frage' },
        { id: 'g04b', stellung: 'vorne', sprecher: 'Noah', verb: 'antwortet', rede: 'Ich hole die Gießkanne', satzart: 'aussage' }] }
    ],
    mittel: [
      { id: 'g05', ort: 'Im Aquarium', zeilen: [
        { id: 'g05a', stellung: 'vorne', sprecher: 'Finn', verb: 'ruft', rede: 'Da schwimmt ein Hai', satzart: 'ausruf' },
        { id: 'g05b', stellung: 'hinten', sprecher: 'Ida', verb: 'sagt', rede: 'Der sieht gefährlich aus', satzart: 'aussage' },
        { id: 'g05c', stellung: 'vorne', sprecher: 'Finn', verb: 'erklärt', rede: 'Haie greifen nur selten Menschen an', satzart: 'aussage' }] },
      { id: 'g06', ort: 'Im Bus', zeilen: [
        { id: 'g06a', stellung: 'hinten', sprecher: 'Jonas', verb: 'fragt', rede: 'Wo steigen wir aus', satzart: 'frage' },
        { id: 'g06b', stellung: 'vorne', sprecher: 'Oma', verb: 'antwortet', rede: 'An der nächsten Haltestelle', satzart: 'aussage' },
        { id: 'g06c', stellung: 'hinten', sprecher: 'Jonas', verb: 'sagt', rede: 'Dann drücke ich jetzt den Knopf', satzart: 'aussage' }] },
      { id: 'g07', ort: 'Ein Witz', zeilen: [
        { id: 'g07a', stellung: 'vorne', sprecher: 'Finn', verb: 'fragt', rede: 'Was macht ein Fisch am Computer', satzart: 'frage' },
        { id: 'g07b', stellung: 'vorne', sprecher: 'Lina', verb: 'antwortet', rede: 'Das weiß ich nicht', satzart: 'aussage' },
        { id: 'g07c', stellung: 'hinten', sprecher: 'Finn', verb: 'sagt', rede: 'Er geht ins Netz', satzart: 'aussage' }] },
      { id: 'g08', ort: 'Im Klassenzimmer', zeilen: [
        { id: 'g08a', stellung: 'hinten', sprecher: 'Emma', verb: 'fragt', rede: 'Wer hat meinen Radiergummi', satzart: 'frage' },
        { id: 'g08b', stellung: 'vorne', sprecher: 'Paul', verb: 'antwortet', rede: 'Der liegt unter deinem Tisch', satzart: 'aussage' },
        { id: 'g08c', stellung: 'hinten', sprecher: 'Emma', verb: 'sagt', rede: 'Danke', satzart: 'aussage' }] }
    ],
    knifflig: [
      { id: 'g09', ort: 'Auf dem Markt', zeilen: [
        { id: 'g09a', stellung: 'vorne', sprecher: 'Mama', verb: 'fragt', zusatz: 'die Verkäuferin', rede: 'Haben Sie Mangos', satzart: 'frage' },
        { id: 'g09b', stellung: 'hinten', sprecher: 'die Verkäuferin', verb: 'antwortet', rede: 'Die Mangos sind heute besonders süß', satzart: 'aussage' },
        { id: 'g09c', stellung: 'vorne', sprecher: 'Mama', verb: 'sagt', rede: 'Dann nehme ich vier Stück', satzart: 'aussage' }] },
      { id: 'g10', ort: 'Beim Training', zeilen: [
        { id: 'g10a', stellung: 'vorne', sprecher: 'der Trainer', verb: 'ruft', rede: 'Alle zum Tor', satzart: 'ausruf' },
        { id: 'g10b', stellung: 'hinten', sprecher: 'Noah', verb: 'fragt', rede: 'Darf ich heute im Tor stehen', satzart: 'frage' },
        { id: 'g10c', stellung: 'hinten', sprecher: 'der Trainer', verb: 'antwortet', rede: 'Heute bist du dran', satzart: 'aussage' }] },
      { id: 'g11', ort: 'Am Telefon', zeilen: [
        { id: 'g11a', stellung: 'hinten', sprecher: 'Malte', verb: 'erzählt', rede: 'Ich habe morgen Geburtstag', satzart: 'aussage' },
        { id: 'g11b', stellung: 'vorne', sprecher: 'Oma', verb: 'fragt', rede: 'Was wünschst du dir', satzart: 'frage' },
        { id: 'g11c', stellung: 'hinten', sprecher: 'Malte', verb: 'antwortet', rede: 'Ein Buch über Wale', satzart: 'aussage' }] },
      { id: 'g12', ort: 'Am Hafen', zeilen: [
        { id: 'g12a', stellung: 'vorne', sprecher: 'Bela', verb: 'fragt', rede: 'Habt ihr schon einmal einen Wal singen gehört', satzart: 'frage' },
        { id: 'g12b', stellung: 'hinten', sprecher: 'Lina', verb: 'sagt', rede: 'Das klingt bestimmt schön', satzart: 'aussage' },
        { id: 'g12c', stellung: 'vorne', sprecher: 'Bela', verb: 'antwortet', rede: 'Hört gut zu', satzart: 'aufforderung' }] }
    ]
  };

  /* Kann das stimmen? Bela behauptet etwas, das Kind prüft.
     beispiel: ein Satz als { satz, stellung } (wird mit js/zeichen.js richtig gesetzt) oder als fester Text (text),
     der absichtlich falsch sein kann. stimmt: ob die Behauptung stimmt. erklaerung: Belas Schluss. */
  const behauptungen = {
    leicht: [
      { id: 'b01', behauptung: 'Der Begleitsatz sagt, wer spricht.', beispiel: { satz: 'l01', stellung: 'vorne' }, stimmt: true,
        erklaerung: 'Im Begleitsatz steht Lina. Lina spricht.' },
      { id: 'b02', behauptung: 'Am Anfang der wörtlichen Rede stehen die Redezeichen oben.', beispiel: { satz: 'l03', stellung: 'vorne' }, stimmt: false,
        erklaerung: 'Am Anfang stehen die Redezeichen unten. Am Ende stehen sie oben.' },
      { id: 'b03', behauptung: 'Steht der Begleitsatz vorne, endet er mit einem Doppelpunkt.', beispiel: { satz: 'l02', stellung: 'vorne' }, stimmt: true,
        erklaerung: 'Nach „Paul fragt“ steht ein Doppelpunkt. Danach kommt die wörtliche Rede.' },
      { id: 'b04', behauptung: 'Am Ende einer Frage in der wörtlichen Rede steht ein Punkt.', beispiel: { satz: 'l04', stellung: 'vorne' }, stimmt: false,
        erklaerung: 'Eine Frage endet mit einem Fragezeichen. Es steht vor den Redezeichen oben.' },
      { id: 'b05', behauptung: 'Die wörtliche Rede ist das, was jemand sagt.', beispiel: { satz: 'l05', stellung: 'vorne' }, stimmt: true,
        erklaerung: 'Emma sagt: Heute regnet es. Das ist die wörtliche Rede.' },
      { id: 'b06', behauptung: 'Das Schlusszeichen der Rede steht hinter den Redezeichen oben.', beispiel: { satz: 'l09', stellung: 'vorne' }, stimmt: false,
        erklaerung: 'Das Schlusszeichen gehört zur Rede. Es steht vor den Redezeichen oben.' }
    ],
    mittel: [
      { id: 'b07', behauptung: 'Steht der Begleitsatz hinten, kommt nach der Rede ein Komma.', beispiel: { satz: 'm08', stellung: 'hinten' }, stimmt: true,
        erklaerung: 'Nach den Redezeichen oben steht ein Komma. Dann kommt der Begleitsatz.' },
      { id: 'b08', behauptung: 'Steht der Begleitsatz hinten, bleibt der Punkt einer Aussage in der Rede stehen.', beispiel: { satz: 'm05', stellung: 'hinten' }, stimmt: false,
        erklaerung: 'Der Punkt fällt weg. Am Ende vom ganzen Satz steht dann ein Punkt.' },
      { id: 'b09', behauptung: 'Steht der Begleitsatz hinten, fällt auch das Fragezeichen weg.', beispiel: { satz: 'm04', stellung: 'hinten' }, stimmt: false,
        erklaerung: 'Das Fragezeichen bleibt stehen. Nur der Punkt einer Aussage fällt weg.' },
      { id: 'b10', behauptung: 'Der Begleitsatz endet immer mit einem Doppelpunkt.', beispiel: { satz: 'm10', stellung: 'hinten' }, stimmt: false,
        erklaerung: 'Nur wenn der Begleitsatz vorne steht. Steht er hinten, endet der ganze Satz mit einem Punkt.' },
      { id: 'b11', behauptung: 'Steht der Begleitsatz hinten, endet der ganze Satz mit einem Punkt.', beispiel: { satz: 'm02', stellung: 'hinten' }, stimmt: true,
        erklaerung: 'Nach „ruft Malte“ steht ein Punkt. Das Ausrufezeichen bleibt in der Rede.' },
      { id: 'b12', behauptung: 'Steht der Begleitsatz hinten, bleibt das Ausrufezeichen in der Rede stehen.', beispiel: { satz: 'm09', stellung: 'hinten' }, stimmt: true,
        erklaerung: 'Das Ausrufezeichen bleibt vor den Redezeichen oben. Nur der Punkt einer Aussage fällt weg.' }
    ],
    knifflig: [
      { id: 'b13', behauptung: 'Dieser Satz ist richtig geschrieben.', beispiel: { satz: 'k06', stellung: 'hinten' }, stimmt: true,
        erklaerung: 'Das Fragezeichen bleibt, dann kommen die Redezeichen oben, das Komma und der Begleitsatz.' },
      { id: 'b14', behauptung: 'Dieser Satz ist richtig geschrieben.', beispiel: { text: '„Ich bin müde.“, sagt Papa.' }, stimmt: false,
        erklaerung: 'Steht der Begleitsatz hinten, fällt der Punkt in der Rede weg: „Ich bin müde“, sagt Papa.' },
      { id: 'b15', behauptung: 'Dieser Satz ist richtig geschrieben.', beispiel: { text: 'Rosa ruft „Schau mal!“' }, stimmt: false,
        erklaerung: 'Nach dem Begleitsatz fehlt der Doppelpunkt: Rosa ruft: „Schau mal!“' },
      { id: 'b16', behauptung: 'Dieser Satz ist richtig geschrieben.', beispiel: { satz: 'k04', stellung: 'vorne' }, stimmt: true,
        erklaerung: 'Der Begleitsatz ist lang, aber er endet mit einem Doppelpunkt. Das Fragezeichen steht vor den Redezeichen oben.' },
      { id: 'b17', behauptung: 'Dieser Satz ist richtig geschrieben.', beispiel: { text: '„Gute Nacht“ flüstert Mama.' }, stimmt: false,
        erklaerung: 'Vor dem Begleitsatz fehlt das Komma: „Gute Nacht“, flüstert Mama.' },
      { id: 'b18', behauptung: 'Dieser Satz ist richtig geschrieben.', beispiel: { text: 'Der Hausmeister sagt: „Das Tor ist zu“.' }, stimmt: false,
        erklaerung: 'Der Punkt gehört zur Rede. Er steht vor den Redezeichen oben: Der Hausmeister sagt: „Das Tor ist zu.“' }
    ]
  };

  /* Fachwörter (Wörter-Dialog). Erst probieren, dann das Fachwort (Lehrplan). Begriffe nach Zebra. */
  const woerter = [
    ['Begleitsatz', 'Er sagt, wer spricht und wie gesprochen wird.'],
    ['wörtliche Rede', 'Das, was jemand sagt.'],
    ['Redezeichen', 'Sie stehen um die wörtliche Rede: am Anfang unten „, am Ende oben “.'],
    ['Doppelpunkt', 'Steht der Begleitsatz vorne, endet er mit einem Doppelpunkt.'],
    ['Komma', 'Steht der Begleitsatz hinten, steht vor ihm ein Komma.'],
    ['Schlusszeichen', 'Punkt, Fragezeichen oder Ausrufezeichen am Ende der Rede.']
  ];

  WG.daten = { saetze, mitte, verben, gespraeche, behauptungen, woerter };
})();
