'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { drivers, companies, deliveries } from '@/lib/mock-data';
import type { Driver } from '@/lib/types';
import {
  Users, Phone, Mail, Star, MapPin, Search, Plus, Truck,
  AlertTriangle, Clock, UserCheck, Shield, ChevronUp, ChevronDown,
  Package, TrendingUp, ArrowUpRight, Download,
} from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 15;

function exportCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${data.length} records to ${filename}`);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) {
  if (!active) return <ChevronUp className="ml-1 h-3 w-3 text-muted-foreground/30" />;
  return direction === 'asc'
    ? <ChevronUp className="ml-1 h-3 w-3 text-primary" />
    : <ChevronDown className="ml-1 h-3 w-3 text-primary" />;
}

const driverStatusConfig: Record<Driver['status'], { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  on_trip: { label: 'On Trip', className: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  off_duty: { label: 'Off Duty', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  suspended: { label: 'Suspended', className: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const driverStatusDotColor: Record<Driver['status'], string> = {
  available: 'bg-green-500',
  on_trip: 'bg-amber-500',
  off_duty: 'bg-red-500',
  suspended: 'bg-red-500',
};

const driverStatusBorderColor: Record<Driver['status'], string> = {
  available: 'border-l-[3px] border-l-green-500',
  on_trip: 'border-l-[3px] border-l-amber-500',
  off_duty: 'border-l-[3px] border-l-gray-300 dark:border-l-gray-600',
  suspended: 'border-l-[3px] border-l-red-500',
};

function isLicenseExpiringSoon(expiry?: string): boolean {
  if (!expiry) return false;
  const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
  return days >= 0 && days <= 30;
}

export function DriversTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Driver>('totalDeliveries');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const filtered = useMemo(() => {
    let list = [...drivers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.phone.includes(q)
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter((d) => d.status === statusFilter);
    }
    if (companyFilter !== 'all') {
      list = list.filter((d) => d.companyId === companyFilter);
    }
    list.sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return list;
  }, [search, statusFilter, companyFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const activeDrivers = drivers.filter((d) => d.status !== 'off_duty' && d.status !== 'suspended').length;
  const onTripDrivers = drivers.filter((d) => d.status === 'on_trip').length;
  const availableDrivers = drivers.filter((d) => d.status === 'available').length;
  const avgRating = drivers.reduce((sum, d) => sum + (d.rating as number), 0) / drivers.length;

  function handleSort(field: keyof Driver) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    setSelectedDriver(null);
  }

  // Driver's recent deliveries
  const driverDeliveries = useMemo(() => {
    if (!selectedDriver) return [];
    return deliveries
      .filter((d) => d.driverId === selectedDriver.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [selectedDriver]);

  // License expiry warning
  function getLicenseWarning(expiry?: string) {
    if (!expiry) return null;
    const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
    if (days < 0) return { text: `Expired ${Math.abs(days)} days ago`, color: 'text-red-600' };
    if (days <= 30) return { text: `Expires in ${days} days`, color: 'text-amber-600' };
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2.5">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Drivers</h2>
            <p className="text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-mono">{filtered.length}</Badge>{' '}
              {filtered.length === drivers.length ? 'total' : 'of'} {drivers.length} drivers
            </p>
          </div>
        </div>
        <Button className="bg-green-600 text-white hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          className="shrink-0 gap-2"
          aria-label="Export drivers CSV"
          onClick={() => {
            const data = filtered.map((d) => ({
              Name: d.name,
              Phone: d.phone,
              'License #': d.licenseNumber,
              Status: d.status,
              Rating: d.rating,
              'Total Deliveries': d.totalDeliveries,
              Successful: d.successfulDeliveries,
              Vehicle: d.currentVehiclePlate || 'None',
              Joined: formatDate(d.joinedAt),
            }));
            exportCSV(data, 'drivers.csv');
          }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses ({drivers.length})</SelectItem>
            <SelectItem value="available">Available ({drivers.filter(d => d.status === 'available').length})</SelectItem>
            <SelectItem value="on_trip">On Trip ({drivers.filter(d => d.status === 'on_trip').length})</SelectItem>
            <SelectItem value="off_duty">Off Duty ({drivers.filter(d => d.status === 'off_duty').length})</SelectItem>
            <SelectItem value="suspended">Suspended ({drivers.filter(d => d.status === 'suspended').length})</SelectItem>
          </SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={(v) => { setCompanyFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Drivers</p>
              <p className="text-xl font-bold">{activeDrivers}</p>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="font-semibold">+3</span> this week
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">On Trip</p>
              <p className="text-xl font-bold">{onTripDrivers}</p>
              <p className="text-xs text-blue-600">{Math.round((onTripDrivers / drivers.length) * 100)}% of fleet</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-xl font-bold">{availableDrivers}</p>
              <p className="text-xs text-emerald-600">Ready for dispatch</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-xl font-bold">{avgRating.toFixed(1)}</p>
              <RatingStars rating={avgRating} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                    <span className="flex items-center">Name <SortIcon active={sortField === 'name'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell">License #</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                    <span className="flex items-center">Status <SortIcon active={sortField === 'status'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Vehicle</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('rating')}>
                    <span className="flex items-center">Rating <SortIcon active={sortField === 'rating'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-right cursor-pointer select-none" onClick={() => handleSort('totalDeliveries')}>
                    <span className="flex items-center justify-end">Deliveries <SortIcon active={sortField === 'totalDeliveries'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="hidden xl:table-cell text-right">Success Rate</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="py-12 text-center text-muted-foreground">
                      No drivers found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((driver) => {
                    const statusCfg = driverStatusConfig[driver.status];
                    const successRate = driver.totalDeliveries > 0
                      ? Math.round((driver.successfulDeliveries / driver.totalDeliveries) * 100)
                      : 0;
                    return (
                      <TableRow
                        key={driver.id}
                        className={`cursor-pointer hover:bg-muted/50 transition-all duration-150 ${isLicenseExpiringSoon(driver.licenseExpiry) ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''} ${driverStatusBorderColor[driver.status]}`}
                        onClick={() => setSelectedDriver(driver)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className={`h-2 w-2 shrink-0 rounded-full ${driverStatusDotColor[driver.status]}`} />
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-teal-500/20 text-xs font-semibold text-primary">
                              {driver.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span className="font-medium truncate max-w-[140px]">{driver.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                          {driver.phone}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs">
                          <span className="flex items-center gap-1.5">
                            {isLicenseExpiringSoon(driver.licenseExpiry) && (
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                            )}
                            {driver.licenseNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusCfg.className}>
                            {statusCfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                          {driver.currentVehiclePlate || '—'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {driver.location ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {driver.location}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <RatingStars rating={driver.rating as number} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right font-medium">
                          {driver.totalDeliveries}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-right">
                          <span className="flex items-center justify-end gap-1">
                            {successRate >= 95 && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                            <span className={`text-sm font-medium ${successRate >= 95 ? 'text-green-600' : successRate >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                              {successRate}%
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelectedDriver(driver); }}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t px-4 py-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                  .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === 'ellipsis' ? (
                      <span key={`e-${idx}`} className="px-2 text-muted-foreground">…</span>
                    ) : (
                      <Button
                        key={item}
                        variant={page === item ? 'default' : 'outline'}
                        size="sm"
                        className="w-9"
                        onClick={() => handlePageChange(item as number)}
                      >
                        {item}
                      </Button>
                    )
                  )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Driver Detail Dialog */}
      <Dialog open={!!selectedDriver} onOpenChange={(open) => { if (!open) setSelectedDriver(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedDriver && (() => {
            const statusCfg = driverStatusConfig[selectedDriver.status];
            const successRate = selectedDriver.totalDeliveries > 0
              ? Math.round((selectedDriver.successfulDeliveries / selectedDriver.totalDeliveries) * 100)
              : 0;
            const licenseWarning = getLicenseWarning(selectedDriver.licenseExpiry);
            const company = companies.find((c) => c.id === selectedDriver.companyId);

            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-teal-500/20 text-xl font-bold text-primary">
                      {selectedDriver.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-xl">{selectedDriver.name}</DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={statusCfg.className}>
                          {statusCfg.label}
                        </Badge>
                        {company && (
                          <span className="text-xs text-muted-foreground">{company.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <Separator />

                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{selectedDriver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{selectedDriver.email}</span>
                  </div>
                </div>

                <Separator />

                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <Package className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                    <p className="text-lg font-bold">{selectedDriver.totalDeliveries}</p>
                    <p className="text-xs text-muted-foreground">Deliveries</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted hover:brightness-110 transition-all">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-teal-500 transition-all hover:brightness-110"
                        style={{ width: `${Math.min(100, (selectedDriver.successfulDeliveries / Math.max(selectedDriver.totalDeliveries, 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <TrendingUp className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                    <p className={`text-lg font-bold ${successRate >= 95 ? 'text-green-600' : successRate >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                      {successRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">On-Time Rate</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted hover:brightness-110 transition-all">
                      <div
                        className={`h-full rounded-full transition-all hover:brightness-110 ${successRate >= 95 ? 'bg-green-500' : successRate >= 90 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${successRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <Star className="mx-auto mb-1 h-5 w-5 text-yellow-500" />
                    <p className="text-lg font-bold">{(selectedDriver.rating as number).toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <RatingStars rating={selectedDriver.rating as number} />
                </div>

                <Separator />

                {/* Current Assignment */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Current Assignment</h4>
                  {selectedDriver.status === 'on_trip' ? (
                    <div className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Vehicle</span>
                        <span className="font-mono font-medium">{selectedDriver.currentVehiclePlate || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Location</span>
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {selectedDriver.location || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No active assignment</p>
                  )}
                </div>

                <Separator />

                {/* License Info */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold">License Information</h4>
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        License Number
                      </span>
                      <span className="font-mono">{selectedDriver.licenseNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Expiry Date</span>
                      <span className={licenseWarning ? licenseWarning.color : ''}>
                        {selectedDriver.licenseExpiry
                          ? formatDate(selectedDriver.licenseExpiry)
                          : 'N/A'}
                      </span>
                    </div>
                    {licenseWarning && (
                      <div className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {licenseWarning.text}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Recent Deliveries */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold">Recent Deliveries</h4>
                  {driverDeliveries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No deliveries yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {driverDeliveries.map((d) => (
                        <div key={d.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                          <div>
                            <p className="font-mono text-xs font-medium text-primary">{d.trackingNumber}</p>
                            <p className="text-xs text-muted-foreground">{d.pickup.city} → {d.destination.city}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium">{d.quotedAmount ? `M${d.quotedAmount}` : '—'}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(d.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}