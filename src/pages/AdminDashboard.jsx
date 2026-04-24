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
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";

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

  const barChartData = [
   {name : "activeOperator", value : activeOperator},
   {name : "pendingOperator", value : pendingOperator}];

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
              <div className="page-head"><h1>Operators Stats</h1></div>
              <div style={{ width: "50%", height: 300, marginTop: "1rem" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div><hr></hr>
              <div><h3 style={{ fontWeight: "800", fontSize: "20px" }}>
                Pending Operators Approval</h3> <br></br>
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