import axios from "axios";
const backendUrl = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});