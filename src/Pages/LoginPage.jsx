// src/Pages/LoginPage.jsx
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import MailOutlineRoundedIcon    from '@mui/icons-material/MailOutlineRounded'
import LockOutlineRoundedIcon    from '@mui/icons-material/LockOutlineRounded'
import VisibilityOffRoundedIcon  from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon     from '@mui/icons-material/VisibilityRounded'
import { useNavigate }           from 'react-router-dom'
import { loginUser, saveToken }  from '../api/projectApi'   // ← added

function LoginPage({ onLoginSuccess }) {
  const [formData,     setFormData]     = useState({ email: '', password: '' })
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // ── Basic validation ────────────────────────────────────────────────────
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter both email and password.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }

    // ── Call real login API ─────────────────────────────────────────────────
    setLoading(true)
    setError('')
    try {
      const res = await loginUser({
        email:    formData.email.trim(),
        password: formData.password.trim(),
      })

      // Backend may return token at res.data.token OR res.data.data.token
      const token = res.data?.token ?? res.data?.data?.token
      if (!token) throw new Error('No token received from server.')

      saveToken(token)                          // ← saves to localStorage
      onLoginSuccess?.({ email: formData.email.trim() })
      navigate('/dashboard')
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        err.message                  ||
        'Login failed. Please check your credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="container h-100 d-flex align-items-center justify-content-center">
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <Box className="login-card">
              <Typography variant="h4" className="login-title">
                Employee Tracker
              </Typography>
              <Typography variant="body2" className="login-subtitle">
                Sign in to continue to your workspace.
              </Typography>

              <form onSubmit={handleSubmit} className="mt-4">
                <Stack spacing={2.5}>
                  {error ? <Alert severity="error">{error}</Alert> : null}

                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlineRoundedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            disabled={loading}
                          >
                            {showPassword
                              ? <VisibilityOffRoundedIcon fontSize="small" />
                              : <VisibilityRoundedIcon   fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    className="login-button"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                  >
                    {loading ? 'Signing in…' : 'Login'}
                  </Button>
                </Stack>
              </form>
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage