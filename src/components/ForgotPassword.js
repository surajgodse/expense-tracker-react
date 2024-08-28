import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { TextField, Button, Typography, Container } from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError('Failed to send password reset email: ' + error.message);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Forgot Password
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="primary">{message}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Reset Password
        </Button>
      </form>
    </Container>
  );
}

export default ForgotPassword;