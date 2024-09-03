import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function NavBar() {
  const navigate = useNavigate();
  const un = localStorage.getItem('un');

  const handleLogout = () => {
    localStorage.removeItem('un');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Expense Tracker
        </Typography>
        <Button color="inherit" component={Link} to="/guest-dashboard">Guest Dashboard</Button>
        {un ? (
          <>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/home">Home</Button>
            <Button color="inherit" component={Link} to="/change-password">Change Password</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            <Button color="inherit" component={Link} to="/forgot-password">Forgot Password</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;