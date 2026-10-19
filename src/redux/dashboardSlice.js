import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    summary: null,
    domainCount: 0,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setSummary: (state, action) => {
            state.summary = action.payload
        },
        setDomainCount: (state, action) => {
            state.domainCount = action.payload
        },
        resetDashboard: () => initialState,
    }
});

export const { setSummary, setDomainCount, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;