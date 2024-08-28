import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Typography, Container, Box } from '@mui/material';

function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    let un = localStorage.getItem("un");
    if (un !== null) {
      navigate("/home");
    }
  }, [navigate]);

  const [un, setUn] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState("");

  const register = (event) => {
    event.preventDefault();
    if (pw1 === pw2) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, un, pw1)
        .then((res) => {
          navigate("/login");
        })
        .catch((err) => setMsg("ERROR: " + err.message));
    } else {
      setMsg("Passwords do not match");
      setPw1("");
      setPw2("");
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs" className="form-container">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={register} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={un}
              onChange={(e) => setUn(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
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

export default SignUp;