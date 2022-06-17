import { mdiClose, mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import { ToolPanel, ToolPanelSection } from "../editor/tool-panel"
import { Button } from "../ui/button"
import { NumberInput } from "../ui/number-input"
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
      button={(props) => (
        <Button {...props}>
          <Icon title="Frame" path={mdiVectorRectangle} className="w-8" />
        </Button>
      )}
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
          <ToolPanelSection title="Size">
            <div className="flex items-center gap-1">
              <NumberInput
                title="Width"
                defaultValue={frame.width}
                onChange={(width) => onChange({ ...frame, width })}
              />
              <Icon path={mdiClose} className="w-4" />
              <NumberInput
                title="Height"
                defaultValue={frame.height}
                onChange={(height) => onChange({ ...frame, height })}
              />
            </div>
          </ToolPanelSection>
        </ToolPanel>
      }
    />
  )
}
