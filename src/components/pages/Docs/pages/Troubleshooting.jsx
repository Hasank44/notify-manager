import { Link } from "react-router";
import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";

const Troubleshooting = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Troubleshooting</h1>
                <p className="mt-2 text-sm text-white/60">
                    Diagnose the most common problems. Follow the checklist in order.
                </p>
            </div>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    ❌ Notification not arriving
                </h2>
                <p className="mb-2 text-sm text-gray-300">
                    Use this 5-step checklist. Stop at the first failure.
                </p>
                <div className="space-y-2">
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-indigo-300">
                            Step 1 — Check delivery response status
                        </h3>
                        <p className="mb-2 text-xs text-white/60">
                            The notify response <code className="text-xs">status</code> field
                            tells you the outcome immediately.
                        </p>
                        <CodeBlock
                            language="json"
                            title="Response status meanings"
                            code={`{
  "status": "sent",     → all deliveries succeeded
  "status": "partial",  → some sent, some failed (check deliveries)
  "status": "failed",   → all failed
  "status": "noRoute"   → no route configured for this domain+type
}`}
                        />
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-indigo-300">
                            Step 2 — Verify customer registered
                        </h3>
                        <p className="mb-2 text-xs text-white/60">
                            If using B2C (userId), the customer must be registered first.
                        </p>
                        <CodeBlock
                            language="bash"
                            title="Check registration"
                            code={`curl "https://api-notify-manage.vercel.app/api/v1/user/user-subscriptions?search=user" \\
  -H "Authorization: Bearer $TOKEN"`}
                        />
                        <p className="mt-2 text-xs text-white/50">
                            Empty result → register via{" "}
                            <Link
                                to="/docs/public-api/subscriptions"
                                className="text-indigo-400 underline-offset-2 hover:underline"
                            >
                                POST /subscriptions
                            </Link>
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-indigo-300">
                            Step 3 — Confirm route exists and is approved
                        </h3>
                        <p className="mb-2 text-xs text-white/60">
                            No route = <code className="text-xs">noRoute</code> status.
                        </p>
                        <CodeBlock
                            language="bash"
                            title="Check routes for domain + type"
                            code={`curl "https://api-notify-manage.vercel.app/api/v1/user/routes?domainId=YOUR_ID&notificationTypeId=TYPE_ID" \\
  -H "Authorization: Bearer $TOKEN"`}
                        />
                        <p className="mt-2 text-xs text-white/50">
                            Look for <code className="text-xs">status: "approved"</code>,{" "}
                            <code className="text-xs">verified: true</code>,{" "}
                            <code className="text-xs">active: true</code>.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-indigo-300">
                            Step 4 — Check delivery errors
                        </h3>
                        <CodeBlock
                            language="bash"
                            title="Get per-destination errors"
                            code={`curl "https://api-notify-manage.vercel.app/api/v1/user/notifications?search=NTF-20261018-A8F92D" \\
  -H "Authorization: Bearer $TOKEN"`}
                        />
                        <p className="mt-2 text-xs text-white/50">
                            Then: <code className="text-xs">GET /user/notifications/:id/deliveries</code>{" "}
                            for per-destination errors.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-indigo-300">
                            Step 5 — Test the bot directly with Telegram
                        </h3>
                        <CodeBlock
                            language="bash"
                            title="Direct Telegram test"
                            code={`curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/sendMessage" \\
  -d "chat_id=<CHAT_ID>&text=test"`}
                        />
                        <p className="mt-2 text-xs text-white/50">
                            Response <code className="text-xs">"ok": false</code> → bot token
                            or chatId problem.
                        </p>
                    </div>
                </div>
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    ❌ Specific Error Fixes
                </h2>
                <div className="space-y-3">
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-red-300">
                            TELEGRAM_BAD_REQUEST
                        </h3>
                        <p className="mb-2 text-xs text-gray-300">
                            The user hasn't <code className="text-xs">/start</code>'d the bot
                            yet, or the chatId is wrong.
                        </p>
                        <p className="text-xs text-emerald-300">
                            Fix: Ask the user to open Telegram, find your bot, and send{" "}
                            <code className="text-xs">/start</code>.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-red-300">
                            TELEGRAM_AUTH_ERROR
                        </h3>
                        <p className="mb-2 text-xs text-gray-300">
                            The bot token is invalid or has been revoked via BotFather.
                        </p>
                        <p className="text-xs text-emerald-300">
                            Fix: Go to Bots → Edit → paste a fresh token from BotFather.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-red-300">
                            SUBSCRIBER_NOT_FOUND
                        </h3>
                        <p className="mb-2 text-xs text-gray-300">
                            The <code className="text-xs">userId</code> in your notify payload
                            doesn't match any registered subscription.
                        </p>
                        <p className="text-xs text-emerald-300">
                            Fix: Call{" "}
                            <Link
                                to="/docs/public-api/subscriptions"
                                className="text-indigo-400 underline-offset-2 hover:underline"
                            >
                                POST /subscriptions
                            </Link>{" "}
                            with the same <code className="text-xs">externalUserId</code>{" "}
                            before notifying.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-red-300">
                            PACKAGE_LIMIT_NOTIFICATIONS
                        </h3>
                        <p className="mb-2 text-xs text-gray-300">
                            You've used all notifications for the current month.
                        </p>
                        <p className="text-xs text-emerald-300">
                            Fix: Upgrade to a higher plan (Pro/Business/Enterprise) or wait for
                            the next month.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-red-300">
                            DOMAIN_NOT_FOUND
                        </h3>
                        <p className="mb-2 text-xs text-gray-300">
                            Domain not registered, or still pending admin approval.
                        </p>
                        <p className="text-xs text-emerald-300">
                            Fix: Check Domains page — look for{" "}
                            <code className="text-xs">status: "approved"</code>. Wait 1-24
                            hours after adding.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-red-300">
                            noRoute status
                        </h3>
                        <p className="mb-2 text-xs text-gray-300">
                            No route exists for this (domain, type) combination.
                        </p>
                        <p className="text-xs text-emerald-300">
                            Fix: Create a route in the Routes page. Each domain+type needs its
                            own route.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-red-300">
                            401 UNAUTHORIZED
                        </h3>
                        <p className="mb-2 text-xs text-gray-300">
                            Access token missing, expired (15 min), or malformed.
                        </p>
                        <p className="text-xs text-emerald-300">
                            Fix: Call{" "}
                            <Link
                                to="/docs/authentication"
                                className="text-indigo-400 underline-offset-2 hover:underline"
                            >
                                POST /auth/refresh
                            </Link>{" "}
                            with your refresh token to get a new access token.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="mb-1 text-sm font-semibold text-red-300">
                            PACKAGE_FEATURE_DISABLED
                        </h3>
                        <p className="mb-2 text-xs text-gray-300">
                            Trying to use a feature your plan doesn't include (e.g., B2C on Free
                            plan, own bot on Starter).
                        </p>
                        <p className="text-xs text-emerald-300">
                            Fix: Check{" "}
                            <Link
                                to="/docs/quick-start"
                                className="text-indigo-400 underline-offset-2 hover:underline"
                            >
                                your plan features
                            </Link>{" "}
                            or upgrade via Subscriptions.
                        </p>
                    </div>
                </div>
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    ❌ Getting 429 Too Many Requests
                </h2>
                <p className="mb-2 text-sm text-gray-300">
                    You're hitting the rate limit. See{" "}
                    <Link
                        to="/docs/rate-limits"
                        className="text-indigo-400 underline-offset-2 hover:underline"
                    >
                        Rate Limits
                    </Link>{" "}
                    for the full table.
                </p>
                <CodeBlock
                    language="js"
                    title="Backoff on 429"
                    code={`const res = await fetch(url, options);

if (res.status === 429) {
  const resetIn = Number(res.headers.get("RateLimit-Reset")) || 60;
  console.warn(\`Rate limited. Retrying in \${resetIn}s...\`);
  await new Promise(r => setTimeout(r, resetIn * 1000));
  return fetch(url, options);   // retry
}`}
                />
            </section>
            <Callout variant="info" title="Still stuck?">
                Gather these details and contact support:
                <ul className="mt-2 ml-4 list-disc space-y-1 text-xs">
                    <li>The <code>requestId</code> from the failing response</li>
                    <li>The endpoint and method</li>
                    <li>Your domain name</li>
                    <li>
                        The <code>deliveries[].error</code> value from{" "}
                        <code>GET /user/notifications/:id/deliveries</code>
                    </li>
                </ul>
            </Callout>
        </div>
    );
};

export default Troubleshooting;