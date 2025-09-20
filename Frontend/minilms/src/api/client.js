import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5237/api",
});

// Add JWT token automatically from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { api };
