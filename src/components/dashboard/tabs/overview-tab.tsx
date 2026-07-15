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
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { analyticsData, deliveries, notifications, statusLabels, statusColors } from '@/lib/mock-data';
import { useNavStore } from '@/lib/store';
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
}: {
  title: string;
  value: string;
  growth: number;
  icon: React.ComponentType<{ className?: string }>;
  prefix?: string;
  suffix?: string;
  isNegative?: boolean;
}) {
  const isPositive = growth >= 0;
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">
              {prefix}{value}{suffix}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className={`h-3.5 w-3.5 ${isNegative ? 'text-red-500' : 'text-emerald-600'}`} />
          )}
          <span
            className={`text-sm font-medium ${
              isNegative ? (isPositive ? 'text-red-500' : 'text-emerald-600') : 'text-emerald-600'
            }`}
          >
            {isPositive ? '+' : ''}{growth}%
          </span>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
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

// ============ Overview Tab ============
export function OverviewTab() {
  const { selectDelivery, setDashboardTab } = useNavStore();

  const recentDeliveries = useMemo(() => deliveries.slice(0, 5), []);
  const totalDrivers = analyticsData.activeDrivers + 18; // 60 total

  const handleDeliveryClick = (delivery: Delivery) => {
    selectDelivery(delivery.id);
    setDashboardTab('deliveries');
  };

  return (
    <div className="space-y-6">
      {/* ── Top KPI Cards ── */}
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

      {/* ── Middle Row: Revenue Chart + Status Pie ── */}
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

      {/* ── Bottom Row: 3 Columns ── */}
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

      {/* ── Activity Feed ── */}
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