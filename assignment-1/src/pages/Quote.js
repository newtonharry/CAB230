import React from "react";
import { useState } from "react";
import { getStock } from "../api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import {
  Input,
  Button,
  Container,
  Paper,
  Grid,
  TextField,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { GiOpenChest, GiLockedChest } from "react-icons/gi";
import { BsGraphDown, BsGraphUp, BsFillBarChartFill } from "react-icons/bs";
import Alert from "@material-ui/lab/Alert";

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

export default function Quote() {
  const { register, handleSubmit } = useForm();
  const [stock, setStock] = useState({});
  const classes = useStyles();
  const [alert, setAlert] = useState(true);
  const [alertResult, setAlertResult] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");

  const columns = [
    { headerName: "Timestamp", field: "timestamp" },
    { headerName: "Sybmol", field: "symbol" },
    { headerName: "Industry", field: "industry" },
    { headerName: "Open", field: "open" },
    { headerName: "High", field: "high" },
    { headerName: "Low", field: "low" },
    { headerName: "Close", field: "close" },
    { headerName: "Volumes", field: "volumes" },
  ];

  const onSubmit = ({ symbol }) => {
    getStock(symbol).then((res) => {
      if (res.status === 200) {
        setStock(res.data);
        setAlert(false);
      } else if (res.status === 400 || res.status === 404) {
        setAlertResult(res.data.message);
        setAlertSeverity("error");
        setAlert(true);
        setStock({});
      }
    });
  };
  return (
    <Container style={{ marginTop: "50px" }} maxWidth="sm">
      <Paper className={classes.padding}>
        <div className={classes.margin}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container justify="center" alignItems="flex-end" spacing={8}>
              <Grid item>
                <TextField
                  inputRef={register}
                  id="symbol"
                  name="symbol"
                  label="Stock Symbol"
                  type="text"
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
                Submit
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
        <Grid
          container
          justify="center"
          alignItems="flex-end"
          style={{ marginTop: "10px" }}
        >
          {/* Display the stock data within a list */}
          <List component="nav" aria-label="main mailbox folders">
            <ListItem>
              <BsGraphUp />
              <ListItemText primary={`High ${stock.high ? stock.high : ""}`} />
            </ListItem>
            <Divider />
            <ListItem>
              <GiOpenChest />
              <ListItemText primary={`Open ${stock.open ? stock.open : ""}`} />
            </ListItem>
            <Divider />
            <ListItem>
              <GiLockedChest />
              <ListItemText
                primary={`Close ${stock.close ? stock.close : ""}`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <BsGraphDown />
              <ListItemText primary={`Low ${stock.low ? stock.low : ""}`} />
            </ListItem>
            <Divider />
            <ListItem>
              <BsFillBarChartFill />
              <ListItemText
                primary={`Volumes ${stock.volumes ? stock.volumes : ""}`}
              />
            </ListItem>
          </List>
        </Grid>
      </Paper>
    </Container>
  );
}
