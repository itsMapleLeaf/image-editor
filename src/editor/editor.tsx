import { useRef, useState } from "react"
import { loadImage } from "../dom/load-image"
import { useWindowEvent } from "../dom/use-window-event"
import { Frame } from "../frame/frame"
import { FrameTool } from "../frame/frame-tool"
import { Sprite } from "../sprite/sprite"
import { EditorState } from "./editor-state"

export function Editor() {
  const [state, setState] = useState<EditorState>({
    sprites: [],
    frame: {
      width: 640,
      height: 360,
    },
  })

  const frameRef = useRef<HTMLDivElement>(null)

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
    if (!file?.type.startsWith("image/")) return

    const image = await loadImage(URL.createObjectURL(file))
    const frame = frameRef.current!
    const rect = frame.getBoundingClientRect()

    // the scale of the image compared to the frame
    const imageScaleHorizontal = image.width / rect.width
    const imageScaleVertical = image.height / rect.height

    const containMultiplier = Math.min(
      1 / imageScaleHorizontal,
      1 / imageScaleVertical,
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
  })

  return (
    <div className="fixed inset-0 flex flex-row">
      <nav>
        <ToolList>
          <FrameTool
            frame={state.frame}
            onChange={(frame) => setState({ ...state, frame })}
          />
        </ToolList>
      </nav>
      <main className="min-w-0 flex-1">
        <Frame state={state.frame} frameRef={frameRef}>
          {state.sprites.map((sprite) => (
            <Sprite key={sprite.id} sprite={sprite} />
          ))}
        </Frame>
      </main>
    </div>
  )
}

function ToolList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-800 p-2">
      <div className="my-auto flex flex-col gap-2">{children}</div>
    </div>
  )
}
