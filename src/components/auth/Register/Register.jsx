import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Building2, Globe, Lock, Mail, Phone, User as UserIcon, UserPlus } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";
import AuthNavbar from "../../shared/AuthNavbar";

const EMPTY_FORM = {
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    company: "",
    country: "",
};

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = "Name is required";
        else if (form.name.length > 120) next.name = "Max 120 characters";
        if (!form.email.trim()) next.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            next.email = "Invalid email format";
        };
        if (!form.phone.trim()) next.phone = "Phone is required";
        else if (!/^\+?[0-9\s\-()]{7,20}$/.test(form.phone.trim())) {
            next.phone = "Invalid phone number";
        };
        if (!form.username.trim()) next.username = "Username is required";
        else if (!/^[a-z0-9_.-]{3,40}$/.test(form.username.trim().toLowerCase())) {
            next.username = "3-40 chars: a-z, 0-9, _, ., -";
        };
        if (!form.password) next.password = "Password is required";
        else if (form.password.length < 8) next.password = "Min 8 characters";
        else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
            next.password = "Must contain at least one letter and one number";
        };
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await axiosInstance.post(ENDPOINTS.auth.register, {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                username: form.username.trim().toLowerCase(),
                password: form.password,
                company: form.company.trim(),
                country: form.country.trim(),
            });

            toast.success("Registration successful! Please log in.");
            navigate("/login", { replace: true });
        } catch (error) {
            /* interceptor toasts, but attach field errors if backend returns them */
            if (error.code === "ACCOUNT_EXISTS" && error.message) {
                if (error.message.toLowerCase().includes("email")) {
                    setErrors({ email: "Email already registered" });
                } else if (error.message.toLowerCase().includes("username")) {
                    setErrors({ username: "Username already taken" });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main >
            <AuthNavbar />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0c1a] via-[#0a0c1c] to-[#03030d] px-3 py-8">
                <div className="w-full max-w-lg">
                    <form onSubmit={handleSubmit} className="card p-3">
                        <div className="mb-5 text-center">
                            <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
                                Notify Manager
                            </h1>
                            <p className="mt-1 text-sm text-white/60">Create your free account</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="label">Full Name</label>
                                <div className="relative">
                                    <UserIcon
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                    />
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder="Hasan Ali"
                                        className={`input pl-9 ${errors.name ? "input-error" : ""}`}
                                    />
                                </div>
                                {errors.name && <p className="error-text">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <div className="relative">
                                    <Mail
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder="you@example.com"
                                        className={`input pl-9 ${errors.email ? "input-error" : ""}`}
                                    />
                                </div>
                                {errors.email && <p className="error-text">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="label">Phone</label>
                                <div className="relative">
                                    <Phone
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                    />
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder="+8801712345678"
                                        className={`input pl-9 ${errors.phone ? "input-error" : ""}`}
                                    />
                                </div>
                                {errors.phone && <p className="error-text">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="label">Username</label>
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="username"
                                    className={`input ${errors.username ? "input-error" : ""}`}
                                />
                                {errors.username && <p className="error-text">{errors.username}</p>}
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <div className="relative">
                                    <Lock
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                    />
                                    <input
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={form.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder="Min 8 chars, letter + number"
                                        className={`input pl-9 ${errors.password ? "input-error" : ""}`}
                                    />
                                </div>
                                {errors.password && <p className="error-text">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="label">
                                    Company <span className="text-[10px] text-white/30">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Building2
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                    />
                                    <input
                                        name="company"
                                        value={form.company}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder="Acme Inc."
                                        className="input pl-9"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">
                                    Country <span className="text-[10px] text-white/30">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Globe
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                    />
                                    <input
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        disabled={loading}
                                        placeholder="Bangladesh"
                                        className="input pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary mt-6 w-full"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16} />
                                    Create Account
                                </>
                            )}
                        </button>
                        <p className="mt-4 text-center text-sm text-white/60">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-indigo-400 hover:text-indigo-300"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Register;