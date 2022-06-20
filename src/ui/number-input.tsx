import type { ComponentPropsWithoutRef } from "react"
import { toMaybeFiniteNumber } from "../common/to-maybe-finite-number"

type NumberInputProps = {
  defaultValue: number
  onChange: (value: number) => void
  // TODO: min & max
} & Omit<ComponentPropsWithoutRef<"input">, "defaultValue" | "onChange">

export function NumberInput({
  defaultValue,
  onChange,
  ...props
}: NumberInputProps) {
  const updateValue = (value: number, element: HTMLInputElement) => {
    onChange(value)
    element.value = value.toString()
  }

  return (
    <input
      {...props}
      className="w-16 rounded-md bg-black/25 p-1.5 text-center leading-none transition focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      defaultValue={defaultValue}
      onFocus={(event) => {
        props.onFocus?.(event)
        if (event.isDefaultPrevented()) return
        event.currentTarget.select()
      }}
      onChange={(event) => {
        onChange(toMaybeFiniteNumber(event.currentTarget.value) ?? 0)
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (event.isDefaultPrevented()) return

        const value = toMaybeFiniteNumber(event.currentTarget.value) ?? 0
        const step = event.shiftKey ? 100 : event.altKey ? 1 : 10

        if (event.key === "ArrowUp") {
          updateValue(value + step, event.currentTarget)
          event.preventDefault()
        }
        if (event.key === "ArrowDown") {
          updateValue(value - step, event.currentTarget)
          event.preventDefault()
        }
      }}
    />
  )
}
