import { ChartSquareBarIcon, CogIcon, EyeIcon } from "@heroicons/react/solid"
import type { ComponentPropsWithoutRef } from "react"
import { useEffect, useRef, useState } from "react"

type ImageSprite = {
  id: string
  image: HTMLImageElement
  left: number
  top: number
}

export default function App() {
  const [sprites, setSprites] = useState<ImageSprite[]>([])
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

    setSprites((images) => [
      ...images,
      { id: crypto.randomUUID(), image, left, top },
    ])
  })

  return (
    <div className="fixed inset-0 flex flex-row">
      <nav className="flex h-full flex-col overflow-y-auto bg-slate-800 p-2">
        <div className="my-auto flex flex-col gap-2">
          <ToolButton>
            <CogIcon className="w-8" />
          </ToolButton>
          <ToolButton>
            <EyeIcon className="w-8" />
          </ToolButton>
          <ToolButton>
            <ChartSquareBarIcon className="w-8" />
          </ToolButton>
        </div>
      </nav>
      <main className="relative flex min-w-0 flex-1 overflow-auto p-4">
        <div className="absolute inset-0 flex">
          <div className="m-auto">
            <div
              className="relative bg-black/25 brightness-50 filter"
              style={{ width: 100, height: 100 }}
            >
              {sprites.map((sprite) => (
                <img
                  key={sprite.id}
                  alt=""
                  src={sprite.image.src}
                  className="absolute"
                  style={{
                    left: sprite.left,
                    top: sprite.top,
                    minWidth: sprite.image.width,
                    minHeight: sprite.image.height,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex">
          <div className="m-auto">
            <div
              className="relative overflow-clip"
              style={{ width: 100, height: 100 }}
              ref={frameRef}
            >
              {sprites.map((sprite) => (
                <img
                  key={sprite.id}
                  alt=""
                  src={sprite.image.src}
                  className="absolute"
                  style={{
                    left: sprite.left,
                    top: sprite.top,
                    minWidth: sprite.image.width,
                    minHeight: sprite.image.height,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function useWindowEvent<Event extends keyof WindowEventMap>(
  event: Event,
  handler: (event: WindowEventMap[Event]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    window.addEventListener(event, handler, options)
    return () => {
      window.removeEventListener(event, handler, options)
    }
  })
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", reject)
  })
}

function ToolButton(props: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className="rounded-md bg-slate-600 p-1 opacity-50 transition-opacity hover:opacity-100"
    />
  )
}
