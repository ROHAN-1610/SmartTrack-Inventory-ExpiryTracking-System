import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  Stack,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Inventory2 as InventoryIcon, Person as PersonIcon, Lock as LockIcon, ArrowForward as ArrowIcon } from '@mui/icons-material';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: 'USER' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={20} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          {/* ================= HEADER ================= */}
          <Box sx={{ p: 4, backgroundColor: '#2563eb', textAlign: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
              }}
            >
              <InventoryIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="white">
              SmartTrack Inventory
            </Typography>
            <Typography variant="body2" color="#dbeafe" mt={1}>
              Enterprise Expiry Management System
            </Typography>
          </Box>

          {/* ================= FORM ================= */}
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                placeholder="Enter username"
                margin="normal"
                required
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <TextField
                fullWidth
                type="password"
                placeholder="••••••••"
                margin="normal"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              {/* Role Dropdown */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={credentials.role}
                  onChange={(e) =>
                    setCredentials({ ...credentials, role: e.target.value })
                  }
                  label="Role"
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="OPERATOR">Operator</MenuItem>
                </Select>
              </FormControl>

              {/* Forgot password */}
              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Link
                  component="button"
                  variant="body2"
                  underline="hover"
                  onClick={() => navigate('/forgot-password')}
                  sx={{ fontSize: 13 }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.6,
                  borderRadius: 3,
                  backgroundColor: '#0f172a',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#020617' },
                }}
                endIcon={!loading && <ArrowIcon />}
              >
                {loading ? 'Authenticating...' : 'Login to System'}
              </Button>
            </form>

            {/* Register */}
            <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
              <Typography variant="body2" color="text.secondary">
                Don’t have an account?
              </Typography>
              <Link
                component="button"
                underline="hover"
                onClick={() => navigate('/register')}
                sx={{ fontSize: 14, fontWeight: 500 }}
              >
                Register
              </Link>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
              mt={2}
            >
              Demo Credentials: admin / admin
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
