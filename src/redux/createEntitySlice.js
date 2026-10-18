import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

/* ─────────────────────────────────────────────────────────────
 * createEntitySlice — reusable slice factory for any API resource.
 *
 * Features:
 *   - items[] + pagination
 *   - loading + loaded + error
 *   - filters (current query params)
 *   - lastFetchedAt (for TTL-based cache)
 *   - detailCache (per-id)
 *   - Standard thunks: fetchAll, fetchById, create, update, remove
 *   - Standard actions: setFilters, invalidate, reset, clearError, clearDetail
 *   - Mutations auto-invalidate cache so the next read re-fetches
 * ───────────────────────────────────────────────────────────── */

export const createEntitySlice = ({ name, endpoint, extraReducers = null }) => {
    const initialState = {
        items: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 1 },
        filters: {},
        loading: false,
        loaded: false,
        error: null,
        lastFetchedAt: null,

        detail: null,
        detailLoading: false,
        detailCache: {},
    };

    /* ─── Thunks ─────────────────────────────────────────────── */
    const fetchAll = createAsyncThunk(
        `${name}/fetchAll`,
        async (params = {}, { rejectWithValue }) => {
            try {
                const response = await axiosInstance.get(endpoint, { params });
                return {
                    items: response?.data?.items ?? [],
                    pagination:
                        response?.data?.pagination ?? {
                            page: 1,
                            limit: 20,
                            total: 0,
                            pages: 1,
                        },
                    filters: params,
                };
            } catch (err) {
                return rejectWithValue(err.message || "Failed to fetch");
            }
        }
    );

    const fetchById = createAsyncThunk(
        `${name}/fetchById`,
        async (id, { rejectWithValue }) => {
            try {
                const response = await axiosInstance.get(`${endpoint}/${id}`);
                return { id, data: response?.data };
            } catch (err) {
                return rejectWithValue(err.message || "Failed to fetch");
            }
        }
    );

    const createItem = createAsyncThunk(
        `${name}/create`,
        async (payload, { rejectWithValue }) => {
            try {
                const response = await axiosInstance.post(endpoint, payload);
                return response?.data;
            } catch (err) {
                return rejectWithValue(err.message || "Failed to create");
            }
        }
    );

    const updateItem = createAsyncThunk(
        `${name}/update`,
        async ({ id, data }, { rejectWithValue }) => {
            try {
                const response = await axiosInstance.patch(`${endpoint}/${id}`, data);
                return response?.data;
            } catch (err) {
                return rejectWithValue(err.message || "Failed to update");
            }
        }
    );

    const removeItem = createAsyncThunk(
        `${name}/remove`,
        async (id, { rejectWithValue }) => {
            try {
                await axiosInstance.delete(`${endpoint}/${id}`);
                return id;
            } catch (err) {
                return rejectWithValue(err.message || "Failed to delete");
            }
        }
    );

    /* ─── Slice ─────────────────────────────────────────────── */
    const slice = createSlice({
        name,
        initialState,
        reducers: {
            setFilters: (state, action) => {
                state.filters = action.payload ?? {};
            },
            invalidate: (state) => {
                state.loaded = false;
                state.lastFetchedAt = null;
            },
            clearError: (state) => {
                state.error = null;
            },
            clearDetail: (state) => {
                state.detail = null;
            },
            reset: () => initialState,
        },
        extraReducers: (builder) => {
            /* fetchAll */
            builder.addCase(fetchAll.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
            builder.addCase(fetchAll.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.lastFetchedAt = Date.now();
                state.items = action.payload.items;
                state.pagination = action.payload.pagination;
                state.filters = action.payload.filters;
            });
            builder.addCase(fetchAll.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

            /* fetchById */
            builder.addCase(fetchById.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            });
            builder.addCase(fetchById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.detail = action.payload.data;
                state.detailCache[action.payload.id] = action.payload.data;
            });
            builder.addCase(fetchById.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            });

            /* create */
            builder.addCase(createItem.fulfilled, (state, action) => {
                state.loaded = false; // force refetch next read
                if (action.payload) {
                    state.items = [action.payload, ...state.items];
                    state.pagination.total += 1;
                }
            });

            /* update */
            builder.addCase(updateItem.fulfilled, (state, action) => {
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
                if (state.detail?.id === action.payload.id) {
                    state.detail = action.payload;
                }
                delete state.detailCache[action.payload.id];
            });

            /* remove */
            builder.addCase(removeItem.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i.id !== action.payload);
                state.pagination.total = Math.max(0, state.pagination.total - 1);
                delete state.detailCache[action.payload];
                if (state.detail?.id === action.payload) {
                    state.detail = null;
                }
            });

            /* caller-supplied reducers (e.g. approve/reject for approvals) */
            if (typeof extraReducers === "function") {
                extraReducers(builder);
            }
        },
    });

    return {
        name,
        reducer: slice.reducer,
        actions: slice.actions,
        thunks: {
            fetchAll,
            fetchById,
            create: createItem,
            update: updateItem,
            remove: removeItem,
        },
    };
};