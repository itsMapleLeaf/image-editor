import { Rect } from "../math/rect"

export type SpriteState = {
  type: "image"
  id: string
  image: HTMLImageElement
  rect: Rect
}
