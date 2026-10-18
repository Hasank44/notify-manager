import { createAsyncThunk } from "@reduxjs/toolkit";
import { createEntitySlice } from "../createEntitySlice";
import ENDPOINTS from "@/api/endpoints";
import axiosInstance from "@/api/axiosInstance";

export const bulkCreateUserSubscriptionsThunk = createAsyncThunk(
    "userSubscriptions/bulkCreate",
    async ({ domainId, botId, subscriptions }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(ENDPOINTS.userSubscriptions.bulk, {
                domainId,
                botId,
                subscriptions,
            });
            return response?.data;
        } catch (err) {
            return rejectWithValue(err.message || "Bulk upload failed");
        }
    }
);

const entity = createEntitySlice({
    name: "userSubscriptions",
    endpoint: ENDPOINTS.userSubscriptions.list,
    extraReducers: (builder) => {
        builder.addCase(bulkCreateUserSubscriptionsThunk.fulfilled, (state) => {
            state.loaded = false;
        });
    },
});

export const userSubscriptionsReducer = entity.reducer;
export const userSubscriptionsActions = entity.actions;
export const userSubscriptionsThunks = {
    ...entity.thunks,
    bulkCreate: bulkCreateUserSubscriptionsThunk,
};
export default entity;