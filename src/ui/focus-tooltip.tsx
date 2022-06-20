import { Portal, Transition } from "@headlessui/react"
import type { ReactNode } from "react"
import { Fragment, useState } from "react"

export function FocusTooltip(props: {
  text: string
  children: (props: {
    onFocus: (event: React.FocusEvent) => void
    onBlur: (event: React.FocusEvent) => void
  }) => ReactNode
}) {
  const [visible, setVisible] = useState(false)

  return (
    // <Popper placement="bottom">
    //   {({ reference, popper }) => (
    <>
      {props.children({
        onFocus: () => setVisible(true),
        onBlur: () => setVisible(false),
      })}
      <Transition.Root show={visible} className="contents">
        <Portal>
          <Transition.Child
            as={Fragment}
            enter="transition"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-x-0 bottom-0 flex justify-center p-2">
              <div className="pointer-events-none rounded-lg bg-black/25 p-2 text-xs leading-tight backdrop-blur-md">
                {props.text}
              </div>
            </div>
          </Transition.Child>
        </Portal>
      </Transition.Root>
    </>
    //   )}
    // </Popper>
  )
}
