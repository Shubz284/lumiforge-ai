// src/pages/Settings.tsx
import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import SettingsSkeleton from "@/components/skeleton/SettingsSkeleton";

interface MeData {
  isTrialUser: boolean;
  credits: number;
}

const Setting = () => {
  const { data: session, refetch: refetchSession } = useSession();
  const [me, setMe] = useState<MeData | null>(null);

  // Profile form state
  const [name, setName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  useEffect(() => {
    apiFetch("/me")
      .then((data) => setMe(data))
      .catch((err) => console.error("Failed to load account status:", err));
  }, []);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      await authClient.updateUser({ name });
      await refetchSession();
      setProfileMessage("Saved");
    } catch (err) {
      setProfileMessage("Failed to save changes");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    setPasswordSaving(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      });

      if (error) {
        setPasswordError(error.message ?? "Failed to change password");
      } else {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      setPasswordError("Something went wrong");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleResendVerification = async () => {
    if (!session?.user?.email) return;
    await authClient.sendVerificationEmail({ email: session.user.email });
  };

  if (!session?.user) {
    return <SettingsSkeleton />;
  }

  return (
    <div className=" mt-2 ml-9 mr-9 h-full w-auto p-2">
      <div className=" flex justify-center flex-col">
        <h1 className="text-xl font-medium mb-1">Settings</h1>
        <p className="text-sm text-gray-500 mb-6">
          Manage your account and preferences
        </p>
        {/* Profile */}
        <div className="bg-white border rounded-xl p-5 mb-4">
          <p className="text-sm font-medium mb-4">Profile</p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Email</label>
              <input
                type="email"
                value={session.user.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="bg-black text-white rounded-lg px-4 py-1.5 text-sm font-medium disabled:opacity-50"
            >
              {profileSaving ? "Saving..." : "Save changes"}
            </button>
            {profileMessage && (
              <span className="text-xs text-gray-500">{profileMessage}</span>
            )}
          </div>
        </div>
        {/* Plan status */}
        <div className="bg-white border rounded-xl p-5 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1">Plan status</p>
            <p className="text-xs text-gray-500">
              {me?.isTrialUser
                ? "Free trial — limited to Riverflow Fast"
                : "Full access unlocked"}
            </p>
          </div>
          {me?.isTrialUser && (
            <button
              onClick={() => (window.location.href = "/pricing")}
              className="text-sm border rounded-lg px-4 py-1.5"
            >
              View plans
            </button>
          )}
        </div>
        {/* Security */}
        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm font-medium mb-4">Security</p>

          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Email verification</span>
            {session.user.emailVerified ? (
              <span className="bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                Verified
              </span>
            ) : (
              <button
                onClick={handleResendVerification}
                className="text-xs border rounded-lg px-3 py-1"
              >
                Resend verification
              </button>
            )}
          </div>

          <div className="pt-3">
            <p className="text-sm mb-2">Change password</p>
            <div className="flex gap-2 mb-2">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            {passwordError && (
              <p className="text-xs text-red-600 mb-2">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-xs text-green-600 mb-2">Password updated</p>
            )}
            <button
              onClick={handleChangePassword}
              disabled={passwordSaving || !currentPassword || !newPassword}
              className="bg-black text-white rounded-lg px-4 py-1.5 text-sm font-medium disabled:opacity-50"
            >
              {passwordSaving ? "Updating..." : "Update password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
