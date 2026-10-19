import { NavLink } from "react-router";
import { Compass, Globe, Key, Server, Shield } from "lucide-react";

const NAV = [
    {
        title: "Getting Started",
        icon: Compass,
        items: [
            { to: "/docs", label: "Overview", end: true },
            { to: "/docs/quick-start", label: "Quick Start" },
        ],
    },
    {
        title: "Authentication",
        icon: Key,
        items: [{ to: "/docs/authentication", label: "Overview" }],
    },
    {
        title: "Public API",
        icon: Globe,
        items: [
            { to: "/docs/public-api/subscriptions", label: "Register Customer" },
            { to: "/docs/public-api/notify", label: "Send Notification" },
        ],
    },
    {
        title: "Management API",
        icon: Server,
        items: [
            { to: "/docs/api/domains", label: "Domains" },
            { to: "/docs/api/bots", label: "Bots" },
            { to: "/docs/api/destinations", label: "Destinations" },
            { to: "/docs/api/routes", label: "Routes" },
            { to: "/docs/api/user-subscriptions", label: "User Subscriptions" },
            { to: "/docs/api/notifications", label: "Notifications" },
        ],
    },
    {
        title: "Reference",
        icon: Shield,
        items: [
            { to: "/docs/errors", label: "Error Codes" },
            { to: "/docs/rate-limits", label: "Rate Limits" },
            { to: "/docs/troubleshooting", label: "Troubleshooting" },
            { to: "/docs/faq", label: "FAQ" },
        ],
    },
];

const DocsSidebar = ({ onLinkClick }) => {
    return (
        <nav className="flex flex-col gap-3 pl-2 p-3 pb-20">
            {NAV.map((section) => {
                const Icon = section.icon;
                return (
                    <div key={section.title}>
                        <div className="mb-1.5 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            <Icon size={10} />
                            {section.title}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    onClick={onLinkClick}
                                    className={({ isActive }) =>
                                        `rounded-lg px-2.5 py-1.5 text-sm transition ${isActive
                                            ? "bg-indigo-500/15 text-indigo-300"
                                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                                        }`
                                    }
                                >
                                    {item?.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                );
            })}
            <div className="mt-3 border-t border-white/5 pt-3 text-center text-[10px] text-white/30">
                Notify Manager Docs
            </div>
        </nav>
    );
};

export default DocsSidebar;