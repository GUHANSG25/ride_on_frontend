import React, { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { fetchCancelList } from '../Slice/BookingSlice';
import RecentModal from '../../../components/common/RecentModal';

export default function BookingCancelList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchCancelList());
  }, [dispatch]);

  return (
    <RecentModal
      title="Cancellation List"
      items={list}
      loading={loading}
      renderItem={(booking) => (
        <div key={booking.bookingRef} className="d-flex justify-content-between align-items-center py-2 border-bottom">
          <div>
            <div style={{ fontWeight: 500 }}>
              {booking.source} → {booking.destination}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#888" }}>
              {booking.busName} · {booking.travelDate} at {booking.departureTime}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#aaa" }}>
              Ref: {booking.bookingRef}
            </div>
          </div>
          <div className="d-flex flex-column align-items-end gap-1">
            <span style={{ fontWeight: 600 }}>₹{booking.totalFare?.toFixed(2)}</span>
            <span className="tag tag-danger">CANCELLED</span>
          </div>
        </div>
      )}
      emptyMessage="No cancellations yet."
    />
  );
}