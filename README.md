# talkfrontend

A lightweight web viewer for talk slides — presentation-style, but as a React web app instead of PowerPoint/Keynote. Slides aren't bundled at build time; they're authored as Markdown and loaded at runtime, so new talks can be added without a rebuild or redeploy.

## Features

- **Year/month/talk overview** – talks are browsed chronologically by year and month
- **Fullscreen presentation mode** with [keyboard and presenter-remote controls](#keyboard-controls-in-presentation-mode)
- **Talks written in Markdown**: a Marp/Slidev-inspired format — YAML frontmatter for talk metadata, `---`-separated slides, prose Markdown for text-heavy layouts (see [Writing a talk](#writing-a-talk))
- **Automatic layout inference**: no layout keyword required — a slide's layout is guessed from the shape of its own Markdown, an explicit `--- <layout>` only needed to override a wrong guess (see [Layout inference](#layout-inference))
- **Eight slide layouts**: title, content (bullet list), code (with syntax highlighting), image, blank (Q&A/closing), table (including an ASCII-art animation for e.g. SQL demos), speaker (photo, facts, and website/LinkedIn/GitHub/X/Bluesky/Mastodon links with generated QR codes and self-hosted icons — no third-party requests), and mixed (heading/bullets/paragraph/code/image combined freely on one slide, see [Layout: mixed](#layout-mixed))
- **Syntax-highlighted code blocks**: powered by [Prism.js](https://prismjs.com/), bundled at build time (no CDN)
- **Animated code walkthroughs**: a `code` slide can hold multiple versions of a snippet that morph into each other step by step (à la [Slidev's Shiki Magic Move](https://sli.dev/features/shiki-magic-move)), lazy-loaded so it never affects the size of the main app (see [Animated code steps](#animated-code-steps-magic-move))
- **Click animations (fragments)**: bullets in a `content`/`mixed` slide can be marked with `-> ` instead of `- ` to reveal them one at a time via click/arrow key, instead of showing the whole list at once (see [Fragments](#fragments-click-animations))
- **Background images**: any slide, any layout, can show a dimmed full-slide background image behind its content (see [Background images](#background-images))
- **Shared intro/end slides**: a default intro and end slide are automatically added to every talk — no need to repeat your branding or a "thank you" slide in each talk file. A talk can also insert its own pre-intro slide (title card, sponsor mention, ...) ahead of it (see [Default intro/end slides](#default-introend-slides))
- **Presenter View**: a separate `/talk/:id/presenter` route with speaker notes, a live next-slide preview, a timer, freehand drawing synced to the audience window, and one-click screen recording / webcam overlay — all local to the browser, no server involved (see [Presenter mode](#presenter-mode))
- **Data separated from code**: talks live as plain Markdown files in `public/talks` (or on any HTTP server) and are loaded via `fetch()` — no rebuild needed to publish a new talk
- **Built-in feature-tour talk**: `public/talks/feature-tour-2026-07` demonstrates and explains every layout and presenter tool from inside the app itself — open it as a live reference while writing your own talk

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

An optional `clippy: true` in the frontmatter turns on Karl Klammer, a Clippy-style mascot that occasionally slides in from a random screen edge during the presentation (`/talk/:id`) with a quote, then slides back out. Off by default.

Available slide layouts: `title`, `content`, `code`, `image`, `blank`, `table`, `speaker`, `mixed` (see `src/data/types.ts` for all fields per layout). `title`, `content`, `code`, `image`, `blank` and `mixed` are written as Markdown (heading, bullet list, fenced code block, image, or free text — see `src/data/markdown/parseSlideBody.ts`); `table` and `speaker` carry structured data (row variants, ASCII art, social links) that doesn't map cleanly onto prose, so those two also accept the entire slide body as plain YAML instead — no wrapper syntax needed, it's auto-detected by the first line looking like one of that layout's own fields (`columns:`, `heading:`, ...):

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

`table` and `speaker` can _also_ be written as plain Markdown when that fits the content better — a GFM pipe table becomes the `table` slide's columns/rows, a `[github](...)`-style link becomes a `speaker` social link:

````
--- table
```sql
INSERT INTO personen VALUES (1, 'Oma', 'gesund')
```

| id | name | status |            |
| -- | ---- | ------ | ---------- |
| 1  | Oma  | gesund | highlight  |

A new row.
````

The trailing cell on a data row sets that row's variant (`normal`, `highlight`, `warning`, `danger`, `deleted` — omitted means `normal`); a table with no data rows renders as `empty`. An optional fenced code block right after the table becomes an ASCII-art illustration slot instead (see `TableSlide`/`AsciiArt.tsx`), and any leftover prose becomes the `caption`.

Slide `id`s are auto-assigned (`s01`, `s02`, …) from position; set one explicitly as a second word on the separator line (`--- table my-id`) if you ever need to reference a specific slide — the only place this matters today is `default-slides.md`. See `public/talks/wolf-deleted-oma-2026-07/talk.md` for a full real-world example, and `CLAUDE.md` for the exact parsing rules.

`src/data/schema.test.ts` parses every talk's Markdown and validates the result against `schemas/talk.schema.json` (generated from `src/data/types.ts` via `make schema`) with `ajv`, so an invalid talk file fails `make test`.

### Layout inference

A `---` on its own is enough to start a new slide — no layout keyword required. With no override, the layout is guessed purely from the shape of the slide's own Markdown body:

| Body shape                                                                 | Inferred layout |
| -------------------------------------------------------------------------- | --------------- |
| GFM pipe table                                                             | `table`         |
| A standalone `[github](...)`-style link with a known social-platform label | `speaker`       |
| A fenced code block                                                        | `code`          |
| A Markdown image                                                           | `image`         |
| A bullet list                                                              | `content`       |
| A heading plus subheading, nothing else                                    | `title`         |
| Plain heading/prose, or an empty body                                      | `blank`         |
| A genuine mix of the above (e.g. bullets next to a code block)             | `mixed`         |

```
---
# Just a heading and a subheading
## This is inferred as "title" — no `--- title` needed

---
- This slide starts with a bare `---`
- It still becomes a `content` slide
- Because a bullet list is what's in the body
```

An explicit `--- <layout>` word right after the separator always wins when the guess would be wrong or ambiguous — e.g. `--- content` forces the `content` layout even on a body that would otherwise infer as something else. A word that isn't a recognized layout name (e.g. `--- my-id`) is treated as a bare slide id instead, with the layout still inferred.

### Layout: mixed

`mixed` has no fixed shape: headings, bullets, paragraphs, fenced code blocks and images are read top to bottom, in document order, and rendered in exactly that order — the layout to reach for when a slide needs "some bullets, then a code snippet, then a note" without splitting it across two slides:

````
--- mixed
Free-form content on one slide.

## Why this is useful

- No need to split code and explanation across two slides
- Perfect for "here's the code, and here's why"

```go
func add(a, b int) int {
  return a + b
}
```
````

A standalone image line inside a `mixed` slide can carry a trailing position keyword: `![alt](assets/photo.png) left` or `right` puts the image in its own column beside the rest of the slide's content; `under` (or no keyword at all — the default) renders it inline, full-width, wherever it appears in the document:

```
--- mixed
![Team photo](assets/team.jpg) left

- This text renders in a column next to the image
- Created purely by the `left` keyword after the image path
```

### Fragments (click animations)

In a `content` or `mixed` slide's bullet list, a line starting with `-> ` instead of `- ` becomes a fragment — hidden until revealed one at a time by click, `→`, or Space, the same navigation used to step through a `code` slide's steps:

```
--- content
# Live demo

- This line is visible immediately
-> This line appears on the first click
-> Then this one
-> Only after that does the next slide start
```

Fragments are numbered in document order across every bullet list on the slide, so multiple lists on one `mixed` slide reveal in the order they appear.

### Animated code steps (Magic Move)

A `code` slide can hold more than one fenced code block in a row — the first becomes the slide's `code`, the rest become `steps`. Pressing `→`/Space morphs the highlighted code from one version to the next (via [Shiki Magic Move](https://sli.dev/features/shiki-magic-move)) instead of a hard cut, before moving on to the next slide:

````
--- code
# Adding a field
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
````

Shiki (and its grammars) is lazy-loaded only for talks that actually use stepped code — a plain single-block `code` slide keeps using the lightweight Prism.js path and never pays for the extra bundle.

### Background images

Any slide, on any layout, can show a full-slide background image behind its content — either a standalone `+++ background <path>` line, or the equivalent `![alt](path) background` image line:

```
--- blank
# Thanks for coming!
Slides and code are on GitHub.

+++ background assets/venue.jpg
```

The path resolves the same way as any other image (relative to the talk's own `assets/` folder). The background renders behind the slide's content with a dark overlay for readability.

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

#### Pre-intro slide

Sometimes something needs to appear even before the shared intro — a title card, a sponsor mention, a content warning. Tag one of the talk's own slides with the reserved id `0` (as the word right after the separator, optionally alongside an explicit layout) and it's pulled out of its normal position and placed first, ahead of the default intro slide:

```
--- title 0
# My Talk\nSponsored by Acme Corp
```

It doesn't matter where in the document this slide is written — it always renders first. At most one pre-intro slide is supported per talk.

### Keyboard controls in presentation mode

| Key                       | Action           |
| ------------------------- | ---------------- |
| `→`, `Space`, `Page Down` | Next slide       |
| `←`, `Page Up`            | Previous slide   |
| `Esc`                     | Back to overview |

`Page Up`/`Page Down` cover standard presenter remotes (e.g. Logitech Spotlight).

### Presenter mode

Every talk automatically gets a separate speaker-facing view at `/talk/:id/presenter`, independent from the audience-facing `/talk/:id`. Open the talk, then open `/talk/:id/presenter` (or use its "Open audience view" button to open `/talk/:id` in a second tab) — the two stay live-synced as you present.

#### Speaker notes

Any slide can end with a standalone `+++ notes` line — everything after it becomes that slide's speaker notes, shown only in Presenter View, never to the audience:

```
--- content
# Agenda

- Point 1
- Point 2

+++ notes
Remember to mention the Q4 numbers here before moving on.
```

The `notes` keyword (mirroring how `--- <layout>` works on the slide separator) keeps a bare `+++` — e.g. a `+++ b/file` line inside a pasted diff — from being mistaken for the notes marker; it's also fence-aware, so a `+++`-looking line inside a fenced code block is never treated as one either.

#### Next-slide preview & timer

Presenter View renders both the current and the next slide through the same real `SlideRenderer` the audience sees (just scaled down), so the preview is always pixel-faithful — never a separately maintained mini layout. A simple start/pause/reset stopwatch sits alongside it to track how long you've been talking.

#### Presenter/audience sync

As you navigate in Presenter View, the audience window (opened via "Open audience view") follows along automatically — both tabs communicate over the browser's `BroadcastChannel` API, scoped per talk id. This works only between windows/tabs in the **same browser on the same device** (e.g. a presenter window on your laptop driving an audience window on a projector) — there's deliberately no cross-device remote control, since that would require a signaling backend, which this static, `fetch()`-only app doesn't have.

#### Drawing & annotations

The "Pen" button in Presenter View turns on an SVG overlay you can draw on freehand, using normalized (0–1) coordinates so strokes line up regardless of window size. Finished strokes appear live in the synced audience window (read-only there); "Clear drawing" clears them there too. Strokes reset automatically whenever the slide changes.

#### Recording & camera overlay

The Record button uses the browser's own `getDisplayMedia` + `MediaRecorder` APIs to capture your screen — pick the screen/window/tab via the browser's native picker, and the finished recording downloads as a `.webm` file, no server involved. The Camera button adds a small picture-in-picture webcam bubble over the slide via `getUserMedia`. Both buttons render themselves away if the browser doesn't support the underlying API.

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

A pre-built image is published to GHCR: `ghcr.io/nerzal/talkfrontend`. It ships with **no talk data of the maintainer's own** — the [publish workflow](.github/workflows/docker-publish.yml) builds the image, then swaps `dist/talks` for `docker/default-talks` (an empty `index.json` and generic placeholder branding) before it's pushed — so it's safe for anyone to run as-is.

Talks are fetched by the browser at runtime from `dist/talks` on whatever server hosts the app, so you can supply your own without rebuilding the image: bind-mount a directory (containing your own `index.json`, `default-slides.md`, and `<id>/talk.md` folders — see [Data & adding a talk](#data--adding-a-talk)) over `/app/dist/talks`, which shadows the placeholder data baked into the image:

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
| `make talks-index`  | `npm run talks:index`  | Regenerate `public/talks/index.json`             |
| `make install`      | `npm install`          | Install dependencies                             |
| `make clean`        | –                      | Remove `dist/`                                   |

Running `make` with no argument lists all targets with descriptions.

## Project structure

Details on architecture, data flow, and code conventions (IOSP, SOLID) live in [`CLAUDE.md`](./CLAUDE.md).
