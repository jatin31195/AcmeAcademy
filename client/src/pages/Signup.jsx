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

    if (!name || !email || !password || !phone) {
      toast.error("Please fill all required fields");
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

  // ✅ Verify OTP & Auto Register
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
      const data = await res.json();

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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white text-center px-6">
      <div className="flex flex-col items-center space-y-6">
        <img
          src={logo}
          alt="ACME Academy Logo"
          className="w-20 h-20 rounded-lg shadow-lg animate-bounce"
        />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
          🎉 Account Created Successfully!
        </h1>
        <p className="text-lg text-blue-100 max-w-md leading-relaxed">
          Welcome to <span className="font-semibold text-white">ACME Academy</span> — 
          your journey to MCA excellence begins here. Redirecting to login...
        </p>
        <div className="mt-6 w-16 h-1 bg-white/70 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="relative w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="ACME Academy" className="h-16 w-auto" />
          </div>

          
          {!showOTP ? (
            <>
              <h2 className="text-2xl text-white font-bold mb-6 text-center">
                Register Account
              </h2>
              <p className="mb-5 text-sm text-white font-semibold text-center leading-relaxed">
                Fill in your basic details now. You can complete the rest of your profile later from Edit Profile and Verification.
                <br />
                <span className="text-white font-bold">Remember:</span> this email and password will be used for future login.
              </p>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={userDetails.name}
                  onChange={handleChange}
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userDetails.email}
                  onChange={handleChange}
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={userDetails.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-11 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={userDetails.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-11 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <select
                  name="targetYear"
                  value={userDetails.targetYear}
                  onChange={handleChange}
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex justify-center items-center gap-2 transition"
                >
                  {loading && <CgSpinner className="animate-spin" />}
                  <span>Send OTP</span>
                </button>

                <div className="mt-4 text-center">
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <span
                      onClick={() => navigate("/login")}
                      className="text-emerald-500 hover:underline cursor-pointer"
                    >
                      Login
                    </span>
                  </p>
                </div>
              </div>
            </>
          ) : (
            
            <>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Enter OTP
              </h2>
              <div className="flex flex-col gap-3 items-center">
               <OtpInput
  value={otp}
  onChange={setOtp}
  OTPLength={6}
  otpType="number"
  autoFocus
  className="flex justify-center gap-3"
  inputClassName="w-12 h-12 rounded-lg  text-white border-2 border-blue-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none text-center text-lg transition-all duration-200"
/>


                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded flex justify-center items-center gap-2 transition w-full"
                >
                  {loading && <CgSpinner className="animate-spin" />}
                  <span>Verify & Create Account</span>
                </button>

                <button
                  onClick={sendOtp}
                  className="text-emerald-400 mt-3 hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
