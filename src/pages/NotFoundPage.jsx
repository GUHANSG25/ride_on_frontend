import { useNavigate } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-inner">
        <div className="not-found-code">404</div>
        <h2 className="not-found-title">Page not found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="not-found-actions">
          <button className="not-found-btn primary" onClick={() => navigate("/home")}>
            Go home
          </button>
          <button className="not-found-btn" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}