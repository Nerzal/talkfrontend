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
clippy: true
---

--- 0

![Wolf sitzt grinsend an einem Computer vor der Statusmeldung "Oma deleted"](assets/oma_deleted.png)

+++ notes
- Kurz warten, Titel wirken lassen
- Ton zweigleisig: Märchen + CRUD-Kritik – zieht sich durch ganzen Talk

---
# Eine Geschichte, vier Verben
-> Wir erzählen Rotkäppchen. Ganz normal.
-> Verben = CREATE, READ, UPDATE, DELETE
-> Mehr Verben gibt es nicht. Mehr Sprache braucht es auch nicht.
-> Mal sehen, wie weit wir damit kommen

+++ notes
- Regel klar benennen: ab jetzt nur die 4 CRUD-Verben, auch sprachlich
- Prämisse für den ganzen ersten Teil

---
# Create Rottkäppchen

```sql
INSERT INTO personen VALUES (1, 'Rotkäppchen', 'chillen', 'Zuhause')
```

| id | name | status | ort |
|---|---|---|---|
| 1 | Rotkäppchen | chillen | Zuhause | highlight |

![Rotkäppchen wurde created](assets/rotkäppchen_create.png)

---
```sql
UPDATE personen SET status = 'unterwegs' WHERE id = 1
```

| id | name | status | ort |
|---|---|---|---|
| 1 | Rotkäppchen | unterwegs | Zuhause | highlight |


# Update Auftrag
![Rotkäppchens Auftrag geupdated](assets/rotkäppchen_create.png)

---

# UPDATE

```sql
UPDATE personen SET ort = 'Wald' WHERE id = 1
```

| id | name | status | ort |
|---|---|---|---|
| 1 | Rotkäppchen | unterwegs | Wald | warning |

Rotkäppchen updated ihre Position. Der Wald weiß nichts von Gefahr – CRUD kennt sowieso nur Felder, keine Bedeutung.

+++ notes
- Betonen: UPDATE speichert nur Feld, keine Bedeutung
- Pointe kurz stehen lassen vor Bildwechsel

---
# READ

```sql
SELECT ziel FROM personen WHERE id = 1
```

| id | name | ziel |
|---|---|---|
| 1 | Rotkäppchen | Omas Haus im Wald |

![Rotkäppchen läuft durch den Wald auf einen wartenden Wolf zu](assets/rottkäpchen_updated_position.png)

Der Wolf liest ein einziges Feld. Mehr braucht er nicht, um loszulaufen.

+++ notes
- Bild kurz wirken lassen vor Caption
- Wolf im Hintergrund selbst entdecken lassen

---
# UPDATE

```sql
UPDATE personen SET ort = 'Omas Haus' WHERE id = 3
```

| id | name | status | ort |
|---|---|---|---|
| 3 | Wolf | unterwegs | Omas Haus | danger |

```

   🐺💨💨💨

  Abkürzung
  durchs Dickicht!

  ort: 'Wald'
       ↓
  ort: 'Omas Haus'

   (¬‿¬)

```

Der Wolf updated seinen Standort. Schneller als jedes Kind – ein UPDATE kennt kein Tempolimit.

+++ notes
- Tempo anziehen, Slide kurz halten – Wolf ist schnell

---
# DELETE

```sql
DELETE FROM personen WHERE id = 2
```

| id | name | status | ort |
|---|---|---|---|
| 2 | Großmutter | gesund | Omas Haus | deleted |

CRUD OPERATIONS: [D]ELETE. TARGET: OMA. STATUS: DELETED. Mehr Kommentar gibt das Feld nicht her.

+++ notes
- Erster harter Cut – Ton kurz ernster
- Bild als Payoff wirken lassen, Lachpause, nicht zu schnell weiter

---
# UPDATE

```sql
UPDATE personen SET name = 'Großmutter', status = 'trägt Nachthemd', ort = 'Bett' WHERE id = 3
```

| id | name | status | ort |
|---|---|---|---|
| 3 | Großmutter | trägt Nachthemd | Bett | danger |

