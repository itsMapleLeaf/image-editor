import { useEffect, useRef, useState } from "react"

type ImageSprite = {
  id: string
  image: HTMLImageElement
  left: number
  top: number
}

export default function App() {
  const [images, setImages] = useState<ImageSprite[]>([])
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
    const left = event.clientX - frame.offsetLeft - image.width / 2
    const top = event.clientY - frame.offsetTop - image.height / 2

    setImages((images) => [
      ...images,
      { id: crypto.randomUUID(), image, left, top },
    ])
  })

  return (
    <main className="p-8">
      <div
        className="mx-auto block bg-white w-[1280px] max-w-full aspect-video relative overflow-clip"
        ref={frameRef}
      >
        {images.map((sprite) => (
          <img
            key={sprite.id}
            alt=""
            src={sprite.image.src}
            className="absolute"
            style={{ left: sprite.left, top: sprite.top }}
          />
        ))}
      </div>
    </main>
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
