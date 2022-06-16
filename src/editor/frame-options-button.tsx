import { mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import type { ReactNode } from "react"
import { Button } from "../ui/button"
import { Popover } from "../ui/popover"
import { EditorToolPanel, EditorToolPanelSection } from "./editor-tool-panel"

export function FrameOptionsButton({
  shapeOptions,
}: {
  shapeOptions: ReactNode
}) {
  return (
    <Popover
      button={
        <Button>
          <Icon title="Frame" path={mdiVectorRectangle} className="w-8" />
        </Button>
      }
      panel={
        <EditorToolPanel>
          <EditorToolPanelSection title="Shape">
            {shapeOptions}
          </EditorToolPanelSection>
          <EditorToolPanelSection title="Size">TODO</EditorToolPanelSection>
          <EditorToolPanelSection title="Aspect ratio">
            TODO
          </EditorToolPanelSection>
        </EditorToolPanel>
      }
    />
  )
}
