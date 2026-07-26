import { useEffect, useState } from 'react'
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { ShikiMagicMove } from '@shikijs/magic-move/react'
import '@shikijs/magic-move/style.css'
import bash from 'shiki/langs/bash.mjs'
import csharp from 'shiki/langs/csharp.mjs'
import css from 'shiki/langs/css.mjs'
import dockerfile from 'shiki/langs/dockerfile.mjs'
import go from 'shiki/langs/go.mjs'
import html from 'shiki/langs/html.mjs'
import java from 'shiki/langs/java.mjs'
import javascript from 'shiki/langs/javascript.mjs'
import json from 'shiki/langs/json.mjs'
import jsx from 'shiki/langs/jsx.mjs'
import python from 'shiki/langs/python.mjs'
import rust from 'shiki/langs/rust.mjs'
import sql from 'shiki/langs/sql.mjs'
import tsx from 'shiki/langs/tsx.mjs'
import typescript from 'shiki/langs/typescript.mjs'
import yaml from 'shiki/langs/yaml.mjs'
import theme from 'shiki/themes/vitesse-dark.mjs'
import type { CodeSlide as CodeSlideData } from '../../data/types'
import { highlightCode } from '../../lib/highlightCode'

interface Props {
  slide: CodeSlideData
  stepIndex: number
}

const THEME = 'vitesse-dark'
const LANGS = [
  bash,
  csharp,
  css,
  dockerfile,
  go,
  html,
  java,
  javascript,
  json,
  jsx,
  python,
  rust,
  sql,
  tsx,
  typescript,
  yaml,
].flat()

const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  cs: 'csharp',
  xml: 'html',
  markup: 'html',
}

function normalizeLanguage(language: string): string {
  const lower = language.toLowerCase()
  return LANGUAGE_ALIASES[lower] ?? lower
}

let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighterCore({
    themes: [theme],
    langs: LANGS,
    engine: createJavaScriptRegexEngine(),
  })
  return highlighterPromise
}

function stepsOf(slide: CodeSlideData): string[] {
  return [slide.code, ...(slide.steps ?? [])]
}

/**
 * Renders a code slide with Shiki Magic Move: stepping through `slide.steps`
 * morphs the highlighted code from one version to the next instead of a
 * hard cut. Only rendered for code slides that actually declare steps —
 * Shiki is loaded lazily (via CodeSlide's React.lazy) so plain code slides
 * never pay for it.
 */
export default function MagicMoveCodeSlide({ slide, stepIndex }: Props) {
  const steps = stepsOf(slide)
  const code = steps[Math.min(stepIndex, steps.length - 1)]
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null)
  const language = normalizeLanguage(slide.language)
  const isKnownLanguage = LANGS.some((lang) => lang.name === language)

  useEffect(() => {
    if (!isKnownLanguage) return
    let cancelled = false
    void getHighlighter().then((h) => {
      if (!cancelled) setHighlighter(h)
    })
    return () => {
      cancelled = true
    }
  }, [isKnownLanguage])

  return (
    <div className="flex-1 flex flex-col px-4 py-6 sm:px-12 sm:py-10">
      {slide.title && (
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-6">
          {slide.title}
        </h2>
      )}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-8 overflow-auto">
        {highlighter ? (
          <ShikiMagicMove
            highlighter={highlighter}
            lang={language}
            theme={THEME}
            code={code}
            options={{ duration: 500, stagger: 5 }}
            className="text-xs sm:text-sm font-mono leading-relaxed"
          />
        ) : (
          <pre>
            <code
              className={`language-${slide.language} text-xs sm:text-sm font-mono leading-relaxed whitespace-pre`}
              dangerouslySetInnerHTML={{ __html: highlightCode(code, slide.language) }}
            />
          </pre>
        )}
      </div>
    </div>
  )
}
