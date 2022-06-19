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

export function FillRect(props: RectProps & FillProps) {
  return (
    <CanvasElement
      render={(context) => {
        applyFillProps(props, context)
        context.fillRect(...getRectArgs(props))
      }}
    />
  )
}

export function StrokeRect(props: RectProps & StrokeProps) {
  return (
    <CanvasElement
      render={(context) => {
        applyStrokeProps(props, context)
        context.strokeRect(...getRectArgs(props))
      }}
    />
  )
}

export function Image(
  props: Partial<RectProps> & { source: HTMLImageElement },
) {
  return (
    <CanvasElement
      render={(context) => {
        context.drawImage(
          props.source,
          ...getRectArgs({
            width: props.source.width,
            height: props.source.height,
            ...props,
          }),
        )
      }}
    />
  )
}

export function FillCircle(props: ArcProps & FillProps) {
  return (
    <CanvasElement
      render={(context) => {
        applyFillProps(props, context)
        context.beginPath()
        context.arc(...getArcArgs(props))
        context.fill()
      }}
    />
  )
}

export function StrokeCircle(props: ArcProps & StrokeProps) {
  return (
    <CanvasElement
      render={(context) => {
        applyStrokeProps(props, context)
        context.beginPath()
        context.arc(...getArcArgs(props))
        context.stroke()
      }}
    />
  )
}

export function ClipRect(props: RectProps & { children: React.ReactNode }) {
  return (
    <CanvasElement
      render={(context, renderChildren) => {
        context.beginPath()
        context.rect(...getRectArgs(props))
        context.clip()
        renderChildren()
      }}
    >
      {props.children}
    </CanvasElement>
  )
}

type RectProps = {
  left?: number
  top?: number
  width: number
  height: number
}

function getRectArgs({ left = 0, top = 0, width, height }: RectProps) {
  return [left, top, width, height] as const
}

type ArcProps = {
  x: number
  y: number
  radius: number
  arcStart?: number
  arcEnd?: number
}

function getArcArgs(props: ArcProps) {
  return [
    props.x,
    props.y,
    props.radius,
    props.arcStart ?? 0,
    props.arcEnd ?? Math.PI * 2,
  ] as const
}

type FillProps = {
  color?: string
  alpha?: number
}

function applyFillProps(props: FillProps, context: CanvasRenderingContext2D) {
  context.fillStyle = props.color ?? context.fillStyle
  context.globalAlpha = props.alpha ?? context.globalAlpha
}

type StrokeProps = {
  color?: string
  alpha?: number
  lineWidth?: number
}

function applyStrokeProps(
  props: StrokeProps,
  context: CanvasRenderingContext2D,
) {
  context.strokeStyle = props.color ?? context.strokeStyle
  context.globalAlpha = props.alpha ?? context.globalAlpha
  context.lineWidth = props.lineWidth ?? context.lineWidth
}
