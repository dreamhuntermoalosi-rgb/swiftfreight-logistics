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
  TrendingDown,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { analyticsData, deliveries, notifications, statusLabels, statusColors, customers, sourcingRequests } from '@/lib/mock-data';
import { useAuthStore, useNavStore } from '@/lib/store';
import type { Delivery, SourcingStatus } from '@/lib/types';

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

const spendingChartConfig: ChartConfig = {
  spent: { label: 'Spent (M)', color: '#16a34a' },
};

const spendingTrendChartConfig: ChartConfig = {
  amount: { label: 'Amount (M)', color: '#14b8a6' },
};

const weeklyEarningsChartConfig: ChartConfig = {
  earnings: { label: 'Earnings (M)', color: '#16a34a' },
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
  delivery: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-l-[3px] border-l-emerald-500' },
  alert: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-l-[3px] border-l-amber-500' },
  payment: { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-600 dark:text-teal-400', border: 'border-l-[3px] border-l-teal-500' },
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
      return <Truck className="h-4 w-4 text-emerald-600" />;
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

// ============ KPI Card ============
function KpiCard({
  title,
  value,
  growth,
  icon: Icon,
  prefix = '',
  suffix = '',
  isNegative = false,
  iconBg = 'bg-emerald-50 dark:bg-emerald-950/50',
  iconColor = 'text-emerald-600',
  pulse = false,
}: {
  title: string;
  value: string;
  growth?: number;
  icon: React.ComponentType<{ className?: string }>;
  prefix?: string;
  suffix?: string;
  isNegative?: boolean;
  iconBg?: string;
  iconColor?: string;
  pulse?: boolean;
}) {
  const isPositive = growth !== undefined && growth >= 0;
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] hover:border-emerald-300 dark:hover:border-emerald-700">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-teal-500" />
      <CardContent className="p-4 pt-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              {title}
              {pulse && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
            </p>
            <p className="text-2xl font-bold tracking-tight">
              {prefix}{value}{suffix}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-teal-500/10">
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        {growth !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1 w-fit">
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className={`h-3.5 w-3.5 ${isNegative ? 'text-red-500' : 'text-emerald-600'}`} />
            )}
            <span
              className={`text-sm font-semibold ${
                isNegative ? (isPositive ? 'text-red-500' : 'text-emerald-600') : 'text-emerald-600'
              }`}
            >
              {isPositive ? '+' : ''}{growth}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============ Loading Skeleton ============
function OverviewLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="mb-2 h-8 w-32" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-5 w-40" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-5 w-40" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
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
    const months = [];
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
        <div className="absolute -top-10 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 opacity-10 blur-3xl pointer-events-none" />
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          title="Active Shipments"
          value={activeShipments.length.toString()}
          icon={Package}
          iconBg="bg-amber-50 dark:bg-amber-950/50"
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Delivered"
          value={deliveredShipments.length.toString()}
          icon={CheckCircle2}
          iconBg="bg-green-50 dark:bg-green-950/50"
          iconColor="text-green-600"
        />
        <KpiCard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={DollarSign}
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Avg Delivery Time"
          value="3.2"
          suffix=" days"
          icon={Clock}
          iconBg="bg-teal-50 dark:bg-teal-950/50"
          iconColor="text-teal-600"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-base font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card
            className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
            onClick={() => setDashboardTab('deliveries')}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                <Plus className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">New Shipment</p>
                <p className="text-xs text-muted-foreground">Create a delivery request</p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
            onClick={() => setDashboardTab('tracking')}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/50">
                <Search className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="font-medium">Track a Parcel</p>
                <p className="text-xs text-muted-foreground">Look up your shipment</p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
            onClick={() => setDashboardTab('sourcing')}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50">
                <Truck className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Request Sourcing</p>
                <p className="text-xs text-muted-foreground">Source products from SA</p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Shipments + Spending Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Shipments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Shipments</CardTitle>
            <CardDescription>Your latest delivery activity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
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
          </CardContent>
        </Card>

        {/* Spending Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Spending Overview</CardTitle>
            <CardDescription>Your monthly delivery spend</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={spendingChartConfig} className="h-[280px] w-full">
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
          </CardContent>
        </Card>
      </div>

      {/* Monthly Spending Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly Spending Trend</CardTitle>
          <CardDescription>Your spending over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={spendingTrendChartConfig} className="h-[260px] w-full">
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
        </CardContent>
      </Card>
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
        <div className="absolute -top-10 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 opacity-10 blur-3xl pointer-events-none" />
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {firstName}!</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          title="Today&apos;s Jobs"
          value={todayJobs.toString()}
          icon={ClipboardCheck}
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Completed This Week"
          value={completedThisWeek.toString()}
          icon={CheckCircle2}
          iconBg="bg-green-50 dark:bg-green-950/50"
          iconColor="text-green-600"
        />
        <KpiCard
          title="This Month&apos;s Earnings"
          value={monthlyEarnings}
          icon={DollarSign}
          iconBg="bg-amber-50 dark:bg-amber-950/50"
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Rating"
          value={avgRating.toString()}
          icon={Star}
          iconBg="bg-yellow-50 dark:bg-yellow-950/50"
          iconColor="text-yellow-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-base font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                <Truck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">Update Status</p>
                <p className="text-xs text-muted-foreground">Update delivery progress</p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/50">
                <Phone className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="font-medium">Contact Dispatcher</p>
                <p className="text-xs text-muted-foreground">Message or call dispatch</p>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Deliveries */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Today&apos;s Assigned Deliveries</CardTitle>
          <CardDescription>Deliveries assigned to you</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
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
        </CardContent>
      </Card>

      {/* This Week's Earnings */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">This Week&apos;s Earnings</CardTitle>
              <CardDescription>Daily breakdown for the current week</CardDescription>
            </div>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              M3,430 <span className="text-xs font-normal text-muted-foreground">total</span>
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={weeklyEarningsChartConfig} className="h-[240px] w-full">
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
        </CardContent>
      </Card>
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
  { status: 'Delivered', count: 310, color: 'bg-emerald-500', icon: CheckCircle2 },
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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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

      {/* Middle Row: Revenue Chart + Status Pie */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue & Deliveries Combo Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue & Deliveries</CardTitle>
            <CardDescription>Monthly performance over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[280px] w-full">
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
          </CardContent>
        </Card>

        {/* Delivery Status Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Delivery Status Breakdown</CardTitle>
            <CardDescription>Current deliveries by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className="mx-auto h-[280px] w-full">
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
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: 3 Columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Deliveries */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Deliveries</CardTitle>
            <CardDescription>Latest delivery activity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
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
                      className="cursor-pointer"
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
          </CardContent>
        </Card>

        {/* Top Routes */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Routes</CardTitle>
            <CardDescription>Most active delivery corridors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {analyticsData.topRoutes.map((route) => {
                const maxCount = analyticsData.topRoutes[0].count;
                const pct = (route.count / maxCount) * 100;
                return (
                  <div key={route.route} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 font-medium truncate max-w-[180px]">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {route.route}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {route.count} trips
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
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
          </CardContent>
        </Card>

        {/* Fleet Utilization */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Fleet Utilization</CardTitle>
            <CardDescription>Vehicle usage by type</CardDescription>
          </CardHeader>
          <CardContent>
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
                      <span className="text-sm text-muted-foreground">
                        {fleet.inUse}/{fleet.total} in use
                      </span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all"
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
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
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
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Activity Feed</CardTitle>
          <CardDescription>Recent events and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {notifications.slice(0, 6).map((notif, idx) => {
              const notifBorder = notif.type === 'delivery_update' ? 'border-l-[3px] border-l-emerald-500' : notif.type === 'alert' ? 'border-l-[3px] border-l-amber-500' : 'border-l-[3px] border-l-blue-400 dark:border-l-blue-500';
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
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Pipeline */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base">Delivery Pipeline</CardTitle>
          </div>
          <CardDescription>Shipment status distribution across all stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {pipelineData.map((item) => (
              <div
                key={item.status}
                className="flex-shrink-0 w-[140px] rounded-lg border p-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.color} text-white`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground leading-tight">{item.status}</span>
                </div>
                <p className="text-2xl font-bold">{item.count}</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all`}
                    style={{ width: `${item.count / pipelineTotal * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Live Activity Feed</CardTitle>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700">
              Live
            </Badge>
          </div>
          <CardDescription>Real-time operations across all routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[420px] overflow-y-auto space-y-1">
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
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Sourcing Agent Overview ============
const sourcingStatusConfig: Record<SourcingStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  quoted: { label: 'Quoted', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  purchased: { label: 'Purchased', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  delivered: { label: 'Delivered', color: 'bg-primary/10 text-primary' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

function SourcingAgentOverview() {
  const { currentUser, setDashboardTab } = useNavStore();

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Requests - emerald */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] hover:border-emerald-300 dark:hover:border-emerald-700">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                <p className="text-2xl font-bold tracking-tight">{activeRequests.length}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <ClipboardCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 w-fit">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {activeRequests.filter((r) => r.status === 'pending').length} pending
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {activeRequests.filter((r) => r.status === 'quoted').length} quoted
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Completed This Month - teal */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] hover:border-teal-300 dark:hover:border-teal-700">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-400" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Completed This Month</p>
                <p className="text-2xl font-bold tracking-tight">{completedThisMonth.length}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                <CheckCircle2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-900/20 px-2.5 py-1 w-fit">
              <TrendingUp className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">This month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Value Quoted - primary */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] hover:border-emerald-300 dark:hover:border-emerald-700">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-teal-500" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Value Quoted</p>
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(totalValueQuoted)}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-teal-500/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1 w-fit">
              <span className="text-xs text-muted-foreground">For accepted requests</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Response Time - amber */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] hover:border-amber-300 dark:hover:border-amber-700">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold tracking-tight">2.4 hrs</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 w-fit">
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600">-12%</span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Sourcing Requests</CardTitle>
          <CardDescription>Your last 5 sourcing requests</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Overview Tab (Router) ============
export function OverviewTab() {
  const { currentUser } = useAuthStore();
  const isCustomer = currentUser?.role === 'customer';
  const isDriver = currentUser?.role === 'driver';
  const isSourcingAgent = currentUser?.role === 'sourcing_agent';

  if (isCustomer) return <CustomerOverview />;
  if (isDriver) return <DriverOverview />;
  if (isSourcingAgent) return <SourcingAgentOverview />;
  return <CompanyOverview />;
}