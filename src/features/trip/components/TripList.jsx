import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrip, clearError } from "../Slice/TripSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from "../../../components/common/DataTable";

export default function ListTrip() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.trip);

  useEffect(() => {
    dispatch(fetchTrip());
  }, [dispatch]);

  const columns = [
    {key: "busName",label: "Bus Name",render: (t) => <strong>{t.busName}</strong>,},
    {key: "busNumber",label: "Bus Number",render: (t) => t.busNumber,},
    {key: "source",label: "Source",render: (t) => <strong>{t.source}</strong>,},
    {key: "_arrow",label: "",width: 32,render: () => <span className="text-muted">→</span>,},
    {key: "destination",label: "Destination",render: (t) => <strong>{t.destination}</strong>,},
    {key: "departureDate",label: "Date",render: (t) => new Date(t.departureDate).toLocaleDateString(),},
    {key: "departureTime",label: "Departure",render: (t) => t.departureTime?.slice(0, 5),},
    {key: "arrivalTime",label: "Arrival",render: (t) => t.arrivalTime?.slice(0, 5),},
    {key: "fare",label: "Fare",render: (t) => `₹${t.fare}`,},
  ];

  return (
    <>
      <DataTable
        label="All Trips"
        columns={columns}
        data={list}
        rowKey="tripId"
        loading={loading}
        error={error}
        onDismissError={() => dispatch(clearError())}
        searchFields={["source"]}
        emptyMessage="No trips found."
      />
    </>
  );
}