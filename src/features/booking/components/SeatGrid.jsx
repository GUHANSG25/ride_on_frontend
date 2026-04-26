// features/booking/components/SeatGrid.jsx
import React from 'react';

export default function SeatGrid({ seats, selectedSeats, onToggle, loading }) {
  if (loading) {
    return (
      <div className="ss-seats-loading">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="ss-seat-skeleton" />
        ))}
      </div>
    );
  }

  if (!seats.length) {
    return <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px 0' }}>No seats found for this trip.</p>;
  }

  return (
    <>
      <div className="ss-bus-front">
        <span className="ss-bus-front-icon">🚌</span>
        Driver
      </div>

      <div className="ss-seat-grid">
        {seats.map((seat) => {
          const isBooked   = seat.availability !== 'AVAILABLE';
          const isSelected = selectedSeats.includes(seat.seatNo);

          return (
            <button
              key={seat.seatNo}
              disabled={isBooked}
              onClick={() => !isBooked && onToggle(seat)}
              className={`ss-seat ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
              title={seat.seatNo}
              type="button"
            >
              {seat.seatNo}
            </button>
          );
        })}
      </div>

      <div className="ss-legend">
        <div className="ss-legend-item">
          <div className="ss-legend-dot available" />
          Available
        </div>
        <div className="ss-legend-item">
          <div className="ss-legend-dot selected" />
          Selected
        </div>
        <div className="ss-legend-item">
          <div className="ss-legend-dot booked" />
          Booked
        </div>
      </div>
    </>
  );
}
