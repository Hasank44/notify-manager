import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Compass, Home, Search, Sparkles } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="relative flex h-full items-center justify-center overflow-hidden px-3 py-10">
            <div className="relative w-full max-w-xl text-center">
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141827]/95 via-[#101522]/95 to-[#0b0f1a]/95 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
                    <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="relative">
                        <div className="mb-3 flex justify-center">
                            <div className="relative">
                                <div className="absolute -inset-3 rounded-full bg-indigo-500/10 blur-xl" />
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 to-purple-500/10 shadow-lg shadow-indigo-950/30">
                                    <Compass
                                        size={30}
                                        strokeWidth={1.7}
                                        className="text-indigo-400"
                                    />
                                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#141827] bg-indigo-500">
                                        <Sparkles
                                            size={10}
                                            className="text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <h1 className="select-none bg-gradient-to-br from-white via-indigo-200 to-purple-400 bg-clip-text text-[40px] font-black leading-[0.85] tracking-[-0.06em] text-transparent drop-shadow-2xl sm:text-[50px]">
                                404
                            </h1>
                            <div className="mx-auto mt-2 h-px w-20 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
                        </div>
                        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                            Page not found
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
                            The page you're looking for doesn't exist, may have
                            been moved, or you may not have permission to access it.
                        </p>
                        <div className="mx-auto mt-3 flex max-w-md items-center gap-2 rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2.5 text-left">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                                <Search
                                    size={13}
                                    className="text-white/35"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="mb-0.5 text-[9px] font-medium uppercase tracking-wider text-white/25">
                                    Requested path
                                </p>
                                <code className="block truncate text-xs text-white/50">
                                    {location.pathname}
                                </code>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-xs font-medium text-white/70 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white active:scale-[0.98] sm:w-auto"
                            >
                                <ArrowLeft
                                    size={14}
                                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                                />
                                Go Back
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 text-xs font-semibold text-white shadow-lg shadow-indigo-950/30 transition-all duration-200 hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/20 active:scale-[0.98] sm:w-auto"
                            >
                                <Home
                                    size={14}
                                    className="transition-transform duration-200 group-hover:-translate-y-0.5"
                                />
                                Go to Dashboard
                            </button>
                        </div>
                        <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-white/25">
                            <span className="h-px w-8 bg-white/[0.06]" />
                            <span>Notify Manager</span>
                            <span className="text-white/10">•</span>
                            <span>Admin Panel</span>
                            <span className="h-px w-8 bg-white/[0.06]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;