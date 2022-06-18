export function FileDropzone({
  children,
  onDrop,
}: {
  children: React.ReactNode
  onDrop: (file: File) => void
}) {
  return (
    <div
      className="h-full"
      onDragEnter={(event) => event.preventDefault()}
      onDragLeave={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onDragEnd={(event) => event.preventDefault()}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
      }}
      onDrop={(event) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file) onDrop(file)
      }}
    >
      {children}
    </div>
  )
}
