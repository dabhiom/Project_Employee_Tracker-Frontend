// src/Pages/LoginPage.jsx
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Fade,
  Grow,
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
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        background:
          'radial-gradient(circle at 50% 44%, rgba(255, 255, 255, 0.99) 0%, rgba(255, 255, 255, 0.95) 24%, rgba(255, 255, 255, 0) 56%), radial-gradient(circle at 16% 14%, rgba(96, 165, 250, 0.18), transparent 42%), radial-gradient(circle at 84% 14%, rgba(244, 114, 182, 0.16), transparent 40%), radial-gradient(circle at 78% 84%, rgba(147, 197, 253, 0.14), transparent 34%), linear-gradient(145deg, #f3f8ff 0%, #fff3f9 52%, #f2f8ff 100%)',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: -60,
          left: -35,
          width: 210,
          height: 210,
          borderRadius: '50%',
          bgcolor: 'rgba(96, 165, 250, 0.16)',
          filter: 'blur(16px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          right: -46,
          bottom: -56,
          width: 220,
          height: 220,
          borderRadius: '50%',
          bgcolor: 'rgba(244, 114, 182, 0.14)',
          filter: 'blur(16px)',
          pointerEvents: 'none',
        }}
      />
      <Grow in={true} timeout={800}>
        <Container maxWidth="xs" sx={{ px: { xs: 1, sm: 2 } }}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 5,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 16px 44px rgba(37, 99, 235, 0.14)',
              border: '1px solid rgba(255, 255, 255, 0.68)',
              textAlign: 'center',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Box mb={4}>
              <Typography
                variant="h4"
                fontWeight="500"
                sx={{
                  fontSize: { xs: '2.15rem', sm: '3rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(92deg, #2563eb 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.8,
                  wordBreak: 'break-word',
                  lineHeight: 1.2,
                }}
              >
                Tecnoprism
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight="500">
                Employee Tracker
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {error && (
                  <Fade in={!!error}>
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{ borderRadius: 2 }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineRoundedIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2.5,
                      bgcolor: 'rgba(255,255,255,0.78)',
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.45)' } }}
                />

                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  size="small"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlineRoundedIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOffRoundedIcon fontSize="small" />
                          ) : (
                            <VisibilityRoundedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2.5,
                      bgcolor: 'rgba(255,255,255,0.78)',
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.45)' } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    background: 'linear-gradient(92deg, #2563eb 0%, #0ea5e9 100%)',
                    boxShadow: '0 8px 22px rgba(37, 99, 235, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(92deg, #1d4ed8 0%, #0284c7 100%)',
                      boxShadow: '0 10px 24px rgba(37, 99, 235, 0.34)',
                    },
                  }}
                >
                  Sign In
                </Button>

                <Typography variant="body2" color="text.secondary">
                  Manage your team with precision
                </Typography>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Grow>
    </Box>
  )
}

export default LoginPage