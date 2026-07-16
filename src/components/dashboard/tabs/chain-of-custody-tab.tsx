'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChainOfCustodyEntry } from '@/lib/types';
import {
  CheckCircle2,
  Camera,
  PenLine,
  MapPin,
  FileText,
  GitBranch,
  Package,
  Truck,
  Warehouse,
  User,
  UserCheck,
  Clock,
  Circle,
  Search,
  ArrowRight,
  Crosshair,
  Handshake,
  Home,
} from 'lucide-react';

// ============ 5-STAGE DEFINITIONS ============
interface StageDef {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  defaultFrom: { party: string; role: string; exampleName: string };
  defaultTo: { party: string; role: string; exampleName: string };
  gpsLocation: string;
  lat: number;
  lng: number;
}

const STAGES: StageDef[] = [
  {
    key: 'customer_handover',
    label: 'Customer Handover',
    description: 'Customer hands parcel to logistics company (pickup)',
    icon: UserCheck,
    defaultFrom: { party: 'Customer', role: 'Customer', exampleName: 'Thabo Mokone' },
    defaultTo: { party: 'Driver', role: 'Driver', exampleName: 'Kabelo Mothibi' },
    gpsLocation: 'Maseru, Kingsway Road',
    lat: -29.3103,
    lng: 27.4755,
  },
  {
    key: 'warehouse_checkin',
    label: 'Warehouse Check-in',
    description: 'Parcel received and logged at warehouse',
    icon: Warehouse,
    defaultFrom: { party: 'Driver', role: 'Driver', exampleName: 'Kabelo Mothibi' },
    defaultTo: { party: 'Warehouse', role: 'Warehouse Staff', exampleName: 'Mountain Express Hub' },
    gpsLocation: 'Maseru Industrial Area',
    lat: -29.3179,
    lng: 27.4864,
  },
  {
    key: 'dispatch_handover',
    label: 'Dispatch Handover',
    description: 'Parcel handed to driver for delivery',
    icon: Truck,
    defaultFrom: { party: 'Warehouse', role: 'Warehouse Staff', exampleName: 'Mountain Express Hub' },
    defaultTo: { party: 'Driver', role: 'Driver', exampleName: 'Tumelo Kuo' },
    gpsLocation: 'Maseru Industrial Area',
    lat: -29.3179,
    lng: 27.4864,
  },
  {
    key: 'delivery_point',
    label: 'Delivery Point',
    description: 'Parcel arrives at delivery destination',
    icon: Home,
    defaultFrom: { party: 'Driver', role: 'Driver', exampleName: 'Tumelo Kuo' },
    defaultTo: { party: 'Hub', role: 'Local Hub', exampleName: 'Leribe Delivery Point' },
    gpsLocation: 'Leribe, Main Street',
    lat: -28.8842,
    lng: 28.0472,
  },
  {
    key: 'recipient_handover',
    label: 'Recipient Handover',
    description: 'Parcel handed to final recipient',
    icon: Handshake,
    defaultFrom: { party: 'Driver', role: 'Driver', exampleName: 'Tumelo Kuo' },
    defaultTo: { party: 'Recipient', role: 'Recipient', exampleName: 'Mpho Tšepe' },
    gpsLocation: 'Leribe, Main Street',
    lat: -28.8842,
    lng: 28.0472,
  },
];

// ============ MOCK DATA ============
interface ChainOfCustodyData {
  deliveryId: string;
  trackingNumber: string;
  route: string;
  recipientName: string;
  completedStages: number; // 0-5
  entries: ChainOfCustodyEntry[];
}

