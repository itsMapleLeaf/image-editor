import { observer } from "mobx-react-lite"
import { SpriteImage } from "./editor-canvas"
import type { EditorState } from "./editor-state"

export const EditorSprites = observer(function EditorSprites({
  editor,
}: {
  editor: EditorState
}) {
  return (
    <>
      {editor.sprites.map((sprite) => (
        <SpriteImage sprite={sprite} key={sprite.id} />
      ))}
    </>
  )
})
