# talkfrontend

Ein schlanker Web-Viewer für Vortragsfolien – im Stil einer Präsentation, aber als React-Web-App statt PowerPoint/Keynote. Folien werden nicht gebaut, sondern zur Laufzeit als JSON geladen, sodass neue Vorträge ohne Rebuild oder Deployment hinzugefügt werden können.

## Features

- **Jahres-/Monats-/Vortragsübersicht** – Vorträge werden chronologisch nach Jahr und Monat durchsucht
- **Fullscreen-Präsentationsmodus** mit Tastatur- und Presenter-Remote-Steuerung
- **Sechs Folienlayouts**: Titel, Inhalt (Bullet-Liste), Code, Bild, Blank (Q&A/Abschluss) und Tabelle (inkl. ASCII-Art-Animation für z. B. SQL-Demos)
- **Daten getrennt vom Code**: Vorträge liegen als reine JSON-Dateien in `public/talks` (oder auf einem beliebigen HTTP-Server) und werden per `fetch()` geladen – kein Rebuild nötig, um einen neuen Vortrag zu veröffentlichen

## Tech-Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 6](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) über das `@tailwindcss/vite`-Plugin (kein `tailwind.config.js` – Klassen werden automatisch aus dem Source erkannt)
- [React Router v7](https://reactrouter.com/) (`BrowserRouter`)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) für Tests
- [ESLint](https://eslint.org/) (flat config, typegebunden) + [Prettier](https://prettier.io/) für Codequalität

## Funktionsweise

### Routing

```
/                 → Jahresübersicht
/:year            → Monatsübersicht für ein Jahr
/:year/:month     → Vortragsliste für einen Monat
/talk/:id         → Fullscreen-Folienpräsentation
```

`HomeScreen` liest die URL-Parameter aus und entscheidet, welche der drei Listenansichten gerendert wird.

### Daten & Vortrag hinzufügen

Vorträge sind **nicht** im Bundle enthalten, sondern werden zur Laufzeit aus einem konfigurierbaren Ordner geladen (siehe [Konfiguration](#konfiguration)). Dieser Ordner braucht:

- eine `index.json` – ein Array aller Vortrags-IDs
- pro ID eine `<id>.json` – ein `Talk`-Objekt (Struktur siehe `src/data/types.ts`)

Um einen neuen Vortrag zu veröffentlichen:

1. `public/talks/<id>.json` anlegen (ein `Talk`-Objekt)
2. die ID in `public/talks/index.json` eintragen

Kein Rebuild nötig – die Datei muss aber von Hand gegen `src/data/types.ts` validiert werden, da JSON nicht typgeprüft wird.

Beispiel für ein minimales `Talk`-Objekt:

```json
{
  "id": "mein-vortrag-2026-01",
  "title": "Mein Vortrag",
  "description": "Kurzbeschreibung",
  "year": 2026,
  "month": 1,
  "tags": ["beispiel"],
  "slides": [
    { "id": "s1", "layout": "title", "title": "Mein Vortrag", "subtitle": "Untertitel" },
    { "id": "s2", "layout": "content", "title": "Agenda", "bullets": ["Punkt 1", "Punkt 2"] },
    { "id": "s3", "layout": "blank", "heading": "Fragen?", "body": "Danke fürs Zuhören!" }
  ]
}
```

Verfügbare Folienlayouts: `title`, `content`, `code`, `image`, `blank`, `table` (siehe `src/data/types.ts` für alle Felder je Layout).

### Tastatursteuerung im Präsentationsmodus

| Taste                      | Aktion               |
| -------------------------- | -------------------- |
| `→`, `Leertaste`, `Bild ↓` | Nächste Folie        |
| `←`, `Bild ↑`              | Vorherige Folie      |
| `Esc`                      | Zurück zur Übersicht |

`Bild ↑`/`Bild ↓` decken gängige Presenter-Remotes ab (z. B. Logitech Spotlight).

## Konfiguration

Der Ordner, aus dem Vorträge geladen werden, wird per Umgebungsvariable gesteuert. `.env.example` kopieren:

```bash
cp .env.example .env
```

```dotenv
# Relativer Pfad (aus public/ bedient) oder vollständige URL zu einem beliebigen HTTP-Server
VITE_TALKS_DIR=/talks
```

## Erste Schritte

```bash
make install   # Abhängigkeiten installieren
make dev       # Dev-Server starten (http://localhost:5173)
```

Alle verfügbaren Kommandos:

| `make`-Target       | npm-Skript             | Beschreibung                              |
| ------------------- | ---------------------- | ----------------------------------------- |
| `make dev`          | `npm run dev`          | Dev-Server starten                        |
| `make build`        | `npm run build`        | TypeScript-Check + Production Build       |
| `make preview`      | `npm run preview`      | Production Build lokal vorschauen         |
| `make test`         | `npm run test`         | Tests einmalig ausführen (vitest run)     |
| `make test-watch`   | `npm run test:watch`   | Tests im Watch-Modus                      |
| `make test-ui`      | `npm run test:ui`      | Vitest Browser-UI öffnen                  |
| `make lint`         | `npm run lint`         | ESLint prüfen                             |
| `make lint-fix`     | `npm run lint:fix`     | ESLint prüfen und automatisch korrigieren |
| `make format`       | `npm run format`       | Code mit Prettier formatieren             |
| `make format-check` | `npm run format:check` | Prettier-Formatierung prüfen              |
| `make install`      | `npm install`          | Abhängigkeiten installieren               |
| `make clean`        | –                      | `dist/` löschen                           |

`make` ohne Argument zeigt alle Targets mit Beschreibung an.
