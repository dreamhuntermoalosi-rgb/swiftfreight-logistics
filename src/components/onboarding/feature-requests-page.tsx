'use client';

import { useState } from 'react';
import { useNavStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Plus,
  ThumbsUp,
  MessageSquare,
  Lightbulb,
  Clock,
  CheckCircle2,
  Wrench,
  Sparkles,
} from 'lucide-react';
import type { UserRole } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & DATA
// ─────────────────────────────────────────────────────────────────────────────

type FeatureStatus = 'open' | 'planned' | 'in-progress' | 'launched';

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  votes: number;
  submittedDate: string;
  submitterRole: UserRole;
  category: string;
}

const STATUS_CONFIG: Record<FeatureStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  open: { label: 'Open', color: '#757575', bg: '#F5F5F5', icon: <Lightbulb className="h-3.5 w-3.5" /> },
  planned: { label: 'Planned', color: '#1565C0', bg: '#E3F2FD', icon: <Clock className="h-3.5 w-3.5" /> },
  'in-progress': { label: 'In Progress', color: '#E65100', bg: '#FFF3E0', icon: <Wrench className="h-3.5 w-3.5" /> },
  launched: { label: 'Launched', color: '#2E7D32', bg: '#E8F5E9', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
};

const CATEGORY_OPTIONS = [
  'Driver Experience',
  'Customer Features',
  'Operations & Dispatch',
  'Fleet Management',
  'Sourcing',
  'Billing & Payments',
  'Reporting & Analytics',
  'Mobile App',
  'Integrations',
  'Safety & Compliance',
  'Other',
];

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  company_owner: 'Company Owner',
  operations_manager: 'Ops Manager',
  dispatcher: 'Dispatcher',
  fleet_manager: 'Fleet Manager',
  driver: 'Driver',
  customer: 'Customer',
  sourcing_agent: 'Sourcing Agent',
  trailer_owner: 'Trailer Owner',
  warehouse_partner: 'Warehouse Partner',
};

