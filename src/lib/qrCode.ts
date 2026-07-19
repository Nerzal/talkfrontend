import qrcode from 'qrcode-generator'

export function generateQrMatrix(value: string): boolean[][] {
  const qr = qrcode(0, 'M')
  qr.addData(value)
  qr.make()

  const size = qr.getModuleCount()
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => qr.isDark(row, col)),
  )
}
