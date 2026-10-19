import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import FieldTable from "../components/FieldTable";
import ResponseBlock from "../components/ResponseBlock";
import EndpointCard from "../components/EndpointCard";

const ApiNotifications = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Notifications History</h1>
                <p className="mt-2 text-sm text-white/60">
                    Read-only access to your notification history with per-destination
                    delivery tracking. Use this for debugging and analytics.
                </p>
            </div>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    List Notifications
                </h2>
                <EndpointCard
                    method="GET"
                    path="/api/v1/user/notifications"
                    description="List your notification history with filters."
                    meta={<span>🔒 Auth required</span>}
                />
                <p className="mb-2 mt-2 text-xs text-white/50">
                    Query params: <code className="text-indigo-300">search</code> (requestId),
                    <code className="text-indigo-300">domain</code>,{" "}
                    <code className="text-indigo-300">type</code>,{" "}
                    <code className="text-indigo-300">status</code>,{" "}
                    <code className="text-indigo-300">since</code>,{" "}
                    <code className="text-indigo-300">until</code>,{" "}
                    <code className="text-indigo-300">page</code>,{" "}
                    <code className="text-indigo-300">limit</code>
                </p>
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch(
  "https://api-notify-manage.vercel.app/api/v1/user/notifications?status=sent&limit=20",
  { headers: { Authorization: \`Bearer \${accessToken}\` } }
);

const result = await response.json();
result.data.items.forEach(notification => {
  console.log(notification.requestId, notification.status, notification.type);
});`}
                />
                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/notifications?status=sent&limit=20");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer " . $accessToken],
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

foreach ($result["data"]["items"] as $notification) {
    echo $notification["requestId"] . " — " . $notification["status"] . "\\n";
}`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.get(
    "https://api-notify-manage.vercel.app/api/v1/user/notifications",
    params={"status": "sent", "limit": 20},
    headers={"Authorization": f"Bearer {access_token}"},
)

result = response.json()
for notification in result["data"]["items"]:
    print(notification["requestId"], "-", notification["status"])`}
                />
                <ResponseBlock
                    status={200}
                    description="Notification list"
                    response={`{
  "success": true,
  "data": {
    "items": [
      {
        "id": "6ad...",
        "requestId": "NTF-20261018-A8F92D",
        "type": "custom",
        "domain": "your-domain.com",
        "status": "sent",
        "deliveries": [
          {
            "destinationName": "Md Hasan Ali (Hasan)",
            "destinationType": "user_dynamic",
            "status": "sent",
            "messageId": "1234",
            "error": null,
            "sentAt": "2026-10-18T..."
          }
        ],
        "createdAt": "2026-10-18T..."
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
  }
}`}
                />
                <div className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                    <table className="w-full min-w-[500px] text-sm">
                        <thead className="bg-white/[0.03]">
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Status</th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-emerald-300">sent</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">All deliveries successful</td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-amber-300">partial</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">Some sent, some failed/skipped</td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-red-300">failed</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">All deliveries failed</td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-purple-300">noRoute</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">No route for this domain+type</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Get Notification Details
                </h2>
                <EndpointCard
                    method="GET"
                    path="/api/v1/user/notifications/:id"
                    description="Full details of a single notification including payload data."
                    meta={<span>🔒 Auth required</span>}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch(
  \`https://api-notify-manage.vercel.app/api/v1/user/notifications/\${notificationId}\`,
  { headers: { Authorization: \`Bearer \${accessToken}\` } }
);

const result = await response.json();
console.log("Type:", result.data.type);
console.log("Status:", result.data.status);
console.log("Payload:", result.data.data);`}
                />
                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/notifications/" . $notificationId);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer " . $accessToken],
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.get(
    f"https://api-notify-manage.vercel.app/api/v1/user/notifications/{notification_id}",
    headers={"Authorization": f"Bearer {access_token}"},
)

