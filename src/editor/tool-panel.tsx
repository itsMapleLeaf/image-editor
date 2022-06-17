import type { ReactNode } from "react"
import { RaisedPanel } from "../ui/raised-panel"

export function ToolPanel({
  title,
  children,
}: {
  title: ReactNode
  children: React.ReactNode
}) {
  return (
    <RaisedPanel>
      <section>
        <h2 className="select-none border-b-2 border-slate-900 bg-slate-900/50 pb-2 pt-2.5 text-center text-sm font-bold leading-none text-slate-100/75">
          {title}
        </h2>
        <div className="flex flex-col gap-2 p-2">{children}</div>
      </section>
    </RaisedPanel>
  )
}

export function ToolPanelSection({
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