const mockChains: ChainOfCustodyData[] = [
  {
    deliveryId: 'del-001',
    trackingNumber: 'SF-2025-001',
    route: 'Maseru → Leribe',
    recipientName: 'Mpho Tšepe',
    completedStages: 5,
    entries: [
      {
        id: 'coc-001-a',
        deliveryId: 'del-001',
        fromParty: 'Customer',
        toParty: 'Driver',
        fromName: 'Thabo Mokone',
        toName: 'Kabelo Mothibi',
        gpsLocation: 'Maseru, Kingsway Road',
        latitude: -29.3103,
        longitude: 27.4755,
        photoUrl: 'placeholder',
        signatureUrl: 'placeholder',
        notes: 'Parcel collected from customer home. Sealed and labelled. 2 parcels total.',
        timestamp: '2025-01-15T09:30:00Z',
      },
      {
        id: 'coc-001-b',
        deliveryId: 'del-001',
        fromParty: 'Driver',
        toParty: 'Warehouse',
        fromName: 'Kabelo Mothibi',
        toName: 'Mountain Express Hub',
        gpsLocation: 'Maseru Industrial Area',
        latitude: -29.3179,
        longitude: 27.4864,
        notes: 'Parcel inspected, no issues found. Sealed and labelled for Leribe route. Stored in Zone B.',
        timestamp: '2025-01-15T11:45:00Z',
      },
      {
        id: 'coc-001-c',
        deliveryId: 'del-001',
        fromParty: 'Warehouse',
        toParty: 'Driver',
        fromName: 'Mountain Express Hub',
        toName: 'Tumelo Kuo',
        gpsLocation: 'Maseru Industrial Area',
        latitude: -29.3179,
        longitude: 27.4864,
        signatureUrl: 'placeholder',
        notes: 'Transferred to Leribe route driver. Manifest updated. 3 parcels on board.',
        timestamp: '2025-01-16T07:00:00Z',
      },
      {
        id: 'coc-001-d',
        deliveryId: 'del-001',
        fromParty: 'Driver',
        toParty: 'Hub',
        fromName: 'Tumelo Kuo',
        toName: 'Leribe Delivery Point',
        gpsLocation: 'Leribe, Main Street',
        latitude: -28.8842,
        longitude: 28.0472,
        photoUrl: 'placeholder',
        notes: 'Arrived at Leribe delivery point. Parcel in good condition. Ready for recipient collection.',
        timestamp: '2025-01-16T12:00:00Z',
      },
      {
        id: 'coc-001-e',
        deliveryId: 'del-001',
        fromParty: 'Driver',
        toParty: 'Recipient',
        fromName: 'Tumelo Kuo',
        toName: 'Mpho Tšepe',
        gpsLocation: 'Leribe, Main Street',
        latitude: -28.8842,
        longitude: 28.0472,
        photoUrl: 'placeholder',
        signatureUrl: 'placeholder',
        notes: 'Delivered to recipient at home address. Recipient verified contents. All in order.',
        timestamp: '2025-01-16T14:20:00Z',
      },
    ],
  },
  {
    deliveryId: 'del-005',
    trackingNumber: 'SF-2025-005',
    route: 'Maseru → Butha-Buthe',
    recipientName: 'Nthabeleng Mokone',
    completedStages: 3,
    entries: [
      {
        id: 'coc-005-a',
        deliveryId: 'del-005',
        fromParty: 'Customer',
        toParty: 'Warehouse',
        fromName: 'Nthabeleng Mokone',
        toName: 'Maseru Central Warehouse',
        gpsLocation: 'Maseru, Industrial Area',
        latitude: -29.3100,
        longitude: 27.4850,
        photoUrl: 'placeholder',
        notes: 'Parcel received. Weight verified: 4.2kg.',
        timestamp: '2025-01-14T10:00:00Z',
      },
      {
        id: 'coc-005-b',
        deliveryId: 'del-005',
        fromParty: 'Warehouse',
        toParty: 'Driver',
        fromName: 'Maseru Central Warehouse',
        toName: 'Mokhethi Phakoe',
        gpsLocation: 'Maseru, Industrial Area',
        latitude: -29.3100,
        longitude: 27.4850,
        signatureUrl: 'placeholder',
        notes: 'Loaded onto truck LP-456-AB. All documents attached.',
        timestamp: '2025-01-14T14:30:00Z',
      },
      {
        id: 'coc-005-c',
        deliveryId: 'del-005',
        fromParty: 'Driver',
        toParty: 'Warehouse',
        fromName: 'Mokhethi Phakoe',
        toName: 'Mountain Express Hub',
        gpsLocation: 'Maseru Bridge Border Post',
        latitude: -29.2978,
        longitude: 27.4725,
        photoUrl: 'placeholder',
        notes: 'Cleared customs at Maseru Bridge. Duty paid: M45.00. No issues.',
        timestamp: '2025-01-15T16:00:00Z',
      },
    ],
  },
  {
    deliveryId: 'del-012',
    trackingNumber: 'SF-2025-012',
    route: 'Maseru → Quthing',
    recipientName: 'Limpho Letsie',
    completedStages: 1,
    entries: [
      {
        id: 'coc-012-a',
        deliveryId: 'del-012',
        fromParty: 'Customer',
        toParty: 'Driver',
        fromName: 'Limpho Letsie',
        toName: 'Palesa Nkoe',
        gpsLocation: 'Maseru, Pioneer Mall',
        latitude: -29.3084,
        longitude: 27.4812,
        photoUrl: 'placeholder',
        signatureUrl: 'placeholder',
        notes: 'Parcel collected from customer at Pioneer Mall. Fragile stickers applied.',
        timestamp: '2025-01-17T08:00:00Z',
      },
    ],
  },
];

