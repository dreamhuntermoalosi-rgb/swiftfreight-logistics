'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Package,
  MapPin,
  MessageSquare,
  Users,
  UserCog,
  Truck,
  Radio,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ClipboardList,
  Receipt,
  ChevronRight,
  PackageCheck,
  CreditCard,
  AlertTriangle,
  Info,
  User as UserIcon,
  FileText,
} from 'lucide-react';
import { useNavStore, useAuthStore, useNotificationStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
import { notifications as mockNotifications, roleLabels, companies } from '@/lib/mock-data';
import type { DashboardTab, UserRole, NotificationType } from '@/lib/types';
import { tabComponentMap } from '@/components/dashboard/tabs';

// ============ TYPES ============
interface NavItem {
  tab: DashboardTab;
  label: string;
  icon: React.ElementType;
}

// ============ HELPERS ============
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'delivery_update':
      return PackageCheck;
    case 'new_message':
      return MessageSquare;
    case 'quote_received':
    case 'payment':
      return CreditCard;
    case 'alert':
      return AlertTriangle;
    case 'system':
    default:
      return Info;
  }
}

function getNotificationIconColor(type: NotificationType) {
  switch (type) {
    case 'delivery_update':
      return 'text-emerald-500';
    case 'new_message':
      return 'text-primary';
    case 'quote_received':
    case 'payment':
      return 'text-teal-500';
    case 'alert':
      return 'text-amber-500';
    case 'system':
    default:
      return 'text-muted-foreground';
  }
}

// ============ NAV CONFIGURATION ============
const commonNavItems: NavItem[] = [
  { tab: 'overview', label: 'Overview', icon: LayoutDashboard },
  { tab: 'deliveries', label: 'Deliveries', icon: Package },
  { tab: 'tracking', label: 'Tracking', icon: MapPin },
  { tab: 'messages', label: 'Messages', icon: MessageSquare },
];

const staffNavItems: NavItem[] = [
  { tab: 'customers', label: 'Customers', icon: Users },
  { tab: 'drivers', label: 'Drivers', icon: UserCog },
  { tab: 'fleet', label: 'Fleet', icon: Truck },
  { tab: 'dispatch', label: 'Dispatch', icon: Radio },
  { tab: 'sourcing', label: 'Sourcing', icon: ShoppingBag },
  { tab: 'messages', label: 'Messages', icon: MessageSquare },
  { tab: 'notifications', label: 'Notifications', icon: Bell },
  { tab: 'invoices', label: 'Invoices', icon: Receipt },
  { tab: 'quotations', label: 'Quotations', icon: FileText },
  { tab: 'reports', label: 'Reports', icon: BarChart3 },
];

const driverNavItems: NavItem[] = [
  { tab: 'overview', label: 'Overview', icon: LayoutDashboard },
  { tab: 'deliveries', label: 'My Jobs', icon: ClipboardList },
  { tab: 'fleet', label: 'My Vehicle', icon: Truck },
  { tab: 'messages', label: 'Messages', icon: MessageSquare },
];

const customerNavItems: NavItem[] = [
  { tab: 'deliveries', label: 'My Shipments', icon: Package },
  { tab: 'tracking', label: 'Track Parcel', icon: MapPin },
  { tab: 'sourcing', label: 'Sourcing Requests', icon: ShoppingBag },
  { tab: 'messages', label: 'Messages', icon: MessageSquare },
  { tab: 'invoices', label: 'Invoices', icon: Receipt },
];

function getNavItemsForRole(role: UserRole): NavItem[] {
  const staffRoles: UserRole[] = [
    'company_owner',
    'operations_manager',
    'dispatcher',
    'fleet_manager',
    'super_admin',
  ];
  if (staffRoles.includes(role)) {
    return [...commonNavItems, ...staffNavItems];
  }
  if (role === 'driver') {
    return driverNavItems;
  }
  if (role === 'customer') {
    return customerNavItems;
  }
  return commonNavItems;
}

