'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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
  Star,
  Users,
  TrendingUp,
  Truck,
  ArrowUpDown,
  Calendar,
  BarChart3,
  Target,
  Heart,
  Wrench,
  ChevronUp,
  ChevronDown,
  Clock,
  MapPin,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  analyticsData,
  deliveries,
  drivers,
  customers,
  statusLabels,
  statusColors,
} from '@/lib/mock-data';


// ============ Chart Configs ============
const revenueAreaConfig: ChartConfig = {
  revenue: { label: 'Revenue (M)', color: '#16a34a' },
};

const deliveryVolumeConfig: ChartConfig = {
  deliveries: { label: 'Deliveries', color: '#14b8a6' },
};

const successRateConfig: ChartConfig = {
  onTimeRate: { label: 'On-Time Rate %', color: '#22c55e' },
};

const deliveryTimeConfig: ChartConfig = {
  count: { label: 'Deliveries', color: '#22c55e' },
};

const routeRevenueConfig: ChartConfig = {
  revenue: { label: 'Revenue (M)', color: '#10b981' },
};

const satisfactionConfig: ChartConfig = {
  satisfied: { label: 'Satisfied (4-5★)', color: '#22c55e' },
  neutral: { label: 'Neutral (3★)', color: '#f59e0b' },
  dissatisfied: { label: 'Dissatisfied (1-2★)', color: '#ef4444' },
};

const dayOfWeekConfig: ChartConfig = {
  deliveries: { label: 'Deliveries', color: '#16a34a' },
  avgTime: { label: 'Avg Time (days)', color: '#14b8a6' },
};

const crossBorderTrendConfig: ChartConfig = {
  crossBorder: { label: 'Cross-Border', color: '#10b981' },
  domestic: { label: 'Domestic', color: '#5eead4' },
};

// ============ Helpers ============
function formatCurrency(value: number) {
  return `M${value.toLocaleString()}`;
}

// Simulated on-time rate trend data
const onTimeTrend = [
  { month: 'Jan', rate: 89.2 },
  { month: 'Feb', rate: 90.1 },
  { month: 'Mar', rate: 88.5 },
  { month: 'Apr', rate: 91.3 },
  { month: 'May', rate: 92.0 },
  { month: 'Jun', rate: 91.8 },
  { month: 'Jul', rate: 93.2 },
  { month: 'Aug', rate: 93.8 },
  { month: 'Sep', rate: 92.5 },
  { month: 'Oct', rate: 93.1 },
  { month: 'Nov', rate: 94.0 },
  { month: 'Dec', rate: 94.6 },
];

// Customer satisfaction distribution
const satisfactionData = [
  { name: 'satisfied', value: 72 },
  { name: 'neutral', value: 20 },
  { name: 'dissatisfied', value: 8 },
];
const SAT_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

// Customer growth trend
const customerGrowth = [
  { month: 'Jan', customers: 198 },
  { month: 'Feb', customers: 210 },
  { month: 'Mar', customers: 225 },
  { month: 'Apr', customers: 238 },
  { month: 'May', customers: 252 },
  { month: 'Jun', customers: 261 },
  { month: 'Jul', customers: 274 },
  { month: 'Aug', customers: 285 },
  { month: 'Sep', customers: 290 },
  { month: 'Oct', revenue: 298, customers: 298 },
  { month: 'Nov', customers: 305 },
  { month: 'Dec', customers: 312 },
];

// Delivery performance by day of week
const dayOfWeekData = [
  { day: 'Monday', deliveries: 42, avgTime: 2.1 },
  { day: 'Tuesday', deliveries: 38, avgTime: 1.8 },
  { day: 'Wednesday', deliveries: 45, avgTime: 2.3 },
  { day: 'Thursday', deliveries: 51, avgTime: 1.9 },
  { day: 'Friday', deliveries: 58, avgTime: 2.5 },
  { day: 'Saturday', deliveries: 22, avgTime: 1.5 },
  { day: 'Sunday', deliveries: 8, avgTime: 1.2 },
];

