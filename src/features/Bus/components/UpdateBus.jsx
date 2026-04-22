import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBuses, clearError } from '../Slice/BusSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from '../../../components/common/DataTable';
import { updateBusStatus } from '../Slice/BusSlice';

export default function UpdateBus() {
  const dispatch = useDispatch();
  const{list,loading,error}= useSelector((state) => state.bus);

  useEffect(() => {
    dispatch(fetchBuses());
  },[dispatch]);

  const columns = [
    { key: "busId",label: "Bus ID",width: 90,  render: (b) => <span className="font-monospace text-muted">{b.busId}</span> },
    { key: "busName",label: "Bus Name",  render: (b) => <strong>{b.busName}</strong> },
    { key: "busNumber",label: "Reg. Number",  render: (b) => <span className="font-monospace text-muted">{b.busNumber}</span> },
    { key: "totalSeat",label: "Total Seat",  render: (b) => <span className="font-monospace text-muted">{b.totalSeat}</span> },
    { key: "busType",label: "Bus Type",  render: (b) => <span className="font-monospace text-muted">{b.busType}</span> },
    {
      key: "busStatus", label: "Current status", width: 130,
      render: (b) => (
        <span className={`badge ${b.busStatus === "Active" ? "bg-success" : b.busStatus === "InActive" ? "bg-secondary" : "bg-warning text-dark"}`}
          style={{ fontSize: 12, padding: "4px 10px" }}>
          {b.busStatus}
        </span>
      ),
    },
    { key: "_action", label: "Update Status", width: 160,
        render: (b) => (
        <select
            className="form-select form-select-sm"
            value={b.busStatus}
            onChange={async (e) => {await dispatch(updateBusStatus({ id: b.busId, status: e.target.value })); await dispatch(fetchBuses());}}>
            <option value="Active">Active</option>
            <option value="On Trip">On Trip</option>
            <option value="InActive">InActive</option>
        </select>
        )
    },
    ];

  return (
    <div>
      <>
          <DataTable
          label="All Buses"
          columns={columns}
          data={list}
          rowKey="busId"
          loading={loading}
          error={error}
          onDismissError={() => dispatch(clearError())}
          searchFields={["busNumber"]}
          emptyMessage="No Bus found."
        />
    </>
    </div>
  )
}
