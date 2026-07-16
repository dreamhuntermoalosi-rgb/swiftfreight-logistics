'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { vehicles as mockVehicles, deliveries as mockDeliveries, companies, analyticsData } from '@/lib/mock-data';
import type { Vehicle } from '@/lib/types';
import {
  Truck, Search, Plus, Car, Bike, Fuel, Wrench,
  AlertTriangle, Clock, MapPin, ArrowUpRight, User, Package, Calendar,
} from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDaysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

const vehicleTypeIcons: Record<Vehicle['type'], React.ReactNode> = {
  motorcycle: <Bike className="h-5 w-5" />,
  van: <Car className="h-5 w-5" />,
  truck: <Truck className="h-5 w-5" />,
  trailer: <Truck className="h-5 w-5" />,
  pickup: <Car className="h-5 w-5" />,
};

const vehicleTypeLabels: Record<Vehicle['type'], string> = {
  motorcycle: 'Motorcycle',
  van: 'Van',
  truck: 'Truck',
  trailer: 'Trailer',
  pickup: 'Pickup',
};

const vehicleTypeAccentColors: Record<Vehicle['type'], { border: string; dot: string }> = {
  motorcycle: { border: 'border-l-blue-400', dot: 'bg-blue-400' },
  van: { border: 'border-l-teal-400', dot: 'bg-teal-400' },
  truck: { border: 'border-l-emerald-400', dot: 'bg-emerald-400' },
  trailer: { border: 'border-l-purple-400', dot: 'bg-purple-400' },
  pickup: { border: 'border-l-amber-400', dot: 'bg-amber-400' },
};

const vehicleStatusDots: Record<Vehicle['status'], string> = {
  available: 'bg-green-500',
  in_use: 'bg-blue-500',
  maintenance: 'bg-amber-500',
  out_of_service: 'bg-red-500',
};

