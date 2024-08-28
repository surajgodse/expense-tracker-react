import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { TextField, Button, Typography, Container, Box } from '@mui/material';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    let un = localStorage.getItem("un");
    if (un !== null) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const rUn = useRef();
  const rPw = useRef();

  const [un, setUn] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  const hUn = (event) => setUn(event.target.value);
  const hPw = (event) => setPw(event.target.value);

  const login = (event) => {
    event.preventDefault();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, un, pw)
      .then((res) => {
        localStorage.setItem("un", un);
        navigate("/dashboard"); // Navigate to Dashboard after login
      })
      .catch((err) => setMsg("ERROR: " + err.message));
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={login} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={rUn}
              value={un}
              onChange={hUn}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={rPw}
              value={pw}
              onChange={hPw}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
          {msg && (
            <Typography color="error" sx={{ mt: 2 }}>
              {msg}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}

export default Login;