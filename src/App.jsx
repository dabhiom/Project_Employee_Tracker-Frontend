import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './Components/AppLayout'
import ProtectedRoute from './Components/ProtectedRoute'
import DashboardPage from './Pages/DashboardPage'
import EmployeesPage from './Pages/EmployeesPage'
import FinancePage from './Pages/FinancePage'
import LeavePage from './Pages/LeavePage'
import LoginPage from './Pages/LoginPage'
import ProjectsPage from './Pages/ProjectsPage'
import ResourcePage from './Pages/ResourcePage'
import DesignationMasterPage from './MasterPage/DesignationMasterPage'
import EndClientMasterPage from './MasterPage/EndClientMasterPage'
import ManagerMasterPage from './MasterPage/ManagerMasterPage'
import CustomerMasterPage from './MasterPage/CustomerMasterPage'
import { useMemo, useState } from 'react'

const AUTH_STORAGE_KEY = 'employeeTrackerAuth'

function getStoredAuthState() {
  const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!savedAuth) {
    return { isAuthenticated: false, user: null }
  }

  try {
    return JSON.parse(savedAuth)
  } catch {
    return { isAuthenticated: false, user: null }
  }
}

function App() {
  const initialAuth = useMemo(() => getStoredAuthState(), [])
  const [authState, setAuthState] = useState(initialAuth)

  const handleLoginSuccess = (user) => {
    const nextAuthState = {
      isAuthenticated: true,
      user,
    }
    setAuthState(nextAuthState)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuthState))
  }

  const handleLogout = () => {
    setAuthState({ isAuthenticated: false, user: null })
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
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

        <Route element={<ProtectedRoute isAuthenticated={authState.isAuthenticated} />}>
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
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/master/designation" element={<DesignationMasterPage />} />
            <Route path="/master/end-client" element={<EndClientMasterPage />} />
            <Route path="/master/manager" element={<ManagerMasterPage />} />
            <Route path="/master/customer" element={<CustomerMasterPage />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={authState.isAuthenticated ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App