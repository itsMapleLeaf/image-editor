import { Portal, Transition } from "@headlessui/react"
import type { Placement } from "@popperjs/core"
import clsx from "clsx"
import type { ReactNode } from "react"
import { Fragment, useState } from "react"
import { Popper } from "./popper"

export function Tooltip(props: {
  text: string
  placement: Placement
  children: ReactNode
}) {
  const [visible, setVisible] = useState(false)
  return (
    <Popper placement={props.placement}>
      {({ popper, reference }) => (
        <>
          <div
            {...reference}
            onPointerEnter={() => setVisible(true)}
            onPointerLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
          >
            {props.children}
          </div>
          <Transition.Root show={visible} className="contents">
            <Portal>
              <div {...popper} className="pointer-events-none">
                <Transition.Child
                  as={Fragment}
                  enter={clsx`transition transform delay-200`}
                  enterFrom={clsx`opacity-0 scale-90`}
                  enterTo={clsx`opacity-100 scale-100`}
                  leave={clsx`transition transform`}
                  leaveFrom={clsx`opacity-100 scale-100`}
                  leaveTo={clsx`opacity-0 scale-90`}
                >
                  <div className="text rounded bg-slate-50 p-1.5 text-xs font-medium leading-none text-slate-800 shadow">
                    {props.text}
                  </div>
                </Transition.Child>
              </div>
            </Portal>
          </Transition.Root>
        </>
      )}
    </Popper>
  )
}
