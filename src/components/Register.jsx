import React, { useState } from "react";
import style from "./Register.module.css";

import { Link, useNavigate } from "react-router-dom";

import * as yup from "yup";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import config from "../config/config.json";

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

export default function SignUp() {
  const [errors, setErrors] = useState({ msg: "" });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setErrors({});

    const schema = yup.object().shape({
      email: yup.string().required("Please enter email"),
      password: yup.string().required("Please enter password"),
      username: yup.string().required("Please enter username"),
      name: yup.string().required("Please enter name"),
      mobile_number: yup.string().required("Please enter mobile number"),
      creditCard: yup.string().required("Please enter credit card number"),
    });

    const payloadUser = {
      email: data.get("email"),
      password: data.get("password"),
      username: data.get("username"),
      name: data.get("name"),
      mobile_number: data.get("mobile_number"),
      creditCard: data.get("debitCard"),
    };

    schema
      .validate(payloadUser, { abortEarly: false })
      .then((isValid) => {
        fetch(`${config.apiBaseUrl}/create`, {
          method: "POST",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadUser),
        })
          .then((resp) => {
            fetch(`${config.apiBaseUrl}/login`, {
              method: "POST",
              mode: "cors",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: payloadUser.email,
                password: payloadUser.password,
              }),
            })
              .then((resp) => resp.json())
              .then((respLogin) => {
                localStorage.setItem("userId", respLogin.userId);
                localStorage.setItem("userName", respLogin.name);

                navigate("/dashboard");
              });
          })
          .catch((err) => {
            setErrors((prev) => ({ ...prev, apiResp: true }));
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
              Register
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="firstName"
                    label="Name"
                    autoFocus
                  />
                  <p>{errors && errors.name && errors.name.message}</p>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Username"
                    name="username"
                    autoComplete="family-name"
                  />
                  <p>{errors && errors.username && errors.username.message}</p>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                  <p>{errors && errors.email && errors.email.message}</p>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                  <p>{errors && errors.password && errors.password.message}</p>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="mobile_number"
                    label="Mobile Number"
                    id="mobile_number"
                  />

                  <p>
                    {errors &&
                      errors.mobile_number &&
                      errors.mobile_number.message}
                  </p>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="debitCard"
                    label="Debit Card Number"
                    id="credit_card"
                  />
                  <p>
                    {errors && errors.creditCard && errors.creditCard.message}
                  </p>
                </Grid>
              </Grid>

              {errors.apiResp && (
                <p>Account with given Debit Card does not exist</p>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login">Already have an account? Sign in</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
