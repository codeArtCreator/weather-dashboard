import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OPENWEATHER_API_KEY } from "../../Api/apiKeys";
import WeatherData from "../../interface/WeatherData";
import axios from "axios";

interface WeatherState {
  loading: boolean;
  data: WeatherData | null;
  error: string | null;
}

const initialState: WeatherState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city: string) => {
    const API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await axios.get(API);
    return response.data as WeatherData;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error =
          action.error.message === "Request failed with status code 404"
            ? "City not found"
            : "An error occurred";
      });
  },
});

export default weatherSlice.reducer;
