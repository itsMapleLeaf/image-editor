import { mdiVectorRectangle } from "@mdi/js"
import { Icon } from "@mdi/react"
import { observer } from "mobx-react-lite"
import { Button } from "./button"
import type { EditorStore } from "./editor-store"
import { frameShapeOptions } from "./editor-store"
import { Popover } from "./popover"

export const FrameOptionsButton = observer(function FrameOptionsButton({
  store,
}: {
  store: EditorStore
}) {
  return (
    <Popover
      button={<Icon title="Frame" path={mdiVectorRectangle} className="w-8" />}
      panel={
        <section className="p-2">
          <h2 className="mb-1 select-none text-xs font-bold uppercase tracking-[0.1px] opacity-50">
            Frame Shape
          </h2>
          <div className="flex gap-2">
            {frameShapeOptions.map((option) => (
              <Button
                key={option.name}
                title={option.name}
                active={store.frameShapeName === option.name}
                onClick={() => store.setFrameShape(option.name)}
              >
                {option.icon}
              </Button>
            ))}
          </div>
        </section>
      }
    />
  )
})
