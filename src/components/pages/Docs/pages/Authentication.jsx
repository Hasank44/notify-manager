import { Link } from "react-router";
import Callout from "../components/Callout";
import CodeBlock from "../components/CodeBlock";
import FieldTable from "../components/FieldTable";
import ResponseBlock from "../components/ResponseBlock";
import EndpointCard from "../components/EndpointCard";

const Authentication = () => {
    return (
        <div className="space-y-3">
            <div>
                <h1 className="page-title">Authentication</h1>
                <p className="mt-2 text-sm text-white/60">
                    Login, register, and manage session tokens. All management API
                    requests require a Bearer token.
                </p>
            </div>
            <Callout variant="info" title="Public API is tokenless">
                The Public API (
                <Link
                    to="/docs/public-api/notify"
                    className="underline-offset-2 hover:underline"
                >
                    /notify
                </Link>
                ,{" "}
                <Link
                    to="/docs/public-api/subscriptions"
                    className="underline-offset-2 hover:underline"
                >
                    /subscriptions
                </Link>
                ) doesn't require authentication. This page is for the Management API.
            </Callout>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Register</h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/auth/register"
                    description="Create a new user account. Free plan is assigned by default."
                    meta={
                        <>
                            <span>🔓 Public</span>
                            <span>📝 JSON body</span>
                        </>
                    }
                />

                <p className="mb-2 mt-3 text-sm font-medium text-gray-100">Request Body</p>
                <FieldTable
                    fields={[
                        { name: "name", type: "string", required: "required", description: "Full name (1-120 chars)" },
                        { name: "email", type: "string", required: "required", description: "Unique email address" },
                        { name: "phone", type: "string", required: "required", description: "Phone number (7-20 chars)" },
                        { name: "username", type: "string", required: "required", description: "3-40 chars, lowercase a-z, 0-9, _, ., -" },
                        { name: "password", type: "string", required: "required", description: "Min 8 chars, letter + number" },
                        { name: "company", type: "string", required: "optional", description: "Company name" },
                        { name: "country", type: "string", required: "optional", description: "Country name" },
                    ]}
                />

                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch("https://api-notify-manage.vercel.app/api/v1/user/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Md Hasan Ali",
    email: "mdhasan.sjb@gmail.com",
    phone: "01814842764",
    username: "username",
    password: "StrongPass123",
    company: "Hasan Shop",
    country: "Bangladesh"
  })
});

const result = await response.json();
if (result.success) {
  console.log("User created:", result.data.id);
} else {
  console.error("Error:", result.code, result.message);
}`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/auth/register");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode([
        "name" => "Md Hasan Ali",
        "email" => "mdhasan.sjb@gmail.com",
        "phone" => "01814842764",
        "username" => "username",
        "password" => "StrongPass123",
        "company" => "Ifty Hasan",
        "country" => "Bangladesh"
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
if ($result["success"]) {
    echo "User created: " . $result["data"]["id"];
} else {
    echo "Error: " . $result["code"] . " - " . $result["message"];
}`}
                />

                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.post(
    "https://api-notify-manage.vercel.app/api/v1/user/auth/register",
    json={
        "name": "Md Hasan Ali",
        "email": "mdhasan.sjb@gmail.com",
        "phone": "01814842764",
        "username": "username",
        "password": "StrongPass123",
        "company": "Hasan Shop",
        "country": "Bangladesh",
    },
)

result = response.json()
if result["success"]:
    print("User created:", result["data"]["id"])
else:
    print("Error:", result["code"], "-", result["message"])`}
                />

                <ResponseBlock
                    status={201}
                    description="Registration successful"
                    response={`{
  "success": true,
  "message": "Registration successful",
  "requestId": "NTF-20261018-XXXX",
  "data": {
    "id": "6ad...",
    "username": "username",
    "email": "mdhasan.sjb@gmail.com",
    "packageId": "...",
    "packageStatus": "active",
    "active": true
  }
}`}
                />

                <ResponseBlock
                    status={409}
                    description="Account already exists"
                    response={`{
  "success": false,
  "message": "username is already taken",
  "code": "ACCOUNT_EXISTS",
  "requestId": "NTF-20261018-XXXX"
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">Login</h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/auth/login"
                    description="Authenticate and receive access + refresh tokens."
                    meta={
                        <>
                            <span>🔓 Public</span>
                            <span>⏱️ Access token: 15 min</span>
                            <span>🔄 Refresh token: 7 days</span>
                        </>
                    }
                />

                <p className="mb-2 mt-3 text-sm font-medium text-gray-100">Request Body</p>
                <FieldTable
                    fields={[
                        { name: "identifier", type: "string", required: "required", description: "Username or email" },
                        { name: "password", type: "string", required: "required", description: "Account password" },
                    ]}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch("https://api-notify-manage.vercel.app/api/v1/user/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identifier: "username",
    password: "StrongPass123"
  })
});

