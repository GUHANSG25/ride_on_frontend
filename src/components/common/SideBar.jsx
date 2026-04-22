import { useNavigate } from "react-router-dom";
import '../../styles/SideBar.css';

export default function Sidebar({ activeSection, onSectionChange, navItems = [] }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn")
    navigate("/home");
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo">
        <div>
          <h3 style={{ color: "#1a3bff", fontSize: 25, margin: 0, fontWeight: "bold", fontStyle: "italic" }}>
            Ride<span style={{ fontSize: 25, color: "#f5a623" }}>On</span>
          </h3>
          <div className="logo-sub">Admin Management System</div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="nav">
        {navItems.map((item, idx) =>
          item.type === "section" ? (
            <div key={idx} className="nav-section">{item.label}</div>
          ) : (
            <div
              key={item.key}
              className={`nav-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => onSectionChange(item.key)}
            >
              {item.label}
            </div>
          )
        )}
      </nav>

      {/* Bottom admin pill + logout */}
      <div className="sidebar-bottom">
        <div className="nav-item" style={{ marginTop: 8 }} onClick={handleLogout}>
          Logout
        </div>
      </div>
    </aside>
  );
}