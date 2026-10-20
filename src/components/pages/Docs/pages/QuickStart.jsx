import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import ResponseBlock from "../components/ResponseBlock";
import PageMeta from "../components/PageMeta";

const QuickStart = () => {
    return (
        <PageMeta
            description="Send your first Telegram notification in 5 minutes. Step-by-step setup guide."
            keywords="notify manager quick start, telegram notification setup"
            path="/quick-start"
        >
            <div className="space-y-3">
                <div>
                    <h1 className="page-title">Quick Start</h1>
                    <p className="mt-2 text-sm text-white/60">
                        Send your first Telegram notification in 5 minutes.
                    </p>
                </div>
                <Callout variant="info" title="Before you begin">
                    You'll need a Notify Manager account and a Telegram chat ID. No
                    coding required for the first setup — we'll test with cURL.
                </Callout>
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            1
                        </span>
                        <h2 className="text-lg font-semibold text-gray-100">
                            Create Account
                        </h2>
                    </div>
                    <p className="text-sm text-gray-300">
                        Register at{" "}
                        <Link
                            to="/register"
                            className="font-medium text-indigo-400 underline-offset-2 hover:underline"
                        >
                            /register
                        </Link>{" "}
                        with your name, email, phone, username, and password.
                    </p>
                    <Callout variant="success" title="Free plan is auto-assigned">
                        You'll get 1 domain, 100 notifications/month, and system bot access
                        immediately.
                    </Callout>
                </section>
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            2
                        </span>
                        <h2 className="text-lg font-semibold text-gray-100">
                            Get Your Telegram Chat ID
                        </h2>
                    </div>
                    <p className="text-sm text-gray-300">
                        Your chat ID identifies where Telegram messages go. It's a numeric
                        ID like <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">6862958488</code>.
                    </p>
                    <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-100">Get it via @userinfobot:</p>
                        <ol className="ml-5 list-decimal space-y-1 text-sm text-gray-300">
                            <li>Open Telegram and search <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">@userinfobot</code></li>
                            <li>Send <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">/start</code></li>
                            <li>Copy the numeric ID it returns (e.g., <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">6862958488</code>)</li>
                        </ol>
                    </div>
                    <Callout variant="warning" title="Alternative bots">
                        <code className="text-xs">@MyTelegramID_bot</code>,{" "}
                        <code className="text-xs">@getmyid_bot</code> — any of them works.
                    </Callout>
                </section>
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            3
                        </span>
                        <h2 className="text-lg font-semibold text-gray-100">
                            Start Our Bot
                        </h2>
                    </div>
                    <p className="text-sm text-gray-300">
                        Find{" "}
                        <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">
                            @all_notify_manager_bot
                        </code>{" "}
                        on Telegram and send <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">/start</code>.
                    </p>
                    <Callout variant="danger" title="Telegram requirement">
                        This step is <strong>mandatory</strong>. Telegram won't allow bots to
                        message users who haven't started a chat first. Without this, you'll
                        get <code className="text-xs">TELEGRAM_BAD_REQUEST</code> errors.
                    </Callout>
                </section>
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            4
                        </span>
                        <h2 className="text-lg font-semibold text-gray-100">Add a Domain</h2>
                    </div>
                    <p className="text-sm text-gray-300">
                        Go to <strong>Domains</strong> in the sidebar and add your website's
                        domain (e.g., <code className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-indigo-300">shop.yourname.com</code>).
                    </p>
                    <Callout variant="warning" title="Admin approval required">
                        New domains are pending until an admin verifies them (usually 1-24
                        hours). You'll be able to use it once verified.
                    </Callout>
                </section>
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            5
                        </span>
                        <h2 className="text-lg font-semibold text-gray-100">
                            Add a Destination
                        </h2>
                    </div>
                    <p className="text-sm text-gray-300">
                        Go to <strong>Destinations</strong> and add a static user destination:
                    </p>
                    <div className="mt-2 space-y-1 rounded-lg border border-white/10 bg-[#0B1220] p-3 text-sm">
                        <p><span className="text-white/50">Name:</span> <span className="text-gray-100">My Chat</span></p>
                        <p><span className="text-white/50">Type:</span> <span className="text-gray-100">user</span></p>
                        <p><span className="text-white/50">Identifier:</span> <code className="text-indigo-300">6862958488</code></p>
                        <p><span className="text-white/50">Bot:</span> <span className="text-gray-100">Main Bot (system)</span></p>
                    </div>
                </section>
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            6
                        </span>
                        <h2 className="text-lg font-semibold text-gray-100">Add a Route</h2>
                    </div>
                    <p className="text-sm text-gray-300">
                        Go to <strong>Routes</strong> and connect your domain + type to the
                        destination:
                    </p>
                    <div className="mt-2 space-y-1 rounded-lg border border-white/10 bg-[#0B1220] p-3 text-sm">
                        <p><span className="text-white/50">Domain:</span> <span className="text-gray-100">shop.yourname.com</span></p>
                        <p><span className="text-white/50">Type:</span> <span className="text-gray-100">custom</span></p>
                        <p><span className="text-white/50">Destinations:</span> <span className="text-gray-100">[✓ My Chat]</span></p>
                    </div>
                </section>
                {/* Step 7 (NEW): Generate API Key */}
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            7
                        </span>
                        <h2 className="text-lg font-semibold text-gray-100">
                            Generate an API Key
                        </h2>
                    </div>
                    <p className="text-sm text-gray-300">
                        Once your domain is verified by admin, generate an API key from{" "}
                        <strong>Domains → [your domain] → API Keys → New Key</strong>.
                    </p>
                    <Callout variant="warning" title="Save the key immediately">
                        The full key is shown only once. Copy it to a safe place (password
                        manager, environment variable) right away. If you lose it, rotate the
                        key.
                    </Callout>
                    <p className="mt-3 text-sm text-gray-300">
                        See{" "}
                        <Link
                            to="/docs/api-keys"
                            className="text-indigo-400 underline-offset-2 hover:underline"
                        >
                            API Keys documentation
                        </Link>{" "}
                        for rotation, revocation, and best practices.
                    </p>
                </section>
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            8
                        </span>
                        <h2 className="text-lg font-semibold text-gray-100">
                            Send Your First Notification
                        </h2>
                    </div>
                    <p className="mb-2 text-sm text-gray-300">
                        Use the public API to send a notification:
                    </p>
                    <CodeBlock
                        language="curl"
                        title="cURL"
                        code={`curl -X POST https://api-notify-manage.vercel.app/api/v1/notify \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: $NOTIFY_API_KEY" \\
  -d '{
    "type": "custom",
    "domain": "shop.yourname.com",
    "data": { "message": "Hello from Notify Manager!", "amount": 999 }
  }'`}
                    />

                    <ResponseBlock
                        status={202}
                        description="Notification accepted"
                        response={`{
  "success": true,
  "message": "Notification accepted",
  "requestId": "NTF-20261018-A8F92D",
  "data": {
    "requestId": "NTF-20261018-A8F92D",
    "status": "sent",
    "type": "custom",
    "domain": "your-domain.com",
    "deliveryCount": 1,
    "duplicate": false
  }
}`}
                    />

                    <Callout variant="success" title="Check your Telegram">
                        You should receive a message within a few seconds. If not, check{" "}
                        <Link
                            to="/docs/troubleshooting"
                            className="underline-offset-2 hover:underline"
                        >
                            Troubleshooting
                        </Link>
                        .
                    </Callout>
                </section>
                <section className="card">
                    <div className="mb-3 flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-400" />
                        <h2 className="text-lg font-semibold text-gray-100">Next Steps</h2>
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                to="/docs/authentication"
                                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                            >
                                Learn authentication
                                <ArrowRight size={12} />
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/docs/public-api/notify"
                                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                            >
                                Full notification API reference
                                <ArrowRight size={12} />
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/docs/public-api/subscriptions"
                                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                            >
                                Register customers (B2C)
                                <ArrowRight size={12} />
                            </Link>
                        </li>
                    </ul>
                </section>
            </div>
        </PageMeta>
    );
};

export default QuickStart;