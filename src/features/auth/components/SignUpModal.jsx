import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ModalShell from "./ModalShell";
import OtpInput from "./OtpInput";
import Toast from "../../../components/common/Toast";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/auth.css';

function useCountdown(initial = 30) {
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);

  function start() {
    setCount(initial);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { clearInterval(timerRef.current); return 0; }
        return c - 1;
      });
    }, 1000);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);
  return { count, start, running: count > 0 };
}

export default function SignUpModal({ open, onClose, onSwitchSignIn }) {
  const { sendOtp, verifyOtp, otpReady, resetOtp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [panel, setPanel] = useState(1);
  const timer = useCountdown(30);
  const otpClearRef = useRef(null);

  useEffect(() => { if (otpReady && panel === 1) { setPanel(2); timer.start(); } }, [otpReady]);
  useEffect(() => { if (!open) reset(); }, [open]);

  function reset() {
    setName(""); setMobile(""); setRole("");
    setTermsAccepted(false); setOtp("");
    setErrors({}); setToast(null); setPanel(1);
    resetOtp();
  }

  function showToast(msg) {
    setToast({ msg });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSendOtp() {
    const errs = {};
    if (!name.trim()) errs.name = "Full name is required.";
    
    if (!/^\d{10}$/.test(mobile)) errs.mobile = "Enter a valid 10-digit mobile number.";
    if (!role) errs.role = "Please select a role.";
    if (!termsAccepted) errs.terms = "Please accept the Terms & Conditions.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setLoading(true);
    try {
      await sendOtp(mobile, "SIGNUP", { userName: name, userRole: role });
      showToast(`OTP sent to +91 ${mobile}`);
    } catch(error) {
      const status = error?.response?.status;
      const errs = {};
      if (status === 406) {
        errs.mobile = "This mobile number is already registered. Please login instead.";
      } else {
        showToast("Failed to send OTP. Please try again.");
      }
      setErrors(errs);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length < 6) { setErrors({ otp: "Enter the 6-digit OTP." }); return; }
    setLoading(true);
    try {
      await verifyOtp(otp);
      setPanel(3);
      resetOtp();
    } catch {
      setErrors({ otp: "Invalid OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  async function handleResend(e) {
    e.preventDefault();
    if (timer.running) return;
    try {
      await sendOtp(mobile, "SIGNUP", { userName: name, userRole: role });
      showToast(`OTP resent to +91 ${mobile}`);
      otpClearRef.current?.();
      setOtp(""); setErrors({});
    } catch {
      showToast("Failed to resend OTP.");
    }
  }

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="row g-0" style={{ minHeight: 460, backgroundColor: "#ffffff" }}>
        <div className="col-md-4 auth-image-col d-none d-md-block">
          <img src="src/assets/images/signupimage.png" alt="" />
          <div className="auth-image-overlay">
            <h3>Join RideOn today.</h3>
            <p>Book smarter. Travel better.</p>
          </div>
        </div>

        <div className="col-md-8 auth-form-col position-relative">
          <button type="button" className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose} />

          <div className="step-dots">
            <div className={`step-dot ${panel >= 1 ? "active" : ""}`} />
            <div className={`step-dot ${panel >= 2 ? "active" : ""}`} />
            <div className={`step-dot ${panel >= 3 ? "active" : ""}`} />
          </div>

          {/* Panel 1 — Form */}
          {panel === 1 && (
            <div className="auth-panel">
              <h2 className="auth-title">Create <span>Account</span></h2>
              <div className="mb-3">
                <label className="form-label">Full Name <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="form-control" placeholder="Your full name"
                  value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Mobile Number <span style={{ color: "red" }}>*</span></label>
                <div className="d-flex">
                  <span className="phone-prefix">+91</span>
                  <input type="tel" className="form-control" placeholder="Enter 10-digit mobile number"
                    maxLength={10} value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} />
                </div>
                {errors.mobile && <div className="field-error">{errors.mobile}</div>}
              </div>
              <div className="mb-4">
                <label className="form-label">Register as <span style={{ color: "red" }}>*</span></label>
                <div className="role-cards">
                  {[{ label: "Customer", value: "ROLE_CUSTOMER" }, { label: "Operator", value: "ROLE_OPERATOR" }].map((r) => (
                    <label className="role-card" key={r.value}>
                      <input type="radio" name="su-role" value={r.value}
                        checked={role === r.value} onChange={() => setRole(r.value)} />
                      {r.label}
                    </label>
                  ))}
                </div>
                {errors.role && <div className="field-error">{errors.role}</div>}
              </div>
              <div className="form-check terms-check mb-4">
                <input className="form-check-input" type="checkbox" id="su-terms"
                  checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                <label className="form-check-label" htmlFor="su-terms">
                  By signing up I accept the{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms &amp; Conditions</a>{" "}
                  and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                </label>
                {errors.terms && <div className="field-error">{errors.terms}</div>}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="switch-link mb-0">
                  Already have an account?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); onSwitchSignIn(); }}>Sign in</a>
                </p>
                <button className="btn-primary-auth" onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Sending…" : "Send OTP →"}
                </button>
              </div>
            </div>
          )}

          {/* Panel 2 — OTP */}
          {panel === 2 && (
            <div className="auth-panel">
              <button className="back-btn" onClick={() => { setPanel(1); resetOtp(); setErrors({}); }}>← Back</button>
              <h2 className="auth-title">Verify <span>OTP</span></h2>
              <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
                We sent a 6-digit code to <strong>+91 {mobile}</strong>
              </p>
              <OtpInput clearRef={otpClearRef} onChange={setOtp} />
              {errors.otp && (
                <div className="field-error text-center" style={{ marginBottom: ".75rem" }}>
                  {errors.otp}
                </div>
              )}
              <div className="resend-row">
                <span>
                  {timer.running
                    ? <>Resend OTP in <strong>{timer.count}s</strong></>
                    : "Didn't receive it? "}
                </span>
                <a href="#" className={timer.running ? "disabled" : ""} onClick={handleResend}>
                  Resend OTP
                </a>
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn-primary-auth" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? "Verifying…" : "Verify & Continue →"}
                </button>
              </div>
            </div>
          )}

          {/* Panel 3 — Success */}
          {panel === 3 && (
            <div className="auth-panel" style={{ textAlign: "center", paddingTop: "2rem" }}>
              <h2 className="auth-title">You are <span>In!</span></h2>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", marginBottom: ".5rem" }}>
                Welcome aboard, <strong>{name}</strong>!
              </p>
              <p style={{ color: "var(--muted)", fontSize: ".85rem", marginBottom: "2rem" }}>
                Your account has been created successfully.<br />
                You can now sign in with your mobile number.
              </p>
              <button className="btn-primary-auth" onClick={() => { onClose(); onSwitchSignIn(); }}>
                Sign In Now →
              </button>
            </div>
          )}
        </div>
      </div>
      <Toast toast={toast} />
    </ModalShell>
  );
}