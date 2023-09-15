import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//add the followoing to allow cookies to be sent over to server

export const axiosExternal = axios.create({
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
