import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword';
import Dashboard from './components/Dashboard';
import GuestDashboard from './components/GuestDashboard'; // New import
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff9800',
    },
  },
});

function PrivateRoute({ children }) {
  const un = localStorage.getItem('un');
  return un ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavBar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/guest-dashboard" element={<GuestDashboard />} /> // New route
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;