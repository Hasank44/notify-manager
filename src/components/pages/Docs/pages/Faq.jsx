import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
    {
        category: "Getting Started",
        items: [
            {
                q: "What is Notify Manager?",
                a: "Notify Manager is a centralized notification infrastructure that lets you send Telegram messages to your team (B2B) and customers (B2C) through one simple API. No bot infrastructure needed — just register your domain, add destinations, and send notifications.",
            },
            {
                q: "Do I need my own Telegram bot?",
                a: "Free and Starter plans use the shared system bot (@all_notify_manager_bot) — no own bot needed. Pro, Business, and Enterprise plans can register their own bot for custom branding and B2C customer capture via webhook.",
            },
            {
                q: "How do I get my Telegram chatId?",
                a: "Open Telegram, search @userinfobot, send /start. It replies with your numeric ID (e.g., 6862958488). Alternative bots: @MyTelegramID_bot, @getmyid_bot. All work the same way.",
            },
            {
                q: "How long does domain approval take?",
                a: "Usually 1-24 hours. You'll get an email notification when approved. If you need faster approval, contact support.",
            },
        ],
    },
    {
        category: "B2B vs B2C",
        items: [
            {
                q: "What's the difference between B2B and B2C?",
                a: "B2B: send notifications to your own team (fixed chats, groups, channels). B2C: send to your customers (dynamic lookup by userId). B2C requires Pro+ plan (or Starter with technical workarounds).",
            },
            {
                q: "Can I use B2C on Free or Starter plan?",
                a: "Free plan: no B2C. Starter plan: B2C enabled but requires manual customer chatId collection (no webhook). For automatic B2C, upgrade to Pro+ (own bot required for webhook).",
            },
            {
                q: "How many customers can I add?",
                a: "Pro/Enterprise: unlimited (limited by your monthly notification quota). You can bulk upload up to 5000 customers per request.",
            },
            {
                q: "How does B2C work?",
                a: "1) Your customer /start's your bot. 2) Your server captures their chatId. 3) You call POST /subscriptions to save the mapping. 4) On each event, call POST /notify with data.userId. We look up the chatId and deliver.",
            },
        ],
    },
    {
        category: "API & Rate Limits",
        items: [
            {
                q: "Is the public API authenticated?",
                a: "No. Both POST /api/v1/notify and POST /api/v1/subscriptions are tokenless. Protection comes from domain allowlist, rate limiting, strict validation, and admin approval of domains.",
            },
            {
                q: "What are the rate limits?",
                a: "Public API: 60 requests/min per IP. Auth endpoints: 10/15 min. Admin endpoints: 300/15 min. See the Rate Limits page for full details.",
            },
            {
                q: "Do I need to register notification types?",
                a: "No. You can use any type string. If the type doesn't exist in the database, we automatically fall back to the 'custom' route. Your requested type appears in the message header (uppercase).",
            },
            {
                q: "What's the max request body size?",
                a: "10kb. This is enforced by the express.json middleware and includes the entire JSON payload. If you need more, contact support.",
            },
        ],
    },
    {
        category: "Troubleshooting",
        items: [
            {
                q: "Why isn't my message arriving?",
                a: "Check 3 things: 1) Domain is approved+verified. 2) Route exists for your domain+type. 3) Customer is registered (if B2C) AND has /start'd the bot. See the Troubleshooting page for the full checklist.",
            },
            {
                q: "I get TELEGRAM_BAD_REQUEST. What's wrong?",
                a: "The user hasn't started a chat with your bot yet. Telegram requires users to /start a bot before it can message them. Ask the user to open Telegram and send /start to your bot.",
            },
            {
                q: "I get SUBSCRIBER_NOT_FOUND. What's wrong?",
                a: "The userId you're sending doesn't match any registered customer. Register the customer via POST /api/v1/subscriptions first (with the same externalUserId you're using in data.userId).",
            },
            {
                q: "My bot token says invalid. Why?",
                a: "The token was revoked via BotFather, or contains a typo. Get a fresh token from @BotFather → /mybots → select bot → API Token. Then update the bot in your panel.",
            },
        ],
    },
    {
        category: "Billing & Plans",
        items: [
            {
                q: "How do I upgrade my plan?",
                a: "Go to Subscriptions in the sidebar and submit an upgrade request. Admin will review and approve (usually within 1 business day). You'll get an email confirmation.",
            },
            {
                q: "What happens if I exceed my monthly quota?",
                a: "New notifications are rejected with 402 PACKAGE_LIMIT_NOTIFICATIONS. The quota resets on the 1st of each month (UTC). Upgrade your plan to increase the limit.",
            },
            {
                q: "Can I change plans mid-month?",
                a: "Yes. Submit a new subscription request. Once approved, your new plan takes effect immediately. The previous plan is marked as expired in your subscription history.",
            },
            {
                q: "Do I get a refund if I downgrade?",
                a: "Contact support to discuss your specific situation. Refund policy depends on the payment method and remaining subscription time.",
            },
        ],
    },
    {
        category: "Security & Data",
        items: [
            {
                q: "How are bot tokens stored?",
                a: "Tokens are AES-256-GCM encrypted at rest. They're never returned in API responses — only a masked preview (first 4 + last 4 chars) is shown. Backend decrypts only when sending a message.",
            },
            {
                q: "Who can see my customer data?",
                a: "Only you. Database queries are scoped by ownerId — no user can see another user's domains, bots, destinations, or customers.",
            },
            {
                q: "Can I delete all my data?",
                a: "Yes. You can delete individual resources via the API or panel. To delete your entire account, contact support — we'll purge everything within 30 days.",
            },
            {
                q: "Where is data hosted?",
                a: "MongoDB Atlas (encrypted at rest). Backend runs on Vercel. All traffic uses HTTPS. We never sell or share your data.",
            },
        ],
    },
];

const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-lg border border-white/10 bg-[#0B1220] overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/[0.02]"
            >
                <span className="text-sm font-medium text-gray-100">{q}</span>
                <ChevronDown
                    size={16}
                    className={`flex-shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </button>
            {open && (
                <div className="border-t border-white/5 px-4 py-3">
                    <p className="text-sm text-gray-300">{a}</p>
                </div>
            )}
        </div>
    );
};

const Faq = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">FAQ</h1>
                <p className="mt-2 text-sm text-white/60">
                    Frequently asked questions. Click any question to expand the answer.
                </p>
            </div>
            {FAQS.map((category) => (
                <section key={category.category}>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        {category.category}
                    </h2>
                    <div className="space-y-2">
                        {category.items.map((item, i) => (
                            <FaqItem key={`${category.category}-${i}`} q={item.q} a={item.a} />
                        ))}
                    </div>
                </section>
            ))}
            <section className="card">
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Didn't find what you were looking for?
                </h2>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                        →{" "}
                        <Link
                            to="/docs/quick-start"
                            className="text-indigo-400 underline-offset-2 hover:underline"
                        >
                            Quick Start guide
                        </Link>{" "}
                        — 7-step setup
                    </li>
                    <li>
                        →{" "}
                        <Link
                            to="/docs/troubleshooting"
                            className="text-indigo-400 underline-offset-2 hover:underline"
                        >
                            Troubleshooting
                        </Link>{" "}
                        — common errors
                    </li>
                    <li>
                        →{" "}
                        <Link
                            to="/docs/errors"
                            className="text-indigo-400 underline-offset-2 hover:underline"
                        >
                            Error Codes
                        </Link>{" "}
                        — full reference
                    </li>
                    <li>→ Telegram support at @hasank44 (include requestId)</li>
                </ul>
            </section>
        </div>
    );
};

export default Faq;