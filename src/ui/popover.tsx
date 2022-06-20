import { Dialog, Transition } from "@headlessui/react"
import type { Placement } from "@popperjs/core"
import type { ForwardedRef, ReactNode } from "react"
import { forwardRef, Fragment, useImperativeHandle, useState } from "react"
import type { PopperReferenceProps } from "./popper"
import { Popper } from "./popper"

export type PopoverHandle = {
  open: () => void
  close: () => void
}

export const Popover = forwardRef(function Popover(
  props: {
    button: (
      props: PopperReferenceProps & {
        onClick: () => void
      },
    ) => ReactNode
    panel: ReactNode
    placement: Placement
  },
  ref: ForwardedRef<PopoverHandle>,
) {
  const [isOpen, setIsOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }))

  return (
    <Popper placement={props.placement}>
      {({ reference, popper }) => (
        <>
          {props.button({
            ...reference,
            onClick: () => setIsOpen(true),
          })}
          <Transition as={Fragment} show={isOpen}>
            <Dialog onClose={setIsOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-out"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black/25" />
              </Transition.Child>

              <div {...popper}>
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Dialog.Panel>{props.panel}</Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </>
      )}
    </Popper>
  )
})
