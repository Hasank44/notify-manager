import { Link } from "react-router";
import { AlertTriangle, Key, RotateCw, Shield, Trash2 } from "lucide-react";
import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import PageMeta from "../components/PageMeta";

const ApiKeys = () => {
    return (
        <PageMeta
            description="Secure your notifications with per-domain API keys. How to generate, use, and rotate keys."
            keywords="notify manager api keys, telegram api authentication, per domain keys"
            path="/api-keys"
        >
            <div className="space-y-3">
                <div>
                    <h1 className="page-title">API Keys</h1>
                    <p className="mt-2 text-sm text-white/60">
                        Every public API request must be authenticated with a per-domain API
                        key. This prevents unauthorized parties from sending notifications
                        on your behalf.
                    </p>
                </div>

                <Callout variant="info" title="One key per environment">
                    Generate separate keys for production, staging, and development.
                    This way, a leaked development key can't affect your production
                    domain.
                </Callout>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Why API Keys?
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="card">
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                <Shield size={18} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-100">
                                Prevent spoofing
                            </h3>
                            <p className="mt-1 text-xs text-white/60">
                                Without keys, anyone knowing your domain could send fake
                                notifications. Keys prove you own the domain.
                            </p>
                        </div>
                        <div className="card">
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                                <RotateCw size={18} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-100">
                                Instant rotation
                            </h3>
                            <p className="mt-1 text-xs text-white/60">
                                If a key leaks, rotate it. The old key fails immediately. No
                                downtime for other domains.
                            </p>
                        </div>
                    </div>
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Generating a Key
                    </h2>
                    <ol className="ml-5 list-decimal space-y-2 text-sm text-gray-300">
                        <li>
                            Add your domain in{" "}
                            <Link
                                to="/docs/api/domains"
                                className="text-indigo-400 underline-offset-2 hover:underline"
                            >
                                Domains
                            </Link>{" "}
                            and wait for admin verification (usually 1-24 hours)
                        </li>
                        <li>
                            Once verified, open{" "}
                            <strong>Domains → [domain] → API Keys</strong>
                        </li>
                        <li>
                            Click <strong>"New Key"</strong>, give it a name (e.g., "Production
                            Key"), and click <strong>Generate</strong>
                        </li>
                        <li>
                            <strong className="text-amber-300">Copy the key immediately</strong>{" "}
                            — it's shown only once
                        </li>
                    </ol>

                    <Callout variant="warning" title="Save the key securely">
                        We store only a SHA-256 hash. If you lose the key, you can't
                        recover it — you'll need to rotate.
                    </Callout>
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Using the Key
                    </h2>
                    <p className="mb-2 text-sm text-gray-300">
                        Send the key in the <code className="text-xs">X-API-Key</code>{" "}
                        header on every request:
                    </p>

                    <CodeBlock
                        language="bash"
                        title="cURL"
                        code={`curl -X POST https://api.iftyhasan.com/api/v1/notify \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: notify_live_abc123..." \\
  -d '{
    "type": "custom",
    "domain": "your-domain.com",
    "data": { "userId": "customer-name", "orderId": "ORD-5001" }
  }'`}
                    />

                    <CodeBlock
                        language="js"
                        title="JavaScript — environment variable (recommended)"
                        code={`// .env
// NOTIFY_API_KEY=notify_live_abc123...
// NOTIFY_DOMAIN=your-domain.com

const API_KEY = process.env.NOTIFY_API_KEY;
const DOMAIN = process.env.NOTIFY_DOMAIN;

await fetch("https://api.iftyhasan.com/api/v1/notify", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": NOTIFY_API_KEY
  },
  body: JSON.stringify({
    type: "custom",
    domain: DOMAIN,
    data: { userId: "customer-name", orderId: "ORD-5001" }
  })
});`}
                    />

                    <CodeBlock
                        language="php"
                        title="PHP"
                        code={`<?php

$apiKey = getenv("NOTIFY_API_KEY");
$domain = getenv("NOTIFY_DOMAIN");

$ch = curl_init("https://api.iftyhasan.com/api/v1/notify");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "X-API-Key: " . $apiKey
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "type" => "custom",
        "domain" => $domain,
        "data" => ["userId" => "customer-name", "orderId" => "ORD-5001"]
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);`}
                    />

                    <CodeBlock
                        language="python"
                        title="Python"
                        code={`import os
import requests

API_KEY = os.getenv("NOTIFY_API_KEY")
DOMAIN = os.getenv("NOTIFY_DOMAIN")

response = requests.post(
    "https://api.iftyhasan.com/api/v1/notify",
    headers={"X-API-Key": API_KEY},
    json={
        "type": "custom",
        "domain": DOMAIN,
        "data": {"userId": "customer-name", "orderId": "ORD-5001"},
    },
)`}
                    />
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Rotating a Key
                    </h2>
                    <p className="mb-2 text-sm text-gray-300">
                        Rotate a key when:
                    </p>
                    <ul className="ml-5 mb-3 list-disc space-y-1 text-sm text-gray-300">
                        <li>The key may have been exposed (e.g., committed to Git)</li>
                        <li>Scheduled rotation (e.g., every 90 days)</li>
                        <li>An employee with access leaves the team</li>
                    </ul>
                    <p className="mb-2 text-sm text-gray-300">
                        To rotate: <strong>API Keys → [key] → ⋮ → Rotate</strong>. The old
                        key is revoked immediately. Update your server's{" "}
                        <code className="text-xs">X-API-Key</code> value with the new key.
                    </p>
                    <Callout variant="warning" title="Rotate during low-traffic windows">
                        The old key stops working the moment you rotate. If your server has
                        cached the old key, requests will fail with{" "}
                        <code className="text-xs">401 API_KEY_REVOKED</code> until you
                        deploy the new key.
                    </Callout>
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Revoking a Key
                    </h2>
                    <p className="mb-2 text-sm text-gray-300">
                        Revoking is a soft delete — the key stops working but stays in your
                        dashboard history for audit. Use it when a key is compromised or no
                        longer needed.
                    </p>
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Best Practices
                    </h2>
                    <ul className="ml-5 list-disc space-y-2 text-sm text-gray-300">
                        <li>
                            ✅ <strong>Store keys in environment variables</strong> — never in
                            source code
                        </li>
                        <li>
                            ✅ <strong>Use separate keys per environment</strong> — production,
                            staging, development
                        </li>
                        <li>
                            ✅ <strong>Rotate every 90 days</strong> — or sooner if leaked
                        </li>
                        <li>
                            ✅ <strong>Add .env to .gitignore</strong> — prevent accidental
                            commits
                        </li>
                        <li>
                            ✅ <strong>Use different keys per service</strong> — if one app's
                            key leaks, others stay safe
                        </li>
                        <li>
                            ❌ <strong>Never embed keys in frontend code</strong> — anyone can
                            see it
                        </li>
                        <li>
                            ❌ <strong>Never log keys</strong> — scrub logs before shipping
                        </li>
                        <li>
                            ❌ <strong>Never paste keys in support tickets, Slack, etc.</strong>
                        </li>
                    </ul>
                </section>
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-gray-100">
                        Common Errors
                    </h2>
                    <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                        <table className="w-full min-w-[500px] text-sm">
                            <thead className="bg-white/[0.03]">
                                <tr>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                        Code
                                    </th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                        Cause
                                    </th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                        Fix
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        code: "API_KEY_REQUIRED",
                                        cause: "X-API-Key header missing",
                                        fix: "Add the header with your key",
                                    },
                                    {
                                        code: "API_KEY_INVALID",
                                        cause: "Key doesn't match any record or wrong domain",
                                        fix: "Check the key value and domain match",
                                    },
                                    {
                                        code: "API_KEY_REVOKED",
                                        cause: "Key was revoked or rotated",
                                        fix: "Generate a new key from dashboard",
                                    },
                                    {
                                        code: "API_KEY_EXPIRED",
                                        cause: "Key passed its expiresAt date",
                                        fix: "Rotate or generate a new key",
                                    },
                                    {
                                        code: "DOMAIN_NOT_VERIFIED_FOR_KEYS",
                                        cause: "Trying to generate key for unverified domain",
                                        fix: "Wait for admin to verify domain",
                                    },
                                    {
                                        code: "API_KEY_LIMIT_REACHED",
                                        cause: "Exceeded keys-per-domain limit",
                                        fix: "Revoke an old key or upgrade plan",
                                    },
                                ].map((row) => (
                                    <tr key={row.code} className="border-t border-white/[0.06]">
                                        <td className="px-3 py-2">
                                            <code className="text-[11px] text-indigo-300">
                                                {row.code}
                                            </code>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-300">
                                            {row.cause}
                                        </td>
                                        <td className="px-3 py-2 text-xs text-emerald-300">
                                            {row.fix}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </PageMeta>
    );
};

export default ApiKeys;