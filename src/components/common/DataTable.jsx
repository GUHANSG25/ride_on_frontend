import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import '../../../src/styles/DataTable.css'
import Search from './Search';
import Badge from './Badge';

export default function DataTable({
  label = "Records",
  columns,
  data,
  rowKey,
  loading,
  error,
  page,          // 0-based current page index (from state.route.page)
  size,
  totalPages,    // total number of pages (from state.route.totalPages)
  totalElements,
  onPageChange,  // (newPage: number) => void — caller dispatches fetchRoute
  onDismissError,
  searchFields,
  emptyMessage = "No records found.",
}) {
  const [query, setQuery] = useState("");

  // Guard: data may be null/undefined while Redux fetch is in-flight
  const rows = Array.isArray(data) ? data : [];

  const filtered = rows.filter((row) => {
    if (!query || !searchFields?.length) return true;
    const q = query.toLowerCase();
    return searchFields.some((field) =>
      row[field]?.toString().toLowerCase().includes(q)
    );
  });

  // Coerce to numbers so comparisons never silently fail on string "0" or undefined
  const currentPage = Number(page)       || 0;
  const totalPagesN = Number(totalPages) || 1;

  const isFirst = currentPage === 0;
  const isLast  = currentPage >= totalPagesN - 1;

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center py-5 text-muted">
      Loading…
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden w-full">

      {error && (
        <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-danger bg-opacity-10 border-bottom border-danger-subtle text-danger small">
          {error}
          {onDismissError && (
            <button onClick={onDismissError} className="btn btn-link btn-sm text-danger p-0 ms-3">
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <h3 className="mb-0" style={{ fontSize: 16, fontWeight: 600 }}>{label}</h3>
          <Badge filtered={filtered} />
        </div>
        <Search searchFields={searchFields} query={query} onQueryChange={setQuery} />
      </div>

      {/* Table */}
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}
                className="text-muted fw-medium"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-5 text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            filtered.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((col) => (
                  <td key={col.key} className="align-middle">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination — always visible so user knows where they are */}
      <div className="pagination">
        <button
          disabled={isFirst}
          onClick={() => !isFirst && onPageChange(currentPage - 1)}
        >
          Prev
        </button>

        <span>Page {currentPage + 1} of {totalPagesN}</span>

        <button
          disabled={isLast}
          onClick={() => !isLast && onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}