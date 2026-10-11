export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-theme border-t-accent-pink rounded-full animate-spin" />
        <p className="text-theme-muted font-semibold animate-pulse">loading...</p>
      </div>
    </div>
  );
}
