import { mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import { ToolPanel, ToolPanelSection } from "../editor/tool-panel"
import { Button } from "../ui/button"
import { Popover } from "../ui/popover"
import { frameShapeOptions, FrameState } from "./frame-state"

export function FrameTool({
  frame,
  onChange,
}: {
  frame: FrameState
  onChange: (frame: FrameState) => void
}) {
  return (
    <Popover
      button={
        <Button>
          <Icon title="Frame" path={mdiVectorRectangle} className="w-8" />
        </Button>
      }
      panel={
        <ToolPanel title="Frame">
          <ToolPanelSection title="Shape">
            <div className="flex gap-2">
              {frameShapeOptions.map((shape) => (
                <Button
                  key={shape.name}
                  title={shape.name}
                  active={frame.shape.name === shape.name}
                  onClick={() => onChange({ ...frame, shape })}
                >
                  {shape.icon}
                </Button>
              ))}
            </div>
          </ToolPanelSection>
          <ToolPanelSection title="Size">TODO</ToolPanelSection>
          <ToolPanelSection title="Aspect ratio">TODO</ToolPanelSection>
        </ToolPanel>
      }
    />
  )
}
