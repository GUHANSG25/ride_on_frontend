import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrip } from "../Slice/TripSlice"; 
import RecentModal from "../../../components/common/RecentModal";

export default function RecentTrip() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.trip);

  useEffect(() => {
    dispatch(fetchTrip());
  }, [dispatch]);

  const recentTrips = [...list]
    .sort((a, b) => new Date(b.departureDate) - new Date(a.departureDate))
    .slice(0, 5);

  return (
    <RecentModal
    title="Recently Scheduled"
    items={recentTrips}
    loading={loading}
    renderItem={(trip) => (
        <div key={trip.tripId} className="d-flex justify-content-between align-items-center py-2 border-bottom">
          <div>
            <div style={{ fontWeight: 500 }}>{trip.source} → {trip.destination}</div>
            <div style={{ fontSize: "0.78rem", color: "#888" }}>
              {trip.busName} · {trip.departureDate} at {trip.departureTime}
            </div>
          </div>
          <div className="d-flex flex-column align-items-end gap-1">
            <span>₹{trip.fare}</span>
            <span className={`tag tag-${trip.tripStatus === "ACTIVE" ? "success" : "danger"}`}>
              {trip.tripStatus}
            </span>
          </div>
        </div>
    )}
    emptyMessage="No Trips scheduled yet."
    />
  );
}