import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./Components/AppLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import { ToastProvider } from "./Components/ToastProvider";
import DashboardPage from "./Pages/DashboardPage";
import EmployeesPage from "./Pages/EmployeesPage";
import FinancePage from "./Pages/FinancePage";
import BotWarehousePage from "./Pages/BotWarehousePage";
import LeavePage from "./Pages/LeavePage";
import LoginPage from "./Pages/LoginPage";
import ProjectsPage from "./Pages/ProjectsPage";
import DesignationMaster from "./masters/DesignationMaster";
import EndClientMaster from "./masters/EndClientMaster";
import CustomerMaster from "./masters/CustomerMaster";
import ManagerMaster from "./masters/ManagerMaster";
import ResourcePage from "./Pages/ResourcePage";
import ApplyLeave from "./Pages/LeaveComponents/ApplyLeave";
import MyLeaves from "./Pages/LeaveComponents/MyLeaves";
import LeaveDashboard from "./Pages/LeaveComponents/LeaveDashboard";
import TimesheetEntry from "./Pages/LeaveComponents/TimesheetEntry";
import TimesheetHistory from "./Pages/LeaveComponents/TimesheetHistory";
import LeaveSettings from "./Pages/LeaveComponents/Settings";
import { LeaveProvider } from "./Context/LeaveContext";
import { useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "employeeTrackerAuth";

function getStoredAuthState() {
  const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!savedAuth) {
    return { isAuthenticated: false, user: null };
  }

  try {
    return JSON.parse(savedAuth);
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

function App() {
  const initialAuth = useMemo(() => getStoredAuthState(), []);
  const [authState, setAuthState] = useState(initialAuth);

  const handleLoginSuccess = (user) => {
    const nextAuthState = {
      isAuthenticated: true,
      user,
    };
    setAuthState(nextAuthState);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuthState));
  };

  const handleLogout = () => {
    setAuthState({ isAuthenticated: false, user: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <ToastProvider>
    <LeaveProvider currentUser={authState.user}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              authState.isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          <Route
            element={
              <ProtectedRoute isAuthenticated={authState.isAuthenticated} />
            }
          >
            <Route
              element={
                <AppLayout
                  userEmail={authState?.user?.email}
                  onLogout={handleLogout}
                />
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/resource" element={<ResourcePage />} />
              <Route path="/leave" element={<LeavePage />} />
              <Route path="/leave/apply" element={<ApplyLeave />} />
              <Route path="/leave/my-leaves" element={<MyLeaves />} />
              <Route path="/leave/dashboard" element={<LeaveDashboard />} />
              <Route path="/leave/timesheet" element={<TimesheetEntry />} />
              <Route path="/leave/timesheet-history" element={<TimesheetHistory />} />
              <Route path="/leave/settings" element={<LeaveSettings />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/bot-warehouse" element={<BotWarehousePage />} />
              <Route
                path="/master/designation"
                element={<DesignationMaster />}
              />
              <Route path="/master/end-client" element={<EndClientMaster />} />
              <Route path="/master/customer" element={<CustomerMaster />} />
              <Route path="/master/manager" element={<ManagerMaster />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to={authState.isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
      </LeaveProvider>
    </ToastProvider>
  );
}

export default App;
