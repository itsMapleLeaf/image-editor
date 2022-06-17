import { Dialog, Transition } from "@headlessui/react"
import { Fragment, ReactNode, useState } from "react"
import { usePopper } from "react-popper"

export function Popover(props: {
  button: (props: {
    onClick: () => void
    ref: (element: Element | null) => void
  }) => ReactNode
  panel: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
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
    <>
      {props.button({
        onClick: () => setIsOpen(true),
        ref: setReferenceElement,
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

          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
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
  )
}
