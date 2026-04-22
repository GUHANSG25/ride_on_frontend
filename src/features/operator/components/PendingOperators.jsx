import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingOperators,deactivateOperator,activateOperator, clearError } from "../slice/OperatorSlice";
import DataTable from "../../../components/common/DataTable";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PendingOperators() {
  const dispatch = useDispatch();
  const { pendinglist, loading, error } = useSelector((state) => state.operator);

  useEffect(() => { dispatch(fetchPendingOperators()); }, [dispatch]);

  const columns = [
    { key: "userId", label: "ID", width: 90,  render: (r) => <span className="font-monospace text-muted">{r.userId}</span> },
    { key: "userName", label: "Name", render: (r) => <strong>{r.userName}</strong> },
    { key: "email", label: "Email", render: (r) => <span className="text-muted">{r.email}</span> },
    { key: "mobile", label: "Phone", width: 120, render: (r) => <span className="font-monospace text-muted">{r.mobile}</span>},
    {
      key: "status", label: "Status", width: 100,
      render: (r) => (
        <span className={`badge ${r.userStatus === "Active" ? "bg-success" : "bg-secondary"}`}
          style={{ fontSize: 12, padding: "4px 10px" }}>
          {r.userStatus}
        </span>
      ),
    },
    {
      key: "_action", label: "Action", width: 110,
      render: (r) =>
        <>
          <div className="d-flex gap-2">
            <button style={{ fontSize: 12, padding: "4px 8px" }} className="btn btn-success" onClick={() => dispatch(activateOperator(r.operatorId))}>Approve</button>
            <button style={{ fontSize: 12, padding: "4px 8px" }} className="btn btn-danger" onClick={() => dispatch(deactivateOperator(r.operatorId))}>Reject</button>
          </div>
          
        </>
    },
  ];

  return (
    <DataTable
      label="Pending Operators"
      columns={columns}
      data={pendinglist}
      rowKey="userId"
      loading={loading}
      error={error}
      onDismissError={() => dispatch(clearError())}
      searchFields={["userName", "email"]}
      emptyMessage="No operators found."
    />
  );
}