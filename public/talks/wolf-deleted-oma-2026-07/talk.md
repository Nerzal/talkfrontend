---
id: wolf-deleted-oma-2026-07
title: HILFE! Der Wolf hat Großmutter deleted
description: Wir erzählen Rotkäppchen noch einmal – aber nur mit CREATE, READ, UPDATE und DELETE. Was dabei verloren geht, ist nicht nur die Großmutter, sondern unsere Sprache. Inspiriert von Golo Rodens Kritik an CRUD als Antipattern und seiner Fabel "Warum CRUD für Märchen und Unternehmen gleichermaßen ungeeignet ist".
year: 2026
month: 7
tags:
  - event-sourcing
  - architektur
  - ddd
  - datenbanken
---

--- title
# HILFE!\nDer Wolf hat Großmutter deleted
## Rotkäppchen, CRUD und die Sprache, die wir verlieren
Nerzal · Juli 2026


--- content
# Eine Geschichte, vier Verben
- Wir erzählen Rotkäppchen. Ganz normal.
- Aber: nur mit CREATE, READ, UPDATE, DELETE
- Mehr Verben gibt es nicht. Mehr Sprache auch nicht.
- Mal sehen, wie weit wir damit kommen


--- table
title: CREATE
statement: INSERT INTO personen VALUES (1, 'Rotkäppchen', 'unterwegs', 'Zuhause')
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '1'
      - Rotkäppchen
      - unterwegs
      - Zuhause
    variant: highlight
caption: Mutter created einen Auftrag. Kein "Bring Oma den Kuchen" – nur ein INSERT.
ascii: |2

     👩‍🍳
   "Bring Oma
    den Kuchen!"

       🧺
        ↓
    * PLOPP! *

   ╔═════════╗
   ║  Hallo! ║
   ╚═════════╝
      id = 1


--- table
title: UPDATE
statement: UPDATE personen SET ort = 'Wald' WHERE id = 1
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '1'
      - Rotkäppchen
      - unterwegs
      - Wald
    variant: warning
caption: Rotkäppchen updated ihre Position. Der Wald weiß nichts von Gefahr – CRUD kennt sowieso nur Felder, keine Bedeutung.
ascii: |2

     🌲 🌲 🌲

        👧
     "La la la~"

     🌲 🧺 🌲

   ort: 'Zuhause'
        ↓
   ort: 'Wald'

     🌲 🌲 🌲


--- table
title: READ
statement: SELECT ziel FROM personen WHERE id = 1
columns:
  - id
  - name
  - ziel
rows:
  - cells:
      - '1'
      - Rotkäppchen
      - Omas Haus im Wald
    variant: normal
caption: Der Wolf liest ein einziges Feld. Mehr braucht er nicht, um loszulaufen.
ascii: |2

     🐺: "Na, Kleine,
      wohin so eilig?"

     👧: "Zu Oma,
      hinterm Wald!"

     SELECT ziel
      ──────────
     → notiert. ✍️

     (￣ω￣) 🐺


--- table
title: UPDATE
statement: UPDATE personen SET ort = 'Omas Haus' WHERE id = 3
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '3'
      - Wolf
      - unterwegs
      - Omas Haus
    variant: danger
caption: Der Wolf updated seinen Standort. Schneller als jedes Kind – ein UPDATE kennt kein Tempolimit.
ascii: |2

     🐺💨💨💨

    Abkürzung
    durchs Dickicht!

    ort: 'Wald'
         ↓
    ort: 'Omas Haus'

     ZUERST DA.
      (¬‿¬)


--- table
title: DELETE
statement: DELETE FROM personen WHERE id = 2
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '2'
      - Großmutter
      - gesund
      - Omas Haus
    variant: deleted
caption: Eine Zeile. Weg. Kein Wimmern im Log – nur ein DELETE.
ascii: |2

    👵: "Wer klopft—"

    🐺: *SCHLUCK*

     gulp gulp
      gulp

    (⌐■_■)ᕗ
    "Mahlzeit!"

    💨 Oma: gone


--- table
title: UPDATE
statement: UPDATE personen SET name = 'Großmutter', status = 'trägt Nachthemd', ort = 'Bett' WHERE id = 3
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '3'
      - Großmutter
      - trägt Nachthemd
      - Bett
    variant: danger
caption: Der Wolf updated sein eigenes Profil – Name, Status, Ort. Dieselbe id = 3 wie vorher, aber niemand sieht das mehr. Ein UPDATE prüft keine Wahrheit, nur Felder.
ascii: |2

    🐺 + 👗 + 🛏️

     * P O O F *
      ~~~✨~~~

     /\_/\
    ( ò.ó )
    "Ich bin
     Großmutter!"

     id bleibt 3
     name lügt jetzt


