import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { ArrowLeft, Menu, X } from "lucide-react";
import DocsSidebar from "./DocsSidebar";
import Breadcrumbs from "./components/Breadcrumbs";

const DocsLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
                        onClick={() => navigate("/")}
                        className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft size={14} />
                        <span className="hidden text-sm sm:inline">Back to App</span>
                    </button>
                    <span className="hidden bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-sm font-semibold text-transparent sm:inline">
                        Docs
                    </span>
                </div>
                <span className="text-xs text-white/40">v1.0</span>
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