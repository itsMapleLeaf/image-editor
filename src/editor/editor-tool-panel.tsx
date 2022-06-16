import type { ReactNode } from "react"
import { RaisedPanel } from "../ui/raised-panel"

export function EditorToolPanel({ children }: { children: React.ReactNode }) {
  return (
    <RaisedPanel>
      <div className="flex flex-col gap-2 p-2">{children}</div>
    </RaisedPanel>
  )
}

export function EditorToolPanelSection({
  title,
  children,
}: {
  title: ReactNode
  children: ReactNode
}) {
  return (
    <section>
      <h2 className="mb-1 select-none text-xs font-bold uppercase tracking-[0.1px] opacity-50">
        {title}
      </h2>
      {children}
    </section>
  )
}
