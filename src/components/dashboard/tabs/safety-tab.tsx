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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store';
import type { IncidentReport } from '@/lib/types';
import {
  AlertTriangle,
  UserX,
  MapPinX,
  ShieldAlert,
  Siren,
  Wrench,
  ShieldX,
  Car,
  Clock,
  PackageX,
  PackageOpen,
  MessageSquareWarning,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  CheckCircle2,
  Eye,
  XCircle,
  AlertCircle,
  Shield,
  Timer,
} from 'lucide-react';

// ============ MOCK DATA ============
const mockIncidents: IncidentReport[] = [
  {
    id: 'inc-001',
    deliveryId: 'del-001',
    reporterId: 'drv-001',
    reporterName: 'Kabelo Mothibi',
    reporterRole: 'driver',
    incidentType: 'Suspicious Package',
    description:
      'Package was unusually heavy and had no visible labeling. Customer could not explain contents when asked. Refused to open for inspection. Reported to supervisor immediately.',
    status: 'investigating',
    priority: 'high',
    createdAt: '2025-01-18T08:30:00Z',
    updatedAt: '2025-01-18T10:15:00Z',
  },
  {
    id: 'inc-002',
    deliveryId: 'del-005',
    reporterId: 'cus-003',
    reporterName: 'Mpho Tšepe',
    reporterRole: 'customer',
    incidentType: 'Damaged Goods',
    description:
      'Received parcel from Johannesburg route. Outer box was torn and one of three items (Samsung TV) had a cracked screen. Photos taken at the door.',
    status: 'open',
    priority: 'medium',
    createdAt: '2025-01-17T14:20:00Z',
    updatedAt: '2025-01-17T14:20:00Z',
  },
  {
    id: 'inc-003',
    deliveryId: undefined,
    reporterId: 'drv-003',
    reporterName: 'Tumelo Kuo',
    reporterRole: 'driver',
    incidentType: 'Vehicle Breakdown',
    description:
      'Truck broke down on the Maseru–Leribe highway near Teyateyaneng. Engine overheating. Had to offload 4 parcels to a passing SwiftFreight vehicle. Mechanic called.',
    status: 'resolved',
    priority: 'critical',
    createdAt: '2025-01-16T11:00:00Z',
    updatedAt: '2025-01-16T18:30:00Z',
  },
  {
    id: 'inc-004',
    deliveryId: 'del-012',
    reporterId: 'cus-007',
    reporterName: 'Limpho Letsie',
    reporterRole: 'customer',
    incidentType: 'Late Delivery',
    description:
      'Parcel was promised within 3 days from Johannesburg. It has been 7 days and still shows "at border". No communication received. Need this urgently for my business.',
    status: 'investigating',
    priority: 'high',
    createdAt: '2025-01-18T07:45:00Z',
    updatedAt: '2025-01-18T09:00:00Z',
  },
  {
    id: 'inc-005',
    deliveryId: undefined,
    reporterId: 'drv-002',
    reporterName: 'Mokhethi Phakoe',
    reporterRole: 'driver',
    incidentType: 'Border Issue',
    description:
      'Lesotho Revenue Authority held 2 parcels at Maseru Bridge border post claiming incorrect customs declarations. Documents presented but they need original invoices from suppliers.',
    status: 'open',
    priority: 'medium',
    createdAt: '2025-01-17T09:15:00Z',
    updatedAt: '2025-01-17T09:15:00Z',
  },
  {
    id: 'inc-006',
    deliveryId: 'del-008',
    reporterId: 'cus-012',
    reporterName: 'Nthabeleng Mokone',
    reporterRole: 'customer',
    incidentType: 'Missing Items',
    description:
      'Ordered 5 pairs of shoes from Takealot. Only 3 pairs received. Driver said the box was sealed when he picked it up. Delivery note says 3 items.',
    status: 'open',
    priority: 'high',
    createdAt: '2025-01-18T10:00:00Z',
    updatedAt: '2025-01-18T10:00:00Z',
  },
  {
    id: 'inc-007',
    deliveryId: undefined,
    reporterId: 'drv-005',
    reporterName: 'Palesa Nkoe',
    reporterRole: 'driver',
    incidentType: 'Aggressive Customer',
    description:
      'Customer in Mafeteng became aggressive when told the delivery would be delayed by one day due to road conditions. Threatened to damage the vehicle. I left the area and called dispatch.',
    status: 'resolved',
    priority: 'critical',
    createdAt: '2025-01-15T16:30:00Z',
    updatedAt: '2025-01-16T09:00:00Z',
  },
  {
    id: 'inc-008',
    deliveryId: 'del-020',
    reporterId: 'cus-015',
    reporterName: 'Thabo Mokone',
    reporterRole: 'customer',
    incidentType: 'Dangerous Driving',
    description:
      'Driver was speeding through Quthing town center and almost hit a pedestrian. Very unprofessional behaviour representing SwiftFreight. Registration AB-123-C if needed.',
    status: 'investigating',
    priority: 'medium',
    createdAt: '2025-01-17T12:00:00Z',
    updatedAt: '2025-01-17T15:00:00Z',
  },
];

