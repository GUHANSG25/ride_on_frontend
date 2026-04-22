import { useState } from "react";
import Sidebar from '../components/common/SideBar';
import '../styles/SideBar.css';
import ViewOnlyRouteList from "../features/route/components/ViewOnlyRouteList";
import BusList from "../features/Bus/components/BusList";
import UpdateBus from "../features/Bus/components/UpdateBus";
import TripList from "../features/trip/components/TripList"
import StatsGrid from "../components/common/StatsGrid";
import RecentTrips from "../features/trip/components/RecentTrip";
import AddTrip from "../features/trip/components/AddTrip";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchBuses } from "../features/Bus/Slice/BusSlice";
import { fetchTrip } from "../features/trip/Slice/TripSlice";
import TopBar from "../components/common/TopBar";

const titles = {
  dashboard: "Operator Dashboard",
  buses: "Manage Buses",
  availability: "Bus Availability",
  routes: "View Routes",
  schedule: "Schedule Trip",
  trips: "Assigned Trips",
  bookings: "View Bookings"
};

const operatorNavItems = [
  { label: "Overview", type: "section" },
  { label: "Operator Dashboard", key: "dashboard" },
  { label: "Fleet", type: "section" },
  { label: "Manage Buses", key: "buses" },
  { label: "Bus Availability", key: "availability" },
  { label: "Trips", type: "section" },
  { label: "View Routes", key: "routes" },
  { label: "Schedule Trip", key: "schedule" },
  { label: "Assigned Trips", key: "trips" },
  { label: "Bookings", type: "section" },
  { label: "View Bookings", key: "bookings" },
];


export default function OperatorDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const [showModal, setShowModal] = useState(false);

  const {list : buses} = useSelector((state) => state.bus);
  const {list : trips} = useSelector((state) => state.trip);

  const dispatch = useDispatch();

  const totalBuses = buses?.length ?? 0;
  const availableBuses = buses?.filter(b => b.busStatus === "Active")?.length ?? 0;
  const tripsScheduled = trips?.length ?? 0;

  const stats = [
    { label: "Total Buses", value: totalBuses, sub: "In your fleet", type: "pos" },
    { label: "Available Buses", value: availableBuses, sub: "Ready to assign", type: "pos" },
    { label: "Trips Scheduled", value: tripsScheduled, sub: "This week", type: "neu" },
  ];

  useEffect(() => {
    dispatch(fetchBuses());
    dispatch(fetchTrip());
  }, [dispatch]);

  return (
    <div>
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} navItems={operatorNavItems} />

      <main className="main">

       <TopBar activeSection={activeSection}/>

        {/* Content */}
        <div className="content">
          <div className={`section ${activeSection === "dashboard" ? "active" : ""}`}>
            <>
            <div className="page-head"><h1>Operator Dashboard</h1><p>Overview of your system</p></div>
            <div className="gap-2">
            <StatsGrid stats={stats}/>
              <div><h3 style={{ fontWeight: "800", fontSize: "20px" }}>
                Your Buses</h3> <hr></hr>
                  <BusList/><hr></hr>
                  <RecentTrips />              
              </div>
            </div>
            </>
          </div>
          <div className={`section ${activeSection === "buses" ? "active" : ""}`}>
            <div className="page-head">
              <h1>Manage Buses</h1>
              <p>Add, edit or remove buses</p>
              <BusList/>
              </div>
          </div>
          <div className={`section ${activeSection === "availability" ? "active" : ""}`}>
            <div className="page-head">
              <h1>Bus Availability</h1>
              <p>View the availability of buses</p>
              <UpdateBus/>
              </div>
          </div>
          <div className={`section ${activeSection === "routes" ? "active" : ""}`}>
            <div className="page-head">
              <h1>View Routes</h1>
              <p>View all the routes</p>
              <ViewOnlyRouteList />
              </div>
          </div>
          <div className={`section ${activeSection === "schedule" ? "active" : ""}`}>
            <div className="page-head d-flex justify-content-between align-items-center">
              <div>
                <h1>Schedule Trip</h1>
                <p>Schedule the trips</p>
              </div>
              <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                + Add New Schedule
              </button>
            </div>
            <AddTrip show={showModal} onClose={() => setShowModal(false)} />
            <RecentTrips />
          </div>
          <div className={`section ${activeSection === "trips" ? "active" : ""}`}>
            <div className="page-head">
              <h1>Assigned Trips</h1>
              <p>View The Assigned trips</p>
              <TripList/>
            </div>
          </div>
          <div className={`section ${activeSection === "bookings" ? "active" : ""}`}>
            <div className="page-head"><h1>View Bookings</h1><p>View The Bookings done by customer</p></div>
          </div>
        </div>

      </main>

    </div>
  );
}