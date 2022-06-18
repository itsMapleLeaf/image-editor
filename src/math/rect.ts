import { Point } from "./point"

type RectArgs =
  | [size: Point]
  | [position: Point, size: Point]
  | [left: number, top: number, width: number, height: number]

export class Rect {
  static of(...args: RectArgs) {
    if (args.length === 1) {
      return new Rect(...args)
    }

    if (args.length === 2) {
      const [position, size] = args
      return new Rect(size, position)
    }

    const [left, top, width, height] = args
    return new Rect(new Point(width, height), new Point(left, top))
  }

  private constructor(
    readonly size: Point,
    readonly position = new Point(0, 0),
  ) {}

  get left() {
    return this.position.x
  }

  get right() {
    return this.position.x + this.size.x
  }

  get top() {
    return this.position.y
  }

  get bottom() {
    return this.position.y + this.size.y
  }

  get width() {
    return this.size.x
  }

  get height() {
    return this.size.y
  }

  get center() {
    return this.position.plus(this.size.divide(2))
  }

  contains(point: Point) {
    return (
      point.x >= this.left &&
      point.x <= this.right &&
      point.y >= this.top &&
      point.y <= this.bottom
    )
  }

  withWidth(width: number) {
    return new Rect(new Point(width, this.height), this.position)
  }

  withHeight(height: number) {
    return new Rect(new Point(this.width, height), this.position)
  }

  movedBy(offset: Point) {
    return new Rect(
      this.size,
      new Point(this.left + offset.x, this.top + offset.y),
    )
  }

  movedTo(position: Point) {
    return new Rect(this.size, position)
  }

  extendedBy(extent: Point) {
    return new Rect(
      this.size.plus(extent.times(2)),
      this.position.minus(extent),
    )
  }

  shrunkBy(extent: Point) {
    return this.extendedBy(extent.times(-1))
  }

  leftShiftedBy(extent: number) {
    return new Rect(
      new Point(this.width - extent, this.height),
      this.position.plus(new Point(extent, 0)),
    )
  }

  rightShiftedBy(extent: number) {
    return new Rect(new Point(this.width + extent, this.height), this.position)
  }

  topShiftedBy(extent: number) {
    return new Rect(
      new Point(this.width, this.height - extent),
      this.position.plus(new Point(0, extent)),
    )
  }

  bottomShiftedBy(extent: number) {
    return new Rect(new Point(this.width, this.height + extent), this.position)
  }
}
