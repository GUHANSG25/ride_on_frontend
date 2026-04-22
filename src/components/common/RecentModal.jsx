import '../../styles/RecentModal.css'
export default function RecentModal({ title, items, loading, renderItem, emptyMessage = "No data found." }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">{title}</div>
      </div>

      <div className="panel-body">
        {loading && <p className="text-muted small">Loading...</p>}

        {!loading && items.length === 0 && (
          <p className="text-muted small">{emptyMessage}</p>
        )}

        {!loading && items.map(renderItem)}
      </div>
    </div>
  );
}