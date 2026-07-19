# talkfrontend

A lightweight web viewer for talk slides — presentation-style, but as a React web app instead of PowerPoint/Keynote. Slides aren't bundled at build time; they're loaded as JSON at runtime, so new talks can be added without a rebuild or redeploy.

## Features

- **Year/month/talk overview** – talks are browsed chronologically by year and month
- **Fullscreen presentation mode** with keyboard and presenter-remote controls
- **Seven slide layouts**: title, content (bullet list), code, image, blank (Q&A/closing), table (including an ASCII-art animation for e.g. SQL demos), and speaker (photo, facts, and website/LinkedIn/GitHub/X/Bluesky/Mastodon links with generated QR codes and self-hosted icons — no third-party requests)
- **Shared intro/end slides**: a default intro and end slide are automatically added to every talk — no need to repeat your branding or a "thank you" slide in each talk file
- **Data separated from code**: talks live as plain JSON files in `public/talks` (or on any HTTP server) and are loaded via `fetch()` — no rebuild needed to publish a new talk

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 6](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) via the `@tailwindcss/vite` plugin (no `tailwind.config.js` — classes are auto-detected from source)
- [React Router v7](https://reactrouter.com/) (`BrowserRouter`)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for tests
- [ESLint](https://eslint.org/) (flat config, type-aware) + [Prettier](https://prettier.io/) for code quality

## How it works

### Routing

```
/                 → year overview
/:year            → month overview for a year
/:year/:month     → talk list for a month
/talk/:id         → fullscreen slide presentation
```

`HomeScreen` reads the URL params and decides which of the three list views to render.

### Data & adding a talk

Talks are **not** bundled into the app — they're loaded at runtime from a configurable directory (see [Configuration](#configuration)). That directory needs:

- an `index.json` — an array of all talk IDs
- a `default-slides.json` — a `DefaultSlides` object (`{ intro: Slide, end: Slide }`) automatically prepended/appended to every talk (see [Default intro/end slides](#default-introend-slides))
- one `<id>.json` per ID — a `Talk` object (shape defined in `src/data/types.ts`)

To publish a new talk:

1. Create `public/talks/<id>.json` (a `Talk` object)
2. Add its ID to `public/talks/index.json`

No rebuild needed — but the file must be validated by hand against `src/data/types.ts`, since JSON isn't type-checked.

Example of a minimal `Talk` object:

```json
{
  "id": "my-talk-2026-01",
  "title": "My Talk",
  "description": "Short description",
  "year": 2026,
  "month": 1,
  "tags": ["example"],
  "slides": [
    { "id": "s1", "layout": "title", "title": "My Talk", "subtitle": "Subtitle" },
    { "id": "s2", "layout": "content", "title": "Agenda", "bullets": ["Point 1", "Point 2"] }
  ]
}
```

Available slide layouts: `title`, `content`, `code`, `image`, `blank`, `table`, `speaker` (see `src/data/types.ts` for all fields per layout).

### Editor autocomplete for talk JSON

`schemas/talk.schema.json` and `schemas/default-slides.schema.json` are generated from `src/data/types.ts` (`make schema`) and give VS Code (and other editors that support JSON Schema) inline validation and autocomplete while editing talk files — including per-layout property suggestions once you've typed a `"layout"` value.

- New talk files: start them with `"$schema": "../../schemas/talk.schema.json"` (see `public/talks/wolf-deleted-oma-2026-07.json` for an example).
- `default-slides.json` and `index.json` are wired up automatically via `.vscode/settings.json` — no `$schema` line needed there.
- Run `make schema` again whenever you change `src/data/types.ts` so the schemas stay in sync (`src/data/schema.test.ts` fails if they drift out of sync with the real `public/talks/*.json` files).

### Default intro/end slides

Every talk automatically gets the same intro slide prepended and end slide appended — talk files themselves should not define their own opening/closing slide. This content is configured once, in `public/talks/default-slides.json`, typically using the `speaker` layout:

```json
{
  "intro": {
    "id": "__intro__",
    "layout": "speaker",
    "heading": "Your Name",
    "facts": ["Software Engineer"],
    "photo": "/talks/you.jpg",
    "website": "https://you.example",
    "linkedin": "https://www.linkedin.com/in/you",
    "github": "https://github.com/you",
    "twitter": "https://x.com/you",
    "bluesky": "https://bsky.app/profile/you.bsky.social",
    "mastodon": "https://mastodon.social/@you"
  },
  "end": {
    "id": "__end__",
    "layout": "speaker",
    "heading": "Thank you!",
    "github": "https://github.com/you"
  }
}
```

`website`, `linkedin`, `github`, `twitter`, `bluesky`, `mastodon`, `photo`, and `facts` are all optional — each configured link is shown with its own generated QR code so the audience can scan it directly off the slide, plus a brand icon where one is available (website, GitHub, X, Bluesky, Mastodon). Icons are bundled at build time from the CC0-licensed [`simple-icons`](https://simpleicons.org/) package — nothing is fetched from a third-party CDN at runtime, so there's no GDPR-relevant tracking concern. LinkedIn has no icon: LinkedIn had theirs removed from `simple-icons` for trademark reasons, so it's shown as a text label only. Edit this file to change the branding/closing slide shown across every talk.

### Keyboard controls in presentation mode

| Key                       | Action           |
| ------------------------- | ---------------- |
| `→`, `Space`, `Page Down` | Next slide       |
| `←`, `Page Up`            | Previous slide   |
| `Esc`                     | Back to overview |

`Page Up`/`Page Down` cover standard presenter remotes (e.g. Logitech Spotlight).

## Configuration

The directory talks are loaded from is controlled via an environment variable. Copy `.env.example`:

```bash
cp .env.example .env
```

```dotenv
# Relative path (served from public/) or full URL to any HTTP server
VITE_TALKS_DIR=/talks
```

## Getting started

```bash
make install   # Install dependencies
make dev       # Start dev server (http://localhost:5173)
```

All available commands:

| `make` target       | npm script             | Description                                      |
| ------------------- | ---------------------- | ------------------------------------------------ |
| `make dev`          | `npm run dev`          | Start dev server                                 |
| `make build`        | `npm run build`        | TypeScript check + production build              |
| `make preview`      | `npm run preview`      | Preview production build locally                 |
| `make test`         | `npm run test`         | Run tests once (vitest run)                      |
| `make test-watch`   | `npm run test:watch`   | Run tests in watch mode                          |
| `make test-ui`      | `npm run test:ui`      | Open Vitest browser UI                           |
| `make lint`         | `npm run lint`         | Check with ESLint                                |
| `make lint-fix`     | `npm run lint:fix`     | Check with ESLint and auto-fix                   |
| `make format`       | `npm run format`       | Format code with Prettier                        |
| `make format-check` | `npm run format:check` | Check Prettier formatting                        |
| `make schema`       | `npm run schema`       | Regenerate JSON schemas from `src/data/types.ts` |
| `make install`      | `npm install`          | Install dependencies                             |
| `make clean`        | –                      | Remove `dist/`                                   |

Running `make` with no argument lists all targets with descriptions.

## Project structure

Details on architecture, data flow, and code conventions (IOSP, SOLID) live in [`CLAUDE.md`](./CLAUDE.md).
