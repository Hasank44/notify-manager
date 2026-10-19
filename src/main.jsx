import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import "./index.css";
import store, { persistor } from "./redux/store";
import App from "./App";
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";
import ProtectedRoute from "./components/web/ProtectedRoute";
import PublicRoute from "./components/web/PublicRoute";
import FullPageLoader from "./components/shared/FullPageLoader";
import NotFound from "./components/pages/NotFound";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import Domains from "./components/pages/Domains/Domains";
import Bots from "./components/pages/Bots/Bots";
import Destinations from "./components/pages/Destinations/Destinations";
import Routes from "./components/pages/Routes/Routes";
import UserSubscriptions from "./components/pages/UserSubscriptions/UserSubscriptions";
import Notifications from "./components/pages/Notifications/Notifications";
import Packages from "./components/pages/Packages/Packages";
import Profile from "./components/pages/Profile/Profile";
import Approvals from "./components/pages/Approvals/Approvals";

import DocsLayout from "./components/pages/Docs/DocsLayout";
import Overview from "./components/pages/Docs/pages/Overview";
import QuickStart from "./components/pages/Docs/pages/QuickStart";
import Authentication from "./components/pages/Docs/pages/Authentication";
import PublicApiSubscriptions from "./components/pages/Docs/pages/PublicApiSubscriptions";
import PublicApiNotify from "./components/pages/Docs/pages/PublicApiNotify";
import ApiDomains from "./components/pages/Docs/pages/ApiDomains";
import ApiBots from "./components/pages/Docs/pages/ApiBots";
import ApiDestinations from "./components/pages/Docs/pages/ApiDestinations";
import ApiRoutes from "./components/pages/Docs/pages/ApiRoutes";
import ApiUserSubscriptions from "./components/pages/Docs/pages/ApiUserSubscriptions";
import ApiNotifications from "./components/pages/Docs/pages/ApiNotifications";
import Errors from "./components/pages/Docs/pages/Errors";
import RateLimits from "./components/pages/Docs/pages/RateLimits";
import Troubleshooting from "./components/pages/Docs/pages/Troubleshooting";
import Faq from "./components/pages/Docs/pages/Faq";
import Examples from "./components/pages/Docs/Examples";

const router = createBrowserRouter([
  { path: "/login", element: (<PublicRoute><Login /></PublicRoute>)},
  { path: "/register", element: (<PublicRoute><Register /></PublicRoute>)},
  {
    path: "/",
    element: (<ProtectedRoute><App /></ProtectedRoute>),
    children: [
      { index: true, path: '/', element: <Dashboard /> },
      { path: "approvals", element: <Approvals /> },
      { path: "notifications", element: <Notifications /> },
      { path: "domains", element: <Domains /> },
      { path: "bots", element: <Bots /> },
      { path: "destinations", element: <Destinations /> },
      { path: "routes", element: <Routes /> },
      { path: "user-subscriptions", element: <UserSubscriptions /> },
      { path: "packages", element: <Packages /> },
      { path: "profile", element: <Profile /> },
      
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/docs",
    element: (<DocsLayout />),
    children: [
      { index: true, element: <Overview /> },
      { path: "quick-start", element: <QuickStart /> },
      { path: "authentication", element: <Authentication /> },
      { path: "public-api/subscriptions", element: <PublicApiSubscriptions /> },
      { path: "public-api/notify", element: <PublicApiNotify /> },
      { path: "api/domains", element: <ApiDomains /> },
      { path: "api/bots", element: <ApiBots /> },
      { path: "api/destinations", element: <ApiDestinations /> },
      { path: "api/routes", element: <ApiRoutes /> },
      { path: "api/user-subscriptions", element: <ApiUserSubscriptions /> },
      { path: "api/notifications", element: <ApiNotifications /> },
      { path: "errors", element: <Errors /> },
      { path: "rate-limits", element: <RateLimits /> },
      { path: "troubleshooting", element: <Troubleshooting /> },
      { path: "faq", element: <Faq /> },
      { path: "examples", element: <Examples /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<FullPageLoader />} persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster closeButton richColors position="top-center" />
      </PersistGate>
    </Provider>
  </StrictMode>
);