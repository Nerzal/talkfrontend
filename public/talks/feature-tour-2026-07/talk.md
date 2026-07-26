---
id: feature-tour-2026-07
title: talkfrontend – Feature-Tour
description: Eine selbst-erklärende Präsentation, die jedes Layout von talkfrontend zeigt und dabei erklärt, wie man es in Markdown schreibt.
year: 2026
month: 7
tags: [dokumentation, demo]
---

--- title
# talkfrontend\nFeature-Tour
## Wie du eine Präsentation als Markdown schreibst
Diese Folien sind selbst das Beispiel

--- content
# Was du hier siehst

- Diese Präsentation ist eine ganz normale `talk.md`
- Jede Folie zeigt ein Feature UND erklärt direkt daneben, wie man es schreibt
- Quelldatei: `public/talks/feature-tour-2026-07/talk.md`
- Es gibt acht Layouts: title, content, code, image, blank, table, speaker, mixed

--- content
# Grundgerüst einer talk.md

- Oben ein YAML-Block zwischen zwei `---`-Zeilen mit id, title, year, month, ...
- Danach folgen die Folien, jede beginnt mit `--- <layout>`
- Alles bis zur nächsten `--- <layout>`-Zeile gehört zu dieser Folie
- Fertig – keine Kommentare, keine Sonderzeichen, nur Markdown und YAML

--- code
# So sieht das Frontmatter aus
```yaml
id: my-talk-2026-01
title: My Talk
description: Kurzbeschreibung
year: 2026
month: 1
tags: [beispiel]
```

--- content
# Layout: title

- `--- title` startet die Folie
- Die erste `# Überschrift` wird zum Titel
- Ein `\n` in der Überschrift erzeugt einen Zeilenumbruch (wie auf der ersten Folie hier)
- `## Unterüberschrift` wird zum Subtitle
- Die nächste normale Textzeile wird zum Autor

--- title
# Live-Beispiel
## Das ist der Subtitle
Das ist der Autor

--- content
# Layout: content

- `--- content` startet die Folie
- Die erste `# Überschrift` wird zum Folientitel
- Jede Zeile, die mit `- ` beginnt, wird ein Bulletpoint
- Genau das siehst du gerade

--- content
# Layout: code

- `--- code` startet die Folie
- Eine optionale `# Überschrift` davor wird zum Folientitel
- Danach ein normaler Markdown-Codezaun mit Sprache, z. B. drei Backticks + `go`
- Syntax-Highlighting passiert automatisch über Prism.js – keine Konfiguration nötig
- Unbekannte Sprachen werden einfach als reiner Text angezeigt

--- code
# Live-Beispiel: Go
```go
func main() {
    fmt.Println("Hallo Welt")
}
```

--- code
# Noch ein Beispiel: Bash
```bash
curl -s https://example.com/talks/index.json | jq .
```

--- content
# Code Schritt für Schritt: Magic Move

- Schreibst du mehrere Codezäune direkt hintereinander in einer `--- code`-Folie, werden sie zu Schritten
- `→`/Leertaste wechselt zuerst durch die Schritte, bevor zur nächsten Folie gesprungen wird
- Der Übergang wird animiert (Shiki Magic Move) – Zeilen morphen statt hart zu schneiden
- Shiki wird nur für Folien mit mehreren Schritten nachgeladen, andere Code-Folien bleiben leichtgewichtig (Prism)

--- code
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

--- image
# Live-Beispiel
![Ein Beispielfoto](assets/example.jpg)
So einfach wird ein Bild eingebunden

--- content
# Layout: blank

- `--- blank` startet die Folie
- Eine optionale `# Überschrift`
- Der restliche Text wird zum Fließtext
- Gedacht für Q&A- oder Übergangsfolien

--- blank
# Fragen?
Nutze diese Folie für Q&A oder als Übergang zum nächsten Thema.

--- content
# Layout: table

- `--- table` startet die Folie
- Der komplette Inhalt bis zur nächsten Folie ist YAML – kein Markdown
- Felder: title, statement, columns, rows (cells + optional variant), caption, ascii
- variant kann sein: normal, highlight, warning, danger, deleted
- ascii ist optional und zeigt eine kleine Text-Animation neben der Tabelle

--- table
title: Live-Beispiel
statement: "INSERT INTO personen VALUES (1, 'Oma', 'gesund')"
columns: [id, name, status]
rows:
  - cells: ['1', 'Oma', 'gesund']
    variant: highlight
caption: Eine neue Zeile wird eingefügt.
ascii: |
  ✨ INSERT ✨
  neue Zeile!

--- content
# Layout: speaker

- `--- speaker` startet die Folie
- Genau wie table: der ganze Inhalt ist YAML
- Felder: heading, photo, facts, website, linkedin, github, twitter, bluesky, mastodon
- Jeder gesetzte Link bekommt automatisch einen QR-Code und, wo möglich, ein Icon
- Wird meist für `default-slides.md` (Intro/Outro) verwendet, geht aber auch in einem Talk

--- speaker
heading: Live-Beispiel
facts: [Erstellt mit talkfrontend, Open Source]
github: https://github.com/nerzal/talkfrontend

--- content
# Layout: mixed

- `--- mixed` startet die Folie
- Kombiniert Überschriften, Bulletpoints, Text und Code frei auf einer Folie
- Ganz normales Markdown, von oben nach unten gelesen – keine feste Reihenfolge
- `#` wird zur großen, `##` zur kleinen Überschrift, `- ` bleibt ein Bulletpoint

--- mixed
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

--- content
# default-slides.md: Intro & Outro

- Genau zwei Folien, ganz ohne Frontmatter am Anfang
- `--- speaker intro` und `--- speaker end` – das zweite Wort in der Trennzeile ist die feste ID
- Werden automatisch vor und nach jedem Talk eingefügt
- Einmal pflegen, gilt für alle Talks

--- blank
# Das war's!
Wirf einen Blick in public/talks/feature-tour-2026-07/talk.md – diese Präsentation ist selbst das Beispiel für alle acht Layouts.
