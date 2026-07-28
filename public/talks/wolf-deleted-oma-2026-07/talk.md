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
- Kurz warten, Titel wirken lassen. Präsenz zeigen.
- Wir sind hier auf einem Code Meetup, aber wir fangen an mit einem Märchen.
- "Herzlich willkommen. Wir reden heute über Architektur, Datenbanken und... Rotkäppchen."

---
# Eine Geschichte, vier Verben
-> Wir erzählen Rotkäppchen. Ganz normal.
-> Unser Werkzeugkasten: CREATE, READ, UPDATE, DELETE (CRUD).
-> Mehr Verben gibt es in unserer Datenbank nicht. Mehr Sprache braucht es also auch nicht.
-> Mal sehen, wie weit wir damit kommen.

+++ notes
- Für die Junioren/Studenten im Raum: Kurz CRUD ausschreiben (Create, Read, Update, Delete) und als absoluten Standard der Industrie einordnen.
- Prämisse klarmachen: Ab jetzt zwingen wir das Märchen in die gnadenlose Logik von SQL.

---
# Create Großmutter

```sql
INSERT INTO personen VALUES (0, 'Großmutter', 'braucht Medizin', 'Omas Zuhause')
```

| id | name | status | ort |
|---|---|---|---|
| 0 | Großmutter | braucht Medizin | Omas Zuhause | highlight |

![Oma wurde created](assets/oma_created.png)

+++ notes
- Es createte einmal eine Großmutter
- Ihr status reads: hungrig
- Ihr ort reads: Zuhause
- Sie braucht wohl Medizin


---
# Create Rotkäppchen

```sql
INSERT INTO personen VALUES (1, 'Rotkäppchen', 'fröhlich', 'Zuhause')
```

| id | name | status | ort |
|---|---|---|---|
| 0 | Großmutter | braucht Medizin | Omas Zuhause |
| 1 | Rotkäppchen | fröhlich | Zuhause | highlight |

![Rotkäppchen wurde created](assets/rotkäppchen_create.png)

+++ notes
- Es createte einmal ein Rotkäppchen
- Ihr status reads: fröhlich
- Ihr ort reads: Zuhause

---
# Update Auftrag

```sql
UPDATE personen SET status = 'Auftrag erhalten' WHERE id = 1
```

| id | name | status | ort |
|---|---|---|---|
| 0 | Großmutter | braucht Medizin | Omas Zuhause |
| 1 | Rotkäppchen | Auftrag erhalten | Zuhause | highlight |

![Rotkäppchen erhält auftrag](assets/rottkäppchen_update_auftrag.png)

+++ notes
 - Rottkäppchens mutter updated: status

---
# Create Wolf

```sql
INSERT INTO personen VALUES (2, 'Wolf', 'hungrig', 'Im Wald')
```

| id | name | status | ort |
|---|---|---|---|
| 0 | Großmutter | braucht Medizin | Omas Zuhause |
| 1 | Rotkäppchen | Auftrag erhalten | Zuhause | 
| 2 | Wolf | hungrig | Im Wald | highlight |

![Wolf wurde created](assets/wolf_created.png)

+++ notes
- Es createte alsbald ein Wolf
- Sein status reads: hungrig
- Sein ort reads: Im Wald

---

# Update Unterwegs

```sql
UPDATE personen SET status = 'unterwegs' and ort = 'Wald' WHERE id = 1
```

| id | name | status | ort |
|---|---|---|---|
| 0 | Großmutter | braucht Medizin | Omas Zuhause |
| 1 | Rotkäppchen | unterwegs | Wald | 
| 2 | Wolf | hungrig | Im Wald | 

![Rotkäppchen läuft durch den Wald auf einen wartenden Wolf zu](assets/rottkäpchen_updated_position.png)

+++ notes
- Bild kurz wirken lassen vor Caption.
- Wolf im Hintergrund selbst entdecken lassen. "Ein klassischer unautorisierter Lesezugriff."
- Privilege escalation: Unauthorized Read

---
# UPDATE Ort

```sql
UPDATE personen SET ort = 'Omas Haus' WHERE id = 2
```

| id | name | status | ort |
|---|---|---|---|
| 0 | Großmutter | braucht Medizin | Omas Zuhause |
| 1 | Rotkäppchen | unterwegs | Wald | 
| 2 | Wolf | unterwegs | Omas Haus | danger |

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
- Tempo anziehen, Slide kurz halten.
- Lacher mitnehmen: "Ein UPDATE kennt kein Tempolimit."

---
# DELETE Großmutter

