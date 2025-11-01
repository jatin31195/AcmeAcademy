import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from ".././AuthContext";
import logo from "/logo.png";
import { BASE_URL } from "../config";
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill both email and password");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      toast.success("Welcome back!");
      login({ _id: data.userId, username: data.username, email }); // set context
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="w-full max-w-md">
        <Card className="bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="ACME Academy" className="h-16" />
            </div>
            <CardTitle className="text-2xl text-white font-bold">Welcome Back</CardTitle>
            <p className="text-gray-300">Sign in to your dashboard</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-gray-800 text-white focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-gray-800 text-white focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    Login <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-300">
              New to ACME Academy?{" "}
              <NavLink to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Register
              </NavLink>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