const result = await response.json();

if (result.success) {
  // Save tokens for future requests
  localStorage.setItem("accessToken", result.data.accessToken);
  localStorage.setItem("refreshToken", result.data.refreshToken);
}`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/auth/login");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode([
        "identifier" => "username",
        "password" => "StrongPass123"
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
if ($result["success"]) {
    $accessToken = $result["data"]["accessToken"];
    $refreshToken = $result["data"]["refreshToken"];
    // Store in session or secure storage
}`}
                />

                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.post(
    "https://api-notify-manage.vercel.app/api/v1/user/auth/login",
    json={
        "identifier": "username",
        "password": "StrongPass123",
    },
)

result = response.json()
if result["success"]:
    access_token = result["data"]["accessToken"]
    refresh_token = result["data"]["refreshToken"]
    # Store securely`}
                />

                <ResponseBlock
                    status={200}
                    description="Login successful"
                    response={`{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6ad...",
      "username": "username",
      "email": "hasan@example.com",
      "packageId": "6ad...",
      "packageStatus": "active"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "tokenType": "Bearer",
    "expiresIn": "15m",
    "refreshExpiresIn": "7d"
  }
}`}
                />

                <ResponseBlock
                    status={401}
                    description="Invalid credentials"
                    response={`{
  "success": false,
  "message": "Invalid credentials",
  "code": "INVALID_CREDENTIALS",
  "requestId": "NTF-20261018-XXXX"
}`}
                />

                <Callout variant="info" title="Using the access token">
                    For all protected endpoints, send the token in the header:
                    <div className="mt-2 rounded bg-[#03030d] p-2 font-mono text-[11px]">
                        Authorization: Bearer eyJhbGciOi...
                    </div>
                </Callout>
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Refresh Token
                </h2>
                <EndpointCard
                    method="POST"
                    path="/api/v1/user/auth/refresh"
                    description="Get a new access token using the refresh token (7-day validity)."
                    meta={<span>🔓 Public (uses refresh token)</span>}
                />

                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch("https://api-notify-manage.vercel.app/api/v1/user/auth/refresh", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    refreshToken: localStorage.getItem("refreshToken")
  })
});

const result = await response.json();
if (result.success) {
  localStorage.setItem("accessToken", result.data.accessToken);
  localStorage.setItem("refreshToken", result.data.refreshToken);
}`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/auth/refresh");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode([
        "refreshToken" => $storedRefreshToken
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
if ($result["success"]) {
    $newAccessToken = $result["data"]["accessToken"];
    $newRefreshToken = $result["data"]["refreshToken"];
}`}
                />

                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.post(
    "https://api-notify-manage.vercel.app/api/v1/user/auth/refresh",
    json={"refreshToken": stored_refresh_token},
)

