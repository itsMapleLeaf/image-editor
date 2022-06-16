import type { ReactElement, Ref } from "react"
import { cloneElement, forwardRef } from "react"

/**
 * Use this for the `as` prop of a component to allow accepting children
 * as the element itself
 *
 * @example
 * <Button as={Slot}>
 *   <Link />
 * </Button>
 */
export const Slot = forwardRef(function Slot(
  {
    children,
    ...props
  }: { children: ReactElement } & { [key: string]: unknown },
  ref: Ref<unknown>,
) {
  return cloneElement(children, { ...props, ref })
})
