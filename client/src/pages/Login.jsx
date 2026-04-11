import React, { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { ArrowRight, Mail, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../AuthContext";
import logo from "/logo.png";
import { BASE_URL } from "../config";
import SEO from "../components/SEO";

const readErrorMessage = async (response, fallbackMessage) => {
  try {
    const data = await response.json();
    return data?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname + location.state?.from?.search || "/home";

  const { login, fetchUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSessionId, setResetSessionId] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetHint, setResetHint] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter email and password");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error(await readErrorMessage(res, "Login failed"));
      const data = await res.json();

      toast.success("Welcome back!");

      
      await Promise.all([
        login(data.user || { email }),
        fetchUser()
      ]);

      
      navigate(from, { replace: true });
      window.scrollTo(0, 0);

    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const openForgotPassword = () => {
    setResetEmail(email);
    setResetStep("email");
    setResetSessionId("");
    setResetOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setResetHint("");
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetStep("email");
    setResetEmail("");
    setResetSessionId("");
    setResetOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setResetHint("");
  };

  const sendResetOtp = async () => {
    const normalizedEmail = resetEmail.trim().toLowerCase();
    if (!normalizedEmail) return toast.error("Enter your email first");

    setResetLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!res.ok) throw new Error(await readErrorMessage(res, "Failed to send reset OTP"));
      const data = await res.json();

      setResetSessionId(data.sessionId || "");
      setResetStep("otp");
      setResetHint(data.maskedPhone ? `OTP sent to ${data.maskedPhone}` : "OTP sent to your registered phone");
      toast.success("Reset OTP sent");
    } catch (err) {
      toast.error(err.message || "Failed to send reset OTP");
    } finally {
      setResetLoading(false);
    }
  };

  const verifyAndResetPassword = async () => {
    if (!resetSessionId) return toast.error("Reset session not found");
    if (!resetOtp) return toast.error("Enter the OTP");
    if (!newPassword || !confirmNewPassword) return toast.error("Enter and confirm the new password");
    if (newPassword !== confirmNewPassword) return toast.error("New passwords do not match");

    setResetLoading(true);
    try {
      const verifyRes = await fetch(`${BASE_URL}/api/users/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: resetSessionId, otp: resetOtp }),
      });

      if (!verifyRes.ok) throw new Error(await readErrorMessage(verifyRes, "Invalid OTP"));
      const verifyData = await verifyRes.json();

      const resetRes = await fetch(`${BASE_URL}/api/users/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken: verifyData.resetToken,
          newPassword,
        }),
      });

      if (!resetRes.ok) throw new Error(await readErrorMessage(resetRes, "Failed to reset password"));

      toast.success("Password reset successfully. Please login.");
      closeForgotPassword();
      setPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
    <SEO
  title="Login - ACME Academy"
  description="Access your ACME Academy account to take mock tests, track results, and continue your MCA entrance preparation journey."
  url="https://www.acmeacademy.in/login"
  noindex={true}
/>

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 px-3 py-4 sm:px-4">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="border border-white/10 bg-white/8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl rounded-2xl">
          <CardHeader className="pb-4 text-center sm:pb-5">
            <div className="mb-3 flex justify-center">
              <img src={logo} alt="ACME Academy" className="h-12 sm:h-14" />
            </div>
            <CardTitle className="text-xl font-bold text-white sm:text-2xl">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-gray-300 sm:text-base">Sign in to your dashboard</p>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-5">
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-10 rounded-xl border-white/10 bg-gray-800/80 pl-10 text-sm text-white focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-gray-200">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-10 rounded-xl border-white/10 bg-gray-800/80 pl-10 text-sm text-white focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={openForgotPassword}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
              >
                {loading ? (
                  <svg
                    className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                    viewBox="0 0 24 24"
                  />
                ) : (
                  <>
                    Login <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-gray-300 sm:text-sm">
              New to ACME Academy?{" "}
              <NavLink
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Register
              </NavLink>
            </p>
          </CardContent>
        </Card>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/95 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <p className="text-xs text-gray-400">We’ll send an OTP to your registered phone.</p>
              </div>
              <button
                type="button"
                onClick={closeForgotPassword}
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                aria-label="Close reset password dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {resetStep === "email" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm text-gray-200">
                    Email
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="h-10 rounded-xl border-white/10 bg-gray-800/80 text-sm text-white focus:border-blue-500"
                  />
                </div>
                <Button
                  type="button"
                  onClick={sendResetOtp}
                  disabled={resetLoading}
                  className="h-10 w-full rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {resetLoading ? "Sending OTP..." : "Send Reset OTP"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-100">
                  {resetHint || "Enter the OTP sent to your registered phone number."}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-otp" className="text-sm text-gray-200">
                    OTP
                  </Label>
                  <Input
                    id="reset-otp"
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="h-10 rounded-xl border-white/10 bg-gray-800/80 text-sm text-white focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm text-gray-200">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="h-10 rounded-xl border-white/10 bg-gray-800/80 text-sm text-white focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password" className="text-sm text-gray-200">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="h-10 rounded-xl border-white/10 bg-gray-800/80 text-sm text-white focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setResetStep("email")}
                    variant="outline"
                    className="h-10 flex-1 rounded-xl border-white/10 bg-transparent text-sm text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={verifyAndResetPassword}
                    disabled={resetLoading}
                    className="h-10 flex-1 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {resetLoading ? "Resetting..." : "Verify & Reset"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Login;
