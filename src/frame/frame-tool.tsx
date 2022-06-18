import { mdiClose } from "@mdi/js"
import { Icon } from "@mdi/react"
import { observer } from "mobx-react-lite"
import { ToolPanelSection } from "../editor/tool-panel"
import { NumberInput } from "../ui/number-input"
import type { FrameState } from "./frame-state"

export const FrameOptions = observer(function FrameOptions({
  frame,
}: {
  frame: FrameState
}) {
  return (
    <ToolPanelSection title="Size">
      <div className="flex items-center gap-1">
        <NumberInput
          title="Width"
          defaultValue={frame.width}
          onChange={frame.setWidth}
        />
        <Icon path={mdiClose} className="w-4" />
        <NumberInput
          title="Height"
          defaultValue={frame.height}
          onChange={frame.setHeight}
        />
      </div>
    </ToolPanelSection>
  )
})
