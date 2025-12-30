import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate('/admin');
      } else {
        toast({
          title: 'Authentication Failed',
          description: 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-info/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border p-8 shadow-card bg-[hsl(var(--card))]">
          
          {/* LOGO */}
          <div className="mb-8 text-center">
            <img
              src="/logo.png"   // 🔴 change path if needed
              alt="ACME Academy Logo"
              className="mx-auto mb-4 h-16 w-auto"
            />
            <h1 className="text-2xl font-bold">ACME Academy</h1>
            <p className="mt-1 text-muted-foreground">Admin Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@acmeacademy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-primary text-primary-foreground font-semibold h-11 hover:opacity-90"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Secure admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
