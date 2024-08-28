import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, signOut } from "firebase/auth";
import { TextField, Button, Typography, Container } from '@mui/material';

function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const un = localStorage.getItem('un');
    if (!un) {
      navigate('/login');
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }
    const auth = getAuth();
    const user = auth.currentUser;
    try {
      await updatePassword(user, password);
      setMessage('Password updated successfully. Logging out...');
      
      // Log out the user
      await signOut(auth);
      
      // Clear local storage
      localStorage.removeItem('un');
      
      // Redirect to login page after a short delay
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError('Failed to update password: ' + error.message);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Change Password
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="primary">{message}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="New Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Change Password
        </Button>
      </form>
    </Container>
  );
}

export default ChangePassword;