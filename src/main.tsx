import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Editor } from "./editor/editor"
import { EditorState } from "./editor/editor-state"
import "./tailwind.css"

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <Editor editor={new EditorState()} />
  </StrictMode>,
)
