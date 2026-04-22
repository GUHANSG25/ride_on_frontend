import '../../styles/ProfilePage.css'

export default function SidebarNavItems({ href, tab, active, label, onClick }) {
  const isActive = tab === active;
 
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(tab);
    }
  };
 
  return (
    <li>
      <a
        href={href}
        onClick={handleClick}
        className={`profile-sidebar-nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none ${
          isActive ? "profile-sidebar-nav-link--active" : "profile-sidebar-nav-link--idle"
        }`}
      >
        {/* <span className="sidebar-nav-icon d-flex align-items-center">{icon}</span> */}
        <span className="profile-sidebar-nav-label flex-grow-1">{label}</span>
        {isActive && <span className="profile-sidebar-nav-dot rounded-circle" />}
      </a>
    </li>
  );
}