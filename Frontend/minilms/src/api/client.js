// src/api/client.js
import axios from "axios";

const API_BASE = "http://localhost:5237/api"; // match your backend http port

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { api };
