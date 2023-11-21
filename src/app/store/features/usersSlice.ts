import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
}

interface UsersState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk<User[], void, { state: RootState }>(
  "users/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Authentication token not found");
    }

    try {
      const response = await axios.get<User[]>(
        "https://test-assignment.emphasoft.com/api/v1/users/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (
    userData: {
      username: string;
      first_name: string;
      last_name: string;
      password: string;
    },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).user.token;
    if (!token) {
      return rejectWithValue("Authentication token not found");
    }

    try {
      const response = await axios.post(
        "https://test-assignment.emphasoft.com/api/v1/users/",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Unknown error occurred"
        );
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { userId, userData }: { userId: number; userData: Partial<User> },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).user.token;
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.patch(
        `https://test-assignment.emphasoft.com/api/v1/users/${userId}/`,
        userData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Unknown error occurred"
        );
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

export const toggleUserActiveStatus = createAsyncThunk(
  "users/toggleUserActiveStatus",
  async (
    { userId, isActive }: { userId: number; isActive: boolean },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).user.token;
    if (!token) {
      return rejectWithValue("Authentication token not found");
    }

    try {
      const response = await axios.patch(
        `https://test-assignment.emphasoft.com/api/v1/users/${userId}/`,
        { is_active: !isActive },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Unknown error occurred"
        );
      }
      return rejectWithValue("Unknown error occurred");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        toggleUserActiveStatus.fulfilled,
        (state, action: PayloadAction<User>) => {
          const index = state.users.findIndex(
            (user) => user.id === action.payload.id
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }
        }
      )
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;