```

  🐺 + 👗 + 🛏️

   * P O O F *
    ~~~✨~~~

   /\_/\
  ( ò.ó )
  "Ich bin
   Großmutter!"

```

Der Wolf updated sein eigenes Profil – Name, Status, Ort. Dieselbe id = 3 wie vorher, aber niemand sieht das mehr. Ein UPDATE prüft keine Wahrheit, nur Felder.

+++ notes
- Kernstelle des Talks – "id bleibt 3, name lügt jetzt" laut betonen (die These in einem Satz)
- Etwas langsamer als bei anderen UPDATE-Slides

---
# UPDATE

```sql
UPDATE personen SET ort = 'Omas Haus' WHERE id = 1
```

| id | name | status | ort |
|---|---|---|---|
| 1 | Rotkäppchen | unterwegs | Omas Haus | highlight |

Rotkäppchen updated ihre Position. Sie ist da. Ahnungslos.

+++ notes
- Verbindungs-Slide, nur Vollständigkeit – zügig weiter

---
# READ
![Diagramm "Attribut-Analyse: Verkleideter Wolf" mit großen Ohren, Augen und Händen als erkannte Merkmale](assets/rottkäppchen_reads_attributes.png)
SELECT * findet einen Treffer auf name = 'Großmutter'

+++ notes
- Bild fasst 3 Märchen-Momente zusammen (*, augen, ohren)
- Frei auf Original-Zeilen anspielen, nicht extra vorlesen

---
# READ

```sql
SELECT zaehne FROM personen WHERE id = 3
```

| merkmal | wert |
|---|---|
| zaehne | beunruhigend groß | danger |

```

     👧:
  "Was hast du für
   große ZÄHNE?!"

     🐺:
  "Damit ich dich
   besser—"

   * S P R U N G *

    (╬ಠ益ಠ)

```

"Was hast du für große Zähne?!" – und jetzt wird's ernst.

+++ notes
- Cliffhanger – dramatische Pause vor "SPRUNG"
- Timing wichtiger als Tempo, Stille aushalten

---
# DELETE

```sql
DELETE FROM personen WHERE id = 1
```

| id | name | status | ort |
|---|---|---|---|
| 3 | Großmutter | satt | Bett | danger |
| 1 | Rotkäppchen | unterwegs | Bett | deleted |

![Rotkäppchen löst sich am Fußende des Betts in Pixel auf, der Wolf liegt als Oma verkleidet im Bett](assets/rotkäppchen_deleted.png)

Der Wolf deleted Rotkäppchen. Zwei Zeilen sind jetzt leer – die echte Oma und das echte Rotkäppchen existieren in keiner Tabelle mehr.

+++ notes
- Zweiter harter Cut, kurz halten – Muster-Wiederholung soll auffallen
- Bild zeigt beide Opfer, kurze Pause vor Jäger

---
# CREATE

```sql
INSERT INTO personen VALUES (4, 'Jäger', 'alarmiert', 'Wald')
```

| id | name | status | ort |
|---|---|---|---|
| 4 | Jäger | alarmiert | Wald | highlight |

```

   🪓 Jäger:
  "Was war das
   für ein Schrei?"

   ort: Wald
        ↓
   Richtung: Omas Haus

   (ง'̀-'́)ง

```

Ein neuer Datensatz betritt die Geschichte. Zum Glück mit einer Axt.

+++ notes
- Tonwechsel: düster → hoffnungsvoll
- Jäger als Retter, Publikum kurz aufatmen lassen

---
# DELETE

```sql
DELETE FROM personen WHERE id = 3
```

| id | name | status | ort |
|---|---|---|---|
| 3 | Großmutter | satt | Bett | deleted |

```

  🪓 Jäger:
 "HEUTE NICHT!"

  *WUUUSH!* 💨
  *C-H-O-P!* 🪓
  *C-H-O-P!* 🪓
  *THUD!*    💥

  🐺: [deleted]

   🎉 🎉 🎉

```

Wolf deleted. Problem "gelöst"? Die Tabelle "personen" enthält jetzt weder eine echte Großmutter noch ein Rotkäppchen – nirgends.