```sql
DELETE FROM personen WHERE id = 0
```

| id | name | status | ort |
|---|---|---|---|
| 0 | Großmutter | gesund | Omas Haus | deleted |
| 1 | Rotkäppchen | unterwegs | Wald | 
| 2 | Wolf | unterwegs | Omas Haus | 

![Wolf deleted Großmutter](assets/wolf_deleted_oma.png)

+++ notes
- Erster harter Cut – Ton kurz ernster.
- "Der Wolf frisst die Großmutter. In SQL heißt das..." (Zeile zeigen).
- Lachpause aushalten, nicht zu schnell weiter.

---
# UPDATE

```sql
UPDATE personen SET name = 'Großmutter', status = 'trägt Nachthemd', ort = 'Bett' WHERE id = 2
```

| id | name | status | ort |
|---|---|---|---|
| 1 | Rotkäppchen | unterwegs | Wald | 
| 2 | Großmutter | trägt Nachthemd | Bett | danger |

```
  🐺 + 👗 + 🛏️

   * P O O F *
    ~~~✨~~~

    /\_/\
  ( ò.ó )
  "Ich bin
   Großmutter!"
```

Der Wolf updated sein eigenes Profil. Dieselbe id = 3 wie vorher, aber niemand sieht das mehr. Ein UPDATE prüft keine Wahrheit, nur Felder.

+++ notes
- Kernstelle des Talks! 
- "Die ID bleibt 3, aber der Name lügt jetzt." Laut und deutlich betonen.
- "Das System ist jetzt inkonsistent zur Realität, aber die Datenbank sagt: Query OK, 1 row affected."

---
# READ

```sql
SELECT augen, ohren, zaehne FROM personen WHERE id = 3
```

| merkmal | wert |
|---|---|
| augen | ungewöhnlich groß | warning |
| ohren | ungewöhnlich groß | warning |
| zaehne | lebensgefährlich | danger |

![Rotkäppchen reads Oma](assets/rottkäppchen_reads_attributes.png)

+++ notes
- Cliffhanger – dramatische Pause vor "SPRUNG".
- Timing wichtiger als Tempo, Stille aushalten.
- Rotkäppchen macht einen fatalen Lesezugriff auf gefälschte Daten.

---
# DELETE

```sql
DELETE FROM personen WHERE id = 1
```

| id | name | status | ort |
|---|---|---|---|
| 1 | Rotkäppchen | erschrocken | Omas Zuhause | deleted | 
| 2 | Großmutter | trägt Nachthemd | Bett | 

![Rotkäppchen löst sich am Fußende des Betts in Pixel auf, der Wolf liegt als Oma verkleidet im Bett](assets/rotkäppchen_deleted.png)

+++ notes
- Zweiter harter Cut.
- Bild zeigt beide Opfer. "Die Datenbank ist jetzt sehr ordentlich aufgeräumt. Zu ordentlich."
- Der Wolf deleted Rotkäppchen. Die echte Oma und das echte Rotkäppchen existieren in keiner Tabelle mehr.



---
# Create Jäger

```sql
INSERT INTO personen VALUES (4, 'Jäger', 'alarmiert', 'Vor Omas Zuhause');
```

| id | name | status | ort |
|---|---|---|---|
| 2 | Großmutter | trägt Nachthemd | Bett | 
| 4 | Jäger | alarmiert | Vor Omas Zuhause | highlight |

![Jäger wurde created](assets/jäger_created.png)

+++ notes
- Es createte einmal eine Großmutter
- Ihr status reads: hungrig
- Ihr ort reads: Zuhause
- Sie braucht wohl Medizin


---
# DELETE Wolf

```sql
DELETE FROM personen WHERE id = 2;
```

| id | name | status | ort |
|---|---|---|---|
| 4 | Jäger | alarmiert | Omas Haus | highlight |
| 2 | Großmutter | satt | Bett | deleted |

```
  🪓 Jäger: "HEUTE NICHT!"

  *WUUUSH!* 💨  *C-H-O-P!* 🪓
```

+++ notes
- Wolf deleted. Problem "gelöst"? 
- Scheinbarer "Sieg". Anführungszeichen um "gelöst?" betont in die Luft malen.
- Nach dem Jubel kurz innehalten. Der Wendepunkt des Vortrags.

---
# Moment... und jetzt?
- Das Märchen sagt: Der Jäger schneidet den Wolf auf und befreit Großmutter und Rotkäppchen.
-> CRUD sagt: Dafür gibt es kein Verb.
-> „In CRUD-basierten Systemen gibt es kein Undelete." – Golo Roden
-> Die einzige Möglichkeit, die CRUD noch kennt: ein neues CREATE.

