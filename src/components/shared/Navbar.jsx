import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Bell, ChevronDown, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { toast } from "sonner";
import axiosInstance, { authStorage } from "@/api/axiosInstance";
import { setUser } from "@/redux/userSlice";
import { resetAllEntities } from "@/redux/entities";
import ENDPOINTS from "@/api/endpoints";
import Sidebar from "./Sidebar";

const PACKAGE_LABELS = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
    business: "Business",
    enterprise: "Enterprise",
};

const Navbar = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [pendingCounts, setPendingCounts] = useState({
        approvals: 0,
        userSubs: 0,
    });
    const profileRef = useRef(null);

    const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);
    const toggleProfile = useCallback(() => setProfileOpen((v) => !v), []);

    useEffect(() => {
        const handleOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    /* Fetch pending counts */
    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        const load = async () => {
            try {
                const response = await axiosInstance.get(ENDPOINTS.dashboard);
                if (!cancelled && response?.data) {
                    setPendingCounts({
                        approvals: response.data.pendingApprovals ?? 0,
                        userSubs: 0,
                    });
                }
            } catch {
                /* silent */
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [user]);

    const handleLogout = useCallback(async () => {
        if (!user) return;
        try {
            await axiosInstance.post(ENDPOINTS.auth.logout);
        } catch {
            /* ignore */
        } finally {
            authStorage.clear();
            dispatch(setUser(null));
            resetAllEntities(dispatch);
            toast.success("Logged out");
            navigate("/login");
        }
    }, [user, dispatch, navigate]);

    const handleProfile = () => {
        setProfileOpen(false);
        navigate("/profile");
    };

    const pkg = user?.packageId ?? user?.package ?? null;
    const packageLabel = pkg?.label ?? PACKAGE_LABELS[pkg?.name] ?? "—";

    return (
        <>
            <nav className="sticky left-0 top-0 z-30 w-full border-b border-white/10 bg-[#0B1220]/90 shadow-lg backdrop-blur-xl">
                <div className="flex h-14 items-center justify-between gap-2 px-3 md:px-5">
                    <div className="flex min-w-0 items-center gap-2">
                        {user && (
                            <button
                                type="button"
                                onClick={toggleSidebar}
                                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                            >
                                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                            </button>
                        )}
                        <div className="flex min-w-0 items-center gap-2">
                            {/* <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
                                <Bell size={16} className="text-white" />
                            </div> */}
                            <img src={'/notification-manager.webp'} className="h-8 w-auto rounded-full" alt="logo" />
                            <span className="hidden truncate bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-sm font-semibold text-transparent sm:inline md:text-base">
                                Notify Manager
                            </span>
                        </div>
                    </div>
                    {user && pkg && (
                        <div className="hidden items-center gap-2 md:flex">
                            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
                                {packageLabel}
                            </span>
                        </div>
                    )}
                    <div ref={profileRef} className="relative">
                        <button
                            type="button"
                            onClick={toggleProfile}
                            aria-expanded={profileOpen}
                            className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#0B1220] px-2.5 text-white transition hover:bg-white/10"
                        >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20">
                                <UserIcon size={13} className="text-indigo-300" />
                            </div>
                            <span className="hidden max-w-[100px] truncate text-sm sm:inline">
                                {user?.username ?? "Guest"}
                            </span>
                            <ChevronDown
                                size={14}
                                className={`hidden text-white/50 transition-transform sm:block ${profileOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {profileOpen && (
                            <div className="absolute right-0 top-12 z-[60] w-56 animate-fade-in overflow-hidden rounded-lg border border-white/10 bg-[#0B1220] p-1.5 shadow-2xl backdrop-blur-xl">
                                {user ? (
                                    <>
                                        <div className="border-b border-white/5 px-3 py-2">
                                            <p className="truncate text-sm font-medium text-gray-100">
                                                {user.name || user.username}
                                            </p>
                                            <p className="truncate text-xs text-white/40">
                                                {user.email}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleProfile}
                                            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                                        >
                                            <UserIcon size={14} />
                                            View Profile
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                                        >
                                            <LogOut size={14} />
                                            Log Out
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("/login");
                                        }}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                                    >
                                        <UserIcon size={14} />
                                        Sign In
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {user && (
                <Sidebar
                    isOpen={sidebarOpen}
                    menuToggle={closeSidebar}
                    pendingCounts={pendingCounts}
                />
            )}
        </>
    );
};

export default Navbar;