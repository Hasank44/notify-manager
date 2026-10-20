import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { Building2, Calendar, Globe, Key, Mail, Phone, Save, Shield, User as UserIcon } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endpoints";
import { setUser } from "@/redux/userSlice";
import PageHeader from "../../shared/PageHeader";
import { formatDateTime, formatRelative } from "@/utils/formatDate";

const Profile = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: user?.name ?? "",
        phone: user?.phone ?? "",
        company: user?.company ?? "",
        country: user?.country ?? "",
    });
    const [profileErrors, setProfileErrors] = useState({});
    const [savingProfile, setSavingProfile] = useState(false);

    const [pwForm, setPwForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [pwErrors, setPwErrors] = useState({});
    const [savingPw, setSavingPw] = useState(false);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await axiosInstance.get(ENDPOINTS.auth.me);
            dispatch(setUser(response.data));
            setProfileForm({
                name: response.data.name ?? "",
                phone: response.data.phone ?? "",
                company: response.data.company ?? "",
                country: response.data.country ?? "",
            });
            toast.success("Profile refreshed");
        } catch {
            /* interceptor toasts */
        } finally {
            setRefreshing(false);
        }
    }, [dispatch]);

    if (!user) return null;

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm((prev) => ({ ...prev, [name]: value }));
        if (profileErrors[name]) setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateProfile = () => {
        const next = {};
        if (!profileForm.name.trim()) next.name = "Name is required";
        else if (profileForm.name.length > 120) next.name = "Max 120 characters";
        if (!profileForm.phone.trim()) next.phone = "Phone is required";
        else if (!/^\+?[0-9\s\-()]{7,20}$/.test(profileForm.phone.trim())) {
            next.phone = "Invalid phone number";
        }
        setProfileErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;
        setSavingProfile(true);
        try {
            const response = await axiosInstance.patch(ENDPOINTS.auth.profile, {
                name: profileForm.name.trim(),
                phone: profileForm.phone.trim(),
                company: profileForm.company.trim(),
                country: profileForm.country.trim(),
            });
            dispatch(setUser(response.data));
            toast.success("Profile updated");
        } catch {
            /* interceptor toasts */
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePwChange = (e) => {
        const { name, value } = e.target;
        setPwForm((prev) => ({ ...prev, [name]: value }));
        if (pwErrors[name]) setPwErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validatePw = () => {
        const next = {};
        if (!pwForm.currentPassword) next.currentPassword = "Current password required";
        if (!pwForm.newPassword) next.newPassword = "New password required";
        else if (pwForm.newPassword.length < 8) next.newPassword = "At least 8 characters";
        else if (!/[A-Za-z]/.test(pwForm.newPassword) || !/[0-9]/.test(pwForm.newPassword)) {
            next.newPassword = "Must contain at least one letter and one number";
        }
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            next.confirmPassword = "Passwords do not match";
        }
        setPwErrors(next);
        return Object.keys(next).length === 0;
    };

    const handlePwSubmit = async (e) => {
        e.preventDefault();
        if (!validatePw()) return;
        setSavingPw(true);
        try {
            await axiosInstance.patch(ENDPOINTS.auth.changePassword, {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            toast.success("Password changed successfully");
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setPwErrors({});
        } catch (error) {
            if (error?.message?.toLowerCase().includes("current password")) {
                setPwErrors({ currentPassword: "Incorrect password" });
            }
        } finally {
            setSavingPw(false);
        }
    };

    return (
        <div className="space-y-3">
            <PageHeader
                title="Profile"
                onRefresh={handleRefresh}
                refreshing={refreshing}
            />
            <div className="card">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 text-lg font-bold text-white">
                        {(user.name || user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-gray-100">
                            {user.name || user.username}
                        </h2>
                        <p className="text-xs text-muted">
                            <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5">
                                <Shield size={10} />
                                {user.packageId?.label ?? "No package"}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoRow icon={UserIcon} label="Username" value={user.username} />
                    <InfoRow icon={Mail} label="Email" value={user.email} />
                    <InfoRow
                        icon={Calendar}
                        label="Member since"
                        value={formatDateTime(user.createdAt)}
                    />
                    <InfoRow
                        icon={Calendar}
                        label="Last login"
                        value={user.lastLoginAt ? formatRelative(user.lastLoginAt) : "—"}
                    />
                </div>
            </div>
            <div className="card">
                <div className="mb-3">
                    <h2 className="text-base font-semibold text-gray-100">
                        Edit Profile
                    </h2>
                    <p className="text-xs text-muted">
                        Update your account information
                    </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-3 max-w-md">
                    <div>
                        <label className="label">Full Name</label>
                        <input
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            disabled={savingProfile}
                            className={`input ${profileErrors.name ? "input-error" : ""}`}
                        />
                        {profileErrors.name && ( <p className="error-text">{profileErrors.name}</p> )}
                    </div>
                    <div>
                        <label className="label">Phone</label>
                        <div className="relative">
                            <Phone
                                size={14}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                            />
                            <input
                                name="phone"
                                value={profileForm.phone}
                                onChange={handleProfileChange}
                                disabled={savingProfile}
                                className={`input pl-8 ${profileErrors.phone ? "input-error" : ""}`}
                            />
                        </div>
                        {profileErrors.phone && (<p className="error-text">{profileErrors.phone}</p>)}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="label">Company</label>
                            <div className="relative">
                                <Building2
                                    size={14}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                />
                                <input
                                    name="company"
                                    value={profileForm.company}
                                    onChange={handleProfileChange}
                                    disabled={savingProfile}
                                    className="input pl-8"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">Country</label>
                            <div className="relative">
                                <Globe
                                    size={14}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                />
                                <input
                                    name="country"
                                    value={profileForm.country}
                                    onChange={handleProfileChange}
                                    disabled={savingProfile}
                                    className="input pl-8"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={savingProfile}
                        className="btn-primary"
                    >
                        {savingProfile ? (
                            <>
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <Save size={14} /> Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
            <div className="card">
                <div className="mb-3">
                    <h2 className="text-base font-semibold text-gray-100">
                        Change Password
                    </h2>
                    <p className="text-xs text-muted">
                        Min 8 characters, at least one letter and one number
                    </p>
                </div>
                <form onSubmit={handlePwSubmit} className="space-y-3">
                    <div>
                        <label className="label">Current Password</label>
                        <input
                            name="currentPassword"
                            type="password"
                            autoComplete="current-password"
                            value={pwForm.currentPassword}
                            onChange={handlePwChange}
                            disabled={savingPw}
                            className={`input ${pwErrors.currentPassword ? "input-error" : ""}`}
                        />
                        {pwErrors.currentPassword && (<p className="error-text">{pwErrors.currentPassword}</p>)}
                    </div>
                    <div>
                        <label className="label">New Password</label>
                        <input
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            value={pwForm.newPassword}
                            onChange={handlePwChange}
                            disabled={savingPw}
                            className={`input ${pwErrors.newPassword ? "input-error" : ""}`}
                        />
                        {pwErrors.newPassword && (<p className="error-text">{pwErrors.newPassword}</p>)}
                    </div>
                    <div>
                        <label className="label">Confirm New Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={pwForm.confirmPassword}
                            onChange={handlePwChange}
                            disabled={savingPw}
                            className={`input ${pwErrors.confirmPassword ? "input-error" : ""}`}
                        />
                        {pwErrors.confirmPassword && (<p className="error-text">{pwErrors.confirmPassword}</p>)}
                    </div>
                    <button type="submit" disabled={savingPw} className="btn-primary">
                        {savingPw ? (
                            <>
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Updating…
                            </>
                        ) : (
                            <>
                                <Key size={14} /> Change Password
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/40">
            <Icon size={12} />
            {label}
        </div>
        <p className="mt-1 truncate text-sm text-gray-100">{value || "—"}</p>
    </div>
);

export default Profile;