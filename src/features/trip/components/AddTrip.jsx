import React, { useEffect, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import AddNewModal from '../../../components/common/AddNewModal'
import { saveTrip } from '../Slice/TripSlice'
import '../../../styles/ScheduleModal.css'
import { fetchBus } from '../../Bus/Slice/BusSlice'
import { fetchRouteById } from '../../route/slice/RouteSlice'
import Toast from '../../../components/common/Toast'

export default function AddTrip({ show, onClose }) {
  const dispatch = useDispatch()
  const[toast, setToast] = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [form, setForm] = useState({departureDate: '',departureTime: '',arrivalTime: '',fare: '',busId: '',routeId: '',
  })
  
  const [pickDropPoints, setPickDropPoints] = useState([
    { points: '', pointType: 'SOURCE', arrivalTime: '' },
  ])

  const {bus} = useSelector(state => state.bus);
  const {route} = useSelector(state => state.route);

  useEffect(() => {
    if (form.busId && !isNaN(form.busId) && Number(form.busId) > 0) {
      dispatch(fetchBus(Number(form.busId)))
    }
    
  }, [dispatch, form.busId])

  useEffect(() => {
    if (form.routeId && !isNaN(form.routeId) && Number(form.routeId) > 0) {
      dispatch(fetchRouteById(Number(form.routeId)))
    }
  }, [dispatch, form.routeId])
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePointChange = (index, e) => {
    const updated = [...pickDropPoints]
    updated[index][e.target.name] = e.target.value
    setPickDropPoints(updated)
  }

  const addPoint = (type) => {
    setPickDropPoints([
      ...pickDropPoints,
      { points: '', pointType: type, arrivalTime: '' },
    ])
  }

  const removePoint = (index) => {
    setPickDropPoints(pickDropPoints.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {

    if (!form.busId || !form.routeId || !form.departureDate || !form.departureTime || !form.arrivalTime || !form.fare) {
      showToast('Please fill in all required fields.')
      return
    }
    console.log("Bus:", bus);
    console.log("Route:", route);
    if (!bus || bus.busId !== Number(form.busId)) {
      showToast('Bus not found. Please enter a valid Bus ID.')
      return
    }

    if (!route || route.routeId !== Number(form.routeId)) {
      showToast('Route not found. Please enter a valid Route ID.')
      return
    }

    if(bus.busStatus === "InActive"){
      showToast("Cannot add schedule. Selected bus is inactive.", "error");
      return;
    }
    if(route.status === "InActive"){
      showToast("Cannot add schedule. Selected route is inactive.", "error");
      return;
    }

    const payload = {
      ...form,
      busId: Number(form.busId),
      routeId: Number(form.routeId),
      fare: Number(form.fare),
      pickDropPoints,
    }

    dispatch(saveTrip(payload))
    onClose()
  }

  const sourcePoints = pickDropPoints
    .map((point, index) => ({ ...point, index }))
    .filter((point) => point.pointType === 'SOURCE')

  const destPoints = pickDropPoints
    .map((point, index) => ({ ...point, index }))
    .filter((point) => point.pointType === 'DESTINATION')

  return (
    
    <AddNewModal show={show} onClose={onClose} title="Add New Schedule" onSubmit={handleSubmit} submitLabel="Add Schedule">
      <div className="schedule-grid">
        <Toast toast={toast} />
        <section className="panel">
          <div className="panel-header">
            <div className="panel-title">Trip Details</div>
          </div>
          <div className="panel-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Bus ID <span style={{ color: "red" }}>*</span></label>
                <input className="form-input" type="number" name="busId" value={form.busId} 
                placeholder="Enter bus ID" onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label className="form-label">Route ID <span style={{ color: "red" }}>*</span></label>
                <input className="form-input" type="number" name="routeId"
                  value={form.routeId} placeholder="Enter route ID" onChange={handleChange}/>
              </div>

              <div className="form-group">
                <label className="form-label">Departure Date <span style={{ color: "red" }}>*</span></label>
                <input className="form-input" type="date" name="departureDate"
                  value={form.departureDate} onChange={handleChange}
                />
              </div>

              <div className="field-row">
                <div className="form-group">
                  <label className="form-label">Departure Time <span style={{ color: "red" }}>*</span></label>
                  <input className="form-input" type="time" name="departureTime"
                    value={form.departureTime} onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Arrival Time <span style={{ color: "red" }}>*</span></label>
                  <input className="form-input" type="time" name="arrivalTime"
                    value={form.arrivalTime} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹) <span style={{ color: "red" }}>*</span></label>
                <input className="form-input" type="number" name="fare" placeholder="e.g. 450"
                  value={form.fare} onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div className="panel-title">Pick &amp; Drop Points</div>
          </div>
          <div className="panel-body">
            <div className="point-section">
              <label className="form-label">Boarding Points (SOURCE)</label>

              {sourcePoints.map((point) => (
                <div key={point.index} className="point-row">
                  <input className="form-input" type="text" name="points"
                    placeholder="e.g. Erode Bus Stand" value={point.points} onChange={(e) => handlePointChange(point.index, e)}
                  />
                  <div className="point-actions">
                    <input className="form-input" type="time" name="arrivalTime"
                      value={point.arrivalTime} onChange={(e) => handlePointChange(point.index, e)}
                    />
                    <button type="button" className="btn-icon" onClick={() => removePoint(point.index)} title="Remove">
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn-secondary"
                onClick={() => addPoint('SOURCE')}
              >
                + Add Boarding Point
              </button>
            </div>

            <div className="point-section mt-16">
              <label className="form-label">Dropping Points (DESTINATION)</label>

              {destPoints.map((point) => (
                <div key={point.index} className="point-row">
                  <input className="form-input" type="text" name="points" placeholder="e.g. Salem Bus Stand"
                    value={point.points} onChange={(e) => handlePointChange(point.index, e)}
                  />
                  <div className="point-actions">
                    <input className="form-input" type="time" name="arrivalTime"
                      value={point.arrivalTime} onChange={(e) => handlePointChange(point.index, e)}
                    />
                    <button type="button" className="btn-icon" onClick={() => removePoint(point.index)} title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <button type="button" className="btn-secondary" onClick={() => addPoint('DESTINATION')}>
                + Add Dropping Point
              </button>
            </div>
          </div>
        </section>
      </div>
    </AddNewModal>
  )
}
