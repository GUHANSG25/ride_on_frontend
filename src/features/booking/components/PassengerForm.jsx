// features/booking/components/PassengerForm.jsx
import React from 'react';

export default function PassengerForm({ index, data, onChange }) {
  return (
    <div className="ss-passenger-card">
      <div className="ss-passenger-header">
        <div className="ss-passenger-avatar">P{index + 1}</div>
        <span className="ss-passenger-title">Passenger {index + 1}</span>
        <span className="ss-passenger-seat">Seat {data.seatNo}</span>
      </div>

      <div className="ss-passenger-fields">
        {/* Full Name */}
        <div className="ss-field-group" style={{ gridColumn: '1 / -1' }}>
          <label className="ss-field-label">Full Name</label>
          <input
            className="ss-field-input"
            placeholder="e.g. Rahul Kumar"
            value={data.passengerName}
            onChange={(e) => onChange(index, 'passengerName', e.target.value)}
          />
        </div>

        {/* Age */}
        <div className="ss-field-group">
          <label className="ss-field-label">Age</label>
          <input
            className="ss-field-input"
            type="number"
            min="1"
            max="120"
            placeholder="25"
            value={data.age}
            onChange={(e) => onChange(index, 'age', e.target.value)}
          />
        </div>

        {/* Gender */}
        <div className="ss-field-group" style={{ gridColumn: '2 / -1' }}>
          <label className="ss-field-label">Gender</label>
          <select
            className="ss-field-select"
            value={data.gender}
            onChange={(e) => onChange(index, 'gender', e.target.value)}
          >
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
