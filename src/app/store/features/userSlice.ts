import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
}

const initialState: UserState = {
  token: null,
  status: "idle",
  error: null,
};

export const initializeUser = createAsyncThunk(
  "user/initializeUser",
  async () => {
    const savedToken = localStorage.getItem("token");

    return savedToken || null;
  }
);

export const login = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: string }
>("user/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      "https://test-assignment.emphasoft.com/api/v1/login/",
      {
        username,
        password,
      }
    );

    if (response.data && response.data.token) {
      return response.data.token;
    } else {
      throw new Error("No token received");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data || "Unknown error occurred during login"
      );
    }
    return rejectWithValue("Unknown error occurred during login");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem("token");
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        initializeUser.fulfilled,
        (state, action: PayloadAction<string | null>) => {
          if (action.payload !== null) {
            state.token = action.payload;
          }
        }
      )

      .addCase(login.pending, (state) => {
        state.status = "loading";
      })

      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.token = action.payload;

        localStorage.setItem("token", action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
