import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { fetchPoints, fetchSeats } from "../features/trip/Slice/TripSlice";
import { lockSeats, releaseSeats } from "../features/booking/Slice/BookingSlice";
import { createOrder, verifyAndConfirm } from "../features/payment/slice/paymentSlice";

import Header from '../components/common/Header';
import '../styles/SelectSeats.css';


const STEPS = ["SELECT SEATS", "PASSENGER DETAILS", "PAYMENT"];

function fmtTime(t) {
  if (!t) return "—";
  const [h, m] = t.toString().split(":");
  const d = new Date();
  d.setHours(+h, +m);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function calcDuration(dep, arr) {
  if (!dep || !arr) return null;
  const [dh, dm] = dep.split(":").map(Number);
  const [ah, am] = arr.split(":").map(Number);
  let mins = (ah * 60 + am) - (dh * 60 + dm);
  if (mins < 0) mins += 1440;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function SeatGrid({ seats, selectedSeats, onToggle, loading }) {
  if (loading) {
    return (
      <div style={{ width: 240 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="ro-skel" style={{ height: 40, marginBottom: 8 }} />
        ))}
      </div>
    );
  }
  if (!seats.length) return <p style={{ color: "var(--muted)", padding: 24 }}>No seats found.</p>;

  const rows = [];
  for (let i = 0; i < seats.length; i += 3) {
    rows.push(seats.slice(i, i + 3));
  }

  return (
    <div className="ro-bus-shell">
      <div className="ro-bus-cabin">
        <span className="ro-driver-label">Driver</span>
      </div>
      <div className="ro-seats-grid">
        {rows.map((row, ri) => (
          <div key={ri} className="ro-seat-row">
            {row[0] && <SeatBtn seat={row[0]} selected={selectedSeats.includes(row[0].seatNo)} onToggle={onToggle} />}
            {row[1] && <SeatBtn seat={row[1]} selected={selectedSeats.includes(row[1].seatNo)} onToggle={onToggle} />}
            <div className="ro-aisle" />
            {row[2] && <SeatBtn seat={row[2]} selected={selectedSeats.includes(row[2].seatNo)} onToggle={onToggle} />}
            {!row[2] && <div />}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeatBtn({ seat, selected, onToggle }) {
  const booked = seat.availability !== "AVAILABLE";
  return (
    <button
      type="button"
      disabled={booked}
      onClick={() => !booked && onToggle(seat)}
      className={`ro-seat-btn ${booked ? "booked" : selected ? "selected" : "available"}`}
      title={`Seat ${seat.seatNo}${booked ? " (Booked)" : ""}`}
    >
      {seat.seatNo}
    </button>
  );
}

function LegendCard() {
  return (
    <div className="ro-legend-card">
      <div className="ro-legend-title">Seat Legend</div>
      {[
        { cls: "available", label: "Available" },
        { cls: "selected",  label: "Selected" },
        { cls: "booked", label: "Booked" },
      ].map(({ cls, label }) => (
        <div key={cls} className="ro-legend-row">
          <div className={`ro-legend-dot ${cls}`} /> {label}
        </div>
      ))}
    </div>
  );
}

function PassengerForm({ index, data, onChange, errors }) {
  return (
    <div className="ro-pax-card">
      <div className="ro-pax-header">
        <div className="ro-pax-avatar">P{index + 1}</div>
        <span className="ro-pax-title">Passenger {index + 1}</span>
        <span className="ro-pax-seat">Seat {data.seatNo}</span>
      </div>
      <div className="ro-fields">
        <div className="ro-field-group ro-field-group full">
          <label className="ro-field-label">Full Name *</label>
          <input
            className={`ro-field-input${errors?.name ? " err" : ""}`}
            placeholder="e.g. Rahul Kumar"
            value={data.passengerName}
            onChange={(e) => onChange(index, "passengerName", e.target.value)}
          />
        </div>
        <div className="ro-field-group">
          <label className="ro-field-label">Age *</label>
          <input
            className={`ro-field-input${errors?.age ? " err" : ""}`}
            type="number" min="1" max="120" placeholder="25"
            value={data.age}
            onChange={(e) => onChange(index, "age", e.target.value)}
          />
        </div>
        <div className="ro-field-group">
          <label className="ro-field-label">Gender *</label>
          <select
            className={`ro-field-select${errors?.gender ? " err" : ""}`}
            value={data.gender}
            onChange={(e) => onChange(index, "gender", e.target.value)}
          >
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function FareSummary({ selectedSeats, pendingBooking }) {
  const baseFare = pendingBooking?.baseFare ?? 0;
  const convFee = pendingBooking?.convenienceFee ?? (selectedSeats.length > 0 ? 35 : 0);
  const totalFare = pendingBooking?.totalFare ?? baseFare + convFee;

  return (
    <div className="ro-fare-card">
      <div className="ro-fare-title">Fare Summary</div>
      {selectedSeats.length > 0 && (
        <div className="ro-chips" style={{ marginBottom: 14 }}>
          {selectedSeats.map((s) => <span key={s} className="ro-chip">{s}</span>)}
        </div>
      )}
      <div className="ro-fare-row">
        <span className="ro-fare-label">Base Fare × {selectedSeats.length || "—"}</span>
        <span className="ro-fare-val">{selectedSeats.length ? `₹${baseFare.toFixed(2)}` : "—"}</span>
      </div>
      <div className="ro-fare-row">
        <span className="ro-fare-label">Convenience Fee</span>
        <span className="ro-fare-val">{selectedSeats.length ? `₹${convFee.toFixed(2)}` : "—"}</span>
      </div>
      <div className="ro-fare-divider" />
      <div className="ro-fare-row">
        <span className="ro-fare-total-label">Total</span>
        <span className="ro-fare-total-val">{selectedSeats.length ? `₹${totalFare.toFixed(2)}` : "—"}</span>
      </div>
    </div>
  );
}

function BookingSuccess({ booking, onGoHome, onNewBooking }) {
  if (!booking) {
    return (
      <div className="ro-success-page">
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--muted)" }}>
          <p style={{ fontSize: 16, marginBottom: 16 }}>No booking data found.</p>
          <button className="ro-success-btn-primary" style={{ maxWidth: 200, margin: "0 auto" }} onClick={onGoHome}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ro-success-page">
      <div className="ro-success-hero">
        <div className="ro-success-icon">✓</div>
        <h1 className="ro-success-title">Booking Confirmed!</h1>
        <p className="ro-success-ref">Ref: {booking.bookingRef}</p>
      </div>

      <div className="ro-success-body">
        <div className="ro-success-card">
          <div className="ro-success-card-title">Journey Details</div>
          <div className="ro-success-grid">
            {[
              ["From", booking.source],
              ["To", booking.destination],
              ["Travel Date", fmtDate(booking.travelDate)],
              ["Departure", fmtTime(booking.departureTime)],
              ["Pickup", booking.pickupPoint],
              ["Drop", booking.dropPoint],
            ].map(([label, val]) => (
              <div key={label} className="ro-detail-item">
                <span className="ro-detail-label">{label}</span>
                <span className="ro-detail-val">{val || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ro-success-card">
          <div className="ro-success-card-title">Bus Details</div>
          <div className="ro-success-grid">
            {[
              ["Bus Name", booking.busName],
              ["Bus Number", booking.busNumber],
              ["Bus Type", booking.busType],
              ["Seats", booking.seatNumbers?.join(", ")],
            ].map(([label, val]) => (
              <div key={label} className="ro-detail-item">
                <span className="ro-detail-label">{label}</span>
                <span className="ro-detail-val">{val || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {booking.passengers?.length > 0 && (
          <div className="ro-success-card">
            <div className="ro-success-card-title">Passengers</div>
            {booking.passengers.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0",
                  borderBottom: i < booking.passengers.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div className="ro-pax-avatar-sm">{p.passengerName?.charAt(0)?.toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{p.passengerName}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {p.gender} · Age {p.age} · Seat {p.seatNo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="ro-success-card">
          <div className="ro-success-card-title">Payment</div>
          <div className="ro-success-grid">
            {[
              ["Amount Paid", `₹${booking.totalFare?.toFixed(2)}`],
              ["Method", booking.paymentMethod || "RAZORPAY"],
              ["Status", booking.paymentStatus || "SUCCESS"],
              ["Payment ID", booking.razorpayPaymentId || "—"],
            ].map(([label, val]) => (
              <div key={label} className="ro-detail-item">
                <span className="ro-detail-label">{label}</span>
                <span className="ro-detail-val">{val || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ro-success-actions">
          <button className="ro-success-btn-primary" onClick={() => window.location.href = "/booking"}>
            View My Bookings
          </button>
          <button className="ro-success-btn-secondary" onClick={onNewBooking}>
            Book Another
          </button>
        </div>
      </div>
    </div>
  );
}


export default function SelectSeats() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tripId } = useParams();

  const points = useSelector((s) => s.trip.points);
  const seats = useSelector((s) => s.trip.seats);
  const seatsLoading = useSelector((s) => s.trip.seatsLoading);
  const error = useSelector((s) => s.trip.error);
  const loading = useSelector((s) => s.trip.loading);
  const paymentLoading = useSelector((s) => s.payment.loading);
  const bookingLoading = useSelector((s) => s.booking.loading);

  const pendingBooking = useSelector((s) => s.booking.pendingBooking);
  const bookingError = useSelector((s) => s.booking.error);

  const confirmedBooking = useSelector((s) => s.payment.confirmedBooking);
  const paymentError  = useSelector((s) => s.payment.error);

  const [step,setStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pickupPoint, setPickupPoint] = useState("");
  const [dropPoint, setDropPoint] = useState("");
  const [passengers, setPassengers] = useState([]);
  const [paxErrors, setPaxErrors] = useState([]);
  const [offerCode, setOfferCode] = useState("");
  const [localError,setLocalError] = useState(null);
  const [showSuccess,setShowSuccess] = useState(false);

  const localData = JSON.parse(localStorage.getItem("selectedTrip"));
  const duration  = calcDuration(localData?.departureTime, localData?.arrivalTime);

  useEffect(() => {
    if (tripId) {
      dispatch(fetchSeats(tripId));
      dispatch(fetchPoints(tripId));
    }
  }, [dispatch, tripId]);

  useEffect(() => {
    if (confirmedBooking) {
      setShowSuccess(true);
    }
  }, [confirmedBooking]);

  const toggleSeat = useCallback((seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seatNo === seat.seatNo);
      return exists ? prev.filter((s) => s.seatNo !== seat.seatNo) : [...prev, seat];
    });
  }, []);

  const handleProceed = async () => {
    if (!selectedSeats.length) { setLocalError("Please select at least one seat."); return; }
    if (!pickupPoint)          { setLocalError("Please select a pickup point.");     return; }
    if (!dropPoint)            { setLocalError("Please select a drop point.");       return; }
    setLocalError(null);

    const payload = {
      tripId:      Number(tripId),
      seatIds:     selectedSeats.map((s) => s.tripSeatId),
      pickupPoint,
      dropPoint,
      ...(offerCode ? { offerCode } : {}),
    };

    const result = await dispatch(lockSeats(payload));

    if (lockSeats.fulfilled.match(result)) {
      setPassengers(selectedSeats.map((s) => ({
        seatNo: s.seatNo, passengerName: "", age: "", gender: "",
      })));
      setPaxErrors(selectedSeats.map(() => ({})));
      setStep(1);
    }
  };

  const handlePassengerProceed = () => {
    const errors = passengers.map((p) => ({
      name:   !p.passengerName.trim(),
      age:    !p.age || +p.age < 1 || +p.age > 120,
      gender: !p.gender,
    }));
    setPaxErrors(errors);
    if (errors.some((e) => e.name || e.age || e.gender)) {
      setLocalError("Please fill in all passenger details correctly.");
      return;
    }
    setLocalError(null);
    setStep(2);
  };

  const handlePay = async () => {
    setLocalError(null);

    const total = pendingBooking?.totalFare;
    if (!total) {
      setLocalError("Could not determine fare. Please go back and try again.");
      return;
    }

    const orderResult = await dispatch(createOrder(total));
    if (!createOrder.fulfilled.match(orderResult)) return;

    const order = orderResult.payload; 

    const paymentResult = await openRazorpay(order);
    if (!paymentResult) {
      dispatch(releaseSeats(pendingBooking.seatIds));
      setLocalError("Payment cancelled. Your seats have been released.");
      return;
    }
    const verifyPayload = {
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: paymentResult.razorpay_payment_id,
      razorpaySignature: paymentResult.razorpay_signature,
      paymentMethod: "RAZORPAY",
      seatIds: pendingBooking.seatIds,
      pickupPoint: pendingBooking.pickupPoint,
      dropPoint: pendingBooking.dropPoint,
      totalFare: pendingBooking.totalFare,
      passengers: passengers.map((p) => ({
        passengerName: p.passengerName,
        age: parseInt(p.age),
        gender: p.gender,
        seatNo: p.seatNo,
      })),
    };

    const verifyResult = await dispatch(verifyAndConfirm(verifyPayload));
    if (!verifyAndConfirm.fulfilled.match(verifyResult)) {
      dispatch(releaseSeats(pendingBooking.seatIds));
    }
  };

  const openRazorpay = (order) =>
    new Promise((resolve) => {
      if (!window.Razorpay) {
        setLocalError("Razorpay SDK not loaded. Please refresh the page.");
        resolve(null);
        return;
      }
      const options = {
        key: order.keyId,
        amount: order.amount * 100,
        currency: order.currency || "INR",
        name: "RideOn",
        description: "RideOn Bus Ticket",
        order_id: order.razorpayOrderId,
        handler: (response) => resolve(response),
        modal: { ondismiss: () => resolve(null) },
        prefill: { name: passengers[0]?.passengerName || "" },
        theme: { color: "#2563EB" },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => resolve(null));
      rzp.open();
    });

  const handleBack = () => {
    setLocalError(null);
    if (step > 0) setStep(step - 1);
  };

  if (showSuccess) {
    return (
      <BookingSuccess
        booking={confirmedBooking}
        onGoHome={() => navigate("/home")}
        onNewBooking={() => navigate("/search")}
      />
    );
  }

  return (
    <div className="ss-page" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Header />

      {localData && (
        <div className="ro-top-nav">
          <button className="ro-back-btn" onClick={() => navigate(-1)} title="Go back">←</button>
          <div>
            <div className="ro-route-h3">{localData.source} → {localData.destination}</div>
            <div className="ro-route-sub">
              {localData.departureDate} · {fmtTime(localData.departureTime)} → {fmtTime(localData.arrivalTime)}
            </div>
          </div>
          {duration && <div className="ro-route-badge">{duration}</div>}
        </div>
      )}

      <div className="ro-stepper">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`ro-step${step === i ? " active" : ""}${step > i ? " done clickable" : ""}`}
            onClick={() => step > i && setStep(i)}
          >
            {step > i ? "✓ " : ""}{s}
          </div>
        ))}
      </div>

      <div className="ro-content">
        {(error || bookingError || paymentError || localError) && (
          <div className="ro-error-banner">
            ⚠ {localError || bookingError || paymentError || error}
          </div>
        )}

        {/* ── STEP 0: SELECT SEATS ── */}
        {step === 0 && (
          <>
            <div className="ro-section-title">Select Your Seats</div>
            <div className="ro-two-col">
              <div className="ro-left">
                <SeatGrid
                  seats={seats}
                  selectedSeats={selectedSeats.map((s) => s.seatNo)}
                  onToggle={toggleSeat}
                  loading={seatsLoading}
                />
              </div>
              <div className="ro-right">
                <LegendCard />

                <div>
                  <div className="ro-section-title" style={{ marginBottom: 12 }}>
                    Boarding & Dropping Points
                  </div>
                  <div className="ro-pdp-row">
                    <div className="ro-pdp-card">
                      <div className="ro-pdp-title">Boarding Points</div>
                      {points?.filter(p => p.pointType === "SOURCE").map((p) => (
                        <label
                          key={p.pickDropId}
                          className={`ro-pdp-item ${pickupPoint === p.points ? "active" : ""}`}
                        >
                          <input
                            type="radio"
                            name="pickup"
                            value={p.points}
                            checked={pickupPoint === p.points}
                            onChange={() => setPickupPoint(p.points)}
                          />
                          <span className="ro-pdp-text">
                            {p.points}
                            {p.arrivalTime && (
                              <span className="ro-pdp-time"> · {fmtTime(p.arrivalTime)}</span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="ro-pdp-card">
                      <div className="ro-pdp-title">Dropping Points</div>
                      {points?.filter(p => p.pointType === "DESTINATION").map((p) => (
                        <label
                          key={p.pickDropId}
                          className={`ro-pdp-item ${dropPoint === p.points ? "active" : ""}`}
                        >
                          <input
                            type="radio"
                            name="drop"
                            value={p.points}
                            checked={dropPoint === p.points}
                            onChange={() => setDropPoint(p.points)}
                          />
                          <span className="ro-pdp-text">{p.points}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 1: PASSENGER DETAILS ── */}
        {step === 1 && (
          <>
            <div className="ro-section-title">Passenger Details</div>
            <div className="ro-two-col">
              <div style={{ flex: 1 }}>
                {passengers.map((p, i) => (
                  <PassengerForm
                    key={i}
                    index={i}
                    data={p}
                    errors={paxErrors[i]}
                    onChange={(idx, field, val) => {
                      const updated = [...passengers];
                      updated[idx][field] = val;
                      setPassengers(updated);
                      const errs = [...paxErrors];
                      if (errs[idx]) {
                        errs[idx][field === "passengerName" ? "name" : field] = false;
                      }
                      setPaxErrors(errs);
                    }}
                  />
                ))}
              </div>
              <div className="ro-right" style={{ maxWidth: 340 }}>
                <div className="ro-summary-box">
                  <div className="ro-summary-title">Booking Summary</div>
                  <div className="ro-summary-row"><strong>Selected Seats</strong></div>
                  <div className="ro-chips" style={{ marginBottom: 12 }}>
                    {selectedSeats.map((s) => (
                      <span key={s.seatNo} className="ro-chip">{s.seatNo}</span>
                    ))}
                  </div>
                  <hr className="ro-summary-divider" />
                  <div className="ro-summary-row">
                    <strong>Pickup Point</strong><span>{pickupPoint}</span>
                  </div>
                  <div className="ro-summary-row">
                    <strong>Drop Point</strong><span>{dropPoint}</span>
                  </div>
                  <hr className="ro-summary-divider" />
                  <div className="ro-summary-row">
                    <strong>Total Seats</strong><span>{selectedSeats.length}</span>
                  </div>
                </div>
                <FareSummary
                  selectedSeats={selectedSeats.map((s) => s.seatNo)}
                  pendingBooking={pendingBooking}
                />
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2: REVIEW & PAY ── */}
        {step === 2 && (
          <>
            <div className="ro-section-title">Review & Pay</div>
            <div className="ro-two-col">
              <div style={{ flex: 1 }}>
                <div className="ro-pax-card">
                  <div className="ro-summary-title">Passenger Details</div>
                  <hr className="ro-summary-divider" />
                  {passengers.map((p, i) => (
                    <div key={i} className="ro-review-pax-item">
                      <div className="ro-review-seat">Seat {p.seatNo}</div>
                      <div className="ro-review-name">{p.passengerName}</div>
                      <div className="ro-review-meta">Age {p.age} · {p.gender}</div>
                    </div>
                  ))}
                </div>

                <div className="ro-pax-card" style={{ marginTop: 14 }}>
                  <div className="ro-summary-title">Journey Details</div>
                  <hr className="ro-summary-divider" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      ["From",      localData?.source],
                      ["To",        localData?.destination],
                      ["Date",      localData?.departureDate],
                      ["Departure", fmtTime(localData?.departureTime)],
                      ["Pickup",    pickupPoint],
                      ["Drop",      dropPoint],
                      ["Bus",       localData?.busName],
                      ["Type",      localData?.busType],
                    ].map(([label, val]) => (
                      <div key={label} className="ro-detail-item">
                        <span className="ro-detail-label">{label}</span>
                        <span className="ro-detail-val">{val || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ro-right" style={{ maxWidth: 340 }}>
                <FareSummary
                  selectedSeats={selectedSeats.map((s) => s.seatNo)}
                  pendingBooking={pendingBooking}
                />

                <div className="ro-fare-card">
                  <div className="ro-fare-title">Payment Gateway</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
                    <div style={{ fontSize: 28 }}>💳</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
                        Razorpay Secured Payment
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        UPI, Cards, Net Banking, Wallets
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: 12, color: "var(--muted)", marginTop: 8,
                    padding: "8px 12px", background: "var(--bg)", borderRadius: 8,
                  }}>
                    Your payment is secured by 256-bit SSL encryption
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="ro-bottom-bar">
        <div className="ro-bottom-info">
          {step === 0 && (
            <>
              {selectedSeats.length} Seat{selectedSeats.length !== 1 ? "s" : ""} Selected
              {selectedSeats.length > 0 && (
                <small>₹{((localData?.fare ?? 0) * selectedSeats.length + 35).toFixed(0)} estimated total</small>
              )}
            </>
          )}
          {step === 1 && (
            <>
              {passengers.length} Passenger{passengers.length !== 1 ? "s" : ""}
              <small>Complete all details to proceed</small>
            </>
          )}
          {step === 2 && (
            <>
              Total: ₹{pendingBooking?.totalFare?.toFixed(2) ?? "—"}
              <small>Tap Pay Now to complete booking</small>
            </>
          )}
        </div>

        <div className="ro-btn-row">
          {step > 0 && (
            <button className="ro-btn secondary" onClick={handleBack} disabled={loading}>
              ← Back
            </button>
          )}
          {step === 0 && (
            <button
              className={`ro-btn primary${bookingLoading ? " loading" : ""}`}
              onClick={handleProceed}
              disabled={!selectedSeats.length || !pickupPoint || !dropPoint || bookingLoading}
            >
              {bookingLoading ? "Locking Seats…" : "Continue →"}
            </button>
          )}
          {step === 1 && (
            <button
              className={`ro-btn primary${bookingLoading ? " loading" : ""}`}
              onClick={handlePassengerProceed}
              disabled={bookingLoading}
            >
              Continue to Payment →
            </button>
          )}
          {step === 2 && (
            <button
              className={`ro-btn primary${paymentLoading ? " loading" : ""}`}
              onClick={handlePay}
              disabled={paymentLoading}
            >
              {paymentLoading ? "Processing…" : `Pay ₹${pendingBooking?.totalFare?.toFixed(0) ?? "—"}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}