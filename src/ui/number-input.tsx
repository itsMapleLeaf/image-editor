import { ComponentPropsWithoutRef } from "react"

type NumberInputProps = {
  defaultValue: number
  onChange: (value: number) => void
} & Omit<ComponentPropsWithoutRef<"input">, "defaultValue" | "onChange">

export function NumberInput({
  defaultValue,
  onChange,
  ...props
}: NumberInputProps) {
  return (
    <input
      {...props}
      className="w-16 rounded-md bg-black/25 p-2 text-center transition focus:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      defaultValue={defaultValue}
      onFocus={(event) => {
        props.onFocus?.(event)
        if (event.isDefaultPrevented()) return
        event.target.select()
      }}
      onChange={(event) => {
        const value = Number(event.target.value)
        if (!Number.isNaN(value)) {
          onChange(value)
        }
      }}
    />
  )
}