result = response.json()`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Get Per-Destination Deliveries
                </h2>
                <EndpointCard
                    method="GET"
                    path="/api/v1/user/notifications/:id/deliveries"
                    description="Detailed per-destination delivery tracking — perfect for debugging."
                    meta={<span>🔒 Auth required</span>}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript — Debug example"
                    code={`const response = await fetch(
  \`https://api-notify-manage.vercel.app/api/v1/user/notifications/\${notificationId}/deliveries\`,
  { headers: { Authorization: \`Bearer \${accessToken}\` } }
);

const result = await response.json();

// Check each destination's status
result.data.items.forEach(delivery => {
  if (delivery.status === "sent") {
    console.log(\`✓ \${delivery.destinationName} — msgId \${delivery.messageId}\`);
  } else if (delivery.status === "failed") {
    console.error(\`✗ \${delivery.destinationName} — \${delivery.error}\`);
  } else if (delivery.status === "skipped") {
    console.warn(\`⚠ \${delivery.destinationName} — \${delivery.error}\`);
  }
});`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/notifications/" . $notificationId . "/deliveries");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer " . $accessToken],
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

foreach ($result["data"]["items"] as $delivery) {
    if ($delivery["status"] === "sent") {
        echo "OK: " . $delivery["destinationName"] . "\\n";
    } else {
        echo "FAIL: " . $delivery["destinationName"] . " - " . $delivery["error"] . "\\n";
    }
}`}
                />

                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.get(
    f"https://api-notify-manage.vercel.app/api/v1/user/notifications/{notification_id}/deliveries",
    headers={"Authorization": f"Bearer {access_token}"},
)

result = response.json()
for delivery in result["data"]["items"]:
    status = delivery["status"]
    name = delivery["destinationName"]
    if status == "sent":
        print(f"✓ {name}")
    else:
        print(f"✗ {name} — {delivery['error']}")`}
                />
                <ResponseBlock
                    status={200}
                    description="Delivery details"
                    response={`{
  "success": true,
  "data": {
    "notificationId": "6ad...",
    "requestId": "NTF-20261018-A8F92D",
    "status": "partial",
    "items": [
      {
        "destinationType": "user",
        "destinationName": "My Personal Chat",
        "status": "sent",
        "messageId": "1234",
        "error": null,
        "sentAt": "2026-10-18T..."
      },
      {
        "destinationType": "user_dynamic",
        "destinationName": "B2C Buyer (Hasan)",
        "status": "sent",
        "messageId": "1235",
        "error": null,
        "sentAt": "2026-10-18T..."
      },
      {
        "destinationType": "user_dynamic",
        "destinationName": "B2C Buyer (unknown-cust)",
        "status": "skipped",
        "messageId": null,
        "error": "SUBSCRIBER_NOT_FOUND",
        "sentAt": null
      }
    ]
  }
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Common Delivery Errors
                </h2>
                <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                    <table className="w-full min-w-[600px] text-sm">
                        <thead className="bg-white/[0.03]">
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Error</th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Cause</th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Fix</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { err: "SUBSCRIBER_NOT_FOUND", cause: "userId in data doesn't match any subscription", fix: "Register the customer via /subscriptions first" },
                                { err: "NO_USER_ID", cause: "Dynamic destination but data.userId is missing", fix: "Include userId in data or use a static destination" },
                                { err: "NO_SUBSCRIBERS", cause: "Broadcast destination but no registered subscribers", fix: "Add subscribers via /subscriptions" },
                                { err: "TELEGRAM_AUTH_ERROR", cause: "Bot token invalid or revoked", fix: "Re-register bot with new token" },
                                { err: "TELEGRAM_BAD_REQUEST", cause: "User hasn't /start'd the bot or chatId invalid", fix: "Ask user to /start the bot" },
                                { err: "B2C_FEATURE_DISABLED", cause: "Owner's package lacks allowB2C", fix: "Upgrade to Starter+ plan" },
                            ].map((row) => (
                                <tr key={row.err} className="border-t border-white/[0.06]">
                                    <td className="px-3 py-2">
                                        <code className="text-[11px] text-red-300">{row.err}</code>
                                    </td>
                                    <td className="px-3 py-2 text-xs text-gray-300">{row.cause}</td>
                                    <td className="px-3 py-2 text-xs text-emerald-300">{row.fix}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            <Callout variant="info" title="Debug workflow">
                1. Get <code className="text-xs">requestId</code> from your notify response.
                <br />
                2. Search history: <code className="text-xs">GET /user/notifications?search=NTF-...</code>
                <br />
                3. Get the notification ID from the result.
                <br />
                4. Fetch deliveries: <code className="text-xs">GET /user/notifications/:id/deliveries</code>
                <br />
                5. Look at each <code className="text-xs">deliveries[].error</code> for per-destination diagnosis.
            </Callout>
        </div>
    );
};

export default ApiNotifications;