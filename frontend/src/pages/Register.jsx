import React, { useState } from 'react';
import { Box, Container, Paper, TextField, Button, Typography, Alert, Stack, Link, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password,
        confirmPassword,
        role
      });

      if (response.data.message === "User registered successfully") {
        window.location.href = '/login';
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Container maxWidth="sm">
        <Paper elevation={20} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ p: 4, backgroundColor: '#2563eb', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" color="white">SmartTrack Inventory</Typography>
            <Typography variant="body2" color="#dbeafe" mt={1}>Enterprise Expiry Management System</Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Username" margin="normal" required value={username} onChange={(e) => setUsername(e.target.value)} />
              <TextField fullWidth label="Email" margin="normal" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField fullWidth type="password" label="Password" margin="normal" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <TextField fullWidth type="password" label="Confirm Password" margin="normal" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role</InputLabel>
                <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="OPERATOR">Operator</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth type="submit" disabled={loading}
                sx={{ mt: 3, py: 1.6, borderRadius: 3, bgcolor: '#0f172a', color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#020617' } }}
                endIcon={!loading && <ArrowIcon />}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>

            <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
              <Typography variant="body2" color="text.secondary">Already have an account?</Typography>
              <Link component="button" underline="hover" onClick={() => window.location.href = '/login'}>Login</Link>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
