import domains from "./slices/domainsSlice";
import bots from "./slices/botsSlice";
import destinations from "./slices/destinationsSlice";
import routes from "./slices/routesSlice";
import userSubscriptions from "./slices/userSubscriptionsSlice";
import notifications from "./slices/notificationsSlice";
import packages from "./slices/packagesSlice";
import notificationTypes from "./slices/notificationTypesSlice";

export const entities = {
    domains,
    bots,
    destinations,
    routes,
    userSubscriptions,
    notifications,
    packages,
    notificationTypes,
};

export const resetAllEntities = (dispatch) => {
    Object.values(entities).forEach((entity) => {
        dispatch(entity.actions.reset());
    });
};

export default entities;