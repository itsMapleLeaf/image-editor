import { makeAutoObservable } from "mobx"
import { FrameState } from "../frame/frame-state"
import type { Point } from "../math/point"
import type { SpritePointerIntent, SpriteState } from "../sprite/sprite-state"

type SpriteIntentResult = {
  sprite: SpriteState
  intent: SpritePointerIntent
}

export class EditorState {
  frame = new FrameState()
  sprites: SpriteState[] = []
  selectedSpriteId?: string
  activeSpriteIntent?: SpritePointerIntent

  constructor() {
    makeAutoObservable(this)
  }

  get selectedSprite(): SpriteState | undefined {
    return this.sprites.find((sprite) => sprite.id === this.selectedSpriteId)
  }

  addSprite(sprite: SpriteState) {
    this.sprites.push(sprite)
  }

  findSpriteWithIntent(position: Point): SpriteIntentResult | undefined {
    // if there's already a sprite selected, try to find an intent on that first
    if (this.selectedSprite) {
      const intent = this.selectedSprite.getPointerIntent(position)
      if (intent) return { sprite: this.selectedSprite, intent }
    }

    // otherwise, find another sprite with an intent,
    // but go back to front, so we check sprites on top first
    for (const sprite of [...this.sprites].reverse()) {
      const intent = sprite.getPointerIntent(position)
      if (intent) return { sprite, intent }
    }
  }

  handlePointerDown(position: Point) {
    const result = this.findSpriteWithIntent(position)
    this.selectedSpriteId = result?.sprite.id
    this.activeSpriteIntent = result?.intent
  }

  handlePointerMove(delta: Point) {
    if (!this.selectedSprite) return
    if (!this.activeSpriteIntent) return

    const sprite = this.selectedSprite

    // this is naiive and breaks in some instances,
    // but is good enough for MVP
    if (this.activeSpriteIntent === "move") {
      sprite.rect = sprite.rect.movedBy(delta)
    }

    if (
      this.activeSpriteIntent === "resizeLeft" ||
      this.activeSpriteIntent === "resizeTopLeft" ||
      this.activeSpriteIntent === "resizeBottomLeft"
    ) {
      sprite.rect = sprite.rect.leftShiftedBy(delta.x)
    }

    if (
      this.activeSpriteIntent === "resizeRight" ||
      this.activeSpriteIntent === "resizeTopRight" ||
      this.activeSpriteIntent === "resizeBottomRight"
    ) {
      sprite.rect = sprite.rect.rightShiftedBy(delta.x)
    }

    if (
      this.activeSpriteIntent === "resizeTop" ||
      this.activeSpriteIntent === "resizeTopLeft" ||
      this.activeSpriteIntent === "resizeTopRight"
    ) {
      sprite.rect = sprite.rect.topShiftedBy(delta.y)
    }

    if (
      this.activeSpriteIntent === "resizeBottom" ||
      this.activeSpriteIntent === "resizeBottomLeft" ||
      this.activeSpriteIntent === "resizeBottomRight"
    ) {
      sprite.rect = sprite.rect.bottomShiftedBy(delta.y)
    }
  }

  handlePointerUp() {
    this.activeSpriteIntent = undefined
  }
}
