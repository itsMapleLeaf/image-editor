export class Point {
  constructor(readonly x = 0, readonly y = x) {}

  plus(other: Point) {
    return new Point(this.x + other.x, this.y + other.y)
  }

  minus(other: Point) {
    return new Point(this.x - other.x, this.y - other.y)
  }

  times(factor: number) {
    return new Point(this.x * factor, this.y * factor)
  }

  divide(factor: number) {
    return new Point(this.x / factor, this.y / factor)
  }
}
