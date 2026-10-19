import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "@/redux/dashboardSlice";

const CACHE_TTL_MS = 30 * 1000;       // 30s cache
const AUTO_REFRESH_MS = 60 * 1000;    // 60s auto-refresh

export const useDashboard = () => {
    const dispatch = useDispatch();
    const { data, loading, error, lastFetchedAt } = useSelector((state) => state.dashboard);
    const intervalRef = useRef(null);
    const isFresh = lastFetchedAt && Date.now() - lastFetchedAt < CACHE_TTL_MS;

    const load = useCallback(
        (force = false) => {
            if (!force && isFresh) return Promise.resolve();
            return dispatch(fetchDashboard()).unwrap();
        },
        [dispatch, isFresh]
    );
    const refresh = useCallback(() => load(true), [load]);
    useEffect(() => {
        load().catch(() => { });
    }, []);

    useEffect(() => {
        const start = () => {
            if (intervalRef.current) return;
            intervalRef.current = setInterval(() => {
                load(true).catch(() => { });
            }, AUTO_REFRESH_MS);
        };
        const stop = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
        const onVis = () => {
            if (document.hidden) stop();
            else {
                if (!isFresh) load().catch(() => { });
                start();
            }
        };
        start();
        document.addEventListener("visibilitychange", onVis);
        return () => {
            stop();
            document.removeEventListener("visibilitychange", onVis);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, error, lastFetchedAt, refresh, isFresh };
};