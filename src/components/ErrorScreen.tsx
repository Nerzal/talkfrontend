interface Props {
  message: string
}

export function ErrorScreen({ message }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="max-w-md text-center px-8">
        <p className="text-red-400 text-xl font-bold mb-2">Vorträge konnten nicht geladen werden</p>
        <p className="text-slate-500 text-sm">{message}</p>
      </div>
    </div>
  )
}