--- table
title: UPDATE
statement: UPDATE personen SET ort = 'Omas Haus' WHERE id = 1
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '1'
      - Rotkäppchen
      - unterwegs
      - Omas Haus
    variant: highlight
caption: Rotkäppchen updated ihre Position. Sie ist da. Ahnungslos.
ascii: |2

        👧
    *klopf klopf*

    "Oma? Ich bin's!"

     🚪 → offen

    ort: 'Omas Haus'
       ✓ angekommen


--- table
title: READ
statement: SELECT * FROM personen WHERE name = 'Großmutter'
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '3'
      - Großmutter
      - trägt Nachthemd
      - Bett
    variant: warning
caption: 'Ein Treffer. Für CRUD ist das die Wahrheit: der Name passt, die Zeile existiert. Wer schaut schon auf die id?'
ascii: |2

       👧
    "Guten Tag, Oma!"

     SELECT *
      ──────
     → gefunden ✓
     → name: 'Großmutter'
     → id: 3 (niemand liest das)

     (˶ᵔᵕᵔ˶)


--- table
title: READ
statement: SELECT augen FROM personen WHERE id = 3
columns:
  - merkmal
  - wert
rows:
  - cells:
      - augen
      - erschreckend groß
    variant: warning
caption: '"Was hast du für große Augen?" – "Damit ich dich besser sehen kann!" Ein READ liefert einen Wert. Keine Erklärung.'
ascii: |2

       👧:
    "Was hast du für
     große AUGEN?!"

       👵❓:
    "Damit ich
     dich besser
     sehen kann!"

     ⚠ hihi ⚠


--- table
title: READ
statement: SELECT ohren FROM personen WHERE id = 3
columns:
  - merkmal
  - wert
rows:
  - cells:
      - ohren
      - erschreckend groß
    variant: warning
caption: '"Was hast du für große Ohren?" – noch ein READ, noch ein Wert ohne Warum.'
ascii: |2

       👧:
    "Was hast du für
     große OHREN?!"

       👵❓:
    "Damit ich
     dich besser
     hören kann!"

     ⚠ hmm... ⚠


--- table
title: READ
statement: SELECT zaehne FROM personen WHERE id = 3
columns:
  - merkmal
  - wert
rows:
  - cells:
      - zaehne
      - beunruhigend groß
    variant: danger
caption: '"Was hast du für große Zähne?!" – und jetzt wird''s ernst.'
ascii: |2

       👧:
    "Was hast du für
     große ZÄHNE?!"

       🐺:
    "Damit ich dich
     besser—"

     * S P R U N G *

      (╬ಠ益ಠ)


--- table
title: DELETE
statement: DELETE FROM personen WHERE id = 1
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '3'
      - Großmutter
      - satt
      - Bett
    variant: danger
  - cells:
      - '1'
      - Rotkäppchen
      - unterwegs
      - Bett
    variant: deleted
caption: Der Wolf deleted Rotkäppchen. Zwei Zeilen sind jetzt leer – die echte Oma und das echte Rotkäppchen existieren in keiner Tabelle mehr.
ascii: |2

     gulp gulp
      GULP

    🐺: (⌐■_■)ᕗ
    "Zweite Portion!"

    💨 Rotkäppchen: gone

     ort: 'Bett'
     bewohner: 1


--- table
title: CREATE
statement: INSERT INTO personen VALUES (4, 'Jäger', 'alarmiert', 'Wald')
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '4'
      - Jäger
      - alarmiert
      - Wald
    variant: highlight
caption: Ein neuer Datensatz betritt die Geschichte. Zum Glück mit einer Axt.
ascii: |2

     🪓 Jäger:
    "Was war das
     für ein Schrei?"

     ort: Wald
          ↓
     Richtung: Omas Haus

     (ง'̀-'́)ง


--- table
title: DELETE
statement: DELETE FROM personen WHERE id = 3
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '3'
      - Großmutter
      - satt
      - Bett
    variant: deleted
caption: Wolf deleted. Problem "gelöst"? Die Tabelle "personen" enthält jetzt weder eine echte Großmutter noch ein Rotkäppchen – nirgends.
ascii: |2

    🪓 Jäger:
   "HEUTE NICHT!"

    *WUUUSH!* 💨
    *C-H-O-P!* 🪓
    *C-H-O-P!* 🪓
    *THUD!*    💥

    🐺: [deleted]

     🎉 🎉 🎉


