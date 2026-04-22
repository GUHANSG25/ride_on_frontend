import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddNewModal({ show, onClose, title, onSubmit, submitLabel = "Submit", children }) {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }} onClick={onClose}
    >
      <div
        className="bg-white rounded-3 p-4 shadow"
        style={{ width: "100%", maxWidth: 920 }}
        onClick={(e) => e.stopPropagation()}
      >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold">{title}</h5>
        <button className="btn-close" onClick={onClose} />
      </div>

      <div>{children}</div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary btn-sm" onClick={onSubmit}>{submitLabel}</button>
      </div>
    </div>
  </div>
  );
}