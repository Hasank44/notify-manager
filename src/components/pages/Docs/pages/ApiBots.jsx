import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import FieldTable from "../components/FieldTable";
import ResponseBlock from "../components/ResponseBlock";
import EndpointCard from "../components/EndpointCard";

const ApiBots = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Bots</h1>
                <p className="mt-2 text-sm text-white/60">
                    Register your own Telegram bots. Required for B2C notifications and
                    custom sender identity.
                </p>
            </div>
            <Callout variant="warning" title="Pro plan or higher required">
                Own bots require the <code className="text-xs">allowOwnBot</code> feature
                flag (Pro, Business, Enterprise plans). Free/Starter users use the shared
                system bot instead.
            </Callout>
            <Callout variant="info" title="How to get a bot token">
                Open Telegram → search{" "}
                <code className="text-xs">@BotFather</code> → send{" "}
                <code className="text-xs">/newbot</code> → follow prompts → copy token
                (format: <code className="text-xs">123456:ABC-DEF...</code>).
            </Callout>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Add Bot</h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/bots"
                    description="Register a bot token. Token is verified with Telegram automatically before saving."
                    meta={
                        <>
                            <span>🔒 Auth required</span>
                            <span>🔒 Requires allowOwnBot</span>
                            <span>⚡ Instant approval</span>
                        </>
                    }
                />
                <FieldTable
                    fields={[
                        { name: "name", type: "string", required: "required", description: "Display name (1-120 chars)" },
                        { name: "token", type: "string", required: "required", description: "Bot token from BotFather (format: 123456:ABC...)" },
                        { name: "username", type: "string", required: "optional", description: "Bot username without @ (auto-detected if omitted)" },
                        { name: "active", type: "boolean", required: "optional", description: "Default: true" },
                    ]}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch("https://api-notify-manage.vercel.app/api/v1/user/bots", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    name: "Nofity Manager Gateway",
    token: "789****567:AAHdqTc**********5PALDsaw",
    username: "@notifyManager_gateway_bot"
  })
});

const result = await response.json();
if (result.success) {
  console.log("Bot ID:", result.data.id);
  console.log("Token preview:", result.data.tokenPreview); // "7891…saw"
}`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/bots");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "name" => "Nofity Manager Gateway",
        "token" => "789****567:AAHdqTc**********5PALDsaw",
        "username" => "@notifyManager_gateway_bot"
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

if ($result["success"]) {
    echo "Bot ID: " . $result["data"]["id"];
}`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.post(
    "https://api-notify-manage.vercel.app/api/v1/user/bots",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "name": "Nofity Manager Gateway",
        "token": "789****567:AAHdqTc**********5PALDsaw",
        "username": "@notifyManager_gateway_bot",
    },
)

result = response.json()
if result["success"]:
    print("Bot ID:", result["data"]["id"])`}
                />
                <ResponseBlock
                    status={201}
                    description="Bot registered (auto-verified)"
                    response={`{
  "success": true,
  "message": "Bot created successfully",
  "data": {
    "id": "6ad...",
    "name": "Nofity Manager Gateway",
    "username": "@notifyManager_gateway_bot",
    "tokenPreview": "7891…saw",
    "status": "approved",
    "verified": true,
    "active": true
  }
}`}
                />
                <ResponseBlock
                    status={400}
                    description="Invalid token format"
                    response={`{
  "success": false,
  "message": "Invalid Telegram bot token format",
  "code": "BOT_TOKEN_INVALID"
}`}
                />
                <ResponseBlock
                    status={402}
                    description="Own bot not in plan"
                    response={`{
  "success": false,
  "message": "Your package does not include: allowOwnBot",
  "code": "PACKAGE_FEATURE_DISABLED"
}`}
                />

                <ResponseBlock
                    status={409}
                    description="Token already registered"
                    response={`{
  "success": false,
  "message": "This bot token is already registered",
  "code": "BOT_TOKEN_DUPLICATE"
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">List Bots</h2>
                <EndpointCard
                    method="GET"
                    path="/api/v1/user/bots"
                    description="List your registered bots."
                    meta={<span>🔒 Auth required</span>}
                />

                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch(
  "https://api-notify-manage.vercel.app/api/v1/user/bots?active=true",
  { headers: { Authorization: \`Bearer \${accessToken}\` } }
);

const result = await response.json();
result.data.items.forEach(bot => {
  console.log(\`\${bot.name} (@\${bot.username}) — \${bot.tokenPreview}\`);
});`}
                />
                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/bots?active=true");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer " . $accessToken],
]);

$response = curl_exec($ch);
curl_close($ch);
$result = json_decode($response, true);

foreach ($result["data"]["items"] as $bot) {
    echo $bot["name"] . " (@" . $bot["username"] . ")\\n";
}`}
                />
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.get(
    "https://api-notify-manage.vercel.app/api/v1/user/bots",
    params={"active": True},
    headers={"Authorization": f"Bearer {access_token}"},
)

result = response.json()
for bot in result["data"]["items"]:
    print(bot["name"], f"(@{bot['username']})")`}
                />

                <ResponseBlock
                    status={200}
                    description="Bots list"
                    response={`{
  "success": true,
  "data": {
    "items": [
      {
        "id": "6ad...",
        "name": "Nofity Manager Gateway",
        "username": "@notifyManager_gateway_bot",
        "tokenPreview": "7891…saw",
        "isSystem": false,
        "active": true
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
                <EndpointCard method="GET" path="/api/v1/user/bots/:id" />
                <EndpointCard method="PATCH" path="/api/v1/user/bots/:id" />
                <EndpointCard method="DELETE" path="/api/v1/user/bots/:id" />
                <Callout variant="info" title="Token update">
                    When updating a bot, leave the <code className="text-xs">token</code>{" "}
                    field blank to keep the current one. Providing a new token triggers
                    re-verification with Telegram.
                </Callout>
                <CodeBlock
                    language="js"
                    title="JavaScript — Update (name only)"
                    code={`await fetch(\`https://api-notify-manage.vercel.app/api/v1/user/bots/\${botId}\`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    name: "New Bot Name",
    active: true
    // No token field — keeps existing token
  })
});`}
                />
                <Callout variant="danger" title="Delete protection">
                    A bot cannot be deleted if any destination references it. Delete
                    those destinations first, or the request returns{" "}
                    <code className="text-xs">403 CONFLICT</code>.
                </Callout>
            </section>
        </div>
    );
};

export default ApiBots;