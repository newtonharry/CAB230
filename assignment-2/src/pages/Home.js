import React from "react";
import { Paper, Container, Grid } from "@material-ui/core";
import Logo from "../assets/stocks_symbol.png";

export default function Home() {
  return (
    <div style={{ marginTop: "50px" }}>
      <Container>
        <Paper>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <img alt="Stocks Image" src={Logo} width="128" height="128" />
            <div width="100px">
              <p>
                Welcome to the Stock Analyst portal. Click on stocks to see all
                of the available companies, Quote to get the latest information
                by stock symbol, or Price History to sample the most recent 100
                days of information from a specific stock.
              </p>
            </div>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}
