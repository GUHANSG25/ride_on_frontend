import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, clearError } from '../../profile/slice/ProfileSlice';
import ProfileField from './ProfileField';
import '../../../styles/ProfilePage.css'

const GENDER_OPTIONS = [
  { value: "Male",   label: "Male"   },
  { value: "Female", label: "Female" },
  { value: "Other",  label: "Other"  },
];

const formatRole = (role = "") => {
  const stripped = role.replace("ROLE_", "");
  return stripped.charAt(0).toUpperCase() + stripped.slice(1).toLowerCase();
};

// Only map fields the API actually returns
const profileToDraft = (p = {}) => ({
  name:  p.userName || "",
  email: p.email    || "",
  phone: p.mobile   || "",  // read-only
});

export default function ProfileCard() {
  const dispatch = useDispatch();
  const { profile, loading, updating, error } = useSelector((s) => s.profile);

  const [editing,  setEditing]  = useState(false);
  const [draft,    setDraft]    = useState({});
  const [snapshot, setSnapshot] = useState({});

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const mapped = profileToDraft(profile);
      setDraft(mapped);
      setSnapshot(mapped);
    }
  }, [profile]);

  const setField = (key) => (value) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleEdit = () => {
    setSnapshot(draft);
    setEditing(true);
  };

  const handleSave = async () => {
    // Map draft keys back to what the API expects
    await dispatch(updateUserProfile({
      userName: draft.name,
      email: draft.email,
    }));
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(snapshot);
    setEditing(false);
  };

  const handleReset = () => {
    if (!profile) return;
    const original = profileToDraft(profile);
    setDraft(original);
    setSnapshot(original);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 text-muted">
        <div className="spinner-border spinner-border-sm me-2" role="status" />
        Loading profile…
      </div>
    );
  }

  return (
    <section>
      <div className="profile-page-title fw-bold mb-1">My Profile</div>
      <div className="profile-page-subtitle text-secondary mb-4">
        Manage your personal information
      </div>

      <div className="profile-card bg-white border rounded-4 overflow-hidden">

        {error && (
          <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-danger bg-opacity-10 border-bottom border-danger-subtle text-danger small">
            {error}
            <button
              onClick={() => dispatch(clearError())}
              className="btn btn-link btn-sm text-danger p-0 ms-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {profile && (
          <div className="d-flex gap-3 flex-wrap px-4 pt-3 pb-2 border-bottom border-light">
            <MetaBadge label="Role" value={formatRole(profile.userRole)} />
            <MetaBadge label="Status" value={profile.userStatus} status={profile.userStatus} />
            <MetaBadge label="Member since" value={profile.userCreatedDate} />
            <MetaBadge label="User ID" value={`#${profile.userId}`} />
          </div>
        )}

        <div className="px-4 pt-2 pb-1">
          <ProfileField
            label="Name"
            inputId="edit-name"
            value={draft.name}
            editing={editing}
            inputType="text"
            placeholder="Enter name"
            onChange={setField("name")}
          />
          <ProfileField
            label="Email"
            inputId="edit-email"
            value={draft.email}
            editing={editing}
            inputType="email"
            placeholder="Enter email"
            onChange={setField("email")}
          />
          <ProfileField
            label="Phone"
            value={draft.phone}
            readonly
          />
        </div>

        <div className="d-flex gap-2 flex-wrap px-4 py-3 border-top border-light">
          {!editing && (
            <button className="btn btn-primary btn-sm" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
          {editing && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={handleSave}
                disabled={updating}
              >
                {updating
                  ? <><span className="spinner-border spinner-border-sm me-1" />Saving…</>
                  : "Save Changes"
                }
              </button>
              <button className="btn btn-light btn-sm border" onClick={handleCancel} disabled={updating}>
                Cancel
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={handleReset} disabled={updating}>
                Reset
              </button>
            </>
          )}
        </div>

      </div>
    </section>
  );
}

function MetaBadge({ label, value, status }) {
  const colorClass =
    status === "Active"   ? "text-success bg-success" :
    status === "Inactive" ? "text-danger  bg-danger"  :
                            "text-secondary bg-secondary";
  return (
    <div className="d-flex align-items-center gap-1">
      <span
        className="text-uppercase text-secondary"
        style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em" }}
      >
        {label}:
      </span>
      <span
        className={`badge bg-opacity-10 ${colorClass}`}
        style={{ fontSize: 11.5, fontWeight: 600 }}
      >
        {value || "—"}
      </span>
    </div>
  );
}