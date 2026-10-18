import { createEntitySlice } from "../createEntitySlice";
import ENDPOINTS from "@/api/endpoints";

const entity = createEntitySlice({
    name: "destinations",
    endpoint: ENDPOINTS.destinations.list,
});

export const destinationsReducer = entity.reducer;
export const destinationsActions = entity.actions;
export const destinationsThunks = entity.thunks;
export default entity;