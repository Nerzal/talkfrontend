---
id: feature-tour-2026-07
title: talkfrontend – Feature-Tour
description: Eine selbst-erklärende Präsentation, die jedes Layout von talkfrontend zeigt und dabei erklärt, wie man es in Markdown schreibt.
year: 2026
month: 7
tags: [dokumentation, demo]
---

---
# talkfrontend\nFeature-Tour
## Wie du eine Präsentation als Markdown schreibst
Diese Folien sind selbst das Beispiel

+++ notes
Das ist ein Sprechernotiz-Beispiel: alles nach einer alleinstehenden "+++ notes"-Zeile
landet in `notes` und ist nur im Presenter-View (/talk/:id/presenter) sichtbar,
nie im normalen Zuschauer-View.

---
# Was du hier siehst

- Diese Präsentation ist eine ganz normale `talk.md`
- Jede Folie zeigt ein Feature UND erklärt direkt daneben, wie man es schreibt
- Quelldatei: `public/talks/feature-tour-2026-07/talk.md`
- Es gibt acht Layouts: title, content, code, image, blank, table, speaker, mixed
- Bullet-Listen können außerdem Schritt für Schritt per Klick erscheinen (Fragments)
- Presenter-Werkzeuge (Notizen, Zeichnen, Recording, Kamera, Sync) – dazu später mehr Folien

---
# Grundgerüst einer talk.md

- Oben ein YAML-Block zwischen zwei `---`-Zeilen mit id, title, year, month, ...
- Danach folgen die Folien, jede beginnt mit `--- <layout>`
- Alles bis zur nächsten `--- <layout>`-Zeile gehört zu dieser Folie
- Fertig – keine Kommentare, keine Sonderzeichen, nur Markdown und YAML

---
# Layout automatisch erkennen

- Der Trenner zwischen Folien ist einfach eine alleinstehende `---`-Zeile
- Ein Layout-Wort danach (`--- content`) ist nur noch nötig, um die Erkennung zu überschreiben
- Sonst wird das Layout allein aus dem Inhalt abgeleitet: Bullet-Liste -> content, Codezaun -> code, Bild -> image, Überschrift + Unterüberschrift -> title, reiner Text -> blank
- Mischt eine Folie mehrere dieser Arten (z. B. Bullet-Liste und Codezaun), wird daraus automatisch `mixed`
- table/speaker bleiben YAML und werden an ihrem ersten bekannten Feld erkannt (`columns:`, `heading:`, ...)

---
# Live-Beispiel: Titel ganz ohne Layout-Wort
## Nur eine Überschrift, Unterüberschrift und Autor
Erkannt als Layout "title"

---
# Live-Beispiel: Bullet-Liste ganz ohne Layout-Wort

- Diese Folie beginnt einfach mit `---` statt `--- content`
- Trotzdem wird daraus die richtige `content`-Folie
- Weil eine Bullet-Liste im Inhalt steckt

---
# So sieht das Frontmatter aus
```yaml
id: my-talk-2026-01
title: My Talk
description: Kurzbeschreibung
year: 2026
month: 1
tags: [beispiel]
```

---
# Layout: title

- `--- title` startet die Folie
- Die erste `# Überschrift` wird zum Titel
- Ein `\n` in der Überschrift erzeugt einen Zeilenumbruch (wie auf der ersten Folie hier)
- `## Unterüberschrift` wird zum Subtitle
- Die nächste normale Textzeile wird zum Autor

---
# Live-Beispiel
## Das ist der Subtitle
Das ist der Autor

---
# Layout: content

- `--- content` startet die Folie
- Die erste `# Überschrift` wird zum Folientitel
- Jede Zeile, die mit `- ` beginnt, wird ein Bulletpoint
- Genau das siehst du gerade

---
# Layout: code

- `--- code` startet die Folie
- Eine optionale `# Überschrift` davor wird zum Folientitel
- Danach ein normaler Markdown-Codezaun mit Sprache, z. B. drei Backticks + `go`
- Syntax-Highlighting passiert automatisch über Prism.js – keine Konfiguration nötig
- Unbekannte Sprachen werden einfach als reiner Text angezeigt

---
# Live-Beispiel: Go
```go
func main() {
    fmt.Println("Hallo Welt")
}
```

---
# Noch ein Beispiel: Bash
```bash
curl -s https://example.com/talks/index.json | jq .
```

---
# Code Schritt für Schritt: Magic Move

- Schreibst du mehrere Codezäune direkt hintereinander in einer `--- code`-Folie, werden sie zu Schritten
- `→`/Leertaste wechselt zuerst durch die Schritte, bevor zur nächsten Folie gesprungen wird
- Der Übergang wird animiert (Shiki Magic Move) – Zeilen morphen statt hart zu schneiden
- Shiki wird nur für Folien mit mehreren Schritten nachgeladen, andere Code-Folien bleiben leichtgewichtig (Prism)

