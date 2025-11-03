import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { ArrowRight, User, Mail, Lock, Calendar } from "lucide-react";
import { CgSpinner } from "react-icons/cg";
import { BsTelephoneFill } from "react-icons/bs";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpInput from "otp-input-react";
import { auth } from "../config/firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import logo from "/logo.png";
import { BASE_URL } from "../config";

const Signup = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    phone: "",
    whatsapp: "",
    whatsappSameAsPhone: false,
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  function onCaptchVerify() {
    if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("Recaptcha verified!"),
      "expired-callback": () => console.log("Recaptcha expired, try again."),
    });
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      whatsapp:
        name === "whatsappSameAsPhone" && checked ? prev.phone : prev.whatsapp,
    }));
  };

  const onSignup = async () => {
    const { username, fullname, email, password, confirmPassword, phone } = userDetails;
    if (!username || !fullname || !email || !password || !confirmPassword || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      onCaptchVerify();
      const appVerifier = window.recaptchaVerifier;
      const formatPh = "+" + phone;

      const confirmationResult = await signInWithPhoneNumber(auth, formatPh, appVerifier);
      window.confirmationResult = confirmationResult;
      setShowOTP(true);
      toast.success("OTP sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const onOTPVerify = async () => {
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const res = await fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userDetails.username,
          fullname: userDetails.fullname,
          email: userDetails.email,
          password: userDetails.password,
          dob: userDetails.dob,
          phone: "+" + userDetails.phone,
          whatsapp: userDetails.whatsappSameAsPhone
            ? "+" + userDetails.phone
            : "+" + userDetails.whatsapp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create account");

      setAccountCreated(true);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Invalid OTP or server error");
    } finally {
      setLoading(false);
    }
  };

  if (accountCreated) {
    return (
      <div className="flex items-center justify-center h-screen bg-emerald-500 text-white text-2xl">
        🎉 Account created successfully!
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="ACME Academy" className="h-16 w-auto" />
          </div>

          {!showOTP ? (
            <>
              <h2 className="text-2xl text-white font-bold mb-6 text-center">
                Create Your Account
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={userDetails.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={userDetails.fullname}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={userDetails.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userDetails.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={userDetails.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    name="dob"
                    value={userDetails.dob}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <BsTelephoneFill className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <PhoneInput
                    country={"in"}
                    value={userDetails.phone}
                    onChange={(value) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        phone: value,
                        whatsapp: userDetails.whatsappSameAsPhone
                          ? value
                          : prev.whatsapp,
                      }))
                    }
                    inputStyle={{
                      width: "100%",
                      borderRadius: "0.375rem",
                      padding: "0.5rem 0.5rem 0.5rem 3.5rem",
                      border: "1px solid #374151",
                      backgroundColor: "#1F2937",
                      color: "#F9FAFB",
                    }}
                    buttonStyle={{ border: "none", left: "0.2rem" }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="whatsappSameAsPhone"
                    checked={userDetails.whatsappSameAsPhone}
                    onChange={handleChange}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <label className="text-gray-300">WhatsApp same as phone?</label>
                </div>

                {!userDetails.whatsappSameAsPhone && (
                  <div className="relative">
                    <BsTelephoneFill className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <PhoneInput
                      country={"in"}
                      value={userDetails.whatsapp}
                      onChange={(value) =>
                        setUserDetails((prev) => ({ ...prev, whatsapp: value }))
                      }
                      inputStyle={{
                        width: "100%",
                        borderRadius: "0.375rem",
                        padding: "0.5rem 0.5rem 0.5rem 3.5rem",
                        border: "1px solid #374151",
                        backgroundColor: "#1F2937",
                        color: "#F9FAFB",
                      }}
                      buttonStyle={{ border: "none", left: "0.2rem" }}
                    />
                  </div>
                )}

                <button
                  onClick={onSignup}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex justify-center items-center gap-2 transition"
                >
                  {loading ? (
                    <CgSpinner className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Send OTP <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-300 mt-3">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Verify Your OTP
              </h2>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                autoFocus
                className="opt-container"
              />
              <button
                onClick={onOTPVerify}
                disabled={loading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex justify-center items-center gap-2 transition"
              >
                {loading ? (
                  <CgSpinner className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Verify & Create Account <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Signup;
