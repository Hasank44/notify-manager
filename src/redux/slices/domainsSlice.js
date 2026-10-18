import { createEntitySlice } from "../createEntitySlice";
import ENDPOINTS from "@/api/endpoints";

const entity = createEntitySlice({
    name: "domains",
    endpoint: ENDPOINTS.domains.list,
});

export const domainsReducer = entity.reducer;
export const domainsActions = entity.actions;
export const domainsThunks = entity.thunks;
export default entity;