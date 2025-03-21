import { createSlice } from "@reduxjs/toolkit";

// Define types for the state
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Match {
  id: string;
  players: string[];
  score: number | null; 
}

interface AuthState {
  user: User | null;
  token: string | null;
  matches: Match[];
  year: string
}

const initialState: AuthState = {
  user: null,
  token: null,
  matches: [],
  year: "2025", 
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setMatches: (state, action) => {
      state.matches = action.payload.matches;
    },
    setYear: (state, action) => {
      state.year = action.payload.year; // 🎯 Setting year here
    },
  },
});

export const {
  setLogin,
  setLogout,
  setMatches,
  setYear,
  updateUser
} = authSlice.actions;
export default authSlice.reducer;
