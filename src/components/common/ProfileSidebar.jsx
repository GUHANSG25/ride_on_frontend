import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/ProfilePage.css';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const formatRole = (role = "") => {
  const stripped = role.replace("ROLE_", "");
  return stripped.charAt(0).toUpperCase() + stripped.slice(1).toLowerCase();
};

export default function ProfileSidebar() {
  const { profile } = useSelector((s) => s.profile);
  const location = useLocation();

  const name = profile?.userName || "Loading…";
  const role = profile?.userRole ? formatRole(profile.userRole) : "Customer";
  const avatarSrc = "src/assets/images/profileimg.png";

  const navLinks = [
    { label: "My Profile",   href: "/profile" },
    { label: "My Bookings",  href: "/booking" },
  ];

  return (
    <aside className="profile-sidebar d-flex flex-column border-end">

      {/* User Info */}
      <div className="profile-sidebar-user d-flex flex-column align-items-center py-4 px-3 border-bottom">
        <div className="profile-sidebar-avatar-ring mb-2">
          <img
            className="profile-avatar rounded-circle"
            src={avatarSrc}
            alt={`${name} avatar`}
          />
        </div>
        <div className="profile-sidebar-username fw-semibold">{name}</div>
        <span className="profile-sidebar-role badge mt-1">{role}</span>
      </div>

      {/* Nav */}
      <nav className="flex-grow-1 py-3 px-2">
        <ul className="list-unstyled d-flex flex-column gap-1 mb-0">

          <li className="profile-sidebar-section-label text-uppercase text-secondary px-3 py-1">
            Account
          </li>

          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                to={href}
                className={`profile-sidebar-nav-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none ${location.pathname === href ? "active" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}

          <li className="profile-sidebar-divider my-2 border-bottom" />

          <li className="profile-sidebar-section-label text-uppercase text-secondary px-3 py-1">
            Other
          </li>

          <li>
            <Link
              to="/home"
              className="profile-sidebar-nav-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none"
            >
              Back to Home
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
}