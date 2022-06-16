import { Popover as HeadlessPopover, Transition } from "@headlessui/react"
import type { ReactNode } from "react"
import { useState } from "react"
import { usePopper } from "react-popper"
import { Slot } from "../react/slot"
import { Portal } from "./portal"

export function Popover(props: { button: ReactNode; panel: ReactNode }) {
  const [referenceElement, setReferenceElement] = useState<Element | null>()
  const [popperElement, setPopperElement] = useState<HTMLElement | null>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "right",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 16],
        },
      },
    ],
  })

  return (
    <HeadlessPopover>
      {({ open }) => (
        <>
          <HeadlessPopover.Button as={Slot} ref={setReferenceElement}>
            {props.button}
          </HeadlessPopover.Button>
          <Transition.Root show={open}>
            <Portal>
              <div
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
              >
                <Transition.Child
                  enter="transition duration ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <HeadlessPopover.Panel static>
                    {props.panel}
                  </HeadlessPopover.Panel>
                </Transition.Child>
              </div>
            </Portal>
          </Transition.Root>
        </>
      )}
    </HeadlessPopover>
  )
}
