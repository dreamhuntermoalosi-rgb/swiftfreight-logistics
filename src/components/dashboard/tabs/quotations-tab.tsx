'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { quotations, deliveries } from '@/lib/mock-data';
import type { Quotation } from '@/lib/types';
import {
  FileText, Search, Clock, CheckCircle, XCircle, AlertTriangle,
  Eye, ChevronLeft, ChevronRight, Calendar, Package, User,
  ArrowRightLeft, FileOutput, Sparkles, Download,
} from 'lucide-react';
import { motion } from 'framer-motion';

// ── Helpers ──────────────────────────────────────────────────
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

function getRowBorderClass(status: Quotation['status']): string {
  switch (status) {
    case 'pending': return 'border-l-[3px] border-l-amber-500';
    case 'accepted': return 'border-l-[3px] border-l-emerald-500';
    case 'rejected': return 'border-l-[3px] border-l-red-500';
    case 'expired': return 'border-l-[3px] border-l-gray-400';
    default: return '';
  }
}

const statusConfig: Record<Quotation['status'], { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', icon: AlertTriangle },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const ITEMS_PER_PAGE = 15;

// ── Main Component ──────────────────────────────────────────
export function QuotationsTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<(Quotation & { trackingNumber: string; customerName: string; pickupCity: string; destCity: string }) | null>(null);

  // Lookup delivery info for each quotation
  const quotationWithDelivery = useMemo(() => {
    return quotations.map(q => {
      const delivery = deliveries.find(d => d.id === q.deliveryId);
      return {
        ...q,
        trackingNumber: delivery?.trackingNumber ?? 'N/A',
        customerName: delivery?.customerName ?? 'Unknown',
        pickupCity: delivery?.pickup.city ?? '',
        destCity: delivery?.destination.city ?? '',
      };
    });
  }, []);

  // Filtered data
  const filtered = useMemo(() => {
    let data = quotationWithDelivery;
    if (statusFilter !== 'all') {
      data = data.filter(q => q.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        item => item.trackingNumber.toLowerCase().includes(q) || item.customerName.toLowerCase().includes(q)
      );
    }
    return data;
  }, [quotationWithDelivery, statusFilter, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [filtered, page]);

  // Reset page when filters change
  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // Summary stats
  const summary = useMemo(() => {
    const pending = quotationWithDelivery.filter(q => q.status === 'pending');
    const accepted = quotationWithDelivery.filter(q => q.status === 'accepted');
    const rejected = quotationWithDelivery.filter(q => q.status === 'rejected');
    return {
      pendingCount: pending.length,
      pendingValue: pending.reduce((sum, q) => sum + q.amount, 0),
      acceptedCount: accepted.length,
      acceptedValue: accepted.reduce((sum, q) => sum + q.amount, 0),
      rejectedCount: rejected.length,
    };
  }, [quotationWithDelivery]);

  function openDetail(quote: typeof quotationWithDelivery[0]) {
    setSelectedQuote(quote);
    setDetailOpen(true);
  }

  function handleAccept() {
    if (!selectedQuote) return;
    toast.success('Quotation Accepted', { description: `${selectedQuote.id} has been accepted` });
    setDetailOpen(false);
  }

  function handleReject() {
    if (!selectedQuote) return;
    toast.error('Quotation Rejected', { description: `${selectedQuote.id} has been rejected` });
    setDetailOpen(false);
  }

  function handleGenerateInvoice() {
    if (!selectedQuote) return;
    toast.success('Invoice Generated', { description: `Invoice for ${selectedQuote.id} is being generated` });
    setDetailOpen(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Quotations</h2>
            <p className="text-sm text-muted-foreground">{quotations.length} total quotations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tracking # or customer..."
              className="w-full pl-8 sm:w-64"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="shrink-0 gap-2"
            onClick={() => {
              const data = filtered.map((q) => ({
                'Quote #': q.id.toUpperCase(),
                Delivery: q.trackingNumber,
                Customer: q.customerName,
                'Amount (M)': q.amount,
                'Est. Days': q.estimatedDays,
                'Valid Until': formatDate(q.validUntil),
                Status: q.status,
              }));
              exportCSV(data, 'quotations.csv');
            }}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <div className="flex rounded-lg border bg-muted/50 p-0.5">
            {(['all', 'pending', 'accepted', 'rejected', 'expired'] as const).map(s => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  statusFilter === s
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="overflow-hidden border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{summary.pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Total: M{summary.pendingValue.toLocaleString()}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="overflow-hidden border-emerald-200/50 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-900/10">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{summary.acceptedCount}</p>
                  <p className="text-xs text-muted-foreground">Total: M{summary.acceptedValue.toLocaleString()}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden border-red-200/50 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10">
            <div className="h-1 bg-gradient-to-r from-red-400 to-red-500" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">{summary.rejectedCount}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quotation Table */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Quote #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Delivery</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Amount (M)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Est. Days</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Valid Until</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                        No quotations found
                      </td>
                    </tr>
                  )}
                  {paginated.map((q, i) => {
                    const cfg = statusConfig[q.status];
                    return (
                      <motion.tr
                        key={q.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className={`border-b transition-colors last:border-0 hover:bg-muted/30 ${getRowBorderClass(q.status)}`}
                      >
                        <td className="px-4 py-3">
                          <code className="text-xs font-semibold text-primary">{q.id.toUpperCase()}</code>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs text-muted-foreground">{q.trackingNumber}</code>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">{q.customerName}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-semibold">{q.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm">{q.estimatedDays}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground">{formatDate(q.validUntil)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={`border-0 ${cfg.color} text-[11px] shadow-sm`}>
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            onClick={() => openDetail(q)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            <div className="divide-y">
              {paginated.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">No quotations found</div>
              )}
              {paginated.map((q, i) => {
                const cfg = statusConfig[q.status];
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-semibold text-primary">{q.id.toUpperCase()}</code>
                        <Badge className={`border-0 ${cfg.color} text-[10px]`}>{cfg.label}</Badge>
                      </div>
                      <p className="mt-0.5 text-sm font-medium truncate">{q.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        <code>{q.trackingNumber}</code> • {q.estimatedDays} days
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold">M{q.amount.toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(q.validUntil)}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 shrink-0" onClick={() => openDetail(q)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={page === p ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8 text-xs"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg overflow-hidden">
          <div className="h-1 gradient-top-bar" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quotation Details
            </DialogTitle>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-4">
              {/* Status & Quote # */}
              <div className="flex items-center justify-between">
                <code className="text-lg font-bold text-primary">{selectedQuote.id.toUpperCase()}</code>
                <Badge className={`border-0 ${statusConfig[selectedQuote.status].color}`}>
                  {statusConfig[selectedQuote.status].label}
                </Badge>
              </div>

              <Separator />

              {/* Quotation Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Package className="h-3.5 w-3.5" />
                    Delivery Reference
                  </p>
                  <p className="text-sm font-medium">{selectedQuote.trackingNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    Customer
                  </p>
                  <p className="text-sm font-medium">{selectedQuote.customerName}</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    Route
                  </p>
                  <p className="text-sm font-medium">
                    {selectedQuote.pickupCity} → {selectedQuote.destCity}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    Amount
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {selectedQuote.currency}{selectedQuote.amount.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Estimated Delivery
                  </p>
                  <p className="text-sm font-medium">{selectedQuote.estimatedDays} days</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Valid Until
                  </p>
                  <p className="text-sm font-medium">{formatDate(selectedQuote.validUntil)}</p>
                </div>
              </div>

              <Separator />

              {/* Status Timeline */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status History
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-3 w-3 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Quotation Created</p>
                      <p className="text-xs text-muted-foreground">{formatDate(selectedQuote.createdAt)}</p>
                    </div>
                  </div>
                  {selectedQuote.status === 'pending' && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Awaiting Customer Response</p>
                        <p className="text-xs text-muted-foreground">Valid until {formatDate(selectedQuote.validUntil)}</p>
                      </div>
                    </div>
                  )}
                  {(selectedQuote.status === 'accepted' || selectedQuote.status === 'rejected') && (
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        selectedQuote.status === 'accepted' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {selectedQuote.status === 'accepted'
                          ? <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          : <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                        }
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {selectedQuote.status === 'accepted' ? 'Quotation Accepted' : 'Quotation Rejected'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedQuote.status === 'accepted'
                            ? 'Delivery can now proceed to dispatch'
                            : 'Customer has declined the quotation'}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedQuote.status === 'expired' && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/30">
                        <AlertTriangle className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Quotation Expired</p>
                        <p className="text-xs text-muted-foreground">Expired on {formatDate(selectedQuote.validUntil)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {selectedQuote?.status === 'pending' && (
              <>
                <Button variant="destructive" className="gap-1.5" onClick={handleReject}>
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button className="gap-1.5 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white" onClick={handleAccept}>
                  <CheckCircle className="h-4 w-4" />
                  Accept
                </Button>
              </>
            )}
            {selectedQuote?.status === 'accepted' && (
              <Button className="gap-1.5" onClick={handleGenerateInvoice}>
                <FileOutput className="h-4 w-4" />
                Generate Invoice
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}