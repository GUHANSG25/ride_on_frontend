import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function ModalShell({ open, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("modal-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      <div onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1040 }} />
      <div
        style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex",
          alignItems: "center", justifyContent: "center", padding: "1rem" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="rideon-modal-content"
          style={{ width: "100%", maxWidth: 780, borderRadius: 20, overflow: "hidden",
            position: "relative", backgroundColor: "#ffffff",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}