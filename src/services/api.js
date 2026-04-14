import axios from "axios";

const API = axios.create({
  baseURL: "spendora-production-1228.up.railway.app/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;