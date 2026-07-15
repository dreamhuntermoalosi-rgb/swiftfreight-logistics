'use client';

import { useMemo, useState } from 'react';
import {
  DollarSign,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
  Eye,
  CreditCard,
  Package,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { invoices, deliveries, customers } from '@/lib/mock-data';
import type { Invoice } from '@/lib/types';

// ============ Helpers ============
function formatCurrency(value: number) {
  return `M${value.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const statusConfig: Record<Invoice['status'], { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  paid: {
    label: 'Paid',
    className: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: AlertTriangle,
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: AlertTriangle,
  },
};

// ============ Main Component ============
export function InvoicesTab() {
  const { currentUser } = useAuthStore();
  const isCustomer = currentUser?.role === 'customer';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'amount' | 'date'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const perPage = 15;

  // Filter invoices for customer or show all for staff
  const baseInvoices = useMemo(() => {
    if (isCustomer) {
      const customerRecord = customers.find((c) => c.name === currentUser?.name);
      if (customerRecord) {
        return invoices.filter((inv) => inv.customerId === customerRecord.id);
      }
    }
    return invoices;
  }, [isCustomer, currentUser]);

  const filteredInvoices = useMemo(() => {
    let result = [...baseInvoices];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.id.toLowerCase().includes(q) ||
          inv.customerName.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'amount') {
        cmp = a.amount - b.amount;
      } else {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [baseInvoices, search, statusFilter, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / perPage));
  const paginatedInvoices = filteredInvoices.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Summary
  const totalBilled = baseInvoices.reduce((s, inv) => s + inv.amount, 0);
  const totalPaid = baseInvoices.filter((inv) => inv.status === 'paid').reduce((s, inv) => s + inv.amount, 0);
  const totalOutstanding = totalBilled - totalPaid;

  // Get delivery tracking number for an invoice
  function getTrackingNumber(invoice: Invoice): string {
    const delivery = deliveries.find((d) => d.id === invoice.deliveryId);
    return delivery?.trackingNumber || '—';
  }

  // Toggle sort
  function toggleSort(field: 'amount' | 'date') {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  // Mock itemized breakdown
  function getItemizedBreakdown(invoice: Invoice) {
    return [
      { description: 'Delivery charges', amount: Math.round(invoice.amount * 0.65) },
      { description: 'Handling & packaging', amount: Math.round(invoice.amount * 0.15) },
      { description: 'Border processing', amount: Math.round(invoice.amount * 0.1) },
      { description: 'Insurance', amount: Math.round(invoice.amount * 0.1) },
    ];
  }

  // Handle pay now
  function handlePayNow() {
    toast.success('Payment initiated successfully! Your invoice will be marked as paid shortly.');
    setSelectedInvoice(null);
  }

  // Pagination pages to show
  function getVisiblePages() {
    const pages: number[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push(-1); // ellipsis
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push(-2); // ellipsis
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Invoices
            <Badge variant="secondary" className="text-xs">
              {filteredInvoices.length}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground">
            {isCustomer ? 'View and manage your invoices' : 'Manage all customer invoices'}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info('Download all invoices feature coming soon')}>
          <Download className="h-4 w-4" />
          Download All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Billed</p>
                <p className="text-2xl font-bold tracking-tight mt-1">{formatCurrency(totalBilled)}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold tracking-tight mt-1 text-green-600">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold tracking-tight mt-1 text-amber-600">{formatCurrency(totalOutstanding)}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by invoice # or customer name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Invoice #</TableHead>
                  <TableHead className="text-xs">Delivery</TableHead>
                  {!isCustomer && <TableHead className="hidden text-xs md:table-cell">Customer</TableHead>}
                  <TableHead
                    className="cursor-pointer text-xs select-none"
                    onClick={() => toggleSort('amount')}
                  >
                    <span className="flex items-center gap-1">
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead
                    className="cursor-pointer hidden text-xs sm:table-cell select-none"
                    onClick={() => toggleSort('date')}
                  >
                    <span className="flex items-center gap-1">
                      Due Date
                      <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center">
                      <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-muted-foreground">No invoices found</p>
                      <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
                    </TableCell>
                  </TableRow>
                )}
                {paginatedInvoices.map((inv) => {
                  const sc = statusConfig[inv.status];
                  const StatusIcon = sc.icon;
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs font-medium">{inv.id}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {getTrackingNumber(inv)}
                      </TableCell>
                      {!isCustomer && (
                        <TableCell className="hidden max-w-[140px] truncate text-xs md:table-cell">
                          {inv.customerName}
                        </TableCell>
                      )}
                      <TableCell className="text-xs font-medium">{formatCurrency(inv.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-[10px] gap-1 ${sc.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-xs sm:table-cell">
                        {formatDate(inv.dueDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedInvoice(inv)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toast.info('PDF download coming soon')}
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredInvoices.length)} of {filteredInvoices.length}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {getVisiblePages().map((p, idx) =>
                p < 0 ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">…</span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        {selectedInvoice && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <span className="text-lg">{selectedInvoice.id}</span>
                  <Badge
                    variant="secondary"
                    className={`ml-2 text-[10px] gap-1 ${statusConfig[selectedInvoice.status].className}`}
                  >
                    {(() => { const Ic = statusConfig[selectedInvoice.status].icon; return <Ic className="h-3 w-3" />; })()}
                    {statusConfig[selectedInvoice.status].label}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Billing To */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Billing To</p>
                <p className="font-medium">{selectedInvoice.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  Customer ID: {selectedInvoice.customerId}
                </p>
              </div>

              {/* Delivery Reference */}
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Delivery Reference</p>
                  <p className="text-sm font-mono font-medium">{getTrackingNumber(selectedInvoice)}</p>
                </div>
              </div>

              <Separator />

              {/* Amount & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Amount Due</p>
                  <p className="text-xl font-bold">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="text-sm font-medium">{formatDate(selectedInvoice.dueDate)}</p>
                  <p className="text-xs text-muted-foreground">Created: {formatDate(selectedInvoice.createdAt)}</p>
                </div>
              </div>

              <Separator />

              {/* Itemized Breakdown */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Invoice Breakdown
                </p>
                <div className="space-y-2">
                  {getItemizedBreakdown(selectedInvoice).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.description}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              {selectedInvoice.status !== 'paid' && (
                <Button onClick={handlePayNow} className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pay Now
                </Button>
              )}
              <Button variant="outline" className="gap-2" onClick={() => toast.info('PDF download coming soon')}>
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}