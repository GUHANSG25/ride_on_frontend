import ProfileSidebar from '../../../components/common/ProfileSidebar';

export default function ProfileLayout({ children }) {
  return (
    <div className="profile-page d-flex" style={{ minHeight: '100vh' }}>
      <ProfileSidebar />
      <main className="flex-grow-1 p-4">
        {children}
      </main>
    </div>
  );
}