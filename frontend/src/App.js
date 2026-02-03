import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import Reports from './pages/Reports';

import Layout from './components/Layout';
import ChatWidget from './components/ChatWidget';
import { ToastProvider } from './components/ToastProvider';

const theme = createTheme({
  palette: {
    primary: { main: '#3B82F6' },
    secondary: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Router>
          <Routes>

            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
            />

            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
            />

            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Layout onLogout={handleLogout}><Navigate to="/dashboard" /></Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Layout onLogout={handleLogout}><Dashboard /></Layout>
                ) : <Navigate to="/login" />
              }
            />

            <Route
              path="/inventory"
              element={
                isAuthenticated ? (
                  <Layout onLogout={handleLogout}><InventoryList /></Layout>
                ) : <Navigate to="/login" />
              }
            />

            <Route
              path="/reports"
              element={
                isAuthenticated ? (
                  <Layout onLogout={handleLogout}><Reports /></Layout>
                ) : <Navigate to="/login" />
              }
            />

          </Routes>
        </Router>
        <ChatWidget />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
