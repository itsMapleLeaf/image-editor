import type { ReactNode, Ref } from "react"
import { Button } from "../ui/button"
import type { PopoverHandle } from "../ui/popover"
import { Popover } from "../ui/popover"
import { ToolPanel } from "./tool-panel"

// eslint-disable-next-line mobx/missing-observer
export function ToolButton(props: {
  name: string
  icon: ReactNode
  children: ReactNode
  popoverRef?: Ref<PopoverHandle>
}) {
  return (
    <Popover
      placement="right"
      button={(button) => (
        <Button
          {...button}
          label={<span className="sr-only">{props.name}</span>}
          icon={props.icon}
        />
      )}
      panel={<ToolPanel title={props.name}>{props.children}</ToolPanel>}
      ref={props.popoverRef}
    />
  )
}
