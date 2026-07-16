'use client';

import { useState } from 'react';
import { useNavStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Truck, Mail, ArrowLeft, KeyRound, CheckCircle2, MailCheck,
  Shield, Zap, Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ForgotPasswordPage() {
  const { setView } = useNavStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Reset link sent!');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel — Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative bg-[#2E7D32] text-white flex-col justify-between p-8 lg:p-12 overflow-hidden">
        {/* Subtle pattern overlay */}
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
              Password recovery<br />
              <span className="text-[#C8E6C9]">made simple</span>
            </h1>
            <p className="text-white/70 text-lg max-w-md leading-relaxed">
              Enter your email and we&apos;ll send you a secure link to reset your password. Usually arrives within minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-4"
          >
            {[
              { icon: Zap, text: 'Instant password reset via email' },
              { icon: Shield, text: 'Secure, time-limited reset links' },
              { icon: Globe, text: 'Access your account from anywhere' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="bg-white/10 rounded-lg p-1.5">
                  <Icon className="h-4 w-4 text-[#C8E6C9]" />
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

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#FAFAFA]">
        {/* Mobile back link */}
        <button
          onClick={() => setView('login')}
          className="md:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:-translate-x-0.5 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="relative bg-white border border-[#E0E0E0] shadow-sm">
            {/* Green line at top */}
            <div className="h-1 rounded-t-xl bg-[#2E7D32]" />

            <CardHeader className="text-center space-y-2 pb-2">
              <div className="flex justify-center mb-1">
                <div className="bg-[#2E7D32] p-2 rounded-xl">
                  <Truck className="h-6 w-6 text-white" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
                    <CardDescription>
                      Enter your email and we&apos;ll send you a reset link
                    </CardDescription>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-center">
                      <div className="bg-[#E8F5E9] p-4 rounded-full">
                        <CheckCircle2 className="h-10 w-10 text-[#2E7D32]" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                    <CardDescription className="text-sm">
                      We&apos;ve sent a password reset link to{' '}
                      <span className="font-medium text-foreground">{email}</span>
                    </CardDescription>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                          autoComplete="email"
                          autoFocus
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <KeyRound className="h-4 w-4" />
                          Send Reset Link
                        </span>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-content"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="space-y-4"
                  >
                    {/* Info box */}
                    <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-lg p-4 flex gap-3">
                      <MailCheck className="h-5 w-5 text-[#2E7D32] mt-0.5 shrink-0" />
                      <div className="text-sm text-[#1B5E20]">
                        <p className="font-medium mb-1">What happens next?</p>
                        <ol className="list-decimal list-inside space-y-1 text-[#2E7D32]">
                          <li>Check your inbox (and spam folder)</li>
                          <li>Click the reset link in the email</li>
                          <li>Create a new password</li>
                          <li>Sign in with your new credentials</li>
                        </ol>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-[#E0E0E0]"
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail('');
                      }}
                    >
                      Send to a different email
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <button
                  onClick={() => setView('login')}
                  className="text-[#2E7D32] hover:text-[#1B5E20] font-medium transition-colors"
                >
                  Back to Sign In
                </button>
              </p>
            </CardFooter>
            {/* Platform Disclaimer */}
            <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-lg p-3 mb-2">
              <p className="text-[11px] text-[#1B5E20] leading-relaxed">
                SwiftFreight is a technology platform. All logistics services are provided by independent third-party companies registered on the platform.
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