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
  Link,
} from '@mui/material';
import { Inventory2 as InventoryIcon, Person as PersonIcon, ArrowForward as ArrowIcon } from '@mui/icons-material';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Handle forgot password logic
    try {
      console.log('Reset link sent to:', email);
      // Simulate a successful request
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Error sending password reset link');
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
          {/* Header */}
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

          {/* Form */}
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

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
                {loading ? 'Sending reset link...' : 'Reset Password'}
              </Button>
            </form>

            {/* Go to Login */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link
                component="button"
                underline="hover"
                onClick={() => navigate('/login')}
                sx={{ fontSize: 14, fontWeight: 500 }}
              >
                Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
