import { useEffect } from "react";
import { Outlet } from "react-router";
import { useDispatch } from "react-redux";
import axiosInstance, { authStorage } from "@/api/axiosInstance";
import { setUser } from "@/redux/userSlice";
import ENDPOINTS from "@/api/endpoints";
import Navbar from "./components/shared/Navbar";
import { onAuthExpired } from "@/api/authEvents";
import { resetAllEntities } from "@/redux/entities";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthExpired(() => {
      dispatch(setUser(null));
      resetAllEntities(dispatch);
    });

    const validate = async () => {
      const token = authStorage.getAccessToken();
      if (!token) return;
      try {
        const response = await axiosInstance.get(ENDPOINTS.auth.me);
        dispatch(setUser(response.data));
      } catch {
        /* Interceptor already handles auth failures via*/
      }
    };

    validate();
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <main className="min-h-screen min-w-full bg-gradient-to-r from-[#0a0c1a] via-[#0a0c1c] to-[#03030d] text-gray-100">
      <Navbar />
      <div className="px-3 py-3">
        <Outlet />
      </div>
    </main>
  );
};

export default App;