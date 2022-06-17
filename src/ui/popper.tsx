import { Placement } from "@popperjs/core"
import { ReactNode, useState } from "react"
import { usePopper } from "react-popper"

export type PopperReferenceProps = {
  ref: (element: Element | null) => void
}

export type PopperElementProps = {
  ref: (element: HTMLElement | null) => void
  style: React.CSSProperties | undefined
}

export function Popper(props: {
  children: (props: {
    reference: PopperReferenceProps
    popper: PopperElementProps
  }) => ReactNode
  placement: Placement
  gap?: number
}) {
  const [referenceElement, setReferenceElement] = useState<Element | null>()
  const [popperElement, setPopperElement] = useState<HTMLElement | null>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: props.placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, props.gap ?? 16],
        },
      },
    ],
  })

  return (
    <>
      {props.children({
        reference: {
          ref: setReferenceElement,
        },
        popper: {
          ref: setPopperElement,
          style: styles.popper,
          ...attributes.popper,
        },
      })}
    </>
  )
}
