import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

export default function AuthModal({ modal, onClose }) {
  return (
    <>
      <SignInModal
        open={modal === "signin"}
        onClose={() => onClose(null)}
        onSwitchSignUp={() => onClose("signup")}
      />

      <SignUpModal
        open={modal === "signup"}
        onClose={() => onClose(null)}
        onSwitchSignIn={() => onClose("signin")}
      />
    </>
  );
}