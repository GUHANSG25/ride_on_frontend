export default function BookingCard({ booking, onViewDetails }) {
  const statusConfig = {
    CONFIRMED: { label: 'Confirmed', cls: 'status-confirmed' },
    PENDING:   { label: 'Pending',   cls: 'status-pending'   },
    CANCELLED: { label: 'Cancelled', cls: 'status-cancelled' },
    COMPLETED: { label: 'Completed', cls: 'status-completed' },
  };

  const { label, cls } = statusConfig[booking.bookingStatus] ?? {
    label: booking.bookingStatus, cls: 'status-pending'
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const formatTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':');
    const date = new Date(); date.setHours(+h, +m);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="booking-card-item">
      <div className="bci-top">
        <div className="bci-route">
          <span className="bci-city">{booking.source}</span>
          <div className="bci-arrow-wrap">
            <span className="bci-line" />
            <span>to</span>
            <span className="bci-line" />
          </div>
          <span className="bci-city">{booking.destination}</span>
        </div>
        <span className={`bci-status ${cls}`}>{label}</span>
      </div>

      <div className="bci-mid">
        <div className="bci-detail">
          <span className="bci-detail-label">Bus</span>
          <span className="bci-detail-value">{booking.busName}</span>
        </div>
        <div className="bci-detail">
          <span className="bci-detail-label">Travel Date</span>
          <span className="bci-detail-value">{formatDate(booking.travelDate)}</span>
        </div>
        <div className="bci-detail">
          <span className="bci-detail-label">Departure</span>
          <span className="bci-detail-value">{formatTime(booking.departureTime)}</span>
        </div>
        <div className="bci-detail">
          <span className="bci-detail-label">Seats</span>
          <span className="bci-detail-value">{booking.seatNumbers?.join(', ') || '—'}</span>
        </div>
      </div>

      <div className="bci-bottom">
        <div className="bci-ref">
          <span className="bci-ref-label">Ref:</span>
          <span className="bci-ref-value">{booking.bookingRef}</span>
        </div>
        <div className="bci-bottom-right">
          <span className="bci-fare">₹{booking.totalFare?.toFixed(2)}</span>
          <button className="bci-btn" onClick={() => onViewDetails(booking)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}