---
# Live-Beispiel: Magic Move (→ drücken)
```go
type User struct {
    Name string
}
```
```go
type User struct {
    Name string
    Age  int
}
```
```go
type User struct {
    Name string
    Age  int
}

func (u User) Greet() string {
    return "Hallo " + u.Name
}
```

--- content
# Layout: image

- `--- image` startet die Folie
- Eine optionale `# Überschrift` davor wird zum Folientitel
- Markdown-Bildsyntax: `![Alt-Text](assets/foto.png)`
- Der Text direkt nach dem Bild wird zur Bildunterschrift
- Pfade sind relativ zum `assets/`-Ordner dieses Talks

---
# Live-Beispiel
![Ein Beispielfoto](assets/example.jpg)
So einfach wird ein Bild eingebunden

---
# Layout: blank

- `--- blank` startet die Folie
- Eine optionale `# Überschrift`
- Der restliche Text wird zum Fließtext
- Gedacht für Q&A- oder Übergangsfolien

---
# Fragen?
Nutze diese Folie für Q&A oder als Übergang zum nächsten Thema.

---
# Layout: table

- `--- table` startet die Folie (oder automatisch erkannt an einer Markdown-Tabelle)
- Optionale `# Überschrift`, optionaler SQL-Codezaun davor wird zum `statement`
- Danach eine normale Markdown-Tabelle: `| Spalte | ... |` + `|---|---|`
- Eine Zeile mit einer zusätzlichen letzten Zelle (`| 1 | Oma | highlight |`) setzt deren variant
- variant kann sein: normal, highlight, warning, danger, deleted; keine Datenzeilen = leere Tabelle
- Danach optional ein Bild oder ein weiterer Codezaun (ASCII-Art), dann die Bildunterschrift
- Alternativ geht auch reines YAML als kompletter Folieninhalt, wenn das besser passt (z. B. bei Sonderzeichen in Zellen)

---
# Live-Beispiel

```sql
INSERT INTO personen VALUES (1, 'Oma', 'gesund')
```

| id | name | status |
|---|---|---|
| 1 | Oma | gesund | highlight |

```
✨ INSERT ✨
neue Zeile!

```

Eine neue Zeile wird eingefügt.

---
# Layout: speaker

- `--- speaker` startet die Folie (oder automatisch erkannt an einem `[github](...)`-artigen Link)
- Optionale `# Überschrift`, optionales Bild fürs Foto, Bullet-Liste für facts
- Danach je Zeile ein Link: `[website]`, `[linkedin]`, `[github]`, `[twitter]`/`[x]`, `[bluesky]`, `[mastodon]`
- Jeder gesetzte Link bekommt automatisch einen QR-Code und, wo möglich, ein Icon
- Wird meist für `default-slides.md` (Intro/Outro) verwendet, geht aber auch in einem Talk
- Alternativ geht auch reines YAML als kompletter Folieninhalt, wenn das besser passt

---
# Live-Beispiel

- Erstellt mit talkfrontend
- Open Source

