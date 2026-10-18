import { createEntitySlice } from "../createEntitySlice";
import ENDPOINTS from "@/api/endpoints";

const entity = createEntitySlice({
    name: "notifications",
    endpoint: ENDPOINTS.notifications.list,
});

export const notificationsReducer = entity.reducer;
export const notificationsActions = entity.actions;
export const notificationsThunks = entity.thunks;
export default entity;