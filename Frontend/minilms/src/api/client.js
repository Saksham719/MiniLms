import axios from "axios";
const API_BASE = "http://localhost:5237/api"; // ← change port to your API
export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
