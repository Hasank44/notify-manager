import { createEntitySlice } from "../createEntitySlice";
import ENDPOINTS from "@/api/endpoints";

const entity = createEntitySlice({
    name: "routes",
    endpoint: ENDPOINTS.routes.list,
});

export const routesReducer = entity.reducer;
export const routesActions = entity.actions;
export const routesThunks = entity.thunks;
export default entity;