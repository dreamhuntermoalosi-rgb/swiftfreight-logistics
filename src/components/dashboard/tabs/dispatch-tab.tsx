'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import { deliveries, drivers, vehicles, statusLabels, statusColors, priorityColors } from '@/lib/mock-data';
import { MapPlaceholder } from '@/components/dashboard/map-placeholder';
import {
  Radio, Truck, Users, MapPin, Package, Clock, Send, Search,
  Filter, AlertTriangle, ChevronRight, Zap, Printer, MessageSquare,
  UserPlus, Fuel, Star, Phone, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Helpers ──────────────────────────────────────────────────
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

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const vehicleTypeColors: Record<string, string> = {
  motorcycle: 'border-l-blue-400',
  van: 'border-l-emerald-400',
  truck: 'border-l-orange-400',
  trailer: 'border-l-purple-400',
  pickup: 'border-l-teal-400',
};

const vehicleTypeIcons: Record<string, string> = {
  motorcycle: '🏍️',
  van: '🚐',
  truck: '🚛',
  trailer: '🚚',
  pickup: '🛻',
};

// ── Main Component ──────────────────────────────────────────
export function DispatchTab() {
  const { currentUser } = useAuthStore();
  const [deliveryTab, setDeliveryTab] = useState('pending');
  const [driverSearch, setDriverSearch] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [assignDriver, setAssignDriver] = useState('');
  const [assignVehicle, setAssignVehicle] = useState('');
  const [localDeliveries, setLocalDeliveries] = useState(deliveries);

  // Available drivers and vehicles
  const availableDrivers = useMemo(() => drivers.filter(d => d.status === 'available'), []);
  const availableVehicles = useMemo(() => vehicles.filter(v => v.status === 'available'), []);

  const filteredDrivers = useMemo(() => {
    if (!driverSearch) return availableDrivers;
    const q = driverSearch.toLowerCase();
    return availableDrivers.filter(
      d => d.name.toLowerCase().includes(q) || d.phone.includes(q)
    );
  }, [availableDrivers, driverSearch]);

  // Categorize deliveries
  const pendingDeliveries = useMemo(() => {
    const today = new Date().toDateString();
    return localDeliveries.filter(d =>
      !d.driverId &&
      !['delivered', 'cancelled', 'returned'].includes(d.status)
    ).slice(0, 28);
  }, [localDeliveries]);

  const inProgressDeliveries = useMemo(() => {
    return localDeliveries.filter(d =>
      d.driverId &&
      ['collected', 'at_warehouse', 'in_transit', 'at_border', 'out_for_delivery'].includes(d.status)
    ).slice(0, 20);
  }, [localDeliveries]);

  const completedToday = useMemo(() => {
    const today = new Date().toDateString();
    return localDeliveries.filter(d =>
      d.status === 'delivered' &&
      new Date(d.actualDelivery || d.updatedAt).toDateString() === today
    ).slice(0, 15);
  }, [localDeliveries]);

  const stats = useMemo(() => ({
    pending: pendingDeliveries.length || 28,
    inTransit: localDeliveries.filter(d => ['in_transit', 'at_border'].includes(d.status)).length || 45,
    outForDelivery: localDeliveries.filter(d => d.status === 'out_for_delivery').length || 35,
    completedToday: completedToday.length || 12,
  }), [pendingDeliveries, inProgressDeliveries, completedToday, localDeliveries]);

  function handleAssignClick(deliveryId: string) {
    setSelectedDelivery(deliveryId);
    setAssignDriver('');
    setAssignVehicle('');
    setAssignDialogOpen(true);
  }

  function handleConfirmAssign() {
    if (!assignDriver || !assignVehicle) {
      toast.error('Please select both a driver and a vehicle');
      return;
    }
    const driver = drivers.find(d => d.id === assignDriver);
    const vehicle = vehicles.find(v => v.id === assignVehicle);
    setLocalDeliveries(prev => prev.map(d =>
      d.id === selectedDelivery
        ? { ...d, driverId: assignDriver, driverName: driver?.name, vehicleId: assignVehicle, vehiclePlate: vehicle?.plateNumber, status: 'collected' as const }
        : d
    ));
    toast.success('Assignment Confirmed', {
      description: `${driver?.name} assigned with ${vehicle?.plateNumber}`,
    });
    setAssignDialogOpen(false);
    setSelectedDelivery(null);
  }

  function handleAutoAssign() {
    const unassigned = localDeliveries.filter(d => !d.driverId && !['delivered', 'cancelled', 'returned'].includes(d.status));
    if (unassigned.length === 0) {
      toast.info('No unassigned deliveries to auto-assign');
      return;
    }
    let count = 0;
    const updated = localDeliveries.map(d => {
      if (d.driverId || ['delivered', 'cancelled', 'returned'].includes(d.status)) return d;
      if (count >= 5) return d;
      const drv = availableDrivers[count % availableDrivers.length];
      const veh = availableVehicles[count % availableVehicles.length];
      if (!drv || !veh) return d;
      count++;
      return { ...d, driverId: drv.id, driverName: drv.name, vehicleId: veh.id, vehiclePlate: veh.plateNumber, status: 'collected' as const };
    });
    setLocalDeliveries(updated);
    toast.success('Auto-Assign Complete', { description: `${count} deliveries have been assigned` });
  }

  const selDelivery = useMemo(() => localDeliveries.find(d => d.id === selectedDelivery), [selectedDelivery, localDeliveries]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Radio className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Dispatch Centre</h2>
            <p className="text-sm text-muted-foreground">Operations dispatch &amp; resource management</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 dark:bg-green-900/20">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">Live</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Pending Assignment', value: stats.pending, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Clock },
          { label: 'In Transit', value: stats.inTransit, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: Truck },
          { label: 'Out for Delivery', value: stats.outForDelivery, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20', icon: MapPin },
          { label: 'Completed Today', value: stats.completedToday, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', icon: Package },
        ].map(stat => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={`${stat.bg} border-0 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-60`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleAutoAssign} className="gap-2 bg-primary hover:bg-primary/90">
          <Zap className="h-4 w-4" />
          Auto-Assign
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => toast.info('Print Manifests', { description: 'Preparing manifests for printing...' })}>
          <Printer className="h-4 w-4" />
          Print Manifests
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => toast.info('Bulk Updates', { description: 'Sending bulk status updates to customers...' })}>
          <MessageSquare className="h-4 w-4" />
          Send Bulk Updates
        </Button>
      </div>

      {/* Live Map */}
      <MapPlaceholder
        className="mb-4"
        height="h-48"
        title="Live Operations Map"
        subtitle="Real-time vehicle and delivery tracking across all routes"
        markers={[
          { label: 'Johannesburg Hub', type: 'warehouse' },
          { label: 'Maseru HQ', type: 'warehouse' },
          { label: 'Border Post', type: 'border' },
          { label: 'LP 456 AB 789', type: 'driver' },
          { label: 'LP 321 CD 456', type: 'driver' },
          { label: 'Butha Buthe Delivery', type: 'destination' },
        ]}
      />

      {/* Main Layout */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Left Column - Delivery Queue */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Delivery Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={deliveryTab} onValueChange={setDeliveryTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="pending" className="flex-1">
                    Pending
                    {pendingDeliveries.length > 0 && (
                      <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{pendingDeliveries.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="flex-1">
                    In Progress
                    {inProgressDeliveries.length > 0 && (
                      <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{inProgressDeliveries.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1">
                    Completed
                  </TabsTrigger>
                </TabsList>

                {/* Pending Tab */}
                <TabsContent value="pending" className="mt-3">
                  <ScrollArea className="max-h-[480px]">
                    <div className="space-y-2">
                      {pendingDeliveries.length === 0 && (
                        <div className="py-8 text-center text-sm text-muted-foreground">No pending deliveries</div>
                      )}
                      {pendingDeliveries.map(d => (
                        <motion.div
                          key={d.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-medium text-primary">{d.trackingNumber}</code>
                              <Badge variant="outline" className={priorityColors[d.priority]}>{d.priority}</Badge>
                            </div>
                            <p className="truncate text-sm font-medium">{d.customerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {d.pickup.city} <ChevronRight className="inline h-3 w-3" /> {d.destination.city}
                            </p>
                            <p className="text-xs text-muted-foreground">{d.packageWeight}kg • {d.packageDescription}</p>
                          </div>
                          <Button size="sm" className="shrink-0 gap-1" onClick={() => handleAssignClick(d.id)}>
                            <UserPlus className="h-3.5 w-3.5" />
                            Assign
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* In Progress Tab */}
                <TabsContent value="progress" className="mt-3">
                  <ScrollArea className="max-h-[480px]">
                    <div className="space-y-2">
                      {inProgressDeliveries.length === 0 && (
                        <div className="py-8 text-center text-sm text-muted-foreground">No deliveries in progress</div>
                      )}
                      {inProgressDeliveries.map(d => (
                        <motion.div
                          key={d.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-medium text-primary">{d.trackingNumber}</code>
                              <Badge className={statusColors[d.status]}>{statusLabels[d.status]}</Badge>
                            </div>
                            <p className="truncate text-sm font-medium">{d.customerName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{d.driverName}</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{timeAgo(d.updatedAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Truck className="h-3.5 w-3.5" />
                            <span className="font-mono">{d.vehiclePlate}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Completed Today Tab */}
                <TabsContent value="completed" className="mt-3">
                  <ScrollArea className="max-h-[480px]">
                    <div className="space-y-2">
                      {completedToday.length === 0 && (
                        <div className="py-8 text-center text-sm text-muted-foreground">No deliveries completed today</div>
                      )}
                      {completedToday.map(d => (
                        <motion.div
                          key={d.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-medium text-primary">{d.trackingNumber}</code>
                              <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">Delivered</Badge>
                            </div>
                            <p className="truncate text-sm">{d.customerName}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {d.actualDelivery ? formatTime(d.actualDelivery) : formatTime(d.updatedAt)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Resource Panels */}
        <div className="space-y-4 lg:col-span-2">
          {/* Driver Availability */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  Available Drivers
                </CardTitle>
                <Badge variant="outline" className="text-green-600">{availableDrivers.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search drivers..."
                    className="pl-8"
                    value={driverSearch}
                    onChange={e => setDriverSearch(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="max-h-[240px]">
                <div className="space-y-2">
                  {filteredDrivers.slice(0, 10).map(d => (
                    <div key={d.id} className="flex items-center gap-3 rounded-lg border p-2.5 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {d.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{d.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />{d.rating}</span>
                          <span>•</span>
                          <span>{d.totalDeliveries} deliveries</span>
                        </div>
                      </div>
                      <a href={`tel:${d.phone}`} className="text-muted-foreground hover:text-primary">
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Vehicle Availability */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Truck className="h-4 w-4" />
                  Available Vehicles
                </CardTitle>
                <Badge variant="outline" className="text-green-600">{availableVehicles.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[240px]">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {availableVehicles.slice(0, 8).map(v => (
                    <div
                      key={v.id}
                      className={`rounded-lg border border-l-4 p-2.5 ${vehicleTypeColors[v.type] || 'border-l-gray-400'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{vehicleTypeIcons[v.type] || '🚗'}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs font-bold">{v.plateNumber}</p>
                          <p className="truncate text-xs text-muted-foreground">{v.make} {v.model}</p>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] px-1.5">{v.type}</Badge>
                        <span className="text-[10px] text-muted-foreground">{v.capacity}kg</span>
                        <Fuel className="ml-auto h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{v.fuelType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Assign Resources
            </DialogTitle>
          </DialogHeader>

          {selDelivery && (
            <div className="space-y-4">
              {/* Delivery Info */}
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">Delivery</p>
                <div className="mt-1 flex items-center gap-2">
                  <code className="text-sm font-bold text-primary">{selDelivery.trackingNumber}</code>
                  <Badge variant="outline" className={priorityColors[selDelivery.priority]}>{selDelivery.priority}</Badge>
                </div>
                <p className="mt-1 text-sm">{selDelivery.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {selDelivery.pickup.city} → {selDelivery.destination.city}
                </p>
                <p className="text-xs text-muted-foreground">{selDelivery.packageWeight}kg • {selDelivery.packageDescription}</p>
              </div>

              <Separator />

              {/* Driver Select */}
              <div className="space-y-2">
                <Label>Select Driver</Label>
                <Select value={assignDriver} onValueChange={setAssignDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map(d => (
                      <SelectItem key={d.id} value={d.id}>
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          {d.name} — ★ {d.rating} ({d.totalDeliveries} deliveries)
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Select */}
              <div className="space-y-2">
                <Label>Select Vehicle</Label>
                <Select value={assignVehicle} onValueChange={setAssignVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vehicle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>
                        <span className="flex items-center gap-2">
                          {vehicleTypeIcons[v.type]}
                          {v.plateNumber} — {v.make} {v.model} ({v.capacity}kg)
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmAssign} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

