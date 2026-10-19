import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "./storage";
import userReducer from "./userSlice";

import dashboardSlice from './dashboardSlice';
import recentNotificationReducer from "./slices/recentNotificationSlice";
import { domainsReducer } from "./slices/domainsSlice";
import { botsReducer } from "./slices/botsSlice";
import { destinationsReducer } from "./slices/destinationsSlice";
import { routesReducer } from "./slices/routesSlice";
import { userSubscriptionsReducer } from "./slices/userSubscriptionsSlice";
import { notificationsReducer } from "./slices/notificationsSlice";
import { packagesReducer } from "./slices/packagesSlice";
import { notificationTypesReducer } from "./slices/notificationTypesSlice";

const userPersistConfig = {
    key: "nm-user",
    version: 1,
    storage,
    whitelist: ["user"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
    reducer: {
        dashboard: dashboardSlice,
        user: persistedUserReducer,
        domains: domainsReducer,
        bots: botsReducer,
        destinations: destinationsReducer,
        routes: routesReducer,
        userSubscriptions: userSubscriptionsReducer,
        notifications: notificationsReducer,
        packages: packagesReducer,
        notificationTypes: notificationTypesReducer,
        recentNotification: recentNotificationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "persist/PERSIST",
                    "persist/REHYDRATE",
                    "persist/PAUSE",
                    "persist/FLUSH",
                    "persist/PURGE",
                    "persist/REGISTER",
                ],
            },
        }),
    devTools: import.meta.env.VITE_APP_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;