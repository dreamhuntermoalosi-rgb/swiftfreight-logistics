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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { customers, deliveries } from '@/lib/mock-data';
import type { Customer } from '@/lib/types';
import {
  Users, Phone, Mail, Star, MapPin, Search, Plus,
  CreditCard, TrendingUp, ArrowUpRight, ChevronUp, ChevronDown, Package,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 20;

const cityBorderColors = ['border-l-emerald-400', 'border-l-teal-400', 'border-l-amber-400', 'border-l-rose-400', 'border-l-violet-400'];
function getCityBorderColor(city: string): string {
  let hash = 0;
  for (let i = 0; i < city.length; i++) hash = city.charCodeAt(i) + ((hash << 5) - hash);
  return cityBorderColors[Math.abs(hash) % cityBorderColors.length];
}

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

function formatCurrency(amount: number) {
  if (amount >= 1_000_000) return `M${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `M${(amount / 1_000).toFixed(1)}K`;
  return `M${amount.toLocaleString()}`;
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
          className={`h-4 w-4 ${i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400 shadow-[0_0_6px_rgba(251,191,36,0.2)]' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`}
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

const cityOptions = ['All', ...Array.from(new Set(customers.map((c) => c.city))).sort()];

export function CustomersTab() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof Customer>('totalShipments');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    let list = [...customers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }
    if (cityFilter !== 'All') {
      list = list.filter((c) => c.city === cityFilter);
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
  }, [search, cityFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgRating = (customers.reduce((sum, c) => sum + (c.rating as number), 0) / customers.length);

  function handleSort(field: keyof Customer) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    setSelectedCustomer(null);
  }

  // Customer's recent deliveries
  const customerDeliveries = useMemo(() => {
    if (!selectedCustomer) return [];
    return deliveries
      .filter((d) => d.customerId === selectedCustomer.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [selectedCustomer]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2.5">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
            <p className="text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-mono">{filtered.length}</Badge>{' '}
              {filtered.length === customers.length ? 'total' : 'of'} {customers.length} customers
            </p>
          </div>
        </div>
        <Button className="bg-green-600 text-white hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          className="shrink-0 gap-2"
          aria-label="Export customers CSV"
          onClick={() => {
            const data = filtered.map((c) => ({
              Name: c.name,
              Email: c.email,
              Phone: c.phone,
              City: c.city,
              Shipments: c.totalShipments,
              'Total Spent': c.totalSpent,
              Rating: c.rating,
              Joined: formatDate(c.joinedAt),
            }));
            exportCSV(data, 'customers.csv');
          }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Select value={cityFilter} onValueChange={(v) => { setCityFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            {cityOptions.map((city) => (
              <SelectItem key={city} value={city}>{city === 'All' ? 'All Cities' : city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-xl font-bold">{customers.length}</p>
              <p className="flex items-center text-xs text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="font-semibold">+15.7%</span> this month
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
              <p className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span className="font-semibold">+12.5%</span> this month
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-xl font-bold">{avgRating.toFixed(1)}</p>
              <RatingStars rating={avgRating} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('name')}>
                    <span className="flex items-center">Name <SortIcon active={sortField === 'name'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell cursor-pointer select-none" onClick={() => handleSort('city')}>
                    <span className="flex items-center">City <SortIcon active={sortField === 'city'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('totalShipments')}>
                    <span className="flex items-center justify-end">Shipments <SortIcon active={sortField === 'totalShipments'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell cursor-pointer select-none text-right" onClick={() => handleSort('totalSpent')}>
                    <span className="flex items-center justify-end">Spent <SortIcon active={sortField === 'totalSpent'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell cursor-pointer select-none" onClick={() => handleSort('rating')}>
                    <span className="flex items-center">Rating <SortIcon active={sortField === 'rating'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="hidden xl:table-cell cursor-pointer select-none" onClick={() => handleSort('joinedAt')}>
                    <span className="flex items-center">Joined <SortIcon active={sortField === 'joinedAt'} direction={sortDir} /></span>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                      No customers found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className={`cursor-pointer hover:bg-muted/50 transition-colors border-l-2 ${getCityBorderColor(customer.city)}`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {customer.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="truncate max-w-[140px]">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[180px]">{customer.email}</span>
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground font-mono text-xs">
                        {customer.phone}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {customer.city}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{customer.totalShipments}</TableCell>
                      <TableCell className="hidden sm:table-cell text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(customer.totalSpent)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <RatingStars rating={customer.rating as number} />
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-muted-foreground text-sm">
                        {formatDate(customer.joinedAt)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
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
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                    .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === 'ellipsis' ? (
                        <PaginationItem key={`e-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={item}>
                          <PaginationLink
                            isActive={page === item}
                            onClick={() => handlePageChange(item as number)}
                            className="cursor-pointer"
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                      className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={(open) => { if (!open) setSelectedCustomer(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="h-1 -mx-6 -mt-6 mb-4 bg-gradient-to-r from-primary to-teal-500 rounded-t-lg" />
          {selectedCustomer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {selectedCustomer.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedCustomer.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground">Customer since {formatDate(selectedCustomer.joinedAt)}</p>
                  </div>
                </div>
              </DialogHeader>

              <Separator />

              {/* Contact Info */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCustomer.city}, {selectedCustomer.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{(selectedCustomer.rating as number).toFixed(1)} / 5.0</span>
                  <RatingStars rating={selectedCustomer.rating as number} />
                </div>
              </div>

              <Separator />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-teal-500/20">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-lg font-bold">{selectedCustomer.totalShipments}</p>
                  <p className="text-xs text-muted-foreground">Shipments</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                    <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(selectedCustomer.totalSpent)}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                    <Star className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-lg font-bold">{(selectedCustomer.rating as number).toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
              </div>

              <Separator />

              {/* Recent Deliveries */}
              <div>
                <h4 className="mb-3 text-sm font-semibold">Recent Deliveries</h4>
                {customerDeliveries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No deliveries yet.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {customerDeliveries.map((d) => (
                      <div key={d.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <div>
                          <p className="font-mono text-xs font-medium text-primary">{d.trackingNumber}</p>
                          <p className="text-xs text-muted-foreground">{d.pickup.city} → {d.destination.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">{d.quotedAmount ? formatCurrency(d.quotedAmount) : '—'}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(d.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}