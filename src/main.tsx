import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Editor } from "./editor/editor"
import "./tailwind.css"

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <Editor />
  </StrictMode>,
)
