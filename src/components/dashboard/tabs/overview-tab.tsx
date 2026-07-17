'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  DollarSign,
  Package,
  Clock,
  Users,
  TrendingUp,
  Truck,
  MapPin,
  Star,
  Bell,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  CreditCard,
  Shield,
  ArrowUpRight,
  Plus,
  Search,
  Phone,
  ClipboardCheck,
  CheckCircle2,
  Info,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { analyticsData, deliveries, notifications, statusLabels, statusColors, customers, sourcingRequests, vehicles } from '@/lib/mock-data';
import { useAuthStore, useNavStore } from '@/lib/store';
import type { Delivery, SourcingStatus, Vehicle } from '@/lib/types';

// ============ Chart Configs ============
const revenueChartConfig: ChartConfig = {
  revenue: { label: 'Revenue (M)', color: '#16a34a' },
  deliveries: { label: 'Deliveries', color: '#14b8a6' },
};

const statusChartConfig: ChartConfig = {
  delivered: { label: 'Delivered', color: '#22c55e' },
  inTransit: { label: 'In Transit', color: '#06b6d4' },
  atBorder: { label: 'At Border', color: '#f59e0b' },
  outForDelivery: { label: 'Out for Delivery', color: '#8b5cf6' },
  collected: { label: 'Collected', color: '#14b8a6' },
  atWarehouse: { label: 'At Warehouse', color: '#6366f1' },
  quoteAccepted: { label: 'Quote Accepted', color: '#3b82f6' },
  awaitingQuote: { label: 'Awaiting Quote', color: '#f97316' },
  requestReceived: { label: 'Request Received', color: '#94a3b8' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
  returned: { label: 'Returned', color: '#f43f5e' },
};

const PIE_COLORS: Record<string, string> = {
  Delivered: '#22c55e',
  'In Transit': '#06b6d4',
  'At Border': '#f59e0b',
  'Out for Delivery': '#8b5cf6',
  Collected: '#14b8a6',
  'At Warehouse': '#6366f1',
  'Quote Accepted': '#3b82f6',
  'Awaiting Quote': '#f97316',
  'Request Received': '#94a3b8',
  Cancelled: '#ef4444',
  Returned: '#f43f5e',
};

const performanceRadarConfig: ChartConfig = {
  performance: { label: 'Score', color: '#14b8a6' },
};

const performanceRadarData = [
  { metric: 'Speed', value: 85 },
  { metric: 'Reliability', value: 94 },
  { metric: 'Satisfaction', value: 88 },
  { metric: 'Volume', value: 78 },
  { metric: 'Growth', value: 92 },
];

const spendingChartConfig: ChartConfig = {
  spent: { label: 'Spent (M)', color: '#16a34a' },
};

const spendingTrendChartConfig: ChartConfig = {
  amount: { label: 'Amount (M)', color: '#14b8a6' },
};

const weeklyEarningsChartConfig: ChartConfig = {
  earnings: { label: 'Earnings (M)', color: '#16a34a' },
};

const trailerRevenueChartConfig: ChartConfig = {
  revenue: { label: 'Revenue (M)', color: '#16a34a' },
};

// Live activity feed data
const liveActivities = [
  { id: 1, type: 'delivery' as const, message: 'SF2025000231LS picked up from Johannesburg warehouse', time: '2m ago', icon: 'Package' },
  { id: 2, type: 'alert' as const, message: 'Driver Lebo Mosotho reported border delay at Maseru Bridge', time: '8m ago', icon: 'AlertTriangle' },
  { id: 3, type: 'payment' as const, message: 'Payment of M2,450 received from Mamello Sekhoko', time: '15m ago', icon: 'CreditCard' },
  { id: 4, type: 'delivery' as const, message: 'SF2025000187LS delivered successfully in Mafeteng', time: '22m ago', icon: 'CheckCircle2' },
  { id: 5, type: 'system' as const, message: 'Fleet utilization reached 85% — consider scheduling maintenance', time: '35m ago', icon: 'Info' },
  { id: 6, type: 'delivery' as const, message: 'SF2025000456LS cleared customs at Maputsoe border', time: '48m ago', icon: 'Package' },
  { id: 7, type: 'driver' as const, message: 'Tsepang Makhaola started route: Bloemfontein → Quthing', time: '1h ago', icon: 'Truck' },
  { id: 8, type: 'payment' as const, message: 'Invoice INV-0042 marked as paid by Mokhethi Makhetha', time: '1h ago', icon: 'CreditCard' },
  { id: 9, type: 'alert' as const, message: 'Vehicle LP 558 ZG 171 overdue for service by 5 days', time: '2h ago', icon: 'AlertTriangle' },
  { id: 10, type: 'delivery' as const, message: 'New delivery request from Palesa Moahloli — Samsung Galaxy S24', time: '2h ago', icon: 'Plus' },
  { id: 11, type: 'system' as const, message: 'Daily performance report generated for Mountain Express', time: '3h ago', icon: 'FileText' },
  { id: 12, type: 'driver' as const, message: 'Kabelo Mothabi completed 5 deliveries today — rating 4.8★', time: '3h ago', icon: 'Star' },
];

const customerSpendingTrend = [
  { month: 'Feb', amount: 1200 },
  { month: 'Mar', amount: 2800 },
  { month: 'Apr', amount: 1900 },
  { month: 'May', amount: 3400 },
  { month: 'Jun', amount: 4200 },
  { month: 'Jul', amount: 3800 },
];

const weeklyEarnings = [
  { day: 'Mon', earnings: 450 },
  { day: 'Tue', earnings: 620 },
  { day: 'Wed', earnings: 380 },
  { day: 'Thu', earnings: 750 },
  { day: 'Fri', earnings: 890 },
  { day: 'Sat', earnings: 340 },
  { day: 'Sun', earnings: 0 },
];

const activityTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  delivery: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-600 dark:text-orange-400', border: 'border-l-[3px] border-l-orange-500' },
  alert: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-l-[3px] border-l-amber-500' },
  payment: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-500 dark:text-orange-300', border: 'border-l-[3px] border-l-orange-400' },
  system: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-l-[3px] border-l-blue-400 dark:border-l-blue-500' },
  driver: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-l-[3px] border-l-primary' },
};

