import React from "react";
import { Link, Switch, Route, Redirect, useHistory } from "react-router-dom";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import Quote from "./pages/Quote";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PriceHistory from "./pages/PriceHistory";
import { getSession, removeSession } from "./helpers";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appbar: {
    alignItems: "center",
  },
}));

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Grid
              container
              justify="flex-start"
              direction="row"
              alignItems="center"
            >
              <Typography variant="h6">Stock Prices</Typography>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
              >
                {/*Home Page*/}
                <Tab label="Home" value="/" component={Link} to="/" />
                {/*Stocks Page*/}
                <Tab
                  label="Stocks"
                  value="/stocks"
                  component={Link}
                  to="/stocks"
                />
                {/*Quote Page*/}
                <Tab
                  label="Quote"
                  value="/quote"
                  component={Link}
                  to="/quote"
                />
                {/*Price History Page*/}
                <Tab
                  label="Price History (Restricted)"
                  value="/pricehistory"
                  component={Link}
                  to="/pricehistory"
                />
              </Tabs>
            </Grid>
            {/*If logged in display the logout button , else the login and register button*/}
            {getSession() ? (
              <div>
                <Button
                  color="inherit"
                  component={Link}
                  to="/logout"
                  onClick={() => {
                    removeSession();
                    history.push("/");
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
      {/* Set up the routes which corresponds to the link components layout out in the application */}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/stocks">
          <Stocks />
        </Route>
        <Route path="/quote">
          <Quote />
        </Route>
        <Route
          path="/pricehistory"
          render={() =>
            getSession() ? <PriceHistory /> : <Redirect to="/login" />
          }
        />
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/Register">
          <Register />
        </Route>
        <Route path="/logout" render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
}

export default App;
