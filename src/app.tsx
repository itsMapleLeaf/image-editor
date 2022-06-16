import { observer } from "mobx-react-lite"
import { useRef } from "react"
import { EditorSprites } from "./editor-sprites"
import type { EditorStore } from "./editor-store"
import { FrameOptionsButton } from "./frame-options-button"
import { FrameView } from "./frame-view"
import { loadImage } from "./load-image"
import { useWindowEvent } from "./use-window-event"

export const App = observer(function App({ store }: { store: EditorStore }) {
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

    store.addSprite({ id: crypto.randomUUID(), image, left, top })
  })

  return (
    <div className="fixed inset-0 flex flex-row">
      <nav>
        <EditorToolsContainer>
          <FrameOptionsButton store={store} />
        </EditorToolsContainer>
      </nav>
      <main className="min-w-0 flex-1">
        <FrameView store={store} frameRef={frameRef}>
          <EditorSprites store={store} />
        </FrameView>
      </main>
    </div>
  )
})

// eslint-disable-next-line mobx/missing-observer
function EditorToolsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-800 p-2">
      <div className="my-auto flex flex-col gap-2">{children}</div>
    </div>
  )
}
