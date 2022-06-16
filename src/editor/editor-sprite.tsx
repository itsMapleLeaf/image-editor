import type { ImageSprite } from "./image-sprite"

export function EditorSprite({ sprite }: { sprite: ImageSprite }) {
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
