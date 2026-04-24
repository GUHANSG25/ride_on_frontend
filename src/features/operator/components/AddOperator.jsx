import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveOperator } from "../slice/OperatorSlice";
import AddNewModal from "../../../components/common/AddNewModal";

export default function AddOperatorModal({ show, onClose }) {
  const dispatch = useDispatch();
  const currentDate = new Date();
  const [form, setForm] = useState({ userName: "", mobile: "", email: "", userRole: "ROLE_OPERATOR", userStatus: "Active", userCreatedDate: currentDate });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    dispatch(saveOperator(form));
    onClose();
  };

  return (
    <AddNewModal show={show} onClose={onClose} title="Add New Operator" onSubmit={handleSubmit} submitLabel="Add Operator">
      <div className="row g-3">
        <div className="col-6">
          <label className="form-label small">Name <span style={{ color: "red" }}>*</span></label>
          <input name="userName" className="form-control form-control-sm" placeholder="e.g. John"
            value={form.userName} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Mobile <span style={{ color: "red" }}>*</span></label>
          <input name="mobile" className="form-control form-control-sm" placeholder="e.g. 9876543210"
            value={form.mobile} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Email</label>
          <input name="email" type="email" className="form-control form-control-sm" placeholder="e.g. john@email.com"
            value={form.email} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Created Date</label>
          <input name="userCreatedDate" type="date" className="form-control form-control-sm"
            value={form.userCreatedDate} onChange={handleChange} />
        </div>
        <div className="col-6">
          <label className="form-label small">Status</label>
          <select name="userStatus" className="form-select form-select-sm" value={form.userStatus} onChange={handleChange}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>
    </AddNewModal>
  );
}