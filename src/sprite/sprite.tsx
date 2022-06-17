import type { SpriteState } from "./sprite-state"

export function Sprite({ sprite }: { sprite: SpriteState }) {
  return (
    <img
      alt=""
      src={sprite.image.src}
      className="absolute"
      style={{
        left: sprite.left,
        top: sprite.top,
        minWidth: sprite.image.width,
        minHeight: sprite.image.height,
      }}
    />
  )
}
