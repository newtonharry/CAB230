// import getSession from "./helpers";
import axios from "axios";
import { getSession } from "./helpers";
import qs from "qs";
const API_ENDPOINT = "http://131.181.190.87:3000";

// function to provide reusable code for get requests
const getData = (endpoint, data) => {
  return axios.get(`${API_ENDPOINT}${endpoint}`, data).then(
    (res) => res,
    (error) => error.response
  );
};

// function to provide reusable code for post requests
const postData = (endpoint, params) => {
  return axios.post(`${API_ENDPOINT}${endpoint}`, params).then(
    (res) => res,
    (error) => error.response
  );
};

// Get all of the stock symbols in a basic format
export const getStocks = (industry) => {
  return getData("/stocks/symbols", industry ? { params: { industry } } : {});
};

// Get a specific stock, returning more complex data
export const getStock = (stock) => {
  return getData(`/stocks/${stock}`);
};

// Get complex stock data between optional dates
export const getDateStock = (stock, date_from, date_to) => {
  let token = getSession();
  return getData(`/stocks/authed/${stock}`, {
    params:
      date_from || date_to
        ? {
            from: date_from || "",
            to: date_to || "",
          }
        : {},
    headers: { Authorization: `Bearer ${token}` },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });
};

// Register a user with the application
export const registerUser = (email, password) => {
  let data = { email, password };
  return postData("/user/register", data);
};

// Login a user with the application
export const loginUser = (email, password) => {
  let data = { email, password };
  return postData("/user/login", data);
};
