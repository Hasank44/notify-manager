import { createEntitySlice } from "../createEntitySlice";
import ENDPOINTS from "@/api/endpoints";

const entity = createEntitySlice({
    name: "notificationTypes",
    endpoint: ENDPOINTS.notificationTypes.list,
});

export const notificationTypesReducer = entity.reducer;
export const notificationTypesActions = entity.actions;
export const notificationTypesThunks = entity.thunks;
export default entity;