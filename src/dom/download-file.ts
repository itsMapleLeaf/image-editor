// https://wicg.github.io/file-system-access/#api-filepickeroptions
export async function downloadFile(
  file: Blob,
  filename: string,
  types: Array<{ description: string; accept: Record<string, string[]> }>,
) {
  if ("showSaveFilePicker" in window) {
    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
      types,
    })
    const writable = await handle.createWritable()
    await writable.write(file)
    await writable.close()
  } else {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(file)
    link.download = filename

    document.body.append(link)
    link.click()
    link.remove()
  }
}

declare global {
  module globalThis {
    export function showSaveFilePicker(options?: {
      suggestedName?: string
      types?: Array<{ description: string; accept: Record<string, string[]> }>
    }): Promise<FileHandle>

    export type FileHandle = {
      createWritable(): Promise<FileSystemWritableFileStream>
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface FileSystemWritableFileStream extends WritableStream {
      write(content: ArrayBuffer | DataView | Blob | string): Promise<void>
    }
  }
}
