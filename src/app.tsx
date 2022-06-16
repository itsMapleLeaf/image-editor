import { useRef, useState } from "react"
import { EditorSprite } from "./editor/editor-sprite"
import { FrameOptionsButton } from "./editor/frame-options-button"
import type { FrameShape } from "./editor/frame-shape"
import { frameShapeOptions } from "./editor/frame-shape"
import { FrameView } from "./editor/frame-view"
import type { ImageSprite } from "./editor/image-sprite"
import { Button } from "./ui/button"
import { loadImage } from "./ui/load-image"
import { useWindowEvent } from "./ui/use-window-event"

export function App() {
  const [sprites, setSprites] = useState<ImageSprite[]>([])
  const [frameShape, setFrameShape] = useState<FrameShape>(frameShapeOptions[0])
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
    const left = event.pageX - rect.left - image.width / 2
    const top = event.pageY - rect.top - image.height / 2

    setSprites([...sprites, { id: crypto.randomUUID(), image, left, top }])
  })

  return (
    <div className="fixed inset-0 flex flex-row">
      <nav>
        <EditorToolsContainer>
          <FrameOptionsButton
            shapeOptions={frameShapeOptions.map((option) => (
              <Button
                key={option.name}
                title={option.name}
                active={frameShape.name === option.name}
                onClick={() => setFrameShape(option)}
              >
                {option.icon}
              </Button>
            ))}
          />
        </EditorToolsContainer>
      </nav>
      <main className="min-w-0 flex-1">
        <FrameView shape={frameShape} frameRef={frameRef}>
          {sprites.map((sprite) => (
            <EditorSprite key={sprite.id} sprite={sprite} />
          ))}
        </FrameView>
      </main>
    </div>
  )
}

function EditorToolsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-800 p-2">
      <div className="my-auto flex flex-col gap-2">{children}</div>
    </div>
  )
}
