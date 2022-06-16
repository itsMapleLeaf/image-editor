import type { ComponentPropsWithoutRef } from "react"
import { forwardRef } from "react"

export const ToolButton = forwardRef(function ToolButton(
  props: ComponentPropsWithoutRef<"button">,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      ref={ref}
      className="rounded-md bg-slate-700 p-1 text-slate-50/40 ring-2 ring-transparent transition-colors hover:text-slate-50 focus:outline-none focus-visible:ring-blue-400"
    />
  )
})
