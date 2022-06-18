import { observer } from "mobx-react-lite"
import type { SpriteState } from "../sprite/sprite-state"
import type { EditorState } from "./editor-state"

export const EditorCanvas = observer(function EditorCanvas({
  editor,
}: {
  editor: EditorState
}) {
  return (
    <>
      <div
        className="absolute bg-black/25"
        style={{ width: editor.frame.width, height: editor.frame.height }}
      />

      <div className="absolute brightness-50">
        <SpriteList sprites={editor.sprites} />
      </div>

      <div
        className="absolute overflow-clip"
        style={{ width: editor.frame.width, height: editor.frame.height }}
      >
        <SpriteList sprites={editor.sprites} />
      </div>

      {editor.selectedSprite && (
        <div
          className="pointer-events-none absolute"
          style={{
            left: editor.selectedSprite.rect.left,
            top: editor.selectedSprite.rect.top,
            width: editor.selectedSprite.rect.width,
            height: editor.selectedSprite.rect.height,
          }}
        >
          <div className="relative h-full bg-blue-400/25 ring-2 ring-blue-400">
            <div className="absolute left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400" />
            <div className="absolute right-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400" />
            <div className="absolute left-0 bottom-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400" />
            <div className="absolute right-0 bottom-0 h-3 w-3 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400" />
          </div>
        </div>
      )}
    </>
  )
})
const SpriteList = observer(function SpriteList({
  sprites,
}: {
  sprites: SpriteState[]
}) {
  return (
    <>
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          className="absolute"
          style={{
            backgroundImage: `url(${sprite.image.src})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            left: sprite.rect.left,
            top: sprite.rect.top,
            width: sprite.rect.width,
            height: sprite.rect.height,
          }}
        />
      ))}
    </>
  )
})
