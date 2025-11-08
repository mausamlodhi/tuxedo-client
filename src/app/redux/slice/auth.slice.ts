import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../type";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    admin: {
      theme: false,
    },
    event:{},
    role: "",
    active: "dashboard",
    isAuthenticate: false,
    forgetPassword: {},
  },
  reducers: {
    loginAction: (state, action) => {
      return (state = {
        ...state,
        user: action.payload,
        isAuthenticate: true,
      });
    },
    toggleThemeAction: (state, action) => {
      return (state = {
        ...state,
        admin: {
          theme: action.payload,
        },
      });
    },
    logoutAction: () => {
      return {
        user: {},
        admin: {
          theme: false,
        },
        event:{},
        role: "",
        active: "dashboard",
        isAuthenticate: false,
        forgetPassword: {},
      };
    },
    setActiveSidebar: (state, action: PayloadAction<string>) => {
      state.active = action.payload;
    },
    updateEventData: (state, action: PayloadAction<any>) => {
      state.event = action.payload;
    },
  },
});

export const {
  loginAction,
  toggleThemeAction,
  logoutAction,
  setActiveSidebar,
  updateEventData,
} = authSlice.actions;
export const selectUserData = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthData = (state: { auth: AuthState }) => state.auth;
export const selectActiveSidebar = (state: { auth: AuthState }) =>
  state.auth.active;
export const selectEventData = (state: { auth: AuthState }) => state.auth.event;
export const checkIsAuthenicate = (state:any) => state?.auth?.isAuthenticate;

export default authSlice.reducer;
