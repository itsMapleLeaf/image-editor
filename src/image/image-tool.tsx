import { mdiUpload } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useRef } from "react"
import { Button } from "../ui/button"

// eslint-disable-next-line mobx/missing-observer
export function ImageUploadButton(props: { onUpload: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Button
        label="Upload"
        icon={<Icon path={mdiUpload} className="w-6" />}
        onClick={() => inputRef.current!.click()}
      />
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        ref={inputRef}
        onInput={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) props.onUpload(file)
          event.currentTarget.value = ""
        }}
      />
    </>
  )
}
