// Some browsers (notably Firefox) start reading the blob for the download
// asynchronously after click() rather than synchronously, so revoking the
// object URL immediately can truncate or fail a large download (e.g. a
// multi-minute screen recording). Deferring the revoke gives it time to
// actually start reading first.
const REVOKE_DELAY_MS = 1000

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS)
}
