/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const CACHE_TTL_MS = 5 * 60 * 1000;

const filtersEqual = (a, b) =>
    JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});

/* Safe default state when entity/state is missing */
const EMPTY_STATE = {
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

export const useEntity = (entity) => {
    const dispatch = useDispatch();

    const state = useSelector(
        (s) => (entity?.name ? s[entity.name] : null) ?? EMPTY_STATE
    );

    /* If entity is undefined, return stub with no-op actions */
    if (!entity || !entity.name) {
        console.error(
            "[useEntity] entity is undefined. Check entities.js registry.",
            entity
        );
        return {
            ...EMPTY_STATE,
            fetchAll: () => Promise.resolve([]),
            refresh: () => Promise.resolve([]),
            fetchById: () => Promise.resolve(null),
            create: () => Promise.reject(new Error("entity undefined")),
            update: () => Promise.reject(new Error("entity undefined")),
            remove: () => Promise.reject(new Error("entity undefined")),
            invalidate: () => { },
            setFilters: () => { },
            clearError: () => { },
        };
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetchAll = useCallback(
        (params = {}, { force = false } = {}) => {
            const isFresh =
                state.lastFetchedAt && Date.now() - state.lastFetchedAt < CACHE_TTL_MS;

            const canUseCache =
                !force &&
                state.loaded &&
                isFresh &&
                filtersEqual(params, state.filters);

            if (canUseCache) {
                return Promise.resolve(state.items);
            }

            return dispatch(entity.thunks.fetchAll(params)).unwrap();
        },
        [dispatch, entity, state.loaded, state.filters, state.lastFetchedAt, state.items]
    );

    const refresh = useCallback(
        (params) => {
            const finalParams = params ?? state.filters ?? {};
            return dispatch(entity.thunks.fetchAll(finalParams)).unwrap();
        },
        [dispatch, entity, state.filters]
    );

    const fetchById = useCallback(
        (id, { force = false } = {}) => {
            if (!force && state.detailCache[id]) {
                return Promise.resolve(state.detailCache[id]);
            }
            return dispatch(entity.thunks.fetchById(id)).unwrap();
        },
        [dispatch, entity, state.detailCache]
    );

    const create = useCallback(
        (data) => dispatch(entity.thunks.create(data)).unwrap(),
        [dispatch, entity]
    );

    const update = useCallback(
        (id, data) => dispatch(entity.thunks.update({ id, data })).unwrap(),
        [dispatch, entity]
    );

    const remove = useCallback(
        (id) => dispatch(entity.thunks.remove(id)).unwrap(),
        [dispatch, entity]
    );

    const invalidate = useCallback(
        () => dispatch(entity.actions.invalidate()),
        [dispatch, entity]
    );

    const setFilters = useCallback(
        (filters) => dispatch(entity.actions.setFilters(filters)),
        [dispatch, entity]
    );

    const clearError = useCallback(
        () => dispatch(entity.actions.clearError()),
        [dispatch, entity]
    );

    return {
        items: state.items ?? [],
        pagination: state.pagination ?? EMPTY_STATE.pagination,
        filters: state.filters ?? {},
        loading: Boolean(state.loading),
        loaded: Boolean(state.loaded),
        error: state.error ?? null,
        lastFetchedAt: state.lastFetchedAt,
        detail: state.detail,
        detailLoading: Boolean(state.detailLoading),
        detailCache: state.detailCache ?? {},

        fetchAll,
        refresh,
        fetchById,
        create,
        update,
        remove,
        invalidate,
        setFilters,
        clearError,
    };
};