'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { sourcingRequests } from '@/lib/mock-data';
import type { SourcingStatus, SourcingRequest } from '@/lib/types';
import {
  ShoppingBag, Plus, Search, ChevronRight, DollarSign,
  MapPin, Calendar, Clock, User, Link as LinkIcon, Globe,
  CheckCircle, XCircle, Eye, AlertTriangle, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Helpers ──────────────────────────────────────────────────
const sourcingStatusColors: Record<SourcingStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  quoted: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  accepted: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  purchased: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const sourcingStatusLabels: Record<SourcingStatus, string> = {
  pending: 'Pending',
  quoted: 'Quoted',
  accepted: 'Accepted',
  purchased: 'Purchased',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const statusFlow: SourcingStatus[] = ['pending', 'quoted', 'accepted', 'purchased', 'delivered'];

const statusLeftBorder: Partial<Record<SourcingStatus, string>> = {
  pending: 'border-l-amber-400',
  quoted: 'border-l-blue-400',
  accepted: 'border-l-emerald-400',
  purchased: 'border-l-emerald-400',
  delivered: 'border-l-emerald-400',
  cancelled: 'border-l-red-400',
};

// ── Main Component ──────────────────────────────────────────
export function SourcingTab() {
  const { currentUser } = useAuthStore();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [localRequests, setLocalRequests] = useState(sourcingRequests);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SourcingRequest | null>(null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    productName: '', description: '', storeName: '', productLink: '', budget: '', deadline: '', location: '',
  });

  const filtered = useMemo(() => {
    let items = localRequests;
    if (tab !== 'all') {
      items = items.filter(r => r.status === tab);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(r =>
        r.productName.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    }
    return items;
  }, [localRequests, tab, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: localRequests.length };
    for (const r of localRequests) {
      c[r.status] = (c[r.status] || 0) + 1;
    }
    return c;
  }, [localRequests]);

  function openDetail(req: SourcingRequest) {
    setSelectedRequest(req);
    setDetailDialogOpen(true);
  }

  function handleNewSubmit() {
    if (!newForm.productName || !newForm.budget) {
      toast.error('Please fill in product name and budget');
      return;
    }
    const newReq: SourcingRequest = {
      id: `src-${String(localRequests.length + 1).padStart(3, '0')}`,
      customerId: currentUser?.id || 'cust-new',
      customerName: currentUser?.name || 'Current User',
      productName: newForm.productName,
      description: newForm.description || undefined,
      storeName: newForm.storeName || undefined,
      productLink: newForm.productLink || undefined,
      budget: parseFloat(newForm.budget) || undefined,
      deadline: newForm.deadline || undefined,
      location: newForm.location || 'Maseru',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalRequests(prev => [newReq, ...prev]);
    toast.success('Sourcing Request Created', { description: `${newForm.productName} has been submitted` });
    setNewDialogOpen(false);
    setNewForm({ productName: '', description: '', storeName: '', productLink: '', budget: '', deadline: '', location: '' });
  }

  function handleAcceptQuote(reqId: string) {
    setLocalRequests(prev => prev.map(r =>
      r.id === reqId ? { ...r, status: 'accepted' as SourcingStatus, updatedAt: new Date().toISOString() } : r
    ));
    toast.success('Quote Accepted', { description: 'The sourcing request has been accepted' });
    setDetailDialogOpen(false);
  }

  function handleRejectQuote(reqId: string) {
    setLocalRequests(prev => prev.map(r =>
      r.id === reqId ? { ...r, status: 'pending' as SourcingStatus, quotedPrice: undefined, agentId: undefined, agentName: undefined, updatedAt: new Date().toISOString() } : r
    ));
    toast.info('Quote Rejected', { description: 'The quote has been rejected and request returned to pending' });
    setDetailDialogOpen(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              Sourcing Requests
              <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
            </h2>
            <p className="text-sm text-muted-foreground">Manage product sourcing requests</p>
          </div>
        </div>
        <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New Sourcing Request</DialogTitle>
              <DialogDescription>Describe the product you need sourced</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    placeholder="e.g. Samsung Galaxy S24"
                    value={newForm.productName}
                    onChange={e => setNewForm(f => ({ ...f, productName: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Specifications, color, size, etc."
                    rows={3}
                    value={newForm.description}
                    onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input
                    placeholder="e.g. Takealot"
                    value={newForm.storeName}
                    onChange={e => setNewForm(f => ({ ...f, storeName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Budget (M) *</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    value={newForm.budget}
                    onChange={e => setNewForm(f => ({ ...f, budget: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Link</Label>
                  <Input
                    placeholder="https://..."
                    value={newForm.productLink}
                    onChange={e => setNewForm(f => ({ ...f, productLink: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={newForm.deadline}
                    onChange={e => setNewForm(f => ({ ...f, deadline: e.target.value }))}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g. Maseru"
                    value={newForm.location}
                    onChange={e => setNewForm(f => ({ ...f, location: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleNewSubmit} className="gap-2">
                <Plus className="h-4 w-4" />
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by product, customer, or location..."
          className="pl-8"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full overflow-x-auto">
          {['all', 'pending', 'quoted', 'accepted', 'purchased', 'delivered'].map(t => (
            <TabsTrigger key={t} value={t} className="capitalize relative data-[state=active]:shadow-none">
              {t === tab && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-teal-500 rounded-full" />}
              {t}
              {counts[t] !== undefined && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                  {counts[t]}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-3">
              {filtered.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="mb-3 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No sourcing requests found</p>
                  </CardContent>
                </Card>
              )}
              {filtered.map((req, i) => {
                const deadlineWarning = req.deadline ? daysUntil(req.deadline) <= 3 && daysUntil(req.deadline) > 0 : false;
                const deadlineOverdue = req.deadline ? daysUntil(req.deadline) <= 0 : false;
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card className={`transition-shadow hover:shadow-md overflow-hidden border-l-[3px] ${statusLeftBorder[req.status] || ''}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          {/* Left info */}
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{req.productName}</h3>
                              <Badge className={sourcingStatusColors[req.status]}>
                                {sourcingStatusLabels[req.status]}
                              </Badge>
                              {deadlineWarning && (
                                <Badge variant="outline" className="border-amber-300 text-amber-600 dark:border-amber-600 dark:text-amber-400">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Deadline soon
                                </Badge>
                              )}
                              {deadlineOverdue && req.status !== 'delivered' && req.status !== 'cancelled' && (
                                <Badge variant="outline" className="border-red-300 text-red-600 dark:border-red-600 dark:text-red-400">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Overdue
                                </Badge>
                              )}
                            </div>
                            {req.description && (
                              <p className="text-sm text-muted-foreground">{req.description}</p>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{req.customerName}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{req.location}</span>
                              {req.storeName && (
                                <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{req.storeName}</span>
                              )}
                              {req.deadline && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(req.deadline)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: price + actions */}
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <div className="text-right">
                              {req.budget && (
                                <div className="text-xs text-muted-foreground">Budget</div>
                              )}
                              {req.budget && (
                                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                  M{req.budget.toLocaleString()}
                                </p>
                              )}
                              {req.quotedPrice !== undefined && (
                                <div className="mt-1">
                                  <div className="text-xs text-muted-foreground">Quoted</div>
                                  <p className="text-sm font-bold text-primary">
                                    M{req.quotedPrice.toLocaleString()}
                                  </p>
                                  {req.budget && (
                                    <p className={`text-xs ${req.quotedPrice <= req.budget ? 'text-green-600' : 'text-red-600'}`}>
                                      {req.quotedPrice <= req.budget ? 'Under budget' : 'Over budget'}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {req.status === 'quoted' && (
                                <>
                                  <Button size="sm" variant="outline" className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20" onClick={() => handleAcceptQuote(req.id)}>
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Accept
                                  </Button>
                                  <Button size="sm" variant="ghost" className="gap-1 text-red-500 hover:text-red-600" onClick={() => handleRejectQuote(req.id)}>
                                    <XCircle className="h-3.5 w-3.5" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline" className="gap-1" onClick={() => openDetail(req)}>
                                <Eye className="h-3.5 w-3.5" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Agent info bar */}
                        {req.agentName && (
                          <Separator className="my-2" />
                        )}
                        {req.agentName && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span>Agent: <span className="font-medium text-foreground">{req.agentName}</span></span>
                            <span className="mx-1">•</span>
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated {timeAgo(req.updatedAt)}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Sourcing Request Details
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-3">
                {/* Product Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{selectedRequest.productName}</h3>
                    {selectedRequest.description && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedRequest.description}</p>
                    )}
                  </div>
                  <Badge className={sourcingStatusColors[selectedRequest.status]}>
                    {sourcingStatusLabels[selectedRequest.status]}
                  </Badge>
                </div>

                <Separator />

                {/* Customer & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Customer</p>
                    <p className="text-sm font-medium">{selectedRequest.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Location</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />{selectedRequest.location}
                    </p>
                  </div>
                </div>

                {/* Budget vs Quoted */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                    <p className="text-xs text-amber-600 dark:text-amber-400">Budget</p>
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                      M{selectedRequest.budget?.toLocaleString() || '—'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-3">
                    <p className="text-xs text-primary">Quoted Price</p>
                    <p className="text-xl font-bold text-primary">
                      {selectedRequest.quotedPrice !== undefined
                        ? `M${selectedRequest.quotedPrice.toLocaleString()}`
                        : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* Store & Link */}
                {selectedRequest.storeName && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Store</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />{selectedRequest.storeName}
                    </p>
                  </div>
                )}
                {selectedRequest.productLink && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Product Link</p>
                    <a
                      href={selectedRequest.productLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      {selectedRequest.productLink}
                    </a>
                  </div>
                )}

                {/* Deadline */}
                {selectedRequest.deadline && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(selectedRequest.deadline)}
                      {(() => {
                        const d = daysUntil(selectedRequest.deadline);
                        if (d <= 0 && selectedRequest.status !== 'delivered') {
                          return <Badge variant="destructive" className="ml-2 text-xs">Overdue</Badge>;
                        }
                        if (d <= 3) {
                          return <Badge variant="outline" className="ml-2 border-amber-300 text-amber-600 text-xs">Soon</Badge>;
                        }
                        return null;
                      })()}
                    </p>
                  </div>
                )}

                {/* Agent */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Assigned Agent</p>
                  {selectedRequest.agentName ? (
                    <div className="flex items-center gap-2 rounded-lg border p-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {selectedRequest.agentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium">{selectedRequest.agentName}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No agent assigned yet</p>
                  )}
                </div>

                {/* Timeline */}
                <Separator />
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">Status Timeline</p>
                  {/* Horizontal gradient progress bar */}
                  <div className="relative mb-2">
                    <div className="h-2 w-full rounded-full bg-muted" />
                    {(() => {
                      const currentIdx = statusFlow.indexOf(selectedRequest.status);
                      if (currentIdx < 0) return null;
                      const progress = (currentIdx / (statusFlow.length - 1)) * 100;
                      return (
                        <div
                          className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-primary to-teal-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      );
                    })()}
                  </div>
                  <div className="flex justify-between">
                    {statusFlow.map((status, idx) => {
                      const currentIdx = statusFlow.indexOf(selectedRequest.status);
                      const isActive = idx <= currentIdx;
                      const isCurrent = status === selectedRequest.status;
                      return (
                        <div key={status} className="flex flex-col items-center gap-1">
                          <div className={`h-2.5 w-2.5 rounded-full border-2 transition-colors ${isCurrent ? 'border-primary bg-primary' : isActive ? 'border-teal-500 bg-teal-500' : 'border-muted-foreground/30 bg-background'}`} />
                          <span className={`text-[10px] ${isCurrent ? 'font-semibold text-primary' : isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {sourcingStatusLabels[status]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timestamps */}
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Created:</span> {formatDate(selectedRequest.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {formatDate(selectedRequest.updatedAt)}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            {selectedRequest?.status === 'quoted' && (
              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1 gap-1 text-red-500" onClick={() => selectedRequest && handleRejectQuote(selectedRequest.id)}>
                  <XCircle className="h-4 w-4" />
                  Reject Quote
                </Button>
                <Button className="flex-1 gap-1" onClick={() => selectedRequest && handleAcceptQuote(selectedRequest.id)}>
                  <CheckCircle className="h-4 w-4" />
                  Accept Quote
                </Button>
              </div>
            )}
            {(!selectedRequest || selectedRequest.status !== 'quoted') && (
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}