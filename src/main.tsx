import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app"
import { EditorStore } from "./editor/editor-store"
import "./tailwind.css"

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <App store={new EditorStore()} />
  </StrictMode>,
)
