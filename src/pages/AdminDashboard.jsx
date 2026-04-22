import { useState,useEffect } from "react";
import Sidebar from '../components/common/SideBar';
import RouteList from '../features/route/components/RouteList';
import '../styles/SideBar.css';
import OperatorList from "../features/operator/components/OperatorList";
import PendingOperators from "../features/operator/components/PendingOperators";
import TopBar from "../components/common/TopBar";
import StatsGrid from "../components/common/StatsGrid";
import { fetchOperators } from "../features/operator/slice/OperatorSlice";
import { fetchRoute } from "../features/route/slice/RouteSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchPendingOperators } from "../features/operator/slice/OperatorSlice";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const titles = {
    dashboard: "Admin Dashboard",
    routes: "Manage Routes",
    operators: "Manage Operators",
    feedback: "Customer Feedback",
    reports: "Revenue Reports",
    cancellations: "Cancellations",
  };

  const adminNavItems = [
    { label: "Overview", type: "section" },
    { label: "Admin Dashboard", key: "dashboard" },
    { label: "Operations", type: "section" },
    { label: "Manage Routes", key: "routes" },
    { label: "Manage Operators", key: "operators" },
    { label: "Insights", type: "section" },
    { label: "Customer Feedback", key: "feedback" },
    { label: "Revenue Reports", key: "reports" },
    { label: "Cancellations", key: "cancellations" },
  ];

  const {list : routes} = useSelector((state) => state.route);
  const {list : operators} = useSelector((state) => state.operator);
  const {pendinglist : pending } = useSelector((state) => state.operator);

  const dispatch = useDispatch();

  const totalRoutes = routes?.length ?? 0;
  const activeOperator = operators?.filter(o => o.userStatus === "Active")?.length ?? 0;
  const pendingOperator = pending?.length ?? 0;

  const stats = [
    { label: "Total Routes", value: totalRoutes, sub: "In your fleet", type: "pos" },
    { label: "Active Operators", value: activeOperator, sub: "Ready to assign", type: "pos" },
    { label: "Pending Operators", value: pendingOperator, sub: "In your fleet", type: "neu" },
  ];

  useEffect(() => {
    dispatch(fetchRoute());
    dispatch(fetchOperators());
    dispatch(fetchPendingOperators());
  }, [dispatch]);

  return (
    <div>
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} navItems={adminNavItems} /> 
      <main className="main">
        <TopBar activeSection={activeSection}/>

        <div className="content">
          {activeSection === "dashboard" && (
            <>
            <div className="page-head"><h1>Admin Dashboard</h1><p>Overview of your system</p></div>
            <div className="gap-2">
              <StatsGrid stats={stats}/>
              <div><h3 style={{ fontWeight: "800", fontSize: "20px" }}>
                Pending Operators Approval</h3> <hr></hr>
              <PendingOperators/>
              </div>
            </div>
            </>  
          )}
          {activeSection === "routes" && (
            <>
            <div className="page-head"><h1>Route Management</h1><p>Add new routes and manage your existing bus network.</p></div>
            <RouteList />
            </>
            
          )}
          {activeSection === "operators" && (
            <>
            <div className="page-head"><h1>Operator Management</h1><p>Approve new operators and manage your fleet operators.</p></div>
            <PendingOperators/><hr></hr>
            <OperatorList />
            </>
           
          )}
          {activeSection === "feedback" && (
            <div className="page-head"><h1>Customer Feedback</h1><p>Review customer feedback</p></div>
          )}
          {activeSection === "reports" && (
            <div className="page-head"><h1>Revenue Reports</h1><p>Track revenue and analytics</p></div>
          )}
          {activeSection === "cancellations" && (
            <div className="page-head"><h1>Cancellations</h1><p>Monitor cancellation trends</p>
            <p>under development</p></div>
          )}
        </div>
      </main>
      
    </div>
  );
}