import { createPortal } from "react-dom";

export default function Toast({ toast }) {
  if (!toast) return null;
  return createPortal(
    <div className="auth-toast show">{toast.msg}</div>,
    document.body
  );
}