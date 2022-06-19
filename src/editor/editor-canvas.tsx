import { observer } from "mobx-react-lite"
import { useRef, useState } from "react"
import useMeasure from "react-use-measure"
import {
  Canvas,
  ClipRect,
  FillCircle,
  FillRect,
  Image,
  StrokeRect,
} from "../canvas/canvas"
import { pick } from "../common/pick"
import { useWindowEvent } from "../dom/use-window-event"
import { Point } from "../math/point"
import type { SpriteState } from "../sprite/sprite-state"
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
      <Canvas
        width={containerRect.width}
        height={containerRect.height}
        className="absolute inset-0 brightness-50"
      >
        {editor.sprites.map((sprite) => (
          <SpriteImage sprite={sprite} key={sprite.id} />
        ))}
      </Canvas>

      <Canvas
        width={containerRect.width}
        height={containerRect.height}
        className="absolute inset-0"
      >
        <FillRect
          width={editor.frame.width}
          height={editor.frame.height}
          color="rgba(0, 0, 0, 0.25)"
        />

        <ClipRect width={editor.frame.width} height={editor.frame.height}>
          {editor.sprites.map((sprite) => (
            <SpriteImage sprite={sprite} key={sprite.id} />
          ))}
        </ClipRect>

        {editor.selectedSprite && (
          <SpriteSelection sprite={editor.selectedSprite} />
        )}
      </Canvas>
    </div>
  )
})

const SpriteImage = observer(function SpriteImage({
  sprite,
}: {
  sprite: SpriteState
}) {
  return (
    <Image
      source={sprite.image}
      {...pick(sprite.rect, ["left", "top", "width", "height"])}
    />
  )
})

const SpriteSelection = observer(function SpriteSelection({
  sprite,
}: {
  sprite: SpriteState
}) {
  const { left, top, width, height, corners } = sprite.rect
  const color = "rgb(96, 165, 250)"
  const props = { left, top, width, height, color }

  return (
    <>
      <FillRect {...props} alpha={0.25} />
      <StrokeRect {...props} lineWidth={2} />
      {corners.map((corner, index) => (
        <FillCircle
          key={index}
          x={corner.x}
          y={corner.y}
          radius={5}
          color={color}
        />
      ))}
    </>
  )
})
