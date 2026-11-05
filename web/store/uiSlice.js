import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { notification: null },
  reducers: {
    notify: (state, action) => {
      state.notification = { severity: "info", ...action.payload };
    },
    dismissNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { notify, dismissNotification } = uiSlice.actions;
export default uiSlice.reducer;