function LiveActivityIcon({ iconName, className }: { iconName: string; className?: string }) {
  const props = { className: `h-4 w-4 ${className || ''}` };
  switch (iconName) {
    case 'Package': return <Package {...props} />;
    case 'AlertTriangle': return <AlertTriangle {...props} />;
    case 'CreditCard': return <CreditCard {...props} />;
    case 'CheckCircle2': return <CheckCircle2 {...props} />;
    case 'Info': return <Info {...props} />;
    case 'Truck': return <Truck {...props} />;
    case 'Plus': return <Plus {...props} />;
    case 'FileText': return <FileText {...props} />;
    case 'Star': return <Star {...props} />;
    default: return <Bell {...props} />;
  }
}

// ============ Helpers ============
function formatCurrency(value: number) {
  return `M${value.toLocaleString()}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function notifIcon(type: string) {
  switch (type) {
    case 'delivery_update':
      return <Truck className="h-4 w-4 text-orange-600" />;
    case 'new_message':
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case 'quote_received':
      return <CreditCard className="h-4 w-4 text-amber-500" />;
    case 'payment':
      return <DollarSign className="h-4 w-4 text-green-600" />;
    case 'system':
      return <Shield className="h-4 w-4 text-slate-500" />;
    case 'alert':
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

// ============ Section Header ============
function SectionHeader({ title, description, icon: Icon, action }: { title: string; description?: string; icon?: React.ElementType; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ============ KPI Card ============
function KpiCard({
  title,
  value,
  growth,
  icon: Icon,
  prefix = '',
  suffix = '',
  isNegative = false,
  iconColor = 'text-orange-600',
  pulse = false,
}: {
  title: string;
  value: string;
  growth?: number;
  icon: React.ComponentType<{ className?: string }>;
  prefix?: string;
  suffix?: string;
  isNegative?: boolean;
  iconColor?: string;
  pulse?: boolean;
}) {
  const isPositive = growth !== undefined && growth >= 0;
  return (
    <div className="relative rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            {title}
            {pulse && <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />}
          </p>
          <p className="text-xl font-bold tracking-tight sm:text-2xl">
            {prefix}{value}{suffix}
          </p>
        </div>
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
        </div>
      </div>
      {growth !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className={isPositive || !isNegative ? 'text-orange-600' : 'text-red-500'}>
            {isPositive ? '+' : ''}{growth}%
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}

// ============ Loading Skeleton ============
function OverviewLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-muted/40 p-4">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="mb-2 h-8 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

// ============ Customer Overview ============
function CustomerOverview() {
  const { currentUser } = useAuthStore();
  const { setDashboardTab } = useNavStore();

  // Find customer matching the logged-in user
  const customerRecord = useMemo(() => {
    return customers.find((c) => c.name === currentUser?.name) || customers[0];
  }, [currentUser]);

  const customerDeliveries = useMemo(
    () => deliveries.filter((d) => d.customerId === customerRecord.id),
    [customerRecord.id]
  );

  const activeShipments = useMemo(
    () => customerDeliveries.filter((d) => d.status !== 'delivered' && d.status !== 'cancelled' && d.status !== 'returned'),
    [customerDeliveries]
  );

  const deliveredShipments = useMemo(
    () => customerDeliveries.filter((d) => d.status === 'delivered'),
    [customerDeliveries]
  );

  const totalSpent = useMemo(
    () => customerDeliveries.reduce((sum, d) => sum + (d.paidAmount || 0), 0),
    [customerDeliveries]
  );

  const recentShipments = useMemo(
    () => [...customerDeliveries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [customerDeliveries]
  );

  // Mock spending by month (last 6 months)
  const spendingByMonth = useMemo(() => {
    const now = new Date();
    const months: { month: string; spent: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = date.toLocaleString('default', { month: 'short' });
      const monthDeliveries = customerDeliveries.filter((d) => {
        const dDate = new Date(d.createdAt);
        return dDate.getMonth() === date.getMonth() && dDate.getFullYear() === date.getFullYear();
      });
      const spent = monthDeliveries.reduce((s, d) => s + (d.paidAmount || 0), 0);
      months.push({ month: monthLabel, spent: spent || Math.floor(Math.random() * 3000 + 500) });
    }
    return months;
  }, [customerDeliveries]);

  const today = new Date().toLocaleDateString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const firstName = currentUser?.name?.split(' ')[0] || 'Customer';

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="relative">
        <div className="absolute -top-10 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 opacity-10 blur-3xl pointer-events-none" />
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Active Shipments"
          value={activeShipments.length.toString()}
          icon={Package}
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Delivered"
          value={deliveredShipments.length.toString()}
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
        <KpiCard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={DollarSign}
          iconColor="text-orange-600"
        />
        <KpiCard
          title="Avg Delivery Time"
          value="3.2"
          suffix=" days"
          icon={Clock}
          iconColor="text-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted cursor-pointer"
            onClick={() => setDashboardTab('deliveries')}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/50">
              <Plus className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">New Shipment</p>
              <p className="text-xs text-muted-foreground">Create a delivery request</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
          <button
            className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted cursor-pointer"
            onClick={() => setDashboardTab('tracking')}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/50">
              <Search className="h-4 w-4 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Track a Parcel</p>
              <p className="text-xs text-muted-foreground">Look up your shipment</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
          <button
            className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted cursor-pointer"
            onClick={() => setDashboardTab('sourcing')}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50">
              <Truck className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Request Sourcing</p>
              <p className="text-xs text-muted-foreground">Source products from SA</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        </div>
      </div>

      {/* Recent Shipments + Spending Chart */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Shipments */}
        <div>
          <SectionHeader title="Recent Shipments" description="Your latest delivery activity" />
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Tracking #</TableHead>
                    <TableHead className="hidden text-xs sm:table-cell">Route</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="hidden text-xs md:table-cell">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentShipments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        No shipments yet
                      </TableCell>
                    </TableRow>
                  )}
                  {recentShipments.map((d) => (
                    <TableRow key={d.id} className="cursor-pointer">
                      <TableCell className="max-w-[130px] truncate font-mono text-xs">
                        {d.trackingNumber}
                      </TableCell>
                      <TableCell className="hidden max-w-[120px] truncate text-xs sm:table-cell">
                        {d.pickup.city} → {d.destination.city}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${statusColors[d.status] || ''}`}
                        >
                          {statusLabels[d.status] || d.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-xs md:table-cell">
                        {d.quotedAmount ? formatCurrency(d.quotedAmount) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Spending Overview */}
        <div>
          <SectionHeader title="Spending Overview" description="Your monthly delivery spend" />
          <div className="rounded-xl border border-border/50 bg-card/50 p-4">
            <ChartContainer config={spendingChartConfig} className="h-[220px] sm:h-[260px] lg:h-[280px] w-full">
              <BarChart data={spendingByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v: number) => `M${v}`}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="spent"
                  fill="#16a34a"
                  opacity={0.85}
                  radius={[4, 4, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Monthly Spending Trend */}
      <div>
        <SectionHeader title="Monthly Spending Trend" description="Your spending over the last 6 months" />
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          <ChartContainer config={spendingTrendChartConfig} className="h-[220px] sm:h-[260px] lg:h-[280px] w-full">
            <LineChart data={customerSpendingTrend} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="fillSpendingTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v: number) => `M${v}`}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                activeDot={{ r: 6, fill: '#14b8a6' }}
                fill="url(#fillSpendingTrend)"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

// ============ Driver Overview ============
function DriverOverview() {
  const { currentUser } = useAuthStore();

  const today = new Date().toLocaleDateString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const firstName = currentUser?.name?.split(' ')[0] || 'Driver';

  // Compute driver stats from actual delivery data
  const myDeliveries = useMemo(
    () => deliveries.filter((d) => d.driverId === currentUser?.id),
    [currentUser]
  );

  const todayStr = new Date().toDateString();
  const todayJobs = useMemo(
    () => myDeliveries.filter((d) => {
      const createdToday = new Date(d.createdAt).toDateString() === todayStr;
      const isActive = !['delivered', 'cancelled', 'returned'].includes(d.status);
      return createdToday || (isActive && d.status !== 'delivered');
    }).length,
    [myDeliveries, todayStr]
  );

  const completedThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    return myDeliveries.filter((d) => d.status === 'delivered' && new Date(d.actualDelivery || d.updatedAt).getTime() > weekAgo).length;
  }, [myDeliveries]);

  const monthlyEarnings = useMemo(() => {
    const monthAgo = Date.now() - 30 * 86400000;
    const total = myDeliveries
      .filter((d) => d.status === 'delivered' && new Date(d.actualDelivery || d.updatedAt).getTime() > monthAgo)
      .reduce((sum, d) => sum + (d.quotedAmount || 0), 0);
    return `M${total.toLocaleString()}`;
  }, [myDeliveries]);

  const avgRating = useMemo(() => {
    const rated = myDeliveries.filter((d) => d.rating);
    if (rated.length === 0) return 0;
    return (rated.reduce((sum, d) => sum + Number(d.rating || 0), 0) / rated.length).toFixed(1);
  }, [myDeliveries]);

  // Active deliveries (not delivered/cancelled/returned)
  const activeDeliveries = useMemo(
    () => myDeliveries.filter((d) => !['delivered', 'cancelled', 'returned'].includes(d.status)).slice(0, 5),
    [myDeliveries]
  );

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="relative">
        <div className="absolute -top-10 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 opacity-10 blur-3xl pointer-events-none" />
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {firstName}!</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Today&apos;s Jobs"
          value={todayJobs.toString()}
          icon={ClipboardCheck}
          iconColor="text-orange-600"
        />
        <KpiCard
          title="Completed This Week"
          value={completedThisWeek.toString()}
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
        <KpiCard
          title="This Month&apos;s Earnings"
          value={monthlyEarnings}
          icon={DollarSign}
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Rating"
          value={avgRating.toString()}
          icon={Star}
          iconColor="text-yellow-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted cursor-pointer">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/50">
              <Truck className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Update Status</p>
              <p className="text-xs text-muted-foreground">Update delivery progress</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
          <button className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3 text-left transition-colors hover:bg-muted cursor-pointer">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-950/50">
              <Phone className="h-4 w-4 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Contact Dispatcher</p>
              <p className="text-xs text-muted-foreground">Message or call dispatch</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        </div>
      </div>

      {/* Today's Deliveries */}
      <div>
        <SectionHeader title="Today&apos;s Assigned Deliveries" description="Deliveries assigned to you" />
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Tracking #</TableHead>
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="hidden text-xs sm:table-cell">Route</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                      No deliveries assigned for today
                    </TableCell>
                  </TableRow>
                ) : (
                  activeDeliveries.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="max-w-[130px] truncate font-mono text-xs">
                        {d.trackingNumber}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate text-xs">
                        {d.customerName}
                      </TableCell>
                      <TableCell className="hidden max-w-[120px] truncate text-xs sm:table-cell">
                        {d.pickup.city} → {d.destination.city}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${statusColors[d.status] || ''}`}
                        >
                          {statusLabels[d.status] || d.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* This Week's Earnings */}
      <div>
        <SectionHeader
          title="This Week&apos;s Earnings"
          description="Daily breakdown for the current week"
          action={
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              M3,430 <span className="text-xs font-normal text-muted-foreground">total</span>
            </span>
          }
        />
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          <ChartContainer config={weeklyEarningsChartConfig} className="h-[220px] sm:h-[260px] lg:h-[280px] w-full">
            <BarChart data={weeklyEarnings} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v: number) => `M${v}`}
                className="text-xs"
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => [`M${value}`, 'Earnings']} />}
              />
              <Bar
                dataKey="earnings"
                fill="url(#fillEarnings)"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

// ============ Company (Staff) Overview ============

const pipelineData = [
  { status: 'Pending', count: 45, color: 'bg-slate-400', icon: Clock },
  { status: 'Quoted', count: 28, color: 'bg-blue-400', icon: FileText },
  { status: 'Collected', count: 32, color: 'bg-amber-400', icon: Package },
  { status: 'In Transit', count: 67, color: 'bg-primary', icon: Truck },
  { status: 'At Border', count: 18, color: 'bg-violet-400', icon: Shield },
  { status: 'Delivered', count: 310, color: 'bg-orange-500', icon: CheckCircle2 },
];

const pipelineTotal = pipelineData.reduce((sum, item) => sum + item.count, 0);

function CompanyOverview() {
  const { selectDelivery, setDashboardTab } = useNavStore();

  const recentDeliveries = useMemo(() => deliveries.slice(0, 5), []);
  const totalDrivers = analyticsData.activeDrivers + 18;

  const handleDeliveryClick = (delivery: Delivery) => {
    selectDelivery(delivery.id);
    setDashboardTab('deliveries');
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(analyticsData.totalRevenue)}
          growth={analyticsData.revenueGrowth}
          icon={DollarSign}
        />
        <KpiCard
          title="Total Deliveries"
          value={analyticsData.totalDeliveries.toLocaleString()}
          growth={analyticsData.deliveriesGrowth}
          icon={Package}
          pulse
        />
        <KpiCard
          title="On-Time Rate"
          value={`${analyticsData.onTimeRate}%`}
          growth={analyticsData.onTimeGrowth}
          icon={Clock}
        />
        <KpiCard
          title="Active Drivers"
          value={`${analyticsData.activeDrivers}/${totalDrivers}`}
          growth={5.3}
          icon={Users}
        />
      </div>

      {/* Delivery Status Distribution Bar */}
      <div>
        <SectionHeader title="Delivery Status Distribution" description="Current shipment status breakdown" />
        <div className="space-y-3">
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted flex">
            {(() => {
              const statusCounts: Record<string, number> = {};
              deliveries.forEach((d) => {
                statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
              });
              const total = deliveries.length;
              const colorMap: Record<string, string> = {
                delivered: '#22c55e',
                in_transit: '#06b6d4',
                at_border: '#f59e0b',
                collected: '#14b8a6',
              };
              const labelMap: Record<string, string> = {
                delivered: 'Delivered',
                in_transit: 'In Transit',
                at_border: 'At Border',
                collected: 'Collected',
              };
              const orderedStatuses = ['delivered', 'in_transit', 'at_border', 'collected'];
              const segments = orderedStatuses.map((s) => ({
                status: s,
                label: labelMap[s],
                count: statusCounts[s] || 0,
                color: colorMap[s],
                pct: total > 0 ? ((statusCounts[s] || 0) / total) * 100 : 0,
              }));
              const otherCount = total - segments.reduce((sum, seg) => sum + seg.count, 0);
              const otherPct = total > 0 ? (otherCount / total) * 100 : 0;
              return (
                <>
                  {segments.map((seg) => (
                    <div
                      key={seg.status}
                      className="h-full transition-all"
                      style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                    />
                  ))}
                  {otherPct > 0 && (
                    <div
                      className="h-full transition-all"
                      style={{ width: `${otherPct}%`, backgroundColor: '#94a3b8' }}
                    />
                  )}
                </>
              );
            })()}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {(() => {
              const statusCounts: Record<string, number> = {};
              deliveries.forEach((d) => {
                statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
              });
              const total = deliveries.length;
              const entries = [
                { label: 'Delivered', count: statusCounts['delivered'] || 0, color: '#22c55e' },
                { label: 'In Transit', count: statusCounts['in_transit'] || 0, color: '#06b6d4' },
                { label: 'At Border', count: statusCounts['at_border'] || 0, color: '#f59e0b' },
                { label: 'Collected', count: statusCounts['collected'] || 0, color: '#14b8a6' },
              ];
              const otherCount = total - entries.reduce((sum, e) => sum + e.count, 0);
              return (
                <>
                  {entries.map((e) => (
                    <span key={e.label} className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                      {e.label} {total > 0 ? Math.round((e.count / total) * 100) : 0}%
                    </span>
                  ))}
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                    Other {total > 0 ? Math.round((otherCount / total) * 100) : 0}%
                  </span>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Middle Row: Revenue Chart + Status Pie */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Revenue & Deliveries Combo Chart */}
        <div>
          <SectionHeader title="Revenue & Deliveries" description="Monthly performance over the last 12 months" />
          <div className="rounded-xl border border-border/50 bg-card/50 p-4">
            <ChartContainer config={revenueChartConfig} className="h-[220px] sm:h-[260px] lg:h-[280px] w-full">
              <AreaChart data={analyticsData.revenueByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v: number) => `M${(v / 1000).toFixed(0)}k`}
                  className="text-xs"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fill="url(#fillRevenue)"
                />
                <Bar
                  yAxisId="right"
                  dataKey="deliveries"
                  fill="#14b8a6"
                  opacity={0.7}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Delivery Status Breakdown */}
        <div>
          <SectionHeader title="Delivery Status Breakdown" description="Current deliveries by status" />
          <div className="rounded-xl border border-border/50 bg-card/50 p-4">
            <ChartContainer config={statusChartConfig} className="mx-auto h-[220px] sm:h-[260px] lg:h-[280px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                <Pie
                  data={analyticsData.deliveriesByStatus}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="count"
                  nameKey="status"
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {analyticsData.deliveriesByStatus.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={PIE_COLORS[entry.status] || '#94a3b8'}
                    />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" className="flex-wrap gap-x-3 gap-y-1" />}
                />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: 3 Columns */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {/* Recent Deliveries */}
        <div>
          <SectionHeader title="Recent Deliveries" description="Latest delivery activity" />
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Tracking #</TableHead>
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="hidden text-xs sm:table-cell">Route</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDeliveries.map((d) => (
                    <TableRow
                      key={d.id}
                      className={`cursor-pointer border-l-2 ${d.status === 'delivered' ? 'border-l-orange-500' : d.status === 'in_transit' ? 'border-l-orange-500' : d.status === 'cancelled' ? 'border-l-red-500' : d.status === 'returned' ? 'border-l-rose-400' : d.status === 'at_border' ? 'border-l-orange-400' : 'border-l-blue-400'}`}
                      onClick={() => handleDeliveryClick(d)}
                    >
                      <TableCell className="max-w-[110px] truncate font-mono text-xs">
                        {d.trackingNumber}
                      </TableCell>
                      <TableCell className="max-w-[100px] truncate text-xs">
                        {d.customerName}
                      </TableCell>
                      <TableCell className="hidden max-w-[100px] truncate text-xs sm:table-cell">
                        {d.pickup.city} → {d.destination.city}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${statusColors[d.status] || ''}`}
                        >
                          {statusLabels[d.status] || d.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Top Routes */}
        <div>
          <SectionHeader title="Top Routes" description="Most active delivery corridors" icon={MapPin} />
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {analyticsData.topRoutes.map((route) => {
              const maxCount = analyticsData.topRoutes[0].count;
              const pct = (route.count / maxCount) * 100;
              return (
                <div key={route.route} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 font-medium truncate max-w-[180px]">
                      <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                      {route.route}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {route.count} trips
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-16 text-right shrink-0">
                      {formatCurrency(route.revenue)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Utilization */}
        <div>
          <SectionHeader title="Fleet Utilization" description="Vehicle usage by type" icon={Truck} />
          <div className="space-y-5">
              {analyticsData.fleetUtilization.map((fleet) => {
              const pct = Math.round((fleet.inUse / fleet.total) * 100);
              return (
                <div key={fleet.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{fleet.type}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-primary shadow-[0_0_8px_oklch(0.42_0.14_155/0.25)] rounded-sm px-1.5 py-0.5">
                      {pct}%
                    </span>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                    <div
                      className="absolute inset-y-0 rounded-full bg-amber-400 transition-all"
                      style={{
                        left: `${pct}%`,
                        width: `${Math.round((fleet.maintenance / fleet.total) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
                      Active: {fleet.inUse}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                      Maintenance: {fleet.maintenance}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/30" />
                      Available: {fleet.available}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Radar */}
      <div>
        <SectionHeader title="Performance Radar" description="Key metrics at a glance" />
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          <ChartContainer config={performanceRadarConfig} className="mx-auto h-[220px] sm:h-[260px] lg:h-[280px] w-full">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceRadarData}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis
                dataKey="metric"
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                className="text-xs"
              />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <SectionHeader title="Activity Feed" description="Recent events and notifications" />
        <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-1">
          {notifications.slice(0, 6).map((notif, idx) => {
            const notifBorder = notif.type === 'delivery_update' ? 'border-l-[3px] border-l-orange-500' : notif.type === 'alert' ? 'border-l-[3px] border-l-amber-500' : 'border-l-[3px] border-l-blue-400 dark:border-l-blue-500';
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05, ease: 'easeOut' }}
                className={`flex items-start gap-3 rounded-lg p-2.5 ${notifBorder} transition-all duration-200 hover:bg-muted/40 hover:pl-3.5`}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  {notifIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium leading-tight truncate">{notif.title}</p>
                    <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(notif.createdAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500 animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Delivery Pipeline */}
      <div>
        <SectionHeader title="Delivery Pipeline" description="Shipment status distribution across all stages" icon={ClipboardCheck} />
        <div className="flex gap-3 overflow-x-auto pb-2">
          {pipelineData.map((item, idx) => (
            <motion.div
              key={item.status}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.07, ease: 'easeOut' }}
              className="flex-shrink-0 w-[110px] sm:w-[140px] rounded-lg border p-2.5 sm:p-3 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full ${item.color} text-white`}>
                  <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground leading-tight">{item.status}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{item.count}</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all`}
                  style={{ width: `${item.count / pipelineTotal * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div>
        <SectionHeader
          title="Live Activity Feed"
          description="Real-time operations across all routes"
          action={
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
              <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-300 dark:text-orange-400 dark:border-orange-700">
                Live
              </Badge>
            </div>
          }
        />
        <div className="max-h-48 sm:max-h-64 overflow-y-auto space-y-1">
          {liveActivities.map((activity, idx) => {
            const colors = activityTypeColors[activity.type] || activityTypeColors.system;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04, ease: 'easeOut' }}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 ${colors.border} transition-all duration-200 hover:bg-muted/40 hover:pl-4`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colors.bg}`}>
                  <LiveActivityIcon iconName={activity.icon} className={colors.text} />
                </div>
                <p className="flex-1 text-sm leading-tight truncate min-w-0">{activity.message}</p>
                <span className="text-[11px] text-muted-foreground shrink-0">{activity.time}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ Sourcing Agent Overview ============
const sourcingStatusConfig: Record<SourcingStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  quoted: { label: 'Quoted', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  purchased: { label: 'Purchased', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  delivered: { label: 'Delivered', color: 'bg-primary/10 text-primary' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

function SourcingAgentOverview() {
  const currentUser = useAuthStore(s => s.currentUser);
  const setDashboardTab = useNavStore(s => s.setDashboardTab);

  const activeRequests = sourcingRequests.filter((r) => r.status === 'pending' || r.status === 'quoted');

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const completedThisMonth = sourcingRequests.filter(
    (r) => r.status === 'delivered' && r.createdAt >= thisMonthStart
  );

  const totalValueQuoted = sourcingRequests
    .filter((r) => r.status === 'accepted')
    .reduce((sum, r) => sum + (r.quotedPrice ?? 0), 0);

  const recentRequests = [...sourcingRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {currentUser?.name?.split(' ')[0] || 'Agent'}!
        </h1>
        <p className="text-muted-foreground">Here&apos;s your sourcing dashboard for today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Active Requests - emerald */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Active Requests</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">{activeRequests.length}</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <ClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <span className="text-orange-600 dark:text-orange-400">
              {activeRequests.filter((r) => r.status === 'pending').length} pending
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-orange-600 dark:text-orange-400">
              {activeRequests.filter((r) => r.status === 'quoted').length} quoted
            </span>
          </div>
        </div>

        {/* Completed This Month - teal */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Completed This Month</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">{completedThisMonth.length}</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 dark:text-orange-300" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-orange-500 dark:text-orange-300" />
            <span className="text-orange-500 dark:text-orange-300">This month</span>
          </div>
        </div>

        {/* Total Value Quoted - primary */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Total Value Quoted</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">{formatCurrency(totalValueQuoted)}</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">For accepted requests</div>
        </div>

        {/* Average Response Time - amber */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">2.4 hrs</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ArrowUpRight className="h-3.5 w-3.5 text-orange-600" />
            <span className="text-orange-600">-12%</span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="bg-green-600 text-white hover:bg-green-700" onClick={() => setDashboardTab('sourcing')}>
          <Plus className="mr-2 h-4 w-4" />
          New Sourcing Request
        </Button>
        <Button variant="outline" onClick={() => setDashboardTab('sourcing')}>
          <Clock className="mr-2 h-4 w-4" />
          View Pending Requests
        </Button>
        <Button variant="outline" onClick={() => setDashboardTab('sourcing')}>
          <Search className="mr-2 h-4 w-4" />
          Search Products
        </Button>
      </div>

      {/* Recent Sourcing Requests Table */}
      <div>
        <SectionHeader title="Recent Sourcing Requests" description="Your last 5 sourcing requests" />
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Quoted Price</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((req) => (
                <TableRow key={req.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{req.productName}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{req.customerName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{req.customerName}</TableCell>
                  <TableCell>
                    <Badge className={`border-0 text-[11px] ${sourcingStatusConfig[req.status].color}`} variant="secondary">
                      {sourcingStatusConfig[req.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{req.location}</TableCell>
                  <TableCell className="hidden lg:table-cell text-right font-medium">
                    {req.quotedPrice ? `M${req.quotedPrice.toLocaleString()}` : '—'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                    {timeAgo(req.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
              {recentRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No sourcing requests yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// ============ Trailer Owner Overview ============
function TrailerOwnerOverview() {
  const { currentUser } = useAuthStore();

  const myTrailers = useMemo(() => vehicles.filter((v) => v.type === 'trailer'), []);
  const activeHires = useMemo(() => myTrailers.filter((v) => v.status === 'in_use'), []);
  const utilizationRate = myTrailers.length > 0
    ? Math.round((activeHires.length / myTrailers.length) * 100)
    : 0;

  const revenueData = [
    { month: 'Jul', revenue: 12 },
    { month: 'Aug', revenue: 18 },
    { month: 'Sep', revenue: 22 },
    { month: 'Oct', revenue: 15 },
    { month: 'Nov', revenue: 28 },
    { month: 'Dec', revenue: 45 },
  ];

  const vehicleStatusColor: Record<string, string> = {
    available: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    in_use: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    maintenance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    out_of_service: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">{currentUser?.name?.split(' ')[0] || 'Owner'}</span>!
        </h1>
        <p className="text-muted-foreground">Here&apos;s your trailer fleet overview for today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* My Trailers */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">My Trailers</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">{myTrailers.length}</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
            {activeHires.length} in use
          </div>
        </div>

        {/* Active Hires */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Active Hires</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">{activeHires.length}</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 dark:text-orange-300" />
            </div>
          </div>
          <div className="mt-2 text-xs text-orange-500 dark:text-orange-300">
            Currently deployed
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Monthly Revenue</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">M45,200</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-orange-600" />
            <span className="text-orange-600">+12%</span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </div>

        {/* Utilization Rate */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Utilization Rate</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">{utilizationRate}%</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            {myTrailers.length - activeHires.length} available
          </div>
        </div>
      </div>

      {/* Trailers Table + Revenue Chart */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
        {/* My Trailers Table */}
        <div className="lg:col-span-3">
          <SectionHeader title="My Trailers" description="All trailers in your fleet" />
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plate Number</TableHead>
                    <TableHead className="hidden sm:table-cell">Make / Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Assigned Driver</TableHead>
                    <TableHead className="hidden lg:table-cell">Current Route</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTrailers.map((v) => (
                    <TableRow key={v.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium font-mono text-sm">{v.plateNumber}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{v.make} {v.model}</TableCell>
                      <TableCell>
                        <Badge className={`border-0 text-[11px] ${vehicleStatusColor[v.status] || ''}`} variant="secondary">
                          {v.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{v.assignedDriverName || '—'}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">Maseru → Leribe</TableCell>
                    </TableRow>
                  ))}
                  {myTrailers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No trailers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2">
          <SectionHeader title="Revenue Trend" description="Monthly revenue over last 6 months" />
          <div className="rounded-xl border border-border/50 bg-card/50 p-4">
            <ChartContainer config={trailerRevenueChartConfig} className="h-[220px] sm:h-[260px] lg:h-[280px] w-full">
              <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillTrailerRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  tickFormatter={(v) => `M${v}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="revenue"
                  fill="url(#fillTrailerRevenue)"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Warehouse Partner Overview ============
function WarehousePartnerOverview() {
  const { currentUser } = useAuthStore();

  const pendingDispatch = useMemo(
    () => deliveries.filter((d) => d.status === 'at_warehouse'),
    []
  );

  const warehouseActivities = [
    { id: 1, type: 'received', message: 'Package #SF2025001842LS received from Johannesburg', time: '12 min ago', color: 'bg-orange-500' },
    { id: 2, type: 'dispatched', message: 'Shipment #SF2025001735LS dispatched to Mafeteng', time: '45 min ago', color: 'bg-orange-400' },
    { id: 3, type: 'alert', message: 'Storage zone B nearing 90% capacity', time: '1h ago', color: 'bg-amber-500' },
    { id: 4, type: 'inspection', message: 'Quality inspection completed for 8 packages', time: '2h ago', color: 'bg-orange-500' },
    { id: 5, type: 'temperature', message: 'Cold storage temperature check: 2.4°C (normal)', time: '3h ago', color: 'bg-orange-400' },
    { id: 6, type: 'inventory', message: 'Weekly inventory count completed — 3,200 packages', time: '5h ago', color: 'bg-primary' },
  ];

  const activityTypeIcon: Record<string, React.ReactNode> = {
    received: <Package className="h-3.5 w-3.5" />,
    dispatched: <Truck className="h-3.5 w-3.5" />,
    alert: <AlertTriangle className="h-3.5 w-3.5" />,
    inspection: <CheckCircle2 className="h-3.5 w-3.5" />,
    temperature: <Info className="h-3.5 w-3.5" />,
    inventory: <ClipboardCheck className="h-3.5 w-3.5" />,
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">{currentUser?.name?.split(' ')[0] || 'Partner'}</span>!
        </h1>
        <p className="text-muted-foreground">Here&apos;s your warehouse operations overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Storage Capacity */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Storage Capacity</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">71%</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
            3,200 / 4,500 packages
          </div>
        </div>

        {/* Pending Dispatch */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Pending Dispatch</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">{pendingDispatch.length}</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            Awaiting processing
          </div>
        </div>

        {/* Today's Inbound */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Today&apos;s Inbound</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">23</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 dark:text-orange-300" />
            </div>
          </div>
          <div className="mt-2 text-xs text-orange-500 dark:text-orange-300">
            packages received
          </div>
        </div>

        {/* Outbound Today */}
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:bg-muted/70 hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Outbound Today</p>
              <p className="text-xl font-bold tracking-tight sm:text-2xl">18</p>
            </div>
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-background/80">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          </div>
          <div className="mt-2 text-xs text-primary">
            shipments dispatched
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="bg-green-600 text-white hover:bg-green-700">
          <Package className="mr-2 h-4 w-4" />
          Receive Package
        </Button>
        <Button variant="outline">
          <Truck className="mr-2 h-4 w-4" />
          Process Dispatch
        </Button>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          View Inventory
        </Button>
      </div>

      {/* Warehouse Activity Feed */}
      <div>
        <SectionHeader title="Warehouse Activity" description="Recent warehouse operations" />
        <div className="space-y-3">
          {warehouseActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${activity.color}`}>
                {activityTypeIcon[activity.type] || <Info className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">{activity.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ Overview Tab (Router) ============
export function OverviewTab() {
  const { currentUser } = useAuthStore();
  const isCustomer = currentUser?.role === 'customer';
  const isDriver = currentUser?.role === 'driver';
  const isSourcingAgent = currentUser?.role === 'sourcing_agent';
  const isTrailerOwner = currentUser?.role === 'trailer_owner';
  const isWarehousePartner = currentUser?.role === 'warehouse_partner';

  if (isCustomer) return <CustomerOverview />;
  if (isDriver) return <DriverOverview />;
  if (isSourcingAgent) return <SourcingAgentOverview />;
  if (isTrailerOwner) return <TrailerOwnerOverview />;
  if (isWarehousePartner) return <WarehousePartnerOverview />;
  return <CompanyOverview />;
}