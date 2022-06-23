import { assert } from "../common/assert"

export type RectOptions = {
  left?: number
  top?: number
  width: number
  height: number
}

export type ArcOptions = {
  x: number
  y: number
  radius: number
  arcStart?: number
  arcEnd?: number
}

export type FillOptions = {
  color?: string
  alpha?: number
}

export type StrokeOptions = {
  color?: string
  alpha?: number
  lineWidth?: number
}

export class Renderer {
  readonly context

  constructor(readonly canvas: HTMLCanvasElement) {
    this.context = assert(
      this.canvas.getContext("2d"),
      "Canvas is not available",
    )
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  isolate(block: () => void) {
    this.context.save()
    block()
    this.context.restore()
  }

  drawImage(image: HTMLImageElement, options: Partial<RectOptions>) {
    this.isolate(() => {
      const { width, height } = image
      this.context.drawImage(
        image,
        ...Renderer.getRectArgs({ width, height, ...options }),
      )
    })
  }

  fillRect(options: RectOptions & FillOptions) {
    this.isolate(() => {
      this.configureFill(options)
      this.context.fillRect(...Renderer.getRectArgs(options))
    })
  }

  strokeRect(options: RectOptions & StrokeOptions) {
    this.isolate(() => {
      this.configureStroke(options)
      this.context.strokeRect(...Renderer.getRectArgs(options))
    })
  }

  clipRect(options: RectOptions, block: () => void) {
    this.isolate(() => {
      this.context.beginPath()
      this.context.rect(...Renderer.getRectArgs(options))
      this.context.clip()
      block()
    })
  }

  fillArc(options: ArcOptions & FillOptions) {
    this.isolate(() => {
      this.configureFill(options)
      this.context.beginPath()
      this.context.arc(...Renderer.getArcArgs(options))
      this.context.fill()
    })
  }

  strokeArc(options: ArcOptions & StrokeOptions) {
    this.isolate(() => {
      this.configureStroke(options)
      this.context.beginPath()
      this.context.arc(...Renderer.getArcArgs(options))
      this.context.stroke()
    })
  }

  private static getRectArgs({
    left = 0,
    top = 0,
    width,
    height,
  }: RectOptions) {
    return [left, top, width, height] as const
  }

  private static getArcArgs(options: ArcOptions) {
    return [
      options.x,
      options.y,
      options.radius,
      options.arcStart ?? 0,
      options.arcEnd ?? Math.PI * 2,
    ] as const
  }

  private configureFill(options: FillOptions) {
    this.context.fillStyle = options.color ?? this.context.fillStyle
    this.context.globalAlpha = options.alpha ?? this.context.globalAlpha
  }

  private configureStroke(options: StrokeOptions) {
    this.context.strokeStyle = options.color ?? this.context.strokeStyle
    this.context.globalAlpha = options.alpha ?? this.context.globalAlpha
    this.context.lineWidth = options.lineWidth ?? this.context.lineWidth
  }
}