// Border post performance data
const borderPosts = [
  { name: 'Maseru Bridge', totalCrossings: 145, avgWaitHours: 2.3, clearanceRate: 94, delays: 9 },
  { name: "Maputsoe (Ficksburg)", totalCrossings: 98, avgWaitHours: 3.1, clearanceRate: 88, delays: 12 },
  { name: 'Mokhotlong (Matatiele)', totalCrossings: 42, avgWaitHours: 4.5, clearanceRate: 76, delays: 10 },
  { name: "Qacha's Nek (Matatiele)", totalCrossings: 35, avgWaitHours: 3.8, clearanceRate: 82, delays: 6 },
  { name: 'Butha Buthe (Harrismith)', totalCrossings: 28, avgWaitHours: 2.8, clearanceRate: 89, delays: 3 },
];

// Cross-border vs domestic trend
const crossBorderTrend = [
  { month: 'Jan', crossBorder: 32, domestic: 45 },
  { month: 'Feb', crossBorder: 38, domestic: 42 },
  { month: 'Mar', crossBorder: 45, domestic: 48 },
  { month: 'Apr', crossBorder: 42, domestic: 51 },
  { month: 'May', crossBorder: 55, domestic: 47 },
  { month: 'Jun', crossBorder: 62, domestic: 53 },
  { month: 'Jul', crossBorder: 58, domestic: 49 },
];

// Company comparison data
const companyComparison = [
  { name: 'Mountain Express', deliveries: 245, revenue: 'M485,200', onTime: '94%', avgRating: 4.5 },
  { name: 'Lesotho Swift', deliveries: 178, revenue: 'M312,800', onTime: '89%', avgRating: 4.2 },
  { name: 'Highland Haulage', deliveries: 77, revenue: 'M145,600', onTime: '91%', avgRating: 4.4 },
];

// Maintenance schedule summary
const maintenanceSummary = [
  { vehicle: 'LP 234 AB 567 (Truck)', type: 'Truck', dueDate: '3 days', status: 'upcoming' },
  { vehicle: 'LP 456 AB 789 (Van)', type: 'Van', dueDate: '5 days', status: 'upcoming' },
  { vehicle: 'LP 789 CD 123 (Truck)', type: 'Truck', dueDate: '8 days', status: 'scheduled' },
  { vehicle: 'LP 321 DE 456 (Pickup)', type: 'Pickup', dueDate: '12 days', status: 'scheduled' },
  { vehicle: 'LP 654 FG 890 (Van)', type: 'Van', dueDate: 'Overdue', status: 'overdue' },
];

type DateRange = '7d' | '30d' | '90d' | '1y';

// ============ Sort helpers ============
type SortKey = 'name' | 'deliveries' | 'rating' | 'onTime';
type SortDir = 'asc' | 'desc';

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground/50" />;
  return sortDir === 'asc' ? (
    <ChevronUp className="ml-1 inline h-3 w-3 text-emerald-600" />
  ) : (
    <ChevronDown className="ml-1 inline h-3 w-3 text-emerald-600" />
  );
}

