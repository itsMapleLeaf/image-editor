import type { SpriteState } from "./sprite-state"

export function Sprite({ sprite }: { sprite: SpriteState }) {
  return (
    <div
      className="absolute cursor-pointer"
      style={{
        backgroundImage: `url(${sprite.image.src})`,
        backgroundSize: "100%",
        left: sprite.left,
        top: sprite.top,
        width: sprite.width,
        height: sprite.height,
      }}
    />
  )
}
