'use client';

import { useState, useMemo } from 'react';
import { useNavStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Clock,
  PlayCircle,
  GraduationCap,
  Truck,
  BarChart3,
  Package,
  Shield,
  FileText,
  CheckCircle2,
  BookOpen,
  Wrench,
  X,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & DATA
// ─────────────────────────────────────────────────────────────────────────────

type TrainingStatus = 'available' | 'coming-soon';
type TrainingRole = 'All Roles' | 'Drivers' | 'Dispatchers' | 'Managers' | 'Customers' | 'Sourcing Agents' | 'Fleet Managers';

interface TrainingSession {
  id: string;
  title: string;
  duration: string;
  targetRole: TrainingRole;
  status: TrainingStatus;
  icon: React.ReactNode;
  content: string[];
}

const ROLE_FILTERS: TrainingRole[] = [
  'All Roles',
  'Drivers',
  'Dispatchers',
  'Managers',
  'Customers',
  'Sourcing Agents',
  'Fleet Managers',
];

const TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: 'tr-001',
    title: 'Getting Started with SwiftFreight',
    duration: '15 min',
    targetRole: 'All Roles',
    status: 'available',
    icon: <GraduationCap className="h-5 w-5" />,
    content: [
      'Welcome to SwiftFreight! This training session will walk you through the basics of the platform, helping you understand the core concepts and navigation. SwiftFreight is a comprehensive logistics operating system designed specifically for the Lesotho market, connecting courier companies, drivers, customers, and partners.',
      'The platform is organized around your role — so whether you are a customer sending parcels, a driver making deliveries, or a company owner managing operations, you will see a tailored experience with the features most relevant to you. The main navigation is on the left sidebar (desktop) or the bottom bar (mobile).',
      'In this training, you learned about the platform overview, how to navigate between sections, and where to find key features. Next steps: explore the Knowledge Base for detailed articles, or continue with role-specific training sessions below to dive deeper into the features available to you.',
    ],
  },
  {
    id: 'tr-002',
    title: 'Dispatch Mastery: Assign Like a Pro',
    duration: '30 min',
    targetRole: 'Dispatchers',
    status: 'available',
    icon: <Truck className="h-5 w-5" />,
    content: [
      'As a dispatcher, you are the critical link between customers and drivers. This training covers the dispatch workflow from start to finish. You will learn how to review incoming delivery requests, assess driver availability and proximity, and make optimal assignment decisions.',
      'The dispatch board shows all pending, active, and recently completed dispatches in a visual layout. Use the map view to see driver locations in real-time. When assigning a driver, consider their current location, vehicle capacity, and delivery route. The system suggests the best match, but you can override it based on your knowledge of road conditions, driver experience, and customer preferences.',
      'Key tips: Always check driver availability status before assigning. For cross-border deliveries, ensure the driver has valid documentation and the vehicle has cross-border permits. Use the priority system — urgent deliveries should be assigned to the closest available driver. Communicate special instructions through the in-app messaging system before the driver departs.',
    ],
  },
  {
    id: 'tr-003',
    title: 'Driver App: Complete Walkthrough',
    duration: '20 min',
    targetRole: 'Drivers',
    status: 'available',
    icon: <Truck className="h-5 w-5" />,
    content: [
      'The SwiftFreight driver app is your companion on every delivery. This training walks you through every feature you will use daily. Starting from the home screen, you will see your active assignments at the top, followed by your daily summary including deliveries completed and earnings.',
      'When you receive a new assignment, review the details carefully — pickup address, delivery address, package description, and estimated time. Tap "Accept" to confirm. The app provides turn-by-turn navigation to the pickup location, then to the delivery destination. At each stage, update the delivery status with a single tap: "Arrived at Pickup," "Picked Up," "In Transit," and so on.',
      'The most important part of completing a delivery is uploading Proof of Delivery. The app will prompt you to take a photo and collect a digital signature. Ensure the photo clearly shows the package at the delivery location. If the recipient is unavailable, take a photo at the drop-off point and add a note explaining the situation. Good POD practices protect you in case of disputes.',
    ],
  },
  {
    id: 'tr-004',
    title: 'Fleet Management Best Practices',
    duration: '25 min',
    targetRole: 'Fleet Managers',
    status: 'available',
    icon: <Wrench className="h-5 w-5" />,
    content: [
      'Effective fleet management is the backbone of any successful logistics operation. This training covers the key aspects of managing your fleet on SwiftFreight, from vehicle registration to maintenance scheduling and utilization analytics.',
      'Start by registering all vehicles with complete details — plate number, make, model, year, fuel type, and cargo capacity. Upload registration and insurance documents, and set expiry date reminders. Assign vehicles to drivers based on route requirements and driver qualifications. The fleet dashboard shows utilization rates, helping you identify underused vehicles.',
      'Preventive maintenance is critical in Lesotho where road conditions can be challenging. Set up maintenance schedules based on mileage intervals (e.g., every 10,000 km for oil changes). Track all service history to identify patterns — vehicles that frequently need repairs may need replacement. Use the cost-per-kilometer metric to compare vehicle efficiency and make data-driven fleet decisions.',
    ],
  },
  {
    id: 'tr-005',
    title: 'Customer Portal Training',
    duration: '10 min',
    targetRole: 'Customers',
    status: 'available',
    icon: <Package className="h-5 w-5" />,
    content: [
      'The SwiftFreight customer portal makes shipping parcels across Lesotho simple and transparent. This quick training covers everything you need to know, from creating your first delivery request to tracking your parcels and managing invoices.',
      'To send a parcel, click "New Delivery" and fill in the pickup and delivery details. Be as specific as possible with addresses — include landmarks, building names, and phone numbers. Describe your package accurately (type, weight, dimensions) to get an accurate quote. Select your priority level: Standard for routine shipments, Express for time-sensitive parcels, or Urgent for same-day delivery where available.',
      'After accepting a quote, your delivery enters the dispatch queue. You will receive notifications at every stage. Use the tracking page to see real-time progress on a map. For cross-border shipments, the "At Border" status keeps you informed about customs processing. Once delivered, you can view proof of delivery and rate the service. Your feedback helps improve the platform for everyone.',
    ],
  },
  {
    id: 'tr-006',
    title: 'Sourcing Agent Workflow',
    duration: '20 min',
    targetRole: 'Sourcing Agents',
    status: 'available',
    icon: <FileText className="h-5 w-5" />,
    content: [
      'As a sourcing agent on SwiftFreight, you help customers in Lesotho access products from South Africa. This training covers the complete sourcing workflow, from receiving requests to delivering purchased goods to customers.',
      'When a customer submits a sourcing request, it appears in your queue with product details, budget, and any links or images provided. Review the request and research the product. Contact the customer through in-app messaging if you need clarification. Once you have found the product and determined the best price, submit a detailed quotation including product cost, agent fees, transport costs, and any applicable customs duties.',
      'After the customer accepts your quote, purchase the product and arrange transport. Update the request status as it progresses: "Purchasing," "Purchased," "In Transit," and finally "Delivered." Keep the customer informed at every stage. Good communication is key to building trust and earning positive ratings. Your agent rating affects the volume of requests you receive, so always provide excellent service.',
    ],
  },
  {
    id: 'tr-007',
    title: 'Understanding Delivery Analytics',
    duration: '30 min',
    targetRole: 'Managers',
    status: 'coming-soon',
    icon: <BarChart3 className="h-5 w-5" />,
    content: [
      'Delivery analytics provide deep insights into your logistics operation. This training will show you how to read and interpret the various charts, graphs, and KPIs available in the analytics dashboard. Understanding these metrics is essential for making data-driven decisions that improve efficiency and profitability.',
      'Key metrics to monitor include: on-time delivery rate (target above 90%), delivery volume trends (compare week-over-week and month-over-month), revenue per delivery, and customer satisfaction scores. The route analysis shows which corridors are most profitable and which have the highest failure rates. Driver performance metrics help you identify top performers and those who may need additional training.',
      'Use the date range selector to analyze specific periods. The export feature allows you to download detailed reports in CSV format for further analysis in spreadsheets. Set up automated monthly reports to be emailed to key stakeholders. Upcoming features include predictive analytics that forecast demand and suggest optimal resource allocation.',
    ],
  },
  {
    id: 'tr-008',
    title: 'Safety & Incident Reporting',
    duration: '15 min',
    targetRole: 'All Roles',
    status: 'available',
    icon: <Shield className="h-5 w-5" />,
    content: [
      'Safety is everyone\'s responsibility in the logistics industry. This training covers safety best practices for all SwiftFreight users and the proper procedure for reporting incidents. Whether you are a driver on the road, a dispatcher monitoring operations, or a customer sending a package, understanding safety protocols is essential.',
      'For drivers: Always perform a pre-trip vehicle inspection. Check tire pressure, lights, brakes, and fluid levels. Wear your seatbelt at all times. Observe speed limits and road conditions — Lesotho mountain roads can be treacherous, especially in winter. If you are involved in an accident, prioritize safety first, move to a safe location if possible, and report the incident through the app immediately.',
      'For all users: Know the emergency contact numbers. Report any safety concerns through the incident reporting system. Incidents include accidents, vehicle breakdowns, theft, damage to goods, and near-misses. Accurate and timely reporting helps the entire SwiftFreight community stay safe. All reports are confidential and are used to improve safety protocols and training programs.',
    ],
  },
  {
    id: 'tr-009',
    title: 'Package Declaration & Compliance',
    duration: '20 min',
    targetRole: 'All Roles',
    status: 'available',
    icon: <FileText className="h-5 w-5" />,
    content: [
      'Proper package declaration is both a legal requirement and essential for smooth logistics operations. This training covers how to correctly declare packages, understand restricted items, and navigate cross-border compliance requirements for Lesotho-South Africa shipments.',
      'When creating a delivery request, always provide accurate package details: contents, weight, dimensions, and declared value. For cross-border shipments, you need a commercial invoice, packing list, and may need import permits for certain goods. SwiftFreight generates most documents automatically, but you are responsible for accuracy. Under-declaring values or misrepresenting contents can result in fines, delays, or seizure.',
      'Familiarize yourself with the list of prohibited and restricted items. Common prohibited items include illegal substances, weapons, and counterfeit goods. Restricted items (pharmaceuticals, chemicals, electronics with lithium batteries) require special permits or packaging. When in doubt, contact our compliance team before shipping. Proper compliance protects you, the driver, and the entire supply chain.',
    ],
  },
  {
    id: 'tr-010',
    title: 'Advanced Reporting & Exports',
    duration: '25 min',
    targetRole: 'Managers',
    status: 'coming-soon',
    icon: <BarChart3 className="h-5 w-5" />,
    content: [
      'Advanced reporting goes beyond the standard dashboard metrics. This training covers how to create custom reports, set up automated reporting schedules, and export data for external analysis. These tools are essential for company owners and operations managers who need detailed operational insights.',
      'The custom report builder allows you to select specific metrics, date ranges, and filters. For example, you can create a report showing delivery performance by district, revenue by route, or driver performance rankings. Reports can be saved as templates for reuse. The scheduling feature allows you to set up weekly or monthly reports that are automatically generated and emailed to specified recipients.',
      'Data export supports CSV and PDF formats. CSV exports are ideal for further analysis in spreadsheet software like Excel or Google Sheets. PDF exports are formatted for presentations and management reviews. Upcoming features include API access for programmatic report generation, integration with business intelligence tools, and interactive dashboards that can be shared with stakeholders via secure links.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function TrainingPage() {
  const { setView } = useNavStore();

  const [roleFilter, setRoleFilter] = useState<TrainingRole>('All Roles');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTraining, setActiveTraining] = useState<TrainingSession | null>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [completedTrainings, setCompletedTrainings] = useState<Set<string>>(new Set());

  const filteredSessions = useMemo(() => {
    if (roleFilter === 'All Roles') return TRAINING_SESSIONS;
    return TRAINING_SESSIONS.filter(
      (s) => s.targetRole === 'All Roles' || s.targetRole === roleFilter
    );
  }, [roleFilter]);

  const handleStartTraining = (session: TrainingSession) => {
    setActiveTraining(session);
    setTrainingProgress(0);
    setDialogOpen(true);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!activeTraining) return;
    const el = e.currentTarget;
    const scrollPercentage = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setTrainingProgress(Math.min(Math.round(scrollPercentage * 100), 100));
  };

  const handleCompleteTraining = () => {
    if (activeTraining) {
      setCompletedTrainings((prev) => new Set([...prev, activeTraining.id]));
      setDialogOpen(false);
      setActiveTraining(null);
      setTrainingProgress(0);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setActiveTraining(null);
    setTrainingProgress(0);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b" style={{ borderColor: '#E0E0E0' }}>
        <button
          onClick={() => setView('marketing')}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70"
          style={{ color: '#fd7714' }}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </button>
        <h1 className="text-lg font-bold hidden sm:block" style={{ color: '#212121' }}>
          Training Center
        </h1>
        <div className="w-20" /> {/* Spacer for centering */}
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: '#fff3e8' }}>
                <BookOpen className="h-5 w-5" style={{ color: '#fd7714' }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#212121' }}>
                  Training Center
                </h2>
                <p className="text-sm" style={{ color: '#757575' }}>
                  Learn at your own pace. Complete training sessions to master SwiftFreight.
                </p>
              </div>
            </div>

            {completedTrainings.size > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" style={{ color: '#fd7714' }} />
                <span className="text-xs font-medium" style={{ color: '#fd7714' }}>
                  {completedTrainings.size} training{completedTrainings.size !== 1 ? 's' : ''} completed
                </span>
              </div>
            )}
          </motion.div>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {ROLE_FILTERS.map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={{
                  background: roleFilter === role ? '#fd7714' : '#F5F5F5',
                  color: roleFilter === role ? '#FFFFFF' : '#212121',
                }}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Training Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredSessions.map((session, index) => {
                const isCompleted = completedTrainings.has(session.id);
                return (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                  >
                    <Card
                      className="border-0 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow"
                      style={{ background: '#F5F5F5' }}
                    >
                      <CardContent className="p-5 flex flex-col flex-1">
                        {/* Icon & Status */}
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="flex items-center justify-center w-12 h-12 rounded-xl"
                            style={{ background: '#fff3e8' }}
                          >
                            <span style={{ color: '#fd7714' }}>{session.icon}</span>
                          </div>
                          {isCompleted && (
                            <Badge
                              className="text-xs px-2 py-0.5 flex items-center gap-1"
                              style={{ background: '#fff3e8', color: '#fd7714' }}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </Badge>
                          )}
                        </div>

                        {/* Title & Meta */}
                        <h3 className="text-sm font-semibold mb-2" style={{ color: '#212121' }}>
                          {session.title}
                        </h3>

                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#757575' }}>
                            <Clock className="h-3.5 w-3.5" />
                            {session.duration}
                          </span>
                          <Badge
                            className="text-xs px-2 py-0.5"
                            style={{ background: '#FFFFFF', color: '#757575', border: '1px solid #E0E0E0' }}
                          >
                            {session.targetRole}
                          </Badge>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Action Button */}
                        {session.status === 'available' ? (
                          <Button
                            onClick={() => handleStartTraining(session)}
                            className="w-full font-medium text-xs"
                            style={{
                              background: isCompleted ? '#F5F5F5' : '#fd7714',
                              color: isCompleted ? '#fd7714' : '#FFFFFF',
                              border: isCompleted ? '1px solid #fd7714' : 'none',
                            }}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Review Training
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-3.5 w-3.5 mr-1" />
                                Start Training
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            disabled
                            className="w-full font-medium text-xs"
                            style={{ background: '#F5F5F5', color: '#9E9E9E' }}
                          >
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Coming Soon
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-16">
              <GraduationCap className="h-12 w-12 mx-auto mb-4" style={{ color: '#E0E0E0' }} />
              <p className="text-sm font-medium" style={{ color: '#757575' }}>
                No training sessions available for this role filter.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Training Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0" style={{ borderColor: '#E0E0E0' }}>
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between mb-3">
              <DialogTitle className="text-lg" style={{ color: '#212121' }}>
                {activeTraining?.title}
              </DialogTitle>
              <button
                onClick={handleCloseDialog}
                className="p-1 rounded-md hover:opacity-70"
                style={{ color: '#757575' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress value={trainingProgress} className="h-2" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#757575' }}>
                    <Clock className="h-3 w-3" />
                    {activeTraining?.duration}
                  </span>
                  <Badge
                    className="text-xs px-2 py-0.5"
                    style={{ background: '#fff3e8', color: '#fd7714' }}
                  >
                    {activeTraining?.targetRole}
                  </Badge>
                </div>
                <span className="text-xs" style={{ color: '#757575' }}>
                  {trainingProgress}% read
                </span>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto px-6 py-4"
            onScroll={handleScroll}
          >
            <div className="space-y-4">
              {activeTraining?.content.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: '#424242' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t flex items-center justify-between" style={{ borderColor: '#E0E0E0' }}>
            <p className="text-xs" style={{ color: '#757575' }}>
              Scroll through the content above to complete this training.
            </p>
            <Button
              onClick={handleCompleteTraining}
              className="font-medium"
              style={{ background: '#fd7714', color: '#FFFFFF' }}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Training
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}