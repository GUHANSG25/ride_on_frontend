import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOperators, deactivateOperator, clearError, activateOperator } from "../slice/OperatorSlice";
import DataTable from "../../../components/common/DataTable";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddOperator from '../components/AddOperator'

export default function OperatorList() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.operator);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { dispatch(fetchOperators()); }, [dispatch]);

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
        r.userStatus !== "InActive" ? (
          <button style={{ fontSize: 12, padding: "4px 8px" }} className="btn btn-danger" onClick={() => dispatch(deactivateOperator(r.userId))}>Deactivate</button>
        ) : (
          <button style={{ fontSize: 12, padding: "4px 8px" }} className="btn btn-success" onClick={() => dispatch(activateOperator(r.userId))}>Activate</button>
        ),
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Operator
        </button>
      </div>

      <DataTable
        label="All Operators"
        columns={columns}
        data={list}
        rowKey="userId"
        loading={loading}
        error={error}
        onDismissError={() => dispatch(clearError())}
        searchFields={["userName", "email"]}
        emptyMessage="No operators found."
      />

      <AddOperator show={showModal} onClose={() => setShowModal(false)} />
    </>
    
  );
}