const tabTitles: Record<DashboardTab, string> = {
  overview: 'Overview',
  deliveries: 'Deliveries',
  tracking: 'Tracking',
  customers: 'Customers',
  drivers: 'Drivers',
  fleet: 'Fleet',
  dispatch: 'Dispatch',
  sourcing: 'Sourcing',
  messages: 'Messages',
  reports: 'Reports',
  invoices: 'Invoices',
  quotations: 'Quotations',
  notifications: 'Notifications',
  settings: 'Settings',
};

function getTabTitleForRole(tab: DashboardTab, role: UserRole): string {
  if (role === 'customer') {
    const map: Partial<Record<DashboardTab, string>> = {
      deliveries: 'My Shipments',
      tracking: 'Track Parcel',
      sourcing: 'Sourcing Requests',
      invoices: 'Invoices',
    };
    return map[tab] ?? tabTitles[tab];
  }
  if (role === 'driver') {
    const map: Partial<Record<DashboardTab, string>> = {
      deliveries: 'My Jobs',
      fleet: 'My Vehicle',
    };
    return map[tab] ?? tabTitles[tab];
  }
  return tabTitles[tab];
}

// ============ SIDEBAR NAV CONTENT ============
function SidebarNavContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { dashboardTab, setDashboardTab } = useNavStore();
  const { currentUser, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const role = currentUser?.role ?? 'customer';
  const navItems = getNavItemsForRole(role);

  const handleNavClick = useCallback(
    (tab: DashboardTab) => {
      setDashboardTab(tab);
      onNavigate?.();
    },
    [setDashboardTab, onNavigate]
  );

  const handleSignOut = useCallback(() => {
    logout();
    useNavStore.getState().setView('marketing');
    onNavigate?.();
  }, [logout, onNavigate]);

  const initials = currentUser ? getInitials(currentUser.name) : '??';
  const displayName = currentUser?.name ?? 'Unknown User';
  const displayRole = currentUser
    ? roleLabels[currentUser.role] ?? currentUser.role
    : 'User';

  return (
    <div className="flex h-full flex-col">
      {/* Gradient top line */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      {/* Logo area */}
      <div className="relative flex h-16 items-center gap-3 border-b px-4 bg-white/60 dark:bg-black/20 backdrop-blur-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Truck className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight">SwiftFreight</span>
          {currentUser?.companyId && (
            <span className="text-[11px] leading-tight text-muted-foreground">
              {companies.find((c) => c.id === currentUser.companyId)?.name ?? 'My Company'}
            </span>
          )}
        </div>
      </div>

      {/* Gradient border below logo */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = dashboardTab === item.tab;
            const showBadge = item.tab === 'messages' && unreadCount > 0;

            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:pl-4'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-gradient-to-b from-primary via-emerald to-teal" />
                )}
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {showBadge && (
                  <Badge
                    variant="destructive"
                    className="h-5 min-w-5 justify-center px-1.5 text-[10px]"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      <div className="space-y-1 border-t px-3 py-3">
        <button
          onClick={() => handleNavClick('settings')}
          className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
            dashboardTab === 'settings'
              ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:pl-4'
          }`}
        >
          {dashboardTab === 'settings' && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-gradient-to-b from-primary via-emerald to-teal" />
          )}
          <Settings className={`h-5 w-5 shrink-0 ${dashboardTab === 'settings' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
          <span className="flex-1 text-left">Settings</span>
        </button>
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-left">Sign Out</span>
        </button>
      </div>

      {/* User info card */}
      <div className="border-t px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">
              {displayName}
            </p>
            <Badge
              variant="secondary"
              className="mt-0.5 px-1.5 py-0 text-[10px]"
            >
              {displayRole}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ NOTIFICATION DROPDOWN ============
function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationStore();
  const { setDashboardTab } = useNavStore();
  const isMobile = useIsMobile();

  const recentNotifications = useMemo(
    () => notifications.slice(0, 5),
    [notifications]
  );

  const hasUnread = unreadCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Notifications${hasUnread ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-[18px] w-[18px]" />
          {hasUnread && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-primary hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-72">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div>
              {recentNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const iconColor = getNotificationIconColor(notification.type);
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex cursor-pointer items-start gap-3 px-4 py-3"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ${iconColor}`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/70">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="px-2 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs text-primary hover:text-primary"
                onClick={() => setDashboardTab('notifications')}
              >
                View All Notifications
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============ USER DROPDOWN ============
function UserDropdown() {
  const { currentUser, logout } = useAuthStore();
  const { setDashboardTab } = useNavStore();

  const initials = currentUser ? getInitials(currentUser.name) : '??';
  const displayName = currentUser?.name ?? 'Unknown';
  const displayRole = currentUser
    ? roleLabels[currentUser.role] ?? currentUser.role
    : 'User';

  const handleSignOut = useCallback(() => {
    logout();
    useNavStore.getState().setView('marketing');
  }, [logout]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex h-9 items-center gap-2 rounded-full px-2"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium lg:inline-block">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayRole}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setDashboardTab('settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============ DASHBOARD HEADER ============
function DashboardHeader() {
  const {
    dashboardTab,
    setDashboardTab,
    setTrackingNumber,
    trackingNumber,
  } = useNavStore();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const { setSidebarOpen } = useNavStore();

  const { currentUser } = useAuthStore();
  const role = currentUser?.role ?? 'customer';
  const title = getTabTitleForRole(dashboardTab, role);

  const handleQuickTrack = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const val = trackingNumber.trim();
      if (val) {
        setDashboardTab('tracking');
      }
    },
    [trackingNumber, setDashboardTab]
  );

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card px-4 md:px-6">
      {/* Left: hamburger + breadcrumb / mobile title */}
      <div className="flex min-w-0 items-center gap-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="hidden md:block">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium">
                  {title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {isMobile && (
          <h1 className="truncate text-sm font-semibold">{title}</h1>
        )}
      </div>

      {/* Right: search, theme, notifications, user */}
      <div className="ml-auto flex items-center gap-2">
        {/* Tracking search — desktop only */}
        <form onSubmit={handleQuickTrack} className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Quick track..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="h-9 w-48 bg-muted/50 pl-8 text-sm lg:w-64"
            />
          </div>
        </form>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User avatar */}
        <UserDropdown />
      </div>
    </header>
  );
}

// ============ TAB RENDERER ============
function TabRenderer({ tab }: { tab: DashboardTab }) {
  const Component = tabComponentMap[tab];
  if (!Component) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Unknown tab
      </div>
    );
  }
  return <Component />;
}

// ============ MAIN DASHBOARD LAYOUT ============
export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { dashboardTab, sidebarOpen, setSidebarOpen, setDashboardTab } = useNavStore();
  const { currentUser } = useAuthStore();
  const { notifications } = useNotificationStore();

  // Initialize notification store with mock data on first render
  useEffect(() => {
    if (notifications.length === 0 && currentUser) {
      const userNotifs = mockNotifications.filter(
        (n) => n.userId === currentUser.id
      );
      if (userNotifs.length > 0) {
        const store = useNotificationStore.getState();
        if (store.notifications.length === 0) {
          const unread = userNotifs.filter((n) => !n.isRead).length;
          useNotificationStore.setState({
            notifications: userNotifs,
            unreadCount: unread,
          });
        }
      }
    }
  }, [currentUser, notifications.length]);

  // Set default tab for role on login
  useEffect(() => {
    if (currentUser) {
      const navItems = getNavItemsForRole(currentUser.role);
      const currentTab = useNavStore.getState().dashboardTab;
      const validTabs = navItems.map((n) => n.tab);
      if (!validTabs.includes(currentTab)) {
        setDashboardTab(navItems[0].tab);
      }
    }
  }, [currentUser, setDashboardTab]);

  // Close mobile sidebar on tab change
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [dashboardTab, isMobile, setSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className="hidden w-64 shrink-0 border-r bg-card shadow-sm md:flex md:flex-col">
          <SidebarNavContent />
        </aside>
      )}

      {/* Mobile sidebar (Sheet) */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarNavContent onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        {/* Gradient top-border accent */}
        <div className="h-1 bg-gradient-to-r from-primary via-emerald to-teal shrink-0" />
        <main className="flex-1 scroll-smooth overflow-y-auto p-4 md:p-6">
          <TabRenderer tab={dashboardTab} />
        </main>
      </div>
    </div>
  );
}