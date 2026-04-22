import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveBus } from '../Slice/BusSlice'
import AddNewModal from "../../../components/common/AddNewModal";
import axios from "../../../api/axiosInstance";

export default function AddBus({ show, onClose }) {
  const dispatch = useDispatch();
  const [operatorId, setOperatorId] = useState(null);
  const [form, setForm] = useState({busName: "",busNumber: "",busType: "SEATER",amenity: "",totalSeat: 0,});

  useEffect(() => {
    axios.get("/user/profile") 
      .then(res => setOperatorId(res.data.userId))
      .catch(err => console.error("Failed to fetch user", err));
  }, []);

  const handleChange = (e) => { 
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  };
  const handleSubmit = () => {
    if (!operatorId) {
      console.error("Operator ID not loaded yet");
      return;
    }
    const payload = {
      ...form,
      operator: { userId: operatorId },
    };
    dispatch(saveBus(payload));
    onClose();
  };

  return (
    <AddNewModal show={show} onClose={onClose} title="Add New Bus" onSubmit={handleSubmit} submitLabel="Add Bus">
      <div className="row g-3">
        <div className="col-6">
          <label className="form-label small">Bus Name *</label>
          <input name="busName" className="form-control form-control-sm" placeholder="e.g. BMW 2"
            value={form.busName} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Bus Number *</label>
          <input name="busNumber" className="form-control form-control-sm" placeholder="e.g. TN33YE1234"
            value={form.busNumber} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Bus Type *</label>
          <select name="busType" className="form-select form-select-sm" value={form.busType} onChange={handleChange}>
            <option value="SEATER">Seater</option>
            <option value="SLEEPER">Sleeper</option>
            <option value="SEMI_SLEEPER">Semi Sleeper</option>
          </select>
        </div>
        <div className="col-6">
          <label className="form-label small">Total Seats *</label>
          <input name="totalSeat" type="number" className="form-control form-control-sm" placeholder="e.g. 30"
            value={form.totalSeat} onChange={handleChange} />
        </div>
        <div className="col-12">
          <label className="form-label small">Amenities</label>
          <input name="amenity" className="form-control form-control-sm" placeholder="e.g. AC, Charging port"
            value={form.amenity} onChange={handleChange} />
        </div>
      </div>
    </AddNewModal>
  );
}