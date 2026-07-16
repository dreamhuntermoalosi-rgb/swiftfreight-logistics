'use client';

import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuthStore, useKycStore, type KycLevel, type KycBadge } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  CreditCard,
  Camera,
  FileText,
  Check,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Upload,
  Loader2,
  BadgeCheck,
  Award,
  X,
  Info,
  Sparkles,
} from 'lucide-react';

// ── Color Constants ──────────────────────────────────────────
const COLORS = {
  primary: '#2E7D32',
  dark: '#1B5E20',
  secondary: '#4CAF50',
  lightCard: '#E8F5E9',
  text: '#212121',
  secondaryText: '#757575',
  border: '#E0E0E0',
};

// ── Badge Config ─────────────────────────────────────────────
const badgeConfig: Record<KycBadge, { label: string; color: string; bg: string; border: string; icon: typeof Award }> = {
  none: { label: 'Not Verified', color: COLORS.secondaryText, bg: '#F5F5F5', border: COLORS.border, icon: Circle },
  bronze: { label: 'Basic', color: '#A0522D', bg: '#FFF8F0', border: '#DEB887', icon: Award },
  silver: { label: 'Standard', color: '#616161', bg: '#FAFAFA', border: '#BDBDBD', icon: Award },
  gold: { label: 'Fully Verified', color: '#F57F17', bg: '#FFFDE7', border: '#FFD54F', icon: BadgeCheck },
};

const levelSteps: { level: KycLevel; label: string; desc: string }[] = [
  { level: 'basic', label: 'Basic', desc: 'Phone & Email' },
  { level: 'standard', label: 'Standard', desc: '+ National ID' },
  { level: 'full', label: 'Full', desc: '+ Selfie & Address' },
];

// ── Step Definitions ─────────────────────────────────────────
interface StepDef {
  id: number;
  title: string;
  description: string;
  icon: typeof Phone;
  field: 'phoneVerified' | 'emailVerified' | 'nationalIdVerified' | 'selfieVerified' | 'proofOfAddressVerified';
}

const STEPS: StepDef[] = [
  { id: 1, title: 'Phone Verification', description: 'Verify your mobile number', icon: Phone, field: 'phoneVerified' },
  { id: 2, title: 'Email Verification', description: 'Confirm your email address', icon: Mail, field: 'emailVerified' },
  { id: 3, title: 'National ID / Passport', description: 'Upload your ID document', icon: CreditCard, field: 'nationalIdVerified' },
  { id: 4, title: 'Selfie Verification', description: 'Take a selfie for matching', icon: Camera, field: 'selfieVerified' },
  { id: 5, title: 'Proof of Address', description: 'Upload a utility bill', icon: FileText, field: 'proofOfAddressVerified' },
];

// ── Animation Variants ───────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

