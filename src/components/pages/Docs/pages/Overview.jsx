import { Link } from "react-router";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Compass, Globe, Key, MapPin, RouteIcon, Send, Server, Sparkles, UserPlus, Users } from "lucide-react";
import Callout from "../components/Callout";

const SECTIONS = [
    { to: "/docs/quick-start", icon: Compass, title: "Quick Start", description: "Send your first notification in 5 minutes", },
    { to: "/docs/authentication", icon: BookOpen, title: "Authentication", description: "Login, register, refresh tokens", },
    { to: "/docs/public-api/notify", icon: Globe, title: "Public API", description: "Register customers, send notifications", },
    { to: "/docs/api/domains", icon: Server, title: "Management API", description: "Domains, bots, destinations, routes" },
];

const JOURNEY_STEPS = [
    {
        number: 1,
        title: "Create your account",
        description:
            "Sign up with your name, email, phone, and a strong password. Free plan is assigned automatically.",
        icon: UserPlus,
        time: "30 seconds",
        link: "/register",
        linkLabel: "Register now",
        docsLink: "/docs/authentication",
        docsLabel: "Auth docs",
    },
    {
        number: 2,
        title: "Add your domain",
        description: "Add the domain that will send notifications. It starts as 'pending' — admin verifies it manually.",
        icon: Globe,
        time: "1 minute",
        docsLink: "/docs/api/domains",
        docsLabel: "Domains docs",
        note: "Wait for admin approval (1-24 hours)",
    },
    {
        number: 3,
        title: "Wait for admin verification",
        description: "An admin reviews your domain. You'll get notified once approved. Nothing to do here — just wait.",
        icon: CheckCircle2,
        time: "1-24 hours",
        status: "waiting",
    },
    {
        number: 4,
        title: "Generate an API key",
        description: "Once your domain is verified, generate a domain-scoped API key. Save it securely — it's shown only once.",
        icon: Key,
        time: "10 seconds",
        docsLink: "/docs/api-keys",
        docsLabel: "API keys docs",
        note: "Required for all API calls",
    },
    {
        number: 5,
        title: "Add a destination",
        description: "Choose where notifications go: your personal chat, a team group, a channel, or a dynamic B2C destination.",
        icon: MapPin,
        time: "2 minutes",
        docsLink: "/docs/api/destinations",
        docsLabel: "Destinations docs",
        note: "Requires own bot (Pro+) or system bot (Free/Starter)",
    },
    {
        number: 6,
        title: "Create a route",
        description: "Connect a domain + notification type → one or more destinations. This is where routing happens.",
        icon: RouteIcon,
        time: "1 minute",
        docsLink: "/docs/api/routes",
        docsLabel: "Routes docs",
        note: "One route per (domain + type) combination",
    },
    {
        number: 7,
        title: "Register B2C customers (optional)",
        description: "If sending to end-customers, register their chatIds. Skip this if using static destinations only.",
        icon: Users,
        time: "Automatic or manual",
        docsLink: "/docs/public-api/subscriptions",
        docsLabel: "Register customer",
        optional: true,
    },
    {
        number: 8,
        title: "Send your first notification",
        description: "Call POST /api/v1/notify with your API key. Telegram delivery happens automatically — usually within 1-2 seconds.",
        icon: Send,
        time: "1 API call",
        docsLink: "/docs/public-api/notify",
        docsLabel: "Notify API",
        highlight: true,
    },
];

const Overview = () => {
    const JourneyStep = ({ step, isLast }) => {
        const Icon = step.icon;
        return (
            <div className="relative flex gap-3">
                <div className="flex flex-shrink-0 flex-col items-center">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step.highlight
                                ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                                : step.status === "waiting"
                                    ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                                    : "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30"
                            }`}
                    >
                        {step.number}
                    </div>
                    {!isLast && (
                        <div className="mt-1 w-px flex-1 bg-gradient-to-b from-white/10 to-white/5" />
                    )}
                </div>
                <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-5"}`}>
                    <div className="flex flex-wrap items-center gap-2">
                        <div
                            className={`flex h-6 w-6 items-center justify-center rounded-md ${step.highlight
                                    ? "bg-indigo-500/20 text-indigo-300"
                                    : "bg-white/5 text-white/50"
                                }`}
                        >
                            <Icon size={12} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-100">{step.title}</h3>
                        {step.optional && (
                            <span className="badge border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                                Optional
                            </span>
                        )}
                        {step.status === "waiting" && (
                            <span className="badge border border-amber-500/30 bg-amber-500/10 text-amber-300">
                                <Clock size={9} />
                                Waiting
                            </span>
                        )}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                        {step?.description}
                    </p>
                    {step.note && (
                        <p className="mt-1 text-[11px] text-white/40">
                            <span className="text-white/50">Note:</span> {step?.note}
                        </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
                            <Clock size={9} />
                            {step.time}
                        </span>
                        {step?.link && (
                            <Link
                                to={step.link}
                                className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
                            >
                                {step.linkLabel} →
                            </Link>
                        )}
                        {step?.docsLink && (
                            <Link
                                to={step?.docsLink}
                                className="text-[11px] text-cyan-500/90 underline-offset-2 hover:text-cyan-500 hover:underline"
                            >
                                {step.docsLabel}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    
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
                <div className="mb-4 flex items-baseline justify-between gap-2">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-100">
                            Your Complete Journey
                        </h2>
                        <p className="mt-1 text-xs text-white/50">
                            From signup to first notification — 8 steps, ~30 minutes of setup
                        </p>
                    </div>
                    <span className="hidden text-[10px] uppercase tracking-wider text-white/30 sm:inline">
                        Step by Step
                    </span>
                </div>
                <div className="card">
                    {JOURNEY_STEPS.map((step, index) => (
                        <JourneyStep
                            key={step.number}
                            step={step}
                            isLast={index === JOURNEY_STEPS.length - 1}
                        />
                    ))}
                </div>
                <Callout variant="success" title="You're done!">
                    Once you complete these 8 steps, notification delivery works
                    end-to-end. Most users finish setup in <strong>under 30 minutes</strong>{" "}
                    (excluding admin domain approval wait time).
                </Callout>
            </div>
            <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Start Here</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {SECTIONS.map((section) => {
                        const Icon = section?.icon;
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