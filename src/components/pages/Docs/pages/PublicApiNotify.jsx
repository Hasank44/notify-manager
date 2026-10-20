import { Link } from "react-router";
import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import FieldTable from "../components/FieldTable";
import ResponseBlock from "../components/ResponseBlock";
import EndpointCard from "../components/EndpointCard";
import PageMeta from "../components/PageMeta";

const STATUS_EXPLAINER = [
    {
        status: "sent",
        color: "text-emerald-300",
        meaning: "All deliveries successful",
    },
    {
        status: "partial",
        color: "text-amber-300",
        meaning: "Some sent, some failed/skipped",
    },
    {
        status: "failed",
        color: "text-red-300",
        meaning: "All deliveries failed",
    },
    {
        status: "noRoute",
        color: "text-purple-300",
        meaning: "No route configured for this domain + type",
    },
];

const PublicApiNotify = () => {
    return (
        <PageMeta
            description="Send a Telegram notification through your domain via the public API. Supports B2B static destinations, B2C dynamic customers, and broadcast to all subscribers."
            keywords="send telegram notification api, notify manager, b2b b2c notifications"
            path="/public-api/notify"
        >
            <div className="space-y-3">
                <div>
                    <h1 className="page-title">Send Notification</h1>
                    <p className="mt-2 text-sm text-white/60">
                        Send a notification through your domain. Automatically routed to
                        configured destinations (B2B fixed chats, B2C dynamic customers, or
                        broadcast to all subscribers).
                    </p>
                </div>
                <EndpointCard
                    method="POST"
                    path="/api/v1/notify"
                    description="Send a notification. Requires X-API-Key header."
                    meta={
                        <>
                            <span>🔑 X-API-Key required</span>
                            <span>⏱️ 60 requests/min per IP</span>
                            <span>💾 Optional Idempotency-Key</span>
                        </>
                    }
                />
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Required Headers
                    </h2>
                    <FieldTable
                        fields={[
                            {
                                name: "X-API-Key",
                                type: "string",
                                required: "required",
                                description:
                                    "Your domain's API key (starts with sk_live_). Generate from Domains → API Keys.",
                            },
                            {
                                name: "Content-Type",
                                type: "string",
                                required: "required",
                                description: "Must be application/json",
                            },
                            {
                                name: "Idempotency-Key",
                                type: "string",
                                required: "optional",
                                description:
                                    "Prevent duplicate processing (min 8 chars). Same key + same domain = no duplicate send.",
                            },
                        ]}
                    />

                    <Callout variant="info" title="Need a key?">
                        Generate one from the{" "}
                        <Link
                            to="/docs/api-keys"
                            className="underline-offset-2 hover:underline"
                        >
                            API Keys
                        </Link>{" "}
                        page. Requires a verified domain. Alternatively, you can send the
                        key as <code className="text-xs">Authorization: Bearer sk_live_...</code>.
                    </Callout>
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Request Body
                    </h2>
                    <FieldTable
                        fields={[
                            {
                                name: "type",
                                type: "string",
                                required: "required",
                                description:
                                    "Notification type (e.g., custom, order, error). Any string works — unknown types fall back to custom.",
                            },
                            {
                                name: "domain",
                                type: "string",
                                required: "required",
                                description: "Your verified domain",
                            },
                            {
                                name: "data",
                                type: "object",
                                required: "required",
                                description: "Message payload (free-form JSON)",
                            },
                            {
                                name: "data.userId",
                                type: "string",
                                required: "conditional",
                                description:
                                    "Required for B2C — the customer's externalUserId",
                            },
                            {
                                name: "data.*",
                                type: "any",
                                required: "optional",
                                description:
                                    "Any custom fields (orderId, amount, message, etc.)",
                            },
                        ]}
                    />
                    <Callout variant="danger" title="Forbidden fields">
                        These will be <strong>rejected</strong> with{" "}
                        <code className="text-xs">FORBIDDEN_FIELD</code>:{" "}
                        <code className="text-xs">chatId</code>,{" "}
                        <code className="text-xs">botId</code>,{" "}
                        <code className="text-xs">destinationId</code>,{" "}
                        <code className="text-xs">routeId</code>,{" "}
                        <code className="text-xs">token</code>. Routing is always
                        server-controlled.
                    </Callout>
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Idempotency (Optional)
                    </h2>
                    <p className="mb-2 text-sm text-gray-300">
                        Prevent duplicate processing by sending an{" "}
                        <code className="text-xs">Idempotency-Key</code> header:
                    </p>
                    <CodeBlock
                        language="bash"
                        title="Header"
                        code={`Idempotency-Key: unique-string-min-8-chars`}
                    />
                    <p className="mt-2 text-xs text-white/50">
                        Same key + same domain = duplicate detection (returns{" "}
                        <code className="text-xs">duplicate: true</code> with HTTP 200
                        instead of 202).
                    </p>
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Three Usage Scenarios
                    </h2>
                    <div className="space-y-3">
                        {/* Scenario A */}
                        <div className="card">
                            <h3 className="mb-2 text-sm font-semibold text-indigo-300">
                                Scenario A: B2C (specific customer)
                            </h3>
                            <p className="mb-2 text-xs text-white/60">
                                Send to one registered customer by their externalUserId.
                            </p>
                            <CodeBlock
                                language="json"
                                title="Body"
                                code={`{
  "type": "order",
  "domain": "your-domain.com",
  "data": {
    "userId": "customer-name",
    "orderId": "ORD-5001",
    "amount": 2500,
    "status": "shipped"
  }
}`}
                            />
                            <p className="mt-2 text-xs text-white/40">
                                → Goes to{" "}
                                <code className="text-indigo-300">customer-name</code>'s Telegram
                                (must be registered via{" "}
                                <code className="text-indigo-300">/subscriptions</code> first)
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="mb-2 text-sm font-semibold text-cyan-300">
                                Scenario B: Broadcast (all subscribers)
                            </h3>
                            <p className="mb-2 text-xs text-white/60">
                                Send to ALL active subscribers of the domain. No userId needed.
                            </p>
                            <CodeBlock
                                language="json"
                                title="Body"
                                code={`{
  "type": "announcement",
  "domain": "your-domain.com",
  "data": {
    "title": "New Feature Launch",
    "message": "Check out our new dashboard!"
  }
}`}
                            />
                            <p className="mt-2 text-xs text-white/40">
                                → Goes to all subscribers (requires{" "}
                                <code className="text-cyan-300">user_dynamic_broadcast</code>{" "}
                                destination in the route)
                            </p>
                        </div>

                        {/* Scenario C */}
                        <div className="card">
                            <h3 className="mb-2 text-sm font-semibold text-emerald-300">
                                Scenario C: B2B (static destinations only)
                            </h3>
                            <p className="mb-2 text-xs text-white/60">
                                Send to fixed destinations (groups, channels, your own chat).
                            </p>
                            <CodeBlock
                                language="json"
                                title="Body"
                                code={`{
  "type": "error",
  "domain": "your-domain.com",
  "data": {
    "message": "Database connection lost",
    "severity": "critical"
  }
}`}
                            />
                            <p className="mt-2 text-xs text-white/40">
                                → Goes to static destinations in the route (team group, admin
                                chat, etc.)
                            </p>
                        </div>
                    </div>
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">Request</h2>
                    <CodeBlock
                        language="js"
                        title="JavaScript"
                        code={`const NOTIFY_API = "https://api-notify-manage.vercel.app/api/v1";
const API_KEY = process.env.NOTIFY_API_KEY;
const DOMAIN = "your-domain.com";

async function sendNotification(order) {
  const response = await fetch(\`\${NOTIFY_API}/notify\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
      // Alternative: "Authorization": \`Bearer \${API_KEY}\`
      "Idempotency-Key": \`order-\${order.id}\`, // prevents duplicates
    },
    body: JSON.stringify({
      type: "order",
      domain: DOMAIN,
      data: {
        userId: order.customerExternalId,
        orderId: order.id,
        amount: order.total,
        status: "shipped",
      },
    }),
  });

  const result = await response.json();

  if (result.success) {
    console.log("Sent! Request ID:", result.data.requestId);
    console.log("Status:", result.data.status);
    console.log("Deliveries:", result.data.deliveryCount);
    console.log("Duplicate:", result.data.duplicate);
  } else {
    console.error("Failed:", result.code, result.message);
  }

  return result;
}`}
                    />
                </section>
                <section>
                    <CodeBlock
                        language="php"
                        title="PHP"
                        code={`<?php

function sendNotification($order) {
    $apiKey = getenv("NOTIFY_API_KEY");
    $domain = "your-domain.com";

    $payload = [
        "type"   => "order",
        "domain" => $domain,
        "data"   => [
            "userId"  => $order["customerExternalId"],
            "orderId" => $order["id"],
            "amount"  => $order["total"],
            "status"  => "shipped",
        ],
    ];

    $ch = curl_init("https://api-notify-manage.vercel.app/api/v1/notify");
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            "Content-Type: application/json",
            "X-API-Key: " . $apiKey,
            "Idempotency-Key: order-" . $order["id"],
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload),
    ]);

    $response = curl_exec($ch);
    curl_close($ch);
    $result = json_decode($response, true);

    if ($result["success"]) {
        error_log("Sent! Request ID: " . $result["data"]["requestId"]);
        error_log("Status: " . $result["data"]["status"]);
        error_log("Deliveries: " . $result["data"]["deliveryCount"]);
    } else {
        error_log("Failed: " . $result["code"] . " - " . $result["message"]);
    }

    return $result;
}`}
                    />
                </section>
                <section>
                    <CodeBlock
                        language="python"
                        title="Python"
                        code={`import os
import requests

NOTIFY_API = "https://api-notify-manage.vercel.app/api/v1"
API_KEY = os.getenv("NOTIFY_API_KEY")
DOMAIN = "your-domain.com"

def send_notification(order):
    response = requests.post(
        f"{NOTIFY_API}/notify",
        headers={
            "Content-Type": "application/json",
            "X-API-Key": API_KEY,
            # Alternative: "Authorization": f"Bearer {API_KEY}"
            "Idempotency-Key": f"order-{order['id']}",
        },
        json={
            "type": "order",
            "domain": DOMAIN,
            "data": {
                "userId": order["customer_external_id"],
                "orderId": order["id"],
                "amount": order["total"],
                "status": "shipped",
            },
        },
    )

    result = response.json()

    if result["success"]:
        print(f"Sent! Request ID: {result['data']['requestId']}")
        print(f"Status: {result['data']['status']}")
        print(f"Deliveries: {result['data']['deliveryCount']}")
    else:
        print(f"Failed: {result['code']} - {result['message']}")

    return result`}
                    />
                </section>
                <section>
                    <CodeBlock
                        language="bash"
                        title="cURL"
                        code={`curl -X POST https://api-notify-manage.vercel.app/api/v1/notify \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: $NOTIFY_API_KEY" \\
  -H "Idempotency-Key: order-ORD-5001" \\
  -d '{
    "type": "order",
    "domain": "your-domain.com",
    "data": {
      "userId": "customer-name",
      "orderId": "ORD-5001",
      "amount": 2500
    }
  }'`}
                    />
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Responses
                    </h2>

                    <ResponseBlock
                        status={202}
                        description="Notification accepted and dispatched"
                        response={`{
  "success": true,
  "message": "Notification accepted",
  "requestId": "NTF-20261018-A8F92D",
  "data": {
    "requestId": "NTF-20261018-A8F92D",
    "status": "sent",
    "type": "order",
    "domain": "your-domain.com",
    "deliveryCount": 1,
    "duplicate": false
  }
}`}
                    />

                    <ResponseBlock
                        status={200}
                        description="Duplicate detected (idempotency)"
                        response={`{
  "success": true,
  "message": "Duplicate notification ignored",
  "data": {
    "requestId": "NTF-20261018-A8F92D",
    "status": "sent",
    "duplicate": true
  }
}`}
                    />

                    <ResponseBlock
                        status={400}
                        description="Forbidden field sent"
                        response={`{
  "success": false,
  "message": "Field \\"chatId\\" is not allowed on the public API",
  "code": "FORBIDDEN_FIELD",
  "requestId": "NTF-20261018-XXXX"
}`}
                    />

                    <ResponseBlock
                        status={401}
                        description="API key missing or invalid"
                        response={`{
  "success": false,
  "message": "API key is required. Generate one from your dashboard.",
  "code": "API_KEY_REQUIRED",
  "requestId": "NTF-20261018-XXXX"
}`}
                    />

                    <ResponseBlock
                        status={403}
                        description="API key revoked, expired, or wrong domain"
                        response={`{
  "success": false,
  "message": "API key has been revoked",
  "code": "API_KEY_REVOKED",
  "requestId": "NTF-20261018-XXXX"
}`}
                    />

                    <ResponseBlock
                        status={404}
                        description="Domain not found"
                        response={`{
  "success": false,
  "message": "Domain is not registered or not approved",
  "code": "DOMAIN_NOT_FOUND",
  "requestId": "NTF-20261018-XXXX"
}`}
                    />

                    <ResponseBlock
                        status={403}
                        description="Domain not verified"
                        response={`{
  "success": false,
  "message": "Domain is not verified. Contact the admin.",
  "code": "DOMAIN_NOT_VERIFIED",
  "requestId": "NTF-20261018-XXXX"
}`}
                    />

                    <ResponseBlock
                        status={402}
                        description="Package quota exhausted"
                        response={`{
  "success": false,
  "message": "Monthly notification limit reached (10000)",
  "code": "PACKAGE_LIMIT_NOTIFICATIONS",
  "requestId": "NTF-20261018-XXXX"
}`}
                    />

                    <ResponseBlock
                        status={429}
                        description="Rate limit exceeded"
                        response={`{
  "success": false,
  "message": "Notification rate limit exceeded. Please slow down.",
  "code": "NOTIFICATION_RATE_LIMITED",
  "requestId": "NTF-20261018-XXXX"
}`}
                    />
                </section>

                {/* ─── Status Explainer ─────────────────────────── */}
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Understanding Response Status
                    </h2>
                    <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                        <table className="w-full min-w-[500px] text-sm">
                            <thead className="bg-white/[0.03]">
                                <tr>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                        Status
                                    </th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                        Meaning
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {STATUS_EXPLAINER.map((item) => (
                                    <tr key={item.status} className="border-t border-white/[0.06]">
                                        <td className="px-3 py-2">
                                            <code className={`text-[11px] ${item.color}`}>
                                                {item.status}
                                            </code>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-300">
                                            {item.meaning}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <Callout variant="warning" title="Debugging deliveries">
                    If status is <code className="text-xs">partial</code> or{" "}
                    <code className="text-xs">failed</code>, use the request ID to check
                    delivery details:
                    <div className="mt-2 rounded bg-[#03030d] p-2 font-mono text-[11px] text-gray-300">
                        GET /api/v1/user/notifications?search=NTF-...
                    </div>
                    Then look at <code className="text-xs">deliveries[].error</code> for
                    the exact per-destination failure reason.
                </Callout>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Custom Types (Fallback)
                    </h2>
                    <p className="mb-2 text-sm text-gray-300">
                        If you send a type that doesn't exist in the database, we
                        automatically fall back to the <code className="text-xs">custom</code>{" "}
                        route. The message header shows your requested type in uppercase.
                    </p>
                    <CodeBlock
                        language="json"
                        title="Example"
                        code={`{
  "type": "order_shipped",     // doesn't exist in DB
  "domain": "your-domain.com",
  "data": { "orderId": "ORD-5001" }
}

// → Uses "custom" route
// → Message header shows: ORDER_SHIPPED`}
                    />
                    <p className="mt-2 text-xs text-white/50">
                        This means <strong>any type string works</strong> — no need to
                        pre-register types.
                    </p>
                </section>

                {/* ─── Best Practices ──────────────────────────── */}
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Best Practices
                    </h2>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li>
                            ✅ <strong>Always use Idempotency-Key</strong> for critical
                            notifications (orders, payments)
                        </li>
                        <li>
                            ✅ <strong>Register customers first</strong> before sending B2C
                            notifications
                        </li>
                        <li>
                            ✅ <strong>Handle all status values</strong> — check{" "}
                            <code className="text-xs">status</code> field, not just success
                        </li>
                        <li>
                            ✅ <strong>Retry on 429</strong> after waiting for{" "}
                            <code className="text-xs">RateLimit-Reset</code> seconds
                        </li>
                        <li>
                            ✅ <strong>Log requestId</strong> for debugging (every response
                            has one)
                        </li>
                        <li>
                            ✅ <strong>Use consistent userId</strong> — same value in{" "}
                            <code className="text-xs">/subscriptions</code> and{" "}
                            <code className="text-xs">/notify</code>
                        </li>
                        <li>
                            ✅ <strong>Store API key in environment variable</strong> — never
                            hardcode it
                        </li>
                    </ul>
                </section>

                {/* ─── Next Step ───────────────────────────────── */}
                <section className="card">
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Related
                    </h2>
                    <ul className="space-y-1.5 text-sm">
                        <li>
                            →{" "}
                            <Link
                                to="/docs/public-api/subscriptions"
                                className="text-indigo-400 underline-offset-2 hover:underline"
                            >
                                Register Customer
                            </Link>{" "}
                            — required before B2C notifications
                        </li>
                        <li>
                            →{" "}
                            <Link
                                to="/docs/api-keys"
                                className="text-indigo-400 underline-offset-2 hover:underline"
                            >
                                API Keys
                            </Link>{" "}
                            — generate, rotate, revoke
                        </li>
                        <li>
                            →{" "}
                            <Link
                                to="/docs/troubleshooting"
                                className="text-indigo-400 underline-offset-2 hover:underline"
                            >
                                Troubleshooting
                            </Link>{" "}
                            — common errors and fixes
                        </li>
                    </ul>
                </section>
            </div>
        </PageMeta>
    );
};

export default PublicApiNotify;