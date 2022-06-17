import { mdiCircleOutline, mdiSquareOutline } from "@mdi/js"
import { Icon } from "@mdi/react"

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

export type FrameShape = typeof frameShapeOptions[number]

export type FrameState = {
  shape: FrameShape
  width: number
  height: number
}