// ── KyC Verification Badge (for sidebar) ─────────────────────
export function KycVerifiedBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const { badge, verificationLevel } = useKycStore();

  if (badge === 'none') return null;

  const config = badgeConfig[badge];
  const isGold = badge === 'gold';

  const sizeClasses = size === 'sm'
    ? 'h-5 w-5 text-[10px]'
    : 'h-6 w-6 text-xs';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${sizeClasses} font-bold`}
      style={{
        backgroundColor: isGold ? '#FFD54F' : badge === 'silver' ? '#E0E0E0' : '#DEB887',
        color: isGold ? '#E65100' : badge === 'silver' ? '#424242' : '#5D4037',
        boxShadow: isGold ? '0 0 6px rgba(255,213,79,0.6)' : 'none',
      }}
      title={`${config.label} verification`}
    >
      <Check className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
    </span>
  );
}

// ── Step Content Components ──────────────────────────────────
function PhoneStep({ onVerified }: { onVerified: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);

  const handleSendOtp = useCallback(() => {
    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error('Invalid phone number', { description: 'Please enter a valid mobile number' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      toast.success('OTP Sent', { description: `Verification code sent to ${phoneNumber}` });
      setTimeout(() => otpRef.current?.focus(), 100);
    }, 1200);
  }, [phoneNumber]);

  const handleVerifyOtp = useCallback(() => {
    if (otp.length !== 6) {
      toast.error('Invalid OTP', { description: 'Please enter the 6-digit code' });
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onVerified();
      toast.success('Phone Verified!', { description: 'Your phone number has been verified successfully' });
    }, 1500);
  }, [otp, onVerified]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.lightCard }}>
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COLORS.primary }} />
          <p className="text-xs" style={{ color: COLORS.secondaryText }}>
            We&apos;ll send a 6-digit verification code to your mobile number. Enter any 6-digit code to simulate verification.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kyc-phone">Mobile Number</Label>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-md border px-3 text-sm" style={{ borderColor: COLORS.border, color: COLORS.secondaryText }}>
            <Phone className="h-4 w-4" />
            <span>+266</span>
          </div>
          <Input
            id="kyc-phone"
            placeholder="e.g. 5 123 4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={otpSent}
            className="flex-1"
          />
        </div>
      </div>

      {!otpSent ? (
        <Button
          onClick={handleSendOtp}
          disabled={loading || !phoneNumber}
          className="w-full gap-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
          Send Verification Code
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="kyc-otp">Enter 6-Digit Code</Label>
            <Input
              ref={otpRef}
              id="kyc-otp"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-[0.3em] font-mono"
              maxLength={6}
            />
            <p className="text-xs text-center" style={{ color: COLORS.secondaryText }}>
              Enter any 6 digits to simulate verification
            </p>
          </div>
          <Button
            onClick={handleVerifyOtp}
            disabled={verifying || otp.length !== 6}
            className="w-full gap-2"
            style={{ backgroundColor: COLORS.primary }}
          >
            {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Verify Phone Number
          </Button>
        </div>
      )}
    </div>
  );
}

function EmailStep({ onVerified }: { onVerified: () => void }) {
  const { currentUser } = useAuthStore();
  const [sent, setSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = currentUser?.email || 'user@example.com';

  const handleSend = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      toast.success('Verification Email Sent', { description: `Check your inbox at ${email}` });
    }, 1000);
  }, [email]);

  const handleConfirm = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setConfirmed(true);
      setLoading(false);
      onVerified();
      toast.success('Email Verified!', { description: 'Your email address has been verified' });
    }, 1200);
  }, [onVerified]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.lightCard }}>
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COLORS.primary }} />
          <p className="text-xs" style={{ color: COLORS.secondaryText }}>
            We&apos;ll send a verification link to your registered email. Click the confirm button to simulate verification.
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-4" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.lightCard }}>
            <Mail className="h-5 w-5" style={{ color: COLORS.primary }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs" style={{ color: COLORS.secondaryText }}>Registered Email</p>
            <p className="text-sm font-medium truncate" style={{ color: COLORS.text }}>{email}</p>
          </div>
          {sent && !confirmed && (
            <Badge variant="outline" className="shrink-0 text-xs" style={{ color: COLORS.primary, borderColor: COLORS.primary }}>
              Link Sent
            </Badge>
          )}
        </div>
      </div>

      {!sent ? (
        <Button
          onClick={handleSend}
          disabled={loading}
          className="w-full gap-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Send Verification Link
        </Button>
      ) : !confirmed ? (
        <Button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full gap-2"
          style={{ backgroundColor: COLORS.primary }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          I&apos;ve Verified My Email
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-2 rounded-lg p-4" style={{ backgroundColor: COLORS.lightCard }}>
          <CheckCircle2 className="h-5 w-5" style={{ color: COLORS.primary }} />
          <span className="text-sm font-medium" style={{ color: COLORS.primary }}>Email successfully verified!</span>
        </div>
      )}
    </div>
  );
}

function NationalIdStep({ onVerified }: { onVerified: () => void }) {
  const [idNumber, setIdNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!idNumber.trim()) {
      toast.error('ID Required', { description: 'Please enter your National ID or Passport number' });
      return;
    }
    if (!file) {
      toast.error('Document Required', { description: 'Please upload a photo of your ID document' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerified();
      toast.success('National ID Verified!', { description: 'Your identity document has been verified' });
    }, 1800);
  }, [idNumber, file, onVerified]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.lightCard }}>
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COLORS.primary }} />
          <p className="text-xs" style={{ color: COLORS.secondaryText }}>
            Enter your National ID or Passport number and upload a clear photo of the document. Accepted formats: JPG, PNG, PDF.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kyc-id-number">National ID / Passport Number</Label>
        <Input
          id="kyc-id-number"
          placeholder="e.g. 123456789"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Upload ID Document</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-solid"
          style={{
            borderColor: file ? COLORS.primary : COLORS.border,
            backgroundColor: file ? COLORS.lightCard : 'transparent',
          }}
        >
          {file ? (
            <>
              <CheckCircle2 className="h-5 w-5" style={{ color: COLORS.primary }} />
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: COLORS.text }}>{fileName}</p>
                <p className="text-xs" style={{ color: COLORS.secondaryText }}>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" style={{ color: COLORS.secondaryText }} />
              <div className="text-left">
                <p className="text-sm" style={{ color: COLORS.secondaryText }}>Click to upload</p>
                <p className="text-xs" style={{ color: COLORS.border }}>JPG, PNG or PDF</p>
              </div>
            </>
          )}
        </button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !idNumber.trim() || !file}
        className="w-full gap-2"
        style={{ backgroundColor: COLORS.primary }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        Submit & Verify
      </Button>
    </div>
  );
}

function SelfieStep({ onVerified }: { onVerified: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!file) {
      toast.error('Selfie Required', { description: 'Please upload a selfie photo for identity matching' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerified();
      toast.success('Selfie Verified!', { description: 'Your selfie has been verified and matched' });
    }, 1500);
  }, [file, onVerified]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.lightCard }}>
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COLORS.primary }} />
          <p className="text-xs" style={{ color: COLORS.secondaryText }}>
            Upload a clear selfie photo. Make sure your face is visible and well-lit. This will be matched against your ID document.
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed sm:h-48 sm:w-48"
            style={{
              borderColor: file ? COLORS.primary : COLORS.border,
              backgroundColor: file ? COLORS.lightCard : '#FAFAFA',
            }}
          >
            {file ? (
              <CheckCircle2 className="h-12 w-12" style={{ color: COLORS.primary }} />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8" style={{ color: COLORS.border }} />
                <span className="text-xs" style={{ color: COLORS.secondaryText }}>Upload Selfie</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full gap-2"
        style={{ borderColor: file ? COLORS.primary : COLORS.border, color: file ? COLORS.primary : COLORS.text }}
      >
        <Upload className="h-4 w-4" />
        {file ? 'Change Photo' : 'Upload Selfie Photo'}
      </Button>

      {file && (
        <p className="text-center text-xs" style={{ color: COLORS.secondaryText }}>
          {fileName}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="w-full gap-2"
        style={{ backgroundColor: COLORS.primary }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        Submit & Verify Selfie
      </Button>
    </div>
  );
}

function ProofOfAddressStep({ onVerified }: { onVerified: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!file) {
      toast.error('Document Required', { description: 'Please upload a utility bill or bank statement' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerified();
      toast.success('Proof of Address Verified!', { description: 'Your address document has been verified' });
    }, 1500);
  }, [file, onVerified]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.lightCard }}>
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: COLORS.primary }} />
          <p className="text-xs" style={{ color: COLORS.secondaryText }}>
            Upload a recent utility bill (water, electricity, phone) or bank statement dated within the last 3 months. The document must show your name and address.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: '💧', label: 'Water Bill' },
          { icon: '⚡', label: 'Electricity' },
          { icon: '🏦', label: 'Bank Statement' },
        ].map((doc) => (
          <div
            key={doc.label}
            className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center"
            style={{ borderColor: COLORS.border }}
          >
            <span className="text-xl">{doc.icon}</span>
            <span className="text-[10px] font-medium" style={{ color: COLORS.secondaryText }}>{doc.label}</span>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-solid"
        style={{
          borderColor: file ? COLORS.primary : COLORS.border,
          backgroundColor: file ? COLORS.lightCard : 'transparent',
        }}
      >
        {file ? (
          <>
            <CheckCircle2 className="h-5 w-5" style={{ color: COLORS.primary }} />
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: COLORS.text }}>{fileName}</p>
              <p className="text-xs" style={{ color: COLORS.secondaryText }}>{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" style={{ color: COLORS.secondaryText }} />
            <div className="text-left">
              <p className="text-sm" style={{ color: COLORS.secondaryText }}>Click to upload document</p>
              <p className="text-xs" style={{ color: COLORS.border }}>JPG, PNG or PDF (max 5MB)</p>
            </div>
          </>
        )}
      </button>

      <Button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="w-full gap-2"
        style={{ backgroundColor: COLORS.primary }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        Submit & Verify
      </Button>
    </div>
  );
}

// ── Main KYC Dialog Component ────────────────────────────────
export function KycVerificationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    phoneVerified,
    emailVerified,
    nationalIdVerified,
    selfieVerified,
    proofOfAddressVerified,
    verificationLevel,
    badge,
    setVerified,
  } = useKycStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const verifiedMap: Record<string, boolean> = {
    phoneVerified,
    emailVerified,
    nationalIdVerified,
    selfieVerified,
    proofOfAddressVerified,
  };

  const currentStepData = STEPS[currentStep];
  const currentStepVerified = verifiedMap[currentStepData.field];

  const isFullyComplete = badge === 'gold';
  const completedCount = STEPS.filter((s) => verifiedMap[s.field]).length;

  const goNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (index: number) => {
      if (index < currentStep) {
        setDirection(-1);
        setCurrentStep(index);
      } else if (verifiedMap[STEPS[index].field]) {
        setDirection(1);
        setCurrentStep(index);
      }
    },
    [currentStep, verifiedMap]
  );

  const handleVerified = useCallback(() => {
    setVerified(currentStepData.field);
    if (currentStep < STEPS.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentStep((s) => s + 1);
      }, 600);
    }
  }, [currentStep, currentStepData.field, setVerified]);

  // Reset step if dialog reopens
  const handleOpenChange = useCallback(
    (v: boolean) => {
      if (v) {
        // Find first unverified step
        const firstUnverified = STEPS.findIndex((s) => !verifiedMap[s.field]);
        setCurrentStep(firstUnverified >= 0 ? firstUnverified : STEPS.length - 1);
      }
      onOpenChange(v);
    },
    [onOpenChange, verifiedMap]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden sm:max-w-lg" style={{ color: COLORS.text }}>
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: COLORS.lightCard }}>
                <ShieldCheck className="h-5 w-5" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold" style={{ color: COLORS.text }}>KYC Verification</DialogTitle>
                <DialogDescription style={{ color: COLORS.secondaryText }}>
                  Complete verification to unlock features
                </DialogDescription>
              </div>
            </div>
            {isFullyComplete && (
              <Badge
                className="gap-1 text-xs font-bold"
                style={{ backgroundColor: '#FFD54F', color: '#E65100' }}
              >
                <Sparkles className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: COLORS.primary }}
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1.5 text-xs text-right" style={{ color: COLORS.secondaryText }}>
            {completedCount} of {STEPS.length} steps completed
          </p>
        </div>

        <Separator />

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-1 px-4 py-3 overflow-x-auto" style={{ backgroundColor: '#FAFAFA' }}>
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isVerified = verifiedMap[step.field];
            const isCurrent = index === currentStep;

            return (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className="flex flex-col items-center gap-1 min-w-[56px] px-1.5 py-1 rounded-lg transition-all duration-200"
                style={{
                  opacity: isVerified || isCurrent ? 1 : 0.45,
                }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: isVerified
                      ? COLORS.primary
                      : isCurrent
                        ? COLORS.lightCard
                        : '#F5F5F5',
                    border: `2px solid ${isVerified ? COLORS.primary : isCurrent ? COLORS.primary : COLORS.border}`,
                  }}
                >
                  {isVerified ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <StepIcon
                      className="h-4 w-4"
                      style={{ color: isCurrent ? COLORS.primary : COLORS.secondaryText }}
                    />
                  )}
                </div>
                <span
                  className="text-[10px] font-medium leading-tight text-center"
                  style={{
                    color: isVerified
                      ? COLORS.primary
                      : isCurrent
                        ? COLORS.text
                        : COLORS.secondaryText,
                  }}
                >
                  {step.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        <Separator />

        {/* Step Content */}
        <div className="px-6 py-5 min-h-[320px] overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {currentStepData.id}
                  </span>
                  <h3 className="text-base font-semibold" style={{ color: COLORS.text }}>
                    {currentStepData.title}
                  </h3>
                </div>
                <p className="text-sm ml-8" style={{ color: COLORS.secondaryText }}>
                  {currentStepData.description}
                </p>
              </div>

              {currentStepVerified ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: COLORS.lightCard }}
                  >
                    <CheckCircle2 className="h-8 w-8" style={{ color: COLORS.primary }} />
                  </motion.div>
                  <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                    This step is already completed!
                  </p>
                  <p className="text-xs" style={{ color: COLORS.secondaryText }}>
                    You can proceed to the next step.
                  </p>
                </div>
              ) : (
                <>
                  {currentStep === 0 && <PhoneStep onVerified={handleVerified} />}
                  {currentStep === 1 && <EmailStep onVerified={handleVerified} />}
                  {currentStep === 2 && <NationalIdStep onVerified={handleVerified} />}
                  {currentStep === 3 && <SelfieStep onVerified={handleVerified} />}
                  {currentStep === 4 && <ProofOfAddressStep onVerified={handleVerified} />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t px-6 py-4" style={{ borderColor: COLORS.border }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={goPrev}
            disabled={currentStep === 0}
            className="gap-1.5"
            style={{ color: currentStep === 0 ? COLORS.border : COLORS.secondaryText }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Verification Level Badge */}
          <div className="flex items-center gap-2">
            {levelSteps.map((ls) => {
              const levelMet =
                (ls.level === 'basic' && verificationLevel !== 'none') ||
                (ls.level === 'standard' && (verificationLevel === 'standard' || verificationLevel === 'full')) ||
                (ls.level === 'full' && verificationLevel === 'full');
              const config = badgeConfig[ls.level as KycBadge];

              return (
                <span
                  key={ls.level}
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: levelMet ? config.bg : '#F5F5F5',
                    color: levelMet ? config.color : COLORS.border,
                    border: `1px solid ${levelMet ? config.border : COLORS.border}`,
                  }}
                  title={`${ls.label}: ${ls.desc}`}
                >
                  {levelMet ? <Check className="h-2.5 w-2.5" /> : <Circle className="h-2.5 w-2.5" />}
                  {ls.label}
                </span>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goNext}
            disabled={currentStep === STEPS.length - 1}
            className="gap-1.5"
            style={{ color: currentStep === STEPS.length - 1 ? COLORS.border : COLORS.primary }}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── KYC Settings Card (for Settings Tab) ─────────────────────
export function KycSettingsCard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { verificationLevel, badge, phoneVerified, emailVerified, nationalIdVerified, selfieVerified, proofOfAddressVerified } = useKycStore();

  const config = badgeConfig[badge];
  const completedCount = [phoneVerified, emailVerified, nationalIdVerified, selfieVerified, proofOfAddressVerified].filter(Boolean).length;

  return (
    <>
      <Card className="overflow-hidden">
        <div
          className="h-1"
          style={{
            background: badge === 'gold'
              ? 'linear-gradient(90deg, #FFD54F, #FFC107, #FFB300)'
              : badge === 'silver'
                ? 'linear-gradient(90deg, #BDBDBD, #9E9E9E, #757575)'
                : badge === 'bronze'
                  ? 'linear-gradient(90deg, #DEB887, #D2A679, #A0522D)'
                  : `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
          }}
        />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: COLORS.lightCard }}>
                <ShieldCheck className="h-5 w-5" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <CardTitle className="text-base" style={{ color: COLORS.text }}>KYC Verification</CardTitle>
                <CardDescription style={{ color: COLORS.secondaryText }}>
                  Verify your identity for full access
                </CardDescription>
              </div>
            </div>
            <Badge
              className="gap-1 text-xs font-semibold"
              style={{
                backgroundColor: config.bg,
                color: config.color,
                border: `1px solid ${config.border}`,
              }}
            >
              {badge !== 'none' && <config.icon className="h-3 w-3" />}
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: COLORS.secondaryText }}>Progress</span>
              <span className="text-xs font-bold" style={{ color: COLORS.primary }}>
                {completedCount}/{STEPS.length} steps
              </span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(completedCount / STEPS.length) * 100}%`,
                  backgroundColor: COLORS.primary,
                }}
              />
            </div>
          </div>

          {/* Level Indicators */}
          <div className="grid grid-cols-3 gap-2">
            {levelSteps.map((ls) => {
              const levelMet =
                (ls.level === 'basic' && verificationLevel !== 'none') ||
                (ls.level === 'standard' && (verificationLevel === 'standard' || verificationLevel === 'full')) ||
                (ls.level === 'full' && verificationLevel === 'full');
              const lvlConfig = badgeConfig[ls.level as KycBadge];

              return (
                <div
                  key={ls.level}
                  className="flex items-center gap-2 rounded-lg border p-2.5 transition-all duration-200"
                  style={{
                    borderColor: levelMet ? lvlConfig.border : COLORS.border,
                    backgroundColor: levelMet ? lvlConfig.bg : 'transparent',
                  }}
                >
                  {levelMet ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: lvlConfig.color }} />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0" style={{ color: COLORS.border }} />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: levelMet ? lvlConfig.color : COLORS.secondaryText }}>
                      {ls.label}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: COLORS.secondaryText }}>{ls.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step Checklist */}
          <div className="space-y-1.5">
            {STEPS.map((step) => {
              const StepIcon = step.icon;
              const isVerified = [phoneVerified, emailVerified, nationalIdVerified, selfieVerified, proofOfAddressVerified][step.id - 1];

              return (
                <div
                  key={step.id}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors duration-150"
                  style={{ backgroundColor: isVerified ? COLORS.lightCard : 'transparent' }}
                >
                  {isVerified ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: COLORS.primary }} />
                  ) : (
                    <StepIcon className="h-4 w-4 shrink-0" style={{ color: COLORS.secondaryText }} />
                  )}
                  <span
                    className="text-xs font-medium flex-1"
                    style={{
                      color: isVerified ? COLORS.primary : COLORS.secondaryText,
                      textDecoration: isVerified ? 'none' : 'none',
                    }}
                  >
                    {step.title}
                  </span>
                  {isVerified && (
                    <Badge
                      className="text-[10px] font-medium"
                      style={{ backgroundColor: COLORS.lightCard, color: COLORS.primary, border: `1px solid ${COLORS.primary}` }}
                    >
                      Done
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          {badge !== 'gold' ? (
            <Button
              onClick={() => setDialogOpen(true)}
              className="w-full gap-2"
              style={{ backgroundColor: COLORS.primary }}
            >
              {badge === 'none' ? (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Start Verification
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  Continue Verification
                </>
              )}
            </Button>
          ) : (
            <div
              className="flex items-center justify-center gap-2 rounded-lg p-3"
              style={{ backgroundColor: '#FFFDE7', border: `1px solid #FFD54F` }}
            >
              <Sparkles className="h-4 w-4" style={{ color: '#F57F17' }} />
              <span className="text-sm font-semibold" style={{ color: '#F57F17' }}>
                Fully Verified — All benefits unlocked!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <KycVerificationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}