[github](https://github.com/nerzal/talkfrontend)

---
# Layout: mixed

- `--- mixed` startet die Folie
- Kombiniert Überschriften, Bulletpoints, Text und Code frei auf einer Folie
- Ganz normales Markdown, von oben nach unten gelesen – keine feste Reihenfolge
- `#` wird zur großen, `##` zur kleinen Überschrift, `- ` bleibt ein Bulletpoint

---
# Live-Beispiel
Ein `mixed`-Slide kann mehrere Inhaltsarten kombinieren.

## Warum das nützlich ist

- Kein Zwang, Code und Erklärung auf zwei Folien zu trennen
- Ideal für "hier ist der Code, und hier ist warum"

```go
func add(a, b int) int {
    return a + b
}
```

---
# Bild-Position in mixed-Folien

- Ein eigenständiges Bild kann eine Positions-Angabe bekommen: `![Alt](pfad) links|rechts|unter`
- `left`/`right` stellt das Bild in eine eigene Spalte neben den restlichen Inhalt
- `under` (Standard, auch ohne Angabe) rendert das Bild ganz normal im Textfluss
- `background` funktioniert überall (nicht nur bei mixed) als Alternative zu `+++ background <pfad>`

---
# Live-Beispiel: Bild links

![Ein Beispielfoto](assets/example.jpg) left

- Dieser Text steht rechts neben dem Bild
- Erzeugt allein durch das `left` nach dem Bildpfad

---
# Bildgröße: max-height/max-width in Prozent

- Nach dem Bildpfad können zwei Prozentwerte stehen: `![Alt](pfad) 50% 30%`
- Erster Wert ist die maximale Höhe, zweiter die maximale Breite
- Funktioniert bei `image`-Folien und bei Bildern in `mixed`-Folien
- Steht die Positions-Angabe (`left`/`right`/`under`) auch dabei, kommt sie danach: `50% 30% left`
- Ohne Angabe bleibt die bisherige Standardgröße erhalten

---
# Live-Beispiel: Bildgröße
![Ein Beispielfoto](assets/example.jpg) 40% 40%
Dieses Bild ist auf 40% Höhe und 40% Breite begrenzt

---
# Click-Animationen: Fragments

- `- ` zeigt einen Punkt sofort mit dem Rest der Folie
- `-> ` markiert ihn stattdessen als Fragment
- Ein Fragment bleibt unsichtbar, bis du weiterklickst oder → drückst
- Fragmente zählen wie die Code-Schritte als eigene Steps einer Folie
- Funktioniert in content- und mixed-Folien, für jede Bullet-Liste

---
# Live-Beispiel (→ drücken)

- Diese Zeile ist sofort sichtbar
-> Diese Zeile erscheint beim ersten Klick
-> Und diese beim zweiten
-> Erst danach geht's weiter zur nächsten Folie

---
# Presenter View

- Eigene Route `/talk/:id/presenter`, öffnet sich als neues Fenster
- Zeigt aktuelle und nächste Folie nebeneinander – als echte Vorschau, kein Nachbau
- Dazu Sprechernotizen und ein Timer (Start/Pause/Reset)
- "Open audience view" öffnet `/talk/:id` in einem zweiten Tab, beide bleiben live synchron

---
# Speaker Notes im Markdown

- Jede Folie kann mit einer alleinstehenden `+++ notes`-Zeile enden
- Alles danach wird `notes` – nur im Presenter-View sichtbar, nie im Publikum
- Diese Folie hier hat selbst solche Notizen – wirf im Presenter-View einen Blick darauf

+++ notes
Genau das ist eine Sprechernotiz: Sie taucht nur hier auf, nie im normalen Talk-View.

---
# Hintergrundbild für jede Folie

- Jede Folie kann mit einer alleinstehenden `+++ background <pfad>`-Zeile ein Hintergrundbild bekommen
- Funktioniert bei allen acht Layouts, nicht nur bei `image`
- Pfad ist relativ zum `assets/`-Ordner dieses Talks, genau wie bei anderen Bildern
- Der eigentliche Inhalt der Folie wird über einem abgedunkelten Hintergrund angezeigt, damit er lesbar bleibt

---
# Live-Beispiel
Dieser Text steht vor einem Hintergrundbild – erzeugt allein durch `+++ background assets/example.jpg`.

+++ background assets/example.jpg

---
# Zeichnen & Annotationen

- Der "Pen"-Button im Presenter-View aktiviert ein SVG-Overlay auf der Folie
- Striche speichern normalisierte (0..1) Koordinaten, unabhängig von der Fenstergröße
- Fertige Striche landen live im Audience-Fenster, "Clear drawing" leert sie dort ebenfalls
- Striche werden automatisch zurückgesetzt, sobald die Folie wechselt

---
# Aufnahme & Kamera-Overlay

- Der Record-Button nutzt `getDisplayMedia` + `MediaRecorder` – komplett im Browser
- Die Aufnahme lädt als `.webm`-Datei herunter, kein Server ist beteiligt
- Der Kamera-Button blendet eine kleine Picture-in-Picture-Webcam-Blase ein
- Beide Buttons verschwinden automatisch, wenn der Browser die jeweilige API nicht unterstützt

---
# Presenter- & Audience-Sync

- `usePresenterChannel` verbindet Presenter- und Audience-Fenster per `BroadcastChannel`
- Navigation und Zeichenstriche synchronisieren sich live, sobald beide Fenster offen sind
- Bewusst begrenzt auf denselben Browser, dasselbe Gerät
- Keine echte Fernsteuerung von einem zweiten Gerät – dafür bräuchte es einen Signaling-Server

---
# default-slides.md: Intro & Outro

- Genau zwei Folien, ganz ohne Frontmatter am Anfang
- `--- intro` und `--- end` – das Wort in der Trennzeile ist die feste ID, Layout wird wie überall erkannt
- Werden automatisch vor und nach jedem Talk eingefügt
- Einmal pflegen, gilt für alle Talks

---
# Pre-Intro-Folie

- Manchmal soll etwas noch vor der gemeinsamen Intro-Folie stehen (Titelkarte, Sponsor-Hinweis, Triggerwarnung, ...)
- Dafür eine eigene Folie im Talk mit der reservierten ID `0` markieren, z. B. `--- 0`
- Egal an welcher Stelle im Dokument sie steht: sie landet immer ganz vorne, noch vor der Intro-Folie
- Höchstens eine Pre-Intro-Folie pro Talk

--- 0
# Diese Folie steht vor der Intro
Erzeugt allein durch die ID `0` – unabhängig davon, wo sie im Dokument steht.

---
# Das war's!
Wirf einen Blick in public/talks/feature-tour-2026-07/talk.md – diese Präsentation ist selbst das Beispiel für alle acht Layouts, Fragments und die Presenter-Werkzeuge.