--- content
# Moment... und jetzt?
- Das Märchen sagt: Der Jäger schneidet den Wolf auf und befreit Großmutter und Rotkäppchen – lebendig
- CRUD sagt: dafür gibt es kein Verb
- „In CRUD-basierten Systemen gibt es kein Undelete" – Golo Roden
- Die einzige Möglichkeit, die CRUD kennt: ein neues CREATE


--- table
title: CREATE
statement: "INSERT INTO personen VALUES (2, 'Großmutter', ?, ?), (1, 'Rotkäppchen', ?, ?)"
columns:
  - id
  - name
  - status
  - ort
rows:
  - cells:
      - '2'
      - Großmutter
      - '???'
      - '???'
    variant: warning
  - cells:
      - '1'
      - Rotkäppchen
      - '???'
      - '???'
    variant: warning
caption: Zwei neue Zeilen mit den alten IDs. Sind das dieselben Personen wie vorher? CRUD weiß es nicht – und wir auch nicht.
ascii: |2

        🤔

    "Wie waren die
     beiden nochmal...?"

    status: ??? ✗
    ort:    ??? ✗

    "Ich weiß
     es nicht."

      (¬_¬ ")


--- content
# Fragen, die CRUD nicht beantworten kann
- Wann genau hat der Wolf zugeschlagen – und wen zuerst?
- War die "Großmutter", mit der Rotkäppchen sprach, überhaupt echt?
- Welches UPDATE war eine harmlose Ortsänderung, welches ein Betrug?
- Sind die wiederhergestellten Personen dieselben wie vorher?
- Wie sollen wir das jemals beweisen?


--- content
# CRUD spricht nicht unsere Sprache
- CREATE, READ, UPDATE, DELETE sind Datenbank-Begriffe – keine Fachbegriffe
- "Kunde storniert Bestellung", "Rolle wird delegiert", "Risiko wird neu bewertet" – alles wird zum selben UPDATE
- „Ein Update sagt nichts darüber aus, welche fachliche Änderung eingetreten ist" – Golo Roden
- Die Semantik verschwindet im Code


--- content
# Wenn die Sprache bricht, bricht das Verständnis
- Entwickler reden von "Update" – das Business redet von "storniert" oder "eskaliert"
- Fachsprache und technische Sprache laufen auseinander
- Die meisten Projekte scheitern nicht an der Technik, sondern an fehlender gemeinsamer Sprache
- Auch ein Märchen erzählt man nicht in vier Verben


--- content
# Ein Gedankenexperiment: dieselbe Geschichte, anders erzählt
- Was, wenn wir nicht Zustände überschreiben, sondern erzählen, was geschah?
- Kein UPDATE, kein DELETE – nur Ereignisse, die dazukommen
- RotkäppchenBetratWald, WolfVerschlangGroßmutter, JägerBefreiteBeide …


--- table
title: Die Geschichte als Ereignis-Log
statement: SELECT * FROM ereignisse ORDER BY zeit
columns:
  - '#'
  - ereignis
  - details
rows:
  - cells:
      - '1'
      - AuftragErteilt
      - '{ von: ''Mutter'' }'
    variant: normal
  - cells:
      - '2'
      - WaldBetreten
      - '{ von: ''Rotkäppchen'' }'
    variant: normal
  - cells:
      - '3'
      - GroßmutterVerschlungen
      - '{ täter: ''Wolf'' }'
    variant: danger
  - cells:
      - '4'
      - AlsGroßmutterVerkleidet
      - '{ täter: ''Wolf'' }'
    variant: danger
  - cells:
      - '5'
      - RotkäppchenVerschlungen
      - '{ täter: ''Wolf'' }'
    variant: danger
  - cells:
      - '6'
      - WolfGetötet
      - '{ täter: ''Jäger'' }'
    variant: normal
  - cells:
      - '7'
      - GroßmutterUndRotkäppchenBefreit
      - '{ retter: ''Jäger'' }'
    variant: highlight
caption: Kein Undelete nötig. "Befreit" ist einfach ein neues Ereignis – eins, das an die Geschichte anknüpft, statt sie zu überschreiben.


--- content
# Was sich ändert
- Korrektur statt Fälschung: ein Fehler wird nicht gelöscht, sondern durch ein neues Ereignis richtiggestellt
- Audit-Log gratis – es ist das System, kein Feature
- Ereignisnamen sind Fachbegriffe, keine Datenbank-Verben
- Die Vergangenheit bleibt lesbar, ganz ohne Raten


--- blank
# Großmutter lebt. Rotkäppchen auch.
Und vielleicht auch unsere Sprache – wenn wir aufhören, sie in vier Verben zu pressen.
