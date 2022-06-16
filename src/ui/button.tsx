import clsx from "clsx"
import type { ComponentPropsWithoutRef } from "react"
import { forwardRef } from "react"

// eslint-disable-next-line mobx/missing-observer
export const Button = forwardRef(function Button(
  {
    active,
    ...props
  }: ComponentPropsWithoutRef<"button"> & {
    active?: boolean
  },
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <button
      type="button"
      {...props}
      ref={ref}
      className={clsx(
        "rounded-md p-1 ring-2 ring-transparent transition-colors  focus:outline-none focus-visible:ring-blue-400",
        active
          ? "bg-slate-600"
          : "bg-slate-700 text-slate-50/40 hover:text-slate-50",
      )}
    />
  )
})
