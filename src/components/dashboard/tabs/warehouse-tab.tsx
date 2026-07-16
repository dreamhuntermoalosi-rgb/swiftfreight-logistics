'use client';

import React from 'react';
import {
  Warehouse,
  Package,
  BarChart3,
  Truck,
  MapPin,
  Thermometer,
  LayoutGrid,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// ============ DATA ============
const warehouses = [
  { id: 'wh-001', name: 'Maseru Central Hub', location: 'Maseru Industrial Area', capacity: 500, used: 387, manager: 'Teboho Khetsi', status: 'active' as const, lastInspection: '2025-07-01', temperature: '22°C', zones: 6 },
  { id: 'wh-002', name: 'Maputsoe Border Depot', location: 'Maputsoe Border Post', capacity: 300, used: 245, status: 'active' as const, manager: 'Mpho Tlali', lastInspection: '2025-06-15', temperature: '20°C', zones: 4 },
  { id: 'wh-003', name: 'Berea Storage Facility', location: 'Berea District', capacity: 200, used: 198, status: 'near_capacity' as const, manager: 'Keketso Rakhomo', lastInspection: '2025-07-10', temperature: '21°C', zones: 3 },
  { id: 'wh-004', name: 'Leribe Distribution Center', location: 'Leribe Town', capacity: 350, used: 120, status: 'active' as const, manager: 'Nthabeleng Mokone', lastInspection: '2025-06-28', temperature: '19°C', zones: 5 },
];

const recentActivities = [
  { id: 1, message: 'Package SF2025000345LS received at Maseru Central Hub', time: '2m ago', type: 'info' as const },
  { id: 2, message: 'Temperature alert: Maputsoe Border Depot exceeded 25°C', time: '15m ago', type: 'alert' as const },
  { id: 3, message: 'Package SF2025000289LS dispatched from Leribe DC', time: '32m ago', type: 'info' as const },
  { id: 4, message: 'Berea Storage Facility nearing capacity (99%)', time: '1h ago', type: 'warning' as const },
  { id: 5, message: 'Inventory audit completed at Maseru Central Hub', time: '2h ago', type: 'info' as const },
  { id: 6, message: 'New zone allocated at Maputsoe Border Depot', time: '3h ago', type: 'info' as const },
];

// ============ HELPERS ============
function getUtilizationColor(pct: number) {
  if (pct > 90) return 'text-red-500';
  if (pct >= 70) return 'text-amber-500';
  return 'text-emerald-500';
}

function getUtilizationBarColor(pct: number) {
  if (pct > 90) return '[&>div]:bg-red-500';
  if (pct >= 70) return '[&>div]:bg-amber-500';
  return '[&>div]:bg-emerald-500';
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>;
    case 'near_capacity':
      return <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Near Capacity</Badge>;
    case 'maintenance':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Maintenance</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============ COMPONENT ============
export function WarehouseTab() {
  const totalWarehouses = warehouses.length;
  const totalInStorage = warehouses.reduce((sum, wh) => sum + wh.used, 0);
  const totalCapacity = warehouses.reduce((sum, wh) => sum + wh.capacity, 0);
  const overallUtilization = Math.round((totalInStorage / totalCapacity) * 100);
  const pendingDispatch = 47;

  // Chart data
  const chartData = warehouses.map((wh) => ({
    name: wh.name.split(' ').slice(0, 2).join(' '),
    Capacity: wh.capacity,
    Used: wh.used,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Warehouse className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Warehouse Management</h2>
            <p className="text-sm text-muted-foreground">Monitor storage facilities and warehouse operations</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-xl bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Warehouses</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalWarehouses}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Warehouse className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Packages in Storage</p>
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{totalInStorage.toLocaleString()}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
              <Package className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Storage Utilization</p>
              <p className="text-2xl font-bold text-primary">{overallUtilization}%</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Dispatch</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingDispatch}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {warehouses.map((wh) => {
          const pct = Math.round((wh.used / wh.capacity) * 100);
          return (
            <div className="rounded-lg border border-border/50 bg-card group transition-all duration-200" key={wh.id}>
              <div className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold">{wh.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {wh.location}
                    </div>
                  </div>
                  {getStatusBadge(wh.status)}
                </div>
              </div>
              <div className="space-y-4">
                {/* Utilization Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className={`font-semibold ${getUtilizationColor(pct)}`}>{pct}%</span>
                  </div>
                  <Progress value={pct} className={`h-2.5 ${getUtilizationBarColor(pct)} group-hover:h-3 transition-all duration-300`} />
                  <p className="text-xs text-muted-foreground">
                    {wh.used} / {wh.capacity} packages
                  </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm font-semibold">{wh.zones}</p>
                    <p className="text-xs text-muted-foreground">Zones</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Thermometer className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm font-semibold">{wh.temperature}</p>
                    <p className="text-xs text-muted-foreground">Temp</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm font-semibold">{formatDate(wh.lastInspection).split(',')[0]}</p>
                    <p className="text-xs text-muted-foreground">Inspected</p>
                  </div>
                </div>

                {/* Manager */}
                <div className="flex items-center gap-2.5 border-t pt-3">
                  <div >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {getInitials(wh.manager)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{wh.manager}</p>
                    <p className="text-xs text-muted-foreground">Warehouse Manager</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Storage Breakdown Chart */}
      <div className="rounded-xl border border-border/50 p-4">
        <h3 className="text-base font-semibold mb-4">Storage Breakdown by Warehouse</h3>
        <div className="h-[200px] sm:h-[260px] lg:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                />
                <Bar
                  dataKey="Capacity"
                  fill="var(--color-emerald-200)"
                  stroke="var(--color-emerald-400)"
                  strokeWidth={1}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Used"
                  fill="var(--color-emerald-500)"
                  stroke="var(--color-emerald-600)"
                  strokeWidth={1}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-semibold">Recent Activity</h3>
        </div>
          <ScrollArea className="max-h-96">
            <div className="divide-y">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 px-6 py-3.5 transition-colors hover:bg-muted/50 ${
                    activity.type === 'alert'
                      ? 'bg-red-50 dark:bg-red-950/20 border-l-[3px] border-l-red-500'
                      : activity.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/20 border-l-[3px] border-l-amber-500'
                        : activity.type === 'info'
                          ? 'border-l-[3px] border-l-emerald-500'
                          : 'border-l-[3px] border-l-transparent'
                  }`}
                >
                  <div className="mt-0.5">
                    {activity.type === 'alert' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : activity.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Info className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${activity.type === 'alert' ? 'text-red-700 dark:text-red-400' : activity.type === 'warning' ? 'text-amber-700 dark:text-amber-400' : ''}`}>
                      {activity.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
      </div>
    </div>
  );
}