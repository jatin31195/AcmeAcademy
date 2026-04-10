import React, { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Phone, ArrowRight } from "lucide-react";
import OtpInput from "otp-input-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../AuthContext";
import logo from "/logo.png";
import { BASE_URL } from "../config";
import SEO from "../components/SEO";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname + location.state?.from?.search || "/home";

  const { login, fetchUser } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return toast.error("Please enter phone number");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "login" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setOtpSessionId(data.sessionId);
      setShowOtpInput(true);
      toast.success("OTP sent successfully");
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async (e) => {
    e.preventDefault();
    if (!otpSessionId) return toast.error("OTP session missing. Request OTP again.");
    if (!otp) return toast.error("Please enter OTP");

    setLoading(true);
    try {
      const verifyRes = await fetch(`${BASE_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: otpSessionId, otp, phone }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.message || "OTP verification failed");

      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          otpToken: verifyData.verificationToken,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      toast.success("Welcome back!");

      
      await Promise.all([
        login(data.user || { phone }),
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

  return (
    <>
    <SEO
  title="Login - ACME Academy"
  description="Access your ACME Academy account to take mock tests, track results, and continue your MCA entrance preparation journey."
  url="https://www.acmeacademy.in/login"
  noindex={true}
/>

    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="w-full max-w-md">
        <Card className="bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="ACME Academy" className="h-16" />
            </div>
            <CardTitle className="text-2xl text-white font-bold">
              Welcome Back
            </CardTitle>
            <p className="text-gray-300">Sign in to your dashboard</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form
              onSubmit={showOtpInput ? handleVerifyAndLogin : handleSendOtp}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-200">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your 10-digit phone"
                    className="pl-10 bg-gray-800 text-white focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {showOtpInput && (
                <div className="space-y-2">
                  <Label className="text-gray-200">OTP</Label>
                  <div className="flex justify-center">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      OTPLength={6}
                      otpType="number"
                      autoFocus
                      className="flex justify-center gap-2"
                      inputClassName="w-10 h-10 rounded-md text-white border-2 border-blue-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none text-center text-base"
                    />
                  </div>
                </div>
              )}

              <Button
                type="button"
                onClick={showOtpInput ? handleVerifyAndLogin : handleSendOtp}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    viewBox="0 0 24 24"
                  />
                ) : (
                  <>
                    {showOtpInput ? "Verify OTP & Login" : "Send OTP"} <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>

              {showOtpInput && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-200 hover:bg-gray-800"
                >
                  Resend OTP
                </Button>
              )}
            </form>

            <p className="text-center text-sm text-gray-300">
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
    </div>
    </>
  );
};

export default Login;