+++ notes
- Zentrale Wendestelle – 3 Fragmente einzeln klicken, Pause dazwischen.
- Roden-Zitat betont vorlesen.
- Ins Publikum schauen (zu den Seniors): "Wer von euch musste schon mal versehentlich gelöschte Daten aus einem Datenbank-Dump von gestern Nacht rekonstruieren?"

---
# RESTORE?
![Jäger sitzt panisch vor einer Data-Recovery-Konsole, die "BACKUP.OMA NOT FOUND" und "ALL RECOVERY PATHS LOST" meldet, der Wolf schaut ratlos zu](assets/oma_restore.png)

"Die Backups sind weg! Wie restore ich sie jetzt?" 
Es gibt kein Backup. Es gibt kein Rollback. Es gibt nur CREATE.

+++ notes
- Verzweiflung wirken lassen.
- Die Realität vieler alter Legacy-Systeme.

---
# CREATE

```sql
INSERT INTO personen VALUES (?, 'Großmutter', ?, ?, ?), (?, 'Rotkäppchen', ?, ?, ?)
```

| id | name | status | ort | aussehen |
|---|---|---|---|---|
| ??? | Großmutter | ??? | ??? | ??? | warning |
| ??? | Rotkäppchen | ??? | ??? | ??? | warning |

```
      🤔 "Wie waren die beiden nochmal...?"

  status:   ??? ✗
  ort:      ??? ✗
  aussehen: ??? ✗
```

Zwei neue Zeilen mit den alten IDs. Sind das dieselben Personen wie vorher? Und – wie sahen die beiden eigentlich aus? CRUD weiß es nicht. Wir auch nicht.

+++ notes
- Twist-Höhepunkt: Spalte "aussehen" + "???" laut vorlesen.
- Der kritische Moment des Datenverlusts ist nicht das Delete, sondern der Verlust der Historie.

---
# Fragen, die CRUD nicht beantworten kann
-> **Märchen:** Wie genau sahen Großmutter und Rotkäppchen aus?
-> **Realität:** Was stand ursprünglich im Vertrag, bevor er 5x geupdated wurde?
-> **Märchen:** Wann genau hat der Wolf zugeschlagen – und wen zuerst?
-> **Realität:** Welche Aktionen haben zu diesem kritischen Systemfehler um 3 Uhr nachts geführt?
-> **Märchen:** Sind die wiederhergestellten Personen dieselben wie vorher?
-> **Realität:** Ist das Audit-Log lückenlos beweisbar?

+++ notes
- Fragmente einzeln klicken. 
- Hier schlagen wir die Brücke zum echten Business. Die Parallelen zwischen Märchen und echten Tickets aufzeigen.

---
# CRUD spricht nicht unsere Sprache
-> CREATE, READ, UPDATE, DELETE sind Datenbank-Begriffe – keine Fachbegriffe.
-> "Kunde storniert Bestellung", "Adresse korrigiert", "Mahnlauf gestartet" – alles wird zum selben dummen `UPDATE`.
-> „Ein Update sagt nichts darüber aus, welche **fachliche Änderung** eingetreten ist." – Golo Roden
-> Die Semantik, der **Grund** für die Änderung, verschwindet im Code.

+++ notes
- Golo Rodens Kritikpunkt auf den Punkt bringen.
- "Unsere Software soll Geschäftsprozesse abbilden, aber wir zwingen sie, wie eine glorifizierte Excel-Tabelle zu sprechen."

---
# Wenn die Sprache bricht, bricht das Verständnis
- Entwickler reden von `status = 4` – das Business redet von "eskaliert".
-> „Das Überschreiben von Zuständen verwischt Spuren. Wie ist ein Zustand entstanden?" – Golo Roden
-> Genau diese Spur fehlt uns bei Oma und Rotkäppchen: Keiner weiß mehr, wie es wirklich war.
-> **Domain-Driven Design (DDD)** fordert eine *Ubiquitous Language* (Allgegenwärtige Sprache).
-> Auch ein Märchen erzählt man nicht in vier Verben.

+++ notes
- Zitat auf eigene Geschichte zurückbeziehen.
- Den Begriff "Ubiquitous Language" einführen. Product Owner und Devs müssen dieselbe Sprache sprechen.

