import { makeAutoObservable } from "mobx"
import { loadImage } from "../dom/load-image"
import { Point } from "../math/point"
import { Rect } from "../math/rect"

export type SpritePointerIntent =
  | "move"
  | "resizeLeft"
  | "resizeRight"
  | "resizeTop"
  | "resizeBottom"
  | "resizeTopLeft"
  | "resizeTopRight"
  | "resizeBottomLeft"
  | "resizeBottomRight"

// the half-width of the resizing clickable area on each edge of a sprite
const resizeExtent = new Point(20)

export class SpriteState {
  private constructor(
    readonly id: string,
    public image: HTMLImageElement,
    public rect: Rect,
  ) {
    makeAutoObservable(this)
  }

  static async fromImageUrl(
    url: string,
    frameSize: Point,
  ): Promise<SpriteState> {
    const image = await loadImage(url)

    // the scale of the image compared to the frame
    const imageScaleHorizontal = image.width / frameSize.x
    const imageScaleVertical = image.height / frameSize.y

    const containMultiplier = Math.min(
      1 / imageScaleHorizontal,
      1 / imageScaleVertical,
      // don't want to scale the image up if it's already smaller than the frame
      1,
    )

    const scaledWidth = image.width * containMultiplier
    const scaledHeight = image.height * containMultiplier

    const left = frameSize.x / 2 - scaledWidth / 2
    const top = frameSize.y / 2 - scaledHeight / 2

    return new SpriteState(
      crypto.randomUUID(),
      image,
      Rect.of(new Point(left, top), new Point(scaledWidth, scaledHeight)),
    )
  }

  getPointerIntent(pointer: Point): SpritePointerIntent | undefined {
    const outerResizeExtent = this.rect.extendedBy(resizeExtent)
    const innerResizeExtent = this.rect.shrunkBy(resizeExtent)

    const leftResizeArea = Rect.of(
      new Point(outerResizeExtent.left, outerResizeExtent.top),
      new Point(resizeExtent.x * 2, outerResizeExtent.height),
    )
    const rightResizeArea = Rect.of(
      new Point(innerResizeExtent.right, outerResizeExtent.top),
      new Point(resizeExtent.x * 2, outerResizeExtent.height),
    )
    const topResizeArea = Rect.of(
      new Point(outerResizeExtent.left, outerResizeExtent.top),
      new Point(outerResizeExtent.width, resizeExtent.y * 2),
    )
    const bottomResizeArea = Rect.of(
      new Point(outerResizeExtent.left, innerResizeExtent.bottom),
      new Point(outerResizeExtent.width, resizeExtent.y * 2),
    )

    if (leftResizeArea.contains(pointer) && topResizeArea.contains(pointer)) {
      return "resizeTopLeft"
    }

    if (
      leftResizeArea.contains(pointer) &&
      bottomResizeArea.contains(pointer)
    ) {
      return "resizeBottomLeft"
    }

    if (rightResizeArea.contains(pointer) && topResizeArea.contains(pointer)) {
      return "resizeTopRight"
    }

    if (
      rightResizeArea.contains(pointer) &&
      bottomResizeArea.contains(pointer)
    ) {
      return "resizeBottomRight"
    }

    if (leftResizeArea.contains(pointer)) return "resizeLeft"
    if (rightResizeArea.contains(pointer)) return "resizeRight"
    if (topResizeArea.contains(pointer)) return "resizeTop"
    if (bottomResizeArea.contains(pointer)) return "resizeBottom"

    if (this.rect.contains(pointer)) return "move"
  }
}
