import { mdiCircleOutline, mdiSquareOutline } from "@mdi/js"
import { Icon } from "@mdi/react"
import { makeAutoObservable } from "mobx"

type ImageSprite = {
  id: string
  image: HTMLImageElement
  left: number
  top: number
}

export const frameShapeOptions = [
  {
    name: "Rectangle",
    icon: <Icon path={mdiSquareOutline} className="w-8" />,
  },
  {
    name: "Circle",
    icon: <Icon path={mdiCircleOutline} className="w-8" />,
  },
] as const

type FrameShape = typeof frameShapeOptions[number]
type FrameShapeName = FrameShape["name"]

export class EditorStore {
  constructor() {
    makeAutoObservable(this)
  }

  sprites: ImageSprite[] = []
  addSprite(sprite: ImageSprite) {
    this.sprites.push(sprite)
  }

  frameShapeName: FrameShapeName = frameShapeOptions[0].name
  get frameShape(): FrameShape {
    return frameShapeOptions.find(({ name }) => name === this.frameShapeName)!
  }
  setFrameShape(frameShapeName: FrameShapeName) {
    this.frameShapeName = frameShapeName
  }
}
