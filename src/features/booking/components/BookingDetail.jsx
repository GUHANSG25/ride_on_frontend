export default function BookingDetail({ booking, onClose }) {
  if (!booking) return null;

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

  const formatDateTime = (d) =>
    d ? new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }) : '—';

  const formatTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':');
    const date = new Date(); date.setHours(+h, +m);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="bdm-backdrop" onClick={onClose}>
      <div className="bdm-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bdm-header">
          <div>
            <div className="bdm-title">Booking Details</div>
            <div className="bdm-ref">{booking.bookingRef}</div>
          </div>
          <div className="bdm-header-right">
            <span className={`bci-status ${cls}`}>{label}</span>
            <button className="bdm-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="bdm-body">
          {/* Route */}
          <div className="bdm-route-banner">
            <div className="bdm-route-city">
              <span className="bdm-route-name">{booking.source}</span>
              <span className="bdm-route-point">{booking.pickupPoint}</span>
            </div>
            <div className="bdm-route-mid">
              <span className="bdm-route-line" />
              <span style={{ color: 'yellow' }}> to</span>
              <span className="bdm-route-line" />
            </div>
            <div className="bdm-route-city">
              <span className="bdm-route-name">{booking.destination}</span>
              <span className="bdm-route-point">{booking.dropPoint}</span>
            </div>
          </div>

          {/* Bus Info */}
          <div className="bdm-section-title">Bus Information</div>
          <div className="bdm-grid">
            <DetailRow label="Bus Name"      value={booking.busName} />
            <DetailRow label="Bus Number"    value={booking.busNumber} />
            <DetailRow label="Bus Type"      value={booking.busType} />
            <DetailRow label="Travel Date"   value={formatDate(booking.travelDate)} />
            <DetailRow label="Departure"     value={formatTime(booking.departureTime)} />
            <DetailRow label="Arrival"       value={formatTime(booking.arrivalTime)} />
          </div>

          {/* Fare */}
          <div className="bdm-section-title">Fare Breakdown</div>
          <div className="bdm-fare-box">
            <FareRow label="Base Fare"       value={`₹${booking.baseFare?.toFixed(2)}`} />
            <FareRow label="Convenience Fee" value={`₹${booking.convenienceFee?.toFixed(2)}`} />
            <div className="bdm-fare-divider" />
            <FareRow label="Total"           value={`₹${booking.totalFare?.toFixed(2)}`} bold />
          </div>

          {/* Passengers */}
          <div className="bdm-section-title">Passengers</div>
          <div className="bdm-passenger-list">
            {booking.passengers?.map((p, i) => (
              <div key={i} className="bdm-passenger-row">
                <div className="bdm-passenger-avatar">
                  {p.passengerName?.charAt(0).toUpperCase()}
                </div>
                <div className="bdm-passenger-info">
                  <span className="bdm-passenger-name">{p.passengerName}</span>
                  <span className="bdm-passenger-meta">
                    {p.gender} · Age {p.age} · Seat {p.seatNo}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="bdm-section-title">Payment</div>
          <div className="bdm-grid">
            <DetailRow label="Method"        value={booking.paymentMethod  || 'N/A'} />
            <DetailRow label="Status"        value={booking.paymentStatus  || 'N/A'} />
            <DetailRow label="Payment ID"    value={booking.razorpayPaymentId || 'N/A'} />
            <DetailRow label="Booked On"     value={formatDateTime(booking.bookingDate)} />
          </div>
        </div>

      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="bdm-detail-row">
      <span className="bdm-detail-label">{label}</span>
      <span className="bdm-detail-value">{value}</span>
    </div>
  );
}

function FareRow({ label, value, bold }) {
  return (
    <div className="bdm-fare-row">
      <span className={bold ? 'bdm-fare-label bold' : 'bdm-fare-label'}>{label}</span>
      <span className={bold ? 'bdm-fare-value bold' : 'bdm-fare-value'}>{value}</span>
    </div>
  );
}