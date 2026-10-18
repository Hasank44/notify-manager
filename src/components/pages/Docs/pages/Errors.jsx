import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";

const ERROR_GROUPS = [
    {
        title: "Validation Errors",
        status: 400,
        color: "text-amber-300",
        borderColor: "border-amber-500/30",
        bgColor: "bg-amber-500/10",
        codes: [
            { code: "VALIDATION_ERROR", meaning: "Invalid input format (missing field, wrong type)" },
            { code: "FORBIDDEN_FIELD", meaning: "Sent a field not allowed on this endpoint" },
            { code: "INVALID_CONTENT_TYPE", meaning: "Content-Type must be application/json" },
            { code: "INVALID_ID", meaning: "Malformed MongoDB ObjectId" },
            { code: "PAYLOAD_TOO_LARGE", meaning: "Body exceeds 10kb limit" },
            { code: "MALFORMED_JSON", meaning: "Body is not valid JSON" },
        ],
    },
    {
        title: "Authentication Errors",
        status: 401,
        color: "text-red-300",
        borderColor: "border-red-500/30",
        bgColor: "bg-red-500/10",
        codes: [
            { code: "UNAUTHORIZED", meaning: "No token provided or malformed" },
            { code: "TOKEN_EXPIRED", meaning: "Access token expired — refresh it" },
            { code: "TOKEN_INVALID", meaning: "Token signature/tampered" },
            { code: "INVALID_CREDENTIALS", meaning: "Wrong username or password" },
        ],
    },
    {
        title: "Forbidden (403)",
        status: 403,
        color: "text-red-300",
        borderColor: "border-red-500/30",
        bgColor: "bg-red-500/10",
        codes: [
            { code: "ACCOUNT_INACTIVE", meaning: "Account disabled by admin" },
            { code: "ACCOUNT_LOCKED", meaning: "Too many failed login attempts" },
            { code: "DOMAIN_INACTIVE", meaning: "Domain exists but is disabled" },
            { code: "NOTIFICATION_TYPE_INACTIVE", meaning: "Type exists but is disabled" },
            { code: "PACKAGE_FEATURE_DISABLED", meaning: "Feature not in your plan" },
            { code: "RESOURCE_PENDING", meaning: "Resource not yet approved by admin" },
        ],
    },
    {
        title: "Not Found (404)",
        status: 404,
        color: "text-amber-300",
        borderColor: "border-amber-500/30",
        bgColor: "bg-amber-500/10",
        codes: [
            { code: "DOMAIN_NOT_FOUND", meaning: "Domain not registered or not approved" },
            { code: "NOTIFICATION_TYPE_NOT_FOUND", meaning: "Type not found in database" },
            { code: "ROUTE_NOT_FOUND", meaning: "No route for this domain + type" },
            { code: "RESOURCE_NOT_FOUND", meaning: "Generic resource not found" },
            { code: "BOT_NOT_FOUND", meaning: "Bot id does not exist" },
            { code: "DESTINATION_NOT_FOUND", meaning: "Destination id does not exist" },
        ],
    },
    {
        title: "Payment Required (402)",
        status: 402,
        color: "text-amber-300",
        borderColor: "border-amber-500/30",
        bgColor: "bg-amber-500/10",
        codes: [
            { code: "PACKAGE_LIMIT_DOMAINS", meaning: "Domain limit reached for your plan" },
            { code: "PACKAGE_LIMIT_NOTIFICATIONS", meaning: "Monthly notification quota exhausted" },
            { code: "SUBSCRIPTION_INACTIVE", meaning: "Package expired or inactive" },
            { code: "PAYMENT_REQUIRED", meaning: "No active plan" },
        ],
    },
    {
        title: "Conflict (409)",
        status: 409,
        color: "text-red-300",
        borderColor: "border-red-500/30",
        bgColor: "bg-red-500/10",
        codes: [
            { code: "DUPLICATE_RESOURCE", meaning: "Unique constraint violation" },
            { code: "ACCOUNT_EXISTS", meaning: "Username/email already registered" },
            { code: "DOMAIN_EXISTS", meaning: "Domain already registered" },
            { code: "ROUTE_EXISTS", meaning: "Route already exists for domain+type" },
            { code: "BOT_TOKEN_DUPLICATE", meaning: "Bot token already registered" },
            { code: "DESTINATION_EXISTS", meaning: "Same botId+identifier already exists" },
        ],
    },
    {
        title: "Rate Limiting (429)",
        status: 429,
        color: "text-amber-300",
        borderColor: "border-amber-500/30",
        bgColor: "bg-amber-500/10",
        codes: [
            { code: "RATE_LIMITED", meaning: "Global rate limit exceeded" },
            { code: "NOTIFICATION_RATE_LIMITED", meaning: "Notify endpoint limit exceeded" },
            { code: "AUTH_RATE_LIMITED", meaning: "Auth endpoint rate limited" },
            { code: "ADMIN_RATE_LIMITED", meaning: "Admin endpoint rate limited" },
        ],
    },
];

