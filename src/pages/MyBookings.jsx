import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBooking } from '../features/booking/Slice/BookingSlice';
import BookingCard from '../features/booking/components/BookingCard';
import BookingDetail from '../features/booking/components/BookingDetail';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProfileLayout from '../features/profile/components/ProfileLayout';
import '../styles/Bookings.css';
import { Link } from 'react-router-dom';

export default function MyBookings() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.booking);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBooking());
  }, [dispatch]);

  return (
    <>
      <Header />
      <ProfileLayout>
        <div className="bookings-hero">
          <h1 className="bookings-hero-title">My Bookings</h1>
          <p className="bookings-hero-sub">View and manage all your bus ticket bookings</p>
        </div>

        <div className="bookings-container">
          {error && <div className="bookings-error">{error}</div>}

          {loading && (
            <div className="bookings-loading">
              {[1, 2, 3].map((i) => (
                <div key={i} className="booking-card-skeleton" />
              ))}
            </div>
          )}

          {!loading && list.length > 0 && (
            <div className="bookings-list">
              {list.map((b) => (
                <BookingCard
                  key={b.bookingRef}
                  booking={b}
                  onViewDetails={setSelectedBooking}
                />
              ))}
            </div>
          )}

          {!loading && list.length === 0 && !error && (
            <div className="bookings-empty">
              <h4>No bookings found</h4>
              <p>You haven't made any bookings yet.</p>
              <Link to='/home' className="bookings-book-btn">Book a Bus</Link>
            </div>
          )}
        </div>

        {selectedBooking && (
          <BookingDetail
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </ProfileLayout>
      <Footer />
    </>
  );
}