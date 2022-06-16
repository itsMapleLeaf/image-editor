import { observer } from "mobx-react-lite"
import type { EditorStore } from "./editor-store"

export const EditorSprites = observer(function EditorSprites({
  store,
}: {
  store: EditorStore
}) {
  return (
    <>
      {store.sprites.map((sprite) => (
        <img
          key={sprite.id}
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
      ))}
    </>
  )
})
