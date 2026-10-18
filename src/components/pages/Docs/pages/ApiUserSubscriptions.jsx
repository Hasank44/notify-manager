import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import FieldTable from "../components/FieldTable";
import ResponseBlock from "../components/ResponseBlock";
import EndpointCard from "../components/EndpointCard";
import { Link } from 'react-router';

const ApiUserSubscriptions = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">User Subscriptions</h1>
                <p className="mt-2 text-sm text-white/60">
                    Manage your B2C customers — the people who receive notifications from
                    your domain. This is the panel management side (for API integration,
                    see{" "}
                    <Link
                        to={'/docs/public-api/subscriptions'}
                        className="text-indigo-400 underline-offset-2 hover:underline"
                    >
                        Public API → Register Customer
                    </Link>
                    ).
                </p>
            </div>
            <Callout variant="warning" title="Requires allowB2C">
                All endpoints here require the{" "}
                <code className="text-xs">allowB2C</code> feature flag (Starter+ plans).
                Free plan users cannot access these.
            </Callout>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Manually Add Customer
                </h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/user-subscriptions"
                    description="Manually register a customer from the panel (alternative to API-driven registration)."
                    meta={
                        <>
                            <span>🔒 Auth required</span>
                            <span>🔒 Requires allowB2C</span>
                            <span>⚡ Instant active</span>
                        </>
                    }
                />
                <FieldTable
                    fields={[
                        { name: "domainId", type: "string", required: "required", description: "Your domain ObjectId" },
                        { name: "botId", type: "string", required: "required", description: "Bot ObjectId (yours or system)" },
                        { name: "externalUserId", type: "string", required: "required", description: "Your customer ID (unique per domain)" },
                        { name: "chatId", type: "string", required: "required", description: "Telegram chatId (numeric)" },
                        { name: "name", type: "string", required: "optional", description: "Display name" },
                        { name: "email", type: "string", required: "optional", description: "Email" },
                        { name: "phone", type: "string", required: "optional", description: "Phone" },
                        { name: "username", type: "string", required: "optional", description: "Telegram username" },
                        { name: "metadata", type: "object", required: "optional", description: "Custom JSON fields" },
                    ]}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch(
  "https://iftyhasan.com/api/v1/user/user-subscriptions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${accessToken}\`
    },
    body: JSON.stringify({
      domainId: "6ad3da188a1471489079dd19",
      botId: "6ad26cc5eb1769945f76543c",
      externalUserId: "customer-hasan",
      chatId: "6862958488",
      name: "hasan",
      email: "mdhasan.sjb@gmail.com"
    })
  }
);

const result = await response.json();`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php
$ch = curl_init("https://iftyhasan.com/api/v1/user/user-subscriptions");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "domainId" => "6ad3da188a1471489079dd19",
        "botId" => "6ad26cc5eb1769945f76543c",
        "externalUserId" => "customer-hasan",
        "chatId" => "6862958488",
        "name" => "hasan",
        "email" => "mdhasan.sjb@gmail.com"
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);`}
                />

                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests
response = requests.post(
    "https://iftyhasan.com/api/v1/user/user-subscriptions",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "domainId": "6ad3da188a1471489079dd19",
        "botId": "6ad26cc5eb1769945f76543c",
        "externalUserId": "customer-hasan",
        "chatId": "6862958488",
        "name": "hasan",
        "email": "mdhasan.sjb@gmail.com",
    },
)

