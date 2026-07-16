'use client';

import { useState } from 'react';
import { useNavStore, useAuthStore } from '@/lib/store';
import type { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  Package,
  Users,
  LayoutDashboard,
  MapPin,
  BarChart3,
  Settings,
  Shield,
  CheckCircle2,
  Wrench,
  Warehouse,
  ClipboardList,
  FileSearch,
  Route,
  Star,
  ChevronLeft,
  Sparkles,
  CalendarDays,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ROLE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

interface RoleConfig {
  title: string;
  description: string;
  capabilities: { icon: React.ReactNode; title: string; description: string }[];
  questions: { id: string; label: string; placeholder: string; type?: string; options?: string[] }[];
  features: { icon: React.ReactNode; title: string; description: string; article?: string }[];
}

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  super_admin: {
    title: 'Super Administrator',
    description: 'You have full control over the SwiftFreight platform, managing tenant companies, system settings, and overall platform health.',
    capabilities: [
      { icon: <Shield className="h-5 w-5" />, title: 'Platform Governance', description: 'Manage all tenant companies and system-wide settings' },
      { icon: <Users className="h-5 w-5" />, title: 'User Management', description: 'Oversee users across all organizations' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'System Analytics', description: 'Monitor platform-wide performance and metrics' },
      { icon: <Settings className="h-5 w-5" />, title: 'Configuration', description: 'Configure platform features, pricing, and integrations' },
    ],
    questions: [
      { id: 'primary_focus', label: "What's your primary focus?", placeholder: 'e.g., Platform growth, Technical operations...', options: ['Platform Growth', 'Technical Operations', 'Customer Success', 'Financial Oversight'] },
      { id: 'tenant_count', label: 'How many tenant companies do you manage?', placeholder: 'e.g., 5-10 companies', options: ['1-5 companies', '5-20 companies', '20-50 companies', '50+ companies'] },
    ],
    features: [
      { icon: <LayoutDashboard className="h-5 w-5" />, title: 'Admin Dashboard', description: 'Comprehensive overview of platform metrics, tenant health, and system status.', article: 'Understanding the Dashboard' },
      { icon: <Users className="h-5 w-5" />, title: 'Tenant Management', description: 'Create, configure, and manage all tenant companies on the platform.', article: 'Setting Up Your Company' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Platform Analytics', description: 'Deep-dive into cross-company analytics, revenue tracking, and growth trends.', article: 'Understanding Delivery Analytics' },
      { icon: <Settings className="h-5 w-5" />, title: 'System Settings', description: 'Configure global settings, feature flags, and integration endpoints.', article: 'Two-Factor Authentication' },
      { icon: <Shield className="h-5 w-5" />, title: 'Access Control', description: 'Define role-based permissions and manage security policies.', article: 'Managing Users' },
    ],
  },
  company_owner: {
    title: 'Company Owner',
    description: 'As a company owner, you oversee your entire logistics operation — from fleet management to customer satisfaction.',
    capabilities: [
      { icon: <LayoutDashboard className="h-5 w-5" />, title: 'Business Overview', description: 'View real-time business metrics and financial performance' },
      { icon: <Users className="h-5 w-5" />, title: 'Team Management', description: 'Add and manage drivers, dispatchers, and operations staff' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Revenue Tracking', description: 'Monitor income, expenses, and profitability at a glance' },
      { icon: <Settings className="h-5 w-5" />, title: 'Company Settings', description: 'Configure pricing, service areas, and business preferences' },
    ],
    questions: [
      { id: 'vehicle_count', label: 'How many vehicles do you operate?', placeholder: 'e.g., 5-10 vehicles', options: ['1-5 vehicles', '5-15 vehicles', '15-50 vehicles', '50+ vehicles'] },
      { id: 'weekly_deliveries', label: 'How many deliveries per week?', placeholder: 'e.g., 50-100 deliveries', options: ['Under 20', '20-50', '50-100', '100-500', '500+'] },
    ],
    features: [
      { icon: <LayoutDashboard className="h-5 w-5" />, title: 'Business Dashboard', description: 'High-level view of your operations including revenue, deliveries, and team performance.', article: 'Understanding the Dashboard' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Reports & Analytics', description: 'Generate detailed reports on deliveries, revenue, driver performance, and more.', article: 'Understanding Delivery Analytics' },
      { icon: <Truck className="h-5 w-5" />, title: 'Fleet Overview', description: 'See all your vehicles, their status, and maintenance schedules in one place.', article: 'Adding Vehicles' },
      { icon: <FileSearch className="h-5 w-5" />, title: 'Invoice Management', description: 'View, manage, and export invoices. Track payments and outstanding balances.', article: 'Understanding Your Invoice' },
    ],
  },
  operations_manager: {
    title: 'Operations Manager',
    description: 'You keep the wheels turning — managing day-to-day logistics operations, ensuring timely deliveries, and optimizing workflows.',
    capabilities: [
      { icon: <ClipboardList className="h-5 w-5" />, title: 'Delivery Oversight', description: 'Monitor all active deliveries and resolve issues in real-time' },
      { icon: <Route className="h-5 w-5" />, title: 'Route Optimization', description: 'Optimize delivery routes across Lesotho and cross-border' },
      { icon: <Users className="h-5 w-5" />, title: 'Staff Coordination', description: 'Coordinate drivers and dispatchers for maximum efficiency' },
      { icon: <Star className="h-5 w-5" />, title: 'Quality Control', description: 'Track delivery ratings and ensure service standards' },
    ],
    questions: [
      { id: 'biggest_challenge', label: "What's your biggest operations challenge?", placeholder: 'e.g., Route planning, Driver shortage...', options: ['Route Planning', 'Driver Shortage', 'Delivery Delays', 'Customer Communication', 'Cross-Border Compliance'] },
      { id: 'tracking_method', label: 'How do you currently track deliveries?', placeholder: 'e.g., Phone calls, WhatsApp groups...', options: ['Phone Calls', 'WhatsApp Groups', 'Spreadsheets', 'Another Software', 'Paper Records'] },
    ],
    features: [
      { icon: <LayoutDashboard className="h-5 w-5" />, title: 'Operations Dashboard', description: 'Live view of all active deliveries, pending issues, and team status.', article: 'Understanding the Dashboard' },
      { icon: <ClipboardList className="h-5 w-5" />, title: 'Delivery Management', description: 'Create, track, and manage all deliveries from request to completion.', article: 'Creating a Delivery Request' },
      { icon: <MapPin className="h-5 w-5" />, title: 'Live Tracking', description: 'Real-time tracking of all vehicles and deliveries across Lesotho.', article: 'Tracking Your Parcel' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Performance Reports', description: 'On-time rates, delivery volumes, and operational efficiency metrics.', article: 'Understanding Delivery Analytics' },
      { icon: <Wrench className="h-5 w-5" />, title: 'Incident Management', description: 'Report and track delivery incidents, delays, and resolutions.', article: 'Reporting Incidents' },
    ],
  },
  dispatcher: {
    title: 'Dispatcher',
    description: 'You are the critical link between customers and drivers — assigning deliveries, managing driver availability, and keeping everything moving.',
    capabilities: [
      { icon: <Truck className="h-5 w-5" />, title: 'Driver Assignment', description: 'Assign deliveries to available drivers based on location and capacity' },
      { icon: <MapPin className="h-5 w-5" />, title: 'Real-Time Tracking', description: 'Track driver locations and delivery progress live' },
      { icon: <Package className="h-5 w-5" />, title: 'Order Management', description: 'Process new delivery requests and prioritize urgent orders' },
      { icon: <Users className="h-5 w-5" />, title: 'Driver Communication', description: 'Chat with drivers and provide route guidance' },
    ],
    questions: [
      { id: 'assignment_method', label: 'How do you currently assign drivers?', placeholder: 'e.g., Manually based on location...', options: ['Manually by Location', 'First Available', 'Rotating Schedule', 'Based on Vehicle Type'] },
      { id: 'daily_dispatches', label: "What's your average daily dispatches?", placeholder: 'e.g., 15-20 dispatches', options: ['Under 10', '10-25', '25-50', '50-100', '100+'] },
    ],
    features: [
      { icon: <LayoutDashboard className="h-5 w-5" />, title: 'Dispatch Board', description: 'Visual board showing pending, active, and completed dispatches.', article: 'Understanding the Dashboard' },
      { icon: <Truck className="h-5 w-5" />, title: 'Smart Assignment', description: 'Assign drivers based on proximity, vehicle type, and availability.', article: 'Accepting Assignments' },
      { icon: <MapPin className="h-5 w-5" />, title: 'Live Map', description: 'See all driver locations on a real-time map of Lesotho.', article: 'Tracking Your Parcel' },
      { icon: <Package className="h-5 w-5" />, title: 'Delivery Queue', description: 'Manage incoming requests and prioritize based on urgency.', article: 'Creating a Delivery Request' },
    ],
  },
  fleet_manager: {
    title: 'Fleet Manager',
    description: 'You ensure every vehicle is road-ready, properly maintained, and operating at peak efficiency.',
    capabilities: [
      { icon: <Truck className="h-5 w-5" />, title: 'Vehicle Registry', description: 'Manage all vehicles, their details, and documentation' },
      { icon: <Wrench className="h-5 w-5" />, title: 'Maintenance Scheduling', description: 'Schedule and track vehicle servicing and repairs' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Fleet Analytics', description: 'Track fuel costs, mileage, and vehicle utilization' },
      { icon: <Shield className="h-5 w-5" />, title: 'Compliance Tracking', description: 'Monitor insurance, licensing, and roadworthiness' },
    ],
    questions: [
      { id: 'fleet_size', label: 'How many vehicles in your fleet?', placeholder: 'e.g., 10 vehicles', options: ['1-5 vehicles', '5-15 vehicles', '15-50 vehicles', '50+ vehicles'] },
      { id: 'maintenance_tracking', label: 'Do you manage maintenance schedules?', placeholder: 'Select an option', options: ['Yes, with software', 'Yes, manually (paper/spreadsheet)', 'Not currently tracking', 'Planning to start'] },
    ],
    features: [
      { icon: <Truck className="h-5 w-5" />, title: 'Vehicle Management', description: 'Complete vehicle registry with details, documents, and status tracking.', article: 'Adding Vehicles' },
      { icon: <Wrench className="h-5 w-5" />, title: 'Maintenance Tracker', description: 'Schedule service appointments, track repair history, and set reminders.', article: 'Maintenance Scheduling' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Fleet Analytics', description: 'Utilization rates, cost-per-km, and fleet performance insights.', article: 'Understanding Delivery Analytics' },
      { icon: <Shield className="h-5 w-5" />, title: 'Document Compliance', description: 'Track insurance expiry, license renewals, and roadworthiness certificates.', article: 'Safety & Compliance' },
    ],
  },
  driver: {
    title: 'Driver',
    description: 'You are on the front line of delivery — picking up, transporting, and delivering parcels across Lesotho.',
    capabilities: [
      { icon: <Package className="h-5 w-5" />, title: 'Delivery Execution', description: 'Accept assignments, navigate routes, and complete deliveries' },
      { icon: <MapPin className="h-5 w-5" />, title: 'GPS Navigation', description: 'Built-in navigation to delivery destinations across Lesotho' },
      { icon: <CheckCircle2 className="h-5 w-5" />, title: 'Proof of Delivery', description: 'Capture photos and signatures as delivery confirmation' },
      { icon: <Users className="h-5 w-5" />, title: 'Customer Communication', description: 'Chat directly with customers about their deliveries' },
    ],
    questions: [
      { id: 'own_vehicle', label: 'Do you have your own vehicle?', placeholder: 'Select an option', options: ['Yes, my own vehicle', 'Company-provided vehicle', 'I rent/hire vehicles', 'Not applicable'] },
      { id: 'delivery_areas', label: 'What areas do you typically deliver to?', placeholder: 'e.g., Maseru, Leribe, Berea...', options: ['Maseru Only', 'Maseru & Surrounding Districts', 'All 10 Districts', 'Cross-Border (South Africa)'] },
    ],
    features: [
      { icon: <Package className="h-5 w-5" />, title: 'My Deliveries', description: 'View all assigned deliveries, their status, and pickup/dropoff details.', article: 'Accepting Assignments' },
      { icon: <MapPin className="h-5 w-5" />, title: 'In-App Navigation', description: 'Turn-by-turn navigation to every delivery destination in Lesotho.', article: 'Updating Delivery Status' },
      { icon: <CheckCircle2 className="h-5 w-5" />, title: 'Proof of Delivery', description: 'Take photos, collect signatures, and confirm successful deliveries.', article: 'Uploading Proof of Delivery' },
      { icon: <Star className="h-5 w-5" />, title: 'My Ratings', description: 'View customer ratings and build your reputation on the platform.', article: 'Getting Started' },
    ],
  },
  customer: {
    title: 'Customer',
    description: 'Send parcels across Lesotho and beyond with ease — track every delivery in real-time and manage your shipping needs.',
    capabilities: [
      { icon: <Package className="h-5 w-5" />, title: 'Send Parcels', description: 'Create delivery requests with pickup and dropoff details' },
      { icon: <MapPin className="h-5 w-5" />, title: 'Live Tracking', description: 'Track your parcels in real-time from pickup to delivery' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Delivery History', description: 'View past deliveries, receipts, and delivery confirmations' },
      { icon: <FileSearch className="h-5 w-5" />, title: 'Sourcing Requests', description: 'Request products to be sourced and delivered from South Africa' },
    ],
    questions: [
      { id: 'shipping_frequency', label: 'How often do you send parcels?', placeholder: 'Select an option', options: ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Occasionally'] },
      { id: 'goods_type', label: 'What types of goods do you typically ship?', placeholder: 'Select an option', options: ['Documents & Small Items', 'Clothing & Textiles', 'Electronics', 'Building Materials', 'Food & Perishables', 'Mixed / Various'] },
    ],
    features: [
      { icon: <Package className="h-5 w-5" />, title: 'Request a Delivery', description: 'Fill in pickup and delivery details, get a quote, and ship in minutes.', article: 'Creating a Delivery Request' },
      { icon: <MapPin className="h-5 w-5" />, title: 'Track My Parcel', description: 'Enter a tracking number or view all your active shipments.', article: 'Tracking Your Parcel' },
      { icon: <CheckCircle2 className="h-5 w-5" />, title: 'Delivery Status', description: 'Understand every status from "Collected" to "Delivered".', article: 'Understanding Delivery Statuses' },
      { icon: <FileSearch className="h-5 w-5" />, title: 'Sourcing Service', description: 'Have products sourced from South Africa and delivered to your door.', article: 'How Sourcing Works' },
      { icon: <FileSearch className="h-5 w-5" />, title: 'My Invoices', description: 'View, download, and pay for your delivery invoices.', article: 'Understanding Your Invoice' },
    ],
  },
  sourcing_agent: {
    title: 'Sourcing Agent',
    description: 'You help customers find and purchase products from South Africa, managing the sourcing pipeline from request to delivery.',
    capabilities: [
      { icon: <FileSearch className="h-5 w-5" />, title: 'Request Management', description: 'View and manage incoming sourcing requests from customers' },
      { icon: <Package className="h-5 w-5" />, title: 'Quote & Procure', description: 'Provide quotes, purchase products, and arrange delivery' },
      { icon: <Users className="h-5 w-5" />, title: 'Customer Communication', description: 'Chat with customers about product availability and pricing' },
      { icon: <ClipboardList className="h-5 w-5" />, title: 'Pipeline Tracking', description: 'Track all sourcing requests from quote to delivery' },
    ],
    questions: [
      { id: 'product_types', label: 'What products do you typically source?', placeholder: 'e.g., Electronics, Clothing...', options: ['Electronics', 'Clothing & Textiles', 'Building Materials', 'Automotive Parts', 'Food & Beverages', 'General Merchandise'] },
      { id: 'monthly_requests', label: 'How many sourcing requests do you handle monthly?', placeholder: 'e.g., 20-30 requests', options: ['Under 10', '10-25', '25-50', '50-100', '100+'] },
    ],
    features: [
      { icon: <FileSearch className="h-5 w-5" />, title: 'Sourcing Queue', description: 'View all pending, active, and completed sourcing requests.', article: 'How Sourcing Works' },
      { icon: <ClipboardList className="h-5 w-5" />, title: 'Request Pipeline', description: 'Manage requests through every stage from quote to delivery.', article: 'Managing Sourcing Requests' },
      { icon: <Package className="h-5 w-5" />, title: 'Delivery Integration', description: 'Seamlessly convert sourced products into delivery orders.', article: 'Creating a Delivery Request' },
      { icon: <Users className="h-5 w-5" />, title: 'Customer Chat', description: 'Communicate with customers about product details and timelines.', article: 'Getting Started' },
    ],
  },
  trailer_owner: {
    title: 'Trailer Owner',
    description: 'You own trailers that logistics companies can rent or partner with, providing extra capacity for heavy or bulk deliveries.',
    capabilities: [
      { icon: <Truck className="h-5 w-5" />, title: 'Trailer Registry', description: 'List and manage all your trailers with specifications and availability' },
      { icon: <CalendarDays className="h-5 w-5" />, title: 'Booking Management', description: 'Accept, schedule, and manage trailer booking requests' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Revenue Tracking', description: 'Track earnings, utilization rates, and booking history' },
      { icon: <Wrench className="h-5 w-5" />, title: 'Maintenance Logs', description: 'Keep track of trailer servicing and roadworthiness' },
    ],
    questions: [
      { id: 'trailer_count', label: 'How many trailers do you have?', placeholder: 'e.g., 3 trailers', options: ['1 trailer', '2-5 trailers', '5-10 trailers', '10+ trailers'] },
      { id: 'trailer_types', label: 'What types of trailers?', placeholder: 'Select all that apply', options: ['Flatbed', 'Enclosed/Box', 'Refrigerated', 'Tanker', 'Curtain-Sider', 'Lowbed'] },
    ],
    features: [
      { icon: <Truck className="h-5 w-5" />, title: 'My Trailers', description: 'Register and manage all your trailers with full specifications.', article: 'Adding Vehicles' },
      { icon: <CalendarDays className="h-5 w-5" />, title: 'Booking CalendarDays', description: 'View and manage trailer availability and upcoming bookings.', article: 'Getting Started' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Earnings Dashboard', description: 'Track revenue, utilization, and payment history.', article: 'Understanding Your Invoice' },
      { icon: <Wrench className="h-5 w-5" />, title: 'Maintenance Tracker', description: 'Log service history and set maintenance reminders.', article: 'Maintenance Scheduling' },
    ],
  },
  warehouse_partner: {
    title: 'Warehouse Partner',
    description: 'You provide warehousing and storage services — receiving, storing, and dispatching goods as part of the logistics network.',
    capabilities: [
      { icon: <Warehouse className="h-5 w-5" />, title: 'Inventory Management', description: 'Track goods received, stored, and dispatched from your warehouse' },
      { icon: <Package className="h-5 w-5" />, title: 'Goods Receiving', description: 'Receive and log incoming parcels and bulk shipments' },
      { icon: <ClipboardList className="h-5 w-5" />, title: 'Dispatch Coordination', description: 'Coordinate outgoing shipments with transport partners' },
      { icon: <BarChart3 className="h-5 w-5" />, title: 'Capacity Planning', description: 'Monitor warehouse utilization and plan capacity' },
    ],
    questions: [
      { id: 'warehouse_capacity', label: "What's your warehouse capacity?", placeholder: 'e.g., 500 sq meters', options: ['Under 200 sqm', '200-500 sqm', '500-1000 sqm', '1000-5000 sqm', '5000+ sqm'] },
      { id: 'cross_border', label: 'Do you handle cross-border goods?', placeholder: 'Select an option', options: ['Yes, Lesotho-South Africa', 'Yes, regional (multiple countries)', 'No, domestic only', 'Planning to start'] },
    ],
    features: [
      { icon: <Warehouse className="h-5 w-5" />, title: 'Warehouse Dashboard', description: 'Overview of inventory levels, inbound, and outbound shipments.', article: 'Understanding the Dashboard' },
      { icon: <Package className="h-5 w-5" />, title: 'Goods Management', description: 'Receive, store, and dispatch goods with full audit trail.', article: 'Getting Started' },
      { icon: <ClipboardList className="h-5 w-5" />, title: 'Dispatch Queue', description: 'Manage outgoing shipments and coordinate with drivers.', article: 'Creating a Delivery Request' },
      { icon: <Shield className="h-5 w-5" />, title: 'Compliance Center', description: 'Handle customs documentation and cross-border requirements.', article: 'Package Declaration Requirements' },
    ],
  },
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  company_owner: 'Company Owner',
  operations_manager: 'Operations Manager',
  dispatcher: 'Dispatcher',
  fleet_manager: 'Fleet Manager',
  driver: 'Driver',
  customer: 'Customer',
  sourcing_agent: 'Sourcing Agent',
  trailer_owner: 'Trailer Owner',
  warehouse_partner: 'Warehouse Partner',
};

const TOTAL_STEPS = 5;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function OnboardingPage() {
  const { setView } = useNavStore();
  const { currentUser } = useAuthStore();

  const role: UserRole = currentUser?.role ?? 'customer';
  const config = ROLE_CONFIGS[role];

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSkip = () => {
    setView('dashboard');
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGoToDashboard = () => {
    setView('dashboard');
  };

  const completedItems = [
    `Role set up as ${ROLE_LABELS[role]}`,
    'Account profile configured',
    'Quick questions answered',
    'Platform tour completed',
  ];

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
        <button
          onClick={handleSkip}
          className="text-sm font-medium px-3 py-1.5 rounded-md hover:opacity-70"
          style={{ color: '#757575' }}
        >
          Skip
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Progress & Welcome */}
        <div
          className="w-full lg:w-[400px] xl:w-[440px] p-6 sm:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r"
          style={{ borderColor: '#E0E0E0', background: '#F5F5F5' }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: '#E8F5E9' }}>
                <Truck className="h-5 w-5" style={{ color: '#2E7D32' }} />
              </div>
              <span className="text-lg font-bold" style={{ color: '#212121' }}>SwiftFreight</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#212121' }}>
              {step === 5 ? "You're all set!" : 'Welcome to SwiftFreight!'}
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#757575' }}>
              {step === 5
                ? `Your onboarding as a ${ROLE_LABELS[role]} is complete. Here's a summary of what you configured.`
                : "Let's get you set up and familiar with the platform. This will only take a few minutes."}
            </p>

            {/* Progress Steps */}
            <div className="space-y-3">
              {[
                { num: 1, label: 'Welcome' },
                { num: 2, label: 'Role Introduction' },
                { num: 3, label: 'Quick Questions' },
                { num: 4, label: 'Platform Tour' },
                { num: 5, label: 'Complete' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0"
                    style={{
                      background: step >= s.num ? '#2E7D32' : '#E0E0E0',
                      color: step >= s.num ? '#FFFFFF' : '#757575',
                    }}
                  >
                    {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color: step >= s.num ? '#212121' : '#757575',
                      fontWeight: step === s.num ? 600 : 400,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <span className="text-xs font-medium" style={{ color: '#757575' }}>
                Step {step} of {TOTAL_STEPS}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Step Content */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-6 w-6" style={{ color: '#2E7D32' }} />
                    <Badge
                      className="text-xs font-medium px-3 py-1"
                      style={{ background: '#E8F5E9', color: '#2E7D32' }}
                    >
                      Step 1
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#212121' }}>
                    Welcome, {currentUser?.name ?? 'there'}!
                  </h2>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: '#757575' }}>
                    SwiftFreight is Lesotho&apos;s leading logistics platform, connecting courier companies, drivers,
                    customers, and partners in one intelligent ecosystem. Whether you&apos;re shipping a parcel
                    across Maseru or managing a fleet of 50 vehicles, we&apos;ve got you covered.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      { icon: <Truck className="h-5 w-5" />, label: 'Real-Time Tracking', desc: 'Track every delivery live' },
                      { icon: <MapPin className="h-5 w-5" />, label: '10 Districts Covered', desc: 'Nationwide delivery network' },
                      { icon: <Shield className="h-5 w-5" />, label: 'Secure & Reliable', desc: 'Proof of delivery on every shipment' },
                      { icon: <Star className="h-5 w-5" />, label: 'Rated & Trusted', desc: 'Community-driven quality' },
                    ].map((item) => (
                      <Card key={item.label} className="border-0 shadow-sm" style={{ background: '#F5F5F5' }}>
                        <CardContent className="p-4 flex items-start gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0" style={{ background: '#E8F5E9' }}>
                            <span style={{ color: '#2E7D32' }}>{item.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#212121' }}>{item.label}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#757575' }}>{item.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-6 w-6" style={{ color: '#2E7D32' }} />
                    <Badge
                      className="text-xs font-medium px-3 py-1"
                      style={{ background: '#E8F5E9', color: '#2E7D32' }}
                    >
                      Step 2
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#212121' }}>
                    Your Role: {config.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#757575' }}>
                    {config.description}
                  </p>

                  <h3 className="text-sm font-semibold mb-4" style={{ color: '#212121' }}>
                    Key Capabilities
                  </h3>
                  <div className="space-y-3 mb-8">
                    {config.capabilities.map((cap) => (
                      <Card key={cap.title} className="border-0 shadow-sm" style={{ background: '#F5F5F5' }}>
                        <CardContent className="p-4 flex items-start gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0" style={{ background: '#E8F5E9' }}>
                            <span style={{ color: '#2E7D32' }}>{cap.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#212121' }}>{cap.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#757575' }}>{cap.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <ClipboardList className="h-6 w-6" style={{ color: '#2E7D32' }} />
                    <Badge
                      className="text-xs font-medium px-3 py-1"
                      style={{ background: '#E8F5E9', color: '#2E7D32' }}
                    >
                      Step 3
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#212121' }}>
                    Quick Questions
                  </h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#757575' }}>
                    Help us personalize your experience. These questions are optional but help us tailor the platform to your needs.
                  </p>

                  <div className="space-y-6">
                    {config.questions.map((q) => (
                      <div key={q.id}>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#212121' }}>
                          {q.label}
                        </label>
                        {q.options ? (
                          <div className="flex flex-wrap gap-2">
                            {q.options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleAnswer(q.id, opt)}
                                className="text-xs px-3 py-2 rounded-lg border font-medium transition-all"
                                style={{
                                  background: answers[q.id] === opt ? '#2E7D32' : '#FFFFFF',
                                  color: answers[q.id] === opt ? '#FFFFFF' : '#212121',
                                  borderColor: answers[q.id] === opt ? '#2E7D32' : '#E0E0E0',
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <Input
                            placeholder={q.placeholder}
                            value={answers[q.id] ?? ''}
                            onChange={(e) => handleAnswer(q.id, e.target.value)}
                            className="max-w-md"
                            style={{ borderColor: '#E0E0E0' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <LayoutDashboard className="h-6 w-6" style={{ color: '#2E7D32' }} />
                    <Badge
                      className="text-xs font-medium px-3 py-1"
                      style={{ background: '#E8F5E9', color: '#2E7D32' }}
                    >
                      Step 4
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#212121' }}>
                    Platform Tour
                  </h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#757575' }}>
                    Here are the key features available to you as a {config.title}. Click &quot;Learn More&quot; to explore our Knowledge Base.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {config.features.map((feat) => (
                      <Card key={feat.title} className="border-0 shadow-sm" style={{ background: '#F5F5F5' }}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0" style={{ background: '#E8F5E9' }}>
                              <span style={{ color: '#2E7D32' }}>{feat.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold" style={{ color: '#212121' }}>{feat.title}</p>
                              <p className="text-xs mt-1 leading-relaxed" style={{ color: '#757575' }}>
                                {feat.description}
                              </p>
                              {feat.article && (
                                <button
                                  onClick={() => setView('knowledge-base')}
                                  className="text-xs font-medium mt-2 inline-flex items-center gap-1 hover:underline"
                                  style={{ color: '#2E7D32' }}
                                >
                                  Learn More <ArrowRight className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <div className="flex items-center justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="flex items-center justify-center w-20 h-20 rounded-full"
                      style={{ background: '#E8F5E9' }}
                    >
                      <CheckCircle2 className="h-10 w-10" style={{ color: '#2E7D32' }} />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#212121' }}>
                    You&apos;re all set!
                  </h2>
                  <p className="text-sm text-center leading-relaxed mb-8" style={{ color: '#757575' }}>
                    Your onboarding is complete. Here&apos;s a summary of what you configured.
                  </p>

                  <Card className="border-0 shadow-sm mb-8" style={{ background: '#F5F5F5' }}>
                    <CardContent className="p-6">
                      <h3 className="text-sm font-semibold mb-4" style={{ color: '#212121' }}>
                        Setup Summary
                      </h3>
                      <div className="space-y-3">
                        {completedItems.map((item) => (
                          <div key={item} className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#2E7D32' }} />
                            <span className="text-sm" style={{ color: '#212121' }}>{item}</span>
                          </div>
                        ))}
                        {Object.entries(answers).length > 0 && (
                          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E0E0E0' }}>
                            <p className="text-xs font-medium mb-2" style={{ color: '#757575' }}>Your Responses:</p>
                            {Object.entries(answers).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2 mb-1">
                                <span className="text-xs" style={{ color: '#757575' }}>{key.replace(/_/g, ' ')}:</span>
                                <span className="text-xs font-medium" style={{ color: '#212121' }}>{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={handleGoToDashboard}
                      className="font-medium px-8 py-3"
                      style={{ background: '#2E7D32', color: '#FFFFFF' }}
                    >
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setView('knowledge-base')}
                      className="font-medium px-8 py-3"
                      style={{ borderColor: '#E0E0E0', color: '#212121' }}
                    >
                      Explore Knowledge Base
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < TOTAL_STEPS && (
            <div className="flex items-center justify-between mt-8 max-w-2xl mx-auto">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="font-medium"
                style={{ borderColor: '#E0E0E0', color: step === 1 ? '#E0E0E0' : '#212121' }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="font-medium px-6"
                style={{ background: '#2E7D32', color: '#FFFFFF' }}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}