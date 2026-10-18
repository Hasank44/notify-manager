import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Lock, LogIn, User } from "lucide-react";
import axiosInstance, { authStorage } from "@/api/axiosInstance";
import { setUser } from "@/redux/userSlice";
import ENDPOINTS from "@/api/endpoints";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ identifier: "", password: "" });
    const [loading, setLoading] = useState(false);

    const redirectTo = location.state?.from?.pathname || "/";

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.identifier.trim() || !form.password) {
            toast.error("Please fill in both fields");
            return;
        }
        setLoading(true);
        try {
            const response = await axiosInstance.post(ENDPOINTS.auth.login, {
                identifier: form.identifier.trim(),
                password: form.password,
            });
            const payload = response.data;
            authStorage.setTokens({
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
            });
            dispatch(setUser(payload.user));
            toast.success(`logged in, ${payload.user.name || payload.user.username}`);
            navigate(redirectTo, { replace: true });
        } catch (error) {
            toast.error(error?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0c1a] via-[#0a0c1c] to-[#03030d] px-4 py-8">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="card p-5">
                    <div className="mb-6 text-center">
                        <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
                            Notify Manager
                        </h1>
                        <p className="mt-1 text-sm text-white/60">Sign in to your account</p>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="identifier" className="label">
                                Username or Email
                            </label>
                            <div className="relative">
                                <User
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                />
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    autoComplete="username"
                                    value={form.identifier}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="username or user@example.com"
                                    className="input pl-9"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="••••••••"
                                    className="input pl-9"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </div>
                    <p className="mt-6 text-center text-sm text-white/60">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-indigo-400 hover:text-indigo-300"
                        >
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default Login;