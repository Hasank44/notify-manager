import { useSelector } from "react-redux";
import { NavLink } from "react-router";
import {
    Bell, Bot, CheckSquare, BookOpen, GitBranch, Globe, LayoutDashboard, MapPin, Package, Users, User, X
} from "lucide-react";

const buildMenu = (pkg) => {
    const allowOwnBot = pkg?.allowOwnBot === true;
    const allowB2C = pkg?.allowB2C === true;

    return [
        { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/approvals", label: "Approvals", icon: CheckSquare, badgeKey: "approvals" },
        { to: "/notifications", label: "Notifications", icon: Bell },
        { divider: true },
        { to: "/domains", label: "Domains", icon: Globe },
        /* Show Bots always — locked state handled in page */
        { to: "/bots", label: "Telegram Bots", icon: Bot, locked: !allowOwnBot },
        { to: "/destinations", label: "Destinations", icon: MapPin },
        { to: "/routes", label: "Routes", icon: GitBranch },
        allowB2C && {
            to: "/user-subscriptions",
            label: "User Subscriptions",
            icon: Users,
            badgeKey: "userSubs",
        },
        { divider: true },
        { to: "/packages", label: "Packages", icon: Package },
        { to: "/profile", label: "Profile", icon: User },
        { to: "/docs", label: "Documentation", icon: BookOpen },
    ].filter(Boolean);
};

const Sidebar = ({ isOpen, menuToggle, pendingCounts = {} }) => {
    const user = useSelector((state) => state.user.user);
    const pkg = user?.packageId ?? user?.package ?? null;
    const menu = buildMenu(pkg);

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                onClick={menuToggle}
                aria-hidden="true"
            />
            <aside
                className={`fixed left-0 top-0 z-50 h-full w-64 overflow-y-auto border-r border-white/10 bg-[#0B1220] shadow-2xl transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                aria-hidden={!isOpen}
            >
                <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-base font-semibold text-transparent">
                        Menu
                    </span>
                    <button
                        type="button"
                        onClick={menuToggle}
                        aria-label="Close menu"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
                <nav className="flex flex-col gap-0.5 p-3">
                    {menu.map((item, index) => {
                        if (item.divider) {
                            return (
                                <div
                                    key={`divider-${index}`}
                                    className="my-2 h-px w-full bg-white/10"
                                />
                            );
                        }
                        const Icon = item.icon;
                        const badge = item.badgeKey ? pendingCounts[item.badgeKey] : null;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={menuToggle}
                                className={({ isActive }) =>
                                    `flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                                        ? "bg-indigo-500/15 text-indigo-300"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="flex items-center gap-2.5">
                                            <Icon
                                                size={16}
                                                className={isActive ? "text-indigo-400" : "text-white/50"}
                                            />
                                            {item.label}
                                        </span>
                                        {item.locked ? (
                                            <span
                                                title="Upgrade plan to unlock"
                                                className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300"
                                            >
                                                🔒
                                            </span>
                                        ) : (
                                            badge > 0 && (
                                                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                                    {badge}
                                                </span>
                                            )
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;