'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { companies, roleLabels } from '@/lib/mock-data';
import { useTheme } from 'next-themes';
import {
  Settings, Bell, Shield, Palette, User, Building2, Mail,
  Phone, MessageSquare, Lock, Trash2, Zap, Sun, Moon, Monitor,
  AlertTriangle, ShieldCheck, Camera, Globe, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

// ── Helpers ──────────────────────────────────────────────────
function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const planColors: Record<string, string> = {
  starter: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  professional: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  enterprise: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

// ── Main Component ──────────────────────────────────────────
export function SettingsTab() {
  const { currentUser, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  // Company form state
  const userCompany = currentUser?.companyId
    ? companies.find(c => c.id === currentUser.companyId)
    : null;

  const [companyForm, setCompanyForm] = useState({
    name: userCompany?.name || '',
    email: userCompany?.email || '',
    phone: userCompany?.phone || '',
    address: userCompany?.address || '',
    city: userCompany?.city || '',
    country: userCompany?.country || '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    deliveryUpdates: true,
    newMessages: true,
    marketing: false,
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });

  const isOwnerOrManager = currentUser?.role === 'company_owner' || currentUser?.role === 'operations_manager';

  function handleSaveProfile() {
    toast.success('Profile Updated', { description: 'Your profile changes have been saved' });
  }

  function handleSaveCompany() {
    toast.success('Company Updated', { description: 'Company settings have been saved' });
  }

  function handleToggleNotification(key: keyof typeof notifications) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preference Updated', {
      description: `${key.replace(/([A-Z])/g, ' $1').trim()} notification ${notifications[key] ? 'disabled' : 'enabled'}`,
    });
  }

  function handleChangePassword() {
    if (!passwordForm.current || !passwordForm.newPassword || !passwordForm.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password Changed', { description: 'Your password has been updated successfully' });
    setPasswordForm({ current: '', newPassword: '', confirm: '' });
  }

  function handleDeleteAccount() {
    toast.success('Account Deletion Requested', { description: 'Your account will be deleted within 30 days' });
    setDeleteDialogOpen(false);
    setTimeout(() => logout(), 1000);
  }

  function handleDeactivateCompany() {
    toast.success('Company Deactivation Requested', { description: 'The company will be deactivated within 30 days' });
    setDeactivateDialogOpen(false);
  }

  const settingsNav = [
    { id: 'profile', label: 'Profile', icon: User },
    ...(isOwnerOrManager ? [{ id: 'company', label: 'Company', icon: Building2 }] : []),
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Settings Nav - vertical on desktop */}
        <Card className="w-full shrink-0 lg:w-56">
          <CardContent className="p-2">
            <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
              {settingsNav.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-all duration-150 whitespace-nowrap ${
                    activeSection === item.id
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="flex-1">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

            {/* ── Profile Section ── */}
            {activeSection === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profile Settings</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative group/avatar">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                          {getInitials(profileForm.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full opacity-0 transition-opacity duration-200 group-hover/avatar:opacity-100"
                        onClick={() => toast.info('Avatar upload coming soon')}
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{profileForm.name || 'User'}</h3>
                      <Badge className={`mt-1 ${planColors[userCompany?.plan || 'starter']}`}>
                        {currentUser?.role ? roleLabels[currentUser.role] : 'User'}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input
                        id="profile-name"
                        value={profileForm.name}
                        onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={profileForm.email}
                        onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-phone">Phone</Label>
                      <Input
                        id="profile-phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={currentUser?.role ? roleLabels[currentUser.role] : 'User'}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  {userCompany && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-muted-foreground">Company</Label>
                        <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                          <Building2 className="h-4 w-4 text-primary" />
                          {userCompany.name}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} className="gap-2">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Company Section ── */}
            {activeSection === 'company' && userCompany && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Company Settings</CardTitle>
                  <CardDescription>Manage your company information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{companyForm.name}</h3>
                        <Badge className={`mt-1 capitalize ${planColors[userCompany.plan]}`}>
                          {userCompany.plan} Plan
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => toast.info('Upgrade feature coming soon')}
                    >
                      <Zap className="h-4 w-4" />
                      Upgrade Plan
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={companyForm.name}
                        onChange={e => setCompanyForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Business Email</Label>
                      <Input
                        type="email"
                        value={companyForm.email}
                        onChange={e => setCompanyForm(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        value={companyForm.phone}
                        onChange={e => setCompanyForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={companyForm.address}
                        onChange={e => setCompanyForm(f => ({ ...f, address: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={companyForm.city}
                        onChange={e => setCompanyForm(f => ({ ...f, city: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        value={companyForm.country}
                        onChange={e => setCompanyForm(f => ({ ...f, country: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveCompany} className="gap-2">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Notifications Section ── */}
            {activeSection === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    { key: 'email' as const, label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
                    { key: 'push' as const, label: 'Push Notifications', desc: 'Receive push notifications in your browser', icon: Bell },
                    { key: 'sms' as const, label: 'SMS Notifications', desc: 'Receive notifications via text message', icon: Phone },
                    { key: 'deliveryUpdates' as const, label: 'Delivery Updates', desc: 'Get notified about delivery status changes', icon: Globe },
                    { key: 'newMessages' as const, label: 'New Messages', desc: 'Get notified when you receive new messages', icon: MessageSquare },
                    { key: 'marketing' as const, label: 'Marketing Emails', desc: 'Receive promotional emails and offers', icon: Zap },
                  ].map((item, i) => (
                    <div key={item.key}>
                      {i > 0 && <div className="my-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications[item.key]}
                          onCheckedChange={() => handleToggleNotification(item.key)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* ── Appearance Section ── */}
            {activeSection === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Theme</Label>
                      <p className="text-xs text-muted-foreground mb-3">Select your preferred color theme</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor },
                        ].map(t => (
                          <button
                            key={t.value}
                            onClick={() => {
                              setTheme(t.value);
                              toast.success('Theme Updated', { description: `${t.label} theme applied` });
                            }}
                            className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                              theme === t.value
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-muted-foreground/30'
                            }`}
                          >
                            <t.icon className={`h-6 w-6 ${theme === t.value ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-medium ${theme === t.value ? 'text-primary' : ''}`}>
                              {t.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Security Section ── */}
            {activeSection === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Change Password */}
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Change Password
                    </h3>
                    <div className="mt-4 space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="current-pw">Current Password</Label>
                        <Input
                          id="current-pw"
                          type="password"
                          placeholder="Enter current password"
                          value={passwordForm.current}
                          onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-pw">New Password</Label>
                        <Input
                          id="new-pw"
                          type="password"
                          placeholder="Enter new password"
                          value={passwordForm.newPassword}
                          onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-pw">Confirm New Password</Label>
                        <Input
                          id="confirm-pw"
                          type="password"
                          placeholder="Confirm new password"
                          value={passwordForm.confirm}
                          onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                        />
                      </div>
                      <Button onClick={handleChangePassword} className="gap-2">
                        <Lock className="h-4 w-4" />
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* 2FA */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Two-Factor Authentication</p>
                          <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                        <Switch disabled />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Danger Zone Section ── */}
            {activeSection === 'danger' && (
              <Card className="border-red-200 dark:border-red-900/50">
                <CardHeader>
                  <CardTitle className="text-base text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-900/50 transition-colors duration-200 hover:bg-destructive/5">
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</p>
                      <p className="text-xs text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" className="gap-2 shrink-0 transition-all duration-200 hover:bg-destructive/90" onClick={() => setDeleteDialogOpen(true)}>
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>

                  {currentUser?.role === 'company_owner' && (
                    <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-900/50 transition-colors duration-200 hover:bg-destructive/5">
                      <div>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">Deactivate Company</p>
                        <p className="text-xs text-muted-foreground">
                          Deactivate {userCompany?.name || 'your company'} and all operations. This can be reversed within 30 days.
                        </p>
                      </div>
                      <Button variant="destructive" className="gap-2 shrink-0 transition-all duration-200 hover:bg-destructive/90" onClick={() => setDeactivateDialogOpen(true)}>
                        <Building2 className="h-4 w-4" />
                        Deactivate
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action is permanent and cannot be undone.
              All your data, including delivery history and messages, will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="gap-2" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4" />
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Company Confirmation Dialog */}
      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Deactivate Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {userCompany?.name}? All company operations will be paused.
              This can be reversed within 30 days by contacting support.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="gap-2" onClick={handleDeactivateCompany}>
              <Building2 className="h-4 w-4" />
              Yes, Deactivate Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}