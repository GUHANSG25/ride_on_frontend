import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoute, deactivateRoute, clearError, activateRoute } from "../slice/RouteSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from "../../../components/common/DataTable";
import AddRoute from "./AddRoute";

export default function RouteList() {
  const dispatch = useDispatch();
  const { list, loading, error,page,totalPages } = useSelector((state) => state.route);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { dispatch(fetchRoute({page:0, size:5})); }, [dispatch]);

  const handleDeactivate = async (id) => {
    if (window.confirm("Deactivate this route?")) {
      await dispatch(deactivateRoute(id));
      await dispatch(fetchRoute({page,size}));
    }
  };

  const handleActivate = async (id) => {
    if (window.confirm("Activate this route?")) {
      await dispatch(activateRoute(id));
      await dispatch(fetchRoute({page,size}));
    }
  };

  const columns = [
    { key: "routeId",label: "Route ID",width: 120,  render: (r) => <span className="font-monospace text-muted">{r.routeId}</span> },
    { key: "source",label: "Source", render: (r) => <strong>{r.source}</strong> },
    { key: "_arrow",label: "",width: 100,  render: () => <span className="text-muted">→</span> },
    { key: "destination", label: "Destination", render: (r) => <strong>{r.destination}</strong> },
    { key: "estimatedTime", label: "Estimated Time", width: 130, render: (r) => <span className="text-muted ">{r.estimatedTime}</span> },
    { key: "distance", label: "Distance",width: 100, render: (r) => <span className="text-muted ">{r.distance} kms</span> },
    {
      key: "status", label: "Status", width: 100,
      render: (r) => (
        <span className={`badge ${r.status === "Active" ? "bg-success" : r.status === "InActive" ? "bg-secondary" : "bg-warning text-dark"}`}
          style={{ fontSize: 12, padding: "4px 10px" }}>
          {r.status}
        </span>
      ),
    },
    {
      key: "_action", label: "Action", width: 110,
      render: (r) =>
        r.status !== "InActive" ? (
          <button style={{ fontSize: 12, padding: "4px 8px" }} className="btn btn-danger" 
          onClick={() => handleDeactivate(r.routeId)}>Deactivate</button>
        ) : (
          <button className="btn btn-success btn-sm" onClick={() => handleActivate(r.routeId)}>Activate</button>
        ),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Route
        </button>
      </div>
        <DataTable
        label="All Routes"
        columns={columns}
        data={list}
        rowKey="routeId"
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        onDismissError={() => dispatch(clearError())}
        onPageChange={(newPage) => dispatch(fetchRoute({ page: newPage, size: 5 }))}
        searchFields={["source"]}
        emptyMessage="No routes found."
      />

      <AddRoute show={showModal} onClose={() => setShowModal(false)} />
    </>

    
    
  );
}
