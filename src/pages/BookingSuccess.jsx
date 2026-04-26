// pages/BookingSuccess.jsx
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/SelectSeats.css';

export default function BookingSuccess() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const booking    = state?.booking;

  if (!booking) {
    return (
      <div className="ss-success-page">
        <Header />
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
          <p style={{ fontSize: 16, marginBottom: 16 }}>No booking data found.</p>
          <button className="ss-btn-primary" style={{ maxWidth: 200, margin: '0 auto' }} onClick={() => navigate('/home')}>
            Go Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const formatTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.toString().split(':');
    const date = new Date(); date.setHours(+h, +m);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="ss-success-page">
      <Header />

      {/* ── Success Hero ── */}
      <div className="ss-success-hero">
        <div className="ss-success-icon">✓</div>
        <h1 className="ss-success-title">Booking Confirmed!</h1>
        <p className="ss-success-ref">Booking Ref: {booking.bookingRef}</p>
      </div>

      <div className="ss-success-body">

        {/* ── Journey Details ── */}
        <div className="ss-success-card">
          <div className="ss-success-card-title">Journey Details</div>
          <div className="ss-success-grid">
            <Detail label="From"       value={booking.source} />
            <Detail label="To"         value={booking.destination} />
            <Detail label="Travel Date"value={formatDate(booking.travelDate)} />
            <Detail label="Departure"  value={formatTime(booking.departureTime)} />
            <Detail label="Pickup"     value={booking.pickupPoint} />
            <Detail label="Drop"       value={booking.dropPoint} />
          </div>
        </div>

        {/* ── Bus Details ── */}
        <div className="ss-success-card">
          <div className="ss-success-card-title">Bus Details</div>
          <div className="ss-success-grid">
            <Detail label="Bus Name"   value={booking.busName} />
            <Detail label="Bus Number" value={booking.busNumber} />
            <Detail label="Bus Type"   value={booking.busType} />
            <Detail label="Seats"      value={booking.seatNumbers?.join(', ') || '—'} />
          </div>
        </div>

        {/* ── Passengers ── */}
        {booking.passengers?.length > 0 && (
          <div className="ss-success-card">
            <div className="ss-success-card-title">Passengers</div>
            {booking.passengers.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < booking.passengers.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div className="ss-passenger-avatar">{p.passengerName?.charAt(0)?.toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{p.passengerName}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {p.gender} · Age {p.age} · Seat {p.seatNo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Fare ── */}
        <div className="ss-success-card">
          <div className="ss-success-card-title">Payment</div>
          <div className="ss-success-grid">
            <Detail label="Amount Paid" value={`₹${booking.totalFare?.toFixed(2)}`} />
            <Detail label="Method"      value={booking.paymentMethod || 'RAZORPAY'} />
            <Detail label="Status"      value={booking.paymentStatus || 'SUCCESS'} />
            <Detail label="Payment ID"  value={booking.razorpayPaymentId || '—'} />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="ss-success-actions">
          <button className="ss-success-btn-primary" onClick={() => navigate('/booking')}>
            View My Bookings
          </button>
          <button className="ss-success-btn-secondary" onClick={() => navigate('/search')}>
            Book Another
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="ss-success-detail">
      <span className="ss-success-detail-label">{label}</span>
      <span className="ss-success-detail-value">{value || '—'}</span>
    </div>
  );
}
