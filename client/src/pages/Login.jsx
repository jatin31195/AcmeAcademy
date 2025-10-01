import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const { email, password } = credentials;
    if (!email || !password) {
      toast.error("Please fill both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", 
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      toast.success("Login successful!");
      navigate("/home"); 
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-emerald-500 flex items-center justify-center min-h-screen p-4">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-emerald-500 mb-4 text-center">
          Login
        </h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-700"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-700"
        />
        <button
          onClick={handleLogin}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded flex justify-center items-center gap-2 transition"
        >
          {loading && <CgSpinner className="animate-spin" />}
          <span>Login</span>
        </button>
      </div>
    </section>
  );
};

export default Login;
