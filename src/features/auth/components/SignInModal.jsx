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

export default function SignInModal({ open, onClose, onSwitchSignUp }) {
  const { sendOtp, verifyOtp, otpReady, resetOtp } = useContext(AuthContext);

  const [mobile, setMobile] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const timer = useCountdown(30);
  const otpClearRef = useRef(null);

  useEffect(() => { if (otpReady) timer.start(); }, [otpReady]);
  useEffect(() => { if (!open) reset(); }, [open]);

  function reset() {
    setMobile(""); setTermsAccepted(false);
    setOtp(""); setErrors({}); setToast(null);
    resetOtp();
  }

  function showToast(msg) {
    setToast({ msg });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSendOtp() {
    const errs = {};
    if (!/^\d{10}$/.test(mobile)) errs.mobile = "Enter a valid 10-digit mobile number.";
    if (!termsAccepted) errs.terms = "Please accept the Terms & Conditions.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setLoading(true);
    try {
      await sendOtp(mobile, "LOGIN");
      showToast(`OTP sent to +91 ${mobile}`);
    } catch (error) {
      const status = error?.response?.status;
      const errs = {};
      if (status === 404) {
        errs.mobile = "This mobile number is not registered. Please sign up first.";
      }else if(status === 406){
        showToast("Your status is still pending. Please try again.");
      }else {
        showToast("Failed to send OTP. Please try again.");
      }
      setErrors(errs);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length < 6) { 
      setErrors({ otp: "Enter the 6-digit OTP." }); 
    return; 
    }
    setLoading(true);
    try {
      await verifyOtp(otp);
      onClose();
    } catch (error) {
      const status = error?.response?.status;
      console.log(status);
      if(status === 400){
        showToast("Invalid OTP. Please try again.");
      }
      setErrors({ otp: "Invalid OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  async function handleResend(e) {
    e.preventDefault();
    if (timer.running) return;
    try {
      await sendOtp(mobile, "LOGIN");
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
          <img src="src/assets/images/loginimg.jpg" alt="signin banner" />
          <div className="auth-image-overlay">
            <h3>Good to see you back.</h3>
            <p>Sign in to continue your journey.</p>
          </div>
        </div>

        <div className="col-md-8 auth-form-col position-relative">
          <button type="button" className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose} />

          <div className="step-dots">
            <div className={`step-dot ${!otpReady ? "active" : ""}`} />
            <div className={`step-dot ${otpReady ? "active" : ""}`} />
          </div>

          {!otpReady && (
            <div className="auth-panel">
              <h2 className="auth-title">Welcome <span>Back</span></h2>
              <div className="mb-3">
                <label className="form-label">
                  Mobile Number <span style={{ color: "red" }}>*</span>
                </label>
                <div className="d-flex">
                  <span className="phone-prefix">+91</span>
                  <input type="tel" className="form-control" maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} />
                </div>
                {errors.mobile && <div className="field-error">{errors.mobile}</div>}
              </div>
              <div className="form-check terms-check mb-4">
                <input className="form-check-input" type="checkbox" id="si-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)} />
                <label className="form-check-label" htmlFor="si-terms">
                  By logging in I accept the{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms & Conditions</a>{" "}
                  and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                </label>
                {errors.terms && <div className="field-error">{errors.terms}</div>}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="switch-link mb-0">
                  New here?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); onSwitchSignUp(); }}>Sign up</a>
                </p>
                <button className="btn-primary-auth" onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Sending…" : "Send OTP →"}
                </button>
              </div>
            </div>
          )}

          {otpReady && (
            <div className="auth-panel">
              <button className="back-btn" onClick={() => { resetOtp(); setErrors({}); }}>← Back</button>
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
                <a className={timer.running ? "disabled" : ""} onClick={handleResend}>
                  Resend OTP
                </a>
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn-primary-auth" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? "Verifying…" : "Verify & Sign In"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast toast={toast} />
    </ModalShell>
  );
}