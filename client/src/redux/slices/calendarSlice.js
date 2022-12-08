import { createAsyncThunk, createSlice, createReducer } from "@reduxjs/toolkit";
import axios from "../axios";

export const fetchCalendars = createAsyncThunk(
  "calendars/fetchCalendars",
  async (calendarId, { rejectWithValue }) => {
    try {
      console.log(calendarId);
      if (typeof calendarId == "string") {
        console.log(calendarId);
        var { data } = await axios.get(`/api/calendars/${calendarId}`);
      } else {
        var { data } = await axios.get(`/api/calendars/`);
      }

      console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const initialState = {
  currentCalendar: {},
  calendars: {
    items: [],
    error: null,
    status: "loading",
  },
};

const calendarsSlice = createSlice({
  name: "calendars",
  initialState,
  reducer: {},
  extraReducers: {
    //CALENDAR
    [fetchCalendars.pending]: (state) => {
      state.calendars.items = null;
      state.calendars.status = "loading";
    },
    [fetchCalendars.fulfilled]: (state, action) => {
      state.calendars.items = action.payload.calendars;
      state.calendars.status = "resolved";
    },
    [fetchCalendars.rejected]: (state, action) => {
      state.calendars.items = null;
      state.calendars.error = action.payload;
      state.calendars.status = "rejected";
    },
  },
  reducers: {
    setCurrentCalendar: {
      reducer(state, action) {
        console.log("payload currentCalendar", action.payload);
        state.currentCalendar = action.payload;
      },
      prepare(calendar) {
        return {
          payload: calendar,
        };
      },
    },
    setCalendars: {
      reducer(state, action) {
        console.log("payload calendars", action.payload);
        state.calendars.items = action.payload;
      },
      prepare(calendars) {
        return {
          payload: calendars,
        };
      },
    },
  },
});

export const { setCalendars } = calendarsSlice.actions;
export const { setCurrentCalendar } = calendarsSlice.actions;
export const selectCurrentCalendar = (state) => state.calendars.currentCalendar;
// export const selectIsAuthMe = (state) => Boolean(state.auth.userInfo);

export const calendarsReducer = calendarsSlice.reducer;
