import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoute, deactivateRoute, clearError, activateRoute } from "../slice/RouteSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from "../../../components/common/DataTable";
import AddRoute from "./AddRoute";

export default function ViewOnlyRouteList() {
  const dispatch = useDispatch();
  const { list, loading, error, page, size, totalPages, totalElements } = useSelector((state) => state.route);  
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { dispatch(fetchRoute({page:0, size:5})); }, [dispatch]);

  const columns = [
    { key: "routeId",label: "Route ID",width: 90,  render: (r) => <span className="font-monospace text-muted small">{r.routeId}</span> },
    { key: "source",label: "Source", render: (r) => <strong>{r.source}</strong> },
    { key: "_arrow",label: "",width: 32,  render: () => <span className="text-muted">→</span> },
    { key: "destination", label: "Destination", render: (r) => <strong>{r.destination}</strong> },
    { key: "distance", label: "Distance",width: 100, render: (r) => <span className="text-muted small">{r.distance}</span> },
    { key: "estimatedTime", label: "Estimated Time", width: 130, render: (r) => <span className="text-muted small">{r.estimatedTime}</span> },
    {
      key: "status", label: "Status", width: 100,
      render: (r) => (
        <span className={`badge ${r.status === "Active" ? "bg-success" : r.status === "InActive" ? "bg-secondary" : "bg-warning text-dark"}`}
          style={{ fontSize: 12, padding: "4px 10px" }}>
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
      </div>
        <DataTable
        label="All Routes"
        columns={columns}
        data={list}
        rowKey="routeId"
        loading={loading}
        error={error}
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements} 
        onDismissError={() => dispatch(clearError())}
        onPageChange={(newPage) => dispatch(fetchRoute({ page: newPage, size }))}  
        searchFields={["source"]}
        emptyMessage="No routes found."
      />
    </>
    
  );
}
