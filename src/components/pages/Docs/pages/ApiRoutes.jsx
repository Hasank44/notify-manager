import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import FieldTable from "../components/FieldTable";
import ResponseBlock from "../components/ResponseBlock";
import EndpointCard from "../components/EndpointCard";

const ApiRoutes = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Routes</h1>
                <p className="mt-2 text-sm text-white/60">
                    Connect a domain + notification type to one or more destinations.
                    Route resolution happens on every notify call.
                </p>
            </div>
            <Callout variant="info" title="Route rule">
                A route is <strong>per domain + type</strong> combination. You need one
                route for each type you plan to send. Example: shop.com + order → 1
                route, shop.com + payment → another route.
            </Callout>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Create Route</h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/routes"
                    description="Bind a domain + type to destinations. Instant approval for user-created routes."
                    meta={
                        <>
                            <span>🔒 Auth required</span>
                            <span>⚡ Instant approval</span>
                        </>
                    }
                />
                <FieldTable
                    fields={[
                        { name: "domainId", type: "string", required: "required", description: "Domain ObjectId (must be yours + approved)" },
                        { name: "notificationTypeId", type: "string", required: "required", description: "Notification type ObjectId (e.g., custom)" },
                        { name: "destinations", type: "array<string>", required: "required", description: "Array of destination ObjectIds (max 50)" },
                        { name: "description", type: "string", required: "optional", description: "Admin note" },
                        { name: "active", type: "boolean", required: "optional", description: "Default: true" },
                    ]}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch("https://iftyhasan.com/api/v1/user/routes", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    domainId: "6ad3da188a1471489079dd19",
    notificationTypeId: "6ad2624f05086186aefa620c",
    destinations: [
      "6ad3df4e7c35f40dec2e4735",
      "6ad3ff8a7c35f40dec2e4780"
    ]
  })
});

const result = await response.json();
if (result.success) {
  console.log("Route ID:", result.data.id);
}`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://iftyhasan.com/api/v1/user/routes");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "domainId" => "6ad3da188a1471489079dd19",
        "notificationTypeId" => "6ad2624f05086186aefa620c",
        "destinations" => [
            "6ad3df4e7c35f40dec2e4735",
            "6ad3ff8a7c35f40dec2e4780"
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
    "https://iftyhasan.com/api/v1/user/routes",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "domainId": "6ad3da188a1471489079dd19",
        "notificationTypeId": "6ad2624f05086186aefa620c",
        "destinations": [
            "6ad3df4e7c35f40dec2e4735",
            "6ad3ff8a7c35f40dec2e4780",
        ],
    },
)

result = response.json()`}
                />

                <ResponseBlock
                    status={201}
                    description="Route created"
                    response={`{
  "success": true,
  "message": "Route created successfully",
  "data": {
    "id": "6ad...",
    "domainId": "6ad3da188a1471489079dd19",
    "notificationTypeId": "6ad2624f05086186aefa620c",
    "destinations": [
      "6ad3df4e7c35f40dec2e4735",
      "6ad3ff8a7c35f40dec2e4780"
    ],
    "status": "approved",
    "verified": true,
    "active": true
  }
}`}
                />

                <ResponseBlock
                    status={409}
                    description="Route already exists for this domain + type"
                    response={`{
  "success": false,
  "message": "A route already exists for this domain and notification type",
  "code": "ROUTE_EXISTS"
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">List Routes</h2>
                <EndpointCard
                    method="GET"
                    path="/api/v1/user/routes"
                    description="List your routes."
                    meta={<span>🔒 Auth required</span>}
                />

                <p className="mb-2 mt-2 text-xs text-white/50">
                    Query params: <code className="text-indigo-300">domainId</code>,{" "}
                    <code className="text-indigo-300">notificationTypeId</code>,{" "}
                    <code className="text-indigo-300">active</code>,{" "}
                    <code className="text-indigo-300">status</code>,{" "}
                    <code className="text-indigo-300">page</code>,{" "}
                    <code className="text-indigo-300">limit</code>
                </p>
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch(
  "https://iftyhasan.com/api/v1/user/routes?domainId=6ad3da188a1471489079dd19",
  { headers: { Authorization: \`Bearer \${accessToken}\` } }
);

const result = await response.json();
result.data.items.forEach(route => {
  console.log(\`\${route.domainId.domain} → \${route.notificationTypeId.label}\`);
});`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://iftyhasan.com/api/v1/user/routes?domainId=6ad3da188a1471489079dd19");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer " . $accessToken],
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

foreach ($result["data"]["items"] as $route) {
    echo $route["domainId"]["domain"] . " -> " . $route["notificationTypeId"]["label"] . "\\n";
}`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.get(
    "https://iftyhasan.com/api/v1/user/routes",
    params={"domainId": "6ad3da188a1471489079dd19"},
    headers={"Authorization": f"Bearer {access_token}"},
)

result = response.json()
for route in result["data"]["items"]:
    print(route["domainId"]["domain"], "->", route["notificationTypeId"]["label"])`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Get / Update / Delete
                </h2>
                <EndpointCard method="GET" path="/api/v1/user/routes/:id" />
                <EndpointCard method="PATCH" path="/api/v1/user/routes/:id" />
                <EndpointCard method="DELETE" path="/api/v1/user/routes/:id" />
                <Callout variant="warning" title="Domain + Type immutable">
                    Once created, <code className="text-xs">domainId</code> and{" "}
                    <code className="text-xs">notificationTypeId</code> cannot be changed.
                    Only destinations, description, and active can be updated. To change
                    the binding, delete and recreate the route.
                </Callout>
                <CodeBlock
                    language="js"
                    title="JavaScript — Update destinations"
                    code={`await fetch(\`https://iftyhasan.com/api/v1/user/routes/\${routeId}\`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    destinations: [
      "6ad3df4e7c35f40dec2e4735",
      "6ad3ff8a7c35f40dec2e4780",
      "6ad3aa0b7c35f40dec2e4750"
    ],
    active: true
  })
});`}
                />
            </section>
        </div>
    );
};

export default ApiRoutes;