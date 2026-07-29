#!/usr/bin/env node
// Resizes and recompresses talk image assets in place. Talk slides only ever
// display an image inside a 1280x720 slide, so anything larger than
// MAX_DIMENSION on its long edge is pure dead weight (several talk assets are
// unresized AI-generated exports in the 8-10MB range).
//
// PNGs are additionally checked against a WebP re-encode of the same
// (resized) pixels. WebP only wins for photographic/gradient content —
// flat-color diagrams, screenshots and drawio exports are usually already
// near-optimal as a quantized PNG and get *bigger* as lossy WebP — so a file
// is only converted (and its talk.md/default-slides.md reference rewritten)
// when WebP is a clear win.
const { readdirSync, statSync, writeFileSync, unlinkSync, readFileSync } = require('node:fs')
const { join, extname, dirname, relative, basename } = require('node:path')
const sharp = require('sharp')

const TALKS_DIR = join(__dirname, '..', 'public', 'talks')
const MAX_DIMENSION = 1600
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])
// Re-encoding an already-lossy-compressed image always finds a *few* more
// bytes to shave (fresh dithering/quantization noise), so re-running this
// script on its own output would silently keep degrading images forever.
// Only accept a re-encode (or a PNG -> WebP conversion) once it clears a real
// savings bar.
const MIN_SAVINGS_RATIO = 0.15

function findImages(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...findImages(full))
    } else if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      out.push(full)
    }
  }
  return out
}

function resizeIfNeeded(pipeline, metadata) {
  if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
    return pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }
  return pipeline
}

function encoderFor(ext, pipeline) {
  switch (ext) {
    case '.png':
      return pipeline.png({ compressionLevel: 9, palette: true, quality: 80 })
    case '.jpg':
    case '.jpeg':
      return pipeline.jpeg({ quality: 80, mozjpeg: true })
    case '.webp':
      return pipeline.webp({ quality: 80 })
    default:
      throw new Error(`unsupported extension: ${ext}`)
  }
}

// The talk.md (or default-slides.md, for the shared assets/ folder) that
// references filePath by its path relative to that talk's own root.
function markdownFor(filePath) {
  const rel = relative(TALKS_DIR, filePath)
  const talkId = rel.split(/[\\/]/)[0]
  if (talkId === 'assets') {
    return { markdownPath: join(TALKS_DIR, 'default-slides.md'), talkRoot: TALKS_DIR }
  }
  const talkRoot = join(TALKS_DIR, talkId)
  return { markdownPath: join(talkRoot, 'talk.md'), talkRoot }
}

function renameAndRewire(oldPath, newPath, buffer) {
  writeFileSync(newPath, buffer)
  // rmSync silently no-ops on some Windows setups for paths containing
  // non-ASCII characters (umlauts show up in several talk asset names) —
  // it neither throws nor deletes the file. unlinkSync doesn't have that bug.
  unlinkSync(oldPath)
  const { markdownPath, talkRoot } = markdownFor(oldPath)
  const oldRef = relative(talkRoot, oldPath).split('\\').join('/')
  const newRef = relative(talkRoot, newPath).split('\\').join('/')
  const markdown = readFileSync(markdownPath, 'utf8')
  writeFileSync(markdownPath, markdown.split(oldRef).join(newRef))
}

async function minifyPng(filePath) {
  const before = statSync(filePath).size
  // Decode from a buffer, never straight from filePath: sharp/libvips can
  // hold the source file open past when its promise resolves (seen on
  // Windows especially when re-reading a file that's also the write
  // target), which then makes overwriting that same path fail with EPERM.
  const input = readFileSync(filePath)
  const metadata = await sharp(input).metadata()

  const pngBuffer = await encoderFor('.png', resizeIfNeeded(sharp(input), metadata)).toBuffer()
  const webpBuffer = await encoderFor('.webp', resizeIfNeeded(sharp(input), metadata)).toBuffer()

  const pngBaseline = Math.min(before, pngBuffer.length)
  if (webpBuffer.length <= pngBaseline * (1 - MIN_SAVINGS_RATIO)) {
    const webpPath = join(dirname(filePath), `${basename(filePath, '.png')}.webp`)
    renameAndRewire(filePath, webpPath, webpBuffer)
    return { filePath: webpPath, before, after: webpBuffer.length, skipped: false, converted: true }
  }

  if (pngBuffer.length >= before * (1 - MIN_SAVINGS_RATIO)) {
    return { filePath, before, after: before, skipped: true }
  }
  writeFileSync(filePath, pngBuffer)
  return { filePath, before, after: pngBuffer.length, skipped: false }
}

async function minifyOther(filePath, ext) {
  const before = statSync(filePath).size
  const input = readFileSync(filePath)
  const metadata = await sharp(input).metadata()
  const buffer = await encoderFor(ext, resizeIfNeeded(sharp(input), metadata)).toBuffer()

  if (buffer.length >= before * (1 - MIN_SAVINGS_RATIO)) {
    return { filePath, before, after: before, skipped: true }
  }
  writeFileSync(filePath, buffer)
  return { filePath, before, after: buffer.length, skipped: false }
}

async function minify(filePath) {
  const ext = extname(filePath).toLowerCase()
  return ext === '.png' ? minifyPng(filePath) : minifyOther(filePath, ext)
}

async function main() {
  const images = findImages(TALKS_DIR)
  let totalBefore = 0
  let totalAfter = 0

  for (const filePath of images) {
    const result = await minify(filePath)
    totalBefore += result.before
    totalAfter += result.after
    const relativeBefore = relative(TALKS_DIR, filePath)
    if (result.skipped) {
      console.log(`  skip  ${relativeBefore} (already optimal)`)
    } else {
      const pct = Math.round((1 - result.after / result.before) * 100)
      const relativeAfter = relative(TALKS_DIR, result.filePath)
      const label = result.converted ? `${relativeBefore} -> ${relativeAfter}` : relativeBefore
      console.log(
        `  ${(result.before / 1024).toFixed(0)}KB -> ${(result.after / 1024).toFixed(0)}KB (-${pct}%)  ${label}`,
      )
    }
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
