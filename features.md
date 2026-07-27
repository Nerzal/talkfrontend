# Slide-Features: Slidev & Marp vs. talkfrontend

Diese Liste erfasst Slide-bezogene Features, die [Slidev](https://sli.dev) und/oder [Marp](https://marp.app) mitbringen, die es in diesem Projekt (Stand: aktueller Codebase-Scan, `src/data/types.ts`, `src/components/slides/`) noch nicht gibt. Reine Tooling-Features ohne Bezug zur Slide-Darstellung/-Navigation (z. B. VS Code Extension, Prettier-Plugin, GitHub-Copilot-Integration) sind bewusst ausgeklammert.

Jeder Eintrag nennt die Quelle (Slidev / Marp / beide), was das Feature tut, und was bei uns aktuell existiert bzw. fehlt.

## Innerhalb einer Folie: Reveal & Animation

### Click-Animationen / Fragments (`v-click`, inkrementelle Listen)

- **Quelle:** Slidev (`v-click`, `v-clicks`, `v-after`) & Marp (fragmentierte Listen)
- **Was es tut:** Einzelne Elemente einer Folie (Bullet-Punkte, Absätze, Bilder) erscheinen nacheinander per Klick/Pfeiltaste, statt dass die ganze Folie auf einmal sichtbar wird.
- **Bei uns:** Nicht vorhanden. `ContentSlide`/`MixedSlide` rendern alle Bullets sofort. Einzige Ausnahme ist der stufenweise Code-Slide (`CodeSlide.steps` + Magic Move), der aber nur für Code-Blöcke existiert, nicht für Text/Bullets/Bilder.

### `@vueuse/motion` / freie Animationen (`v-motion`)

- **Quelle:** Slidev
- **Was es tut:** Beliebige CSS-Transform-/Opacity-Animationen pro Element, deklarativ im Markdown/Vue-Template steuerbar.
- **Bei uns:** Nicht vorhanden. Es gibt genau eine feste CSS-Keyframe-Animation (`slideIn`, `src/index.css`), die beim Folienwechsel auf den gesamten Foliencontainer angewendet wird — nicht pro Element und nicht konfigurierbar.

### Folienübergänge (Slide Transitions)

- **Quelle:** Slidev (per-Deck/per-Folie `transition:` Frontmatter, z. B. fade/slide-left/slide-up) & Marp (`transition:`-Directive via View Transition API)
- **Was es tut:** Auswahl/Konfiguration des Übergangseffekts zwischen zwei Folien.
- **Bei uns:** Nicht vorhanden. Nur ein fest verdrahteter `slideIn`-Effekt für jede Folie, keine Auswahl unterschiedlicher Übergänge.

## Presenter-Werkzeuge — ✅ jetzt implementiert

Diese Kategorie wurde nachträglich umgesetzt (siehe `/talk/:id/presenter`). Einträge bleiben hier stehen, um die Slidev/Marp-Referenz sichtbar zu halten, aber der "Bei uns"-Teil beschreibt jetzt den tatsächlichen Stand statt einer Lücke.

### Presenter Mode / Speaker View

- **Quelle:** Slidev & Marp
- **Was es tut:** Separates Fenster/View für den Vortragenden mit Sprechernotizen, Vorschau der nächsten Folie, Timer/Uhrzeit — während das Publikum nur die reine Folie sieht.
- **Bei uns:** Implementiert als eigene Route `/talk/:id/presenter` (`src/pages/PresenterView.tsx`). Zeigt die aktuelle Folie (per `ScaledSlidePreview`), die nächste Folie, Sprechernotizen und einen Timer (`useElapsedTimer`). "Open audience view" öffnet `/talk/:id` in einem neuen Tab; beide Tabs synchronisieren sich live über `usePresenterChannel` (BroadcastChannel, siehe unten bei Remote Control für die Reichweite dieser Sync).

### Speaker Notes im Markdown

- **Quelle:** Slidev (HTML-Kommentar am Folienende) & Marp (`<!-- notes: ... -->` bzw. eigener Notes-Block)
- **Was es tut:** Notizen pro Folie, die nur im Presenter Mode sichtbar sind, nie im Publikums-View.
- **Bei uns:** Implementiert, aber bewusst ohne HTML-Kommentare (passend zum minimalen `talk.md`-Format): eine Folie kann mit einer alleinstehenden `+++ notes`-Zeile enden, alles danach ist `notes` (`src/data/markdown/extractNotes.ts`, fence-aware wie der Folien-Separator). Das `notes`-Schlüsselwort verhindert Kollisionen mit einem bloßen `+++`, das z. B. als Diff-Header-Zeile in normalem Fließtext vorkommen könnte. `notes` ist ein optionales Feld auf jedem `Slide`-Typ (`src/data/types.ts`) und wird nur in `PresenterView` angezeigt.

### Zeichnen & Annotationen (Drawing)

- **Quelle:** Slidev (via `drauu`, live synchronisiert zwischen Presenter- und Audience-View)
- **Was es tut:** Während der Präsentation direkt auf die Folie zeichnen/markieren (z. B. mit Stift-Tool), sichtbar für alle verbundenen Ansichten.
- **Bei uns:** Implementiert über `DrawingCanvas.tsx` — ein SVG-Overlay mit normalisierten (0..1) Koordinaten, das Freihand-Striche aufnimmt. Im Presenter-View per "Pen"-Button aktivierbar; fertige Striche werden per `usePresenterChannel` an alle Audience-Fenster gesendet und dort read-only gerendert. Striche werden pro Folie zurückgesetzt, "Clear drawing" leert sie explizit auch im Audience-Fenster.

### Aufnahme (Recording) & Kamera-Overlay

- **Quelle:** Slidev (RecordRTC-Integration, Kamera-Bild als Overlay, OBS-Kompatibilität)
- **Was es tut:** Vortrag direkt aus der App heraus als Video aufzeichnen, optional mit Webcam-Bild eingeblendet.
- **Bei uns:** Implementiert rein lokal im Browser, ohne Server: `useScreenRecording.ts` nutzt `getDisplayMedia` + `MediaRecorder` und lädt die Aufnahme als `.webm`-Datei herunter (Bildschirm-/Fenster-/Tab-Auswahl über den Browser-eigenen Picker); `useCameraOverlay.ts` nutzt `getUserMedia` für eine kleine Picture-in-Picture-Kamerablase. Beide als Buttons in `SlideControls`/`PresenterView` verfügbar; rendern sich selbst weg (`null`), wenn der Browser die API nicht unterstützt.

### Remote Control / Multi-Device-Sync

- **Quelle:** Slidev
- **Was es tut:** Präsentation von einem zweiten Gerät (Handy/Tablet) aus steuern, Zustand (aktuelle Folie, Notizen) wird live synchronisiert.
- **Bei uns:** Teilweise implementiert — bewusst eingeschränkt auf **denselben Browser, dasselbe Gerät**: `usePresenterChannel.ts` synchronisiert Presenter- und Audience-Fenster über die `BroadcastChannel`-API (z. B. Presenter-Fenster auf dem Laptop-Bildschirm steuert ein Audience-Fenster auf dem Beamer). Es gibt bewusst **keine** echte Cross-Device-Fernsteuerung (z. B. vom Handy aus) — das würde einen Signaling-Server erfordern, was dem rein statischen, `fetch()`-basierten Architekturprinzip dieser App widerspräche (siehe `CLAUDE.md`). Diese Grenze ist dokumentiert, keine versteckte Lücke.

## Export

### PDF- / PPTX- / PNG-Export

- **Quelle:** Slidev (`--export`, unterstützt PDF, PPTX, PNG, mit/ohne Click-Animationen "aufgelöst") & Marp (CLI-Export nach HTML, PDF, PPTX, JPG, PNG, SVG)
- **Was es tut:** Den kompletten Talk als Datei exportieren, z. B. um ihn offline weiterzugeben oder auszudrucken.
- **Bei uns:** Nicht vorhanden. Talks existieren nur als gerenderte Web-App (`fetch()`-basiert, siehe `loadTalks.ts`), es gibt keine Export-Pipeline.

### Statisches Standalone-Hosting einzelner Talks

- **Quelle:** Slidev (`slidev build` erzeugt eine eigenständige statische Seite pro Deck)
- **Was es tut:** Ein einzelner Talk lässt sich unabhängig von der restlichen App als eigenständige Website bauen/deployen.
- **Bei uns:** Nicht direkt vorgesehen — die App lädt immer alle Talks aus `VITE_TALKS_DIR` gemeinsam; es gibt keinen Build-Modus für "nur ein Talk".

## Code

### Live-Code-Editor (Monaco) im Slide

- **Quelle:** Slidev
- **Was es tut:** Code-Blöcke sind direkt in der Präsentation editierbar (Monaco Editor mit IntelliSense), nicht nur statisch dargestellt.
- **Bei uns:** Nicht vorhanden. `CodeSlide`/`MagicMoveCodeSlide` zeigen nur statisch gehighlighteten, nicht editierbaren Code (Prism bzw. Shiki Magic Move für Steps).

### Code Runner (Code-Ausführung im Slide)

- **Quelle:** Slidev
- **Was es tut:** Code-Snippet direkt während der Präsentation ausführen und Ergebnis/Output anzeigen.
- **Bei uns:** Nicht vorhanden.

### TypeScript Twoslash

- **Quelle:** Slidev
- **Was es tut:** Inline-Typinformationen beim Hovern über TS-Code-Beispiele, wie im TS Playground.
- **Bei uns:** Nicht vorhanden.

### Zeilen-Highlighting / Focus in Code-Blöcken

- **Quelle:** Slidev (`{1,3-5}`-Syntax zum Hervorheben bestimmter Zeilen, auch schrittweise wechselnd)
- **Was es tut:** Bestimmte Codezeilen hervorheben oder dimmen, um den Blick zu lenken — unabhängig vom kompletten Austausch des Codeblocks.
- **Bei uns:** Nicht vorhanden. Es gibt nur den Ganzblock-Wechsel über `steps` (Magic Move morpht den gesamten Block), keine gezielte Zeilenhervorhebung innerhalb eines unveränderten Blocks.

## Inhalte / Rich Content

### Mathe-Formeln (LaTeX via KaTeX)

- **Quelle:** Slidev & Marp (beide über KaTeX-Integration)
- **Was es tut:** `$...$`/`$$...$$`-Syntax im Markdown wird zu gesetzten mathematischen Formeln gerendert.
- **Bei uns:** Nicht vorhanden — kein Layout und kein Markdown-Parsing dafür.

### Diagramme (Mermaid)

- **Quelle:** Slidev
- **Was es tut:** Flowcharts, Sequenzdiagramme, Gantt-Charts etc. aus Text-Syntax in Markdown-Codeblöcken generiert.
- **Bei uns:** Nicht vorhanden. `TableSlide` hat ein `ascii`-Feld für animierte ASCII-Art (`AsciiArt.tsx`), das ist aber statisch vordefinierte ASCII-Kunst, kein generatives Diagramm-Rendering.

### Eingebettete Custom-Komponenten

- **Quelle:** Slidev (beliebige Vue-Komponenten direkt im Markdown verwenden, z. B. `<Tweet id="..." />`)
- **Was es tut:** Freie, wiederverwendbare interaktive Komponenten pro Folie einbinden, nicht nur vordefinierte Content-Blöcke.
- **Bei uns:** Nicht vorhanden. `MixedSlide` kennt nur die festen `ContentBlock`-Typen (`heading`, `bullets`, `paragraph`, `code`) — keine generische Komponenten-Einbettung.

### Icon-Systeme (Iconify)

- **Quelle:** Slidev (`<mdi-account />`-artige Syntax für tausende Icon-Sets)
- **Was es tut:** Beliebige Icons aus großen Icon-Bibliotheken direkt per Kurz-Syntax im Markdown verwenden.
- **Bei uns:** Nicht vorhanden als generelles Feature. Es gibt nur fest verdrahtete Brand-Icons für Social Links im `speaker`-Layout (`socialIcons.tsx`, `simple-icons`), keine freie Icon-Nutzung in anderen Slide-Typen.

## Layout & Styling

### Hintergrundbilder / Split-Backgrounds

- **Quelle:** Marp (`![bg](...)`, `![bg fit/cover/contain]`, `![bg left/right]`, mehrere Hintergründe, Bild-Filter wie `blur`/`opacity`)
- **Was es tut:** Ganzflächige oder geteilte Hintergrundbilder pro Folie, inkl. Größenanpassung und CSS-Filtern.
- **Bei uns:** Nicht vorhanden. `ImageSlide` zeigt ein zentriertes `<img>` mit optionalem Titel/Caption — kein Vollflächen- oder Split-Hintergrund, keine Bildfilter.

### Mehrere Themes / Farbschemata

- **Quelle:** Slidev (installierbare Theme-Pakete wie `seriph`, `apple-basic`) & Marp (`default`, `gaia`, `uncover`, jeweils mit Farbschema-Varianten)
- **Was es tut:** Das komplette visuelle Erscheinungsbild einer Präsentation über ein austauschbares Theme steuern.
- **Bei uns:** Nicht vorhanden. Es gibt genau ein festes, dunkles Design für alle Talks — keine Theme-Auswahl, kein Light-Mode.

### Automatische Skalierung von Inhalten (`fit`)

- **Quelle:** Marp (`fit`-Directive/`<!-- fit -->`, skaliert z. B. Überschriften automatisch auf die verfügbare Fläche)
- **Was es tut:** Text wird automatisch so groß skaliert, dass er die Folie optimal ausfüllt, ohne manuelles Font-Size-Tuning.
- **Bei uns:** Nicht vorhanden — Schriftgrößen sind über feste Tailwind-Klassen in den Slide-Komponenten definiert.

### Custom CSS/Class pro Folie

- **Quelle:** Marp (`class:`-Directive, `style`-Directive/`<style scoped>`) & Slidev (`class:` in Slide-Frontmatter, UnoCSS-Utility-Klassen direkt im Markdown)
- **Was es tut:** Einzelne Folien gezielt mit zusätzlichen CSS-Klassen oder Inline-Styles versehen, ohne einen neuen Layout-Typ zu bauen.
- **Bei uns:** Nicht vorhanden — Styling ist ausschließlich über die feste React-Komponente je `layout` bestimmt, `talk.md` kann kein CSS/Styling beeinflussen.

### Globale Layer (persistente Kopf-/Fußzeile, Wasserzeichen)

- **Quelle:** Slidev (`<!-- global-top -->`/`<!-- global-bottom -->`-Layouts, über alle Folien hinweg sichtbare Elemente) & Marp (`header:`/`footer:`-Directive, `paginate: true`)
- **Was es tut:** Elemente (Logo, Foliennummer, Fußzeile), die auf jeder Folie automatisch sichtbar sind, ohne sie einzeln einzubauen.
- **Bei uns:** Teilweise indirekt vorhanden über `default-slides.md` (feste Intro-/End-Folie), aber keine pro-Folie durchgängige Kopf-/Fußzeile oder Foliennummerierung _innerhalb_ der Folie selbst (die Foliennummer `n / total` sitzt nur in den UI-Controls, nicht auf der Folie/im Export).

## Navigation & Übersicht

### Overview-/Grid-Modus (Table of Contents)

- **Quelle:** Slidev (Tastenkürzel `o`, zeigt alle Folien als Grid zum direkten Anspringen)
- **Was es tut:** Alle Folien eines Talks als Miniaturansicht-Raster anzeigen, um schnell zu einer bestimmten Folie zu springen.
- **Bei uns:** Nicht vorhanden. Navigation ist rein linear (vor/zurück), es gibt keine Grid-/Sprungübersicht.

### Vollbild-Inhaltsverzeichnis / Sprungmarken innerhalb eines langen Decks

- **Quelle:** Slidev (Section-Overview via `contextmenu`) & Marp (Inter-Deck-Links per Anchor)
- **Was es tut:** Direktes Springen zu benannten Abschnitten/Folien, z. B. per Link von außen.
- **Bei uns:** Nicht vorhanden — die Route ist nur `/talk/:id`, ohne Sub-Anchor für eine bestimmte Folie.

---

**Hinweis zur Priorisierung:** Nicht jedes hier gelistete Feature passt zwangsläufig zum minimalistischen, handschriftlich befüllbaren `talk.md`-Format dieses Projekts (siehe `CLAUDE.md`, Abschnitt "Markdown talk format" — bewusst ohne HTML-Kommentare/verschachtelte Delimiter). Die Liste ist als Bestandsaufnahme gedacht, nicht als Roadmap-Zusage.
