import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Container from "@material-ui/core/Container";
import { Fingerprint } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: theme.spacing.unit,
  },
  alertRoot: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AccountForm({
  type,
  submit,
  alert,
  alertResult,
  alertSeverity,
  children,
}) {
  const { register, handleSubmit } = useForm();
  const classes = useStyles();

  // This provides a resuseable component to construct the login and register forms
  return (
    <Container style={{ marginTop: "50px" }} maxWidth="sm">
      <Paper className={classes.padding}>
        <div className={classes.margin}>
          <form onSubmit={handleSubmit(submit)}>
            <Grid container alignItems="flex-end" spacing={8}>
              <Grid item>
                <AccountBoxIcon />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  inputRef={register}
                  id="username"
                  label="Username"
                  name="username"
                  fullWidth
                  autoFocus
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <Fingerprint />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  inputRef={register}
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: "10px" }}>
              <Button
                variant="outlined"
                color="primary"
                style={{ textTransform: "none" }}
                type="submit"
              >
                {type}
              </Button>
            </Grid>
          </form>
        </div>
        <Grid container justify="center" style={{ marginTop: "10px" }}>
          {alert ? (
            <div className={classes.alertRoot}>
              <Alert severity={alertSeverity}>{alertResult}</Alert>
            </div>
          ) : (
            <div></div>
          )}
        </Grid>
        {children}
      </Paper>
    </Container>
  );
}