// ============ INCIDENT TYPE CONFIGS ============
interface IncidentTypeOption {
  type: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const driverIncidentTypes: IncidentTypeOption[] = [
  { type: 'Suspicious Package', label: 'Suspicious Package', icon: AlertTriangle, color: 'text-amber-600' },
  { type: 'Customer Absent', label: 'Customer Absent', icon: UserX, color: 'text-slate-500' },
  { type: 'Wrong Address', label: 'Wrong Address', icon: MapPinX, color: 'text-red-500' },
  { type: 'Aggressive Customer', label: 'Aggressive Customer', icon: ShieldAlert, color: 'text-red-600' },
  { type: 'Police Incident', label: 'Police Incident', icon: Siren, color: 'text-blue-600' },
  { type: 'Vehicle Breakdown', label: 'Vehicle Breakdown', icon: Wrench, color: 'text-orange-600' },
  { type: 'Border Issue', label: 'Border Issue', icon: ShieldX, color: 'text-purple-600' },
  { type: 'Accident', label: 'Accident', icon: Car, color: 'text-red-700' },
];

const customerIncidentTypes: IncidentTypeOption[] = [
  { type: 'Late Delivery', label: 'Late Delivery', icon: Clock, color: 'text-amber-600' },
  { type: 'Driver Misconduct', label: 'Driver Misconduct', icon: UserX, color: 'text-slate-500' },
  { type: 'Dangerous Driving', label: 'Dangerous Driving', icon: AlertTriangle, color: 'text-red-500' },
  { type: 'Missing Items', label: 'Missing Items', icon: PackageX, color: 'text-orange-600' },
  { type: 'Damaged Goods', label: 'Damaged Goods', icon: PackageOpen, color: 'text-red-600' },
  { type: 'Unprofessional Behaviour', label: 'Unprofessional Behaviour', icon: MessageSquareWarning, color: 'text-purple-600' },
  { type: 'Suspected Fraud', label: 'Suspected Fraud', icon: ShieldAlert, color: 'text-red-700' },
];

// ============ STATUS / PRIORITY CONFIGS ============
const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  open: { label: 'Open', bg: 'bg-amber-50', text: 'text-amber-700' },
  investigating: { label: 'Investigating', bg: 'bg-blue-50', text: 'text-blue-700' },
  resolved: { label: 'Resolved', bg: 'bg-green-50', text: 'text-green-700' },
  dismissed: { label: 'Dismissed', bg: 'bg-gray-100', text: 'text-gray-500' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  low: { label: 'Low', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  medium: { label: 'Medium', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  high: { label: 'High', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
  critical: { label: 'Critical', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

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

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateTime(dateStr);
}

// ============ DRIVER VIEW ============
function DriverView() {
  const { currentUser } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [deliveryId, setDeliveryId] = useState('');
  const [localReports, setLocalReports] = useState(mockIncidents.filter((r) => r.reporterRole === 'driver'));

  const myReports = useMemo(
    () => localReports.filter((r) => r.reporterId === currentUser?.id).length > 0
      ? localReports.filter((r) => r.reporterId === currentUser?.id)
      : localReports.slice(0, 4),
    [localReports, currentUser?.id]
  );

  function handleQuickReport(type: string) {
    setSelectedType(type);
    setDescription('');
    setPriority('medium');
    setDeliveryId('');
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!description.trim()) {
      toast.error('Please provide a description of the incident.');
      return;
    }
    const newReport: IncidentReport = {
      id: `inc-${Date.now()}`,
      deliveryId: deliveryId || undefined,
      reporterId: currentUser?.id || 'drv-001',
      reporterName: currentUser?.name || 'Current Driver',
      reporterRole: 'driver',
      incidentType: selectedType,
      description: description.trim(),
      status: 'open',
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalReports((prev) => [newReport, ...prev]);
    setDialogOpen(false);
    toast.success('Incident report submitted successfully.');
  }

  return (
    <div className="space-y-6">
      {/* Report Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: '#212121' }}>Report an Incident</h2>
          <p className="text-sm" style={{ color: '#757575' }}>Quickly report safety issues during your deliveries</p>
        </div>
        <Button
          onClick={() => handleQuickReport('')}
          className="gap-2 font-medium"
          style={{ backgroundColor: '#2E7D32', color: 'white' }}
        >
          <Plus className="h-4 w-4" /> Report Incident
        </Button>
      </div>

      {/* Quick Report Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium" style={{ color: '#757575' }}>Select Incident Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {driverIncidentTypes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => handleQuickReport(item.type)}
                  className="flex flex-col items-center gap-2 rounded-xl border p-4 hover:shadow-md transition-all duration-200 hover:border-green-300 hover:bg-green-50/50"
                  style={{ borderColor: '#E0E0E0' }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: '#E8F5E9' }}
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="text-xs font-medium text-center" style={{ color: '#212121' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* My Recent Reports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold" style={{ color: '#212121' }}>My Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myReports.map((report) => {
              const sc = statusConfig[report.status];
              const pc = priorityConfig[report.priority];
              return (
                <div
                  key={report.id}
                  className="rounded-lg border p-4 transition-colors"
                  style={{
                    borderColor: '#E0E0E0',
                    backgroundColor:
                      report.priority === 'critical' ? '#FEE2E2' :
                      report.priority === 'high' ? '#FEF3C7' :
                      'white',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: '#212121' }}>
                          {report.incidentType}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: pc.bg, color: pc.text }}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${pc.dot}`} />
                          {pc.label}
                        </span>
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {sc.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs line-clamp-2" style={{ color: '#757575' }}>
                        {report.description}
                      </p>
                      <p className="mt-1.5 text-xs" style={{ color: '#9E9E9E' }}>{timeAgo(report.createdAt)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" style={{ color: '#2E7D32' }} />
              Report Incident
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedType && (
              <div className="rounded-lg p-3" style={{ backgroundColor: '#E8F5E9' }}>
                <p className="text-sm font-medium" style={{ color: '#2E7D32' }}>{selectedType}</p>
              </div>
            )}
            {!selectedType && (
              <div>
                <Label>Incident Type</Label>
                <Select onValueChange={setSelectedType} value={selectedType}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    {driverIncidentTypes.map((t) => (
                      <SelectItem key={t.type} value={t.type}>{t.type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Delivery (Optional)</Label>
              <Select onValueChange={setDeliveryId} value={deliveryId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a delivery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="del-001">SF-2025-001 (Maseru → Leribe)</SelectItem>
                  <SelectItem value="del-005">SF-2025-005 (JHB → Maseru)</SelectItem>
                  <SelectItem value="del-012">SF-2025-012 (Maseru → Mafeteng)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                className="mt-1.5 min-h-[100px]"
                placeholder="Describe what happened in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>Priority</Label>
              <Select onValueChange={(v) => setPriority(v as typeof priority)} value={priority}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              className="gap-2"
              style={{ backgroundColor: '#2E7D32', color: 'white' }}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ CUSTOMER VIEW ============
function CustomerView() {
  const { currentUser } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [deliveryId, setDeliveryId] = useState('');
  const [localReports, setLocalReports] = useState(mockIncidents.filter((r) => r.reporterRole === 'customer'));

  const myReports = useMemo(
    () => localReports.filter((r) => r.reporterId === currentUser?.id).length > 0
      ? localReports.filter((r) => r.reporterId === currentUser?.id)
      : localReports.slice(0, 4),
    [localReports, currentUser?.id]
  );

  function handleQuickReport(type: string) {
    setSelectedType(type);
    setDescription('');
    setPriority('medium');
    setDeliveryId('');
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!description.trim()) {
      toast.error('Please provide a description of the issue.');
      return;
    }
    const newReport: IncidentReport = {
      id: `inc-${Date.now()}`,
      deliveryId: deliveryId || undefined,
      reporterId: currentUser?.id || 'cus-001',
      reporterName: currentUser?.name || 'Current Customer',
      reporterRole: 'customer',
      incidentType: selectedType,
      description: description.trim(),
      status: 'open',
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalReports((prev) => [newReport, ...prev]);
    setDialogOpen(false);
    toast.success('Issue reported successfully. We will investigate promptly.');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: '#212121' }}>Report an Issue</h2>
          <p className="text-sm" style={{ color: '#757575' }}>Let us know about any problems with your delivery</p>
        </div>
        <Button
          onClick={() => handleQuickReport('')}
          className="gap-2 font-medium"
          style={{ backgroundColor: '#2E7D32', color: 'white' }}
        >
          <Plus className="h-4 w-4" /> Report Issue
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium" style={{ color: '#757575' }}>What issue are you experiencing?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {customerIncidentTypes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => handleQuickReport(item.type)}
                  className="flex flex-col items-center gap-2 rounded-xl border p-4 hover:shadow-md transition-all duration-200 hover:border-green-300 hover:bg-green-50/50"
                  style={{ borderColor: '#E0E0E0' }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: '#E8F5E9' }}
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="text-xs font-medium text-center" style={{ color: '#212121' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold" style={{ color: '#212121' }}>My Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myReports.map((report) => {
              const sc = statusConfig[report.status];
              const pc = priorityConfig[report.priority];
              return (
                <div
                  key={report.id}
                  className="rounded-lg border p-4"
                  style={{ borderColor: '#E0E0E0' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: '#212121' }}>
                          {report.incidentType}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: pc.bg, color: pc.text }}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${pc.dot}`} />
                          {pc.label}
                        </span>
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {sc.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs line-clamp-2" style={{ color: '#757575' }}>
                        {report.description}
                      </p>
                      <p className="mt-1.5 text-xs" style={{ color: '#9E9E9E' }}>{timeAgo(report.createdAt)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" style={{ color: '#2E7D32' }} />
              Report an Issue
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedType && (
              <div className="rounded-lg p-3" style={{ backgroundColor: '#E8F5E9' }}>
                <p className="text-sm font-medium" style={{ color: '#2E7D32' }}>{selectedType}</p>
              </div>
            )}
            {!selectedType && (
              <div>
                <Label>Issue Type</Label>
                <Select onValueChange={setSelectedType} value={selectedType}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerIncidentTypes.map((t) => (
                      <SelectItem key={t.type} value={t.type}>{t.type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Related Delivery (Optional)</Label>
              <Select onValueChange={setDeliveryId} value={deliveryId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a delivery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="del-005">SF-2025-005 (JHB → Maseru)</SelectItem>
                  <SelectItem value="del-012">SF-2025-012 (Maseru → Quthing)</SelectItem>
                  <SelectItem value="del-008">SF-2025-008 (Cape Town → Maseru)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                className="mt-1.5 min-h-[100px]"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>Priority</Label>
              <Select onValueChange={(v) => setPriority(v as typeof priority)} value={priority}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              className="gap-2"
              style={{ backgroundColor: '#2E7D32', color: 'white' }}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ SORT ICON ============
function SortIcon({ field, sortField, sortDir }: { field: 'createdAt' | 'priority' | 'status'; sortField: string; sortDir: string }) {
  if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
  return sortDir === 'asc' ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1 rotate-180" />;
}

// ============ MANAGER / ADMIN VIEW ============
function ManagerView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<'createdAt' | 'priority' | 'status'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  const allIncidentTypes = Array.from(new Set([...driverIncidentTypes, ...customerIncidentTypes].map((t) => t.type)));

  const filtered = useMemo(() => {
    let result = [...mockIncidents];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.incidentType.toLowerCase().includes(s) ||
          r.reporterName.toLowerCase().includes(s) ||
          r.description.toLowerCase().includes(s)
      );
    }
    if (statusFilter !== 'all') result = result.filter((r) => r.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter((r) => r.priority === priorityFilter);
    if (roleFilter !== 'all') result = result.filter((r) => r.reporterRole === roleFilter);
    if (typeFilter !== 'all') result = result.filter((r) => r.incidentType === typeFilter);

    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const statusOrder = { open: 0, investigating: 1, resolved: 2, dismissed: 3 };

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'priority') cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
      else if (sortField === 'status') cmp = statusOrder[a.status] - statusOrder[b.status];
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [search, statusFilter, priorityFilter, roleFilter, typeFilter, sortField, sortDir]);

  // KPI calculations
  const openReports = mockIncidents.filter((r) => r.status === 'open' || r.status === 'investigating').length;
  const criticalReports = mockIncidents.filter((r) => r.priority === 'critical' && r.status !== 'resolved' && r.status !== 'dismissed').length;
  const resolvedThisWeek = mockIncidents.filter((r) => r.status === 'resolved').length;

  function toggleSort(field: 'createdAt' | 'priority' | 'status') {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: '#212121' }}>Safety Dashboard</h2>
        <p className="text-sm" style={{ color: '#757575' }}>Monitor and manage all incident reports across the organisation</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: '#757575' }}>Total Open</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#212121' }}>{openReports}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#FEF3C7' }}>
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl" style={{ backgroundColor: '#FEE2E2' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-600">Critical Priority</p>
                <p className="text-2xl font-bold mt-1 text-red-700">{criticalReports}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: '#757575' }}>Resolved This Week</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#2E7D32' }}>{resolvedThisWeek}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#DCFCE7' }}>
                <CheckCircle2 className="h-5 w-5" style={{ color: '#2E7D32' }} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: '#757575' }}>Avg. Resolution</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#212121' }}>1.4d</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#E8F5E9' }}>
                <Timer className="h-5 w-5" style={{ color: '#2E7D32' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9E9E9E' }} />
              <Input
                placeholder="Search incidents..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-3.5 w-3.5 mr-1.5" style={{ color: '#9E9E9E' }} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="driver">Drivers</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {allIncidentTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold cursor-pointer select-none" style={{ color: '#757575' }} onClick={() => toggleSort('createdAt')}>
                    <span className="inline-flex items-center">Date <SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="text-xs font-semibold" style={{ color: '#757575' }}>Type</TableHead>
                  <TableHead className="text-xs font-semibold" style={{ color: '#757575' }}>Reporter</TableHead>
                  <TableHead className="text-xs font-semibold cursor-pointer select-none" style={{ color: '#757575' }} onClick={() => toggleSort('priority')}>
                    <span className="inline-flex items-center">Priority <SortIcon field="priority" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="text-xs font-semibold cursor-pointer select-none" style={{ color: '#757575' }} onClick={() => toggleSort('status')}>
                    <span className="inline-flex items-center">Status <SortIcon field="status" sortField={sortField} sortDir={sortDir} /></span>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-right" style={{ color: '#757575' }}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((report) => {
                  const sc = statusConfig[report.status];
                  const pc = priorityConfig[report.priority];
                  return (
                    <TableRow
                      key={report.id}
                      className="cursor-pointer"
                      style={{
                        backgroundColor:
                          report.priority === 'critical' ? '#FEF2F2' : undefined,
                      }}
                      onClick={() => setSelectedReport(report)}
                    >
                      <TableCell className="text-xs py-3" style={{ color: '#212121' }}>
                        {formatDateTime(report.createdAt)}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium" style={{ color: '#212121' }}>{report.incidentType}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium" style={{ color: '#212121' }}>{report.reporterName}</span>
                          <span className="text-[10px] capitalize" style={{ color: '#9E9E9E' }}>{report.reporterRole}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: pc.bg, color: pc.text }}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${pc.dot}`} />
                          {pc.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {sc.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                        >
                          <Eye className="h-3 w-3" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm" style={{ color: '#9E9E9E' }}>
                      No incidents match your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: '#2E7D32' }} />
                    Incident Details
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: priorityConfig[selectedReport.priority].bg, color: priorityConfig[selectedReport.priority].text }}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${priorityConfig[selectedReport.priority].dot}`} />
                      {priorityConfig[selectedReport.priority].label}
                    </span>
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: statusConfig[selectedReport.status].bg, color: statusConfig[selectedReport.status].text }}
                    >
                      {statusConfig[selectedReport.status].label}
                    </span>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#9E9E9E' }}>Incident Type</p>
                    <p className="text-sm font-medium mt-0.5" style={{ color: '#212121' }}>{selectedReport.incidentType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#9E9E9E' }}>Reported By</p>
                    <p className="text-sm font-medium mt-0.5" style={{ color: '#212121' }}>{selectedReport.reporterName}</p>
                    <p className="text-xs capitalize" style={{ color: '#9E9E9E' }}>{selectedReport.reporterRole}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#9E9E9E' }}>Created</p>
                    <p className="text-sm mt-0.5" style={{ color: '#212121' }}>{formatDateTime(selectedReport.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#9E9E9E' }}>Last Updated</p>
                    <p className="text-sm mt-0.5" style={{ color: '#212121' }}>{formatDateTime(selectedReport.updatedAt)}</p>
                  </div>
                  {selectedReport.deliveryId && (
                    <div className="col-span-2">
                      <p className="text-xs font-medium" style={{ color: '#9E9E9E' }}>Related Delivery</p>
                      <p className="text-sm font-mono mt-0.5" style={{ color: '#212121' }}>{selectedReport.deliveryId}</p>
                    </div>
                  )}
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium mb-1.5" style={{ color: '#9E9E9E' }}>Description</p>
                  <div className="rounded-lg p-3" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                    <p className="text-sm leading-relaxed" style={{ color: '#212121' }}>{selectedReport.description}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <XCircle className="h-3.5 w-3.5" /> Dismiss
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  style={{ borderColor: '#2E7D32', color: '#2E7D32' }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ MAIN EXPORT ============
export function SafetyTab() {
  const { currentUser } = useAuthStore();
  const role = currentUser?.role;

  if (role === 'driver') return <DriverView />;
  if (role === 'customer') return <CustomerView />;
  return <ManagerView />;
}