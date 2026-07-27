import { downloadBlob } from './downloadBlob'

export interface RecordingSink {
  write(chunk: Blob): void
  finish(mimeType: string): Promise<void>
}

async function tryCreateWritable(
  fileHandle: FileSystemFileHandle,
): Promise<FileSystemWritableFileStream | null> {
  try {
    return await fileHandle.createWritable()
  } catch {
    return null
  }
}

/**
 * Hides whether a recording is being streamed to a user-chosen file (File
 * System Access API) or buffered in memory for a plain download, so
 * MediaRecorder callbacks don't need to branch on which path is active.
 */
export async function createRecordingSink(
  fileHandle: FileSystemFileHandle | null,
  fileName: string,
): Promise<RecordingSink> {
  const writable = fileHandle ? await tryCreateWritable(fileHandle) : null
  if (writable) {
    return {
      write: (chunk) => void writable.write(chunk),
      finish: () => writable.close(),
    }
  }

  const chunks: Blob[] = []
  return {
    write: (chunk) => chunks.push(chunk),
    finish: (mimeType) => {
      downloadBlob(new Blob(chunks, { type: mimeType }), fileName)
      return Promise.resolve()
    },
  }
}
