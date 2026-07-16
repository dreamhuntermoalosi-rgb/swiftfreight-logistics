'use client';

import { useState } from 'react';
import { useNavStore, useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { User as UserType } from '@/lib/types';
import {
  Truck, Mail, Lock, ArrowLeft, Eye, EyeOff, UserPlus,
  Building2, Phone, UserIcon, MapPin, Briefcase, ShieldAlert, LockIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

const lesothoCities = [
  'Maseru', 'Mafeteng', "Mohale's Hoek", 'Quthing', 'Butha Buthe',
  'Leribe', 'Berea', 'Mokhotlong', 'Thaba Tseka', "Qacha's Nek",
];

const companyTypes = [
  { value: 'courier', label: 'Courier Service' },
  { value: 'logistics', label: 'Logistics Company' },
  { value: 'sourcing', label: 'Sourcing Agent' },
  { value: 'warehouse', label: 'Warehouse Partner' },
];

const plans = [
  { value: 'starter', label: 'Starter', price: 'M299', desc: 'Up to 5 users, basic features' },
  { value: 'professional', label: 'Professional', price: 'M799', desc: 'Up to 25 users, advanced analytics' },
  { value: 'enterprise', label: 'Enterprise', price: 'M1,999', desc: 'Unlimited users, priority support' },
];

export function RegisterPage() {
  const { setView } = useNavStore();
  const { login } = useAuthStore();
  const [activeTab, setActiveTab] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Customer fields
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custConfirmPassword, setCustConfirmPassword] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custNationalId, setCustNationalId] = useState('');
  const [custTerms, setCustTerms] = useState(false);
  const [custParcelDeclaration, setCustParcelDeclaration] = useState(false);

  // Company fields
  const [compName, setCompName] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compPhone, setCompPhone] = useState('');
  const [compType, setCompType] = useState('');
  const [compPlan, setCompPlan] = useState('');
  const [compOwnerName, setCompOwnerName] = useState('');
  const [compPassword, setCompPassword] = useState('');
  const [compTerms, setCompTerms] = useState(false);

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) { toast.error('Please enter your full name'); return; }
    if (!custEmail.trim() || !custEmail.includes('@')) { toast.error('Please enter a valid email'); return; }
    if (!custPhone.trim()) { toast.error('Please enter your phone number'); return; }
    if (custPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (custPassword !== custConfirmPassword) { toast.error('Passwords do not match'); return; }
    if (!custCity) { toast.error('Please select your city'); return; }
    if (!custParcelDeclaration) { toast.error('Please accept the parcel declaration to continue'); return; }
    if (!custTerms) { toast.error('Please accept the terms and conditions'); return; }

    setIsLoading(true);
    setTimeout(() => {
      const newUser: UserType = {
        id: `user-new-${Date.now()}`,
        email: custEmail.trim(),
        name: custName.trim(),
        phone: custPhone.trim(),
        role: 'customer',
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      login(newUser);
      toast.success('Account created successfully! Welcome to SwiftFreight.');
      setView('dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) { toast.error('Please enter your company name'); return; }
    if (!compEmail.trim() || !compEmail.includes('@')) { toast.error('Please enter a valid business email'); return; }
    if (!compPhone.trim()) { toast.error('Please enter your phone number'); return; }
    if (!compType) { toast.error('Please select a company type'); return; }
    if (!compPlan) { toast.error('Please select a plan'); return; }
    if (!compOwnerName.trim()) { toast.error('Please enter your name'); return; }
    if (compPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!compTerms) { toast.error('Please accept the terms and conditions'); return; }

    setIsLoading(true);
    setTimeout(() => {
      const newUser: UserType = {
        id: `user-new-${Date.now()}`,
        email: compEmail.trim(),
        name: compOwnerName.trim(),
        phone: compPhone.trim(),
        role: 'company_owner',
        companyId: `comp-new-${Date.now()}`,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      login(newUser);
      toast.success('Company registered successfully! Welcome to SwiftFreight.');
      setView('dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Top bar */}
      <header className="w-full px-4 sm:px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
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
          className="w-full max-w-lg"
        >
          <Card className="relative bg-white border border-[#E0E0E0] shadow-sm">
            {/* Decorative green line at top */}
            <div className="h-1 rounded-t-xl bg-[#2E7D32]" />
            <CardHeader className="text-center space-y-2 pb-2">
              <div className="flex justify-center mb-1">
                <div className="bg-[#2E7D32] p-2 rounded-xl">
                  <Truck className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
              <CardDescription>Get started with SwiftFreight in minutes</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="relative mb-6">
                  <TabsList className="grid w-full grid-cols-2 relative">
                    <TabsTrigger value="customer" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:text-white relative z-10">
                      <UserIcon className="h-4 w-4" />
                      Customer
                    </TabsTrigger>
                    <TabsTrigger value="company" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:text-white relative z-10">
                      <Building2 className="h-4 w-4" />
                      Company
                    </TabsTrigger>
                    {/* Sliding indicator */}
                    <div className={`absolute top-0.5 bottom-0.5 w-[calc(50%-4px)] rounded-md bg-[#2E7D32] transition-transform duration-300 ease-out ${activeTab === 'company' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`} />
                  </TabsList>
                </div>

                {/* Customer Tab */}
                <TabsContent value="customer">
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cust-name">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cust-name"
                          placeholder="Mmathapelo Mphatsoe"
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          className="pl-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cust-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cust-email"
                            type="email"
                            placeholder="you@email.co.ls"
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                            className="pl-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cust-phone">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cust-phone"
                            type="tel"
                            placeholder="+266 2xxx xxxx"
                            value={custPhone}
                            onChange={(e) => setCustPhone(e.target.value)}
                            className="pl-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground">Lesotho country code: +266</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cust-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cust-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
                            value={custPassword}
                            onChange={(e) => setCustPassword(e.target.value)}
                            className="pl-9 pr-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cust-confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cust-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter password"
                            value={custConfirmPassword}
                            onChange={(e) => setCustConfirmPassword(e.target.value)}
                            className="pl-9 pr-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cust-city">City</Label>
                      <Select value={custCity} onValueChange={setCustCity}>
                        <SelectTrigger className="border-[#E0E0E0]">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {lesothoCities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* KYC: National ID / Passport */}
                    <div className="space-y-2">
                      <Label htmlFor="cust-national-id" className="flex items-center gap-2">
                        National ID / Passport Number
                        <span className="text-[11px] text-muted-foreground font-normal">(optional)</span>
                      </Label>
                      <div className="relative">
                        <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cust-national-id"
                          placeholder="e.g. 1234567890 or passport number"
                          value={custNationalId}
                          onChange={(e) => setCustNationalId(e.target.value)}
                          className="pl-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                        />
                      </div>
                      <p className="text-[11px] text-amber-600 flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" />
                        Required for shipments over M5,000
                      </p>
                    </div>

                    {/* Platform Disclaimer */}
                    <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-lg p-3">
                      <p className="text-[12px] text-[#1B5E20] leading-relaxed">
                        SwiftFreight is a technology platform. Courier companies are responsible for transporting goods. Customers are responsible for declaring package contents accurately.
                      </p>
                    </div>

                    {/* Package Declaration */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Label className="text-sm font-semibold text-[#2E7D32]">Package Declaration</Label>
                        <Badge variant="outline" className="bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30 text-[10px] px-1.5 py-0 flex items-center gap-1">
                          <LockIcon className="h-2.5 w-2.5" />
                          Required
                        </Badge>
                      </div>
                      <div className="bg-white border border-[#E0E0E0] rounded-lg p-3">
                        <div className="flex items-start gap-2.5">
                          <Checkbox
                            id="cust-parcel-declaration"
                            checked={custParcelDeclaration}
                            onCheckedChange={(checked) => setCustParcelDeclaration(checked === true)}
                            className="mt-0.5 data-[state=checked]:bg-[#2E7D32] data-[state=checked]:border-[#2E7D32]"
                          />
                          <Label htmlFor="cust-parcel-declaration" className="text-[12px] font-normal text-muted-foreground leading-relaxed cursor-pointer">
                            I declare that this parcel does not contain prohibited, illegal, dangerous, counterfeit, or undeclared goods. I understand that false declarations may result in account suspension and reporting to the relevant authorities.
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <Checkbox
                        id="cust-terms"
                        checked={custTerms}
                        onCheckedChange={(checked) => setCustTerms(checked === true)}
                        className="mt-0.5 data-[state=checked]:bg-[#2E7D32] data-[state=checked]:border-[#2E7D32]"
                      />
                      <Label htmlFor="cust-terms" className="text-sm font-normal text-muted-foreground leading-snug cursor-pointer">
                        I agree to the{' '}
                        <button type="button" className="text-[#2E7D32] hover:underline">Terms of Service</button>
                        {' '}and{' '}
                        <button type="button" className="text-[#2E7D32] hover:underline">Privacy Policy</button>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating account...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          Create Account
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Company Tab */}
                <TabsContent value="company">
                  <form onSubmit={handleCompanySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="comp-name">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="comp-name"
                          placeholder="Mountain Express Logistics"
                          value={compName}
                          onChange={(e) => setCompName(e.target.value)}
                          className="pl-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="comp-email">Business Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="comp-email"
                            type="email"
                            placeholder="info@company.co.ls"
                            value={compEmail}
                            onChange={(e) => setCompEmail(e.target.value)}
                            className="pl-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comp-phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="comp-phone"
                            type="tel"
                            placeholder="+266 2xxx xxxx"
                            value={compPhone}
                            onChange={(e) => setCompPhone(e.target.value)}
                            className="pl-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Type</Label>
                        <Select value={compType} onValueChange={setCompType}>
                          <SelectTrigger className="border-[#E0E0E0]">
                            <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {companyTypes.map((ct) => (
                              <SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Your Name</Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="comp-owner-name"
                            placeholder="Your full name"
                            value={compOwnerName}
                            onChange={(e) => setCompOwnerName(e.target.value)}
                            className="pl-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Plan Selection */}
                    <div className="h-px bg-[#E0E0E0] my-2" />
                    <div className="space-y-2">
                      <Label>Plan</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {plans.map((plan) => (
                          <button
                            key={plan.value}
                            type="button"
                            onClick={() => setCompPlan(plan.value)}
                            className={`relative rounded-lg border-2 p-3 text-left transition-all duration-200 hover:scale-[1.02] ${
                              compPlan === plan.value
                                ? 'border-[#2E7D32] bg-[#E8F5E9]'
                                : 'border-[#E0E0E0] hover:border-[#BDBDBD] bg-white'
                            }`}
                          >
                            {compPlan === plan.value && (
                              <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-[#2E7D32] flex items-center justify-center">
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            <p className="font-semibold text-sm">{plan.label}</p>
                            <p className="text-[#2E7D32] font-bold text-lg leading-tight">{plan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                            <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{plan.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comp-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="comp-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          value={compPassword}
                          onChange={(e) => setCompPassword(e.target.value)}
                          className="pl-9 pr-9 border-[#E0E0E0] focus-visible:ring-[#2E7D32]/30 focus-visible:border-[#2E7D32]/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <Checkbox
                        id="comp-terms"
                        checked={compTerms}
                        onCheckedChange={(checked) => setCompTerms(checked === true)}
                        className="mt-0.5 data-[state=checked]:bg-[#2E7D32] data-[state=checked]:border-[#2E7D32]"
                      />
                      <Label htmlFor="comp-terms" className="text-sm font-normal text-muted-foreground leading-snug cursor-pointer">
                        I agree to the{' '}
                        <button type="button" className="text-[#2E7D32] hover:underline">Terms of Service</button>
                        ,{' '}
                        <button type="button" className="text-[#2E7D32] hover:underline">Privacy Policy</button>
                        , and the selected plan&apos;s billing terms
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Registering company...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Register Company
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => setView('login')}
                  className="text-[#2E7D32] hover:text-[#1B5E20] font-medium transition-colors"
                >
                  Sign In
                </button>
              </p>
            </CardFooter>
          </Card>
          {/* Powered by footer */}
          <p className="text-center text-[11px] text-muted-foreground/50 mt-4">
            Powered by <span className="font-medium text-muted-foreground/70">SwiftFreight Technologies</span>
          </p>
        </motion.div>
      </main>
    </div>
  );
}