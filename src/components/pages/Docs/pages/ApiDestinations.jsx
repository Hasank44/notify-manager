import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import FieldTable from "../components/FieldTable";
import ResponseBlock from "../components/ResponseBlock";
import EndpointCard from "../components/EndpointCard";

const DESTINATIONS_TABLE = [
    { type: "user", identifier: "Positive number", example: "6862958488", purpose: "Fixed Telegram user" },
    { type: "group", identifier: "Negative number", example: "-1001234567890", purpose: "Fixed group" },
    { type: "channel", identifier: "Negative number", example: "-1009876543210", purpose: "Fixed channel" },
    { type: "bot", identifier: "String (max 64)", example: "custom_bot_1", purpose: "Bot identifier" },
    { type: "user_dynamic", identifier: "Empty", example: "", purpose: "Single customer (B2C)" },
    { type: "user_dynamic_broadcast", identifier: "Empty", example: "", purpose: "All subscribers (B2C)" },
];

const ApiDestinations = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Destinations</h1>
                <p className="mt-2 text-sm text-white/60">
                    Delivery targets — where your notifications go. Six types: static
                    (fixed chats) and dynamic (B2C customer lookups).
                </p>
            </div>
            <Callout variant="info" title="Auto-approved">
                User-created destinations are automatically approved — no admin review
                needed. Ownership is enforced: you can only add destinations for your
                own bots (or the system bot).
            </Callout>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Destination Types
                </h2>
                <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                    <table className="w-full min-w-[640px] text-sm">
                        <thead className="bg-white/[0.03]">
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Type</th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Identifier</th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Example</th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DESTINATIONS_TABLE.map((d) => (
                                <tr key={d.type} className="border-t border-white/[0.06]">
                                    <td className="px-3 py-2"><code className="text-[11px] text-indigo-300">{d.type}</code></td>
                                    <td className="px-3 py-2 text-xs text-gray-300">{d.identifier}</td>
                                    <td className="px-3 py-2"><code className="text-[11px] text-cyan-300">{d.example || "—"}</code></td>
                                    <td className="px-3 py-2 text-xs text-gray-300">{d.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Create Static Destination (B2B)
                </h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/destinations"
                    description="Add a fixed destination like your personal chat, team group, or channel."
                    meta={
                        <>
                            <span>🔒 Auth required</span>
                            <span>⚡ Instant approval</span>
                        </>
                    }
                />
                <FieldTable
                    fields={[
                        { name: "name", type: "string", required: "required", description: "Display name (1-120 chars)" },
                        { name: "type", type: "string", required: "required", description: "user | group | channel | bot" },
                        { name: "identifier", type: "string", required: "required", description: "Telegram chatId or bot id (format varies by type)" },
                        { name: "botId", type: "string", required: "required", description: "Your bot ObjectId (or system bot id)" },
                        { name: "description", type: "string", required: "optional", description: "Admin-only note" },
                        { name: "active", type: "boolean", required: "optional", description: "Default: true" },
                    ]}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript — Static user destination"
                    code={`const response = await fetch("https://iftyhasan.com/api/v1/user/destinations", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    name: "My Personal Chat",
    type: "user",
    identifier: "6862958488",
    botId: "6ad26cc5eb1769945f76543c"
  })
});

const result = await response.json();
if (result.success) {
  console.log("Destination ID:", result.data.id);
}`}
                />
                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://iftyhasan.com/api/v1/user/destinations");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "name" => "My Personal Chat",
        "type" => "user",
        "identifier" => "6862958488",
        "botId" => "6ad26cc5eb1769945f76543c"
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests
response = requests.post(
    "https://iftyhasan.com/api/v1/user/destinations",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "name": "My Personal Chat",
        "type": "user",
        "identifier": "6862958488",
        "botId": "6ad26cc5eb1769945f76543c",
    },
)

result = response.json()`}
                />
                <ResponseBlock
                    status={201}
                    description="Destination created"
                    response={`{
  "success": true,
  "message": "Destination created successfully",
  "data": {
    "id": "6ad...",
    "name": "My Personal Chat",
    "type": "user",
    "identifier": "6862958488",
    "status": "approved",
    "verified": true,
    "active": true
  }
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Create Dynamic Destination (B2C)
                </h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/destinations"
                    description="Add a dynamic destination that resolves to different customers at send time."
                    meta={
                        <>
                            <span>🔒 Auth required</span>
                            <span>🔒 Requires allowB2C</span>
                            <span>⚡ Instant approval</span>
                        </>
                    }
                />
                <FieldTable
                    fields={[
                        { name: "name", type: "string", required: "required", description: "Display name" },
                        { name: "type", type: "string", required: "required", description: "user_dynamic (single) OR user_dynamic_broadcast (all)" },
                        { name: "identifier", type: "string", required: "conditional", description: "Must be empty for dynamic types" },
                        { name: "botId", type: "string", required: "required", description: "Your bot ObjectId (or system bot id)" },
                    ]}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript — Dynamic single"
                    code={`// user_dynamic: resolves ONE customer per notify call (via data.userId)
const response = await fetch("https://iftyhasan.com/api/v1/user/destinations", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    name: "B2C Buyer",
    type: "user_dynamic",
    botId: "6ad26cc5eb1769945f76543c"
  })
});

// user_dynamic_broadcast: sends to ALL active subscribers
const broadcastRes = await fetch("https://iftyhasan.com/api/v1/user/destinations", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    name: "All Subscribers",
    type: "user_dynamic_broadcast",
    botId: "6ad26cc5eb1769945f76543c"
  })
});`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php
$ch = curl_init("https://iftyhasan.com/api/v1/user/destinations");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "name" => "B2C Buyer",
        "type" => "user_dynamic",
        "botId" => "6ad26cc5eb1769945f76543c"
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.post(
    "https://iftyhasan.com/api/v1/user/destinations",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "name": "B2C Buyer",
        "type": "user_dynamic",
        "botId": "6ad26cc5eb1769945f76543c",
    },
)

result = response.json()`}
                />
                <ResponseBlock
                    status={201}
                    description="Dynamic destination created"
                    response={`{
  "success": true,
  "data": {
    "id": "6ad...",
    "name": "B2C Buyer",
    "type": "user_dynamic",
    "identifier": "",
    "status": "approved",
    "verified": true
  }
}`}
                />

                <ResponseBlock
                    status={402}
                    description="B2C not in plan"
                    response={`{
  "success": false,
  "message": "B2C destinations are not available on your plan. Please upgrade.",
  "code": "PACKAGE_FEATURE_DISABLED"
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    List Destinations
                </h2>
                <EndpointCard
                    method="GET"
                    path="/api/v1/user/destinations"
                    description="List your destinations with filters."
                    meta={<span>🔒 Auth required</span>}
                />
                <p className="mb-2 mt-2 text-xs text-white/50">
                    Query params: <code className="text-indigo-300">type</code>,{" "}
                    <code className="text-indigo-300">active</code>,{" "}
                    <code className="text-indigo-300">botId</code>,{" "}
                    <code className="text-indigo-300">search</code>,{" "}
                    <code className="text-indigo-300">page</code>,{" "}
                    <code className="text-indigo-300">limit</code>
                </p>
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch(
  "https://iftyhasan.com/api/v1/user/destinations?type=user_dynamic&active=true",
  { headers: { Authorization: \`Bearer \${accessToken}\` } }
);

const result = await response.json();
result.data.items.forEach(dest => {
  console.log(\`\${dest.name} (\${dest.type})\`);
});`}
                />
                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://iftyhasan.com/api/v1/user/destinations?type=user_dynamic");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer " . $accessToken],
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

foreach ($result["data"]["items"] as $dest) {
    echo $dest["name"] . " (" . $dest["type"] . ")\\n";
}`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests
response = requests.get(
    "https://iftyhasan.com/api/v1/user/destinations",
    params={"type": "user_dynamic"},
    headers={"Authorization": f"Bearer {access_token}"},
)

result = response.json()
for dest in result["data"]["items"]:
    print(dest["name"], f"({dest['type']})")`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Get / Update / Delete
                </h2>
                <EndpointCard method="GET" path="/api/v1/user/destinations/:id" />
                <EndpointCard method="PATCH" path="/api/v1/user/destinations/:id" />
                <EndpointCard method="DELETE" path="/api/v1/user/destinations/:id" />
                <Callout variant="warning" title="Type change behavior">
                    Changing a destination's type clears the identifier automatically when
                    switching to a dynamic type. You'll be required to provide a new
                    identifier when switching back to static.
                </Callout>
            </section>
        </div>
    );
};

export default ApiDestinations;