import React from "react";
import "../../../styles/TripCard.css";

function calcDuration(dep, arr) {
  if (!dep || !arr) return null;
  const [dh, dm] = dep.split(":").map(Number);
  const [ah, am] = arr.split(":").map(Number);
  let mins = (ah * 60 + am) - (dh * 60 + dm);
  if (mins < 0) mins += 1440;
  return `${Math.floor(mins / 60)} HR ${mins % 60} MIN`;
}

export default function TripCard({ trip, onViewSeats }) {
  const duration = calcDuration(trip.departureTime, trip.arrivalTime);

  return (
    <div className="trip-card">
      <div className="trip-card__top">

        <div className="trip-card__info">
          <span className="trip-card__bus-name">{trip.operatorName}</span>
          <span className="font-monospace text-muted">{trip.busName}</span>
        </div>

        <div className="trip-card__timing">
          <span className="trip-card__time">{trip.departureTime?.slice(0, 5)}</span>
          <div className="trip-card__route-line">
            <span className="trip-card__dot" />
            <span className="trip-card__dashes" />
            <span className="trip-card__dot" />
          </div>
          <span className="trip-card__time">{trip.arrivalTime?.slice(0, 5)}</span>
          {duration && <span className="trip-card__duration">{duration}</span>}
        </div>

        <div className="trip-card__fare">
          <span className="trip-card__price">₹{trip.fare}</span>
          <span className="trip-card__onwards">ONWARDS</span>
        </div>

      </div>

      <div className="trip-card__divider" />

      <div className="trip-card__bottom">
        <div style={{ display: "flex", gap: "6px" }}>
          <span className="trip-card__bus-type">
            {[trip.busType, trip.acType].filter(Boolean).join(" | ")}
          </span>
          <span className="trip-card__bus-type">
            {[trip.amenity].filter(Boolean).join(" | ")}
          </span>
        </div>

        {/* ✅ Just call the prop — navigation is handled by SearchTripList */}
        <button
          className="trip-card__view-btn"
          onClick={() => {
            localStorage.setItem("selectedTrip", JSON.stringify(trip));
            onViewSeats?.(trip);
          }}
        >
          VIEW SEATS
        </button>
      </div>
    </div>
  );
}