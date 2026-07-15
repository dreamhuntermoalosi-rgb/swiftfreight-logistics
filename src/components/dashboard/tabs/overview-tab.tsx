'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  MessageSquare,
  CreditCard,
  Shield,
  ArrowUpRight,
  Plus,
  Search,
  Phone,
  ClipboardCheck,
  CheckCircle2,
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
import { analyticsData, deliveries, notifications, statusLabels, statusColors, customers } from '@/lib/mock-data';
import { useAuthStore, useNavStore } from '@/lib/store';
import type { Delivery } from '@/lib/types';

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
}) {
  const isPositive = growth !== undefined && growth >= 0;
  return (
    <Card className="relative overflow-hidden border-l-4 border-l-primary/30 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-300 dark:hover:border-emerald-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">
              {prefix}{value}{suffix}
            </p>
          </div>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 ${iconBg}`}>
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
    </div>
  );
}

// ============ Company (Staff) Overview ============
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
          <div className="max-h-64 overflow-y-auto space-y-3">
            {notifications.slice(0, 6).map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50"
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
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                )}
              </div>
            ))}
          </div>
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

  if (isCustomer) return <CustomerOverview />;
  if (isDriver) return <DriverOverview />;
  return <CompanyOverview />;
}