import React, { useState } from "react";
import { getDateStock } from "../api";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Box,
  Grid,
  Input,
  Paper,
  makeStyles,
  Container,
  TextField,
} from "@material-ui/core";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "react-datepicker/dist/react-datepicker.css";
import StockGraph from "../components/StockGraph";
import { format, getTime } from "date-fns";
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

export default function PriceHistory() {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const { control, register, handleSubmit } = useForm();
  const [alert, setAlert] = useState(true);
  const [alertResult, setAlertResult] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
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

  // reuseable format function
  const formatDate = (date) => {
    return getTime(Date.parse(date));
  };

  // Convert the data to be suiteable for the candlestick chart
  const toCandleSticks = (data) => {
    return data.map((stock) => {
      return {
        x: formatDate(stock.timestamp),
        y: [stock.open, stock.high, stock.low, stock.close],
      };
    });
  };

  // Convert the data to be suiteable for the area chart
  const toAreaChart = (data) => {
    return data.map((stock) => {
      return [formatDate(stock.timestamp), stock.volumes];
    });
  };

  const onSubmit = ({ symbol, fromDate, toDate }) => {
    getDateStock(
      symbol,
      fromDate ? fromDate.toISOString() : new Date(2019, 11, 6).toISOString(),
      toDate ? toDate.toISOString() : new Date(2020, 3, 23).toISOString()
    ).then((res) => {
      if (res.status === 404 || res.status === 400) {
        setRows([]);
        setData([]);
        setAlertResult(res.data.message);
        setAlertSeverity("error");
        setAlert(true);
      } else {
        if (Array.isArray(res.data)) {
          setRows(res.data);
          setData(res.data);
          setAlert(false);
        }
      }
    });
  };

  return (
    <div>
      <Container
        style={{ marginTop: "50px", marginBottom: "50px" }}
        maxWidth="sm"
      >
        <Paper className={classes.padding}>
          <div className={classes.margin}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container justify="center" alignItems="center" spacing={8}>
                <Grid item>
                  <ShowChartIcon />
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <TextField
                    inputRef={register}
                    id="symbol"
                    label="Symbol"
                    name="symbol"
                    fullWidth
                    autoFocus
                    required
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="flex-end" spacing={8}>
                <Grid item>
                  <CalendarTodayIcon />
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <Controller
                    as={
                      <DatePicker
                        placeholderText="Click to select a start date"
                        dateFormat="yyyy-MM-dd"
                        autoComplete="off"
                      />
                    }
                    name="fromDate"
                    control={control}
                    defaultValue=""
                    valueName="selected" // DateSelect value's name is selected
                    onChange={([selected]) => {
                      return selected;
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="flex-end" spacing={8}>
                <Grid item>
                  <CalendarTodayIcon />
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <Controller
                    as={
                      <DatePicker
                        placeholderText="Click to select an end date"
                        dateFormat="yyyy-MM-dd"
                        autoComplete="off"
                      />
                    }
                    name="toDate"
                    control={control}
                    defaultValue=""
                    valueName="selected" // DateSelect value's name is selected
                    onChange={([selected]) => {
                      return selected;
                    }}
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
        </Paper>
      </Container>
      <Grid container direction="column">
        <Grid item>
          {/* Display the stock data in a table  */}
          <Paper>
            <div
              className="ag-theme-balham"
              style={{
                height: "300px",
                width: "1500px",
              }}
            >
              <AgGridReact
                columnDefs={columns}
                rowData={rows}
                pagination={true}
                paginationPageSize={8}
              />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {/* Display the stock open, close, high and low data in a candle stick graph */}
          <Paper>
            <StockGraph
              options={{
                title: {
                  text: "Stock Price History",
                  align: "Center",
                },
                noData: {
                  text: "No Data Available",
                  align: "center",
                  verticalAlign: "center",
                },
                yaxis: {
                  tooltip: {
                    enabled: true,
                  },
                },
                xaxis: {
                  type: "datetime",
                },
                dataLabels: {
                  enabled: false,
                },
              }}
              data={toCandleSticks(data).reverse()}
              type="candlestick"
              name="Stock Price"
            />
          </Paper>
          {/* Display the stock volume data in an area chart */}
          <Paper>
            <StockGraph
              options={{
                title: {
                  text: "Stock Volume History",
                  align: "Center",
                },
                noData: {
                  text: "No Data Available",
                  align: "center",
                  verticalAlign: "center",
                },
                yaxis: {
                  tooltip: {
                    enabled: true,
                  },
                },
                xaxis: {
                  type: "datetime",
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "straight",
                },
              }}
              data={toAreaChart(data)}
              type="area"
              name="Stock Volume"
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
