export function RaisedPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-slate-800 shadow-md shadow-[rgba(0,0,0,0.3)]">
      {children}
    </div>
  )
}
