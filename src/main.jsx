import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './styles/layout.css'
import './styles/login.css'
import './styles/dashboard.css'
import App from './App.jsx'

const theme = createTheme({
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: ['Plus Jakarta Sans', 'Manrope', 'Segoe UI', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#0f62fe',
    },
    secondary: {
      main: '#00a8e8',
    },
    background: {
      default: '#f4f8ff',
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
