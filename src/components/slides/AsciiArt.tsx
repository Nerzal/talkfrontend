const DRAMATIC_LINE_PATTERN = /\*|\bPLOPP\b|\bSCHLUCK\b|\bPOOF\b|\bCHOP\b|\bWUUSH\b|\bTHUD\b/

const STAGGER_DELAY_MS = 80

interface Props {
  content: string
}

function isDramatic(line: string): boolean {
  return DRAMATIC_LINE_PATTERN.test(line)
}

export function AsciiArt({ content }: Props) {
  const lines = content.trim().split('\n')

  return (
    <div
      className="flex-1 self-stretch flex items-center justify-center bg-slate-950 rounded-2xl p-3 sm:p-6 text-center overflow-x-auto"
      style={{
        border: '2px dashed rgba(251,191,36,0.4)',
        boxShadow: '0 0 40px rgba(251,191,36,0.06)',
      }}
    >
      <div className="w-full">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`font-mono leading-relaxed whitespace-pre ${
              isDramatic(line)
                ? 'text-amber-100 font-bold text-sm sm:text-lg'
                : 'text-amber-300 text-xs sm:text-base'
            }`}
            style={{
              animation: isDramatic(line)
                ? 'asciiDramaticPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both'
                : 'asciiLineIn 0.3s ease-out both',
              animationDelay: `${i * STAGGER_DELAY_MS}ms`,
            }}
          >
            {line === '' ? ' ' : line}
          </div>
        ))}
      </div>
    </div>
  )
}
