'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { toast } from 'sonner';
import { useNavStore, useAuthStore } from '@/lib/store';
import {
  deliveries as initialDeliveries,
  statusLabels,
  statusColors,
  priorityColors,
  getDeliveryTimeline,
  customers,
} from '@/lib/mock-data';
import type { Delivery, DeliveryStatus, DeliveryPriority } from '@/lib/types';
import {
  Package, Search, MapPin, ArrowRight, Plus, X, Clock, Truck, CheckCircle2,
  Circle, MoreHorizontal, Eye, LayoutGrid, List, ChevronUp, ChevronDown,
  FileText, UserPlus, Calendar, Phone, Building2, Weight, Star, Camera, User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 15;

type SortField = 'trackingNumber' | 'customerName' | 'status' | 'priority' | 'createdAt' | 'packageWeight';
type SortDir = 'asc' | 'desc';
type ViewMode = 'table' | 'cards';

// Status order for progress tracking
const STATUS_ORDER: DeliveryStatus[] = [
  'request_received', 'awaiting_quote', 'quote_accepted', 'collected',
  'at_warehouse', 'in_transit', 'at_border', 'out_for_delivery', 'delivered',
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Sort icon outside render
function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ChevronDown className="ml-1 h-3 w-3 opacity-30" />;
  return sortDir === 'asc'
    ? <ChevronUp className="ml-1 h-3 w-3 text-primary" />
    : <ChevronDown className="ml-1 h-3 w-3 text-primary" />;
}

// New Delivery Form
function NewDeliveryForm({ onSuccess }: { onSuccess: (d: Delivery) => void }) {
  const { currentUser } = useAuthStore();
  const isCustomer = currentUser?.role === 'customer';
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState(isCustomer ? (currentUser?.name ?? '') : '');
  const [pickupName, setPickupName] = useState('');
  const [pickupPhone, setPickupPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupCountry, setPickupCountry] = useState('South Africa');
  const [destName, setDestName] = useState('');
  const [destPhone, setDestPhone] = useState('');
  const [destAddress, setDestAddress] = useState('');
  const [destCity, setDestCity] = useState('');
  const [destCountry, setDestCountry] = useState('Lesotho');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgWeight, setPkgWeight] = useState('');
  const [pkgDimensions, setPkgDimensions] = useState('');
  const [priority, setPriority] = useState<DeliveryPriority>('standard');
  const [estDelivery, setEstDelivery] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!customerName || !pickupCity || !destCity || !pkgDesc) {
      toast.error('Please fill in required fields (Customer, Pickup City, Destination City, Description)');
      return;
    }
    const newDelivery: Delivery = {
      id: `del-new-${Date.now()}`,
      trackingNumber: `SF${String(2025501 + Math.floor(Math.random() * 9000)).padStart(8, '0')}LS`,
      status: 'request_received',
      priority,
      customerId: 'cust-new',
      customerName,
      companyId: 'comp-001',
      companyName: 'Mountain Express',
      pickup: { name: pickupName || customerName, phone: pickupPhone, address: pickupAddress, city: pickupCity, country: pickupCountry },
      destination: { name: destName || customerName, phone: destPhone, address: destAddress, city: destCity, country: destCountry },
      packageDescription: pkgDesc,
      packageWeight: parseFloat(pkgWeight) || 0,
      packageDimensions: pkgDimensions || undefined,
      quotedAmount: undefined,
      paidAmount: undefined,
      estimatedDelivery: estDelivery || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes || undefined,
    };
    onSuccess(newDelivery);
    setOpen(false);
    if (isCustomer) {
      toast.success('Delivery request submitted!', { description: `Tracking #${newDelivery.trackingNumber}` });
    } else {
      toast.success('Delivery created successfully!', { description: `Tracking #${newDelivery.trackingNumber}` });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> {isCustomer ? 'Request Delivery' : 'New Delivery'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Delivery</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Customer */}
          {!isCustomer && (
            <div className="grid gap-2">
              <Label>Customer *</Label>
              <Input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
          )}
          <Separator />
          {/* Pickup */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" /> Pickup Address
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1"><Label className="text-xs">Name</Label><Input placeholder="Contact name" value={pickupName} onChange={(e) => setPickupName(e.target.value)} /></div>
              <div className="grid gap-1"><Label className="text-xs">Phone</Label><Input placeholder="+266 ..." value={pickupPhone} onChange={(e) => setPickupPhone(e.target.value)} /></div>
              <div className="col-span-2 grid gap-1"><Label className="text-xs">Address</Label><Input placeholder="Street address" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} /></div>
              <div className="grid gap-1"><Label className="text-xs">City *</Label><Input placeholder="e.g. Johannesburg" value={pickupCity} onChange={(e) => setPickupCity(e.target.value)} /></div>
              <div className="grid gap-1">
                <Label className="text-xs">Country</Label>
                <Select value={pickupCountry} onValueChange={setPickupCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="Lesotho">Lesotho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Separator />
          {/* Destination */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" /> Destination Address
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1"><Label className="text-xs">Name</Label><Input placeholder="Recipient name" value={destName} onChange={(e) => setDestName(e.target.value)} /></div>
              <div className="grid gap-1"><Label className="text-xs">Phone</Label><Input placeholder="+266 ..." value={destPhone} onChange={(e) => setDestPhone(e.target.value)} /></div>
              <div className="col-span-2 grid gap-1"><Label className="text-xs">Address</Label><Input placeholder="Street address" value={destAddress} onChange={(e) => setDestAddress(e.target.value)} /></div>
              <div className="grid gap-1"><Label className="text-xs">City *</Label><Input placeholder="e.g. Maseru" value={destCity} onChange={(e) => setDestCity(e.target.value)} /></div>
              <div className="grid gap-1">
                <Label className="text-xs">Country</Label>
                <Select value={destCountry} onValueChange={setDestCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lesotho">Lesotho</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Separator />
          {/* Package */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Package className="h-4 w-4" /> Package Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 grid gap-1"><Label className="text-xs">Description *</Label><Input placeholder="e.g. Electronics x2" value={pkgDesc} onChange={(e) => setPkgDesc(e.target.value)} /></div>
              <div className="grid gap-1"><Label className="text-xs">Weight (kg)</Label><Input type="number" placeholder="0.0" value={pkgWeight} onChange={(e) => setPkgWeight(e.target.value)} /></div>
              <div className="grid gap-1"><Label className="text-xs">Dimensions</Label><Input placeholder="L x W x H cm" value={pkgDimensions} onChange={(e) => setPkgDimensions(e.target.value)} /></div>
              <div className="grid gap-1">
                <Label className="text-xs">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as DeliveryPriority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1"><Label className="text-xs">Est. Delivery</Label><Input type="date" value={estDelivery} onChange={(e) => setEstDelivery(e.target.value)} /></div>
              <div className="col-span-2 grid gap-1"><Label className="text-xs">Notes</Label><Textarea placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit}>Create Delivery</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Delivery Detail Sheet
function DeliveryDetailPanel({ delivery, open, onClose }: { delivery: Delivery | null; open: boolean; onClose: () => void }) {
  if (!delivery) return null;
  const timeline = getDeliveryTimeline(delivery);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-4 sticky top-0 bg-background z-10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <SheetTitle className="font-mono text-sm">{delivery.trackingNumber}</SheetTitle>
              <Badge className={statusColors[delivery.status] || ''} variant="secondary">
                {statusLabels[delivery.status] || delivery.status}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="px-6 py-4 space-y-6">
          {/* Rating (for delivered) */}
          {delivery.status === 'delivered' && delivery.rating && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{delivery.rating}</span>
              <span className="text-xs text-muted-foreground">Customer Rating</span>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Delivery Timeline</h3>
            <div className="relative pl-6">
              {timeline.map((event, idx) => {
                const isLast = idx === timeline.length - 1;
                const isCurrent = idx === timeline.length - 1 && !['delivered', 'returned', 'cancelled'].includes(delivery.status);
                return (
                  <div key={event.id} className="relative pb-6 last:pb-0">
                    {/* Connecting line */}
                    {!isLast && (
                      <div className="absolute left-[-18px] top-6 bottom-0 w-px bg-green-200 dark:bg-green-800" />
                    )}
                    {/* Dot */}
                    <div className={`absolute left-[-22px] top-1.5 h-3 w-3 rounded-full border-2 ${
                      isCurrent
                        ? 'bg-green-500 border-green-500 animate-pulse'
                        : 'bg-green-500 border-green-500'
                    }`} />
                    <div className="ml-2">
                      <p className="text-sm font-medium">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.location}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                        {event.performedBy && (
                          <span className="text-xs text-muted-foreground">by {event.performedBy}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Package Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4" /> Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span>{delivery.packageDescription}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Weight</span><span>{delivery.packageWeight} kg</span></div>
              {delivery.packageDimensions && (
                <div className="flex justify-between"><span className="text-muted-foreground">Dimensions</span><span>{delivery.packageDimensions}</span></div>
              )}
              {delivery.declaredValue && (
                <div className="flex justify-between"><span className="text-muted-foreground">Declared Value</span><span>M{delivery.declaredValue.toLocaleString()}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">Priority</span>
                <Badge className={`${priorityColors[delivery.priority] || ''} capitalize`} variant="secondary">{delivery.priority}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pickup & Destination */}
          <div className="grid grid-cols-1 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" /> Pickup
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{delivery.pickup.name}</p>
                {delivery.pickup.phone && <p className="text-muted-foreground">{delivery.pickup.phone}</p>}
                <p className="text-muted-foreground">{delivery.pickup.address}</p>
                <p className="text-muted-foreground">{delivery.pickup.city}, {delivery.pickup.country}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" /> Destination
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{delivery.destination.name}</p>
                {delivery.destination.phone && <p className="text-muted-foreground">{delivery.destination.phone}</p>}
                <p className="text-muted-foreground">{delivery.destination.address}</p>
                <p className="text-muted-foreground">{delivery.destination.city}, {delivery.destination.country}</p>
              </CardContent>
            </Card>
          </div>

          {/* Driver & Vehicle */}
          {delivery.driverName && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Driver & Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 text-xs font-bold">
                    {delivery.driverName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium">{delivery.driverName}</span>
                </div>
                {delivery.vehiclePlate && (
                  <p className="text-muted-foreground">Vehicle: {delivery.vehiclePlate}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quotation */}
          {delivery.quotedAmount && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quoted Amount</span>
                  <span className="text-lg font-bold text-green-600">M{delivery.quotedAmount.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Update Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {STATUS_ORDER.map((s) => (
                    <DropdownMenuItem key={s} onClick={() => toast.info(`Status would be updated to ${statusLabels[s]}`)}>
                      {s === delivery.status && <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />}
                      {statusLabels[s]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={() => toast.info('Driver assignment dialog would open')}>
                <UserPlus className="mr-2 h-4 w-4" /> Assign Driver
              </Button>
              {delivery.status === 'delivered' && !delivery.rating && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    toast.success('Rating submitted! Thank you for your feedback.');
                  }}
                >
                  <Star className="h-3.5 w-3.5" />
                  Rate Delivery
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => toast.info('Invoice generation would start')}>
                <FileText className="mr-2 h-4 w-4" /> Generate Invoice
              </Button>
            </div>
          </div>

          {/* Proof of Delivery */}
          {(delivery.status === 'delivered' || delivery.status === 'returned') && (
            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Proof of Delivery
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Received by</p>
                    <p className="text-xs text-muted-foreground">{delivery.destination.name}</p>
                  </div>
                </div>

                {/* Signature area */}
                <div className="rounded-lg border border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10 p-4">
                  <p className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Digital Signature</p>
                  <div className="flex items-center gap-2">
                    <div className="h-6 flex-1 border-b-2 border-emerald-400 font-cursive text-lg text-emerald-700 italic">
                      {delivery.destination.name}
                    </div>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Signed on {delivery.actualDelivery ? formatDate(delivery.actualDelivery) : 'N/A'}
                  </p>
                </div>

                {/* Photo proof area */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Delivery Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Package at doorstep', 'Recipient with package', 'Delivery location'].map((label, i) => (
                      <div key={i} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed bg-muted/30 p-2 text-center">
                        <Camera className="h-5 w-5 text-muted-foreground/50" />
                        <span className="text-[10px] text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-center text-[10px] text-muted-foreground">
                    {delivery.actualDelivery ? `Uploaded on ${formatDate(delivery.actualDelivery)}` : 'Photos uploaded upon delivery'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status History */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Status History</h3>
            <div className="space-y-2 text-sm">
              {timeline.slice().reverse().map((event) => (
                <div key={event.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                  <Badge className={`${statusColors[event.status] || ''} shrink-0 text-xs`} variant="secondary">
                    {statusLabels[event.status]?.replace(' ', '\u00A0')}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs">{formatDateTime(event.timestamp)}</p>
                    <p className="truncate">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div className="text-xs text-muted-foreground space-y-1 pb-6">
            <p>Created: {formatDateTime(delivery.createdAt)}</p>
            <p>Updated: {timeAgo(delivery.updatedAt)}</p>
            {delivery.notes && <p>Notes: {delivery.notes}</p>}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Deliveries Tab
export function DeliveriesTab() {
  const { selectDelivery, selectedDeliveryId } = useNavStore();
  const { currentUser } = useAuthStore();
  const isCustomer = currentUser?.role === 'customer';
  const isDriver = currentUser?.role === 'driver';

  // Role-filtered base deliveries
  const baseDeliveries = useMemo(() => {
    if (isCustomer && currentUser) {
      return initialDeliveries.filter((d) => d.customerId === currentUser.id);
    }
    if (isDriver && currentUser) {
      return initialDeliveries.filter((d) => d.driverId === currentUser.id);
    }
    return initialDeliveries;
  }, [isCustomer, isDriver, currentUser]);

  // Local delivery state (allows adding new)
  const [localDeliveries, setLocalDeliveries] = useState<Delivery[]>(baseDeliveries);
  const addDelivery = useCallback((d: Delivery) => {
    setLocalDeliveries((prev) => [d, ...prev]);
  }, []);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Detail panel
  const detailDelivery = useMemo(
    () => localDeliveries.find((d) => d.id === selectedDeliveryId) ?? null,
    [localDeliveries, selectedDeliveryId]
  );

  // Filtered & sorted
  const filtered = useMemo(() => {
    let result = [...localDeliveries];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.trackingNumber.toLowerCase().includes(s) ||
          d.customerName.toLowerCase().includes(s)
      );
    }
    if (statusFilter !== 'all') result = result.filter((d) => d.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter((d) => d.priority === priorityFilter);

    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'trackingNumber': return a.trackingNumber.localeCompare(b.trackingNumber) * dir;
        case 'customerName': return a.customerName.localeCompare(b.customerName) * dir;
        case 'status': return a.status.localeCompare(b.status) * dir;
        case 'priority': return a.priority.localeCompare(b.priority) * dir;
        case 'packageWeight': return (a.packageWeight - b.packageWeight) * dir;
        case 'createdAt': return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
        default: return 0;
      }
    });
    return result;
  }, [localDeliveries, search, statusFilter, priorityFilter, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((d) => d.id)));
    }
  };

  const openDetail = (id: string) => {
    selectDelivery(id);
  };

  const closeDetail = () => {
    selectDelivery(null);
  };

  // Reset page when filters change
  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleStatusFilter = (v: string) => { setStatusFilter(v); setPage(1); };
  const handlePriorityFilter = (v: string) => { setPriorityFilter(v); setPage(1); };

  // Pagination helper
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {isCustomer ? 'My Shipments' : isDriver ? 'My Jobs' : 'Deliveries'}
          </h1>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {filtered.length}
          </Badge>
        </div>
        <NewDeliveryForm onSuccess={addDelivery} />
      </div>

      {/* Gradient divider below header */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tracking # or customer..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={handlePriorityFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="express">Express</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center rounded-md border">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="icon"
            className="rounded-r-none"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="icon"
            className="rounded-l-none"
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={paged.length > 0 && selected.size === paged.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('trackingNumber')}>
                    <span className="flex items-center">Tracking #<SortIcon field="trackingNumber" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('customerName')}>
                    <span className="flex items-center">Customer<SortIcon field="customerName" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('packageWeight')}>
                    <span className="flex items-center">Weight<SortIcon field="packageWeight" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('status')}>
                    <span className="flex items-center">Status<SortIcon field="status" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('priority')}>
                    <span className="flex items-center">Priority<SortIcon field="priority" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('createdAt')}>
                    <span className="flex items-center">Date<SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12">
                      <div className="flex flex-col items-center py-4 mx-auto max-w-xs border-2 border-dashed border-muted-foreground/20 rounded-xl">
                        <Package className="h-12 w-12 mb-3 opacity-30 text-primary/40" />
                        <p className="text-lg font-medium text-muted-foreground">No deliveries found</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((d, idx) => (
                    <TableRow
                      key={d.id}
                      className={`cursor-pointer transition-all duration-150 hover:bg-muted/50 ${
                        idx % 2 === 1 ? 'bg-muted/20' : ''
                      } ${selected.has(d.id) ? 'bg-green-50/50 dark:bg-green-900/10' : ''} ${d.priority === 'urgent' ? 'border-l-2 border-l-red-400' : d.priority === 'express' ? 'border-l-2 border-l-amber-400' : ''}`}
                      onClick={() => openDetail(d.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selected.has(d.id)} onCheckedChange={() => toggleSelect(d.id)} />
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm font-medium text-green-700 dark:text-green-400 hover:underline">
                          {d.trackingNumber}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{d.customerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-[140px]">
                          <MapPin className="h-3 w-3 shrink-0 text-green-600" />
                          <span className="truncate">{d.pickup.city}</span>
                          <ArrowRight className="h-3 w-3 shrink-0" />
                          <span className="truncate">{d.destination.city}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{d.packageWeight} kg</TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[d.status] || ''} gap-1.5`} variant="secondary">
                          <span className="h-1.5 w-1.5 rounded-full bg-current/60" />
                          {statusLabels[d.status] || d.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${priorityColors[d.priority] || ''} capitalize`} variant="secondary">
                          {d.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {d.driverName || <span className="text-muted-foreground">Unassigned</span>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(d.createdAt)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetail(d.id)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info('Edit delivery dialog would open')}>
                              <FileText className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => toast.info('Delivery would be cancelled')}
                            >
                              Cancel Delivery
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-muted/30">
            <div className="text-sm text-muted-foreground">
              {selected.size > 0 ? (
                <span className="font-medium text-green-700 dark:text-green-400">{selected.size} selected</span>
              ) : (
                <span>{filtered.length} deliver{filtered.length === 1 ? 'y' : 'ies'}</span>
              )}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={safePage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {getPageNumbers().map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === safePage}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={safePage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <>
          {paged.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <div className="flex flex-col items-center py-4 mx-auto max-w-xs border-2 border-dashed border-muted-foreground/20 rounded-xl">
                <Package className="h-12 w-12 mb-3 opacity-30 text-primary/40" />
                <p className="text-lg font-medium text-muted-foreground">No deliveries found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paged.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-l-4 ${d.priority === 'urgent' ? 'border-l-red-400 hover:border-l-red-400' : d.priority === 'express' ? 'border-l-amber-400 hover:border-l-amber-400' : 'border-l-primary/30 hover:border-l-primary/50'}`}
                    onClick={() => openDetail(d.id)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-sm font-medium text-green-700 dark:text-green-400">
                          {d.trackingNumber}
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                          <Badge className={`${priorityColors[d.priority] || ''} capitalize text-xs`} variant="secondary">
                            {d.priority}
                          </Badge>
                          <Badge className={`${statusColors[d.status] || ''} text-xs`} variant="secondary">
                            {statusLabels[d.status] || d.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="font-medium text-sm">{d.customerName}</p>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-green-600 shrink-0" />
                        <span className="truncate">{d.pickup.city}</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{d.destination.city}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Weight className="h-3 w-3" /> {d.packageWeight} kg
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" /> {d.driverName || 'Unassigned'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatDate(d.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {/* Card view pagination */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={safePage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === safePage}
                        onClick={() => setPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={safePage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Detail Panel */}
      <DeliveryDetailPanel delivery={detailDelivery} open={!!selectedDeliveryId} onClose={closeDetail} />
    </div>
  );
}