---
name: deploy
description: >
  Commit and push pending changes on main, then verify GitHub Actions (CI and
  Publish Docker image) actually succeed on the resulting commit before
  reporting done. Use when the user says "deploy", "ship this", "/deploy", or
  asks to push and confirm the pipeline is green.
---

Deploying this repo means: push to `main` and confirm both workflows pass on
the commit that lands there — not just that `git push` returned exit code 0.

## Steps

1. **Review before committing.** Run `git status` and `git diff`. If there
   are changes unrelated to the work just done in this conversation, ask
   before bundling them into the deploy commit — don't silently sweep up
   unrelated edits.
2. **Commit.** Use a message describing _why_, following this repo's existing
   commit style (see `git log`). Never use `--no-verify`.
3. **Push.** `git push`. If it's rejected (remote moved), `git pull --ff-only`
   then push again — never force-push without the user explicitly asking.
4. **Find the resulting commit's runs.**
   `gh run list --limit 5 --json databaseId,status,conclusion,headSha,workflowName`
   and match `headSha` against `git rev-parse HEAD`.
   - If another push lands on `main` while yours is queued, this repo's
     concurrency groups (`ci-CI-refs/heads/main`, `docker-publish-refs/heads/main`)
     cancel the older run in favor of the newer one — that's expected, not a
     failure. Re-fetch (`git fetch && git log --oneline origin/main -3`),
     confirm the newer commit still contains yours as an ancestor, and watch
     _that_ run instead.
5. **Watch, don't poll blindly.** `gh run watch <databaseId> --exit-status`
   for both the `CI` and `Publish Docker image` runs. Report the real
   per-job outcome (`lint`, `test`, `schema`, `build` for CI) — don't
   declare success while a run is still `queued`/`in_progress`.
6. **On failure**, fetch the actual error instead of guessing:
   `gh run view <databaseId> --log-failed`. Fix, commit, push again, repeat
   from step 4.

## This repo's pipelines

- `.github/workflows/ci.yml` — `lint` (ESLint + `make format-check`), `test`
  (`make test`), `schema` (regenerates `schemas/*.json` and fails if that
  produces a diff — a sign `src/data/types.ts` changed without `make schema`),
  `build` (`tsc -b && vite build`).
- `.github/workflows/docker-publish.yml` — builds and pushes the image to
  `ghcr.io/nerzal/talkfrontend` on every push to `main` (tag `edge`) and on
  `v*.*.*` tags.

## Guardrails

- Never force-push, never skip hooks, never bypass a failing check to "make
  it green" — fix the actual cause.
- A commit is not "deployed" until both workflows report `success` on its
  SHA (or the SHA of a later commit that contains it).
