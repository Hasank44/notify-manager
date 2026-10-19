import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: []
};

const recentNotificationSlice = createSlice({
    name: "recentNotification",
    initialState,
    reducers: {
        setRecentNotification: (state, action) => {
            state.items = action.payload
        },
        resetRecentNotifications: () => initialState,
    }
});

export const { setRecentNotification, resetRecentNotifications } = recentNotificationSlice.actions;
export default recentNotificationSlice.reducer;