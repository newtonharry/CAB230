import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { getStocks, getStock } from "../api";
import axios from "axios";
import { Paper, Grid } from "@material-ui/core";
import Loader from "react-loader-spinner";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function Stock() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  const classes = useStyles();

  const columns = [
    {
      headerName: "Timestamp",
      field: "timestamp",
      sortable: true,
    },
    {
      headerName: "Sybmol",
      field: "symbol",
      filter: true,
    },
    {
      headerName: "Industry",
      field: "industry",
      filter: true,
    },
    {
      headerName: "Open",
      field: "open",
      sortable: true,
    },
    {
      headerName: "High",
      field: "high",
      sortable: true,
    },
    {
      headerName: "Low",
      field: "low",
      sortable: true,
    },
    {
      headerName: "Close",
      field: "close",
      sortable: true,
    },
    {
      headerName: "Volumes",
      field: "volumes",
      sortable: true,
    },
  ];

  const industryOptions = [
    { value: "Health Care", label: "Health Care" },
    { value: "Financials", label: "Financials" },
    { value: "Industrials", label: "Industrials" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Consumer Discretionary", label: "Consumer Discretionary" },
    {
      value: "Materials",
      label: "Materials",
    },
    {
      value: "Information Technology",
      label: "Information Technology",
    },
    {
      value: "Energy",
      label: "Energy",
    },
    {
      value: "Consumer Staples",
      label: "Consumer Staples",
    },
    {
      value: "Telecommunication Services",
      label: "Telecommunication Services",
    },
    {
      value: "Utilities",
      label: "Utilities",
    },
  ];
  // Request all stocks and wait for all requests to be completed before updating the components
  useEffect(() => {
    getStocks().then((stocks) => {
      axios
        .all(
          stocks.data.map((stock) => {
            return getStock(stock.symbol).then((stock) => stock.data);
          })
        )
        .then(
          axios.spread((...responses) => {
            setStocks(responses);
            setLoading(false);
          })
        );
    });
  }, []);

  // Used to handle the change happening within the select component
  const onChange = (selectedOptions) => {
    if (selectedOptions !== null) {
      setIndustries(selectedOptions.map((option) => option.value));
    } else {
      setIndustries([]);
    }
  };

  return (
    <div className={classes.root}>
      <Select
        options={industryOptions}
        onChange={onChange}
        isClearable={true}
        placeholder="Filter by industrie(s)"
        isMulti
      />
      <Grid
        container
        direction="column"
        // justify="space-evenly"
        alignItems="center"
      >
        {/* If the data is being requested, show loading spinner icon, else show data*/}
        {loading ? (
          <Grid
            item
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: "100vh" }}
          >
            <Grid item xs={3}>
              <Loader type="Puff" color="#00BFFF" height={100} width={100} />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Loading Stocks</Typography>
            </Grid>
          </Grid>
        ) : (
          <div
            className="ag-theme-balham"
            style={{
              height: "620px",
              width: "1500px",
            }}
          >
            <AgGridReact
              columnDefs={columns}
              rowData={stocks.filter((stock) => {
                if (Array.isArray(industries) && industries.length) {
                  return industries.includes(stock.industry);
                } else {
                  return stock;
                }
              })}
              pagination={true}
              paginationAutoPageSize={true}
            />
          </div>
        )}
      </Grid>
    </div>
  );
}
