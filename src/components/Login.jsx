import React, { useState } from "react";
import style from "./Login.module.css";

import { Link, useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import config from "../config/config.json";
import * as yup from "yup";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({ msg: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({ email: "", password: "" });

    const data = new FormData(event.currentTarget);
    const payload = {
      email: data.get("email"),
      password: data.get("password"),
    };

    const schema = yup.object().shape({
      email: yup
        .string()
        .email("Email is wrong")
        .required("*Please enter email"),
      password: yup.string().required("*Please enter password"),
    });

    schema
      .validate(payload, { abortEarly: false })
      .then((isValid) => {
        fetch(`${config.apiBaseUrl}/login`, {
          method: "POST",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then(async (resp) => {
            if (resp.ok) {
              return resp.json();
            }

            return resp.text().then((text) => {
              throw new Error(text);
            });
          })
          .then((resp) => {
            localStorage.setItem("userId", resp.userId);
            localStorage.setItem("userName", resp.name);
            navigate("/dashboard");
          })
          .catch((err) => {
            setErrors({ apiResponse: "Wrong Credentials" });
            console.log(err);
          });
      })
      .catch((err) => {
        let errs = {};

        err.inner.forEach((er) => {
          errs[er.path] = er;
        });

        console.log(errs);
        setErrors(errs);
      });
  };

  return (
    <div className={style.wrapper}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              {errors && errors.email && (
                <div className={style.error}>{errors.email.message}</div>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              {errors && errors.password && (
                <div className={style.error}>{errors.password.message}</div>
              )}

              {errors.apiResponse && (
                <div className={style.error}>{"Wrong Credentials"}</div>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/register">New User? Click here to Register</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
