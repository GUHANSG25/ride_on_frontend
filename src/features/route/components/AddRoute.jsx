import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveRoute } from "../slice/RouteSlice";
import AddNewModal from "../../../components/common/AddNewModal";

export default function AddRoute({ show, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ source: "", destination: "", distance: "",estimatedTime:"", status: "Active" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    dispatch(saveRoute(form));
    onClose();
  };

  return (
    <AddNewModal show={show} onClose={onClose} title="Add New Route" onSubmit={handleSubmit} submitLabel="Add Route">
      <div className="row g-3">
        <div className="col-6">
          <label className="form-label small">Source City *</label>
          <input name="source" className="form-control form-control-sm" placeholder="e.g. Mumbai"
            value={form.source} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Destination City *</label>
          <input name="destination" className="form-control form-control-sm" placeholder="e.g. Pune"
            value={form.destination} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Distance (km)</label>
          <input name="distance" type="number" className="form-control form-control-sm" placeholder="e.g. 148"
            value={form.distance} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Estimated time</label>
          <input name="estimatedTime" type="time" className="form-control form-control-sm" placeholder="e.g. 02:00"
            value={form.estimatedTime} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Status</label>
          <select name="status" className="form-select form-select-sm" value={form.status} onChange={handleChange}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>
    </AddNewModal>
  );
}