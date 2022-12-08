import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { calendarsReducer } from "./slices/calendarSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    calendars: calendarsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
