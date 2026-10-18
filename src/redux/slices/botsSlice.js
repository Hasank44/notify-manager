import { createEntitySlice } from "../createEntitySlice";
import ENDPOINTS from "@/api/endpoints";

const entity = createEntitySlice({
    name: "bots",
    endpoint: ENDPOINTS.bots.list,
});

export const botsReducer = entity.reducer;
export const botsActions = entity.actions;
export const botsThunks = entity.thunks;
export default entity;