+++ notes
- Scheinbarer "Sieg" – Anführungszeichen um "gelöst?" betont vorlesen
- Umschwung zur These beginnt hier, nach Jubel kurz innehalten

---
# Moment... und jetzt?
- Das Märchen sagt: Der Jäger schneidet den Wolf auf und befreit Großmutter und Rotkäppchen – lebendig
-> CRUD sagt: dafür gibt es kein Verb
-> „In CRUD-basierten Systemen gibt es kein Undelete" – Golo Roden
-> Die einzige Möglichkeit, die CRUD kennt: ein neues CREATE

+++ notes
- Zentrale Wendestelle – 3 Fragmente einzeln klicken, Pause dazwischen
- Roden-Zitat betont vorlesen, Kern der Kritik

---
# RESTORE?
![Jäger sitzt panisch vor einer Data-Recovery-Konsole, die "BACKUP.OMA NOT FOUND" und "ALL RECOVERY PATHS LOST" meldet, der Wolf schaut ratlos zu](assets/oma_restore.png)
"Die Backups sind weg! Wie restore ich sie jetzt?" Es gibt kein Backup. Es gibt kein Rollback. Es gibt nur CREATE.

+++ notes
- Verzweiflung wirken lassen
- Caption wie Comic-Sprechblase vorlesen

---
# CREATE

```sql
INSERT INTO personen VALUES (2, 'Großmutter', ?, ?, ?), (1, 'Rotkäppchen', ?, ?, ?)
```

| id | name | status | ort | aussehen |
|---|---|---|---|---|
| 2 | Großmutter | ??? | ??? | ??? | warning |
| 1 | Rotkäppchen | ??? | ??? | ??? | warning |

```

      🤔

  "Wie waren die
   beiden nochmal...?"

  status:   ??? ✗
  ort:      ??? ✗
  aussehen: ??? ✗

  "Ich weiß
   es nicht."

    (¬_¬ ")

```

Zwei neue Zeilen mit den alten IDs. Sind das dieselben Personen wie vorher? Und – wie sahen die beiden eigentlich aus? CRUD weiß es nicht. Wir auch nicht.

+++ notes
- Twist-Höhepunkt: Spalte "aussehen" + "???" laut vorlesen
- Erstmals aussprechen: wir wissen nicht mehr, wie sie aussahen

---
# Fragen, die CRUD nicht beantworten kann
-> Wie genau sahen Großmutter und Rotkäppchen aus? Ein INSERT kennt ein name-Feld, kein Gesicht
-> Wann genau hat der Wolf zugeschlagen – und wen zuerst?
-> War die "Großmutter", mit der Rotkäppchen sprach, überhaupt echt?
-> Welches UPDATE war eine harmlose Ortsänderung, welches ein Betrug?
-> Sind die wiederhergestellten Personen dieselben wie vorher – und wie sollen wir das je beweisen?

+++ notes
- Fragmente einzeln klicken, Pause nach jeder Frage
- Erste Frage (Aussehen) am längsten stehen lassen

---
# CRUD spricht nicht unsere Sprache
- CREATE, READ, UPDATE, DELETE sind Datenbank-Begriffe – keine Fachbegriffe
- "Kunde storniert Bestellung", "Rolle wird delegiert", "Risiko wird neu bewertet" – alles wird zum selben UPDATE
- „Ein Update sagt nichts darüber aus, welche fachliche Änderung eingetreten ist" – Golo Roden
-> Golo Rodens Pointe: eigentlich hätte der Wolf nur ein Feld `isDeleted = true` setzen sollen – dann hätte der Jäger Oma später einfach... undeleted
-> Die Semantik verschwindet im Code

+++ notes
- isDeleted-Pointe stammt aus Rodens eigenem Podcast
- Als Callback zur eigenen Geschichte bringen, nicht als trockenes Zitat

