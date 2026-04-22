import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import AuthModal from "../../features/auth/components/AuthModal";
import "../../styles/global.css";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../features/profile/slice/ProfileSlice";
import { useSelector } from "react-redux";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);

  const navigate = useNavigate();
  
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if(loggedIn){
      dispatch(fetchUserProfile());
    }
  },[]);

  const profileName = profile?.userName || "User";

  function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/home");
  }

  function handleModalChange(next) {
    setModal(next ?? null);
  }

  function handleLoginSuccess(name) {
    setIsLoggedIn(true);
    dispatch(fetchUserProfile());
  }

  return (
    <>
      <header>
        <div className="logo">
          <Link to="/">
            <h3 style={{ fontSize: 30, fontWeight: "bold", fontStyle: "italic", margin: 0 }}>
              Ride<span style={{ color: "var(--orange)" }}>On</span>
            </h3>
          </Link>
        </div>

        <div className="right-side">
          {isLoggedIn ? (
            <>
              <Link to="/home" className="accounts">Home</Link>

              <div className="dropdown">
                <button className="profiledropbtn">
                  
                  Hi, {profileName} ▾
                </button>
                <div className="dropdown-content">
                  <Link to="/profile">
                    My Profile
                  </Link>
                  <Link to="/booking">
                    My Booking
                  </Link>
                  <Link to="/notification">
                    Notification
                  </Link>
                  <hr style={{ margin: "4px 0" }} />
                  <a onClick={logout} style={{ cursor: "pointer" }}>
                    Logout
                  </a>
                </div>
              </div>

              <Link to="/about" className="accounts">About Us</Link>
              <Link to="/contact" className="accounts">Contact Us</Link>
            </>
          ) : (
            <>
              <button className="guest-btn">
                Hi, Guest
              </button>

              <Link to="/home" className="accounts">Home</Link>

              <div className="join">
                <a className="accounts" onClick={(e) => { e.preventDefault(); setModal("signin"); }}>
                  Login
                </a>
                /
                <a className="accounts" onClick={(e) => { e.preventDefault(); setModal("signup"); }}>
                  Sign up
                </a>
              </div>

              <Link to="/about" className="accounts">About Us</Link>
              <Link to="/contact" className="accounts">Contact Us</Link>
            </>
          )}
        </div>
      </header>

      <AuthModal
        modal={modal}
        onClose={handleModalChange}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}