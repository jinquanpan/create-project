import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0OTA1NTk5LCJpYXQiOjE3NDQ4NTU2NzgsImp0aSI6ImU1OGRlOTRjZDg4ZDQzM2RiYzM4OWJiNDcyODMzYTRmIiwidXNlcl9pZCI6NTE3fQ.QoemijsOBtm8XL6lpR7sW1sy8mppm1mR4lX6gQ_nFkI";
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = slice.actions;

export default slice.reducer;
