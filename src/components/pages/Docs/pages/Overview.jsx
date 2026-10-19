import { Link } from "react-router";
import { ArrowRight, BookOpen, Compass, Globe, Server, Sparkles } from "lucide-react";
import Callout from "../components/Callout";

const SECTIONS = [
    { to: "/docs/quick-start", icon: Compass, title: "Quick Start", description: "Send your first notification in 5 minutes", },
    { to: "/docs/authentication", icon: BookOpen, title: "Authentication", description: "Login, register, refresh tokens", },
    { to: "/docs/public-api/notify", icon: Globe, title: "Public API", description: "Register customers, send notifications", },
    { to: "/docs/api/domains", icon: Server, title: "Management API", description: "Domains, bots, destinations, routes" },
];

const Overview = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Documentation</h1>
                <p className="mt-2 text-sm text-white/60">
                    Complete API reference for Notify Manager. Everything you need to
                    integrate Telegram notifications into your app.
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <span className="badge border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
                    <Sparkles size={10} />
                    REST API
                </span>
                <span className="badge border border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
                    v1.0
                </span>
                <span className="badge border border-cyan-500/30 bg-cyan-500/15 text-cyan-300">
                    JS / PHP / Python
                </span>
            </div>
            <Callout variant="info" title="What is Notify Manager?">
                Notify Manager is a centralized notification infrastructure that lets
                you send Telegram messages to your team and customers. No bot
                infrastructure, no rate limit headaches — just one API call.
            </Callout>
            <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Start Here</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {SECTIONS.map((section) => {
                        const Icon = section.icon;
                        return (
                            <Link
                                key={section.to}
                                to={section.to}
                                className="card-hover flex items-start gap-3 rounded-lg border border-white/10 bg-[#0B1220] p-4 transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.03]"
                            >
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <Icon size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-sm font-semibold text-gray-100">
                                            {section.title}
                                        </h3>
                                        <ArrowRight
                                            size={12}
                                            className="text-white/30 transition group-hover:text-indigo-400"
                                        />
                                    </div>
                                    <p className="mt-0.5 text-xs text-white/50">
                                        {section.description}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Base URL</h2>
                <div className="rounded-lg border border-white/10 bg-[#03030d] p-3">
                    <code className="text-sm text-indigo-300">{import.meta.env.VITE_BASE_URL || 'https://api-notify-manage.vercel.app/api/v1'}</code>
                </div>
                <p className="mt-2 text-xs text-white/40">All endpoints are relative to this URL.</p>
            </div>
            <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Response Format
                </h2>
                <p className="mb-2 text-sm text-gray-300">
                    All responses follow a consistent envelope:
                </p>
                <div className="rounded-lg border border-white/10 bg-[#03030d] p-3">
                    <pre className="overflow-x-auto text-[12px] text-gray-100">
                        {`// Success
{
  "success": true,
  "message": "Human-readable message",
  "requestId": "NTF-20261018-A8F92D",
  "data": { /* endpoint-specific payload */ }
}

// Error
{
  "success": false,
  "message": "What went wrong",
  "code": "MACHINE_READABLE_CODE",
  "requestId": "NTF-20261018-A8F92D"
}`}
                    </pre>
                </div>
            </div>
            <Callout variant="success" title="Ready to start?">
                Head over to the{" "}
                <Link
                    to="/docs/quick-start"
                    className="font-semibold text-emerald-300 underline-offset-2 hover:underline"
                >
                    Quick Start guide
                </Link>{" "}
                to send your first notification in 5 minutes.
            </Callout>
        </div>
    );
};

export default Overview;