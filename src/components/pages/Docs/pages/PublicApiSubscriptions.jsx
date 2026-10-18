import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import FieldTable from "../components/FieldTable";
import ResponseBlock from "../components/ResponseBlock";
import EndpointCard from "../components/EndpointCard";

const PublicApiSubscriptions = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Register Customer (B2C)</h1>
                <p className="mt-2 text-sm text-white/60">
                    Register a customer who will receive notifications from your domain.
                    This is the B2C entry point — required before sending dynamic
                    notifications.
                </p>
            </div>
            <EndpointCard
                method="POST"
                path="/api/v1/subscriptions"
                description="Register or update a customer. Idempotent — safe to call multiple times."
                meta={
                    <>
                        <span>🔓 Public (tokenless)</span>
                        <span>⏱️ 60 requests/min per IP</span>
                        <span>🔒 Requires B2C plan</span>
                    </>
                }
            />
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Request Body
                </h2>
                <FieldTable
                    fields={[
                        { name: "domain", type: "string", required: "required", description: "Your verified domain (e.g., shop.rahim.com)" },
                        { name: "externalUserId", type: "string", required: "required", description: "Your own customer ID (1-120 chars)" },
                        { name: "chatId", type: "string", required: "required", description: "Telegram chatId (numeric, 5-20 digits)" },
                        { name: "botId", type: "string", required: "required", description: "Your registered bot ObjectId" },
                        { name: "name", type: "string", required: "optional", description: "Customer display name" },
                        { name: "email", type: "string", required: "optional", description: "Customer email" },
                        { name: "phone", type: "string", required: "optional", description: "Customer phone" },
                        { name: "username", type: "string", required: "optional", description: "Telegram username (without @)" },
                        { name: "metadata", type: "object", required: "optional", description: "Free-form JSON (custom fields)" },
                    ]}
                />
            </section>
            <Callout variant="info" title="Idempotent operation">
                Calling this endpoint multiple times with the same{" "}
                <code className="text-xs">externalUserId</code> updates the existing
                record instead of creating a duplicate. The response includes a{" "}
                <code className="text-xs">created</code> boolean to tell you which
                happened.
            </Callout>
            <section>
                <CodeBlock
                    language="js"
                    title="JavaScript (Node.js / Browser)"
                    code={`async function registerCustomer(chatId, name) {
  const response = await fetch("https://iftyhasan.com/api/v1/subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "shop.rahim.com",
      externalUserId: \`tg-\${chatId}\`,
      chatId: String(chatId),
      botId: "6ad26cc5eb1769945f76543c",
      name: name,
      email: "customer@example.com"
    })
  });

  const result = await response.json();

  if (result.success) {
    const isNew = result.data.created;
    console.log(isNew ? "New customer registered" : "Customer updated");
    return result.data.subscription;
  } else {
    console.error("Failed:", result.code, result.message);
    throw new Error(result.message);
  }
}

// Usage: when customer /start's your bot
app.post("/telegram/webhook", async (req, res) => {
  const { message } = req.body;
  
  if (message?.text === "/start") {
    await registerCustomer(
      message.chat.id,
      message.from.first_name
    );
  }
  
  res.send("ok");
});`}
                />
            </section>
            <section>
                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

function registerCustomer($chatId, $name) {
    $payload = [
        "domain" => "shop.rahim.com",
        "externalUserId" => "tg-" . $chatId,
        "chatId" => (string) $chatId,
        "botId" => "6ad26cc5eb1769945f76543c",
        "name" => $name,
        "email" => "customer@example.com"
    ];
    
    $ch = curl_init("https://iftyhasan.com/api/v1/subscriptions");
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
        CURLOPT_POSTFIELDS => json_encode($payload),
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $result = json_decode($response, true);
    
    if ($result["success"]) {
        $isNew = $result["data"]["created"];
        echo $isNew ? "New customer registered\\n" : "Customer updated\\n";
        return $result["data"]["subscription"];
    } else {
        error_log("Failed: " . $result["code"] . " - " . $result["message"]);
        throw new Exception($result["message"]);
    }
}

// Usage
registerCustomer(6862958488, "Hasina");`}
                />
            </section>
            <section>
                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

def register_customer(chat_id, name):
    response = requests.post(
        "https://iftyhasan.com/api/v1/subscriptions",
        json={
            "domain": "shop.rahim.com",
            "externalUserId": f"tg-{chat_id}",
            "chatId": str(chat_id),
            "botId": "6ad26cc5eb1769945f76543c",
            "name": name,
            "email": "customer@example.com",
        },
    )
    
    result = response.json()
    
    if result["success"]:
        is_new = result["data"]["created"]
        print("New customer registered" if is_new else "Customer updated")
        return result["data"]["subscription"]
    else:
        print(f"Failed: {result['code']} - {result['message']}")
        raise Exception(result["message"])

# Usage
register_customer(6862958488, "Hasina")`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Responses</h2>
                <ResponseBlock
                    status={201}
                    description="New customer registered"
                    response={`{
  "success": true,
  "message": "Subscription created",
  "data": {
    "created": true,
    "subscription": {
      "id": "6ad...",
      "externalUserId": "tg-6862958488",
      "chatId": "6862958488",
      "name": "Hasina",
      "active": true,
      "totalReceived": 0
    }
  }
}`}
                />

                <ResponseBlock
                    status={200}
                    description="Existing customer updated (idempotent)"
                    response={`{
  "success": true,
  "message": "Subscription updated",
  "data": {
    "created": false,
    "subscription": {
      "id": "6ad...",
      "externalUserId": "tg-6862958488",
      "chatId": "6862958488",
      "active": true
    }
  }
}`}
                />
                <ResponseBlock
                    status={404}
                    description="Domain not registered or not approved"
                    response={`{
  "success": false,
  "message": "Domain is not registered or not verified",
  "code": "DOMAIN_NOT_FOUND",
  "requestId": "NTF-20261018-XXXX"
}`}
                />

                <ResponseBlock
                    status={402}
                    description="B2C not enabled on your plan"
                    response={`{
  "success": false,
  "message": "B2C subscriptions are not available on your plan. Please upgrade.",
  "code": "PACKAGE_FEATURE_DISABLED",
  "requestId": "NTF-20261018-XXXX"
}`}
                />

                <ResponseBlock
                    status={400}
                    description="Invalid chatId format"
                    response={`{
  "success": false,
  "message": "Invalid chatId format",
  "code": "VALIDATION_ERROR",
  "requestId": "NTF-20261018-XXXX"
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Requirements
                </h2>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li>✅ Your domain must be <strong>approved and verified</strong> by an admin</li>
                    <li>✅ Your package must include <code className="text-xs">allowB2C</code> (Pro+ plans)</li>
                    <li>✅ The bot must belong to you OR be the system bot</li>
                    <li>✅ The customer must have <code className="text-xs">/start</code>'d the bot (Telegram requirement)</li>
                </ul>
            </section>
            <section className="card">
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Next Step</h2>
                <p className="text-sm text-gray-300">
                    Once your customer is registered, send them notifications using the{" "}
                    <a
                        href="/docs/public-api/notify"
                        className="text-indigo-400 underline-offset-2 hover:underline"
                    >
                        Send Notification
                    </a>{" "}
                    endpoint with their <code className="text-xs">externalUserId</code> in{" "}
                    <code className="text-xs">data.userId</code>.
                </p>
            </section>
        </div>
    );
};

export default PublicApiSubscriptions;