'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Clock,
  Circle,
} from 'lucide-react';

// ============ MOCK DATA ============
interface ChainOfCustodyData {
  deliveryId: string;
  trackingNumber: string;
  route: string;
  entries: ChainOfCustodyEntry[];
}

const mockChains: ChainOfCustodyData[] = [
  {
    deliveryId: 'del-001',
    trackingNumber: 'SF-2025-001',
    route: 'Maseru → Leribe',
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
        notes: 'Parcel inspected, no issues found. Sealed and labelled for Leribe route.',
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
        notes: 'Transferred to Leribe route driver. Manifest updated. 3 parcels on board.',
        timestamp: '2025-01-16T07:00:00Z',
      },
      {
        id: 'coc-001-d',
        deliveryId: 'del-001',
        fromParty: 'Driver',
        toParty: 'Customer',
        fromName: 'Tumelo Kuo',
        toName: 'Mpho Tšepe',
        gpsLocation: 'Leribe, Main Street',
        latitude: -28.8842,
        longitude: 28.0472,
        photoUrl: 'placeholder',
        signatureUrl: 'placeholder',
        timestamp: '2025-01-16T14:20:00Z',
      },
    ],
  },
  {
    deliveryId: 'del-005',
    trackingNumber: 'SF-2025-005',
    route: 'Johannesburg → Maseru',
    entries: [
      {
        id: 'coc-005-a',
        deliveryId: 'del-005',
        fromParty: 'Customer',
        toParty: 'Warehouse',
        fromName: 'Nthabeleng Mokone',
        toName: 'JHB Consolidation Centre',
        gpsLocation: 'Johannesburg, Midrand',
        latitude: -25.9893,
        longitude: 28.1285,
        photoUrl: 'placeholder',
        notes: 'Parcel received from Takealot supplier. Weight verified: 4.2kg.',
        timestamp: '2025-01-14T10:00:00Z',
      },
      {
        id: 'coc-005-b',
        deliveryId: 'del-005',
        fromParty: 'Warehouse',
        toParty: 'Driver',
        fromName: 'JHB Consolidation Centre',
        toName: 'Mokhethi Phakoe',
        gpsLocation: 'Johannesburg, Midrand',
        latitude: -25.9893,
        longitude: 28.1285,
        signatureUrl: 'placeholder',
        notes: 'Loaded onto cross-border truck AB-456-D. Customs documents attached.',
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
        notes: 'Cleared customs at Maseru Bridge. Duty paid: M45.00. No issues.',
        timestamp: '2025-01-15T16:00:00Z',
      },
      {
        id: 'coc-005-d',
        deliveryId: 'del-005',
        fromParty: 'Warehouse',
        toParty: 'Driver',
        fromName: 'Mountain Express Hub',
        toName: 'Kabelo Mothibi',
        gpsLocation: 'Maseru Industrial Area',
        notes: 'Sorted and assigned to Maseru city delivery round.',
        timestamp: '2025-01-16T08:15:00Z',
      },
      {
        id: 'coc-005-e',
        deliveryId: 'del-005',
        fromParty: 'Driver',
        toParty: 'Customer',
        fromName: 'Kabelo Mothibi',
        toName: 'Nthabeleng Mokone',
        gpsLocation: 'Maseru, Ha Thetsane',
        latitude: -29.3456,
        longitude: 27.5123,
        photoUrl: 'placeholder',
        signatureUrl: 'placeholder',
        notes: 'Delivered to home address. Recipient noted outer box damage.',
        timestamp: '2025-01-16T12:45:00Z',
      },
    ],
  },
  {
    deliveryId: 'del-012',
    trackingNumber: 'SF-2025-012',
    route: 'Maseru → Quthing',
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
        timestamp: '2025-01-17T08:00:00Z',
      },
      {
        id: 'coc-012-b',
        deliveryId: 'del-012',
        fromParty: 'Driver',
        toParty: 'Warehouse',
        fromName: 'Palesa Nkoe',
        toName: 'Mountain Express Hub',
        gpsLocation: 'Maseru Industrial Area',
        notes: 'Received at hub. Checked packaging — fragile stickers applied. Stored in secure area.',
        timestamp: '2025-01-17T09:30:00Z',
      },
      {
        id: 'coc-012-c',
        deliveryId: 'del-012',
        fromParty: 'Warehouse',
        toParty: 'Driver',
        fromName: 'Mountain Express Hub',
        toName: 'Tumelo Kuo',
        gpsLocation: 'Maseru Industrial Area',
        signatureUrl: 'placeholder',
        notes: 'Outbound to Quthing via Roma–Mohales Hoek corridor. ETA 2 days.',
        timestamp: '2025-01-18T06:00:00Z',
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

function getPartyIcon(party: string) {
  switch (party.toLowerCase()) {
    case 'customer':
      return User;
    case 'driver':
      return Truck;
    case 'warehouse':
      return Warehouse;
    default:
      return Package;
  }
}

function getPartyBadgeStyle(party: string) {
  switch (party.toLowerCase()) {
    case 'customer':
      return { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' };
    case 'driver':
      return { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' };
    case 'warehouse':
      return { bg: '#FFF3E0', color: '#E65100', border: '#FFCC80' };
    default:
      return { bg: '#F5F5F5', color: '#616161', border: '#E0E0E0' };
  }
}

// ============ MAIN COMPONENT ============
export function ChainOfCustodyTab() {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(mockChains[0].deliveryId);

  const selectedChain = useMemo(
    () => mockChains.find((c) => c.deliveryId === selectedDeliveryId) ?? mockChains[0],
    [selectedDeliveryId]
  );

  // Find the last entry index that has a timestamp in the past (completed step)
  // For mock data, treat last entry as current (in-progress) if it's recent
  const lastEntryIdx = selectedChain.entries.length - 1;
  const activeEntryIdx = selectedChain.entries.length <= 4 ? lastEntryIdx : lastEntryIdx - 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#212121' }}>
          <GitBranch className="h-5 w-5" style={{ color: '#2E7D32' }} />
          Chain of Custody
        </h2>
        <p className="text-sm mt-0.5" style={{ color: '#757575' }}>
          Track the complete handover history for every delivery
        </p>
      </div>

      {/* Delivery Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full sm:w-auto">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#757575' }}>
                Select Delivery
              </label>
              <Select value={selectedDeliveryId} onValueChange={setSelectedDeliveryId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockChains.map((chain) => (
                    <SelectItem key={chain.deliveryId} value={chain.deliveryId}>
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-xs">{chain.trackingNumber}</span>
                        <span className="text-muted-foreground">—</span>
                        <span>{chain.route}</span>
                        <Badge variant="secondary" className="text-[10px] ml-1">
                          {chain.entries.length} steps
                        </Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" style={{ color: '#2E7D32' }} />
                <span className="text-xs" style={{ color: '#757575' }}>Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50" style={{ backgroundColor: '#2E7D32' }} />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#2E7D32' }} />
                </span>
                <span className="text-xs" style={{ color: '#757575' }}>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Circle className="h-4 w-4" style={{ color: '#BDBDBD' }} />
                <span className="text-xs" style={{ color: '#757575' }}>Pending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <ScrollArea className="max-h-[calc(100vh-320px)]">
        <div className="relative pl-10 sm:pl-14 pb-8">
          {/* Vertical line */}
          <div
            className="absolute left-4 sm:left-6 top-2 bottom-2 w-0.5"
            style={{ backgroundColor: '#E0E0E0' }}
          />

          {selectedChain.entries.map((entry, idx) => {
            const isLast = idx === lastEntryIdx;
            const isActive = idx === activeEntryIdx && !isLast;
            const isCurrentFinal = isLast;
            const isCompleted = idx < activeEntryIdx || (isLast && selectedChain.entries.length <= 4);

            const FromIcon = getPartyIcon(entry.fromParty);
            const ToIcon = getPartyIcon(entry.toParty);
            const fromBadge = getPartyBadgeStyle(entry.fromParty);
            const toBadge = getPartyBadgeStyle(entry.toParty);

            // Completed steps get a green connecting line segment
            const lineAboveCompleted = idx > 0;
            const lineBelowCompleted = !isLast && (isCompleted || isActive);

            return (
              <div key={entry.id} className="relative mb-8 last:mb-0">
                {/* Green overlay for completed connecting lines */}
                {idx > 0 && (
                  <div
                    className="absolute left-4 sm:left-6 -top-8 w-0.5 h-8"
                    style={{ backgroundColor: isCompleted || isActive ? '#2E7D32' : 'transparent' }}
                  />
                )}

                {/* Status dot on the timeline */}
                <div className="absolute left-2 sm:left-4 top-1 -translate-x-1/2 z-10">
                  {isCompleted ? (
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                      style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}
                    >
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  ) : isActive || isCurrentFinal ? (
                    <div className="relative flex items-center justify-center">
                      <span className="absolute inline-flex h-8 w-8 animate-ping rounded-full opacity-30" style={{ backgroundColor: '#2E7D32' }} />
                      <div
                        className="relative flex h-5 w-5 items-center justify-center rounded-full border-2"
                        style={{ backgroundColor: '#2E7D32', borderColor: '#A5D6A7' }}
                      >
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                      style={{ backgroundColor: '#FAFAFA', borderColor: '#BDBDBD' }}
                    >
                      <Circle className="h-2 w-2" style={{ color: '#BDBDBD' }} />
                    </div>
                  )}
                </div>

                {/* Card content */}
                <Card
                  className="ml-6 sm:ml-8 transition-shadow hover:shadow-md"
                  style={{
                    opacity: isCompleted || isActive || isCurrentFinal ? 1 : 0.55,
                  }}
                >
                  <CardContent className="p-4">
                    {/* Header: Step number + timestamp */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold" style={{ color: '#2E7D32' }}>
                        Step {idx + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" style={{ color: '#9E9E9E' }} />
                        <span className="text-xs" style={{ color: '#9E9E9E' }}>
                          {formatDateTime(entry.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Handover flow */}
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full"
                          style={{ backgroundColor: fromBadge.bg, border: `1px solid ${fromBadge.border}` }}
                        >
                          <FromIcon className="h-3.5 w-3.5" style={{ color: fromBadge.color }} />
                        </div>
                        <div>
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: fromBadge.bg, color: fromBadge.color }}
                          >
                            {entry.fromParty}
                          </span>
                          <p className="text-xs font-medium mt-0.5" style={{ color: '#212121' }}>{entry.fromName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-2">
                        <div className="h-px w-6" style={{ backgroundColor: '#BDBDBD' }} />
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: '#757575' }}>
                          <path d="M3 6h6M7 4l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="h-px w-6" style={{ backgroundColor: '#BDBDBD' }} />
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full"
                          style={{ backgroundColor: toBadge.bg, border: `1px solid ${toBadge.border}` }}
                        >
                          <ToIcon className="h-3.5 w-3.5" style={{ color: toBadge.color }} />
                        </div>
                        <div>
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: toBadge.bg, color: toBadge.color }}
                          >
                            {entry.toParty}
                          </span>
                          <p className="text-xs font-medium mt-0.5" style={{ color: '#212121' }}>{entry.toName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* GPS Location */}
                      {entry.gpsLocation && (
                        <div className="flex items-start gap-2 rounded-lg p-2.5" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: '#757575' }} />
                          <div>
                            <p className="text-[10px] font-medium" style={{ color: '#9E9E9E' }}>Location</p>
                            <p className="text-xs" style={{ color: '#212121' }}>{entry.gpsLocation}</p>
                            {entry.latitude && entry.longitude && (
                              <p className="text-[10px] font-mono mt-0.5" style={{ color: '#9E9E9E' }}>
                                {entry.latitude.toFixed(4)}°, {entry.longitude.toFixed(4)}°
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Photo thumbnail */}
                      {entry.photoUrl && (
                        <div className="flex items-center gap-3 rounded-lg p-2.5" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                            style={{ backgroundColor: '#F5F5F5', border: '1px dashed #BDBDBD' }}
                          >
                            <Camera className="h-4 w-4" style={{ color: '#9E9E9E' }} />
                          </div>
                          <div>
                            <p className="text-[10px] font-medium" style={{ color: '#9E9E9E' }}>Photo Proof</p>
                            <p className="text-xs" style={{ color: '#212121' }}>Photo captured</p>
                          </div>
                        </div>
                      )}

                      {/* Signature thumbnail */}
                      {entry.signatureUrl && (
                        <div className="flex items-center gap-3 rounded-lg p-2.5" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                            style={{ backgroundColor: '#F5F5F5', border: '1px dashed #BDBDBD' }}
                          >
                            <PenLine className="h-4 w-4" style={{ color: '#9E9E9E' }} />
                          </div>
                          <div>
                            <p className="text-[10px] font-medium" style={{ color: '#9E9E9E' }}>Signature</p>
                            <p className="text-xs" style={{ color: '#212121' }}>Signed by {entry.toName.split(' ')[0]}</p>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {entry.notes && (
                        <div className="flex items-start gap-2 rounded-lg p-2.5 sm:col-span-2" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                          <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: '#757575' }} />
                          <div>
                            <p className="text-[10px] font-medium" style={{ color: '#9E9E9E' }}>Notes</p>
                            <p className="text-xs" style={{ color: '#212121' }}>{entry.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}