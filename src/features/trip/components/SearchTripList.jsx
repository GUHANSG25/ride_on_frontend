// SearchTripList.jsx
import TripCard from './TripCard';
import { useNavigate } from 'react-router-dom';

export default function SearchTripList({ trips, loading, error }) {
  const navigate = useNavigate();

  if (loading) return <p className="trip-list-state">Searching buses...</p>;
  if (error)   return <p className="trip-list-state" style={{ color: "#e24b4a" }}>{error}</p>;
  if (!trips?.length) return <p className="trip-list-state">No buses found for this route.</p>;

  return (
    <div>
      {trips.map((trip, index) => (
        <TripCard
          key={trip.tripId ?? index}
          trip={trip}
          onViewSeats={(t) => { localStorage.setItem('selectedTrip', JSON.stringify(t)); navigate(`/seats/${t.tripId}`); }}
        />
      ))}
    </div>
  );
}