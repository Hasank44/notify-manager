import { useEffect } from "react";
import { Outlet } from "react-router";
import { useDispatch } from "react-redux";
import axiosInstance, { authStorage } from "@/api/axiosInstance";
import { setUser } from "@/redux/userSlice";
import ENDPOINTS from "@/api/endpoints";
import Navbar from "./components/shared/Navbar";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) return;

    let cancelled = false;
    const validate = async () => {
      try {
        const response = await axiosInstance.get(ENDPOINTS.auth.me);
        if (!cancelled) dispatch(setUser(response.data));
      } catch {
        if (!cancelled) {
          authStorage.clear();
          dispatch(setUser(null));
        }
      }
    };
    validate();
    return () => {
      cancelled = true;
    };
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