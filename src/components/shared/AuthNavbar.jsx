import { Link, useLocation } from "react-router";
import { Bell, BookOpen } from "lucide-react";

const AuthNavbar = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login" || location.pathname === "/register";

    return (
        <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-[#0B1220]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 items-center justify-between px-3">
                <Link
                    to="/"
                    className="flex items-center gap-2 transition hover:opacity-80"
                >
                    <div className="flex min-w-0 items-center gap-2">
                        {/* <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
                            <Bell size={16} className="text-white" />
                        </div> */}
                        <img src={'/notification-manager.webp'} className="h-8 w-auto rounded-full" alt="logo" />
                        <span className="hidden truncate bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-sm font-semibold text-transparent sm:inline md:text-base">
                            Notify Manager
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    {isLoginPage && (
                        <Link
                            to="/docs"
                            className="btn-secondary btn-sm"
                        >
                            <BookOpen size={20} />
                            <span className="">Docs</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AuthNavbar;