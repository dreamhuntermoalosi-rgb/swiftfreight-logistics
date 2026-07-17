'use client';

import { useState, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useNavStore } from '@/lib/store';
import {
  deliveries,
  statusLabels,
  statusColors,
  priorityColors,
  getDeliveryTimeline,
  companies,
} from '@/lib/mock-data';
import type { Delivery, DeliveryStatus } from '@/lib/types';
import {
  Package, Search, MapPin, ArrowRight, Clock, Truck, CheckCircle2, Circle,
  PackageSearch, User, Phone, Building2, Calendar, Zap, AlertCircle,
  Copy, Scale, AlertTriangle as AlertTriangleIcon,
} from 'lucide-react';
// Status order for the horizontal progress bar
const PROGRESS_STATUSES: DeliveryStatus[] = [
  'request_received', 'awaiting_quote', 'quote_accepted', 'collected',
  'at_warehouse', 'in_transit', 'at_border', 'out_for_delivery', 'delivered',
];

const PROGRESS_LABELS: Record<string, string> = {
  request_received: 'Request',
  awaiting_quote: 'Quote',
  quote_accepted: 'Accepted',
  collected: 'Collected',
  at_warehouse: 'Warehouse',
  in_transit: 'Transit',
  at_border: 'Border',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Status icon mapping
function getStatusIcon(status: DeliveryStatus) {
  switch (status) {
    case 'delivered': return <CheckCircle2 className="h-6 w-6" />;
    case 'cancelled': return <AlertCircle className="h-6 w-6" />;
    case 'returned': return <AlertCircle className="h-6 w-6" />;
    case 'in_transit': return <Truck className="h-6 w-6" />;
    default: return <Package className="h-6 w-6" />;
  }
}

// Example tracking numbers for the help text
const EXAMPLE_TRACKING = [
  'SF2025000001LS',
  'SF2025000100LS',
  'SF2025000250LS',
];

export function TrackingTab() {
  const { trackingNumber, setTrackingNumber } = useNavStore();
  const [inputValue, setInputValue] = useState(trackingNumber);
  const [searchedNumber, setSearchedNumber] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const delivery = useMemo(() => {
    if (!searchedNumber) return null;
    return deliveries.find((d) => d.trackingNumber === searchedNumber) ?? null;
  }, [searchedNumber]);

  const timeline = useMemo(() => {
    if (!delivery) return [];
    return getDeliveryTimeline(delivery);
  }, [delivery]);

  // Progress step index
  const currentStepIndex = useMemo(() => {
    if (!delivery) return -1;
    return PROGRESS_STATUSES.indexOf(delivery.status);
  }, [delivery]);

  const handleTrack = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      toast.error('Please enter a tracking number');
      return;
    }
    setTrackingNumber(trimmed);
    setSearchedNumber(trimmed);
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTrack();
  };

  const handleExampleClick = (num: string) => {
    setInputValue(num);
    setTrackingNumber(num);
    setSearchedNumber(num);
    setHasSearched(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 mb-2">
          <Package className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Track Your Parcel</h1>
        <p className="text-muted-foreground">
          Enter your tracking number to get real-time delivery updates
        </p>

        <div className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="e.g. SF2025000001LS"
              className="pl-10 h-12 text-base"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base font-semibold"
            onClick={handleTrack}
          >
            Track
          </Button>
        </div>

        {/* Example tracking numbers */}
        <div className="text-sm text-muted-foreground">
          <span className="mr-2">Try:</span>
          {EXAMPLE_TRACKING.map((num, i) => (
            <span key={num}>
              <button
                className="font-mono text-green-600 dark:text-green-400 hover:underline cursor-pointer"
                onClick={() => handleExampleClick(num)}
              >
                {num}
              </button>
              {i < EXAMPLE_TRACKING.length - 1 && <span className="mx-2">·</span>}
            </span>
          ))}
        </div>
      </div>

      <Separator />

      {/* Results */}
      
        {!hasSearched ? (
          <div
            key="placeholder"

            className="text-center py-12"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">Enter a tracking number to get started</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Your delivery updates will appear here
            </p>
          </div>
        ) : !delivery ? (
          <div
            key="not-found"

            className="text-center py-12"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <PackageSearch className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn&apos;t find any delivery with tracking number{' '}
              <span className="font-mono font-medium">{searchedNumber}</span>.
              Please check the number and try again.
            </p>
          </div>
        ) : (
          <div
            key="results"

            className="max-w-3xl mx-auto space-y-6"
          >
            {/* Status Banner */}
            <div className={`rounded-xl p-6 ${
              delivery.status === 'delivered'
                ? 'bg-primary text-primary-foreground'
                : delivery.status === 'cancelled'
                  ? 'bg-destructive text-destructive-foreground'
                  : delivery.status === 'returned'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'border border-primary/30 bg-primary/5'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`shrink-0 ${
                  delivery.status === 'delivered' || delivery.status === 'cancelled' || delivery.status === 'returned'
                    ? 'text-white'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {getStatusIcon(delivery.status)}
                </div>
                <div className="min-w-0">
                  <h2 className={`text-xl font-bold ${
                    delivery.status === 'delivered' || delivery.status === 'cancelled' || delivery.status === 'returned'
                      ? 'text-white'
                      : 'text-green-800 dark:text-green-200'
                  }`}>
                    {statusLabels[delivery.status] || delivery.status}
                  </h2>
                  <p className={`text-sm mt-1 ${
                    delivery.status === 'delivered' || delivery.status === 'cancelled' || delivery.status === 'returned'
                      ? 'text-white/80'
                      : 'text-green-700/80 dark:text-green-300/80'
                  }`}>
                    Last updated {new Date(delivery.updatedAt).toLocaleString('en-ZA', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              {delivery.estimatedDelivery && delivery.status !== 'delivered' && (
                <div className={`mt-4 pt-4 border-t ${
                  delivery.status === 'cancelled' || delivery.status === 'returned'
                    ? 'border-white/20'
                    : 'border-green-200 dark:border-green-700'
                }`}>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className={`h-4 w-4 ${
                      delivery.status === 'cancelled' || delivery.status === 'returned'
                        ? 'text-white/80'
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                    <span className={delivery.status === 'cancelled' || delivery.status === 'returned'
                      ? 'text-white/80'
                      : 'text-green-700 dark:text-green-300'
                    }>
                      Estimated Delivery: {formatDate(delivery.estimatedDelivery)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="rounded-lg border border-border/50 bg-card">
              <div className="p-6">
                <h3 className="text-sm font-semibold mb-6">Delivery Progress</h3>
                <div className="relative">
                  {/* Background track */}
                  <div className="absolute top-3 left-4 right-4 h-1 bg-muted rounded-full" />
                  {/* Progress fill */}
                  {currentStepIndex >= 0 && (
                    <div
                      className="absolute top-3 left-4 h-1 rounded-full transition-all duration-500"
                      style={{ width: `calc(${(currentStepIndex / (PROGRESS_STATUSES.length - 1)) * 100}% - ${currentStepIndex === 0 ? 0 : 32}px)` }}
                    />
                  )}
                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {PROGRESS_STATUSES.map((status, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const isTerminalFailed = ['cancelled', 'returned'].includes(delivery.status);
                      return (
                        <div key={status} className="flex flex-col items-center" style={{ width: `${100 / PROGRESS_STATUSES.length}%` }}>
                          <div className={`relative z-10 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isCurrent && !isTerminalFailed
                              ? 'bg-primary border-primary scale-110'
                              : isCompleted
                                ? 'bg-primary/80 border-primary/60'
                                : 'bg-background border-muted-foreground/30'
                          } ${isCurrent && !isTerminalFailed ? 'animate-[ring-pulse_2s_ease-in-out_infinite]' : ''}`}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                              <Circle className="h-3 w-3 text-muted-foreground/40" />
                            )}
                          </div>
                          <span className={`mt-2 text-[10px] sm:text-xs text-center leading-tight ${
                            isCurrent
                              ? 'font-bold text-green-700 dark:text-green-400 drop-shadow-[0_0_6px_oklch(0.55_0.15_155/0.5)]'
                              : isCompleted
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-muted-foreground'
                          }`}>
                            {PROGRESS_LABELS[status]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Detail */}
            {timeline.length > 0 && (
              <div className="rounded-lg border border-border/50 bg-card p-4">
                <div className="pb-2">
                  <h3 className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Detailed Timeline
                  </h3>
                </div>
                <div>
                  <div className="relative pl-8">
                    {timeline.map((event, idx) => {
                      const isLast = idx === timeline.length - 1;
                      const isCurrent = idx === timeline.length - 1 &&
                        !['delivered', 'returned', 'cancelled'].includes(delivery.status);
                      return (
                        <div key={event.id} className="relative pb-6 last:pb-0 group">
                          {!isLast && (
                            <div className="absolute left-[-20px] top-5 bottom-0 w-px" />
                          )}
                          {/* Dot */}
                          <div className={`absolute left-[-25px] top-1 h-3.5 w-3.5 rounded-full border-2 ${
                            isCurrent
                              ? 'bg-primary border-primary animate-[ring-pulse_2s_ease-in-out_infinite] shadow-md shadow-primary/30'
                              : 'bg-primary border-primary'
                          }`} />
                          {/* Event card with hover lift */}
                          <div className="-ml-2 p-2 -my-1 rounded-lg transition-all duration-200 group-hover:bg-primary/[0.03]">
                            <p className="text-sm font-medium">{event.description}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {event.location}
                              </span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{formatDateTime(event.timestamp)}</span>
                              {event.performedBy && (
                                <>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" /> {event.performedBy}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Package Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border/50 bg-card p-4">
                <div className="pb-2">
                  <h2 className="text-sm flex items-center gap-2">
                    <Package className="h-4 w-4" /> Package Information
                  </h2>
                </div>
                <div className="text-sm space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Description</p>
                    <p className="font-medium">{delivery.packageDescription}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" /> Weight</p>
                    <p>{delivery.packageWeight} kg</p>
                  </div>
                  {delivery.packageDimensions && (
                    <div>
                      <p className="text-xs text-muted-foreground">Dimensions</p>
                      <p>{delivery.packageDimensions}</p>
                    </div>
                  )}
                  <Separator />
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Pickup</p>
                        <p className="font-medium">{delivery.pickup.name}</p>
                        <p className="text-muted-foreground">{delivery.pickup.address}</p>
                        <p className="text-muted-foreground">{delivery.pickup.city}, {delivery.pickup.country}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Destination</p>
                        <p className="font-medium">{delivery.destination.name}</p>
                        <p className="text-muted-foreground">{delivery.destination.address}</p>
                        <p className="text-muted-foreground">{delivery.destination.city}, {delivery.destination.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Driver Info */}
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <div className="pb-2">
                    <h2 className="text-sm flex items-center gap-2">
                      <Truck className="h-4 w-4" /> Driver Information
                    </h2>
                  </div>
                  <div>
                    {delivery.driverName ? (
                      <div className="text-sm space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-400 text-sm font-bold">
                            {delivery.driverName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{delivery.driverName}</p>
                            {delivery.vehiclePlate && (
                              <p className="text-xs text-muted-foreground">Vehicle: {delivery.vehiclePlate}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No driver assigned yet</p>
                    )}
                  </div>
                </div>

                {/* Delivery Summary */}
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <div className="pb-2">
                    <h2 className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Delivery Summary
                    </h2>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tracking #</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-medium">{delivery.trackingNumber}</span>
                        <button
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(delivery.trackingNumber);
                            toast.success('Tracking number copied!');
                          }}
                          aria-label="Copy tracking number"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{formatDate(delivery.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        {delivery.priority === 'urgent' ? <AlertTriangleIcon className="h-3.5 w-3.5 text-red-500" /> : delivery.priority === 'express' ? <Clock className="h-3.5 w-3.5 text-amber-500" /> : <Package className="h-3.5 w-3.5" />}
                        Priority
                      </span>
                      <Badge className={`${priorityColors[delivery.priority] || ''} capitalize`} variant="secondary">
                        {delivery.priority}
                      </Badge>
                    </div>
                    {delivery.quotedAmount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-bold text-green-600">M{delivery.quotedAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Company</span>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium text-xs">{delivery.companyName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      
    </div>
  );
}