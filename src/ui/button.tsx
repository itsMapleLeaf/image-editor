import clsx from "clsx"
import { forwardRef } from "react"

export type ButtonProps = {
  label?: React.ReactNode
  active?: boolean
  icon?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const Button = forwardRef(function Button(
  { label, icon, active, onClick }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <button
      type="button"
      ref={ref}
      className={clsx(
        "flex items-center gap-2 rounded p-2 font-medium leading-none ring-2 ring-transparent transition focus:outline-none focus-visible:ring-blue-400",
        active
          ? "bg-slate-600"
          : "bg-slate-700 text-slate-50/40 hover:text-slate-50",
      )}
      onClick={onClick}
    >
      {icon && <span className="-m-1">{icon}</span>}
      {label}
    </button>
  )
})
