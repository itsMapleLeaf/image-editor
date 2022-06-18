import { mdiImage, mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import { observer } from "mobx-react-lite"
import { useRef } from "react"
import { FrameOptions } from "../frame/frame-tool"
import { ImageUploadButton } from "../image/image-tool"
import { Point } from "../math/point"
import { SpriteState } from "../sprite/sprite-state"
import { FileDropzone } from "../ui/file-dropzone"
import type { PopoverHandle } from "../ui/popover"
import { EditorCanvas } from "./editor-canvas"
import type { EditorState } from "./editor-state"
import { EditorViewport } from "./editor-viewport"
import { ToolButton } from "./tool-button"

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

  return (
    <div className="fixed inset-0 flex flex-row">
      <nav>
        <ToolList>
          <ToolButton
            name="Frame"
            icon={<Icon path={mdiVectorRectangle} className="w-8" />}
          >
            <FrameOptions frame={editor.frame} />
          </ToolButton>
          <ToolButton
            name="Image"
            icon={<Icon path={mdiImage} className="w-8" />}
            popoverRef={imagePopoverRef}
          >
            <ImageUploadButton onUpload={addImageSprite} />
          </ToolButton>
        </ToolList>
      </nav>

      <main className="min-w-0 flex-1">
        <FileDropzone onDrop={addImageSprite}>
          <EditorViewport editor={editor}>
            <EditorCanvas editor={editor} />
          </EditorViewport>
        </FileDropzone>
      </main>
    </div>
  )
})

// eslint-disable-next-line mobx/missing-observer
function ToolList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-800 p-2">
      <div className="my-auto flex flex-col gap-2">{children}</div>
    </div>
  )
}
