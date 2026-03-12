import { AppBar, Avatar, Box, Button, Paper, Stack, Toolbar, Typography } from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import BusinessIcon from '@mui/icons-material/Business'
import PersonIcon from '@mui/icons-material/Person'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon fontSize="small" /> },
  { to: '/employees', label: 'Employees', icon: <GroupRoundedIcon fontSize="small" /> },
  { to: '/projects', label: 'Projects', icon: <AssignmentRoundedIcon fontSize="small" /> },
  { to: '/leave', label: 'Leave', icon: <EventAvailableRoundedIcon fontSize="small" /> },
  { to: '/finance', label: 'Finance', icon: <AccountBalanceWalletRoundedIcon fontSize="small" /> },
  { to: '/designation-master', label: 'Designation Master', icon: <SettingsRoundedIcon fontSize="small" /> },
  { to: '/end-client-master', label: 'End Client Master', icon: <BusinessIcon fontSize="small" /> },
  { to: '/customer-master', label: 'Customer Master', icon: <PersonIcon fontSize="small" /> },
  { to: '/manager-master', label: 'Manager Master', icon: <SupervisorAccountIcon fontSize="small" /> },
]

function AppLayout({ userEmail, onLogout }) {
  return (
    <div className="tracker-shell">
      <AppBar position="fixed" elevation={0} className="tracker-topbar">
        <Toolbar className="tracker-toolbar">
          <Typography variant="h6" className="tracker-brand">
            Employee Tracker
          </Typography>

          <Stack direction="row" spacing={1.2} alignItems="center" className="tracker-actions">
            <Avatar className="tracker-avatar">{(userEmail || 'U').charAt(0).toUpperCase()}</Avatar>
            <Typography variant="body2" className="tracker-email d-none d-md-inline">
              {userEmail || 'user@example.com'}
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutRoundedIcon className="tracker-logout-icon" />}
              onClick={onLogout}
              className="tracker-logout-btn"
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <div className="container-fluid">
        <div className="row">
          <aside className="col-12 col-md-3 col-lg-2 px-0 tracker-sidebar-wrap">
            <Paper className="tracker-sidebar" square>
              <nav className="tracker-nav">
                {navItems.map((item, index) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `tracker-nav-link ${isActive ? 'tracker-nav-link-active' : ''}`
                    }
                    style={{ animationDelay: `${index * 85}ms` }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </Paper>
          </aside>

          <main className="col-12 col-md-9 col-lg-10 tracker-main">
            <Box className="tracker-content">
              <Outlet />
            </Box>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
