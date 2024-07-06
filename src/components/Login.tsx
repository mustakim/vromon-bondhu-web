import React, { useState } from "react";
import { makeStyles, createStyles, Theme } from "@mui/material/styles";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
} from "@mui/material";
import { login } from "../services/firebaseService"; // Import login from firebaseService.ts

const containerStyle: React.CSSProperties = {
  marginTop: "8rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const formStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "1rem",
};

const submitButtonStyle: React.CSSProperties = {
  margin: "3rem 0 2rem",
};

const errorTextStyle: React.CSSProperties = {
  color: "#f44336", // Material-UI error color
  marginTop: "1rem",
};

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password); // Assuming login function handles Firebase login
      onLogin(); // Callback to handle successful login
    } catch (error) {
      setError("Error logging in"); // Handle login errors
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={containerStyle}>
      <div>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form style={formStyle} onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography style={errorTextStyle}>{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={submitButtonStyle}
          >
            Sign In
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </div>
    </Container>
  );
};

export default Login;
