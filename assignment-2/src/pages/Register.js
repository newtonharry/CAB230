import React, { useState } from "react";
import { registerUser } from "../api";
import { makeStyles } from "@material-ui/core";
import AccountForm from "../components/AccountForm";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Link as MaterialLink } from "@material-ui/core";
import { Grid } from "@material-ui/core";

export default function Register() {
  const [alert, setAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertResult, setAlertResult] = useState("");

  const onSubmit = ({ username, password }) => {
    registerUser(username, password).then((res) => {
      if (res.status === 201) {
        setAlertSeverity("success");
      } else if (res.status === 400 || res.status === 409) {
        setAlertSeverity("error");
      }
      setAlertResult(res.data.message);
      setAlert(true);
    });
  };

  return (
    <AccountForm
      type="Register"
      submit={onSubmit}
      alert={alert}
      alertResult={alertResult}
      alertSeverity={alertSeverity}
    >
      <Grid item>
        <MaterialLink component={RouterLink} to="/login" variant="body2">
          {"Have an account? Login"}
        </MaterialLink>
      </Grid>
    </AccountForm>
  );
}
