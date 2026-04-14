import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach the user-id to headers for Role-Based Access
API.interceptors.request.use((config) => {
  const userId = localStorage.getItem("seatbook_user_id");
  if (userId) {
    config.headers["user-id"] = userId;
  }
  return config;
});

export default API;