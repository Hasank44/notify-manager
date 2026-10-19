import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { ArrowLeft, Menu, X, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import DocsSidebar from "./DocsSidebar";
import Breadcrumbs from "./components/Breadcrumbs";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "sonner";
import axiosInstance, { authStorage } from "@/api/axiosInstance";
import { setUser } from "@/redux/userSlice";
import { resetAllEntities } from "@/redux/entities";
import ENDPOINTS from "@/api/endpoints";

const DocsLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

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
            toast.success("Logout success");
            navigate("/login");
        }
    }, [user, dispatch, navigate]);

    const handleProfile = () => {
        setProfileOpen(false);
        navigate("/profile");
    };

    return (
        <main className="min-h-screen bg-gradient-to-r from-[#0a0c1a] via-[#0a0c1c] to-[#03030d] text-gray-100">
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-[#0B1220]/90 px-3 shadow-lg backdrop-blur-xl md:px-5">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen((v) => !v)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
                        aria-label="Toggle docs menu"
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(user ? '/' : '/login')}
                        className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft size={14} />
                        <span className="hidden text-sm sm:inline">Back to App</span>
                    </button>
                    <div className="flex min-w-0 items-center gap-2">
                        {/* <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
                            <Bell size={16} className="text-white" />
                        </div> */}
                        <img src={'/notification-manager.webp'} className="h-8 w-auto rounded-full" alt="logo" />
                        <span className="hidden truncate bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-sm font-semibold text-transparent sm:inline md:text-base">
                            Docs
                        </span>
                    </div>
                </div>
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
                                            {user?.name || user?.username}
                                        </p>
                                        <p className="truncate text-xs text-white/40">
                                            {user?.email}
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
            </header>
            <div className="flex">
                <div
                    className={`fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 overflow-y-auto border-r border-white/10 bg-[#0B1220] transition-transform duration-200 lg:sticky lg:top-14 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <DocsSidebar onLinkClick={() => setSidebarOpen(false)} />
                </div>
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 top-14 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                <article className="min-w-0 flex-1 px-3 py-3">
                    <Breadcrumbs />
                    <Outlet />
                </article>
            </div>
        </main>
    );
};

export default DocsLayout;