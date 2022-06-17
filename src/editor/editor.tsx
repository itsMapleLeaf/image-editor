import { mdiImage, mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import produce from "immer"
import { useRef, useState } from "react"
import { loadImage } from "../dom/load-image"
import { useWindowEvent } from "../dom/use-window-event"
import { FrameState } from "../frame/frame-state"
import { FrameOptions } from "../frame/frame-tool"
import { ImageUploadButton } from "../image/image-tool"
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
      const frameX = event.clientX - frame.left
      const frameY = event.clientY - frame.top

      // prettier-ignore
      const selected = [...state.sprites].reverse().find((sprite) => (
        frameX >= sprite.left &&
        frameX <= sprite.left + sprite.width &&
        frameY >= sprite.top &&
        frameY <= sprite.top + sprite.height
      ))

      setState(
        produce((draft) => {
          draft.selectedSpriteId = selected?.id
          if (selected) {
            draft.input = { status: "movingSprite", spriteId: selected?.id }
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
          sprite.left += event.movementX
          sprite.top += event.movementY
        }),
      )
    }
  })

  useWindowEvent("mouseup", () => {
    if (state.input.status === "movingSprite") {
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
          left,
          top,
          width: scaledWidth,
          height: scaledHeight,
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
            className="pointer-events-none absolute border-2 border-blue-400 bg-blue-400/25"
            style={{
              left: selectedSprite.left,
              top: selectedSprite.top,
              width: selectedSprite.width,
              height: selectedSprite.height,
            }}
          />
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
            backgroundSize: "100%",
            left: sprite.left,
            top: sprite.top,
            width: sprite.width,
            height: sprite.height,
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
