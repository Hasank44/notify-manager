import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import FieldTable from "../components/FieldTable";
import ResponseBlock from "../components/ResponseBlock";
import EndpointCard from "../components/EndpointCard";

const ApiDomains = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Domains</h1>
                <p className="mt-2 text-sm text-white/60">
                    Manage the domains you send notifications from. Each domain requires
                    admin approval before use.
                </p>
            </div>
            <Callout variant="info" title="Authentication required">
                All endpoints on this page require{" "}
                <code className="text-xs">Authorization: Bearer &lt;accessToken&gt;</code>.
                See{" "}
                <a href="/docs/authentication" className="text-indigo-400 underline-offset-2 hover:underline">
                    Authentication
                </a>
            </Callout>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Create Domain
                </h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/domains"
                    description="Add a new domain. Status starts as 'pending' until admin approval."
                    meta={
                        <>
                            <span>🔒 Auth required</span>
                            <span>⏳ Admin approval needed</span>
                        </>
                    }
                />

                <FieldTable
                    fields={[
                        { name: "domain", type: "string", required: "required", description: "Domain without protocol (e.g., iftyhasan.com)" },
                        { name: "name", type: "string", required: "required", description: "Display name (1-120 chars)" },
                        { name: "description", type: "string", required: "optional", description: "Optional context" },
                        { name: "active", type: "boolean", required: "optional", description: "Default: true" },
                    ]}
                />

                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch("https://iftyhasan.com/api/v1/user/domains", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    domain: "iftyhasan.com",
    name: "Hasan's Shop"
  })
});

const result = await response.json();
if (result.success) {
  console.log("Domain ID:", result.data.id);
  console.log("Status:", result.data.status); // "pending"
}`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://iftyhasan.com/api/v1/user/domains");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "domain" => "iftyhasan.com",
        "name" => "Hasan's Shop"
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

if ($result["success"]) {
    echo "Domain ID: " . $result["data"]["id"] . "\\n";
    echo "Status: " . $result["data"]["status"] . "\\n";
}`}
                />

                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.post(
    "https://iftyhasan.com/api/v1/user/domains",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "domain": "iftyhasan.com",
        "name": "Hasan's Shop",
    },
)

result = response.json()
if result["success"]:
    print("Domain ID:", result["data"]["id"])
    print("Status:", result["data"]["status"])`}
                />

                <ResponseBlock
                    status={201}
                    description="Domain created (pending approval)"
                    response={`{
  "success": true,
  "message": "Domain submitted for approval",
  "data": {
    "id": "6ad...",
    "domain": "iftyhasan.com",
    "name": "Hasan's Shop",
    "status": "pending",
    "verified": false,
    "active": true
  }
}`}
                />

                <ResponseBlock
                    status={402}
                    description="Domain limit reached"
                    response={`{
  "success": false,
  "message": "Domain limit reached (1) for your package",
  "code": "PACKAGE_LIMIT_DOMAINS"
}`}
                />
                <ResponseBlock
                    status={409}
                    description="Domain already exists"
                    response={`{
  "success": false,
  "message": "Domain already exists",
  "code": "DOMAIN_EXISTS"
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">List Domains</h2>
                <EndpointCard
                    method="GET"
                    path="/api/v1/user/domains"
                    description="List your domains with filters and pagination."
                    meta={<span>🔒 Auth required</span>}
                />
                <p className="mb-2 mt-2 text-xs text-white/50">
                    Query params: <code className="text-indigo-300">page</code>,{" "}
                    <code className="text-indigo-300">limit</code>,{" "}
                    <code className="text-indigo-300">search</code>,{" "}
                    <code className="text-indigo-300">status</code>,{" "}
                    <code className="text-indigo-300">active</code>
                </p>
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch(
  "https://iftyhasan.com/api/v1/user/domains?page=1&limit=20&status=approved",
  { headers: { Authorization: \`Bearer \${accessToken}\` } }
);

const result = await response.json();
result.data.items.forEach(domain => {
  console.log(domain.domain, "—", domain.status);
});`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://iftyhasan.com/api/v1/user/domains?page=1&limit=20&status=approved");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer " . $accessToken],
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

foreach ($result["data"]["items"] as $domain) {
    echo $domain["domain"] . " - " . $domain["status"] . "\\n";
}`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.get(
    "https://iftyhasan.com/api/v1/user/domains",
    params={"page": 1, "limit": 20, "status": "approved"},
    headers={"Authorization": f"Bearer {access_token}"},
)

result = response.json()
for domain in result["data"]["items"]:
    print(domain["domain"], "-", domain["status"])`}
                />
                <ResponseBlock
                    status={200}
                    description="Domains list"
                    response={`{
  "success": true,
  "data": {
    "items": [
      {
        "id": "6ad...",
        "domain": "iftyhasan.com",
        "name": "Hasan's Shop",
        "status": "approved",
        "verified": true,
        "active": true,
        "createdAt": "2026-10-18T..."
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 1, "pages": 1 }
  }
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Get / Update / Delete
                </h2>
                <EndpointCard method="GET" path="/api/v1/user/domains/:id" />
                <EndpointCard method="PATCH" path="/api/v1/user/domains/:id" />
                <EndpointCard method="DELETE" path="/api/v1/user/domains/:id" />
                <CodeBlock
                    language="js"
                    title="JavaScript — Update example"
                    code={`// Update domain (only name/description/active editable)
await fetch(\`https://iftyhasan.com/api/v1/user/domains/\${domainId}\`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    name: "Updated Name",
    active: false
  })
});

// Delete domain
await fetch(\`https://iftyhasan.com/api/v1/user/domains/\${domainId}\`, {
  method: "DELETE",
  headers: { Authorization: \`Bearer \${accessToken}\` }
});`}
                />
                <Callout variant="danger" title="Delete cascade">
                    Deleting a domain also deletes all its associated routes. Any
                    notifications currently using those routes will fail with{" "}
                    <code className="text-xs">noRoute</code>.
                </Callout>
            </section>
        </div>
    );
};

export default ApiDomains;