import type { ComponentPropsWithoutRef, ForwardedRef } from "react"
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { assert } from "../common/assert"
import { combineRefs } from "../react/combine-refs"

type RenderCallback = (context: CanvasRenderingContext2D) => void

const CanvasContext = createContext(new Map<string, RenderCallback>())

export const Canvas = forwardRef(function Canvas(
  { children, ...props }: ComponentPropsWithoutRef<"canvas">,
  forwardedRef: ForwardedRef<HTMLCanvasElement>,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [childCallbacks] = useState(() => new Map<string, RenderCallback>())

  useEffect(() => {
    const canvas = assert(canvasRef.current, "Canvas ref not assigned")
    const context = assert(canvas.getContext("2d"), "Canvas not available")

    // using the order of the child data elements,
    // we can draw the canvas elements top to bottom
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (const element of canvas.children) {
      if (element instanceof HTMLDataElement) {
        context.save()
        childCallbacks.get(element.value)?.(context)
        context.restore()
      }
    }
  })

  return (
    <CanvasContext.Provider value={childCallbacks}>
      <canvas {...props} ref={combineRefs(canvasRef, forwardedRef)}>
        {children}
      </canvas>
    </CanvasContext.Provider>
  )
})

function CanvasElement({
  render,
  children,
}: {
  render: (
    context: CanvasRenderingContext2D,
    renderChildren: () => void,
  ) => void
  children?: React.ReactNode
}) {
  const id = useId()
  const dataElementRef = useRef<HTMLDataElement>(null)
  const parentCallbacks = useContext(CanvasContext)
  const [childCallbacks] = useState(() => new Map<string, RenderCallback>())

  const renderChildren = (context: CanvasRenderingContext2D) => {
    for (const element of dataElementRef.current?.children ?? []) {
      if (element instanceof HTMLDataElement) {
        context.save()
        childCallbacks.get(element.value)?.(context)
        context.restore()
      }
    }
  }

  useEffect(() => {
    parentCallbacks.set(id, (context) => {
      render(context, () => renderChildren(context))
    })
    return () => {
      parentCallbacks.delete(id)
    }
  })

  return (
    <data value={id} ref={dataElementRef}>
      <CanvasContext.Provider value={childCallbacks}>
        {children}
      </CanvasContext.Provider>
    </data>
  )
}

export function FillRect(props: {
  left?: number
  top?: number
  width: number
  height: number
  color?: string
  alpha?: number
}) {
  return (
    <CanvasElement
      render={(context) => {
        if (props.color) context.fillStyle = props.color
        if (props.alpha) context.globalAlpha = props.alpha
        context.fillRect(
          props.left ?? 0,
          props.top ?? 0,
          props.width,
          props.height,
        )
      }}
    />
  )
}

export function StrokeRect(props: {
  left?: number
  top?: number
  width: number
  height: number
  color?: string
  alpha?: number
  lineWidth?: number
}) {
  return (
    <CanvasElement
      render={(context) => {
        context.strokeStyle = props.color || context.strokeStyle
        context.globalAlpha = props.alpha || context.globalAlpha
        context.lineWidth = props.lineWidth || context.lineWidth
        context.strokeRect(
          props.left ?? 0,
          props.top ?? 0,
          props.width,
          props.height,
        )
      }}
    />
  )
}

export function Image(props: {
  source: HTMLImageElement
  left?: number
  top?: number
  width?: number
  height?: number
}) {
  return (
    <CanvasElement
      render={(context) => {
        context.drawImage(
          props.source,
          props.left ?? 0,
          props.top ?? 0,
          props.width ?? props.source.width,
          props.height ?? props.source.height,
        )
      }}
    />
  )
}

export function FillCircle(props: {
  x: number
  y: number
  radius: number
  color?: string
  alpha?: number
}) {
  return (
    <CanvasElement
      render={(context) => {
        if (props.color) context.fillStyle = props.color
        if (props.alpha) context.globalAlpha = props.alpha
        context.beginPath()
        context.arc(props.x, props.y, props.radius, 0, 2 * Math.PI)
        context.fill()
      }}
    />
  )
}

export function StrokeCircle(props: {
  x: number
  y: number
  radius: number
  color?: string
  alpha?: number
  lineWidth?: number
}) {
  return (
    <CanvasElement
      render={(context) => {
        context.strokeStyle = props.color || context.strokeStyle
        context.globalAlpha = props.alpha || context.globalAlpha
        context.lineWidth = props.lineWidth || context.lineWidth
        context.beginPath()
        context.arc(props.x, props.y, props.radius, 0, 2 * Math.PI)
        context.stroke()
      }}
    />
  )
}

export function ClipRect(props: {
  left?: number
  top?: number
  width: number
  height: number
  children: React.ReactNode
}) {
  return (
    <CanvasElement
      render={(context, renderChildren) => {
        context.beginPath()
        context.rect(props.left ?? 0, props.top ?? 0, props.width, props.height)
        context.clip()
        renderChildren()
      }}
    >
      {props.children}
    </CanvasElement>
  )
}
