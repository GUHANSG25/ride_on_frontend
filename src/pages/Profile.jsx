import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProfileCard from '../features/profile/components/ProfileCard';
import ProfileLayout from '../features/profile/components/ProfileLayout';
import '../styles/ProfilePage.css';

export default function Profile() {
  return (
    <>
      <Header />
      <ProfileLayout>
        <ProfileCard />
      </ProfileLayout>
      <Footer />
    </>
  );
}