---
# Wenn die Sprache bricht, bricht das Verständnis
- Entwickler reden von "Update" – das Business redet von "storniert" oder "eskaliert"
-> „Das Überschreiben von Zuständen verwischt Spuren. Wie ist ein Zustand entstanden? Welche Abfolge führte zu einem Fehler oder zu einem Erfolg?" – Golo Roden
-> Genau diese Spur fehlt uns bei Oma und Rotkäppchen: keiner weiß mehr, wie es wirklich war
-> Auch ein Märchen erzählt man nicht in vier Verben

+++ notes
- Zitat auf eigene Geschichte zurückbeziehen: wir wissen bis jetzt nicht, wie's wirklich war
- Moment, wo CRUD-Kritik und Märchen zusammenfallen

---
# Ein Gedankenexperiment: dieselbe Geschichte, anders erzählt
- Was, wenn wir nicht Zustände überschreiben, sondern erzählen, was geschah?
- Kein UPDATE, kein DELETE – nur Ereignisse, die dazukommen
-> RotkäppchenBetratWald
-> WolfVerschlangGroßmutter
-> JägerBefreiteBeide …

+++ notes
- Ruhiger Moment vor der Lösung, Tempo darf sinken
- 3 Ereignisnamen einzeln klicken, wie Kapitelüberschrift

---
# Die Geschichte als Ereignis-Log

```sql
SELECT * FROM ereignisse ORDER BY zeit
```

| # | ereignis | details |
|---|---|---|
| 1 | AuftragErteilt | { von: 'Mutter' } |
| 2 | WaldBetreten | { von: 'Rotkäppchen' } |
| 3 | GroßmutterVerschlungen | { täter: 'Wolf' } | danger |
| 4 | AlsGroßmutterVerkleidet | { täter: 'Wolf' } | danger |
| 5 | RotkäppchenVerschlungen | { täter: 'Wolf' } | danger |
| 6 | WolfGetötet | { täter: 'Jäger' } |
| 7 | GroßmutterUndRotkäppchenBefreit | { retter: 'Jäger' } | highlight |

Kein Undelete nötig. "Befreit" ist einfach ein neues Ereignis – eins, das an die Geschichte anknüpft, statt sie zu überschreiben. Und jedes Ereignis trägt sein eigenes Wissen: wie Rotkäppchen aussah, stand schon in AuftragErteilt – und geht nie mehr verloren.

+++ notes
- Zeilenweise vorgehen, "GroßmutterUndRotkäppchenBefreit" hervorheben
- Caption schließt Bogen zur Aussehen-Frage

---
# Event Sourcing
![Jäger lächelt an einem Laptop, auf dem "REPLAYING EVENT STREAM... COMPLETED" steht, während eine leuchtende, wiederhergestellte Großmutter neben dem verdutzten Wolf erscheint](assets/oma_restored.png)
"Easy! Dank Event Sourcing ist sie wieder da." Kein Zauber – nur ein Replay des Ereignis-Logs von Anfang an.

+++ notes
- Emotionaler Höhepunkt: Oma erscheint wieder
- Bild-Payoff wirken lassen vor abstrakteren Schlussfolgerungen

---
# Was sich ändert
- Korrektur statt Fälschung: ein Fehler wird nicht gelöscht, sondern durch ein neues Ereignis richtiggestellt
- Audit-Log gratis – es ist das System, kein Feature
-> Domain-Driven Design nennt das Ubiquitous Language: Ereignisnamen sind Fachbegriffe, keine Datenbank-Verben
-> Ereignisse gehören zu einem Aggregate – einer fachlichen Einheit mit eigenen Regeln, nicht nur einer Tabellenzeile
-> Die Vergangenheit bleibt lesbar, ganz ohne Raten

+++ notes
- Fragmente einzeln als Zusammenfassung klicken
- DDD-Begriffe kurz einordnen, nicht vertiefen
- Letzter Punkt = eigentliche Pointe (kein Rätselraten mehr)

---
# Großmutter lebt. Rotkäppchen auch.
Und vielleicht auch unsere Sprache – wenn wir aufhören, sie in vier Verben zu pressen.

+++ notes
- Warm & ruhig abschließen, Kontrast zum hektischen Mittelteil
- Kurze Pause vor Applaus/Fragen