// ============ Reports Tab ============
export function ReportsTab() {
  const [dateRange, setDateRange] = useState<DateRange>('1y');
  const [sortKey, setSortKey] = useState<SortKey>('deliveries');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  // Top customers by spend
  const topCustomers = useMemo(
    () =>
      [...customers]
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 8),
    []
  );

  // Sorted driver performance
  const sortedDrivers = useMemo(() => {
    const arr = [...analyticsData.driverPerformance];
    arr.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return arr;
  }, [sortKey, sortDir]);

  // Revenue by route — computed from actual deliveries
  const deliveryRouteRevenue = useMemo(() => {
    const routeMap = new Map<string, number>();
    deliveries
      .filter((d) => d.status === 'delivered' && d.quotedAmount)
      .forEach((d) => {
        const route = `${d.pickup.city} → ${d.destination.city}`;
        routeMap.set(route, (routeMap.get(route) ?? 0) + d.quotedAmount!);
      });
    return [...routeMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([route, revenue]) => ({ route, revenue }));
  }, []);

  // Delivery time distribution — computed from delivered deliveries
  const deliveryTimeData = useMemo(() => {
    const buckets = [
      { label: '1 Day', min: 0, max: 1, color: '#22c55e' },
      { label: '2 Days', min: 1, max: 2, color: '#16a34a' },
      { label: '3–5 Days', min: 2, max: 5, color: '#14b8a6' },
      { label: '6–10 Days', min: 5, max: 10, color: '#f59e0b' },
      { label: '10+ Days', min: 10, max: Infinity, color: '#f97316' },
    ];
    return buckets.map((b) => {
      const count = deliveries.filter((d) => {
        if (d.status !== 'delivered' || !d.actualDelivery) return false;
        const created = new Date(d.createdAt).getTime();
        const delivered = new Date(d.actualDelivery).getTime();
        const days = Math.ceil((delivered - created) / (1000 * 60 * 60 * 24));
        return days > b.min && days <= b.max;
      }).length;
      return { label: b.label, count, color: b.color };
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Header with Date Range ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive performance insights and metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Executive Summary Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(analyticsData.totalRevenue)}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">+{analyticsData.revenueGrowth}%</span>
              <span className="text-xs text-muted-foreground">growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Deliveries</p>
                <p className="text-2xl font-bold tracking-tight">{analyticsData.totalDeliveries.toLocaleString()}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                <Package className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">+{analyticsData.deliveriesGrowth}%</span>
              <span className="text-xs text-muted-foreground">growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold tracking-tight">{analyticsData.avgRating}/5.0</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                <Star className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">+{analyticsData.avgRatingGrowth}</span>
              <span className="text-xs text-muted-foreground">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                <p className="text-2xl font-bold tracking-tight">72%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                <Heart className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">+4.2%</span>
              <span className="text-xs text-muted-foreground">vs last quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Section ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="relative overflow-hidden shadow-sm border">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-teal-400" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base">Revenue Trend</CardTitle>
            </div>
            <CardDescription>Monthly revenue over the past 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueAreaConfig} className="h-[260px] w-full">
              <AreaChart data={analyticsData.revenueByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenueArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v: number) => `M${(v / 1000).toFixed(0)}k`}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fill="url(#fillRevenueArea)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Delivery Volume */}
        <Card className="relative overflow-hidden shadow-sm border">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-teal-500" />
              <CardTitle className="text-base">Delivery Volume</CardTitle>
            </div>
            <CardDescription>Number of deliveries per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={deliveryVolumeConfig} className="h-[260px] w-full">
              <BarChart data={analyticsData.revenueByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="deliveries" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Delivery Success Rate */}
        <Card className="relative overflow-hidden shadow-sm border">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base">Delivery Success Rate</CardTitle>
            </div>
            <CardDescription>On-time delivery percentage trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={successRateConfig} className="h-[260px] w-full">
              <LineChart data={onTimeTrend} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <YAxis
                  domain={[85, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(v: number) => `${v}%`}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

      </div>

      {/* ── Driver Performance Table ── */}
      <Card className="relative overflow-hidden shadow-sm border">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base">Driver Performance</CardTitle>
          </div>
          <CardDescription>Top 10 drivers by performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs cursor-pointer select-none" onClick={() => toggleSort('name')}>
                    Name <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </TableHead>
                  <TableHead className="text-xs cursor-pointer select-none text-right" onClick={() => toggleSort('deliveries')}>
                    Deliveries <SortIcon col="deliveries" sortKey={sortKey} sortDir={sortDir} />
                  </TableHead>
                  <TableHead className="text-xs cursor-pointer select-none text-center" onClick={() => toggleSort('rating')}>
                    Rating <SortIcon col="rating" sortKey={sortKey} sortDir={sortDir} />
                  </TableHead>
                  <TableHead className="text-xs cursor-pointer select-none text-right" onClick={() => toggleSort('onTime')}>
                    On-Time % <SortIcon col="onTime" sortKey={sortKey} sortDir={sortDir} />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDrivers.map((driver, idx) => {
                  const isTop = idx < 3 && sortKey === 'deliveries' && sortDir === 'desc';
                  return (
                    <TableRow key={driver.name} className={isTop ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''}>
                      <TableCell className="text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {isTop && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                              {idx + 1}
                            </span>
                          )}
                          {driver.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-right font-mono">{driver.deliveries}</TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{driver.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        <span
                          className={`font-mono font-medium ${
                            driver.onTime >= 95
                              ? 'text-emerald-600'
                              : driver.onTime >= 90
                              ? 'text-amber-600'
                              : 'text-red-500'
                          }`}
                        >
                          {driver.onTime}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Fleet Performance + Customer Insights ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fleet Performance */}
        <Card className="relative overflow-hidden shadow-sm border">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base">Fleet Performance</CardTitle>
            </div>
            <CardDescription>Vehicle utilization and maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Utilization bars */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Vehicle Utilization by Type</h4>
              {analyticsData.fleetUtilization.map((fleet) => {
                const pct = Math.round((fleet.inUse / fleet.total) * 100);
                return (
                  <div key={fleet.type} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{fleet.type}</span>
                      <span className="text-muted-foreground">
                        {fleet.inUse}/{fleet.total} ({pct}%)
                      </span>
                    </div>
                    <Progress value={pct} className="h-2.5" />
                    <div className="flex gap-4 text-[11px] text-muted-foreground">
                      <span>Available: {fleet.available}</span>
                      <span>Maintenance: {fleet.maintenance}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Maintenance Schedule */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Maintenance Schedule</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {maintenanceSummary.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border p-2.5 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Wrench className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{item.vehicle}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 ml-2 text-[10px] ${
                        item.status === 'overdue'
                          ? 'bg-red-50 text-red-700'
                          : item.status === 'upcoming'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.dueDate}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Insights */}
        <Card className="relative overflow-hidden shadow-sm border">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base">Customer Insights</CardTitle>
            </div>
            <CardDescription>Top customers and satisfaction trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Satisfaction Pie */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-muted-foreground">Customer Satisfaction</h4>
              <ChartContainer config={satisfactionConfig} className="mx-auto h-[160px] w-full max-w-[260px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {satisfactionData.map((_, idx) => (
                      <Cell key={`sat-${idx}`} fill={SAT_COLORS[idx]} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            </div>

            {/* Top Customers */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-muted-foreground">Top Customers by Spend</h4>
              <div className="max-h-48 overflow-y-auto space-y-2.5">
                {topCustomers.map((customer, idx) => (
                  <div key={customer.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      {idx < 3 && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                          {idx + 1}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate">{customer.name}</p>
                        <p className="text-[11px] text-muted-foreground">{customer.totalShipments} shipments</p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono font-medium text-emerald-600">
                      {formatCurrency(customer.totalSpent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Revenue by Route + Delivery Time Distribution ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Route */}
        <Card className="relative overflow-hidden shadow-sm border">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base">Revenue by Route</CardTitle>
            </div>
            <CardDescription>Top 8 routes by delivered revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={routeRevenueConfig} className="h-[300px] w-full">
              <BarChart
                data={deliveryRouteRevenue}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="routeBarGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v: number) => `M${(v / 1000).toFixed(0)}k`} className="text-xs" />
                <YAxis
                  type="category"
                  dataKey="route"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={140}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="url(#routeBarGradient)" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Delivery Time Distribution */}
        <Card className="relative overflow-hidden shadow-sm border">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-base">Delivery Time Distribution</CardTitle>
            </div>
            <CardDescription>How quickly deliveries reach their destination</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={deliveryTimeConfig} className="h-[300px] w-full">
              <BarChart data={deliveryTimeData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={36}>
                  {deliveryTimeData.map((entry, idx) => (
                    <Cell key={`time-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Delivery Volume by Day of Week ── */}
      <Card className="relative overflow-hidden shadow-sm border">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-teal-400" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base">Delivery Volume by Day of Week</CardTitle>
          </div>
          <CardDescription>Average delivery count per day of the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={dayOfWeekConfig} className="h-[280px] w-full">
            <BarChart data={dayOfWeekData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="dayBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === 'deliveries') return [`${value} deliveries`, 'Deliveries'];
                      if (name === 'avgTime') return [`${value} days`, 'Avg Delivery Time'];
                      return [value, name];
                    }}
                  />
                }
              />
              <Bar dataKey="deliveries" fill="url(#dayBarGradient)" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* ── Company Performance Comparison ── */}
      <Card className="relative overflow-hidden shadow-sm border">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-400" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base">Company Performance Comparison</CardTitle>
          </div>
          <CardDescription>How the 3 companies compare across key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                  <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Company</TableHead>
                  <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-right">Deliveries</TableHead>
                  <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-right">On-Time</TableHead>
                  <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyComparison.map((company) => (
                  <TableRow key={company.name}>
                    <TableCell className="font-medium text-sm">{company.name}</TableCell>
                    <TableCell className="text-sm text-right font-mono">{company.deliveries}</TableCell>
                    <TableCell className="text-sm text-right font-mono text-emerald-600 font-medium">{company.revenue}</TableCell>
                    <TableCell className="text-sm text-right font-mono">
                      <span className={Number(company.onTime.replace('%', '')) >= 92 ? 'text-emerald-600 font-medium' : 'text-amber-600'}>
                        {company.onTime}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{company.avgRating}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Cross-Border Delivery Analytics ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">Cross-Border Delivery Analytics</h3>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Border Post Performance Table */}
          <Card className="relative overflow-hidden shadow-sm border">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Border Post Performance</CardTitle>
              <CardDescription>Lesotho–South Africa border crossing metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                      <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Border Post</TableHead>
                      <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-right">Total Crossings</TableHead>
                      <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-right">Avg Wait (hrs)</TableHead>
                      <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-right">Clearance Rate %</TableHead>
                      <TableHead className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 text-center">Active Delays</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borderPosts.map((post) => (
                      <TableRow key={post.name}>
                        <TableCell className="font-medium text-sm">{post.name}</TableCell>
                        <TableCell className="text-sm text-right font-mono">{post.totalCrossings}</TableCell>
                        <TableCell className="text-sm text-right font-mono">{post.avgWaitHours}</TableCell>
                        <TableCell className="text-sm text-right font-mono">
                          <span className={
                            post.clearanceRate >= 90
                              ? 'text-emerald-600 font-medium'
                              : post.clearanceRate >= 80
                                ? 'text-amber-600 font-medium'
                                : 'text-red-600 font-medium'
                          }>
                            {post.clearanceRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {post.delays > 0 ? (
                            <Badge variant="outline" className={
                              post.delays > 8
                                ? 'text-red-600 border-red-300 dark:text-red-400 dark:border-red-700'
                                : 'text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700'
                            }>
                              {post.delays}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">0</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Cross-Border Trend Chart */}
          <Card className="relative overflow-hidden shadow-sm border">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-400" />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-base">Cross-Border vs Domestic Volume</CardTitle>
              </div>
              <CardDescription>Monthly delivery volume comparison (2024)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={crossBorderTrendConfig} className="h-[300px] w-full">
                <AreaChart data={crossBorderTrend} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillCrossBorder" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="fillDomestic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5eead4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#5eead4" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area type="monotone" dataKey="crossBorder" stroke="#10b981" fill="url(#fillCrossBorder)" strokeWidth={2} />
                  <Area type="monotone" dataKey="domestic" stroke="#5eead4" fill="url(#fillDomestic)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}