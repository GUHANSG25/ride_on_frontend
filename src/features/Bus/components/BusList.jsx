import React, { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBuses, clearError,deactivateBus } from '../Slice/BusSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from '../../../components/common/DataTable';
import AddBus from './AddBus';

export default function BusList() {
  const dispatch = useDispatch();
  const{list,loading,error}= useSelector((state) => state.bus);
  const[showModal,setShowModal] = useState(false);

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
      key: "busStatus", label: "Current status", width: 120,
      render: (b) => (
        <span className={`badge ${b.busStatus === "Active" ? "bg-success" : b.busStatus === "InActive" ? "bg-secondary" : "bg-danger"}`}
          style={{ fontSize: 12, padding: "4px 10px" }}>
          {b.busStatus}
        </span>
      ),
    },
    {
      key: "_action", label: "Action", width: 110,
      render: (b) =>
        b.busStatus !== "InActive" ? (
          <div className="d-flex gap-2">
          <button  style={{ fontSize: 12, padding: "4px 8px" }} className="btn btn-warning" 
          onClick={async () => {await dispatch(deactivateBus(b.busId)); await dispatch(fetchBuses());}}>Deactivate</button>
          </div>
        ) : (
          <div className="d-flex gap-2">
          <button  style={{ fontSize: 12, padding: "4px 8px" }} className="btn btn-danger">Deactivated</button>
          </div>
        ),
    },

  ]
  return (
    <div>
      <>
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Bus
          </button>
        </div>

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
      
      <AddBus show={showModal} onClose={() => setShowModal(false)} />
      </>
    </div>
  )
}
