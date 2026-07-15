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

const revenueByRouteConfig: ChartConfig = {
  revenue: { label: 'Revenue (M)', color: '#16a34a' },
  count: { label: 'Deliveries', color: '#14b8a6' },
};

const satisfactionConfig: ChartConfig = {
  satisfied: { label: 'Satisfied (4-5★)', color: '#22c55e' },
  neutral: { label: 'Neutral (3★)', color: '#f59e0b' },
  dissatisfied: { label: 'Dissatisfied (1-2★)', color: '#ef4444' },
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

  // Revenue by route horizontal chart data
  const routeChartData = useMemo(
    () =>
      [...analyticsData.topRoutes]
        .sort((a, b) => b.revenue - a.revenue)
        .map((r) => ({ route: r.route, revenue: r.revenue, count: r.count })),
    []
  );

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
        <Card>
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
        <Card>
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
        <Card>
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

        {/* Revenue by Route */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base">Revenue by Route</CardTitle>
            </div>
            <CardDescription>Top performing delivery routes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueByRouteConfig} className="h-[260px] w-full">
              <BarChart
                data={routeChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v: number) => `M${(v / 1000).toFixed(0)}k`} className="text-xs" />
                <YAxis
                  type="category"
                  dataKey="route"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={130}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="#16a34a" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Driver Performance Table ── */}
      <Card>
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
        <Card>
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
        <Card>
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
    </div>
  );
}