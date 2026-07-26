# talkfrontend

A lightweight web viewer for talk slides — presentation-style, but as a React web app instead of PowerPoint/Keynote. Slides aren't bundled at build time; they're authored as Markdown and loaded at runtime, so new talks can be added without a rebuild or redeploy.

## Features

- **Year/month/talk overview** – talks are browsed chronologically by year and month
- **Fullscreen presentation mode** with keyboard and presenter-remote controls
- **Talks written in Markdown**: a Marp/Slidev-inspired format — YAML frontmatter for talk metadata, `---`-separated slides, prose Markdown for text-heavy layouts (see [Writing a talk](#writing-a-talk))
- **Eight slide layouts**: title, content (bullet list), code (with syntax highlighting), image, blank (Q&A/closing), table (including an ASCII-art animation for e.g. SQL demos), speaker (photo, facts, and website/LinkedIn/GitHub/X/Bluesky/Mastodon links with generated QR codes and self-hosted icons — no third-party requests), and mixed (heading/bullets/paragraph/code combined freely on one slide)
- **Syntax-highlighted code blocks**: powered by [Prism.js](https://prismjs.com/), bundled at build time (no CDN)
- **Animated code walkthroughs**: a `code` slide can hold multiple versions of a snippet that morph into each other step by step (à la [Slidev's Shiki Magic Move](https://sli.dev/features/shiki-magic-move)), lazy-loaded so it never affects the size of the main app
- **Shared intro/end slides**: a default intro and end slide are automatically added to every talk — no need to repeat your branding or a "thank you" slide in each talk file
- **Data separated from code**: talks live as plain Markdown files in `public/talks` (or on any HTTP server) and are loaded via `fetch()` — no rebuild needed to publish a new talk
- **Built-in feature-tour talk**: `public/talks/feature-tour-2026-07` demonstrates and explains every layout from inside the app itself — open it as a live reference while writing your own talk

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 6](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) via the `@tailwindcss/vite` plugin (no `tailwind.config.js` — classes are auto-detected from source)
- [React Router v7](https://reactrouter.com/) (`BrowserRouter`)
- [js-yaml](https://github.com/nodeca/js-yaml) for the frontmatter/slide-config YAML in talk Markdown files
- [Prism.js](https://prismjs.com/) for code-block syntax highlighting
- [Shiki](https://shiki.style/) + [`@shikijs/magic-move`](https://github.com/shikijs/shiki/tree/main/packages/magic-move) for animated code-step transitions (lazy-loaded, only for talks that use them)
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
- a `default-slides.md` — the intro/end slides automatically prepended/appended to every talk (see [Default intro/end slides](#default-introend-slides))
- one `<id>/talk.md` per ID — a talk written in the Markdown format described below

To publish a new talk:

1. Create `public/talks/<id>/talk.md` (see [Writing a talk](#writing-a-talk))
2. Add its ID to `public/talks/index.json`

No rebuild needed.

### Writing a talk

**The fastest way to learn the format is to open `public/talks/feature-tour-2026-07/talk.md`** — it's a talk that demonstrates every layout and explains, right there in the slides, how to write it.

A `talk.md` file starts with a YAML frontmatter block for the talk's metadata, followed by slides. Each slide starts with a line like `--- <layout>` — that's it, no comments, no extra delimiters:

````
---
id: my-talk-2026-01
title: My Talk
description: Short description
year: 2026
month: 1
tags: [example]
---

--- title
# My Talk
## Subtitle

--- content
# Agenda

- Point 1
- Point 2

--- code
# Example
```go
func main() {
  fmt.Println("hi")
}
```
````

Available slide layouts: `title`, `content`, `code`, `image`, `blank`, `table`, `speaker` (see `src/data/types.ts` for all fields per layout). `title`, `content`, `code`, `image` and `blank` are written as Markdown (heading, bullet list, fenced code block, image, or free text — see `src/data/markdown/parseSlideBody.ts`); `table` and `speaker` carry structured data (row variants, ASCII art, social links) that doesn't map onto prose, so for those two the entire slide is plain YAML instead — no wrapper syntax needed:

```
--- table
title: CREATE
statement: "INSERT INTO personen VALUES (1, 'Oma', 'gesund')"
columns: [id, name, status]
rows:
  - cells: ['1', 'Oma', 'gesund']
    variant: highlight
caption: A new row.
```

Slide `id`s are auto-assigned (`s01`, `s02`, …) from position; set one explicitly as a second word on the separator line (`--- table my-id`) if you ever need to reference a specific slide — the only place this matters today is `default-slides.md`. See `public/talks/wolf-deleted-oma-2026-07/talk.md` for a full real-world example, and `CLAUDE.md` for the exact parsing rules.

`src/data/schema.test.ts` parses every talk's Markdown and validates the result against `schemas/talk.schema.json` (generated from `src/data/types.ts` via `make schema`) with `ajv`, so an invalid talk file fails `make test`.

### Default intro/end slides

Every talk automatically gets the same intro slide prepended and end slide appended — talk files themselves should not define their own opening/closing slide. This content is configured once, in `public/talks/default-slides.md`, typically using the `speaker` layout. It has no talk-level frontmatter — just two slides, tagged `intro` / `end` as the second word on their separator line:

```
--- speaker intro
heading: Your Name
facts: [Software Engineer]
photo: you.jpg
website: https://you.example
linkedin: https://www.linkedin.com/in/you
github: https://github.com/you
twitter: https://x.com/you
bluesky: https://bsky.app/profile/you.bsky.social
mastodon: https://mastodon.social/@you

--- speaker end
heading: Thank you!
github: https://github.com/you
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

## Docker

A pre-built image is published to GHCR: `ghcr.io/nerzal/talkfrontend`. It ships with **no talk data of the maintainer's own** — just an empty `index.json` and generic placeholder branding — so it's safe for anyone to run as-is.

Talks are fetched by the browser at runtime from `dist/talks` on whatever server hosts the app, so you can supply your own without rebuilding the image: bind-mount a directory (containing your own `index.json`, `default-slides.md`, and `<id>/talk.md` folders — see [Data & adding a talk](#data--adding-a-talk)) over `/app/dist/talks`:

```bash
docker run -p 8080:8080 \
  -v $(pwd)/my-talks:/app/dist/talks:ro \
  ghcr.io/nerzal/talkfrontend:edge
```

Available tags: `edge` (latest `main`), and `1.2.3`/`1.2`/`1`/`latest` for tagged releases.

To build your own image with talks baked in at build time instead, pass `VITE_TALKS_DIR` as a build arg pointing at an absolute URL to your own talk-hosting server:

```bash
docker build --build-arg VITE_TALKS_DIR=https://example.com/talks -t my-talkfrontend .
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
