import { mdiImage, mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import { observer } from "mobx-react-lite"
import { useRef } from "react"
import { useWindowEvent } from "../dom/use-window-event"
import { FrameOptions } from "../frame/frame-tool"
import { ImageUploadButton } from "../image/image-tool"
import { Point } from "../math/point"
import { SpriteState } from "../sprite/sprite-state"
import type { PopoverHandle } from "../ui/popover"
import type { EditorState } from "./editor-state"
import { ToolButton } from "./tool-button"

export const Editor = observer(function Editor({
  editor,
}: {
  editor: EditorState
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const imagePopoverRef = useRef<PopoverHandle>(null)

  const getFrameRelativePointerPosition = (event: PointerEvent) => {
    const frame = frameRef.current!.getBoundingClientRect()
    return new Point(event.clientX - frame.left, event.clientY - frame.top)
  }

  useWindowEvent("dragenter", (event) => event.preventDefault())
  useWindowEvent("dragleave", (event) => event.preventDefault())
  useWindowEvent("dragstart", (event) => event.preventDefault())
  useWindowEvent("dragend", (event) => event.preventDefault())

  useWindowEvent("dragover", (event) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy"
    }
  })

  useWindowEvent("drop", async (event) => {
    event.preventDefault()

    const file = event.dataTransfer?.files[0]
    if (file) addImageSprite(file)
  })

  useWindowEvent("pointerdown", (event) => {
    editor.handlePointerDown(getFrameRelativePointerPosition(event))
  })

  useWindowEvent("pointermove", (event) => {
    editor.handlePointerMove(new Point(event.movementX, event.movementY))

    const result = editor.findAnySpriteWithIntent(
      getFrameRelativePointerPosition(event),
    )

    const getCursor = () => {
      if (result?.intent === "resizeTopLeft") return "nw-resize"
      if (result?.intent === "resizeTopRight") return "ne-resize"
      if (result?.intent === "resizeBottomLeft") return "sw-resize"
      if (result?.intent === "resizeBottomRight") return "se-resize"
      if (result?.intent === "resizeLeft" || result?.intent === "resizeRight")
        return "ew-resize"
      if (result?.intent === "resizeTop" || result?.intent === "resizeBottom")
        return "ns-resize"
      if (result?.intent === "move") return "move"
    }

    document.body.style.cursor = getCursor() ?? "default"
  })

  useWindowEvent("pointerup", () => {
    editor.handlePointerUp()
  })

  const addImageSprite = (blob: Blob) => {
    const frameRect = frameRef.current!.getBoundingClientRect()

    SpriteState.fromImageUrl(
      URL.createObjectURL(blob),
      new Point(frameRect.width, frameRect.height),
    )
      .then((sprite) => {
        editor.addSprite(sprite)
        imagePopoverRef.current?.close()
      })
      .catch((error) => {
        // TODO: show error toast or something
        alert(error)
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

      <main className="relative min-w-0 flex-1 overflow-clip" ref={viewportRef}>
        <div
          ref={frameRef}
          className="absolute bg-black/25"
          style={{ width: editor.frame.width, height: editor.frame.height }}
        />

        <div className="absolute brightness-50">
          <SpriteList sprites={editor.sprites} />
        </div>

        <div
          ref={frameRef}
          className="absolute overflow-clip"
          style={{ width: editor.frame.width, height: editor.frame.height }}
        >
          <SpriteList sprites={editor.sprites} />
        </div>

        {editor.selectedSprite && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: editor.selectedSprite.rect.left,
              top: editor.selectedSprite.rect.top,
              width: editor.selectedSprite.rect.width,
              height: editor.selectedSprite.rect.height,
            }}
          >
            <div className="relative h-full bg-blue-400/25 ring-2 ring-blue-400">
              <div className="absolute left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400" />
              <div className="absolute right-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400" />
              <div className="absolute left-0 bottom-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400" />
              <div className="absolute right-0 bottom-0 h-3 w-3 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400" />
            </div>
          </div>
        )}
      </main>
    </div>
  )
})

const SpriteList = observer(function SpriteList({
  sprites,
}: {
  sprites: SpriteState[]
}) {
  return (
    <>
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          className="absolute"
          style={{
            backgroundImage: `url(${sprite.image.src})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            left: sprite.rect.left,
            top: sprite.rect.top,
            width: sprite.rect.width,
            height: sprite.rect.height,
          }}
        />
      ))}
    </>
  )
})

const ToolList = observer(function ToolList({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-800 p-2">
      <div className="my-auto flex flex-col gap-2">{children}</div>
    </div>
  )
})
