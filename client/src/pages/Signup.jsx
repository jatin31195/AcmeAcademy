import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../config/firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={userDetails.username}
                  onChange={handleChange}
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500"
                />
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={userDetails.fullname}
                  onChange={handleChange}
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userDetails.email}
                  onChange={handleChange}
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={userDetails.password}
                  onChange={handleChange}
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={userDetails.confirmPassword}
                  onChange={handleChange}
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500"
                />
                <input
                  type="date"
                  name="dob"
                  value={userDetails.dob}
                  onChange={handleChange}
                  className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500"
                />

                <PhoneInput
  country={"in"}
  value={userDetails.phone}
  onChange={(value) =>
    setUserDetails((prev) => ({
      ...prev,
      phone: value,
      whatsapp: userDetails.whatsappSameAsPhone ? value : prev.whatsapp,
    }))
  }
  inputStyle={{
    width: "100%",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.5rem 0.5rem 3.5rem", // ← add left padding for country code
    border: "1px solid #374151",
    backgroundColor: "#1F2937",
    color: "#F9FAFB",
  }}
  buttonStyle={{
    border: "none",
    left: "0.2rem",
  }}
/>


                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="whatsappSameAsPhone"
                    checked={userDetails.whatsappSameAsPhone}
                    onChange={handleChange}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <label className="text-white">WhatsApp same as phone?</label>
                </div>

                {!userDetails.whatsappSameAsPhone && (
                  <PhoneInput
                    country={"in"}
                    value={userDetails.whatsapp}
                    onChange={(value) =>
                      setUserDetails((prev) => ({ ...prev, whatsapp: value }))
                    }
                    inputStyle={{
                      width: "100%",
                      borderRadius: "0.375rem",
                      padding: "0.5rem",
                      border: "1px solid #374151",
                      backgroundColor: "#1F2937",
                      color: "#F9FAFB",
                    }}
                    buttonStyle={{ border: "none" }}
                  />
                )}

                <button
                  onClick={onSignup}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded flex justify-center items-center gap-2 transition"
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
                  className="opt-container"
                />
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded flex justify-center items-center gap-2 transition"
                >
                  {loading && <CgSpinner className="animate-spin" />}
                  <span>Verify OTP & Create Account</span>
                </button>
              </div>
            </>
          )}
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Signup;
