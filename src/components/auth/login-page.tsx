'use client';

import { useState } from 'react';
import { useNavStore, useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { demoUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import {
  Truck, Mail, Lock, ArrowLeft, Eye, EyeOff,
  Shield, Zap, Globe, Building2,
} from 'lucide-react';
import { motion } from 'framer-motion';

const demoAccounts = [
  { label: 'Company Owner', user: demoUsers[1] as User, color: 'text-[#fd7714] border-l-[3px] border-l-[#fd7714] hover:bg-[#fff3e8]' },
  { label: 'Operations Manager', user: demoUsers[2] as User, color: 'text-[#e06a10] border-l-[3px] border-l-[#e06a10] hover:bg-[#fff3e8]' },
  { label: 'Dispatcher', user: demoUsers[3] as User, color: 'text-[#fc8a44] border-l-[3px] border-l-[#fc8a44] hover:bg-[#fff3e8]' },
  { label: 'Driver', user: demoUsers[5] as User, color: 'text-[#fd7714] border-l-[3px] border-l-[#fd7714] hover:bg-[#fff3e8]' },
  { label: 'Customer', user: demoUsers[6] as User, color: 'text-[#fc8a44] border-l-[3px] border-l-[#fc8a44] hover:bg-[#fff3e8]' },
];

export function LoginPage() {
  const { setView } = useNavStore();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = (user: User) => {
    login(user);
    toast.success(`Welcome back, ${user.name}!`);
    setView('dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      const matchUser = demoUsers.find((u) => u.email === email.trim());
      if (matchUser) {
        login(matchUser);
        toast.success(`Welcome back, ${matchUser.name}!`);
        setView('dashboard');
      } else {
        toast.error('Invalid credentials. Try a demo account below.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel — Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative bg-[#151c25] text-white flex-col justify-between p-8 lg:p-12 overflow-hidden">
        {/* Subtle pattern overlay (CSS only) */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `linear-gradient(30deg, white 12%, transparent 12.5%, transparent 87%, white 87.5%, white), linear-gradient(150deg, white 12%, transparent 12.5%, transparent 87%, white 87.5%, white), linear-gradient(30deg, white 12%, transparent 12.5%, transparent 87%, white 87.5%, white), linear-gradient(150deg, white 12%, transparent 12.5%, transparent 87%, white 87.5%, white)`,
          backgroundSize: '40px 70px',
          backgroundPosition: '0 0, 0 0, 20px 35px, 20px 35px',
        }} />
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -left-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full bg-white/5" />
        </div>

        {/* Back to home */}
        <div className="relative z-10">
          <button
            onClick={() => setView('marketing')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
        </div>

        {/* Brand content */}
        <div className="relative z-10 space-y-8 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-xl">
                <Truck className="h-8 w-8" />
              </div>
              <span className="text-2xl font-bold tracking-tight">SwiftFreight</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Logistics management<br />
              <span className="text-[#ffe0c2]">made simple</span>
            </h1>
            <p className="text-white/70 text-lg max-w-md leading-relaxed">
              Streamline your delivery operations across all ten districts of Lesotho with real-time tracking and smart dispatch.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-4"
          >
            {[
              { icon: Zap, text: 'Real-time package tracking & notifications' },
              { icon: Globe, text: 'Nationwide coverage across all of Lesotho' },
              { icon: Building2, text: 'Multi-tenant SaaS for companies of all sizes' },
              { icon: Shield, text: 'Secure, reliable, and fully compliant' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="bg-white/10 rounded-lg p-1.5">
                  <Icon className="h-4 w-4 text-[#ffe0c2]" />
                </div>
                <span className="text-white/85 text-sm">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 text-white/40 text-xs"
        >
          © {new Date().getFullYear()} SwiftFreight Technologies. All rights reserved.
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#FAFAFA]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile back link */}
          <button
            onClick={() => setView('marketing')}
            className="md:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>

          <Card className="relative bg-white border border-[#E0E0E0] shadow-sm">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center gap-2 md:hidden mb-2">
                <div className="bg-[#fd7714] p-1.5 rounded-lg">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-[#fd7714]">SwiftFreight</span>
              </div>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 border-[#E0E0E0] focus-visible:ring-[#fd7714]/30 focus-visible:border-[#fd7714]/50"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 border-[#E0E0E0] focus-visible:ring-[#fd7714]/30 focus-visible:border-[#fd7714]/50"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot Password */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      className="data-[state=checked]:bg-[#fd7714] data-[state=checked]:border-[#fd7714]"
                    />
                    <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-sm text-[#fd7714] hover:text-[#e06a10] font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-[#fd7714] hover:bg-[#e06a10] text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo accounts */}
              <div className="pt-2">
                <Separator className="my-4" />
                <div className="text-center mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Demo Mode — Quick Login
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((demo) => (
                    <Button
                      key={demo.label}
                      variant="outline"
                      size="sm"
                      className={`text-xs font-medium ${demo.color} border-[#E0E0E0] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]`}
                      onClick={() => handleDemoLogin(demo.user)}
                    >
                      {demo.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setView('register')}
                  className="text-[#fd7714] hover:text-[#e06a10] font-medium transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </CardFooter>
            {/* Platform Disclaimer */}
            <div className="bg-[#fff3e8] border border-[#ffe0c2] rounded-lg p-3 mb-2">
              <p className="text-[11px] text-[#e06a10] leading-relaxed">
                SwiftFreight is a technology platform connecting logistics companies, drivers, and customers in Lesotho. We do NOT operate as a courier or freight carrier. All logistics services are provided by independent third-party companies.
              </p>
            </div>
            {/* Powered by footer */}
            <p className="text-center text-[11px] text-muted-foreground/50 pb-4">
              Powered by <span className="font-medium text-muted-foreground/70">SwiftFreight Technologies</span>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}