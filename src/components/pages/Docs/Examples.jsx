import { Link } from "react-router";
import { Package, CreditCard, Bell, Rocket, Shield, Users } from "lucide-react";
import Callout from "./components/Callout";
import PageMeta from "./components/PageMeta";
import CodeBlock from "./components/CodeBlock";

const EXAMPLES = [
    {
        id: "ecommerce-order",
        icon: Package,
        title: "E-commerce Order Flow",
        description: "Complete order lifecycle: customer registers, orders, gets notified at each step.",
    },
    {
        id: "payment-webhook",
        icon: CreditCard,
        title: "Payment Webhook Handler",
        description: "Handle payment success and notify customer with idempotency.",
    },
    {
        id: "broadcast",
        icon: Rocket,
        title: "Broadcast Announcement",
        description: "Send one notification to all customers at once.",
    },
    {
        id: "error-monitoring",
        icon: Shield,
        title: "Error Monitoring Alerts",
        description: "Alert DevOps team when critical errors occur.",
    },
    {
        id: "customer-onboarding",
        icon: Users,
        title: "Customer Onboarding",
        description: "Webhook + auto-register when customer /start's your bot.",
    },
    {
        id: "retry-pattern",
        icon: Bell,
        title: "Retry with Backoff",
        description: "Handle rate limits and network failures gracefully.",
    },
];

