'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { vehicles, companies, analyticsData } from '@/lib/mock-data';
import type { Vehicle } from '@/lib/types';
import {
  Truck, Search, Plus, Car, Bike, Fuel, Wrench, Shield,
  AlertTriangle, Clock, MapPin, ArrowUpRight, User,
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

export function FleetTab() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filtered = useMemo(() => {
    let list = [...vehicles];
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

  const availableCount = vehicles.filter((v) => v.status === 'available').length;
  const inUseCount = vehicles.filter((v) => v.status === 'in_use').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'maintenance').length;

  // Fleet utilization from analytics data
  const fleetUtil = analyticsData.fleetUtilization;

  // Maintenance schedule: vehicles with nextServiceDate within 30 days
  const maintenanceSchedule = useMemo(() => {
    return vehicles
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
              {filtered.length === vehicles.length ? 'total' : 'of'} {vehicles.length} vehicles
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
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
              <p className="text-xl font-bold">{vehicles.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
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
        <Card>
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
        <Card>
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
              const insDays = vehicle.insuranceExpiry ? getDaysUntil(vehicle.insuranceExpiry) : null;
              const licDays = vehicle.licenseExpiry ? getDaysUntil(vehicle.licenseExpiry) : null;

              return (
                <Card key={vehicle.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4 space-y-3">
                    {/* Header: Type icon + Plate + Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          {vehicleTypeIcons[vehicle.type]}
                        </div>
                        <div>
                          <p className="font-mono text-lg font-bold tracking-wide">{vehicle.plateNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.make} {vehicle.model} {vehicle.year}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={statusCfg.className}>
                        {statusCfg.label}
                      </Badge>
                    </div>

                    {/* Type + Fuel + Capacity */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {vehicleTypeLabels[vehicle.type]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Fuel className="mr-1 h-3 w-3" />
                        {fuelLabels[vehicle.fuelType]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {vehicle.capacity >= 1000 ? `${(vehicle.capacity / 1000).toFixed(1)}t` : `${vehicle.capacity}kg`}
                      </Badge>
                    </div>

                    <Separator />

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
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
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Wrench className="h-3.5 w-3.5" />
                        <span>Next service: {formatDate(vehicle.nextServiceDate)}</span>
                        {getDaysUntil(vehicle.nextServiceDate) <= 7 && (
                          <Badge variant="secondary" className="ml-auto bg-amber-50 text-amber-700 text-xs dark:bg-amber-900/30 dark:text-amber-400">
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

      {/* Vehicle Detail Dialog */}
      <Dialog open={!!selectedVehicle} onOpenChange={(open) => { if (!open) setSelectedVehicle(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedVehicle && (() => {
            const statusCfg = vehicleStatusConfig[selectedVehicle.status];
            const company = companies.find((c) => c.id === selectedVehicle.companyId);
            const insDays = selectedVehicle.insuranceExpiry ? getDaysUntil(selectedVehicle.insuranceExpiry) : null;
            const licDays = selectedVehicle.licenseExpiry ? getDaysUntil(selectedVehicle.licenseExpiry) : null;
            const svcDays = selectedVehicle.nextServiceDate ? getDaysUntil(selectedVehicle.nextServiceDate) : null;

            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                      {vehicleTypeIcons[selectedVehicle.type]}
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-xl font-mono">{selectedVehicle.plateNumber}</DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={statusCfg.className}>
                          {statusCfg.label}
                        </Badge>
                        <Badge variant="outline">{vehicleTypeLabels[selectedVehicle.type]}</Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <Separator />

                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="font-medium mt-1">{company?.name || 'Unknown'}</p>
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
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="font-medium mt-1">
                      {selectedVehicle.capacity >= 1000
                        ? `${(selectedVehicle.capacity / 1000).toFixed(1)} tonnes`
                        : `${selectedVehicle.capacity} kg`}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Current Mileage</p>
                    <p className="font-medium mt-1">{selectedVehicle.currentMileage.toLocaleString()} km</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Assigned Driver</p>
                    <p className="font-medium mt-1 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {selectedVehicle.assignedDriverName || 'Unassigned'}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Expiry Dates */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Expiry & Service Dates
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <span className="text-muted-foreground">Insurance Expiry</span>
                      <span className={insDays !== null && insDays <= 30 ? 'text-amber-600 font-medium' : 'font-medium'}>
                        {selectedVehicle.insuranceExpiry ? formatDate(selectedVehicle.insuranceExpiry) : 'N/A'}
                        {insDays !== null && insDays <= 30 && insDays > 0 && (
                          <AlertTriangle className="ml-1.5 inline h-3.5 w-3.5" />
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <span className="text-muted-foreground">License Expiry</span>
                      <span className={licDays !== null && licDays <= 30 ? 'text-amber-600 font-medium' : 'font-medium'}>
                        {selectedVehicle.licenseExpiry ? formatDate(selectedVehicle.licenseExpiry) : 'N/A'}
                        {licDays !== null && licDays <= 30 && licDays > 0 && (
                          <AlertTriangle className="ml-1.5 inline h-3.5 w-3.5" />
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <span className="text-muted-foreground">Next Service</span>
                      <span className={svcDays !== null && svcDays <= 7 ? 'text-amber-600 font-medium' : 'font-medium'}>
                        {selectedVehicle.nextServiceDate ? formatDate(selectedVehicle.nextServiceDate) : 'N/A'}
                        {svcDays !== null && svcDays <= 7 && svcDays > 0 && (
                          <AlertTriangle className="ml-1.5 inline h-3.5 w-3.5" />
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <span className="text-muted-foreground">Last Service</span>
                      <span className="font-medium">
                        {selectedVehicle.lastServiceDate ? formatDate(selectedVehicle.lastServiceDate) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
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
        </DialogContent>
      </Dialog>
    </div>
  );
}