const INITIAL_REQUESTS: FeatureRequest[] = [
  {
    id: 'fr-001',
    title: 'Dark mode for driver app',
    description: 'Add a dark mode option to the driver mobile app to reduce eye strain during night deliveries. Many drivers deliver in the early morning or evening hours and would benefit from a darker interface.',
    status: 'launched',
    votes: 47,
    submittedDate: '2024-09-15',
    submitterRole: 'driver',
    category: 'Mobile App',
  },
  {
    id: 'fr-002',
    title: 'Bulk delivery import from spreadsheet',
    description: 'Allow company owners and operations managers to import multiple delivery requests at once using a CSV or Excel spreadsheet. This is essential for businesses that process large batches of orders.',
    status: 'planned',
    votes: 34,
    submittedDate: '2024-10-02',
    submitterRole: 'operations_manager',
    category: 'Operations & Dispatch',
  },
  {
    id: 'fr-003',
    title: 'SMS notifications for customers without the app',
    description: 'Not all customers have smartphones or data to use the app. Send SMS notifications for key delivery milestones (collected, in transit, out for delivery, delivered) to keep all customers informed.',
    status: 'in-progress',
    votes: 52,
    submittedDate: '2024-08-20',
    submitterRole: 'customer',
    category: 'Customer Features',
  },
  {
    id: 'fr-004',
    title: 'Multi-language support (Sesotho)',
    description: 'Add Sesotho language support to make the platform accessible to all Basotho users. While English is widely spoken, many users in rural areas would benefit from a Sesotho interface.',
    status: 'open',
    votes: 38,
    submittedDate: '2024-11-10',
    submitterRole: 'customer',
    category: 'Other',
  },
  {
    id: 'fr-005',
    title: 'Route optimization AI',
    description: 'Implement AI-powered route optimization that considers road conditions, traffic patterns, border wait times, and weather to suggest the most efficient delivery routes across Lesotho and to South Africa.',
    status: 'planned',
    votes: 61,
    submittedDate: '2024-07-05',
    submitterRole: 'dispatcher',
    category: 'Operations & Dispatch',
  },
  {
    id: 'fr-006',
    title: 'Electronic proof of delivery with digital signature',
    description: 'Enable drivers to collect digital signatures from recipients directly on their phone screen. The signature should be captured alongside GPS coordinates, timestamp, and delivery photos.',
    status: 'launched',
    votes: 44,
    submittedDate: '2024-06-18',
    submitterRole: 'driver',
    category: 'Driver Experience',
  },
  {
    id: 'fr-007',
    title: 'Customer self-service portal',
    description: 'Provide a web portal where customers can create delivery requests, track parcels, view invoices, and manage their profiles without needing to contact support staff.',
    status: 'launched',
    votes: 56,
    submittedDate: '2024-05-22',
    submitterRole: 'company_owner',
    category: 'Customer Features',
  },
  {
    id: 'fr-008',
    title: 'Automated quotation engine',
    description: 'Build an automated quotation system that calculates delivery prices instantly based on distance, weight, dimensions, priority, and cross-border requirements. Reduce manual quoting time for dispatchers.',
    status: 'in-progress',
    votes: 41,
    submittedDate: '2024-10-28',
    submitterRole: 'dispatcher',
    category: 'Operations & Dispatch',
  },
  {
    id: 'fr-009',
    title: 'Warehouse inventory management',
    description: 'Add inventory tracking for warehouse partners to manage goods in storage, track inbound and outbound shipments, and provide real-time stock levels to logistics companies.',
    status: 'open',
    votes: 29,
    submittedDate: '2024-11-25',
    submitterRole: 'warehouse_partner',
    category: 'Fleet Management',
  },
  {
    id: 'fr-010',
    title: 'Monthly performance reports emailed automatically',
    description: 'Automatically generate and email monthly performance summary reports to company owners and managers, including delivery volumes, revenue, on-time rates, and top-performing drivers.',
    status: 'planned',
    votes: 33,
    submittedDate: '2024-12-01',
    submitterRole: 'company_owner',
    category: 'Reporting & Analytics',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function FeatureRequestsPage() {
  const { setView } = useNavStore();

  const [requests, setRequests] = useState<FeatureRequest[]>(INITIAL_REQUESTS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const filteredRequests = filterStatus === 'all'
    ? requests
    : requests.filter((r) => r.status === filterStatus);

  const handleVote = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r))
    );
  };

  const handleSubmit = () => {
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newRequest: FeatureRequest = {
      id: `fr-${String(requests.length + 1).padStart(3, '0')}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      status: 'open',
      votes: 0,
      submittedDate: new Date().toISOString().split('T')[0],
      submitterRole: 'customer',
      category: newCategory || 'Other',
    };

    setRequests((prev) => [newRequest, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setNewCategory('');
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b" style={{ borderColor: '#E0E0E0' }}>
        <button
          onClick={() => setView('marketing')}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70"
          style={{ color: '#2E7D32' }}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </button>
        <h1 className="text-lg font-bold hidden sm:block" style={{ color: '#212121' }}>
          Feature Requests
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="font-medium"
              style={{ background: '#2E7D32', color: '#FFFFFF' }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Submit Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg" style={{ borderColor: '#E0E0E0' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#212121' }}>Submit a Feature Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#212121' }}>
                  Title
                </label>
                <Input
                  placeholder="Brief summary of your feature idea"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ borderColor: '#E0E0E0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#212121' }}>
                  Category
                </label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger style={{ borderColor: '#E0E0E0' }}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#212121' }}>
                  Description
                </label>
                <Textarea
                  placeholder="Describe the feature in detail. What problem does it solve? How would it help?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  style={{ borderColor: '#E0E0E0' }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  style={{ borderColor: '#E0E0E0', color: '#212121' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!newTitle.trim() || !newDescription.trim()}
                  className="font-medium"
                  style={{ background: '#2E7D32', color: '#FFFFFF' }}
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: '#E8F5E9' }}>
                <Sparkles className="h-5 w-5" style={{ color: '#2E7D32' }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#212121' }}>
                  Feature Requests
                </h2>
                <p className="text-sm" style={{ color: '#757575' }}>
                  Help shape the future of SwiftFreight. Vote on ideas or submit your own.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { value: 'all', label: 'All' },
              { value: 'open', label: 'Open' },
              { value: 'planned', label: 'Planned' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'launched', label: 'Launched' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={{
                  background: filterStatus === filter.value ? '#2E7D32' : '#F5F5F5',
                  color: filterStatus === filter.value ? '#FFFFFF' : '#212121',
                }}
              >
                {filter.label}
                {filter.value !== 'all' && (
                  <span className="ml-1.5 opacity-70">
                    ({requests.filter((r) => r.status === filter.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Feature Request Cards */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((request, index) => {
                const statusConf = STATUS_CONFIG[request.status];
                return (
                  <motion.div
                    key={request.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <Card
                      className="border-0 shadow-sm hover:shadow-md transition-shadow"
                      style={{ background: '#F5F5F5' }}
                    >
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start gap-4">
                          {/* Vote Button */}
                          <button
                            onClick={() => handleVote(request.id)}
                            className="flex flex-col items-center gap-1 shrink-0 p-2 rounded-lg transition-colors hover:opacity-80"
                            style={{ background: '#E8F5E9' }}
                          >
                            <ThumbsUp className="h-4 w-4" style={{ color: '#2E7D32' }} />
                            <span className="text-xs font-bold" style={{ color: '#2E7D32' }}>
                              {request.votes}
                            </span>
                          </button>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-sm font-semibold" style={{ color: '#212121' }}>
                                {request.title}
                              </h3>
                              <Badge
                                className="shrink-0 text-xs px-2 py-0.5 flex items-center gap-1"
                                style={{ background: statusConf.bg, color: statusConf.color }}
                              >
                                {statusConf.icon}
                                {statusConf.label}
                              </Badge>
                            </div>

                            <p className="text-xs leading-relaxed mb-3" style={{ color: '#757575' }}>
                              {request.description}
                            </p>

                            <div className="flex items-center flex-wrap gap-2">
                              <Badge
                                className="text-xs px-2 py-0.5"
                                style={{ background: '#FFFFFF', color: '#757575', border: '1px solid #E0E0E0' }}
                              >
                                {request.category}
                              </Badge>
                              <Badge
                                className="text-xs px-2 py-0.5"
                                style={{ background: '#FFFFFF', color: '#757575', border: '1px solid #E0E0E0' }}
                              >
                                {ROLE_LABELS[request.submitterRole]}
                              </Badge>
                              <span className="text-xs" style={{ color: '#9E9E9E' }}>
                                {request.submittedDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-16">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: '#E0E0E0' }} />
              <p className="text-sm font-medium" style={{ color: '#757575' }}>
                No feature requests match this filter.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}