result = response.json()
if result["success"]:
    new_access = result["data"]["accessToken"]
    new_refresh = result["data"]["refreshToken"]`}
                />

                <ResponseBlock
                    status={200}
                    description="New tokens issued"
                    response={`{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Get Current User
                </h2>
                <EndpointCard
                    method="GET"
                    path="/api/v1/user/auth/me"
                    description="Get your profile, package info, and usage stats."
                    meta={
                        <>
                            <span>🔒 Bearer token required</span>
                        </>
                    }
                />
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch("https://api-notify-manage.vercel.app/api/v1/user/auth/me", {
  headers: {
    Authorization: \`Bearer \${localStorage.getItem("accessToken")}\`
  }
});

const result = await response.json();
console.log("Package:", result.data.packageId.name);
console.log("Usage:", result.data.usage.monthCount, "/", result.data.packageId.monthlyNotificationLimit);`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/auth/me");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . $accessToken
    ],
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
if ($result["success"]) {
    $package = $result["data"]["packageId"]["name"];
    $usage = $result["data"]["usage"]["monthCount"];
}`}
                />

                <CodeBlock
                    language="python"
                    title="Python"
                    code={`import requests

response = requests.get(
    "https://api-notify-manage.vercel.app/api/v1/user/auth/me",
    headers={"Authorization": f"Bearer {access_token}"},
)

result = response.json()
if result["success"]:
    package = result["data"]["packageId"]["name"]
    usage = result["data"]["usage"]["monthCount"]`}
                />

                <ResponseBlock
                    status={200}
                    description="Profile returned"
                    response={`{
  "success": true,
  "data": {
    "id": "6ad...",
    "username": "username",
    "name": "Md Hasan Ali",
    "email": "hasan@example.com",
    "packageId": {
      "name": "pro",
      "label": "Pro",
      "domainLimit": 3,
      "monthlyNotificationLimit": 10000,
      "allowOwnBot": true,
      "allowB2C": true
    },
    "packageStatus": "active",
    "usage": {
      "currentMonth": "2026-10",
      "monthCount": 45
    }
  }
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Change Password
                </h2>
                <EndpointCard
                    method="PATCH"
                    path="/api/v1/user/auth/password"
                    description="Change your account password. Requires current password."
                    meta={<span>🔒 Bearer token required</span>}
                />
                <CodeBlock
                    language="js"
                    title="JavaScript"
                    code={`const response = await fetch("https://api-notify-manage.vercel.app/api/v1/user/auth/password", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    currentPassword: "OldPass123",
    newPassword: "NewPass456"
  })
});`}
                />

                <CodeBlock
                    language="php"
                    title="PHP"
                    code={`<?php

$ch = curl_init("https://api-notify-manage.vercel.app/api/v1/user/auth/password");
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => "PATCH",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "currentPassword" => "OldPass123",
        "newPassword" => "NewPass456"
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

response = requests.patch(
    "https://api-notify-manage.vercel.app/api/v1/user/auth/password",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "currentPassword": "OldPass123",
        "newPassword": "NewPass456",
    },
)

result = response.json()`}
                />

                <ResponseBlock
                    status={200}
                    description="Password changed"
                    response={`{
  "success": true,
  "message": "Password changed successfully"
}`}
                />
            </section>
            <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-100">
                    Authentication Errors
                </h2>
                <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0B1220]">
                    <table className="w-full min-w-[500px] text-sm">
                        <thead className="bg-white/[0.03]">
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Code</th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">HTTP</th>
                                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/60">Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-indigo-300">UNAUTHORIZED</code></td>
                                <td className="px-3 py-2"><code className="text-[11px] text-amber-300">401</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">No token provided</td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-indigo-300">TOKEN_EXPIRED</code></td>
                                <td className="px-3 py-2"><code className="text-[11px] text-amber-300">401</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">Access token expired — use refresh</td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-indigo-300">TOKEN_INVALID</code></td>
                                <td className="px-3 py-2"><code className="text-[11px] text-amber-300">401</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">Malformed or tampered token</td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-indigo-300">INVALID_CREDENTIALS</code></td>
                                <td className="px-3 py-2"><code className="text-[11px] text-amber-300">401</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">Wrong username/email or password</td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-indigo-300">ACCOUNT_LOCKED</code></td>
                                <td className="px-3 py-2"><code className="text-[11px] text-red-300">403</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">Too many failed attempts — try again later</td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-indigo-300">ACCOUNT_INACTIVE</code></td>
                                <td className="px-3 py-2"><code className="text-[11px] text-red-300">403</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">Account disabled by admin</td>
                            </tr>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-3 py-2"><code className="text-[11px] text-indigo-300">ACCOUNT_EXISTS</code></td>
                                <td className="px-3 py-2"><code className="text-[11px] text-amber-300">409</code></td>
                                <td className="px-3 py-2 text-xs text-gray-300">Username or email already registered</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Authentication;