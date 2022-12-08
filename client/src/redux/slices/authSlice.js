import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axios";
import Cookies from "js-cookie";

const authAxios = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
  },
  credentials: "include",
  withCredentials: true,
});

authAxios.interceptors.request.use((config) => {
  config.headers.Authorization = Cookies.get("token");

  return config;
});

const userToken = Cookies.get("token") ? Cookies.get("token") : null;

export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await authAxios.post("/api/auth/login", params);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchSignup = createAsyncThunk(
  "auth/fetchSignup",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await authAxios.post("/api/auth/register", params);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchConfirmEmail = createAsyncThunk(
  "auth/fetchConfirmEmail",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/auth/confirm/${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchResetPassword = createAsyncThunk(
  "auth/fetchResetPassword",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/password-reset", params);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchChangePassword = createAsyncThunk(
  "auth/fetchChangePassword",
  async (info, { rejectWithValue }) => {
    try {
      const { token, values } = info;
      const { data } = await axios.post(
        `/api/auth/password-reset/${token}`,
        values
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const fetchCheckToken = createAsyncThunk(
  "auth/fetchCheckToken",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/auth/checkToken/${params}`);
      console.log("fetchdata", data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAuthMe = createAsyncThunk(
  "auth/fetchAuthMe",
  async (userToken, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/auth/me", userToken);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  userInfo: null,
  userToken,
  error: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducer: {},
  extraReducers: {
    //LOGIN
    [fetchLogin.pending]: (state) => {
      state.userInfo = null;
      state.userToken = null;
      state.status = "loading";
    },
    [fetchLogin.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
      state.userToken = action.payload.token;
      state.status = "resolved";
    },
    [fetchLogin.rejected]: (state, action) => {
      state.userInfo = null;
      state.userToken = null;
      state.error = action.payload;
      state.status = "rejected";
    },

    //REGISTER
    [fetchSignup.pending]: (state) => {
      state.userInfo = null;
      state.status = "loading";
    },
    [fetchSignup.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
      state.status = "resolved";
    },
    [fetchSignup.rejected]: (state, action) => {
      state.userInfo = null;
      state.error = action.payload;
      state.status = "rejected";
    },

    //CONFIRM EMAIL
    [fetchConfirmEmail.pending]: (state) => {
      state.userInfo = null;
      state.status = "loading";
    },
    [fetchConfirmEmail.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
      state.status = "resolved";
    },
    [fetchConfirmEmail.rejected]: (state, action) => {
      state.userInfo = null;
      state.error = action.payload;
      state.status = "rejected";
    },

    //RESET PASSWORD (SEND LINK)
    [fetchResetPassword.pending]: (state) => {
      state.userInfo = null;
      state.status = "loading";
    },
    [fetchResetPassword.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
      state.status = "resolved";
    },
    [fetchResetPassword.rejected]: (state, action) => {
      state.userInfo = null;
      state.error = action.payload;
      state.status = "rejected";
    },

    //CHANGE PASSWORD
    [fetchChangePassword.pending]: (state) => {
      state.userInfo = null;
      state.status = "loading";
    },
    [fetchChangePassword.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
      state.status = "resolved";
    },
    [fetchChangePassword.rejected]: (state, action) => {
      state.userInfo = null;
      state.error = action.payload;
      state.status = "rejected";
    },

    //CHECK TOKEN
    [fetchCheckToken.pending]: (state) => {
      state.userInfo = null;
      state.status = "loading";
    },
    [fetchCheckToken.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
      state.status = "resolved";
    },
    [fetchCheckToken.rejected]: (state, action) => {
      state.userInfo = null;
      state.error = action.payload;
      state.status = "rejected";
    },

    //AUTH ME
    [fetchAuthMe.pending]: (state) => {
      state.userInfo = null;
      state.status = "loading";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      console.log("fetchAuthMe", action.payload);
      state.userInfo = action.payload;
      state.status = "resolved";
    },
    [fetchAuthMe.rejected]: (state, action) => {
      state.userInfo = null;
      state.status = "rejected";
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.userToken);
export const selectIsAuthMe = (state) => Boolean(state.auth.userInfo);

export const authReducer = authSlice.reducer;
