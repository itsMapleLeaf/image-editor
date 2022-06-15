import { useEffect, useRef, useState } from "react"

type ImageSprite = {
  id: string
  image: HTMLImageElement
  left: number
  top: number
}

export default function App() {
  const [images, setImages] = useState<ImageSprite[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    if (!file) return
    if (!file.type.startsWith("image/")) return

    const image = await loadImage(URL.createObjectURL(file))

    const canvas = canvasRef.current!
    const left = event.clientX - canvas.offsetLeft - image.width / 2
    const top = event.clientY - canvas.offsetTop - image.height / 2

    setImages((images) => [
      ...images,
      { id: crypto.randomUUID(), image, left, top },
    ])
  })

  useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext("2d")!

    context.clearRect(0, 0, canvas.width, canvas.height)

    for (const image of images) {
      context.drawImage(image.image, image.left, image.top)
    }
  })

  return (
    <main className="p-8">
      <canvas
        className="mx-auto block bg-white"
        width={1280}
        height={720}
        ref={canvasRef}
      />
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