const Examples = () => {
    return (
        <PageMeta
            title="Real-World Examples"
            description="Complete code examples for common scenarios: e-commerce, payments, broadcasts, error monitoring, and more."
            keywords="notify manager examples, telegram api examples, webhook, e-commerce, payment"
            path="/examples"
        >
            <div className="space-y-3">
                <div>
                    <h1 className="page-title">Real-World Examples</h1>
                    <p className="mt-2 text-sm text-white/60">
                        Complete, production-ready code examples. Copy, adapt, deploy.
                    </p>
                </div>
                <Callout variant="info" title="All examples use the public API">
                    These use <code className="text-xs">/api/v1/notify</code> and{" "}
                    <code className="text-xs">/api/v1/subscriptions</code> — no
                    authentication required. Just register your domain first.
                </Callout>
                <div className="card">
                    <h2 className="mb-3 text-sm font-semibold text-gray-100">
                        Jump to an example
                    </h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {EXAMPLES.map((ex) => {
                            const Icon = ex.icon;
                            return (
                                <a
                                    key={ex.id}
                                    href={`#${ex.id}`}
                                    className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.03]"
                                >
                                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-indigo-500/10 text-indigo-400">
                                        <Icon size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-gray-100">
                                            {ex.title}
                                        </p>
                                        <p className="truncate text-[10px] text-white/40">
                                            {ex.description}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
                <section id="ecommerce-order" className="scroll-mt-20">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Package size={16} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-100">
                            1. E-commerce Order Flow
                        </h2>
                    </div>
                    <p className="mb-3 text-sm text-gray-300">
                        Complete flow: customer /start's bot → registered → orders →
                        receives update at each stage.
                    </p>

                    <CodeBlock
                        language="js"
                        title="Node.js + Express — Full Server"
                        code={`import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const NOTIFY_API = "https://api-notify-manage.vercel.app/api/v1";
const DOMAIN = "your-domain.com";
const BOT_ID = "6ad26cc5eb1769945f52879";

/* ─── 1. Telegram webhook: register customer on /start ─── */
app.post("/telegram/webhook", async (req, res) => {
  const { message } = req.body;
  if (!message?.text?.startsWith("/start")) return res.send("ok");

  const chatId = message.chat.id;
  const name = message.from.first_name;
  const externalUserId = \`tg-\${chatId}\`;

  // Save to your DB
  await db.customers.upsert(externalUserId, {
    name, chatId, joinedAt: new Date()
  });

  // Register with Notify Manager
  await fetch(\`\${NOTIFY_API}/subscriptions\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: DOMAIN,
      externalUserId,
      chatId: String(chatId),
      botId: BOT_ID,
      name
    })
  });

  // Send welcome via Notify Manager (or directly via Telegram)
  await fetch(\`\${NOTIFY_API}/notify\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "welcome",
      domain: DOMAIN,
      data: {
        userId: externalUserId,
        message: \`Welcome \${name}! You'll receive order updates here.\`
      }
    })
  });

  res.send("ok");
});

/* ─── 2. Order placed ─── */
app.post("/orders", async (req, res) => {
  const order = await db.orders.create(req.body);
  const customer = await db.customers.findById(order.customerId);

  await fetch(\`\${NOTIFY_API}/notify\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": \`order-\${order.id}-placed\`
    },
    body: JSON.stringify({
      type: "order",
      domain: DOMAIN,
      data: {
        userId: customer.externalUserId,
        orderId: order.id,
        status: "placed",
        amount: order.total,
        items: order.items.map(i => i.name).join(", ")
      }
    })
  });

  res.json(order);
});

/* ─── 3. Order shipped ─── */
app.post("/orders/:id/shipped", async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  const customer = await db.customers.findById(order.customerId);

  await fetch(\`\${NOTIFY_API}/notify\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": \`order-\${order.id}-shipped\`
    },
    body: JSON.stringify({
      type: "order",
      domain: DOMAIN,
      data: {
        userId: customer.externalUserId,
        orderId: order.id,
        status: "shipped",
        courier: req.body.courier,
        trackingNumber: req.body.trackingNumber
      }
    })
  });

  res.json({ ok: true });
});

/* ─── 4. Order delivered ─── */
app.post("/orders/:id/delivered", async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  const customer = await db.customers.findById(order.customerId);

  await fetch(\`\${NOTIFY_API}/notify\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": \`order-\${order.id}-delivered\`
    },
    body: JSON.stringify({
      type: "order",
      domain: DOMAIN,
      data: {
        userId: customer.externalUserId,
        orderId: order.id,
        status: "delivered",
        deliveredAt: new Date().toISOString()
      }
    })
  });

  res.json({ ok: true });
});

app.listen(3000);`}
                    />

                    <Callout variant="success" title="Why idempotency keys?">
                        Using <code className="text-xs">order-{order.id}-{"{status}"}</code>{" "}
                        ensures each stage fires exactly once, even if your code retries.
                        Duplicate calls become no-ops.
                    </Callout>
                </section>

                {/* Example 2: Payment Webhook */}
                <section id="payment-webhook" className="scroll-mt-20">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                            <CreditCard size={16} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-100">
                            2. Payment Webhook Handler
                        </h2>
                    </div>
                    <p className="mb-3 text-sm text-gray-300">
                        Handle Stripe/bKash payment success with idempotency and error
                        handling.
                    </p>

                    <CodeBlock
                        language="js"
                        title="Node.js — Payment webhook"
                        code={`app.post("/webhooks/stripe", async (req, res) => {
  const event = req.body;

  // Verify signature (use stripe library in production)
  if (!verifyStripeSignature(req)) {
    return res.status(400).send("invalid signature");
  }

  // Only handle successful payments
  if (event.type !== "payment_intent.succeeded") {
    return res.status(200).send("ignored");
  }

  const payment = event.data.object;
  const customer = await db.customers.findOne({
    stripeId: payment.customer
  });

  if (!customer) {
    console.error("Customer not found:", payment.customer);
    return res.status(200).send("no customer"); // ack to Stripe
  }

  try {
    const response = await fetch(\`\${NOTIFY_API}/notify\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": \`payment-\${payment.id}\`
      },
      body: JSON.stringify({
        type: "payment",
        domain: DOMAIN,
        data: {
          userId: customer.externalUserId,
          paymentId: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency.toUpperCase(),
          status: "success",
          description: payment.description || "Payment received"
        }
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log("Payment notification sent:", result.data.requestId);
    } else {
      console.error("Notify failed:", result.code, result.message);
      // Log for retry — don't fail the webhook
    }
  } catch (err) {
    console.error("Notify API error:", err.message);
    // Stripe will retry — idempotency key protects against duplicates
  }

  // Always respond 200 so Stripe doesn't retry unnecessarily
  res.status(200).send("ok");
});`}
                    />

                    <Callout variant="warning" title="Always respond 200 to webhooks">
                        Even if your notification fails, respond <code className="text-xs">200</code>{" "}
                        to the payment provider. Otherwise they'll retry and you'll get
                        duplicates (which idempotency handles, but noise is unnecessary).
                    </Callout>
                </section>

                {/* Example 3: Broadcast */}
                <section id="broadcast" className="scroll-mt-20">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                            <Rocket size={16} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-100">
                            3. Broadcast Announcement
                        </h2>
                    </div>
                    <p className="mb-3 text-sm text-gray-300">
                        Send one message to all your registered customers at once. Uses{" "}
                        <code className="text-xs">user_dynamic_broadcast</code> destination.
                    </p>

                    <CodeBlock
                        language="js"
                        title="JavaScript"
                        code={`// Send to ALL active subscribers of your domain
await fetch(\`\${NOTIFY_API}/notify\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "announcement",
    domain: "shop.rahim.com",
    data: {
      title: "🎉 Black Friday Sale Live!",
      message: "50% off everything. Ends midnight!",
      url: "https://shop.rahim.com/black-friday",
      // No userId → broadcasts to all subscribers
    }
  })
});`}
                    />

                    <CodeBlock
                        language="js"
                        title="Node.js — Scheduled broadcast"
                        code={`import cron from "node-cron";

// Every Friday at 9 AM
cron.schedule("0 9 * * 5", async () => {
  const stats = await db.announcements.pending();

  for (const announcement of stats) {
    try {
      const res = await fetch(\`\${NOTIFY_API}/notify\`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": \`broadcast-\${announcement.id}\`
        },
        body: JSON.stringify({
          type: "announcement",
          domain: DOMAIN,
          data: {
            title: announcement.title,
            message: announcement.body
          }
        })
      });

      const result = await res.json();
      console.log(
        \`Broadcast \${announcement.id}: \${result.data.status} \` +
        \`(\${result.data.deliveryCount} recipients)\`
      );

      await db.announcements.markSent(announcement.id);
    } catch (err) {
      console.error(\`Broadcast \${announcement.id} failed:\`, err.message);
    }
  }
});`}
                    />

                    <Callout variant="warning" title="Broadcast requires route">
                        Make sure your route includes a{" "}
                        <code className="text-xs">user_dynamic_broadcast</code> destination.
                        Otherwise the notify call will skip broadcast delivery.
                    </Callout>
                </section>

                {/* Example 4: Error Monitoring */}
                <section id="error-monitoring" className="scroll-mt-20">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                            <Shield size={16} />
                        </div>
                        <h2 className="mb-3 text-lg font-semibold text-gray-100">
                            4. Error Monitoring Alerts
                        </h2>
                    </div>
                    <p className="mb-3 text-sm text-gray-300">
                        Alert your DevOps team via Telegram when critical errors happen.
                    </p>

                    <CodeBlock
                        language="js"
                        title="Node.js — Express error handler"
                        code={`/* Global error handler with notifications */
app.use(async (err, req, res, next) => {
  console.error("Server error:", err);

  // Only alert on critical errors (5xx)
  if (err.statusCode >= 500 || !err.statusCode) {
    try {
      await fetch(\`\${NOTIFY_API}/notify\`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": \`error-\${err.stack?.slice(0, 50)}-\${Date.now() / 60000 | 0}\`
          // ↑ Groups identical errors within 1-minute windows
        },
        body: JSON.stringify({
          type: "error",
          domain: "api.rahim.com",
          data: {
            severity: "critical",
            message: err.message,
            endpoint: req.originalUrl,
            method: req.method,
            ip: req.ip,
            stack: err.stack?.split("\\n").slice(0, 3).join("\\n"),
            environment: process.env.NODE_ENV
          }
        })
      });
    } catch (notifyErr) {
      console.error("Failed to alert:", notifyErr.message);
      // Never let notification failure crash the app
    }
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
});`}
                    />

                    <CodeBlock
                        language="js"
                        title="Node.js — Unhandled promise / exception"
                        code={`process.on("unhandledRejection", async (reason) => {
  console.error("Unhandled rejection:", reason);

  await fetch(\`\${NOTIFY_API}/notify\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "error",
      domain: "api.rahim.com",
      data: {
        severity: "critical",
        category: "unhandledRejection",
        message: String(reason),
        environment: process.env.NODE_ENV
      }
    })
  }).catch(() => {}); // silent — do not crash on alert failure
});

process.on("uncaughtException", async (error) => {
  console.error("Uncaught exception:", error);

  await fetch(\`\${NOTIFY_API}/notify\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "error",
      domain: "api.rahim.com",
      data: {
        severity: "critical",
        category: "uncaughtException",
        message: error.message,
        stack: error.stack?.split("\\n").slice(0, 3).join("\\n")
      }
    })
  }).catch(() => {});

  process.exit(1);
});`}
                    />

                    <Callout variant="info" title="Rate limit protection">
                        The idempotency key includes a time bucket (
                        <code className="text-xs">Date.now() / 60000 | 0</code> = current
                        minute). Same error within one minute → single notification.
                    </Callout>
                </section>
                <section id="customer-onboarding" className="scroll-mt-20">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                            <Users size={16} />
                        </div>
                        <h2 className="mb-3 text-lg font-semibold text-gray-100">
                            5. Customer Onboarding Flow
                        </h2>
                    </div>
                    <p className="mb-3 text-sm text-gray-300">
                        Full webhook handler: when customer /start's your bot, auto-register
                        and send welcome message.
                    </p>

                    <CodeBlock
                        language="js"
                        title="Node.js + Express — Complete onboarding"
                        code={`import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

/* ─── Set webhook once at startup ─── */
async function setupWebhook(botToken, webhookUrl) {
  const res = await fetch(
    \`https://api.telegram.org/bot\${botToken}/setWebhook\`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl })
    }
  );
  const result = await res.json();
  console.log("Webhook setup:", result.ok);
}

setupWebhook(process.env.BOT_TOKEN, "https://api.iftyhasan.com/telegram/webhook");

/* ─── Handle /start ─── */
app.post("/telegram/webhook", async (req, res) => {
  const { message } = req.body;

  if (!message?.text?.startsWith("/start")) {
    return res.send("ok");
  }

  const chatId = message.chat.id;
  const firstName = message.from.first_name;
  const username = message.from.username || "";
  const externalUserId = \`tg-\${chatId}\`;

  try {
    // Step 1: Save to your own DB
    const existing = await db.customers.findOne({ externalUserId });
    if (!existing) {
      await db.customers.create({
        externalUserId,
        chatId: String(chatId),
        name: firstName,
        username,
        joinedAt: new Date()
      });
    }

    // Step 2: Register with Notify Manager (idempotent)
    const subRes = await fetch(\`\${NOTIFY_API}/subscriptions\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: DOMAIN,
        externalUserId,
        chatId: String(chatId),
        botId: BOT_ID,
        name: firstName,
        username,
        metadata: { source: "telegram", joinedAt: new Date().toISOString() }
      })
    });
    const subResult = await subRes.json();

    if (!subResult.success) {
      console.error("Subscribe failed:", subResult.code);
      return res.send("ok");
    }

    // Step 3: Send welcome message
    const isNew = subResult.data.created;
    await fetch(\`\${NOTIFY_API}/notify\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "welcome",
        domain: DOMAIN,
        data: {
          userId: externalUserId,
          message: isNew
            ? \`Welcome \${firstName}! 🎉\\n\\nYou'll receive order updates here.\`
            : \`Welcome back \${firstName}! Ready for more orders.\`
        }
      })
    });

    console.log(\`Onboarded: \${externalUserId} (new: \${isNew})\`);
  } catch (err) {
    console.error("Onboarding error:", err.message);
    // Always 200 to prevent Telegram retries
  }

  res.send("ok");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`}
                    />
                </section>
                <section id="retry-pattern" className="scroll-mt-20">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                            <Bell size={16} />
                        </div>
                        <h2 className="mb-3 text-lg font-semibold text-gray-100">
                            6. Retry with Exponential Backoff
                        </h2>
                    </div>
                    <p className="mb-3 text-sm text-gray-300">
                        Handle rate limits, network errors, and transient failures gracefully.
                    </p>

                    <CodeBlock
                        language="js"
                        title="JavaScript — Robust notification sender"
                        code={`async function sendWithRetry(payload, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(\`\${NOTIFY_API}/notify\`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": payload.idempotencyKey
        },
        body: JSON.stringify({
          type: payload.type,
          domain: payload.domain,
          data: payload.data
        })
      });

      const result = await res.json();

      // Success → return
      if (result.success) {
        return { ok: true, data: result.data };
      }

      // Permanent errors → no retry
      const permanentCodes = [
        "VALIDATION_ERROR",
        "FORBIDDEN_FIELD",
        "DOMAIN_NOT_FOUND",
        "NOTIFICATION_TYPE_NOT_FOUND",
        "PACKAGE_LIMIT_NOTIFICATIONS",
        "PACKAGE_LIMIT_DOMAINS"
      ];

      if (permanentCodes.includes(result.code)) {
        return { ok: false, code: result.code, message: result.message };
      }

      // Rate limit → wait for reset
      if (res.status === 429) {
        const resetIn = Number(res.headers.get("RateLimit-Reset")) || 60;
        console.warn(\`Rate limited. Waiting \${resetIn}s...\`);
        await new Promise(r => setTimeout(r, resetIn * 1000));
        lastError = { code: result.code, message: result.message };
        continue;
      }

      // Transient (5xx) → exponential backoff
      if (res.status >= 500) {
        lastError = { code: result.code, message: result.message };
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(\`Server error. Retrying in \${delay}ms...\`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      // Other 4xx → permanent
      return { ok: false, code: result.code, message: result.message };
    } catch (err) {
      // Network error → retry
      lastError = { code: "NETWORK_ERROR", message: err.message };
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(\`Network error. Retrying in \${delay}ms...\`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  return {
    ok: false,
    code: lastError?.code || "MAX_RETRIES",
    message: \`Failed after \${maxRetries + 1} attempts: \${lastError?.message}\`
  };
}

// Usage
const result = await sendWithRetry({
  idempotencyKey: \`order-\${orderId}-confirmed\`,
  type: "order",
  domain: "shop.rahim.com",
  data: {
    userId: "customer-hasina",
    orderId,
    amount: 2500
  }
});

if (!result.ok) {
  console.error("Notification failed:", result);
  // Log to your own monitoring system
}`}
                    />

                    <div className="mt-3">
                        <h3 className="mb-2 text-sm font-semibold text-gray-100">
                            Retry Decision Tree
                        </h3>
                        <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                            <table className="w-full min-w-[500px] text-sm">
                                <thead className="bg-white/[0.03]">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                            Response
                                        </th>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-white/[0.06]">
                                        <td className="px-3 py-2">
                                            <code className="text-[11px] text-emerald-300">2xx success</code>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-300">
                                            Done — no retry needed
                                        </td>
                                    </tr>
                                    <tr className="border-t border-white/[0.06]">
                                        <td className="px-3 py-2">
                                            <code className="text-[11px] text-amber-300">429 rate limited</code>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-300">
                                            Wait for RateLimit-Reset seconds, then retry
                                        </td>
                                    </tr>
                                    <tr className="border-t border-white/[0.06]">
                                        <td className="px-3 py-2">
                                            <code className="text-[11px] text-red-300">500 / 502 / 503</code>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-300">
                                            Retry with exponential backoff (max 3 attempts)
                                        </td>
                                    </tr>
                                    <tr className="border-t border-white/[0.06]">
                                        <td className="px-3 py-2">
                                            <code className="text-[11px] text-amber-300">400 / 402 / 404</code>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-300">
                                            Permanent — fix the issue, don't retry
                                        </td>
                                    </tr>
                                    <tr className="border-t border-white/[0.06]">
                                        <td className="px-3 py-2">
                                            <code className="text-[11px] text-red-300">401 unauthorized</code>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-300">
                                            Refresh token, retry once
                                        </td>
                                    </tr>
                                    <tr className="border-t border-white/[0.06]">
                                        <td className="px-3 py-2">
                                            <code className="text-[11px] text-red-300">Network error</code>
                                        </td>
                                        <td className="px-3 py-2 text-xs text-gray-300">
                                            Retry with exponential backoff
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
                <Callout variant="info" title="Need more examples?">
                    Check the{" "}
                    <Link
                        to="/docs/public-api/notify"
                        className="underline-offset-2 hover:underline"
                    >
                        Send Notification
                    </Link>{" "}
                    page for language-specific examples in JavaScript, PHP, and Python.
                    For debugging failures, see{" "}
                    <Link
                        to="/docs/troubleshooting"
                        className="underline-offset-2 hover:underline"
                    >
                        Troubleshooting
                    </Link>
                    .
                </Callout>
            </div>
        </PageMeta>
    );
};

export default Examples;