result = response.json()`}
                />
                <ResponseBlock
                    status={201}
                    description="Customer added"
                    response={`{
  "success": true,
  "message": "Subscription created",
  "data": {
    "id": "6ad...",
    "externalUserId": "customer-hasan",
    "chatId": "6862958488",
    "name": "hasan",
    "active": true,
    "totalReceived": 0
  }
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Bulk Upload (CSV-style)
                </h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/user-subscriptions/bulk"
                    description="Import many customers at once. Max 5000 per request."
                    meta={
                        <>
                            <span>🔒 Auth required</span>
                            <span>📤 Max 5000 per call</span>
                        </>
                    }
                />
                <FieldTable
                    fields={[
                        { name: "domainId", type: "string", required: "required", description: "Your domain ObjectId" },
                        { name: "botId", type: "string", required: "required", description: "Bot ObjectId" },
                        { name: "subscriptions", type: "array<object>", required: "required", description: "Array of { externalUserId, chatId, name?, email?, phone? }" },
                        { name: "subscriptions[].externalUserId", type: "string", required: "required", description: "Customer ID (unique)" },
                        { name: "subscriptions[].chatId", type: "string", required: "required", description: "Telegram chatId" },
                    ]}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch(
  "https://iftyhasan.com/api/v1/user/user-subscriptions/bulk",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${accessToken}\`
    },
    body: JSON.stringify({
      domainId: "6ad3da188a1471489079dd19",
      botId: "6ad26cc5eb1769945f76543c",
      subscriptions: [
        { externalUserId: "customer-1", chatId: "1111111111", name: "Customer 1" },
        { externalUserId: "customer-2", chatId: "2222222222", name: "Customer 2" },
        { externalUserId: "customer-3", chatId: "3333333333", name: "Customer 3" }
      ]
    })
  }
);

const result = await response.json();
console.log("Created:", result.data.created);
console.log("Skipped:", result.data.skipped);`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://iftyhasan.com/api/v1/user/user-subscriptions/bulk");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "domainId" => "6ad3da188a1471489079dd19",
        "botId" => "6ad26cc5eb1769945f76543c",
        "subscriptions" => [
            ["externalUserId" => "customer-1", "chatId" => "1111111111"],
            ["externalUserId" => "customer-2", "chatId" => "2222222222"]
        ]
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
    "https://iftyhasan.com/api/v1/user/user-subscriptions/bulk",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "domainId": "6ad3da188a1471489079dd19",
        "botId": "6ad26cc5eb1769945f76543c",
        "subscriptions": [
            {"externalUserId": "customer-1", "chatId": "1111111111"},
            {"externalUserId": "customer-2", "chatId": "2222222222"},
        ],
    },
)

result = response.json()`}
                />
                <ResponseBlock
                    status={200}
                    description="Bulk upload processed"
                    response={`{
  "success": true,
  "message": "Bulk upload processed",
  "data": {
    "total": 3,
    "created": 2,
    "skipped": 1,
    "skippedExternalIds": ["customer-1"]
  }
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    List Customers
                </h2>
                <EndpointCard
                    method="GET"
                    path="/api/v1/user/user-subscriptions"
                    description="List your B2C customers with filters."
                    meta={<span>🔒 Auth required</span>}
                />
                <p className="mb-2 mt-2 text-xs text-white/50">
                    Query params: <code className="text-indigo-300">domainId</code>,{" "}
                    <code className="text-indigo-300">search</code>,{" "}
                    <code className="text-indigo-300">active</code>,{" "}
                    <code className="text-indigo-300">botId</code>,{" "}
                    <code className="text-indigo-300">page</code>,{" "}
                    <code className="text-indigo-300">limit</code>
                </p>
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch(
  "https://iftyhasan.com/api/v1/user/user-subscriptions?search=hasan&active=true",
  { headers: { Authorization: \`Bearer \${accessToken}\` } }
);

const result = await response.json();
result.data.items.forEach(customer => {
  console.log(customer.name, customer.externalUserId);
  console.log("Received:", customer.totalReceived);
});`}
                />
                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://iftyhasan.com/api/v1/user/user-subscriptions?search=hasan");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer " . $accessToken],
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

foreach ($result["data"]["items"] as $customer) {
    echo $customer["name"] . " — Received: " . $customer["totalReceived"] . "\\n";
}`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.get(
    "https://iftyhasan.com/api/v1/user/user-subscriptions",
    params={"search": "hasan"},
    headers={"Authorization": f"Bearer {access_token}"},
)

result = response.json()
for customer in result["data"]["items"]:
    print(customer["name"], "— Received:", customer["totalReceived"])`}
                />
                <ResponseBlock
                    status={200}
                    description="Customers list"
                    response={`{
  "success": true,
  "data": {
    "items": [
      {
        "id": "6ad...",
        "externalUserId": "customer-hasan",
        "chatId": "6862958488",
        "name": "hasan",
        "domainId": { "domain": "shop.rahim.com" },
        "botId": { "name": "Rahim's Shop Bot" },
        "active": true,
        "totalReceived": 5,
        "lastNotifiedAt": "2026-10-18T..."
      }
    ],
    "pagination": { "page": 1, "limit": 50, "total": 1, "pages": 1 }
  }
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Get / Update / Delete
                </h2>
                <EndpointCard method="GET" path="/api/v1/user/user-subscriptions/:id" />
                <EndpointCard method="PATCH" path="/api/v1/user/user-subscriptions/:id" />
                <EndpointCard method="DELETE" path="/api/v1/user/user-subscriptions/:id" />
                <Callout variant="info" title="Immutable fields">
                    <code className="text-xs">externalUserId</code> and{" "}
                    <code className="text-xs">chatId</code> cannot be updated. To change
                    either, delete the subscription and recreate it.
                </Callout>
            </section>
        </div>
    );
};

export default ApiUserSubscriptions;