import type { ForwardedRef, ReactNode, Ref } from "react"
import { forwardRef } from "react"
import { Button } from "../ui/button"
import type { PopoverHandle } from "../ui/popover"
import { Popover } from "../ui/popover"
import { Tooltip } from "../ui/tooltip"
import { ToolPanel } from "./tool-panel"

// eslint-disable-next-line mobx/missing-observer
export const ToolButton = forwardRef(function ToolButton(
  props: {
    name: string
    icon: ReactNode
    onClick: () => void
  },
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Button
      label={<span className="sr-only">{props.name}</span>}
      icon={props.icon}
      onClick={props.onClick}
      ref={ref}
    />
  )
})

// eslint-disable-next-line mobx/missing-observer
export function ToolPopover(props: {
  name: string
  icon: ReactNode
  children?: ReactNode
  popoverRef?: Ref<PopoverHandle>
}) {
  return (
    <Popover
      placement="right"
      button={(button) => (
        <Tooltip text={props.name} placement="right">
          <ToolButton {...button} name={props.name} icon={props.icon} />
        </Tooltip>
      )}
      panel={<ToolPanel title={props.name}>{props.children}</ToolPanel>}
      ref={props.popoverRef}
    />
  )
}
