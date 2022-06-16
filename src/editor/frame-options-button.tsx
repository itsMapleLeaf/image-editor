import { mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import type { ReactNode } from "react"
import { Popover } from "../ui/popover"

export function FrameOptionsButton({
  shapeOptions,
}: {
  shapeOptions: ReactNode
}) {
  return (
    <Popover
      button={<Icon title="Frame" path={mdiVectorRectangle} className="w-8" />}
      panel={
        <section className="p-2">
          <h2 className="mb-1 select-none text-xs font-bold uppercase tracking-[0.1px] opacity-50">
            Frame Shape
          </h2>
          <div className="flex gap-2">{shapeOptions}</div>
        </section>
      }
    />
  )
}
