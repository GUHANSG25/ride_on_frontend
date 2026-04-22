export default function ProfileField({
  label,
  value = "",
  editing = false,
  readonly = false,
  inputType = "text",
  inputId,
  placeholder = "",
  options,
  onChange,
}) {
  const showInput = editing && !readonly;
 
  return (
    <div className="profile-field-row d-flex align-items-center py-3 border-bottom border-light">
      {/* Label */}
      <div
        className="profile-field-label text-uppercase fw-semibold text-secondary me-3"
        style={{ fontSize: 11.5, letterSpacing: "0.07em", minWidth: 140, flexShrink: 0 }}
      >
        {label}
      </div>
 
      {/* Value (read mode) */}
      {!showInput && (
        <span
          className="profile-field-value text-dark"
          style={{ fontSize: 15 }}
        >
          {value || "—"}
        </span>
      )}
 
      {/* Input (edit mode) — select */}
      {showInput && options && (
        <select
          id={inputId}
          className="form-select form-select-sm profile-field-input"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          style={{ maxWidth: 320 }}
        >
          <option value="">— Select {label} —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
 
      {/* Input (edit mode) — text / email / date */}
      {showInput && !options && (
        <input
          id={inputId}
          type={inputType}
          className="form-control form-control-sm profile-field-input"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => onChange?.(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      )}
    </div>
  );
}