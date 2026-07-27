export function isSaveFilePickerSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.showSaveFilePicker === 'function'
}

/**
 * Lets the user choose where the recording is saved via the File System
 * Access API. Returns null when unsupported (falls back to a plain browser
 * download) or when the user cancels the picker — neither is an error.
 */
export async function pickSaveLocation(
  suggestedName: string,
): Promise<FileSystemFileHandle | null> {
  const showPicker = window.showSaveFilePicker
  if (!showPicker) return null
  try {
    return await showPicker({
      suggestedName,
      types: [{ description: 'WebM video', accept: { 'video/webm': ['.webm'] } }],
    })
  } catch {
    return null
  }
}
