export default function AracLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-th-fg-muted border-t-brand-500" />
        <p className="text-sm text-th-fg-sub">Arac bilgileri yukleniyor...</p>
      </div>
    </div>
  )
}
