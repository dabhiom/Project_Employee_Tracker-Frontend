import { useEffect, useMemo, useState } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Collapse,
  Drawer,
  Fade,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import BusinessIcon from '@mui/icons-material/Business'
import PersonIcon from '@mui/icons-material/Person'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { keyframes } from '@mui/system'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon fontSize="small" /> },
  { to: '/employees', label: 'Employees', icon: <GroupRoundedIcon fontSize="small" /> },
  { to: '/projects', label: 'Projects', icon: <AssignmentRoundedIcon fontSize="small" /> },
  { to: '/resource', label: 'Resource', icon: <MenuBookRoundedIcon fontSize="small" /> },
  { to: '/leave', label: 'Leave', icon: <EventAvailableRoundedIcon fontSize="small" /> },
  { to: '/finance', label: 'Finance', icon: <AccountBalanceWalletRoundedIcon fontSize="small" /> },
  { to: '/designation-master', label: 'Designation Master', icon: <SettingsRoundedIcon fontSize="small" /> },
  { to: '/end-client-master', label: 'End Client Master', icon: <BusinessIcon fontSize="small" /> },
  { to: '/customer-master', label: 'Customer Master', icon: <PersonIcon fontSize="small" /> },
  { to: '/manager-master', label: 'Manager Master', icon: <SupervisorAccountIcon fontSize="small" /> },
]

const masterItems = [
  { to: '/master/designation', label: 'Designation Master', icon: <BadgeRoundedIcon fontSize="small" /> },
  { to: '/master/end-client', label: 'End-Client Master', icon: <ApartmentRoundedIcon fontSize="small" /> },
  { to: '/master/manager', label: 'Manager Master', icon: <GroupsRoundedIcon fontSize="small" /> },
  { to: '/master/customer', label: 'Customer Master', icon: <BusinessRoundedIcon fontSize="small" /> },
]

const floatBlob = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(14px) scale(1.04); }
`

const floatBlobAlt = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-12px) scale(1.06); }
`

const navSlide = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

