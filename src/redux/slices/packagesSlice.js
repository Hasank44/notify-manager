import { createEntitySlice } from "../createEntitySlice";
import ENDPOINTS from "@/api/endpoints";

const entity = createEntitySlice({
    name: "packages",
    endpoint: ENDPOINTS.packages.list,
});

export const packagesReducer = entity.reducer;
export const packagesActions = entity.actions;
export const packagesThunks = entity.thunks;
export default entity;