const DELIVERY_ERRORS = [
    { code: "SUBSCRIBER_NOT_FOUND", meaning: "userId in data doesn't match any subscription" },
    { code: "NO_USER_ID", meaning: "Dynamic destination but data.userId missing" },
    { code: "NO_SUBSCRIBERS", meaning: "Broadcast destination but no registered subscribers" },
    { code: "TELEGRAM_AUTH_ERROR", meaning: "Bot token invalid or revoked" },
    { code: "TELEGRAM_BAD_REQUEST", meaning: "User hasn't /start'd the bot or chatId invalid" },
    { code: "TELEGRAM_TIMEOUT", meaning: "Network timeout — will retry automatically" },
    { code: "TELEGRAM_RATE_LIMITED", meaning: "Telegram API rate limit — will retry" },
    { code: "B2C_FEATURE_DISABLED", meaning: "Owner's package lacks allowB2C" },
];

const Errors = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Error Codes</h1>
                <p className="mt-2 text-sm text-white/60">
                    Every error has a machine-readable code, HTTP status, and human
                    message. Match on the code, not the message.
                </p>
            </div>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Error Response Format
                </h2>
                <CodeBlock
                    language="json"
                    title="Every error follows this shape"
                    code={`{
  "success": false,
  "message": "Human-readable explanation",
  "code": "MACHINE_READABLE_CODE",
  "requestId": "NTF-20261018-A8F92D",
  "details": {
    "field": "optional extra context"
  }
}`}
                />
                <Callout variant="info" title="Always log requestId">
                    The <code className="text-xs">requestId</code> uniquely identifies the
                    request. Include it when reporting bugs — support can trace the exact
                    call.
                </Callout>
            </section>
            {ERROR_GROUPS.map((group) => (
                <section key={group.title}>
                    <div className="mb-3 flex items-center gap-2">
                        <span
                            className={`badge border ${group.borderColor} ${group.bgColor} ${group.color}`}
                        >
                            {group.status}
                        </span>
                        <h2 className="text-lg font-semibold text-gray-100">
                            {group.title}
                        </h2>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                        <table className="w-full min-w-[500px] text-sm">
                            <thead className="bg-white/[0.03]">
                                <tr>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                        Code
                                    </th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                        Meaning
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.codes.map((item) => (
                                    <tr key={item.code} className="border-t border-white/[0.06]">
                                        <td className="px-3 py-2">
                                            <code className="text-[11px] text-indigo-300">
                                                {item.code}
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
            ))}
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Delivery Errors (per-destination)
                </h2>
                <p className="mb-3 text-sm text-gray-300">
                    These appear inside <code className="text-xs">deliveries[].error</code>{" "}
                    — they don't fail the whole notification, just that one destination.
                </p>
                <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                    <table className="w-full min-w-[500px] text-sm">
                        <thead className="bg-white/[0.03]">
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                    Code
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                    Meaning
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {DELIVERY_ERRORS.map((item) => (
                                <tr key={item.code} className="border-t border-white/[0.06]">
                                    <td className="px-3 py-2">
                                        <code className="text-[11px] text-red-300">
                                            {item.code}
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
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Handling Errors (Client-Side Pattern)
                </h2>
                <CodeBlock
                    language="js"
                    title="JavaScript — recommended error handler"
                    code={`async function callApi(url, options) {
  const response = await fetch(url, options);
  const result = await response.json();

  if (result.success) return result.data;

  // Log for debugging
  console.error(\`[\${response.status}] \${result.code}: \${result.message}\`, {
    requestId: result.requestId,
    details: result.details
  });

  // Handle specific codes
  switch (result.code) {
    case "TOKEN_EXPIRED":
      await refreshToken();
      return callApi(url, options);      // retry once

    case "RATE_LIMITED":
    case "NOTIFICATION_RATE_LIMITED":
      const resetIn = Number(response.headers.get("RateLimit-Reset")) || 60;
      await new Promise(r => setTimeout(r, resetIn * 1000));
      return callApi(url, options);      // retry after wait

    case "SUBSCRIBER_NOT_FOUND":
      // Log to your own DB — customer must register first
      throw new Error("Customer not registered. Call /subscriptions.");

    case "PACKAGE_LIMIT_NOTIFICATIONS":
      // Alert the user to upgrade
      throw new Error("Monthly quota exhausted.");

    default:
      throw new Error(\`\${result.code}: \${result.message}\`);
  }
}`}
                />
            </section>
            <Callout variant="warning" title="Match on code, not message">
                The <code className="text-xs">message</code> string may be localized or
                changed. Always branch on <code className="text-xs">code</code> — it's
                stable.
            </Callout>
        </div>
    );
};

export default Errors;