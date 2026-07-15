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
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* Top bar */}
      <header className="w-full px-4 sm:px-6 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => setView('login')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-lg shadow-gray-200/60">
            <CardHeader className="text-center space-y-2 pb-2">
              <div className="flex justify-center mb-1">
                <div className="bg-emerald-600 p-2 rounded-xl">
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
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
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
                          className="pl-9"
                          autoComplete="email"
                          autoFocus
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
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
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-3">
                      <MailCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-emerald-800">
                        <p className="font-medium mb-1">What happens next?</p>
                        <ol className="list-decimal list-inside space-y-1 text-emerald-700">
                          <li>Check your inbox (and spam folder)</li>
                          <li>Click the reset link in the email</li>
                          <li>Create a new password</li>
                          <li>Sign in with your new credentials</li>
                        </ol>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
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
                  className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  Back to Sign In
                </button>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}