// ============ HELPERS ============
function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-LS', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-LS', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============ HANDOVER DIALOG ============
function HandoverDialog({
  open,
  onOpenChange,
  stage,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  stage: StageDef;
  onConfirm: (data: { fromName: string; toName: string; gpsLocation: string; lat: number; lng: number; notes: string; hasPhoto: boolean; hasSignature: boolean }) => void;
}) {
  const [fromName, setFromName] = useState(stage.defaultFrom.exampleName);
  const [toName, setToName] = useState(stage.defaultTo.exampleName);
  const [gpsLocation, setGpsLocation] = useState(stage.gpsLocation);
  const [lat, setLat] = useState(stage.lat);
  const [lng, setLng] = useState(stage.lng);
  const [notes, setNotes] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  function handleGetLocation() {
    setGpsLocation(stage.gpsLocation);
    setLat(stage.lat);
    setLng(stage.lng);
    toast.success('GPS location captured successfully.');
  }

  function handleConfirm() {
    onConfirm({ fromName, toName, gpsLocation, lat, lng, notes, hasPhoto, hasSignature });
    setNotes('');
    setHasPhoto(false);
    setHasSignature(false);
    setFromName(stage.defaultFrom.exampleName);
    setToName(stage.defaultTo.exampleName);
    onOpenChange(false);
  }

  function handleOpenChange(v: boolean) {
    if (!v) {
      setNotes('');
      setHasPhoto(false);
      setHasSignature(false);
      setFromName(stage.defaultFrom.exampleName);
      setToName(stage.defaultTo.exampleName);
    }
    onOpenChange(v);
  }

  const StageIcon = stage.icon;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: '#212121' }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: '#E8F5E9' }}>
              <StageIcon className="h-4 w-4" style={{ color: '#2E7D32' }} />
            </div>
            Record Handover
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Stage name - read-only */}
          <div className="rounded-lg p-3" style={{ backgroundColor: '#E8F5E9', border: '1px solid #A5D6A7' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#2E7D32' }}>Stage</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: '#1B5E20' }}>{stage.label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#4CAF50' }}>{stage.description}</p>
          </div>

          {/* From / To Person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium" style={{ color: '#757575' }}>Handing Over (From)</Label>
              <Input
                className="mt-1.5 text-sm"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                style={{ borderColor: '#E0E0E0' }}
              />
              <p className="text-[10px] mt-1" style={{ color: '#BDBDBD' }}>Role: {stage.defaultFrom.role}</p>
            </div>
            <div>
              <Label className="text-xs font-medium" style={{ color: '#757575' }}>Receiving (To)</Label>
              <Input
                className="mt-1.5 text-sm"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                style={{ borderColor: '#E0E0E0' }}
              />
              <p className="text-[10px] mt-1" style={{ color: '#BDBDBD' }}>Role: {stage.defaultTo.role}</p>
            </div>
          </div>

          {/* GPS Location */}
          <div>
            <Label className="text-xs font-medium" style={{ color: '#757575' }}>GPS Location</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                className="flex-1 text-sm"
                value={gpsLocation}
                onChange={(e) => setGpsLocation(e.target.value)}
                placeholder="Location name"
                style={{ borderColor: '#E0E0E0' }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                className="gap-1.5 shrink-0 text-xs"
                style={{ borderColor: '#2E7D32', color: '#2E7D32' }}
              >
                <Crosshair className="h-3.5 w-3.5" />
                Get Location
              </Button>
            </div>
            {(lat || lng) && (
              <p className="text-[10px] font-mono mt-1" style={{ color: '#9E9E9E' }}>
                {lat.toFixed(4)}°, {lng.toFixed(4)}°
              </p>
            )}
          </div>

          {/* Photo Upload - Simulated */}
          <div>
            <Label className="text-xs font-medium mb-1.5 block" style={{ color: '#757575' }}>Photo Evidence</Label>
            {!hasPhoto ? (
              <button
                type="button"
                onClick={() => setHasPhoto(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors hover:border-green-400"
                style={{ borderColor: '#E0E0E0' }}
              >
                <Camera className="h-4 w-4" style={{ color: '#9E9E9E' }} />
                <span className="text-xs font-medium" style={{ color: '#757575' }}>Tap to capture/upload photo</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-lg p-3"
                style={{ backgroundColor: '#E8F5E9', border: '1px solid #A5D6A7' }}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#2E7D32' }} />
                <span className="text-xs font-medium flex-1" style={{ color: '#2E7D32' }}>handover_photo.jpg uploaded</span>
                <button type="button" onClick={() => setHasPhoto(false)} className="text-[10px] underline" style={{ color: '#D32F2F' }}>Remove</button>
              </motion.div>
            )}
          </div>

          {/* Signature Capture - Simulated */}
          <div>
            <Label className="text-xs font-medium mb-1.5 block" style={{ color: '#757575' }}>Recipient Signature</Label>
            {!hasSignature ? (
              <button
                type="button"
                onClick={() => setHasSignature(true)}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 transition-colors hover:border-green-400"
                style={{ borderColor: '#E0E0E0' }}
              >
                <PenLine className="h-5 w-5" style={{ color: '#9E9E9E' }} />
                <span className="text-xs font-medium" style={{ color: '#757575' }}>Click to capture signature</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div
                  className="rounded-lg p-4 flex items-center justify-center"
                  style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}
                >
                  <svg width="200" height="60" viewBox="0 0 200 60" fill="none">
                    <path d="M10 45 Q30 10 50 30 T90 25 T130 35 T170 20 T195 30" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M15 50 Q40 20 65 40 T105 30 T140 40 T175 25" stroke="#424242" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: '#2E7D32' }} />
                  <span className="text-xs font-medium" style={{ color: '#2E7D32' }}>Signature captured</span>
                  <button type="button" onClick={() => setHasSignature(false)} className="text-[10px] underline ml-auto" style={{ color: '#D32F2F' }}>Clear</button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs font-medium" style={{ color: '#757575' }}>Notes (Optional)</Label>
            <Textarea
              className="mt-1.5 min-h-[72px] text-sm"
              placeholder="Any additional notes about this handover..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ borderColor: '#E0E0E0' }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)} style={{ borderColor: '#E0E0E0', color: '#757575' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="gap-2 font-medium"
            style={{ backgroundColor: '#2E7D32', color: 'white' }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm Handover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ STAGE DETAIL PANEL ============
function StageDetailPanel({
  stage,
  entry,
  isActive,
  isPending,
}: {
  stage: StageDef;
  entry?: ChainOfCustodyEntry;
  isActive: boolean;
  isPending: boolean;
}) {
  const StageIcon = stage.icon;

  if (isPending) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="rounded-xl" style={{ borderColor: '#E0E0E0' }}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#F5F5F5' }}>
                <StageIcon className="h-7 w-7" style={{ color: '#BDBDBD' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#BDBDBD' }}>{stage.label}</p>
                <p className="text-xs mt-1" style={{ color: '#E0E0E0' }}>{stage.description}</p>
              </div>
              <Badge variant="secondary" className="text-[10px]" style={{ backgroundColor: '#F5F5F5', color: '#BDBDBD' }}>
                Pending
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!entry) return null;

  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        className="rounded-xl transition-shadow hover:shadow-md"
        style={{
          borderColor: isActive ? '#A5D6A7' : '#E0E0E0',
          backgroundColor: isActive ? '#F9FBF9' : 'white',
        }}
      >
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: isActive ? '#E8F5E9' : '#F5F5F5' }}
              >
                <StageIcon className="h-5 w-5" style={{ color: isActive ? '#2E7D32' : '#757575' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#212121' }}>{stage.label}</p>
                <p className="text-xs" style={{ color: '#9E9E9E' }}>{stage.description}</p>
              </div>
            </div>
            {isActive && (
              <Badge className="text-[10px] font-semibold" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>
                Current
              </Badge>
            )}
          </div>

          <Separator style={{ backgroundColor: '#E0E0E0' }} />

          {/* Timestamp */}
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" style={{ color: '#9E9E9E' }} />
            <span className="text-xs" style={{ color: '#757575' }}>{formatDateTime(entry.timestamp)}</span>
          </div>

          {/* Handover Flow */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: '#E3F2FD', border: '1px solid #90CAF9' }}
              >
                {entry.fromParty === 'Customer' || entry.fromParty === 'Recipient' ? (
                  <User className="h-3.5 w-3.5" style={{ color: '#1565C0' }} />
                ) : entry.fromParty === 'Driver' ? (
                  <Truck className="h-3.5 w-3.5" style={{ color: '#1565C0' }} />
                ) : (
                  <Warehouse className="h-3.5 w-3.5" style={{ color: '#1565C0' }} />
                )}
              </div>
              <div>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#E3F2FD', color: '#1565C0' }}>
                  {entry.fromParty}
                </span>
                <p className="text-xs font-medium mt-0.5" style={{ color: '#212121' }}>{entry.fromName}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2">
              <div className="h-px w-4" style={{ backgroundColor: '#BDBDBD' }} />
              <ArrowRight className="h-3.5 w-3.5" style={{ color: '#757575' }} />
              <div className="h-px w-4" style={{ backgroundColor: '#BDBDBD' }} />
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: '#E8F5E9', border: '1px solid #A5D6A7' }}
              >
                {entry.toParty === 'Customer' || entry.toParty === 'Recipient' ? (
                  <User className="h-3.5 w-3.5" style={{ color: '#2E7D32' }} />
                ) : entry.toParty === 'Driver' ? (
                  <Truck className="h-3.5 w-3.5" style={{ color: '#2E7D32' }} />
                ) : (
                  <Warehouse className="h-3.5 w-3.5" style={{ color: '#2E7D32' }} />
                )}
              </div>
              <div>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                  {entry.toParty}
                </span>
                <p className="text-xs font-medium mt-0.5" style={{ color: '#212121' }}>{entry.toName}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {entry.gpsLocation && (
              <div className="flex items-start gap-2.5 rounded-lg p-3" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#757575' }} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9E9E9E' }}>Location</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: '#212121' }}>{entry.gpsLocation}</p>
                  {entry.latitude && entry.longitude && (
                    <p className="text-[10px] font-mono mt-0.5" style={{ color: '#BDBDBD' }}>
                      {entry.latitude.toFixed(4)}°, {entry.longitude.toFixed(4)}°
                    </p>
                  )}
                </div>
              </div>
            )}

            {entry.photoUrl && (
              <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: '#F5F5F5', border: '1px dashed #BDBDBD' }}>
                  <Camera className="h-4 w-4" style={{ color: '#9E9E9E' }} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9E9E9E' }}>Photo Proof</p>
                  <p className="text-xs" style={{ color: '#2E7D32' }}>Photo captured</p>
                </div>
              </div>
            )}

            {entry.signatureUrl && (
              <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: '#F5F5F5', border: '1px dashed #BDBDBD' }}>
                  <PenLine className="h-4 w-4" style={{ color: '#9E9E9E' }} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9E9E9E' }}>Signature</p>
                  <p className="text-xs" style={{ color: '#212121' }}>Signed by {entry.toName.split(' ')[0]}</p>
                </div>
              </div>
            )}

            {entry.notes && (
              <div className="flex items-start gap-2.5 rounded-lg p-3 sm:col-span-2" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                <FileText className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#757575' }} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9E9E9E' }}>Notes</p>
                  <p className="text-xs leading-relaxed mt-0.5" style={{ color: '#424242' }}>{entry.notes}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============ MAIN COMPONENT ============
export function ChainOfCustodyTab() {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(mockChains[0].deliveryId);
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);
  const [handoverDialogOpen, setHandoverDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localChains, setLocalChains] = useState(mockChains);

  const filteredChains = useMemo(() => {
    if (!searchQuery.trim()) return localChains;
    const q = searchQuery.toLowerCase();
    return localChains.filter(
      (c) =>
        c.trackingNumber.toLowerCase().includes(q) ||
        c.route.toLowerCase().includes(q) ||
        c.recipientName.toLowerCase().includes(q)
    );
  }, [localChains, searchQuery]);

  const selectedChain = useMemo(
    () => filteredChains.find((c) => c.deliveryId === selectedDeliveryId) ?? filteredChains[0],
    [filteredChains, selectedDeliveryId]
  );

  const completedCount = selectedChain?.completedStages ?? 0;
  const currentStageIdx = completedCount < 5 ? completedCount : 4;

  function handleRecordHandover() {
    if (!selectedChain || completedCount >= 5) return;
    setHandoverDialogOpen(true);
  }

  function handleConfirmHandover(data: {
    fromName: string;
    toName: string;
    gpsLocation: string;
    lat: number;
    lng: number;
    notes: string;
    hasPhoto: boolean;
    hasSignature: boolean;
  }) {
    const stage = STAGES[completedCount];
    const newEntry: ChainOfCustodyEntry = {
      id: `coc-${Date.now()}`,
      deliveryId: selectedChain.deliveryId,
      fromParty: stage.defaultFrom.party,
      toParty: stage.defaultTo.party,
      fromName: data.fromName,
      toName: data.toName,
      gpsLocation: data.gpsLocation,
      latitude: data.lat,
      longitude: data.lng,
      photoUrl: data.hasPhoto ? 'placeholder' : undefined,
      signatureUrl: data.hasSignature ? 'placeholder' : undefined,
      notes: data.notes || undefined,
      timestamp: new Date().toISOString(),
    };

    setLocalChains((prev) =>
      prev.map((chain) => {
        if (chain.deliveryId !== selectedChain.deliveryId) return chain;
        return {
          ...chain,
          completedStages: chain.completedStages + 1,
          entries: [...chain.entries, newEntry],
        };
      })
    );

    setSelectedStageIdx(completedCount);
    toast.success(`${stage.label} recorded successfully.`);
  }

  // Find the effective selected stage index (clamp to valid range)
  const effectiveSelectedIdx = Math.min(selectedStageIdx, Math.max(completedCount, 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#212121' }}>
          <GitBranch className="h-5 w-5" style={{ color: '#2E7D32' }} />
          Chain of Custody
        </h2>
        <p className="text-sm mt-0.5" style={{ color: '#757575' }}>
          Track the complete 5-stage handover history for every delivery
        </p>
      </div>

      {/* Delivery Selector */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1 w-full sm:w-auto">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#757575' }}>
                Search by Tracking Number
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9E9E9E' }} />
                <Input
                  className="pl-9 text-sm"
                  placeholder="Enter tracking number, route, or recipient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderColor: '#E0E0E0' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 self-end pb-0.5">
              <Select value={selectedDeliveryId} onValueChange={(v) => { setSelectedDeliveryId(v); setSelectedStageIdx(0); }}>
                <SelectTrigger className="w-[220px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredChains.map((chain) => (
                    <SelectItem key={chain.deliveryId} value={chain.deliveryId}>
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-xs">{chain.trackingNumber}</span>
                        <span style={{ color: '#BDBDBD' }}>—</span>
                        <span>{chain.route}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedChain && (
            <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: '#9E9E9E' }}>
              <span>Route: <strong style={{ color: '#212121' }}>{selectedChain.route}</strong></span>
              <span>•</span>
              <span>Recipient: <strong style={{ color: '#212121' }}>{selectedChain.recipientName}</strong></span>
              <span>•</span>
              <span>Progress: <strong style={{ color: '#2E7D32' }}>{completedCount}/5 stages</strong></span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Handover Button */}
      {completedCount < 5 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            onClick={handleRecordHandover}
            className="w-full sm:w-auto gap-2 font-semibold text-sm py-5"
            style={{ backgroundColor: '#2E7D32', color: 'white' }}
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <CheckCircle2 className="h-5 w-5" />
            </motion.span>
            Record {STAGES[completedCount]?.label ?? 'Handover'}
          </Button>
        </motion.div>
      )}

      {/* Main Layout: Stepper (left) + Detail Panel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Visual Stepper */}
        <div className="lg:col-span-4">
          <Card className="rounded-xl sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold flex items-center gap-2" style={{ color: '#757575' }}>
                <FileText className="h-3.5 w-3.5" />
                Handover Stages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="relative">
                {/* Vertical connecting line */}
                <div
                  className="absolute left-[19px] top-4 bottom-4 w-0.5"
                  style={{ backgroundColor: '#E0E0E0' }}
                />
                {/* Completed line overlay */}
                {completedCount > 0 && (
                  <div
                    className="absolute left-[19px] top-4 w-0.5 transition-all duration-500"
                    style={{
                      backgroundColor: '#2E7D32',
                      height: `${Math.min(completedCount / 5, 1) * (STAGES.length * 72 - 8)}px`,
                    }}
                  />
                )}

                <div className="space-y-2">
                  {STAGES.map((stage, idx) => {
                    const StageIcon = stage.icon;
                    const isCompleted = idx < completedCount;
                    const isCurrent = idx === currentStageIdx && completedCount < 5;
                    const isPending = idx > currentStageIdx;
                    const isSelected = effectiveSelectedIdx === idx;

                    return (
                      <motion.button
                        key={stage.key}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06, duration: 0.25 }}
                        onClick={() => setSelectedStageIdx(idx)}
                        className="relative flex items-start gap-3 w-full text-left p-2.5 rounded-lg transition-all duration-150 group"
                        style={{
                          backgroundColor: isSelected ? '#E8F5E9' : 'transparent',
                          opacity: isPending ? 0.45 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isPending) e.currentTarget.style.backgroundColor = '#F5F5F5';
                        }}
                        onMouseLeave={(e) => {
                          if (!isPending) e.currentTarget.style.backgroundColor = isSelected ? '#E8F5E9' : 'transparent';
                        }}
                      >
                        {/* Status indicator */}
                        <div className="relative z-10 mt-0.5">
                          {isCompleted ? (
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-full border-2"
                              style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            </div>
                          ) : isCurrent ? (
                            <div className="relative flex items-center justify-center">
                              <motion.span
                                className="absolute inline-flex h-9 w-9 rounded-full opacity-30"
                                style={{ backgroundColor: '#2E7D32' }}
                                animate={{ scale: [1, 1.4, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              />
                              <div
                                className="relative flex h-7 w-7 items-center justify-center rounded-full border-2"
                                style={{ backgroundColor: '#2E7D32', borderColor: '#A5D6A7' }}
                              >
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-full border-2"
                              style={{ backgroundColor: '#FAFAFA', borderColor: '#BDBDBD' }}
                            >
                              <StageIcon className="h-3 w-3" style={{ color: '#BDBDBD' }} />
                            </div>
                          )}
                        </div>

                        {/* Label */}
                        <div className="min-w-0 pt-0.5">
                          <p
                            className="text-xs font-semibold truncate"
                            style={{ color: isCompleted || isCurrent ? '#212121' : '#BDBDBD' }}
                          >
                            {stage.label}
                          </p>
                          <p className="text-[10px] mt-0.5 truncate" style={{ color: '#9E9E9E' }}>
                            {stage.description}
                          </p>
                          {isCompleted && selectedChain?.entries[idx] && (
                            <p className="text-[10px] mt-0.5" style={{ color: '#2E7D32' }}>
                              {formatTime(selectedChain.entries[idx].timestamp)}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Detail Panel */}
        <div className="lg:col-span-8">
          <ScrollArea className="max-h-[calc(100vh-340px)]">
            <StageDetailPanel
              stage={STAGES[effectiveSelectedIdx]}
              entry={selectedChain?.entries[effectiveSelectedIdx]}
              isActive={effectiveSelectedIdx === currentStageIdx && completedCount < 5}
              isPending={effectiveSelectedIdx > currentStageIdx || (completedCount >= 5 && effectiveSelectedIdx >= 5)}
            />
          </ScrollArea>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs" style={{ color: '#757575' }}>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: '#2E7D32' }} />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-3.5 w-3.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50" style={{ backgroundColor: '#2E7D32' }} />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#2E7D32' }} />
          </span>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Circle className="h-3.5 w-3.5" style={{ color: '#BDBDBD' }} />
          <span>Pending</span>
        </div>
      </div>

      {/* Handover Dialog */}
      {selectedChain && completedCount < 5 && (
        <HandoverDialog
          open={handoverDialogOpen}
          onOpenChange={setHandoverDialogOpen}
          stage={STAGES[completedCount]}
          onConfirm={handleConfirmHandover}
        />
      )}
    </div>
  );
}