import { mdiDownload, mdiImage, mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import { observer } from "mobx-react-lite"
import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import { Canvas } from "../canvas/canvas"
import { assert } from "../common/assert"
import { FrameOptions } from "../frame/frame-tool"
import { ImageUploadButton } from "../image/image-tool"
import { Point } from "../math/point"
import { SpriteState } from "../sprite/sprite-state"
import { FileDropzone } from "../ui/file-dropzone"
import type { PopoverHandle } from "../ui/popover"
import { EditorCanvas } from "./editor-canvas"
import { EditorSprites } from "./editor-sprites"
import type { EditorState } from "./editor-state"
import { ToolButton, ToolPopover } from "./tool-button"

export const Editor = observer(function Editor({
  editor,
}: {
  editor: EditorState
}) {
  const imagePopoverRef = useRef<PopoverHandle>(null)

  const addImageSprite = (blob: Blob) => {
    SpriteState.fromImageUrl(
      URL.createObjectURL(blob),
      new Point(editor.frame.width, editor.frame.height),
    )
      .then((sprite) => {
        editor.addSprite(sprite)
        imagePopoverRef.current?.close()
      })
      .catch((error) => {
        // TODO: show error toast or something
        alert(error?.stack || error?.message)
      })
  }

  const exportImage = () => {
    const container = document.createElement("div")
    createRoot(container).render(<Root />)

    // I want to use the same rendering logic as the app,
    // hence this weird inline component useEffect monstrosity 🤪
    // eslint-disable-next-line mobx/missing-observer
    function Root() {
      useEffect(() => {
        const canvas = assert(
          container.querySelector("canvas"),
          "no canvas found?",
        )

        const link = document.createElement("a")
        link.href = canvas.toDataURL("image/png")
        link.download = "exported.png"

        document.body.append(link)
        link.click()
        link.remove()
      }, [])

      return (
        <Canvas width={editor.frame.width} height={editor.frame.height}>
          <EditorSprites editor={editor} />
        </Canvas>
      )
    }
  }

  return (
    <div className="fixed inset-0 flex flex-row">
      <nav>
        <ToolList>
          <ToolPopover
            name="Frame"
            icon={<Icon path={mdiVectorRectangle} className="w-6" />}
          >
            <FrameOptions frame={editor.frame} />
          </ToolPopover>
          <ToolPopover
            name="Image"
            icon={<Icon path={mdiImage} className="w-6" />}
            popoverRef={imagePopoverRef}
          >
            <ImageUploadButton onUpload={addImageSprite} />
          </ToolPopover>
          <ToolButton
            name="Export"
            icon={<Icon path={mdiDownload} className="w-6" />}
            onClick={exportImage}
          />
        </ToolList>
      </nav>

      <main className="min-w-0 flex-1">
        <FileDropzone onDrop={addImageSprite}>
          <EditorCanvas editor={editor} />
        </FileDropzone>
      </main>
    </div>
  )
})

// eslint-disable-next-line mobx/missing-observer
function ToolList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-800 p-2">
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}
