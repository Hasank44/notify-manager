import { Link, useLocation } from "react-router";
import { ChevronRight, Home } from "lucide-react";

const LABELS = {
    docs: "Docs",
    "quick-start": "Quick Start",
    authentication: "Authentication",
    "public-api": "Public API",
    subscriptions: "Register Customer",
    notify: "Send Notification",
    api: "Management API",
    domains: "Domains",
    bots: "Bots",
    destinations: "Destinations",
    routes: "Routes",
    "user-subscriptions": "User Subscriptions",
    notifications: "Notifications",
    errors: "Error Codes",
    "rate-limits": "Rate Limits",
    troubleshooting: "Troubleshooting",
    faq: "FAQ",
    examples: "Examples",
};

const Breadcrumbs = () => {
    const location = useLocation();
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;
    const crumbs = segments.map((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        const label = LABELS[segment] || segment;
        const isLast = index === segments.length - 1;
        return { path, label, isLast };
    });

    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/50">
                <li>
                    <Link
                        to="/docs"
                        className="flex items-center gap-1 transition hover:text-white"
                    >
                        <Home size={11} />
                        <span>Docs</span>
                    </Link>
                </li>
                {crumbs.slice(1).map((crumb) => (
                    <li key={crumb.path} className="flex items-center gap-1.5">
                        <ChevronRight size={11} className="text-white/30" />
                        {crumb.isLast ? (
                            <span className="text-white/80" aria-current="page">
                                {crumb.label}
                            </span>
                        ) : (
                            <Link
                                to={crumb.path}
                                className="transition hover:text-white"
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;