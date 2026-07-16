'use client';

import { useState, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useAuthStore } from '@/lib/store';
import type { IncidentReport } from '@/lib/types';
import {
  Car,
  AlertTriangle,
  ShieldAlert,
  PackageX,
  Wrench,
  Heart,
  Shield,
  PackageSearch,
  PackageOpen,
  Box,
  Eye,
  MapPinOff,
  Clock,
  Lock,
  Camera,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Info,
} from 'lucide-react';

// ============ MOCK DATA ============
const mockIncidents: IncidentReport[] = [
  {
    id: 'inc-001',
    deliveryId: 'del-001',
    reporterId: 'drv-001',
    reporterName: 'Kabelo Mothibi',
    reporterRole: 'driver',
    incidentType: 'Vehicle Accident',
    description:
      'Minor collision with a stationary vehicle on Kingsway Road, Maseru. No injuries. Front bumper damaged. Police report filed. Both vehicles moved to roadside.',
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
    incidentType: 'Damaged Package',
    description:
      'Received parcel from Mafeteng route. Outer box was torn and one of three items (Samsung TV) had a cracked screen. Photos taken at the door.',
    status: 'open',
    priority: 'high',
    createdAt: '2025-01-17T14:20:00Z',
    updatedAt: '2025-01-17T14:20:00Z',
  },
  {
    id: 'inc-003',
    deliveryId: undefined,
    reporterId: 'drv-003',
    reporterName: 'Tumelo Kuo',
    reporterRole: 'driver',
    incidentType: 'Mechanical Breakdown',
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
      'Parcel was promised within 3 days from Leribe. It has been 7 days and still shows "in transit". No communication received. Need this urgently for my business.',
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
    incidentType: 'Road Hazard',
    description:
      'Severe flooding on the Roma–Mohales Hoek road. Two sections of the road are washed out. Had to reroute through Semonkong adding 3 hours to the trip.',
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
    incidentType: 'Missing Contents',
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
    incidentType: 'Security Threat',
    description:
      'Suspicious individual followed the delivery van for 20 minutes in Mafeteng industrial area. Vehicle reg: unknown blue sedan. Drove to nearest police station.',
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
    incidentType: 'Suspicious Activity',
    description:
      'Delivery driver asked for my ID number and took a photo of it on his personal phone. Said it was "company policy" but no ID verification happened at pickup.',
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
  description: string;
  icon: React.ElementType;
  color: string;
}

const driverIncidentTypes: IncidentTypeOption[] = [
  { type: 'Vehicle Accident', label: 'Vehicle Accident', description: 'Traffic collision or vehicular accident', icon: Car, color: '#D32F2F' },
  { type: 'Road Hazard', label: 'Road Hazard', description: 'Dangerous road conditions, potholes, flooding', icon: AlertTriangle, color: '#F57C00' },
  { type: 'Theft / Hijacking', label: 'Theft / Hijacking', description: 'Cargo theft or vehicle hijacking attempt', icon: ShieldAlert, color: '#C62828' },
  { type: 'Package Damage', label: 'Package Damage', description: 'Discovered damage to package in transit', icon: PackageX, color: '#E65100' },
  { type: 'Mechanical Breakdown', label: 'Mechanical Breakdown', description: 'Vehicle mechanical failure', icon: Wrench, color: '#F9A825' },
  { type: 'Medical Emergency', label: 'Medical Emergency', description: 'Driver or third-party medical emergency', icon: Heart, color: '#D32F2F' },
  { type: 'Security Threat', label: 'Security Threat', description: 'Any security concern or threatening situation', icon: Shield, color: '#AD1457' },
];

const customerIncidentTypes: IncidentTypeOption[] = [
  { type: 'Wrong Package Received', label: 'Wrong Package', description: 'Received a package that doesn\'t belong to you', icon: PackageSearch, color: '#1565C0' },
  { type: 'Damaged Package', label: 'Damaged Package', description: 'Package arrived damaged', icon: PackageOpen, color: '#D32F2F' },
  { type: 'Missing Contents', label: 'Missing Contents', description: 'Package arrived but contents missing', icon: Box, color: '#E65100' },
  { type: 'Suspicious Activity', label: 'Suspicious Activity', description: 'Suspicious behavior by delivery personnel', icon: Eye, color: '#6A1B9A' },
  { type: 'Late Delivery', label: 'Late Delivery', description: 'Significantly late with no communication', icon: Clock, color: '#F57C00' },
  { type: 'Incorrect Address', label: 'Incorrect Address', description: 'Driver went to wrong location', icon: MapPinOff, color: '#D84315' },
  { type: 'Privacy Concern', label: 'Privacy Concern', description: 'Personal information or privacy issue', icon: Lock, color: '#283593' },
];

// ============ STATUS / PRIORITY CONFIGS ============
const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  open: { label: 'Open', bg: '#F5F5F5', text: '#616161', border: '#E0E0E0' },
  investigating: { label: 'Investigating', bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' },
  resolved: { label: 'Resolved', bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  dismissed: { label: 'Dismissed', bg: '#FAFAFA', text: '#9E9E9E', border: '#EEEEEE' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
  low: { label: 'Low', bg: '#F5F5F5', text: '#616161', dot: '#9E9E9E', border: '#E0E0E0' },
  medium: { label: 'Medium', bg: '#FFF8E1', text: '#F57F17', dot: '#FFB300', border: '#FFE082' },
  high: { label: 'High', bg: '#FFF3E0', text: '#E65100', dot: '#FB8C00', border: '#FFCC80' },
  critical: { label: 'Critical', bg: '#FEE2E2', text: '#C62828', dot: '#EF5350', border: '#EF9A9A' },
};

const priorityRadioConfig = [
  { value: 'low' as const, label: 'Low', color: '#9E9E9E', bg: '#F5F5F5', border: '#E0E0E0' },
  { value: 'medium' as const, label: 'Medium', color: '#F57F17', bg: '#FFF8E1', border: '#FFE082' },
  { value: 'high' as const, label: 'High', color: '#E65100', bg: '#FFF3E0', border: '#FFCC80' },
  { value: 'critical' as const, label: 'Critical', color: '#C62828', bg: '#FEE2E2', border: '#EF9A9A' },
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

function getIncidentIcon(type: string): React.ElementType | null {
  const all = [...driverIncidentTypes, ...customerIncidentTypes];
  const found = all.find((t) => t.type === type);
  return found ? found.icon : null;
}

function getIncidentColor(type: string): string {
  const all = [...driverIncidentTypes, ...customerIncidentTypes];
  const found = all.find((t) => t.type === type);
  return found ? found.color : '#757575';
}

// ============ REPORT DIALOG ============
function ReportDialog({
  open,
  onOpenChange,
  preselectedType,
  incidentTypes,
  roleLabel,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  preselectedType: string;
  incidentTypes: IncidentTypeOption[];
  roleLabel: string;
  onSubmit: (data: { type: string; deliveryId: string; description: string; priority: 'low' | 'medium' | 'high' | 'critical' }) => void;
}) {
  const [selectedType, setSelectedType] = useState(preselectedType);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [deliveryId, setDeliveryId] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const handleOpen = (v: boolean) => {
    if (!v) {
      setSelectedType(preselectedType);
      setDescription('');
      setPriority('medium');
      setDeliveryId('');
      setPhotoUploaded(false);
    }
    onOpenChange(v);
  };

  const typeInfo = incidentTypes.find((t) => t.type === selectedType);

  function handleSubmit() {
    if (!selectedType) {
      toast.error('Please select an incident type.');
      return;
    }
    if (!description.trim()) {
      toast.error('Please provide a description of the incident.');
      return;
    }
    onSubmit({ type: selectedType, deliveryId, description: description.trim(), priority });
    handleOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: '#212121' }}>
            <ShieldCheck className="h-5 w-5" style={{ color: '#2E7D32' }} />
            {roleLabel === 'driver' ? 'Report Safety Incident' : 'Report a Safety Concern'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Incident Type - pre-selected, read-only when clicked from card */}
          {typeInfo ? (
            <div className="rounded-lg p-3 flex items-center gap-3" style={{ backgroundColor: '#E8F5E9', border: '1px solid #A5D6A7' }}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: typeInfo.color + '18' }}>
                <typeInfo.icon className="h-4.5 w-4.5" style={{ color: typeInfo.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#212121' }}>{typeInfo.label}</p>
                <p className="text-xs" style={{ color: '#757575' }}>{typeInfo.description}</p>
              </div>
            </div>
          ) : (
            <div>
              <Label className="text-xs font-medium" style={{ color: '#757575' }}>Incident Type *</Label>
              <Select onValueChange={setSelectedType} value={selectedType}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((t) => (
                    <SelectItem key={t.type} value={t.type}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Delivery ID - searchable dropdown */}
          <div>
            <Label className="text-xs font-medium" style={{ color: '#757575' }}>Delivery ID (Optional)</Label>
            <Select onValueChange={setDeliveryId} value={deliveryId}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Search or select a delivery..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="del-001">SF-2025-001 — Maseru → Leribe</SelectItem>
                <SelectItem value="del-005">SF-2025-005 — JHB → Maseru</SelectItem>
                <SelectItem value="del-008">SF-2025-008 — Cape Town → Maseru</SelectItem>
                <SelectItem value="del-012">SF-2025-012 — Maseru → Quthing</SelectItem>
                <SelectItem value="del-020">SF-2025-020 — Maseru → Mafeteng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs font-medium" style={{ color: '#757575' }}>Description *</Label>
            <Textarea
              className="mt-1.5 min-h-[100px] text-sm"
              placeholder="Describe the incident in detail, including what happened, where, and who was involved..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ borderColor: '#E0E0E0' }}
            />
          </div>

          {/* Priority - Radio Buttons with color coding */}
          <div>
            <Label className="text-xs font-medium mb-2 block" style={{ color: '#757575' }}>Priority Level</Label>
            <div className="grid grid-cols-4 gap-2">
              {priorityRadioConfig.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className="flex flex-col items-center gap-1.5 rounded-lg p-2.5 transition-all duration-150"
                  style={{
                    backgroundColor: priority === p.value ? p.bg : '#FAFAFA',
                    border: `2px solid ${priority === p.value ? p.border : '#E0E0E0'}`,
                    boxShadow: priority === p.value ? `0 0 0 1px ${p.border}` : 'none',
                  }}
                >
                  <span
                    className="h-3 w-3 rounded-full transition-colors"
                    style={{ backgroundColor: priority === p.value ? p.color : '#BDBDBD' }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: priority === p.value ? p.color : '#9E9E9E' }}
                  >
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload - Simulated */}
          <div>
            <Label className="text-xs font-medium mb-1.5 block" style={{ color: '#757575' }}>Photo Evidence (Optional)</Label>
            {!photoUploaded ? (
              <button
                type="button"
                onClick={() => setPhotoUploaded(true)}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-green-400 hover:bg-green-50/30"
                style={{ borderColor: '#E0E0E0' }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#E8F5E9' }}>
                  <Camera className="h-5 w-5" style={{ color: '#2E7D32' }} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium" style={{ color: '#2E7D32' }}>Tap to upload photo</p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#9E9E9E' }}>JPG, PNG up to 10MB</p>
                </div>
              </button>
            ) : (
              <div

                className="flex items-center gap-3 rounded-lg p-3"
                style={{ backgroundColor: '#E8F5E9', border: '1px solid #A5D6A7' }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: '#2E7D32' }} />
                <span className="text-sm font-medium flex-1" style={{ color: '#2E7D32' }}>photo_evidence.jpg</span>
                <button
                  type="button"
                  onClick={() => setPhotoUploaded(false)}
                  className="text-xs font-medium underline"
                  style={{ color: '#D32F2F' }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpen(false)} style={{ borderColor: '#E0E0E0', color: '#757575' }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            className="gap-2 font-medium"
            style={{ backgroundColor: '#2E7D32', color: 'white' }}
          >
            <Plus className="h-4 w-4" /> Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============ INCIDENT HISTORY LIST ============
function IncidentHistoryList({ incidents, showRole }: { incidents: IncidentReport[]; showRole?: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: '#E8F5E9' }}>
          <Info className="h-6 w-6" style={{ color: '#4CAF50' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: '#757575' }}>No incidents reported yet</p>
        <p className="text-xs" style={{ color: '#9E9E9E' }}>Report your first incident to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      
        {incidents.map((report) => {
          const sc = statusConfig[report.status];
          const pc = priorityConfig[report.priority];
          const IconComp = getIncidentIcon(report.incidentType);
          const iconColor = getIncidentColor(report.incidentType);
          const isExpanded = expandedId === report.id;

          return (
            <div
              key={report.id}
              layout

            >
              <div
                className="rounded-xl border overflow-hidden transition-shadow cursor-pointer"
                style={{
                  borderColor: isExpanded ? '#A5D6A7' : '#E0E0E0',
                  backgroundColor: report.priority === 'critical' ? '#FFFBFB' : 'white',
                }}
                onClick={() => setExpandedId(isExpanded ? null : report.id)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Type Icon */}
                    {IconComp ? (
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                        style={{ backgroundColor: iconColor + '14' }}
                      >
                        <IconComp className="h-5 w-5" style={{ color: iconColor }} />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full shrink-0" style={{ backgroundColor: '#E8F5E9' }}>
                        <AlertTriangle className="h-5 w-5" style={{ color: '#757575' }} />
                      </div>
                    )}

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: '#212121' }}>
                          {report.incidentType}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ backgroundColor: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pc.dot }} />
                          {pc.label}
                        </span>
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                        >
                          {sc.label}
                        </span>
                      </div>

                      <p className="mt-1 text-xs line-clamp-2" style={{ color: '#757575' }}>
                        {report.description}
                      </p>

                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        <span className="text-[11px]" style={{ color: '#9E9E9E' }}>
                          {report.reporterName}
                        </span>
                        {showRole && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: '#F5F5F5', color: '#9E9E9E' }}>
                            {report.reporterRole}
                          </span>
                        )}
                        <span className="text-[11px]" style={{ color: '#BDBDBD' }}>•</span>
                        <span className="text-[11px]" style={{ color: '#9E9E9E' }}>
                          {timeAgo(report.createdAt)}
                        </span>
                        {report.deliveryId && (
                          <>
                            <span className="text-[11px]" style={{ color: '#BDBDBD' }}>•</span>
                            <span className="text-[10px] font-mono" style={{ color: '#2E7D32' }}>{report.deliveryId}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expand icon */}
                    <div

                      className="shrink-0 mt-1"
                    >
                      <ChevronRight className="h-4 w-4" style={{ color: '#BDBDBD' }} />
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                
                  {isExpanded && (
                    <div

                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <Separator className="mb-3" style={{ backgroundColor: '#E0E0E0' }} />
                        <div className="space-y-3">
                          <div className="rounded-lg p-3" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
                            <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9E9E9E' }}>Full Description</p>
                            <p className="text-xs leading-relaxed" style={{ color: '#424242' }}>{report.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9E9E9E' }}>Created</p>
                              <p className="text-xs mt-0.5" style={{ color: '#424242' }}>{formatDateTime(report.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9E9E9E' }}>Last Updated</p>
                              <p className="text-xs mt-0.5" style={{ color: '#424242' }}>{formatDateTime(report.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                
              </div>
            </div>
          );
        })}
      
    </div>
  );
}

// ============ ADMIN FILTERED HISTORY ============
function AdminIncidentHistory() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

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
    return result;
  }, [search, statusFilter, priorityFilter, roleFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9E9E9E' }} />
          <Input
            placeholder="Search by type, name, or description..."
            className="pl-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderColor: '#E0E0E0' }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] text-xs">
              <Filter className="h-3 w-3 mr-1.5" style={{ color: '#9E9E9E' }} />
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
            <SelectTrigger className="w-[130px] text-xs">
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
            <SelectTrigger className="w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="driver">Drivers</SelectItem>
              <SelectItem value="customer">Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', count: filtered.length, bg: '#E8F5E9', color: '#2E7D32' },
          { label: 'Open', count: filtered.filter((r) => r.status === 'open').length, bg: '#F5F5F5', color: '#616161' },
          { label: 'Investigating', count: filtered.filter((r) => r.status === 'investigating').length, bg: '#E3F2FD', color: '#1565C0' },
          { label: 'Resolved', count: filtered.filter((r) => r.status === 'resolved').length, bg: '#E8F5E9', color: '#2E7D32' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg p-3 text-center" style={{ backgroundColor: stat.bg }}>
            <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.count}</p>
            <p className="text-[10px] font-medium" style={{ color: stat.color }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <IncidentHistoryList incidents={filtered} showRole />
    </div>
  );
}

// ============ MAIN SAFETY TAB ============
export function SafetyTab() {
  const { currentUser } = useAuthStore();
  const role = currentUser?.role;
  const isDriver = role === 'driver';
  const isCustomer = role === 'customer';
  const isAdmin = !isDriver && !isCustomer; // admin, manager, etc.

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [localReports, setLocalReports] = useState<IncidentReport[]>(mockIncidents);

  const availableTypes = useMemo(() => {
    if (isDriver) return driverIncidentTypes;
    if (isCustomer) return customerIncidentTypes;
    return [...driverIncidentTypes, ...customerIncidentTypes]; // admin sees all
  }, [isDriver, isCustomer]);

  function handleQuickReport(type: string) {
    setSelectedType(type);
    setDialogOpen(true);
  }

  function handleSubmit(data: { type: string; deliveryId: string; description: string; priority: 'low' | 'medium' | 'high' | 'critical' }) {
    const newReport: IncidentReport = {
      id: `inc-${Date.now()}`,
      deliveryId: data.deliveryId || undefined,
      reporterId: currentUser?.id || 'usr-001',
      reporterName: currentUser?.name || 'Current User',
      reporterRole: (isDriver ? 'driver' : isCustomer ? 'customer' : 'driver') as 'driver' | 'customer',
      incidentType: data.type,
      description: data.description,
      status: 'open',
      priority: data.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalReports((prev) => [newReport, ...prev]);
    toast.success('Incident report submitted successfully.');
  }

  const visibleTypes = isAdmin
    ? { driver: driverIncidentTypes, customer: customerIncidentTypes }
    : isDriver
    ? { driver: driverIncidentTypes, customer: [] as IncidentTypeOption[] }
    : { driver: [] as IncidentTypeOption[], customer: customerIncidentTypes };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#212121' }}>
          <ShieldCheck className="h-5 w-5" style={{ color: '#2E7D32' }} />
          Safety & Incident Reporting
        </h2>
        <p className="text-sm mt-0.5" style={{ color: '#757575' }}>
          {isDriver
            ? 'Report safety incidents during your deliveries'
            : isCustomer
            ? 'Report safety concerns about your deliveries'
            : 'Monitor and manage all incident reports across the organisation'}
        </p>
      </div>

      {/* KPI Cards - Admin only */}
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Open', value: localReports.filter((r) => r.status === 'open' || r.status === 'investigating').length, icon: Info, bg: '#FFF8E1', color: '#F57F17' },
            { label: 'Critical', value: localReports.filter((r) => r.priority === 'critical' && r.status !== 'resolved' && r.status !== 'dismissed').length, icon: ShieldAlert, bg: '#FEE2E2', color: '#C62828' },
            { label: 'Resolved', value: localReports.filter((r) => r.status === 'resolved').length, icon: CheckCircle2, bg: '#E8F5E9', color: '#2E7D32' },
            { label: 'This Week', value: localReports.length, icon: Clock, bg: '#E3F2FD', color: '#1565C0' },
          ].map((kpi) => {
            const KpiIcon = kpi.icon;
            return (
              <div
                key={kpi.label}

              >
                <div className="rounded-lg border border-border/50 bg-card rounded-xl">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium" style={{ color: '#757575' }}>{kpi.label}</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: kpi.bg }}>
                        <KpiIcon className="h-5 w-5" style={{ color: kpi.color }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Tabs: Report Incident / Incident History */}
      <Tabs defaultValue="report" className="w-full">
        <TabsList
          className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex h-auto p-1 rounded-lg"
          style={{ backgroundColor: '#F5F5F5' }}
        >
          <TabsTrigger
            value="report"
            className="text-xs font-semibold px-4 py-2 rounded-md data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            style={{ color: '#757575' }}
          >
            <span className="flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Report Incident
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="text-xs font-semibold px-4 py-2 rounded-md data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            style={{ color: '#757575' }}
          >
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Incident History
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Report Incident Tab */}
        <TabsContent value="report" className="mt-4 space-y-4">
          {/* Driver incident types */}
          {(isDriver || isAdmin) && visibleTypes.driver.length > 0 && (
            <div className="rounded-lg border border-border/50 bg-card">
              <div className="pb-2">
                <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#212121' }}>
                  <Wrench className="h-4 w-4" style={{ color: '#2E7D32' }} />
                  Driver Safety Incidents
                  {isAdmin && <Badge variant="secondary" className="text-[10px] font-medium">7 types</Badge>}
                </h2>
                <p className="text-xs" style={{ color: '#9E9E9E' }}>Quick report for incidents that occur during delivery operations</p>
              </div>
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                  {visibleTypes.driver.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}

                        onClick={() => handleQuickReport(item.type)}
                        className="flex flex-col items-center gap-2.5 rounded-xl border p-4 hover:shadow-md transition-all duration-200 group"
                        style={{
                          borderColor: '#E0E0E0',
                          backgroundColor: 'white',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#A5D6A7';
                          e.currentTarget.style.backgroundColor = '#F9FBF9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E0E0E0';
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200"
                          style={{ backgroundColor: item.color + '14' }}
                        >
                          <Icon className="h-5 w-5" style={{ color: item.color }} />
                        </div>
                        <span className="text-[11px] font-semibold text-center leading-tight" style={{ color: '#212121' }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Customer incident types */}
          {(isCustomer || isAdmin) && visibleTypes.customer.length > 0 && (
            <div className="rounded-lg border border-border/50 bg-card">
              <div className="pb-2">
                <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#212121' }}>
                  <PackageSearch className="h-4 w-4" style={{ color: '#2E7D32' }} />
                  Customer Safety Reports
                  {isAdmin && <Badge variant="secondary" className="text-[10px] font-medium">7 types</Badge>}
                </h2>
                <p className="text-xs" style={{ color: '#9E9E9E' }}>Report concerns about your delivery experience</p>
              </div>
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                  {visibleTypes.customer.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}

                        onClick={() => handleQuickReport(item.type)}
                        className="flex flex-col items-center gap-2.5 rounded-xl border p-4 hover:shadow-md transition-all duration-200 group"
                        style={{
                          borderColor: '#E0E0E0',
                          backgroundColor: 'white',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#A5D6A7';
                          e.currentTarget.style.backgroundColor = '#F9FBF9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E0E0E0';
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200"
                          style={{ backgroundColor: item.color + '14' }}
                        >
                          <Icon className="h-5 w-5" style={{ color: item.color }} />
                        </div>
                        <span className="text-[11px] font-semibold text-center leading-tight" style={{ color: '#212121' }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Incident History Tab */}
        <TabsContent value="history" className="mt-4">
          {isAdmin ? (
            <AdminIncidentHistory />
          ) : (
            <IncidentHistoryList
              incidents={localReports.filter((r) =>
                isDriver ? r.reporterRole === 'driver' : r.reporterRole === 'customer'
              )}
              showRole={false}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Report Dialog */}
      <ReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        preselectedType={selectedType}
        incidentTypes={availableTypes}
        roleLabel={isDriver ? 'driver' : isCustomer ? 'customer' : 'admin'}
        onSubmit={handleSubmit}
      />
    </div>
  );
}