import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './Components/AppLayout'
import ProtectedRoute from './Components/ProtectedRoute'
import DashboardPage from './Pages/DashboardPage'
import EmployeesPage from './Pages/EmployeesPage'
import FinancePage from './Pages/FinancePage'
import LeavePage from './Pages/LeavePage'
import LoginPage from './Pages/LoginPage'
import ProjectsPage from './Pages/ProjectsPage'
import { useMemo, useState } from 'react'
// import CursorBubble from './Components/CursorBubble'

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
      {/* <CursorBubble /> */}
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
            <Route path="/leave" element={<LeavePage />} />
            <Route path="/finance" element={<FinancePage />} />
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