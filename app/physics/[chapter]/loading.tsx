export default function Loading() {
  return (
    <div className="loading" aria-busy="true" aria-live="polite">
      <div className="loading-bar">
        <span />
      </div>
      <div className="loading-card" />
      <div className="loading-card" />
      <span className="loading-label">Loading chapter…</span>
    </div>
  );
}
