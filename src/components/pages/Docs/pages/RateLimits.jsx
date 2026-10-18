import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";

const LIMITS = [
    {
        endpoint: "POST /api/v1/notify",
        window: "60 sec",
        limit: "60",
        scope: "per IP",
        notes: "Public — abuse protection",
    },
    {
        endpoint: "POST /api/v1/subscriptions",
        window: "60 sec",
        limit: "60",
        scope: "per IP",
        notes: "Public — abuse protection",
    },
    {
        endpoint: "POST /user/auth/login",
        window: "15 min",
        limit: "10",
        scope: "per IP",
        notes: "Brute-force protection",
    },
    {
        endpoint: "POST /user/auth/register",
        window: "15 min",
        limit: "10",
        scope: "per IP",
        notes: "Brute-force protection",
    },
    {
        endpoint: "GET /api/v1/* (user)",
        window: "15 min",
        limit: "300",
        scope: "per IP",
        notes: "General user API",
    },
    {
        endpoint: "GET /api/v1/admin/*",
        window: "15 min",
        limit: "300",
        scope: "per IP",
        notes: "Admin API",
    },
];

const RateLimits = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Rate Limits</h1>
                <p className="mt-2 text-sm text-white/60">
                    Prevent abuse and keep the platform stable. Every response includes
                    rate-limit headers so you can adapt.
                </p>
            </div>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Default Limits
                </h2>
                <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                    <table className="w-full min-w-[640px] text-sm">
                        <thead className="bg-white/[0.03]">
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                    Endpoint
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                    Window
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                    Max
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                    Scope
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                    Notes
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {LIMITS.map((item) => (
                                <tr key={item.endpoint} className="border-t border-white/[0.06]">
                                    <td className="px-3 py-2">
                                        <code className="text-[11px] text-indigo-300">
                                            {item.endpoint}
                                        </code>
                                    </td>
                                    <td className="px-3 py-2 text-xs text-gray-300">{item.window}</td>
                                    <td className="px-3 py-2 text-xs text-gray-300">{item.limit}</td>
                                    <td className="px-3 py-2 text-xs text-gray-300">{item.scope}</td>
                                    <td className="px-3 py-2 text-xs text-white/50">{item.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-2 text-xs text-white/40">
                    All values configurable via environment. Contact support if you need
                    higher limits for legitimate high-volume use.
                </p>
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Response Headers
                </h2>
                <p className="mb-2 text-sm text-gray-300">
                    Every response includes standard rate-limit headers:
                </p>
                <CodeBlock
                    language="bash"
                    title="Response Headers"
                    code={`RateLimit-Limit: 60
RateLimit-Remaining: 47
RateLimit-Reset: 32
RateLimit-Policy: 60;w=60`}
                />
                <div className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                    <table className="w-full min-w-[500px] text-sm">
                        <thead className="bg-white/[0.03]">
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                    Header
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                    Meaning
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2">
                                    <code className="text-[11px] text-indigo-300">RateLimit-Limit</code>
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-300">
                                    Max requests in the current window
                                </td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2">
                                    <code className="text-[11px] text-indigo-300">RateLimit-Remaining</code>
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-300">
                                    Requests left before hitting the limit
                                </td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2">
                                    <code className="text-[11px] text-indigo-300">RateLimit-Reset</code>
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-300">
                                    Seconds until the window resets
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    When You Hit the Limit
                </h2>
                <CodeBlock
                    language="json"
                    title="HTTP 429"
                    code={`{
  "success": false,
  "message": "Notification rate limit exceeded. Please slow down.",
  "code": "NOTIFICATION_RATE_LIMITED",
  "requestId": "NTF-20261018-A8F92D"
}`}
                />
                <Callout variant="warning" title="Don't retry immediately">
                    Retry after waiting for <code className="text-xs">RateLimit-Reset</code>{" "}
                    seconds. Hammering the endpoint extends the window.
                </Callout>
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Best Practices for High Volume
                </h2>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                        ✅ <strong>Batch with throttling</strong> — send in loops with
                        <code className="mx-1 text-xs">await new Promise(r =&gt; setTimeout(r, 100))</code>
                        between calls
                    </li>
                    <li>
                        ✅ <strong>Use a queue</strong> — BullMQ, RabbitMQ, or Agenda for
                        larger volumes
                    </li>
                    <li>
                        ✅ <strong>Monitor RateLimit-Remaining</strong> — log it and alert if
                        it drops below 20%
                    </li>
                    <li>
                        ✅ <strong>Cache customer list</strong> — avoid repeated GET
                        /user-subscriptions on every notify
                    </li>
                    <li>
                        ✅ <strong>Batch notifications</strong> — if sending to N customers,
                        consider broadcast destination instead of N individual calls
                    </li>
                </ul>
                <CodeBlock
                    language="js"
                    title="Throttled batch sender"
                    code={`async function notifyMany(items, batchSize = 10) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    await Promise.all(batch.map(item =>
      fetch("https://iftyhasan.com/api/v1/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          domain: "shop.rahim.com",
          data: { userId: item.userId, orderId: item.orderId }
        })
      })
    ));

    // Pause between batches to stay under rate limit
    await new Promise(r => setTimeout(r, 200));
  }
}`}
                />
            </section>
        </div>
    );
};

export default RateLimits;