import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "/logo.png";
import { BASE_URL } from "../config";

const readErrorMessage = async (response, fallbackMessage) => {
  try {
    const data = await response.json();
    return data?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

const Signup = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    targetYear: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    const { name, email, password, confirmPassword, phone, targetYear } = userDetails;


    // Email validation (enterprise-level)
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!name || !email || !password || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password must match");
      return;
    }
    if (!targetYear) {
      toast.error("Please select your target year");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "signup" }),
      });

      if (!res.ok) throw new Error(await readErrorMessage(res, "Failed to send OTP"));
      const data = await res.json();
      setOtpSessionId(data.sessionId);
      setShowOTP(true);
      toast.success("OTP sent to your phone!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpSessionId) return toast.error("OTP session not found. Please resend OTP.");
    if (!otp) return toast.error("Enter the OTP");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: otpSessionId, otp, phone: userDetails.phone }),
      });

      if (!res.ok) throw new Error(await readErrorMessage(res, "Invalid OTP"));
      const data = await res.json();

      setOtpToken(data.verificationToken);
      toast.success("OTP Verified!");

      await onRegister(data.verificationToken);
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (verifiedToken = otpToken) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: userDetails.name,
          email: userDetails.email,
          password: userDetails.password,
          phone: userDetails.phone,
          targetYear: userDetails.targetYear,
          otpToken: verifiedToken,
        }),
      });

      if (!res.ok) throw new Error(await readErrorMessage(res, "Failed to create account"));
      await res.json();

      toast.success("Account created successfully!");
      setAccountCreated(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  if (accountCreated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-4 text-center text-white">
        <div className="flex max-w-sm flex-col items-center space-y-4 rounded-2xl border border-white/10 bg-white/10 px-5 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <img
            src={logo}
            alt="ACME Academy Logo"
            className="h-14 w-14 rounded-2xl shadow-lg animate-bounce"
          />
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            Account Created Successfully!
          </h1>
          <p className="text-sm leading-relaxed text-blue-100 sm:text-base">
            Welcome to <span className="font-semibold text-white">ACME Academy</span> — your journey to MCA excellence begins here. Redirecting to login...
          </p>
          <div className="mt-2 h-1 w-14 animate-pulse rounded-full bg-white/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900 px-3 py-4 sm:px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_35%)]" />
      <div className="pointer-events-none absolute -left-16 top-24 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl sm:h-72 sm:w-72" />
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="relative w-full max-w-sm sm:max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_28px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-5">
          <div className="mb-3 flex justify-center">
            <img src={logo} alt="ACME Academy" className="h-12 w-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:h-14" />
          </div>

          {!showOTP ? (
            <>
              <h2 className="mb-3 text-center text-xl font-bold leading-tight text-white sm:text-2xl">
                Register Account
              </h2>
              <p className="mb-4 text-center text-[12px] leading-snug text-gray-300 sm:text-sm">
              
                <span className="font-bold text-white">Remember:</span> <span className="text-yellow-200">This email and password will be used for future login.</span>
              </p>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={userDetails.name}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-gray-800/80 px-3 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userDetails.email}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-gray-800/80 px-3 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={userDetails.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-gray-800/80 px-3 py-2.5 pr-11 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={userDetails.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-gray-800/80 px-3 py-2.5 pr-11 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <select
                  name="targetYear"
                  value={userDetails.targetYear}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-gray-800/80 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Select Target Year</option>
                  {Array.from({ length: 11 }, (_, index) => currentYear + index).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={userDetails.phone}
                  onChange={handleChange}
                  className="rounded-xl border border-white/10 bg-gray-800/80 px-3 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  {loading && <CgSpinner className="animate-spin" />}
                  <span>Send OTP</span>
                </button>

                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")} className="cursor-pointer text-emerald-500 hover:underline">
                      Login
                    </span>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-inner shadow-black/10">
                <div className="mb-4 text-center">
                  <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-300">
                    Step 2 of 2
                  </span>
                  <h2 className="mt-3 text-xl font-bold leading-tight text-white sm:text-2xl">
                    Enter OTP
                  </h2>
                  <p className="mt-2 text-[12px] leading-snug text-gray-300 sm:text-sm">
                    We sent a 6-digit code to your phone. Enter it below to finish creating your account.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    OTPLength={6}
                    otpType="number"
                    autoFocus
                    className="flex justify-center gap-2 sm:gap-3"
                    inputClassName="h-11 w-11 rounded-xl border border-white/10 bg-gray-800/90 text-center text-base text-white outline-none shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-all duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 sm:h-12 sm:w-12 sm:text-lg"
                  />

                  <button
                    onClick={verifyOtp}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading && <CgSpinner className="animate-spin" />}
                    <span>Verify & Create Account</span>
                  </button>

                  <button
                    onClick={sendOtp}
                    className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200 hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
