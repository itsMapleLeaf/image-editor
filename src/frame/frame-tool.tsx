import { mdiClose } from "@mdi/js"
import { Icon } from "@mdi/react"
import { ToolPanelSection } from "../editor/tool-panel"
import { NumberInput } from "../ui/number-input"
import { FrameState } from "./frame-state"

export function FrameOptions({
  frame,
  onChange,
}: {
  frame: FrameState
  onChange: (frame: FrameState) => void
}) {
  return (
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
  )
}
