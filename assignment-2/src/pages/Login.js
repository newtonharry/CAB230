import { loginUser } from "../api";
import React, { useState } from "react";
import { setSession } from "../helpers";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Link as MaterialLink } from "@material-ui/core";
import AccountForm from "../components/AccountForm";
import { useForm } from "react-hook-form";
import { Grid } from "@material-ui/core";

export default function Login() {
  const { reset } = useForm();
  const [alert, setAlert] = useState(false);
  const [alertResult, setAlertResult] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const history = useHistory();

  const onSubmit = ({ username, password }) => {
    loginUser(username, password).then((res) => {
      if (res.status === 200) {
        setSession(res.data.token);
        setAlertSeverity("success");
        setAlertResult("Login successfull");
        history.push("/login");
      } else if (res.status === 401) {
        setAlertResult(res.data.message);
        setAlertSeverity("error");
        reset();
      }
      setAlert(true);
    });
  };
  return (
    <AccountForm
      type="Login"
      submit={onSubmit}
      alert={alert}
      alertResult={alertResult}
      alertSeverity={alertSeverity}
    >
      <Grid item>
        <MaterialLink component={RouterLink} to="/register" variant="body2">
          {"Don't have an account? Sign Up"}
        </MaterialLink>
      </Grid>
    </AccountForm>
  );
}
