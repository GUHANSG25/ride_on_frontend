// features/booking/components/FareSummary.jsx
import React from 'react';

export default function FareSummary({ trip, selectedSeats, pendingBooking }) {
  const CONVENIENCE_FEE = 35;
  const baseFare  = pendingBooking?.baseFare  ?? (trip?.fare ?? 0) * selectedSeats.length;
  const convFee   = pendingBooking?.convenienceFee ?? (selectedSeats.length > 0 ? CONVENIENCE_FEE : 0);
  const totalFare = pendingBooking?.totalFare ?? baseFare + convFee;

  return (
    <div className="ss-fare-card">
      <div className="ss-fare-title">Fare Summary</div>

      {selectedSeats.length > 0 && (
        <>
          <div className="ss-fare-row">
            <span className="ss-fare-label">Selected Seats</span>
          </div>
          <div className="ss-selected-chips">
            {selectedSeats.map((s) => (
              <span key={s} className="ss-seat-chip">{s}</span>
            ))}
          </div>
          <div style={{ marginTop: 12 }} />
        </>
      )}

      <div className="ss-fare-row">
        <span className="ss-fare-label">Fare × {selectedSeats.length || '—'}</span>
        <span className="ss-fare-value">
          {selectedSeats.length ? `₹${baseFare.toFixed(2)}` : '—'}
        </span>
      </div>

      <div className="ss-fare-row">
        <span className="ss-fare-label">Convenience Fee</span>
        <span className="ss-fare-value">
          {selectedSeats.length ? `₹${convFee.toFixed(2)}` : '—'}
        </span>
      </div>

      <div className="ss-fare-divider" />

      <div className="ss-fare-row">
        <span className="ss-fare-total-label">Total</span>
        <span className="ss-fare-total-value">
          {selectedSeats.length ? `₹${totalFare.toFixed(2)}` : '—'}
        </span>
      </div>
    </div>
  );
}
