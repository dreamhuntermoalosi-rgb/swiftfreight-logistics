'use client';

import { useState, useMemo, useCallback } from 'react';

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
  Download, CheckCircle, Printer, CreditCard, Columns3, ShieldAlert, ShieldCheck,
  AlertTriangle, Box, Droplets, Monitor, FileCheck, ClipboardCheck,
} from 'lucide-react';
import { PackageDeclarationForm } from '@/components/dashboard/package-declaration-form';

const ITEMS_PER_PAGE = 15;

type SortField = 'trackingNumber' | 'customerName' | 'status' | 'priority' | 'createdAt' | 'packageWeight';
type SortDir = 'asc' | 'desc';
type ViewMode = 'table' | 'cards';

function downloadCSV(data: string[][], filename: string) {
  const csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Status order for progress tracking
const STATUS_ORDER: DeliveryStatus[] = [
  'request_received', 'awaiting_quote', 'quote_accepted', 'collected',
  'at_warehouse', 'in_transit', 'at_border', 'out_for_delivery', 'delivered',
];

function generatePOD(delivery: Delivery) {
  const deliveryDate = delivery.actualDelivery ? new Date(delivery.actualDelivery) : new Date();
  const dateStr = deliveryDate.toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = deliveryDate.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  const statusLabel = statusLabels[delivery.status] || delivery.status;

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Proof of Delivery - ${delivery.trackingNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1a1a2e; background: #fff; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #059669 0%, #0d9488 50%, #0f766e 100%); color: white; padding: 32px 40px; border-radius: 12px; margin-bottom: 32px; }
    .header h1 { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.8; margin-bottom: 4px; }
    .header h2 { font-size: 28px; font-weight: 800; letter-spacing: 0.5px; }
    .header .tracking { font-size: 14px; opacity: 0.9; margin-top: 8px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #059669; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #d1fae5; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 32px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .field { margin-bottom: 0; }
    .field-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 2px; }
    .field-value { font-size: 15px; font-weight: 600; color: #1a1a2e; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .badge-delivered { background: #d1fae5; color: #065f46; }
    .badge-returned { background: #fef3c7; color: #92400e; }
    .received-section { background: #f0fdf4; border: 2px solid #a7f3d0; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .signature-line { border-bottom: 2px solid #059669; height: 40px; width: 100%; display: flex; align-items: end; padding-bottom: 4px; }
    .signature-text { font-family: 'Georgia', 'Times New Roman', serif; font-style: italic; font-size: 22px; color: #059669; }
    .photo-box { aspect-ratio: 1; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af; font-size: 12px; background: #f9fafb; }
    .photo-box .icon { font-size: 28px; margin-bottom: 4px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 11px; }
    .footer strong { color: #059669; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SwiftFreight Logistics</h1>
      <h2>PROOF OF DELIVERY</h2>
      <div class="tracking">Tracking #: ${delivery.trackingNumber} · ${statusLabel}</div>
    </div>

    <div class="section">
      <div class="section-title">Delivery Details</div>
      <div class="grid">
        <div class="field">
          <div class="field-label">Tracking Number</div>
          <div class="field-value">${delivery.trackingNumber}</div>
        </div>
        <div class="field">
          <div class="field-label">Delivery Date</div>
          <div class="field-value">${dateStr}</div>
        </div>
        <div class="field">
          <div class="field-label">Customer</div>
          <div class="field-value">${delivery.customerName}</div>
        </div>
        <div class="field">
          <div class="field-label">Driver</div>
          <div class="field-value">${delivery.driverName || 'N/A'}</div>
        </div>
        <div class="field">
          <div class="field-label">Route</div>
          <div class="field-value">${delivery.pickup.city} → ${delivery.destination.city}</div>
        </div>
        <div class="field">
          <div class="field-label">Status</div>
          <div class="field-value"><span class="badge ${delivery.status === 'delivered' ? 'badge-delivered' : 'badge-returned'}">${statusLabel}</span></div>
        </div>
        <div class="field">
          <div class="field-label">Package Description</div>
          <div class="field-value">${delivery.packageDescription}</div>
        </div>
        <div class="field">
          <div class="field-label">Weight</div>
          <div class="field-value">${delivery.packageWeight} kg</div>
        </div>
      </div>
    </div>

    <div class="received-section">
      <div class="section-title">Received By</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <div class="field-label">Recipient Name</div>
          <div class="field-value" style="font-size: 18px;">${delivery.destination.name}</div>
        </div>
        <div style="text-align: right;">
          <div class="field-label">Phone</div>
          <div class="field-value">${delivery.destination.phone}</div>
        </div>
      </div>
      <div class="field-label" style="margin-bottom: 8px;">Signature</div>
      <div class="signature-line">
        <div class="signature-text">${delivery.destination.name}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Delivery Photos</div>
      <div class="grid-3">
        <div class="photo-box">
          <div class="icon">📦</div>
          Package at doorstep
        </div>
        <div class="photo-box">
          <div class="icon">🤝</div>
          Recipient with package
        </div>
        <div class="photo-box">
          <div class="icon">📍</div>
          Delivery location
        </div>
      </div>
    </div>

    <div class="section" style="margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280;">
        <span>Timestamp: ${dateStr} at ${timeStr}</span>
        <span>Location: ${delivery.destination.address}, ${delivery.destination.city}, ${delivery.destination.country}</span>
      </div>
    </div>

    <div class="footer">
      <strong>SwiftFreight Logistics Operating System</strong><br>
      Lesotho's Trusted Freight Management Platform<br>
      Generated on ${new Date().toLocaleString('en-ZA')}
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
  }
}

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
        <Button className="text-white">
          <Plus className="mr-2 h-4 w-4" /> {isCustomer ? 'Request Delivery' : 'New Delivery'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
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
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSubmit}>Create Delivery</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Delivery Detail Sheet
// ============ DECLARATION TAG ============
function DeclarationTag({
  icon: Icon,
  label,
  active,
  color,
  activeColor,
  textColor,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  color: string;
  activeColor: string;
  textColor: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors"
      style={{
        backgroundColor: active ? activeColor : color,
        color: active ? textColor : '#9E9E9E',
        border: `1px solid ${active ? textColor : '#E0E0E0'}`,
      }}
    >
      <Icon className="h-3 w-3" />
      {label}
    </div>
  );
}

function DeliveryDetailPanel({ delivery, open, onClose }: { delivery: Delivery | null; open: boolean; onClose: () => void }) {
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

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
            <div className="relative pl-8">
              {timeline.map((event, idx) => {
                const isLast = idx === timeline.length - 1;
                const isCurrent = idx === timeline.length - 1 && !['delivered', 'returned', 'cancelled'].includes(delivery.status);
                const isCompleted = !isCurrent && !isLast;
                const isFinal = ['delivered', 'returned', 'cancelled'].includes(delivery.status) && isLast;

                return (
                  <div key={event.id} className="relative pb-6 last:pb-0">
                    {/* Connecting line */}
                    {!isLast && (
                      <div className="absolute left-[-20px] top-7 bottom-0 w-px bg-green-200 dark:bg-green-800" />
                    )}
                    {/* Status icon */}
                    <div className="absolute left-[-24px] top-1">
                      {isCompleted || isFinal ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-green-500 bg-background">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="ml-1">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-green-700 dark:text-green-400' : ''}`}>{event.description}</p>
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
          <div className="rounded-lg border border-border/50 bg-card">
            <div className="pb-2">
              <h2 className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4" /> Package Details
              </h2>
            </div>
            <div className="text-sm space-y-2">
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
            </div>
          </div>

          {/* Package Declaration */}
          <div className="rounded-lg border border-border/50 bg-card" style={{ backgroundColor: '#F8FFF8', borderColor: '#C8E6C9' }}>
            <div className="pb-2">
              <h2 className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" style={{ color: '#2E7D32' }} /> Package Declaration
                </span>
                <Badge
                  className="text-[10px] font-semibold"
                  style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                >
                  <ShieldCheck className="h-3 w-3 mr-1" /> Accepted
                </Badge>
              </h2>
            </div>
            <div className="text-sm space-y-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', borderColor: '#A5D6A7' }}
                >
                  {delivery.packageWeight > 10 ? 'Large Parcel' : delivery.packageWeight > 2 ? 'Medium Parcel' : 'Small Parcel'}
                </Badge>
                <span className="text-xs" style={{ color: '#9E9E9E' }}>
                  Declared on {new Date(delivery.createdAt).toLocaleDateString('en-LS', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <DeclarationTag icon={AlertTriangle} label="Dangerous Goods" active={delivery.declaredValue != null && delivery.declaredValue > 5000} color="#FEE2E2" activeColor="#FECACA" textColor="#B91C1C" />
                <DeclarationTag icon={Box} label="Fragile" active={delivery.priority === 'urgent'} color="#F3F4F6" activeColor="#FEF3C7" textColor="#92400E" />
                <DeclarationTag icon={Monitor} label="Electronics" active={delivery.packageDescription.toLowerCase().includes('phone') || delivery.packageDescription.toLowerCase().includes('tv') || delivery.packageDescription.toLowerCase().includes('laptop')} color="#F3F4F6" activeColor="#DBEAFE" textColor="#1E40AF" />
                <DeclarationTag icon={Droplets} label="Liquids" active={false} color="#F3F4F6" activeColor="#E0E7FF" textColor="#3730A3" />
                <DeclarationTag icon={FileText} label="Documents" active={delivery.packageWeight < 1} color="#F3F4F6" activeColor="#E8F5E9" textColor="#2E7D32" />
              </div>
              <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ backgroundColor: 'white', border: '1px solid #E0E0E0', color: '#212121' }}>
                &quot;I declare that the contents of this package are accurately described above. The package does not contain any prohibited, dangerous, or illegal goods. I understand that SwiftFreight reserves the right to inspect any package and may refuse carriage if the contents are found to be misrepresented.&quot;
              </div>
            </div>
          </div>

          {/* Pickup & Destination */}
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-lg border border-border/50 bg-card">
              <div className="pb-2">
                <h2 className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" /> Pickup
                </h2>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium">{delivery.pickup.name}</p>
                {delivery.pickup.phone && <p className="text-muted-foreground">{delivery.pickup.phone}</p>}
                <p className="text-muted-foreground">{delivery.pickup.address}</p>
                <p className="text-muted-foreground">{delivery.pickup.city}, {delivery.pickup.country}</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card">
              <div className="pb-2">
                <h2 className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" /> Destination
                </h2>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium">{delivery.destination.name}</p>
                {delivery.destination.phone && <p className="text-muted-foreground">{delivery.destination.phone}</p>}
                <p className="text-muted-foreground">{delivery.destination.address}</p>
                <p className="text-muted-foreground">{delivery.destination.city}, {delivery.destination.country}</p>
              </div>
            </div>
          </div>

          {/* Driver & Vehicle */}
          {delivery.driverName && (
            <div className="rounded-lg border border-border/50 bg-card">
              <div className="pb-2">
                <h2 className="text-sm flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Driver & Vehicle
                </h2>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 text-xs font-bold">
                    {delivery.driverName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium">{delivery.driverName}</span>
                </div>
                {delivery.vehiclePlate && (
                  <p className="text-muted-foreground">Vehicle: {delivery.vehiclePlate}</p>
                )}
              </div>
            </div>
          )}

          {/* Quotation */}
          {delivery.quotedAmount && (
            <div className="rounded-lg border border-border/50 bg-card">
              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quoted Amount</span>
                  <span className="text-lg font-bold text-green-600">M{delivery.quotedAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
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
                    setSelectedRating(0);
                    setHoveredRating(0);
                    setRatingComment('');
                    setRatingDialogOpen(true);
                  }}
                >
                  <Star className="h-3.5 w-3.5" />
                  Rate Delivery
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => toast.info('Invoice generation would start')}>
                <FileText className="mr-2 h-4 w-4" /> Generate Invoice
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                style={{ borderColor: '#EF4444', color: '#EF4444' }}
                onClick={() => {
                  onClose();
                  useNavStore.getState().setDashboardTab('safety');
                }}
              >
                <ShieldAlert className="h-4 w-4" /> Report Issue
              </Button>
            </div>
          </div>

          {/* Proof of Delivery */}
          {(delivery.status === 'delivered' || delivery.status === 'returned') && (
            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Proof of Delivery
                </h4>
                <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={() => generatePOD(delivery)}>
                  <Printer className="h-3.5 w-3.5" />
                  Generate POD
                </Button>
              </div>
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

      {/* Star Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              Rate Delivery
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Tracking: <span className="font-mono font-medium text-foreground">{delivery.trackingNumber}</span>
            </p>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoveredRating || selectedRating);
                return (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform duration-150 focus:outline-none"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setSelectedRating(star)}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors duration-150 ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-none text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            {selectedRating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {selectedRating === 1 && 'Poor'}
                {selectedRating === 2 && 'Fair'}
                {selectedRating === 3 && 'Good'}
                {selectedRating === 4 && 'Very Good'}
                {selectedRating === 5 && 'Excellent'}
              </p>
            )}

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="rating-comment" className="text-sm font-medium">
                Comments (optional)
              </Label>
              <Textarea
                id="rating-comment"
                placeholder="Share your delivery experience..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRatingDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setRatingDialogOpen(false);
                toast.success('Rating submitted! Thank you for your feedback.');
              }}
              disabled={selectedRating === 0}
            >
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

  // Declaration form state
  const [declarationOpen, setDeclarationOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(['tracking', 'customer', 'route', 'weight', 'status', 'priority', 'driver', 'date'])
  );
  const toggleColumn = useCallback((key: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

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
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => {
            const header = ['Tracking#', 'Customer', 'Pickup City', 'Destination City', 'Weight (kg)', 'Status', 'Priority', 'Driver', 'Amount (M)', 'Created Date'];
            const rows = filtered.map((d) => [
              d.trackingNumber,
              d.customerName,
              d.pickup.city,
              d.destination.city,
              String(d.packageWeight || 0),
              statusLabels[d.status] || d.status,
              d.priority ? d.priority.charAt(0).toUpperCase() + d.priority.slice(1) : '',
              d.driverName || '',
              d.quotedAmount ? String(d.quotedAmount) : '',
              formatDate(d.createdAt),
            ]);
            downloadCSV([header, ...rows], 'deliveries.csv');
            toast.success(`Downloaded ${filtered.length} deliveries`);
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-2"
          style={{ borderColor: '#2E7D32', color: '#2E7D32' }}
          onClick={() => setDeclarationOpen(true)}
        >
          <ClipboardCheck className="h-4 w-4" />
          Declare Package
        </Button>
        <PackageDeclarationForm
          open={declarationOpen}
          onOpenChange={setDeclarationOpen}
          delivery={detailDelivery}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 gap-2">
              <Columns3 className="h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Toggle Columns</div>
            <DropdownMenuSeparator />
            {[
              { key: 'tracking', label: 'Tracking #' },
              { key: 'customer', label: 'Customer' },
              { key: 'route', label: 'Route' },
              { key: 'weight', label: 'Weight' },
              { key: 'status', label: 'Status' },
              { key: 'priority', label: 'Priority' },
              { key: 'driver', label: 'Driver' },
              { key: 'date', label: 'Date' },
            ].map((col) => (
              <DropdownMenuItem
                key={col.key}
                className="flex items-center gap-2 py-1.5"
                onSelect={(e) => {
                  e.preventDefault();
                  toggleColumn(col.key);
                }}
              >
                <Checkbox
                  checked={visibleColumns.has(col.key)}
                  onCheckedChange={() => toggleColumn(col.key)}
                  className="pointer-events-none"
                />
                <span className="text-sm">{col.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Gradient divider below header */}
      <div className="h-px" />

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
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={handlePriorityFilter}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Priority" /></SelectTrigger>
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

      {/* Quick Stats Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          <Package className="h-3.5 w-3.5" />
          Total: {filtered.length}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <Truck className="h-3.5 w-3.5" />
          Active: {filtered.filter((d) => ['collected', 'at_warehouse', 'in_transit', 'at_border', 'out_for_delivery'].includes(d.status)).length}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completed: {filtered.filter((d) => d.status === 'delivered').length}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <CreditCard className="h-3.5 w-3.5" />
          Avg. Amount: M{filtered.length > 0 ? Math.round(filtered.filter((d) => d.paidAmount != null).reduce((sum, d) => sum + (d.paidAmount || 0), 0) / Math.max(filtered.filter((d) => d.paidAmount != null).length, 1)).toLocaleString() : 0}
        </span>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="rounded-lg border overflow-hidden">
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs w-10 font-medium text-muted-foreground uppercase tracking-wider">
                    <Checkbox
                      checked={paged.length > 0 && selected.size === paged.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  {visibleColumns.has('tracking') && (
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('trackingNumber')}>
                      <span className="flex items-center">Tracking #<SortIcon field="trackingNumber" sortField={sortField} sortDir={sortDir} /></span>
                    </TableHead>
                  )}
                  {visibleColumns.has('customer') && (
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('customerName')}>
                      <span className="flex items-center">Customer<SortIcon field="customerName" sortField={sortField} sortDir={sortDir} /></span>
                    </TableHead>
                  )}
                  {visibleColumns.has('route') && <TableHead>Route</TableHead>}
                  {visibleColumns.has('weight') && (
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('packageWeight')}>
                      <span className="flex items-center">Weight<SortIcon field="packageWeight" sortField={sortField} sortDir={sortDir} /></span>
                    </TableHead>
                  )}
                  {visibleColumns.has('status') && (
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('status')}>
                      <span className="flex items-center">Status<SortIcon field="status" sortField={sortField} sortDir={sortDir} /></span>
                    </TableHead>
                  )}
                  {visibleColumns.has('priority') && (
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('priority')}>
                      <span className="flex items-center">Priority<SortIcon field="priority" sortField={sortField} sortDir={sortDir} /></span>
                    </TableHead>
                  )}
                  {visibleColumns.has('driver') && <TableHead>Driver</TableHead>}
                  {visibleColumns.has('date') && (
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('createdAt')}>
                      <span className="flex items-center">Date<SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} /></span>
                    </TableHead>
                  )}
                  <TableHead className="text-xs w-12 font-medium text-muted-foreground uppercase tracking-wider"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2 + visibleColumns.size} className="text-center py-12">
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
                      } ${selected.has(d.id) ? 'bg-green-50/50 dark:bg-green-900/10' : ''} ${d.priority === 'urgent' ? 'border-l-[3px] border-l-red-400' : d.priority === 'express' ? 'border-l-[3px] border-l-amber-400' : ''}`}
                      onClick={() => openDetail(d.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selected.has(d.id)} onCheckedChange={() => toggleSelect(d.id)} />
                      </TableCell>
                      {visibleColumns.has('tracking') && (
                        <TableCell>
                          <span className="font-mono text-sm font-medium text-green-700 dark:text-green-400 hover:underline">
                            {d.trackingNumber}
                          </span>
                        </TableCell>
                      )}
                      {visibleColumns.has('customer') && (
                        <TableCell className="font-medium">{d.customerName}</TableCell>
                      )}
                      {visibleColumns.has('route') && (
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-[140px]">
                            <MapPin className="h-3 w-3 shrink-0 text-green-600" />
                            <span className="truncate">{d.pickup.city}</span>
                            <ArrowRight className="h-3 w-3 shrink-0" />
                            <span className="truncate">{d.destination.city}</span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.has('weight') && (
                        <TableCell className="text-sm">{d.packageWeight} kg</TableCell>
                      )}
                      {visibleColumns.has('status') && (
                        <TableCell>
                          <Badge className={`${statusColors[d.status] || ''} gap-1.5`} variant="secondary">
                            <span className={`h-1.5 w-1.5 rounded-full bg-current ${(d.status === 'in_transit' || d.status === 'out_for_delivery') ? 'animate-pulse' : ''}`} />
                            {statusLabels[d.status] || d.status}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.has('priority') && (
                        <TableCell>
                          <Badge className={`${priorityColors[d.priority] || ''} capitalize`} variant="secondary">
                            {d.priority}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.has('driver') && (
                        <TableCell className="text-sm">
                          {d.driverName || <span className="text-muted-foreground">Unassigned</span>}
                        </TableCell>
                      )}
                      {visibleColumns.has('date') && (
                        <TableCell className="text-sm text-muted-foreground">{formatDate(d.createdAt)}</TableCell>
                      )}
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t bg-muted/30">
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
                <div
                  key={d.id}

                >
                  <div className={`group cursor-pointer rounded-lg border border-border/50 bg-card border-l-4 ${d.priority === 'urgent' ? 'border-l-red-400' : d.priority === 'express' ? 'border-l-amber-400' : 'border-l-primary/30'} relative overflow-hidden`}
                    onClick={() => openDetail(d.id)}
                  >
                    <div className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-sm font-medium text-green-700 dark:text-green-400">
                          {d.trackingNumber}
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                          <Badge className={`${priorityColors[d.priority] || ''} capitalize text-xs`} variant="secondary">
                            {d.priority}
                          </Badge>
                          <Badge className={`${statusColors[d.status] || ''} text-xs gap-1`} variant="secondary">
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
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
                    </div>
                  </div>
                </div>
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