function AppLayout({ userEmail, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopExpanded, setDesktopExpanded] = useState(false)
  const location = useLocation()
  const [masterOpen, setMasterOpen] = useState(location.pathname.startsWith('/master/'))
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const userInitial = useMemo(
    () => (userEmail || 'U').charAt(0).toUpperCase(),
    [userEmail],
  )

  useEffect(() => {
    if (location.pathname.startsWith('/master/')) {
      setMasterOpen(true)
    }
  }, [location.pathname])

  const navList = (isMobile = false, condensed = false) => (
    <List sx={{ py: 0.5, px: 0.5, display: 'flex', flexDirection: 'column', alignItems: condensed ? 'center' : 'stretch' }}>
      {navItems.map((item, index) => (
        <Tooltip key={item.to} title={condensed ? item.label : ''} placement="right">
          <ListItemButton
            component={NavLink}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={() => {
              if (isMobile) setMobileOpen(false)
            }}
            sx={{
              mb: 0.8,
              borderRadius: condensed ? '50%' : 2,
              color: 'text.secondary',
              justifyContent: condensed ? 'center' : 'flex-start',
              px: condensed ? 1.2 : 1.8,
              width: condensed ? 54 : '100%',
              height: condensed ? 54 : 46,
              minWidth: condensed ? 54 : undefined,
              minHeight: condensed ? 54 : 46,
              transition: 'all 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              animation: `${navSlide} 380ms ease-out both`,
              animationDelay: `${index * 70}ms`,
              '& .MuiListItemIcon-root': { minWidth: condensed ? 0 : 36, color: 'inherit' },
              '& .MuiListItemText-primary': {
                fontWeight: 600,
                letterSpacing: 0.1,
                opacity: condensed ? 0 : 1,
                width: condensed ? 0 : 'auto',
                transition: 'opacity 180ms ease',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              },
              '&.active': {
                color: '#fff',
                background: 'linear-gradient(120deg, #0f62fe 0%, #00a8e8 100%)',
                boxShadow: '0 10px 22px rgba(15, 98, 254, 0.35)',
                transform: 'scale(1.02)',
              },
              '&:hover': {
                bgcolor: 'rgba(15, 98, 254, 0.08)',
                transform: 'translateY(-2px)',
              },
              '&:active': { transform: 'scale(0.96)' },
              '&.active:hover': {
                background: 'linear-gradient(120deg, #0b53d6 0%, #0c8fcb 100%)',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </Tooltip>
      ))}

      <Tooltip title={condensed ? 'Master Menu' : ''} placement="right">
        <ListItemButton
          onClick={() => {
            if (condensed) {
              setDesktopExpanded(true)
              setMasterOpen(true)
              return
            }
            setMasterOpen((prev) => !prev)
          }}
          sx={{
            mb: 0.8,
            borderRadius: condensed ? '50%' : 2,
            color: location.pathname.startsWith('/master/') ? '#fff' : 'text.secondary',
            justifyContent: condensed ? 'center' : 'flex-start',
            px: condensed ? 1.2 : 1.8,
            width: condensed ? 54 : '100%',
            height: condensed ? 54 : 46,
            minWidth: condensed ? 54 : undefined,
            minHeight: condensed ? 54 : 46,
            transition: 'all 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            background: location.pathname.startsWith('/master/')
              ? 'linear-gradient(120deg, #0f62fe 0%, #00a8e8 100%)'
              : 'transparent',
            boxShadow: location.pathname.startsWith('/master/')
              ? '0 10px 22px rgba(15, 98, 254, 0.35)'
              : 'none',
            '& .MuiListItemIcon-root': { minWidth: condensed ? 0 : 36, color: 'inherit' },
            '& .MuiListItemText-primary': {
              fontWeight: 600,
              letterSpacing: 0.1,
              opacity: condensed ? 0 : 1,
              width: condensed ? 0 : 'auto',
              transition: 'opacity 180ms ease',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            },
            '&:hover': {
              bgcolor: location.pathname.startsWith('/master/')
                ? 'transparent'
                : 'rgba(15, 98, 254, 0.08)',
              transform: 'translateY(-2px)',
            },
            '&:active': { transform: 'scale(0.96)' },
          }}
        >
          <ListItemIcon>
            <AccountTreeRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Master Menu" />
          {!condensed && (masterOpen ? <ExpandLessRoundedIcon fontSize="small" /> : <ExpandMoreRoundedIcon fontSize="small" />)}
        </ListItemButton>
      </Tooltip>

      <Collapse in={masterOpen && !condensed} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ px: 0.25, pb: 0.8 }}>
          {masterItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              onClick={() => {
                if (isMobile) setMobileOpen(false)
              }}
              sx={{
                ml: 0.8,
                mb: 0.5,
                pl: 2,
                borderRadius: 2,
                color: 'text.secondary',
                '& .MuiListItemIcon-root': { minWidth: 32, color: 'inherit' },
                '& .MuiListItemText-primary': { fontSize: '0.9rem', fontWeight: 600 },
                '&.active': {
                  color: 'primary.dark',
                  bgcolor: 'rgba(15, 98, 254, 0.12)',
                },
                '&:hover': {
                  bgcolor: 'rgba(15, 98, 254, 0.08)',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </List>
  )

  const desktopSidebarWidth = desktopExpanded ? 292 : 86

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 8% 9%, rgba(14, 116, 255, 0.22), transparent 35%), radial-gradient(circle at 89% 6%, rgba(16, 185, 129, 0.16), transparent 30%), radial-gradient(circle at 62% 84%, rgba(56, 189, 248, 0.12), transparent 28%), linear-gradient(155deg, #f8fbff 0%, #edf3ff 52%, #e6efff 100%)',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: 76,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          filter: 'blur(8px)',
          bgcolor: 'rgba(0, 168, 232, 0.25)',
          animation: `${floatBlob} 7s ease-in-out infinite`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          bottom: 28,
          left: -26,
          width: 184,
          height: 184,
          borderRadius: '50%',
          filter: 'blur(10px)',
          bgcolor: 'rgba(14, 165, 233, 0.2)',
          animation: `${floatBlobAlt} 8s ease-in-out infinite`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          position: 'fixed',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(94deg, rgba(21, 41, 88, 0.98) 0%, rgba(12, 95, 196, 0.96) 42%, rgba(0, 168, 232, 0.95) 100%)',
          borderBottom: '1px solid rgba(167, 224, 255, 0.48)',
          boxShadow: '0 10px 28px rgba(8, 28, 66, 0.25)',
          backdropFilter: 'blur(8px)',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.14) 38%, rgba(255,255,255,0.03) 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 66, md: 74 }, px: { xs: 2, md: 3 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => {
                if (isDesktop) {
                  setDesktopExpanded((prev) => !prev)
                } else {
                  setMobileOpen(true)
                }
              }}
              sx={{ display: 'inline-flex' }}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              Employee Tracker
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.2} alignItems="center">
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontWeight: 700 }}>
              {userInitial}
            </Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'inline-flex' }, opacity: 0.95 }}>
              {userEmail || 'user@example.com'}
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutRoundedIcon />}
              onClick={onLogout}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 1.6,
                border: '1px solid rgba(255,255,255,0.25)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', pt: { xs: '76px', md: '86px' }, px: { xs: 1.5, md: 2.5 }, pb: 2, gap: 2 }}>
        <Box
          sx={{
            width: desktopSidebarWidth,
            display: { xs: 'none', md: 'block' },
            flexShrink: 0,
            alignSelf: 'flex-start',
            position: 'sticky',
            top: 96,
            transition: 'width 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 1.1,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(148, 163, 184, 0.4)',
              minHeight: 'calc(100vh - 108px)',
              background: 'linear-gradient(165deg, rgba(255,255,255,0.9) 0%, rgba(248,251,255,0.92) 44%, rgba(238,246,255,0.88) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 14px 38px rgba(15, 23, 42, 0.08)',
              overflow: 'hidden',
            }}
          >
            {navList(false, !desktopExpanded)}
          </Paper>
        </Box>

        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 286,
              p: 1.2,
              background: 'linear-gradient(180deg, #f8fbff 0%, #edf4ff 100%)',
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ px: 1, py: 1, fontWeight: 700 }}>
            TecnoPrism
          </Typography>
          {navList(true, false)}
        </Drawer>

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            zIndex: 1,
          }}
        >
          <Fade in key={location.pathname} timeout={320}>
            <Paper
              elevation={0}
              sx={{
                minHeight: { xs: 'calc(100vh - 118px)', md: 'calc(100vh - 108px)' },
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(148, 163, 184, 0.35)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(250,252,255,0.86) 100%)',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
              }}
            >
              <Outlet />
            </Paper>
          </Fade>
        </Box>
      </Box>
    </Box>
  )
}

export default AppLayout
