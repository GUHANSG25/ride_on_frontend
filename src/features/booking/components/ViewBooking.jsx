import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookingsByOp } from '../../../features/booking/Slice/BookingSlice'
import RecentModal from '../../../components/common/RecentModal'
import { fetchUserProfile } from '../../profile/slice/ProfileSlice'
import '../../../styles/BookingCard.css'

function BookingCard({ booking }) {
  const fmt = (t) => {
    const [h, m] = t.split(":")
    const d = new Date()
    d.setHours(+h, +m)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

  return (
    <div className="booking-card">

      <div className="route-row">
        <span className="route-city">{capitalize(booking.source)}</span>
        <div className="route-arrow" />
        <span className="route-city">{capitalize(booking.destination)}</span>
      </div>

      <hr />

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Pickup</span>
          <span>{booking.pickupPoint}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Drop</span>
          <span>{booking.dropPoint}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Seat</span>
          <span>{booking.seatNumbers.join(", ")}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Payment</span>
          <span className="text-success">{booking.paymentStatus}</span>
        </div>
      </div>

      <hr />

      {booking.passengers.map((p, i) => (
        <div key={i} className="passenger-row">
          <div className="avatar">{p.passengerName.charAt(0)}</div>
          <div>
            <div className="passenger-name">{p.passengerName}</div>
            <div className="passenger-meta">{p.gender} · {p.age} yrs · Seat {p.seatNo}</div>
          </div>
        </div>
      ))}

      <hr />
    </div>
  )
}

export default function ViewBooking() {
  const dispatch = useDispatch()
  const { profile, error } = useSelector((state) => state.profile); 

  const { list, loading } = useSelector((state) => state.booking)

  // console.log(profile?.userId);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.userId) {
      dispatch(fetchBookingsByOp(profile.userId));
    }
  }, [profile?.userId]);
  
  return (
    <RecentModal
      title="List of Bookings"
      items={list}
      loading={loading}
      emptyMessage="No bookings found."
      renderItem={(booking) => (
        <BookingCard key={booking.bookingRef} booking={booking} />
      )}
    />
  )
}