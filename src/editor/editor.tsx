import { mdiImage, mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import produce from "immer"
import { useRef, useState } from "react"
import { loadImage } from "../dom/load-image"
import { useWindowEvent } from "../dom/use-window-event"
import { FrameState } from "../frame/frame-state"
import { FrameOptions } from "../frame/frame-tool"
import { ImageUploadButton } from "../image/image-tool"
import { Point } from "../math/point"
import { Rect } from "../math/rect"
import { SpriteState } from "../sprite/sprite-state"
import { PopoverHandle } from "../ui/popover"
import { ToolButton } from "./tool-button"

type EditorState = {
  frame: FrameState
  sprites: SpriteState[]
  input: EditorInputState
  selectedSpriteId?: string
}

type EditorInputState =
  | { status: "idle" }
  | { status: "movingSprite"; spriteId: string }
  | {
      status: "resizingSprite"
      spriteId: string
      sides: Record<"left" | "top" | "right" | "bottom", boolean>
    }

export function Editor() {
  const [state, setState] = useState<EditorState>({
    sprites: [],
    frame: {
      width: 640,
      height: 360,
    },
    input: { status: "idle" },
  })

  const selectedSprite = state.sprites.find(
    (sprite) => state.selectedSpriteId === sprite.id,
  )

  const viewportRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const imagePopoverRef = useRef<PopoverHandle>(null)

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

  useWindowEvent("mousedown", (event) => {
    if (state.input.status === "idle") {
      const viewport = viewportRef.current!.getBoundingClientRect()

      const isInFrame =
        event.clientX >= viewport.left &&
        event.clientX <= viewport.right &&
        event.clientY >= viewport.top &&
        event.clientY <= viewport.bottom

      if (!isInFrame) return

      const frame = frameRef.current!.getBoundingClientRect()

      const localMouse = new Point(
        event.clientX - frame.left,
        event.clientY - frame.top,
      )

      // the half-width of the resizing clickable area on each edge of a sprite
      const resizeExtent = new Point(20)

      const inputResult = [...state.sprites]
        .reverse()
        .map((sprite) => {
          const { rect } = sprite

          const selected = rect.contains(localMouse)

          const outerResizeExtent = rect.extendedBy(resizeExtent)
          const innerResizeExtent = rect.shrunkBy(resizeExtent)

          const leftResizeArea = new Rect(
            new Point(resizeExtent.x * 2, outerResizeExtent.height),
            new Point(outerResizeExtent.left, outerResizeExtent.top),
          )
          const rightResizeArea = new Rect(
            new Point(resizeExtent.x * 2, outerResizeExtent.height),
            new Point(innerResizeExtent.right, outerResizeExtent.top),
          )
          const topResizeArea = new Rect(
            new Point(outerResizeExtent.width, resizeExtent.y * 2),
            new Point(outerResizeExtent.left, outerResizeExtent.top),
          )
          const bottomResizeArea = new Rect(
            new Point(outerResizeExtent.width, resizeExtent.y * 2),
            new Point(outerResizeExtent.left, innerResizeExtent.bottom),
          )
          // debugger
          const resizingSides = {
            left: leftResizeArea.contains(localMouse),
            right: rightResizeArea.contains(localMouse),
            top: topResizeArea.contains(localMouse),
            bottom: bottomResizeArea.contains(localMouse),
          }

          console.log(resizingSides)

          return {
            sprite,
            selected,
            resizingSides,
            isResizing: Object.values(resizingSides).some(Boolean),
          }
        })
        .find((result) => result.selected || result.isResizing)

      setState(
        produce((draft) => {
          draft.selectedSpriteId = inputResult?.sprite.id

          if (inputResult?.isResizing) {
            draft.input = {
              status: "resizingSprite",
              spriteId: inputResult.sprite.id,
              sides: inputResult.resizingSides,
            }
            return
          }

          if (inputResult?.selected) {
            draft.input = {
              status: "movingSprite",
              spriteId: inputResult.sprite?.id,
            }
            return
          }
        }),
      )
    }
  })

  useWindowEvent("mousemove", (event) => {
    if (state.input.status === "movingSprite") {
      const { spriteId } = state.input

      setState(
        produce((draft) => {
          const sprite = draft.sprites.find((sprite) => sprite.id === spriteId)
          if (!sprite) return

          // this is naiive and breaks in some instances,
          // but is good enough for MVP
          sprite.rect = sprite.rect.movedBy(
            new Point(event.movementX, event.movementY),
          )
        }),
      )
    }

    if (state.input.status === "resizingSprite") {
      const { spriteId, sides } = state.input

      setState(
        produce((draft) => {
          const sprite = draft.sprites.find((sprite) => sprite.id === spriteId)
          if (!sprite) return

          // this is naiive and breaks in some instances,
          // but is good enough for MVP
          if (sides.left) {
            sprite.rect = sprite.rect.leftShiftedBy(event.movementX)
          }
          if (sides.right) {
            sprite.rect = sprite.rect.rightShiftedBy(event.movementX)
          }
          if (sides.top) {
            sprite.rect = sprite.rect.topShiftedBy(event.movementY)
          }
          if (sides.bottom) {
            sprite.rect = sprite.rect.bottomShiftedBy(event.movementY)
          }
        }),
      )
    }
  })

  useWindowEvent("mouseup", () => {
    if (
      state.input.status === "movingSprite" ||
      state.input.status === "resizingSprite"
    ) {
      setState({ ...state, input: { status: "idle" } })
    }
  })

  const addImageSprite = async (blob: Blob) => {
    if (!blob.type.startsWith("image/")) return

    const image = await loadImage(URL.createObjectURL(blob))
    const frame = frameRef.current!
    const rect = frame.getBoundingClientRect()

    // the scale of the image compared to the frame
    const imageScaleHorizontal = image.width / rect.width
    const imageScaleVertical = image.height / rect.height

    const containMultiplier = Math.min(
      1 / imageScaleHorizontal,
      1 / imageScaleVertical,
      // don't want to scale the image up if it's already smaller than the frame
      1,
    )

    const scaledWidth = image.width * containMultiplier
    const scaledHeight = image.height * containMultiplier

    const left = rect.width / 2 - scaledWidth / 2
    const top = rect.height / 2 - scaledHeight / 2

    setState({
      ...state,
      sprites: [
        ...state.sprites,
        {
          type: "image",
          id: crypto.randomUUID(),
          image,
          rect: new Rect(
            new Point(scaledWidth, scaledHeight),
            new Point(left, top),
          ),
        },
      ],
    })

    imagePopoverRef.current?.close()
  }

  return (
    <div className="fixed inset-0 flex flex-row">
      <nav>
        <ToolList>
          <ToolButton
            name="Frame"
            icon={<Icon path={mdiVectorRectangle} className="w-8" />}
          >
            <FrameOptions
              frame={state.frame}
              onChange={(frame) => setState({ ...state, frame })}
            />
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
          style={{ width: state.frame.width, height: state.frame.height }}
        />

        <div className="absolute brightness-50">
          <SpriteList sprites={state.sprites} />
        </div>

        <div
          ref={frameRef}
          className="absolute overflow-clip"
          style={{ width: state.frame.width, height: state.frame.height }}
        >
          <SpriteList sprites={state.sprites} />
        </div>

        {selectedSprite && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: selectedSprite.rect.left,
              top: selectedSprite.rect.top,
              width: selectedSprite.rect.right - selectedSprite.rect.left,
              height: selectedSprite.rect.bottom - selectedSprite.rect.top,
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
}

function SpriteList({ sprites }: { sprites: SpriteState[] }) {
  return (
    <>
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          className="absolute cursor-pointer"
          style={{
            backgroundImage: `url(${sprite.image.src})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            left: sprite.rect.left,
            top: sprite.rect.top,
            width: sprite.rect.right - sprite.rect.left,
            height: sprite.rect.bottom - sprite.rect.top,
          }}
        />
      ))}
    </>
  )
}

function ToolList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-800 p-2">
      <div className="my-auto flex flex-col gap-2">{children}</div>
    </div>
  )
}