---
# Ein Gedankenexperiment: Die Geschichte neu erzählen
- Was, wenn wir Zustände nicht mehr überschreiben?
-> Kein UPDATE, kein DELETE. Wir speichern nur noch die **Ereignisse** (Domain Events), die passieren.
-> `RotkäppchenBetratWald`
-> `WolfVerschlangGroßmutter`
-> `JägerBefreiteBeide`

+++ notes
- Ruhiger Moment vor der Lösung.
- 3 Ereignisnamen einzeln klicken. Klingen wie Kapitelüberschriften.

---
# Die Geschichte als Ereignis-Log (Append-Only)

```sql
SELECT * FROM ereignisse ORDER BY zeit
```

| # | ereignis | details |
|---|---|---|
| 1 | AuftragErteilt | { von: 'Mutter', aussehen: 'rote Kappe' } |
| 2 | WaldBetreten | { von: 'Rotkäppchen' } |
| 3 | GroßmutterVerschlungen | { täter: 'Wolf' } | danger |
| 4 | AlsGroßmutterVerkleidet | { täter: 'Wolf' } | danger |
| 5 | RotkäppchenVerschlungen | { täter: 'Wolf' } | danger |
| 6 | WolfGetötet | { täter: 'Jäger' } |
| 7 | GroßmutterUndRotkäppchenBefreit | { retter: 'Jäger' } | highlight |

+++ notes
- Kein Undelete nötig. "Befreit" ist ein neues Ereignis. Und das Wissen, wie Rotkäppchen aussah, steht sicher in Event #1. Es geht nie verloren.
- Zeilenweise vorgehen. Betonen, dass wir hier nur noch "anhängen" (Append-Only). Niemals löschen.
- Die Historie ist der State.

---
# Event Sourcing
![Jäger lächelt an einem Laptop, auf dem "REPLAYING EVENT STREAM... COMPLETED" steht, während eine leuchtende, wiederhergestellte Großmutter neben dem verdutzten Wolf erscheint](assets/oma_restored.png)

"Easy! Dank Event Sourcing ist sie wieder da." 
Kein Zauber – nur ein **Replay** des Ereignis-Logs von Anfang an. 

+++ notes
- Emotionaler Höhepunkt: Oma ist wieder da.
- Erklären, dass der aktuelle Zustand nur die Summe (Fold/Reduce) aller vergangenen Ereignisse ist.

---
# Was sich ändert
- **Korrektur statt Fälschung:** Ein Fehler wird nicht gelöscht, sondern durch ein Kompensations-Ereignis richtiggestellt (wie in der Buchhaltung).
-> **Audit-Log gratis:** Es ist die Kernarchitektur des Systems, kein angeflanschtes Feature.
-> **Ubiquitous Language:** Unsere Code-Events heißen genau so, wie die Fachabteilung spricht.
-> Die Vergangenheit bleibt lesbar. Ganz ohne Rätselraten um 3 Uhr nachts.

+++ notes
- Zusammenfassung der Vorteile.
- Buchhaltungs-Vergleich zieht immer: "Banken machen seit 500 Jahren Event Sourcing. Da wird auch kein Kontostand per UPDATE überschrieben."

---
# Aber: Kein Märchen ohne Haken
- Event Sourcing ist **keine Silver Bullet**.
-> **Komplexität steigt:** CQRS (Command Query Responsibility Segregation) wird oft zur Pflicht, um Daten performant lesen zu können (Read Models / Projections).
-> **Eventual Consistency:** Das System ist vielleicht nicht immer auf die Millisekunde synchron.
-> **Event Versionierung:** Was, wenn sich das Schema von `AuftragErteilt` nach 2 Jahren ändert?

+++ notes
- Wer nur die Vorteile nennt, macht Sales. Wer die Nachteile kennt, ist Engineer.
- "Nutzt ES nur, wenn die Historie der Daten echten fachlichen Wert hat."

--- 
# Create Clippy: Eventual Consistency

```sql
INSERT INTO personen VALUES (5, 'Clippy', 'hungrig', 'Im Wald')
```

| id | name | status | ort |
|---|---|---|---|
| 5 | Clippy | hungrig | Im Wald | highlight |

![Rotkäppchen wurde created](assets/clippy_created.png)

+++ notes
- Überrascht tun
- Daher kommt der also
- Irgendwann, passt der State
- War halt asynchron

---
# Großmutter lebt. Rotkäppchen auch.
Und vielleicht auch unsere Architektur – wenn wir aufhören, die Realität in vier Verben zu pressen.

Vielen Dank!

+++ notes
- Warm & ruhig abschließen, Kontrast zum hektischen Mittelteil.
- Kurze Pause.
- "Ich freue mich auf eure Fragen!"