const vehicleStatusConfig: Record<Vehicle['status'], { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  in_use: { label: 'In Use', className: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  maintenance: { label: 'Maintenance', className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  out_of_service: { label: 'Out of Service', className: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const fuelLabels: Record<Vehicle['fuelType'], string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  electric: 'Electric',
  hybrid: 'Hybrid',
};

const fuelColorMap: Record<Vehicle['fuelType'], string> = {
  diesel: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  petrol: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  electric: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  hybrid: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
};

const statusGradientBg: Record<Vehicle['status'], string> = {
  available: 'bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 dark:to-transparent',
  in_use: 'bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent',
  maintenance: 'bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10 dark:to-transparent',
  out_of_service: 'bg-gradient-to-br from-red-50/30 to-transparent dark:from-red-900/10 dark:to-transparent',
};

const maintenanceHistory = [
  { date: '2025-07-10', type: 'Oil Change', cost: 850, technician: 'T. Moletsane', notes: 'Full synthetic oil' },
  { date: '2025-06-15', type: 'Brake Service', cost: 2400, technician: 'M. Thabo', notes: 'Front and rear brake pads replaced' },
  { date: '2025-05-20', type: 'Tire Rotation', cost: 600, technician: 'K. Ntsie', notes: 'All 4 tires rotated, pressure adjusted' },
  { date: '2025-04-08', type: 'Engine Service', cost: 5200, technician: 'T. Moletsane', notes: 'Major service - filters, plugs, belts' },
  { date: '2025-03-01', type: 'Battery Replacement', cost: 1800, technician: 'P. Makhoro', notes: 'New 12V heavy-duty battery' },
];

const activeDeliveryStatuses = ['collected', 'at_warehouse', 'in_transit', 'at_border', 'out_for_delivery'];

export function FleetTab() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    let list = [...mockVehicles];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.plateNumber.toLowerCase().includes(q) ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'all') {
      list = list.filter((v) => v.type === typeFilter);
    }
    if (statusFilter !== 'all') {
      list = list.filter((v) => v.status === statusFilter);
    }
    if (companyFilter !== 'all') {
      list = list.filter((v) => v.companyId === companyFilter);
    }
    return list;
  }, [search, typeFilter, statusFilter, companyFilter]);

  const availableCount = mockVehicles.filter((v) => v.status === 'available').length;
  const inUseCount = mockVehicles.filter((v) => v.status === 'in_use').length;
  const maintenanceCount = mockVehicles.filter((v) => v.status === 'maintenance').length;

  // Fleet utilization from analytics data
  const fleetUtil = analyticsData.fleetUtilization;

  // Maintenance schedule: vehicles with nextServiceDate within 30 days
  const maintenanceSchedule = useMemo(() => {
    return mockVehicles
      .filter((v) => {
        if (!v.nextServiceDate) return false;
        const days = getDaysUntil(v.nextServiceDate);
        return days <= 30;
      })
      .sort((a, b) => {
        const da = a.nextServiceDate ? getDaysUntil(a.nextServiceDate) : 999;
        const db = b.nextServiceDate ? getDaysUntil(b.nextServiceDate) : 999;
        return da - db;
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2.5">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Fleet Management</h2>
            <p className="text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-mono">{filtered.length}</Badge>{' '}
              {filtered.length === mockVehicles.length ? 'total' : 'of'} {mockVehicles.length} vehicles
            </p>
          </div>
        </div>
        <Button className="bg-green-600 text-white hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search plate, make, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Vehicle type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="motorcycle">Motorcycle</SelectItem>
            <SelectItem value="van">Van</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
            <SelectItem value="trailer">Trailer</SelectItem>
            <SelectItem value="pickup">Pickup</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="in_use">In Use</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="out_of_service">Out of Service</SelectItem>
          </SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
              <p className="text-xl font-bold">{mockVehicles.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-xl font-bold text-green-600">{availableCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Use</p>
              <p className="text-xl font-bold text-blue-600">{inUseCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
              <Wrench className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-xl font-bold text-amber-600">{maintenanceCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Card Grid */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Vehicles</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No vehicles found matching your filters.
            </div>
          ) : (
            filtered.map((vehicle) => {
              const statusCfg = vehicleStatusConfig[vehicle.status];
              const company = companies.find((c) => c.id === vehicle.companyId);
              const accentColors = vehicleTypeAccentColors[vehicle.type] || { border: 'border-l-gray-400', dot: 'bg-gray-400' };
              const statusDot = vehicleStatusDots[vehicle.status] || 'bg-gray-400';
              const insDays = vehicle.insuranceExpiry ? getDaysUntil(vehicle.insuranceExpiry) : null;
              const licDays = vehicle.licenseExpiry ? getDaysUntil(vehicle.licenseExpiry) : null;

              return (
                <Card key={vehicle.id} className={`transition-all duration-200 hover:shadow-md hover:shadow-inner hover:shadow-emerald-500/5 hover:-translate-y-0.5 border-l-4 ${accentColors.border} cursor-pointer ${statusGradientBg[vehicle.status] || ''}`} onClick={() => setSelectedVehicle(vehicle)}>
                  <CardContent className="p-4 space-y-3">
                    {/* Header: Type icon + Plate + Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative rounded-lg bg-gradient-to-br from-primary/15 to-teal-500/15 p-2 text-primary">
                          {vehicleTypeIcons[vehicle.type]}
                          <span className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${statusDot}`} />
                        </div>
                        <div>
                          <p className="font-mono text-lg font-bold tracking-wide">{vehicle.plateNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.make} {vehicle.model} {vehicle.year}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={`${statusCfg.className} gap-1.5`}>
                        {vehicle.status === 'in_use' && <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />}
                        {vehicle.status !== 'in_use' && <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />}
                        {statusCfg.label}
                      </Badge>
                    </div>

                    {/* Type + Fuel + Capacity */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {vehicleTypeLabels[vehicle.type]}
                      </Badge>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${fuelColorMap[vehicle.fuelType] || ''}`}>
                        {vehicle.fuelType === 'electric' ? '⚡' : <Fuel className="h-3 w-3" />}
                        {fuelLabels[vehicle.fuelType]}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {vehicle.capacity >= 1000 ? `${(vehicle.capacity / 1000).toFixed(1)}t` : `${vehicle.capacity}kg`}
                      </Badge>
                    </div>

                    <Separator />

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 divide-x divide-border/50 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Mileage</p>
                        <p className="font-medium">{vehicle.currentMileage.toLocaleString()} km</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Assigned Driver</p>
                        <p className="font-medium flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {vehicle.assignedDriverName || (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Insurance Expiry</p>
                        <p className={`font-medium ${insDays !== null && insDays <= 30 ? 'text-amber-600' : ''}`}>
                          {vehicle.insuranceExpiry ? formatDate(vehicle.insuranceExpiry) : 'N/A'}
                          {insDays !== null && insDays <= 30 && insDays > 0 && (
                            <AlertTriangle className="ml-1 inline h-3 w-3" />
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">License Expiry</p>
                        <p className={`font-medium ${licDays !== null && licDays <= 30 ? 'text-amber-600' : ''}`}>
                          {vehicle.licenseExpiry ? formatDate(vehicle.licenseExpiry) : 'N/A'}
                          {licDays !== null && licDays <= 30 && licDays > 0 && (
                            <AlertTriangle className="ml-1 inline h-3 w-3" />
                          )}
                        </p>
                      </div>
                    </div>

                    {vehicle.nextServiceDate && (
                      <div className="flex items-center divide-x divide-border/50 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2 pr-3">
                          <Wrench className="h-3.5 w-3.5" />
                          Next service: {formatDate(vehicle.nextServiceDate)}
                        </span>
                        {getDaysUntil(vehicle.nextServiceDate) <= 7 && (
                          <Badge variant="secondary" className="ml-auto bg-amber-50 text-amber-700 text-xs dark:bg-amber-900/30 dark:text-amber-400 animate-pulse">
                            Due soon
                          </Badge>
                        )}
                      </div>
                    )}

                    {company && (
                      <p className="text-xs text-muted-foreground">{company.name}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <User className="mr-1.5 h-3.5 w-3.5" />
                        Assign
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Wrench className="mr-1.5 h-3.5 w-3.5" />
                        Maintain
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Fleet Utilization */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Fleet Utilization by Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {fleetUtil.map((item) => {
            const pct = Math.round((item.inUse / item.total) * 100);
            const availablePct = Math.round((item.available / item.total) * 100);
            const maintPct = Math.round((item.maintenance / item.total) * 100);
            return (
              <div key={item.type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-muted-foreground">
                    {item.inUse}/{item.total} in use ({pct}%)
                  </span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-green-500"
                    style={{ width: `${pct}%` }}
                  />
                  <div
                    className="absolute inset-y-0 rounded-full bg-amber-400"
                    style={{ left: `${pct}%`, width: `${maintPct}%` }}
                  />
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    In Use: {item.inUse}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    Available: {item.available}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Maintenance: {item.maintenance}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Upcoming Maintenance</CardTitle>
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {maintenanceSchedule.length} vehicles
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {maintenanceSchedule.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No vehicles due for maintenance in the next 30 days.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Plate</TableHead>
                    <TableHead className="hidden sm:table-cell">Last Service</TableHead>
                    <TableHead>Next Service</TableHead>
                    <TableHead>Days Until</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceSchedule.map((v) => {
                    const days = v.nextServiceDate ? getDaysUntil(v.nextServiceDate) : 999;
                    const isOverdue = days < 0;
                    const isUrgent = days >= 0 && days <= 7;
                    const daysColor = isOverdue
                      ? 'text-red-600 dark:text-red-400'
                      : isUrgent
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-green-600 dark:text-green-400';
                    const daysBadge = isOverdue
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : isUrgent
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400';

                    return (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-primary">{vehicleTypeIcons[v.type]}</span>
                            {v.make} {v.model} ({v.year})
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{v.plateNumber}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {v.lastServiceDate ? formatDate(v.lastServiceDate) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {v.nextServiceDate ? formatDate(v.nextServiceDate) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {isOverdue ? (
                            <Badge variant="secondary" className={daysBadge}>
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {Math.abs(days)}d overdue
                            </Badge>
                          ) : isUrgent ? (
                            <Badge variant="secondary" className={daysBadge}>
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {days} days
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className={daysBadge}>
                              {days} days
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Detail Sheet */}
      <Sheet open={!!selectedVehicle} onOpenChange={(open) => { if (!open) setSelectedVehicle(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selectedVehicle && (() => {
            const statusCfg = vehicleStatusConfig[selectedVehicle.status];
            const company = companies.find((c) => c.id === selectedVehicle.companyId);
            const activeDeliveries = mockDeliveries
              .filter((d) => d.vehicleId === selectedVehicle.id && activeDeliveryStatuses.includes(d.status))
              .slice(0, 3);
            const statusDot = vehicleStatusDots[selectedVehicle.status] || 'bg-gray-400';

            return (
              <>
                {/* Vehicle Header */}
                <SheetHeader className="pr-6">
                  <div className="flex items-center gap-4">
                    <div className="relative rounded-lg bg-primary/10 p-3 text-primary">
                      {vehicleTypeIcons[selectedVehicle.type]}
                      <span className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${statusDot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <SheetTitle className="text-xl font-mono">{selectedVehicle.plateNumber}</SheetTitle>
                      <SheetDescription className="text-sm">
                        {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year}
                      </SheetDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={`${statusCfg.className} gap-1.5`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                          {statusCfg.label}
                        </Badge>
                        <Badge variant="outline">{vehicleTypeLabels[selectedVehicle.type]}</Badge>
                      </div>
                      {company && (
                        <p className="text-xs text-muted-foreground mt-1.5">{company.name}</p>
                      )}
                    </div>
                  </div>
                </SheetHeader>

                <Separator />

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Make / Model</p>
                    <p className="font-medium mt-1">{selectedVehicle.make} {selectedVehicle.model}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Year</p>
                    <p className="font-medium mt-1">{selectedVehicle.year}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Color</p>
                    <p className="font-medium mt-1">{selectedVehicle.color}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Fuel Type</p>
                    <p className="font-medium mt-1 flex items-center gap-1">
                      <Fuel className="h-3.5 w-3.5 text-muted-foreground" />
                      {fuelLabels[selectedVehicle.fuelType]}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Mileage</p>
                    <p className="font-medium mt-1">{selectedVehicle.currentMileage.toLocaleString()} km</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Next Service</p>
                    <p className="font-medium mt-1">
                      {selectedVehicle.nextServiceDate ? formatDate(selectedVehicle.nextServiceDate) : 'N/A'}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Maintenance History */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Maintenance History
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {maintenanceHistory.map((item, idx) => (
                      <div key={idx} className="rounded-lg border p-3 text-sm space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.type}</span>
                          <span className="font-mono text-emerald-600 font-medium">M{item.cost.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.technician}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Active Deliveries */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Active Deliveries
                    {activeDeliveries.length > 0 && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                        {activeDeliveries.length}
                      </Badge>
                    )}
                  </h4>
                  {activeDeliveries.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                      No active deliveries assigned to this vehicle.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Tracking #</TableHead>
                            <TableHead className="text-xs">Customer</TableHead>
                            <TableHead className="text-xs hidden sm:table-cell">Route</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeDeliveries.map((d) => (
                            <TableRow key={d.id}>
                              <TableCell className="font-mono text-xs">{d.trackingNumber}</TableCell>
                              <TableCell className="text-xs max-w-[100px] truncate">{d.customerName}</TableCell>
                              <TableCell className="text-xs hidden sm:table-cell max-w-[120px] truncate">
                                {d.pickup.city} → {d.destination.city}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[10px] capitalize">
                                  {d.status.replace(/_/g, ' ')}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4">
                  <Button className="flex-1 bg-green-600 text-white hover:bg-green-700">
                    <User className="mr-2 h-4 w-4" />
                    {selectedVehicle.assignedDriverName ? 'Reassign Driver' : 'Assign Driver'}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Wrench className="mr-2 h-4 w-4" />
                    Schedule Service
                  </Button>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}