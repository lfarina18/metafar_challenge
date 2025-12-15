import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

export const getStockData = async (symbol: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/stocks`, {
      params: {
        source: "docs",
        symbol: symbol,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data for symbol ${symbol}`, error);
    throw error;
  }
};

export const getStockListForAutocomplete = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/stocks`, {
      params: {
        source: "docs",
        exchange: "NASDAQ",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stock list for Autocomplete:", error);
    throw error;
  }
};

export const getStockQuote = async (
  symbol: string,
  interval = "5min",
  startDate: string,
  endDate: string
) => {
  try {
    let url = `${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&apikey=${API_KEY}`;
    if (startDate !== null && endDate !== null) {
      url += `&start_date=${startDate}&end_date=${endDate}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock quote:", error);
    throw error;
  }
};
