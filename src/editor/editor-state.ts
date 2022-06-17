import { FrameState } from "../frame/frame-state"
import { SpriteState } from "../sprite/sprite-state"

export type EditorState = {
  frame: FrameState
  sprites: SpriteState[]
  selectedSpriteId?: string
}
