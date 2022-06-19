import { observer } from "mobx-react-lite"
import { useRef, useState } from "react"
import useMeasure from "react-use-measure"
import { assert } from "../common/assert"
import { useAnimationLoop } from "../dom/use-animation-loop"
import { useWindowEvent } from "../dom/use-window-event"
import { Point } from "../math/point"
import type { EditorState } from "./editor-state"

export const EditorCanvas = observer(function EditorCanvas({
  editor,
}: {
  editor: EditorState
}) {
  const [containerRef, containerRect] = useMeasure()
  const backgroundRef = useRef<HTMLCanvasElement>(null)
  const foregroundRef = useRef<HTMLCanvasElement>(null)

  const [pointer, setPointer] = useState(new Point())

  const getFrameRelativePointerPosition = (event: {
    clientX: number
    clientY: number
  }) =>
    new Point(
      event.clientX - containerRect.left,
      event.clientY - containerRect.top,
    )

  const getCursor = () => {
    const result = editor.findSpriteWithIntent(pointer)
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

  useWindowEvent("pointermove", (event) => {
    editor.handlePointerMove(new Point(event.movementX, event.movementY))
    setPointer(getFrameRelativePointerPosition(event))
  })

  useWindowEvent("pointerup", () => {
    editor.handlePointerUp()
  })

  useAnimationLoop(() => {
    {
      const canvas = assert(backgroundRef.current)
      const context = assert(canvas.getContext("2d"))

      context.clearRect(0, 0, canvas.width, canvas.height)

      for (const sprite of editor.sprites) {
        const { left, top, width, height } = sprite.rect
        context.drawImage(sprite.image, left, top, width, height)
      }
    }

    {
      const canvas = assert(foregroundRef.current)
      const context = assert(canvas.getContext("2d"))

      context.clearRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = "rgba(0, 0, 0, 0.25)"
      context.fillRect(0, 0, editor.frame.width, editor.frame.height)

      context.save()

      context.beginPath()
      context.rect(0, 0, editor.frame.width, editor.frame.height)
      context.clip()

      for (const sprite of editor.sprites) {
        const { left, top, width, height } = sprite.rect
        context.drawImage(sprite.image, left, top, width, height)
      }

      context.restore()

      if (editor.selectedSprite) {
        const { left, top, width, height, corners } = editor.selectedSprite.rect

        context.save()

        context.fillStyle = context.strokeStyle = "rgb(96, 165, 250)"
        context.lineWidth = 2

        context.globalAlpha = 0.25
        context.fillRect(left, top, width, height)

        context.globalAlpha = 1
        context.strokeRect(left, top, width, height)

        for (const corner of corners) {
          context.beginPath()
          context.arc(corner.x, corner.y, 5, 0, Math.PI * 2)
          context.fill()
        }

        context.restore()
      }
    }
  })

  return (
    <div
      ref={containerRef}
      className="relative h-full"
      style={{ cursor: getCursor() }}
      // only capture pointerDown inside the frame
      onPointerDown={(event) => {
        editor.handlePointerDown(getFrameRelativePointerPosition(event))
      }}
    >
      <canvas
        ref={backgroundRef}
        width={containerRect.width}
        height={containerRect.height}
        className="absolute inset-0 brightness-50"
      />
      <canvas
        ref={foregroundRef}
        width={containerRect.width}
        height={containerRect.height}
        className="absolute inset-0"
      />
    </div>
  )
})
