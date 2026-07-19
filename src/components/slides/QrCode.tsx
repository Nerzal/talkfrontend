import { generateQrMatrix } from '../../lib/qrCode'

interface Props {
  value: string
  size?: number
}

const DEFAULT_SIZE = 132

export function QrCode({ value, size = DEFAULT_SIZE }: Props) {
  const matrix = generateQrMatrix(value)
  const moduleCount = matrix.length

  return (
    <svg
      role="img"
      aria-label={`QR code for ${value}`}
      viewBox={`0 0 ${moduleCount} ${moduleCount}`}
      width={size}
      height={size}
      className="rounded-md bg-white p-1"
    >
      {matrix.map((row, r) =>
        row.map(
          (isDark, c) =>
            isDark && <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" />,
        ),
      )}
    </svg>
  )
}
