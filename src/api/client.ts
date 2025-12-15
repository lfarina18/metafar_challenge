import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
  },
});
