'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useNavStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import {
  Truck,
  Menu,
  ArrowRight,
  Play,
  Building2,
  MapPin,
  Car,
  Package,
  Users,
  Warehouse,
  BarChart3,
  FileText,
  CheckCircle2,
  Phone,
  Mail,
  MapPinned,
  Send,
  Check,
  Star,
  ArrowUp,
  Clock,
  MessageCircle,
  Eye,
  TrendingUp,
  GraduationCap,
  BookOpen,
  Award,
  Headphones,
  LayoutDashboard,
  Bell,
  Route,
  ClipboardCheck,
  Search,
  ShoppingCart,
  Shield,
  Smartphone,
  Layers,
  AlertTriangle,
  Timer,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// NAV LINKS
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// SMOOTH SCROLL HELPER
// ─────────────────────────────────────────────────────────────────────────────
function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADING COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeading({
  badge,
  title,
  description,
  align = 'center',
}: {
  badge?: string;
  title: string;
  description: string;
  align?: 'center' | 'left';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {badge && (
        <Badge
          variant="secondary"
          className="mb-4 rounded-full border border-[#16A34A]/10 bg-[#16A34A]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#14532D]"
        >
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-[#4B5563] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FADE-IN ON SCROLL WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// THIN SECTION DIVIDER
// ─────────────────────────────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-0" aria-hidden="true">
      <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARKETING WEBSITE
// ═══════════════════════════════════════════════════════════════════════════════
export function MarketingWebsite() {
  const { setView } = useNavStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<string | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    scrollTo(href);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ═══════════════════ 1. NAVIGATION BAR ═══════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14532D]">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#111827]">
              Swift<span className="text-[#16A34A]">Freight</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-[#4B5563] transition-colors hover:text-[#111827] focus:outline-none"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              className="h-9 text-sm font-medium text-[#4B5563] hover:text-[#111827]"
              onClick={() => setView('login')}
            >
              Sign In
            </Button>
            <Button
              className="h-9 bg-[#14532D] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#14532D]/90 transition-colors duration-200"
              onClick={() => setView('register')}
            >
              Book a Live Demo
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#111827]">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-12">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="flex flex-col gap-1 px-4">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-[#4B5563] transition-colors hover:bg-gray-50 hover:text-[#111827]"
                    >
                      {link.label}
                    </button>
                  ))}
                  <div className="my-4 h-px bg-[#E5E7EB]" />
                  <Button
                    variant="ghost"
                    className="justify-start px-3 text-sm font-medium text-[#4B5563]"
                    onClick={() => {
                      setMobileOpen(false);
                      setView('login');
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="mt-1 bg-[#14532D] text-white hover:bg-[#14532D]/90"
                    onClick={() => {
                      setMobileOpen(false);
                      setView('register');
                    }}
                  >
                    Book a Live Demo
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ═══════════════════ 2. HERO SECTION ═══════════════════ */}
        <section className="relative overflow-hidden bg-white pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
          {/* Subtle geometric background */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#14532D]/[0.03] blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/2 -translate-x-1/3 rounded-full bg-[#0F766E]/[0.03] blur-3xl" />
            {/* Grid pattern */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
                  <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#111827" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#111827] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                Move Goods Smarter.
                <br />
                <span className="text-[#14532D]">Grow Faster.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#4B5563] sm:text-lg md:text-xl">
                SwiftFreight helps courier companies, logistics providers, sourcing businesses, and fleet operators manage deliveries, dispatch, drivers, vehicles, and parcel tracking from one powerful cloud platform.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#6B7280] sm:text-base">
                Replace manual processes, endless WhatsApp messages, paper records, and disconnected spreadsheets with one intelligent logistics operating system built for Africa.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 w-full bg-[#14532D] px-8 text-base font-semibold text-white shadow-md shadow-[#14532D]/15 hover:bg-[#14532D]/90 hover:shadow-lg transition-all duration-200 sm:w-auto"
                  onClick={() => setView('register')}
                >
                  Book a Live Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-[#E5E7EB] px-8 text-base font-semibold text-[#111827] hover:border-[#14532D]/30 hover:text-[#14532D] transition-colors duration-200 sm:w-auto"
                  onClick={() => scrollTo('#solutions')}
                >
                  Explore Features
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[#6B7280]">
                {[
                  { icon: Layers, label: 'Multi-Tenant SaaS' },
                  { icon: MapPin, label: 'Built for Southern Africa' },
                  { icon: Smartphone, label: 'Mobile Friendly' },
                  { icon: Shield, label: 'Secure Cloud Platform' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-[#16A34A]" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ═══════════════════ 3. PROBLEM SECTION ═══════════════════ */}
        <FadeIn>
          <section className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                badge="The Problem"
                title="Still Running Your Logistics Business Manually?"
                description="These are the daily realities that slow down logistics companies across Lesotho and Southern Africa."
              />
              <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: MessageCircle, text: 'Managing deliveries through WhatsApp' },
                  { icon: Phone, text: 'Drivers constantly calling for updates' },
                  { icon: Eye, text: 'No real-time parcel tracking' },
                  { icon: FileText, text: 'Paper-based proof of delivery' },
                  { icon: Car, text: 'No fleet visibility' },
                  { icon: Users, text: 'No centralized customer records' },
                  { icon: BarChart3, text: 'Manual reporting' },
                  { icon: Timer, text: 'Late deliveries' },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 transition-all duration-200 hover:border-[#14532D]/20 hover:shadow-md hover:shadow-[#14532D]/5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium leading-snug text-[#111827] pt-1.5">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <p className="text-base font-semibold text-[#111827] sm:text-lg">
                  SwiftFreight replaces disconnected tools with one intelligent platform.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 4. SOLUTION / FEATURES SECTION ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section id="solutions" className="bg-gray-50 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                badge="Solutions"
                title="Everything Your Logistics Business Needs — In One Platform"
                description="Whether you operate five vehicles or hundreds, SwiftFreight gives your entire team one place to manage operations from request to delivery."
              />
              <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {[
                  {
                    icon: Car,
                    title: 'Fleet Management',
                    desc: 'Track vehicles, schedule maintenance, and monitor utilization across your entire fleet.',
                  },
                  {
                    icon: Package,
                    title: 'Courier Management',
                    desc: 'Manage parcels, routes, and delivery assignments from a single dashboard.',
                  },
                  {
                    icon: MapPin,
                    title: 'Parcel Tracking',
                    desc: 'Real-time status updates so customers and operators always know where shipments are.',
                  },
                  {
                    icon: Route,
                    title: 'Dispatch Centre',
                    desc: 'Assign drivers and vehicles intelligently. Reduce empty miles and idle time.',
                  },
                  {
                    icon: UserCheck,
                    title: 'Driver Management',
                    desc: 'Onboard drivers, track performance, manage documentation and compliance.',
                  },
                  {
                    icon: Users,
                    title: 'Customer Portal',
                    desc: 'Let customers submit requests, track parcels, and view delivery history.',
                  },
                  {
                    icon: ClipboardCheck,
                    title: 'Delivery Timeline',
                    desc: '9-step visibility from request received to proof of delivery and feedback.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Reports & Analytics',
                    desc: 'Revenue, performance, and growth insights to make data-driven decisions.',
                  },
                  {
                    icon: LayoutDashboard,
                    title: 'Role-Based Dashboards',
                    desc: '10 specialized views for every role — from dispatcher to warehouse partner.',
                  },
                  {
                    icon: Bell,
                    title: 'Notifications',
                    desc: 'Automated alerts for status changes, delays, and important delivery milestones.',
                  },
                ].map((feature) => (
                  <Card
                    key={feature.title}
                    className="group relative overflow-hidden border-[#E5E7EB] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#14532D]/20 hover:shadow-lg hover:shadow-[#14532D]/5"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14532D]/5 text-[#14532D] transition-colors duration-200 group-hover:bg-[#14532D] group-hover:text-white">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="mt-3 text-sm font-semibold text-[#111827]">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs leading-relaxed text-[#4B5563]">
                        {feature.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 5. WORKFLOW SECTION ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section id="workflow" className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                badge="How It Works"
                title="From Customer Request to Successful Delivery"
                description="A clear, accountable process that keeps everyone informed at every stage."
              />
              <div className="mt-14 sm:mt-16">
                <div className="relative mx-auto max-w-2xl">
                  {[
                    { step: '1', title: 'Customer submits request', desc: 'A delivery or sourcing request is submitted through the platform with all required details — pickup, destination, parcel info, and urgency level.' },
                    { step: '2', title: 'Operations reviews and assigns', desc: 'Your team reviews the request, generates a quotation, and assigns the best available driver and vehicle for the job.' },
                    { step: '3', title: 'Driver collects parcel', desc: 'The driver receives the assignment, navigates to the pickup location, and confirms collection with photo proof.' },
                    { step: '4', title: 'Real-time tracking', desc: 'Both the operations team and the customer can track the parcel status at every checkpoint along the route.' },
                    { step: '5', title: 'Proof of delivery', desc: 'On arrival, the driver captures a photo, collects a digital signature, and the delivery is marked complete.' },
                    { step: '6', title: 'Customer feedback', desc: 'The customer rates the delivery experience, providing accountability and continuous improvement data for your team.' },
                  ].map((item, index) => (
                    <div key={item.step} className="relative flex gap-6">
                      {/* Vertical line */}
                      {index < 5 && (
                        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-[#E5E7EB]" aria-hidden="true" />
                      )}
                      {/* Step circle */}
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14532D] text-sm font-bold text-white shadow-sm">
                        {item.step}
                      </div>
                      {/* Content */}
                      <div className={`pb-10 ${index === 5 ? 'pb-0' : ''}`}>
                        <h3 className="text-base font-semibold text-[#111827]">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 text-center">
                  <p className="text-base font-semibold text-[#14532D]">
                    Every delivery is visible, traceable, and accountable.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        <SectionDivider />

        {/* ═══════════════════ 6. CUSTOMER TYPES SECTION ═══════════════════ */}
        <FadeIn delay={0.1}>
          <section className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                badge="Who It's For"
                title="Built for Every Logistics Business"
                description="From independent drivers to government fleets, SwiftFreight adapts to how your business operates."
              />
              <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {[
                  { icon: Truck, title: 'Courier Companies', desc: 'End-to-end delivery management with multi-branch support and customer self-service.' },
                  { icon: Car, title: 'Fleet Operators', desc: 'Vehicle tracking, maintenance scheduling, and driver performance monitoring.' },
                  { icon: Building2, title: 'Distribution Companies', desc: 'Coordinate multi-drop routes, warehouse handoffs, and last-mile delivery.' },
                  { icon: ShoppingCart, title: 'Sourcing Businesses', desc: 'Manage cross-border product sourcing from South Africa with agent coordination.' },
                  { icon: UserCheck, title: 'Independent Drivers', desc: 'Accept assignments, update status, upload proof of delivery, and track earnings.' },
                  { icon: Warehouse, title: 'Warehouses', desc: 'Receive parcels, manage storage, and coordinate outbound dispatch seamlessly.' },
                  { icon: Shield, title: 'Government Fleets', desc: 'Secure, auditable logistics management with role-based access controls.' },
                  { icon: Users, title: 'NGOs', desc: 'Track humanitarian supply deliveries to remote areas with full accountability.' },
                  { icon: Package, title: 'Retail Distributors', desc: 'Manage stock distribution to retail outlets with delivery confirmation.' },
                  { icon: Building2, title: 'SMEs', desc: 'Affordable, scalable logistics management that grows with your business.' },
                ].map((type) => (
                  <div
                    key={type.title}
                    className="group rounded-xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:border-[#14532D]/20 hover:shadow-md hover:shadow-[#14532D]/5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#14532D]/5 text-[#14532D] transition-colors duration-200 group-hover:bg-[#14532D] group-hover:text-white">
                      <type.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-[#111827]">
                      {type.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#4B5563]">
                      {type.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 7. WHY SWIFTFREIGHT SECTION ═══════════════════ */}
        <FadeIn>
          <section className="bg-gray-50 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                badge="Why SwiftFreight"
                title="The Operational Advantage Your Business Needs"
                description="Not just another tool — a platform designed around how logistics actually works in Southern Africa."
              />
              <div className="mt-14 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Clock,
                    title: 'Save Hours Every Day',
                    desc: 'Automate repetitive logistics tasks. Dispatch assignments, status updates, quotations, and customer notifications happen without manual effort.',
                  },
                  {
                    icon: Users,
                    title: 'Improve Customer Experience',
                    desc: 'Keep customers informed from pickup to delivery. Real-time tracking, automated notifications, and a self-service portal build trust and reduce support calls.',
                  },
                  {
                    icon: Eye,
                    title: 'Complete Visibility',
                    desc: 'Know where every vehicle, driver, and parcel is at all times. No more guessing, no more phone calls. One live view for your entire operation.',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Built for Growth',
                    desc: 'Scale from one vehicle to hundreds without changing systems. SwiftFreight handles the complexity so you can focus on growing your business.',
                  },
                ].map((item) => (
                  <Card
                    key={item.title}
                    className="border-[#E5E7EB] bg-white transition-all duration-200 hover:shadow-lg hover:shadow-[#14532D]/5"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14532D]/5 text-[#14532D]">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="mt-4 text-base font-semibold text-[#111827]">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-[#4B5563]">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 8. TRAINING SECTION (NEW) ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                {/* Left — Content */}
                <div>
                  <SectionHeading
                    badge="Implementation & Training"
                    title="You're Never Left to Figure It Out Alone"
                    description=""
                    align="left"
                  />
                  <p className="mt-4 text-base leading-relaxed text-[#4B5563]">
                    Every SwiftFreight implementation includes professional onboarding and training.
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-[#4B5563]">
                    Our team helps configure your workspace, train your staff, and support your transition from manual operations to a fully digital logistics workflow.
                  </p>
                  <div className="mt-8">
                    <Button
                      className="bg-[#14532D] text-white shadow-sm hover:bg-[#14532D]/90 transition-colors duration-200"
                      onClick={() => setView('register')}
                    >
                      Book Implementation Call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Right — Service Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: ClipboardCheck,
                      title: 'Implementation Services',
                      desc: 'We set up your workspace, configure routes, import existing data, and ensure everything works before go-live.',
                    },
                    {
                      icon: BookOpen,
                      title: 'Staff Training',
                      desc: 'Hands-on training sessions for dispatchers, drivers, managers, and admin staff — tailored to each role.',
                    },
                    {
                      icon: Award,
                      title: 'System Certification',
                      desc: 'Formal training certification for your team so everyone is confident and competent from day one.',
                    },
                    {
                      icon: Headphones,
                      title: 'Ongoing Support',
                      desc: 'Dedicated support channels, regular check-ins, and system updates to keep your operation running smoothly.',
                    },
                  ].map((item) => (
                    <Card
                      key={item.title}
                      className="border-[#E5E7EB] bg-white transition-all duration-200 hover:border-[#14532D]/20 hover:shadow-md hover:shadow-[#14532D]/5"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F766E]/5 text-[#0F766E]">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="mt-3 text-sm font-semibold text-[#111827]">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs leading-relaxed text-[#4B5563]">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 9. TESTIMONIALS SECTION ═══════════════════ */}
        <FadeIn>
          <section className="bg-gray-50 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                badge="Testimonials"
                title="What Logistics Leaders Across Southern Africa Are Saying"
                description="Real feedback from operations teams who moved from manual processes to SwiftFreight."
              />
              <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-3">
                {[
                  {
                    quote: 'Before SwiftFreight, we tracked every delivery on WhatsApp and paper forms. Now our dispatchers handle three times the volume with fewer errors. The proof-of-digital-delivery alone saved us from countless customer disputes.',
                    name: 'Thabo Maseko',
                    role: 'Operations Director',
                    company: 'Mountain Express',
                    stars: 5,
                  },
                  {
                    quote: 'Our drivers used to call the office every hour asking for delivery details. With the driver app, they get everything on their phone — assignment details, route info, customer contacts. It cut our phone bill and improved delivery speed.',
                    name: 'Lineo Tšoeu',
                    role: 'Logistics Manager',
                    company: 'Lesotho Swift Logistics',
                    stars: 5,
                  },
                  {
                    quote: 'We went from managing 30 deliveries a week manually to over 200 on SwiftFreight. The reporting dashboard showed us exactly where we were losing time, and we fixed it within the first month.',
                    name: 'Kabelo Mothibi',
                    role: 'CEO',
                    company: 'Highland Haulage',
                    stars: 5,
                  },
                ].map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="relative rounded-xl border border-[#E5E7EB] bg-white p-6 transition-all duration-200 hover:shadow-lg"
                  >
                    {/* Quote mark */}
                    <span className="absolute -top-3 left-6 text-5xl font-serif leading-none text-[#14532D]/10 select-none">&ldquo;</span>

                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.stars
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm leading-relaxed text-[#4B5563] mb-6">
                      {testimonial.quote}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14532D]/5 text-[#14532D] font-semibold text-sm">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{testimonial.name}</p>
                        <p className="text-xs text-[#6B7280]">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 10. PRICING SECTION ═══════════════════ */}
        <FadeIn delay={0.1}>
          <section id="pricing" className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                badge="Pricing"
                title="Choose the Right Plan for Your Business"
                description="No hidden fees. No per-delivery charges. Predictable pricing that scales with you."
              />
              <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-3 lg:gap-8">
                {[
                  {
                    name: 'Starter',
                    price: 'M299',
                    period: '/month',
                    description: 'For small operations getting started with digital logistics.',
                    features: [
                      '1 company workspace',
                      'Up to 5 users',
                      'Delivery management',
                      'Basic tracking',
                      'Driver management',
                      'Email support',
                    ],
                    cta: 'Get Started',
                    highlighted: false,
                  },
                  {
                    name: 'Professional',
                    price: 'M799',
                    period: '/month',
                    description: 'For growing companies that need advanced tools and analytics.',
                    features: [
                      '1 company workspace',
                      'Up to 25 users',
                      'Advanced dispatch centre',
                      'Real-time tracking',
                      'Fleet management',
                      'Analytics dashboard',
                      'Communication hub',
                      'Priority support',
                    ],
                    cta: 'Get Started',
                    highlighted: true,
                  },
                  {
                    name: 'Enterprise',
                    price: 'M1,999',
                    period: '/month',
                    description: 'Full-featured platform for large-scale logistics operations.',
                    features: [
                      'Multiple companies',
                      'Unlimited users',
                      'AI-powered dispatch',
                      'Sourcing services',
                      'Custom analytics',
                      'API access',
                      'White-label option',
                      'Dedicated account manager',
                      'SLA guarantee',
                    ],
                    cta: 'Talk to Sales',
                    highlighted: false,
                  },
                ].map((plan) => (
                  <Card
                    key={plan.name}
                    className={`relative flex flex-col transition-all duration-200 hover:-translate-y-0.5 ${
                      plan.highlighted
                        ? 'border-[#14532D] bg-white shadow-xl shadow-[#14532D]/10 scale-[1.02] lg:scale-105'
                        : 'border-[#E5E7EB] bg-white hover:shadow-lg hover:shadow-[#14532D]/5'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="rounded-full bg-[#14532D] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#14532D]/20">
                          <Star className="mr-1 h-3 w-3" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2 pt-8 sm:pt-10">
                      <CardTitle className="text-lg font-semibold text-[#111827]">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm text-[#4B5563]">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className={`text-4xl font-bold tracking-tight ${plan.highlighted ? 'text-[#14532D]' : 'text-[#111827]'}`}>
                          {plan.price}
                        </span>
                        <span className="text-sm text-[#6B7280]">
                          {plan.period}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col pt-2">
                      <ul className="flex-1 space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${plan.highlighted ? 'bg-[#14532D]/5' : ''}`}>
                              <Check className={`h-3 w-3 ${plan.highlighted ? 'text-[#14532D]' : 'text-[#16A34A]'}`} />
                            </div>
                            <span className="text-sm text-[#4B5563]">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`mt-8 h-11 w-full font-semibold transition-all duration-200 ${
                          plan.highlighted
                            ? 'bg-[#14532D] text-white shadow-md shadow-[#14532D]/15 hover:bg-[#14532D]/90'
                            : 'bg-white text-[#111827] border border-[#E5E7EB] hover:border-[#14532D]/30 hover:text-[#14532D]'
                        }`}
                        onClick={() => {
                          if (plan.name === 'Enterprise') {
                            scrollTo('#final-cta');
                          } else {
                            setView('register');
                          }
                        }}
                      >
                        {plan.cta}
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Custom package note */}
              <div className="mt-10 text-center">
                <p className="text-sm text-[#4B5563]">
                  Need implementation, staff training, or custom onboarding?{' '}
                  <button
                    onClick={() => scrollTo('#final-cta')}
                    className="font-semibold text-[#14532D] underline underline-offset-2 hover:text-[#0F766E] transition-colors"
                  >
                    Contact us for a tailored deployment package.
                  </button>
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        <SectionDivider />

        {/* ═══════════════════ 11. FAQ SECTION ═══════════════════ */}
        <FadeIn>
          <section id="faq" className="bg-white py-20 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <SectionHeading
                badge="FAQ"
                title="Frequently Asked Questions"
                description="Everything you need to know about SwiftFreight. Can't find the answer? Contact our team."
              />
              <Accordion
                type="single"
                collapsible
                className="mt-12 w-full"
                value={faqOpenIndex}
                onValueChange={(val) => setFaqOpenIndex(val)}
              >
                {[
                  {
                    q: 'How long does it take to get started?',
                    a: 'You can sign up and start using SwiftFreight within minutes. Our onboarding wizard guides you through setting up your company, adding users, and configuring your first delivery routes. Most companies are fully operational within a day.',
                  },
                  {
                    q: 'Is there a free trial available?',
                    a: 'Yes! We offer a 14-day free trial on all plans with full access to features. No credit card required to start. You can upgrade or downgrade at any time during or after the trial.',
                  },
                  {
                    q: 'Does SwiftFreight work offline?',
                    a: 'SwiftFreight is a cloud-based platform, but our driver app supports offline mode. Drivers can update delivery statuses, capture proof of delivery photos, and collect signatures even without internet. Data syncs automatically when connectivity is restored.',
                  },
                  {
                    q: 'Can I use SwiftFreight for cross-border deliveries?',
                    a: 'Absolutely. SwiftFreight is built with cross-border logistics in mind, especially for the Lesotho–South Africa corridor. Our sourcing services module handles customs documentation, agent coordination, and border crossing tracking.',
                  },
                  {
                    q: 'How does multi-tenant support work?',
                    a: 'Each company on SwiftFreight gets its own completely isolated workspace. Your data, users, vehicles, and deliveries are fully separated from other companies. Enterprise plans can manage multiple company workspaces from a single account.',
                  },
                  {
                    q: 'What payment methods do you accept?',
                    a: 'We accept bank transfers, M-Pesa, and major credit/debit cards. All payments are processed securely. Enterprise customers can also arrange invoicing with net-30 payment terms.',
                  },
                  {
                    q: 'Can I integrate SwiftFreight with my existing systems?',
                    a: 'Yes. Our Professional and Enterprise plans include API access, allowing you to integrate SwiftFreight with your existing accounting, ERP, or e-commerce systems. We also offer webhook support for real-time event notifications.',
                  },
                  {
                    q: 'What kind of support do you provide?',
                    a: 'Starter plans include email support with 24-hour response times. Professional plans get priority email and chat support. Enterprise customers receive a dedicated account manager, phone support, and guaranteed SLA response times.',
                  },
                ].map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className={`border-[#E5E7EB] transition-all duration-200 ${faqOpenIndex === `faq-${index}` ? 'rounded-lg border-l-2 border-l-[#14532D] bg-gray-50 shadow-sm' : 'hover:bg-gray-50/50'}`}
                  >
                    <AccordionTrigger className="text-left text-sm font-medium text-[#111827] hover:no-underline sm:text-base transition-colors duration-200 hover:text-[#14532D]">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-[#4B5563] pl-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 12. FINAL CTA SECTION ═══════════════════ */}
        <FadeIn delay={0.1}>
          <section id="final-cta" className="bg-[#14532D] py-20 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to Modernize Your Logistics Operations?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Book a personalised demonstration and discover how SwiftFreight can help your business reduce paperwork, improve delivery visibility, increase operational efficiency, and deliver a better customer experience.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 w-full bg-white px-8 text-base font-semibold text-[#14532D] shadow-lg hover:bg-white/90 transition-colors duration-200 sm:w-auto"
                  onClick={() => setView('register')}
                >
                  Book a Live Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-white/20 px-8 text-base font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-colors duration-200 sm:w-auto"
                  onClick={() => scrollTo('#contact-info')}
                >
                  Contact Sales
                </Button>
              </div>
              <div id="contact-info" className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@swiftfreight.ls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+266 2234 5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinned className="h-4 w-4" />
                  <span>Kingsway Road, Maseru, Lesotho</span>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>

      {/* ═══════════════════ 13. FOOTER ═══════════════════ */}
      <footer className="mt-auto border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14532D]">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-[#111827]">
                  Swift<span className="text-[#16A34A]">Freight</span>
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#4B5563]">
                The Logistics Operating System for Southern Africa. Connecting every link in the supply chain from request to delivery.
              </p>
              {/* Social Links */}
              <div className="mt-5 flex gap-3">
                {[
                  { label: 'Twitter', letter: 'X' },
                  { label: 'LinkedIn', letter: 'in' },
                  { label: 'Facebook', letter: 'f' },
                ].map((social) => (
                  <button
                    key={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] text-xs font-semibold transition-colors duration-200 hover:border-[#14532D]/20 hover:text-[#14532D]"
                    aria-label={social.label}
                  >
                    {social.letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-[#111827]">Product</h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: 'Features', href: '#solutions' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Integrations', href: null },
                  { label: 'Changelog', href: null },
                  { label: 'Roadmap', href: null },
                ].map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <button
                        className="text-sm text-[#4B5563] transition-colors hover:text-[#111827]"
                        onClick={() => scrollTo(link.href!)}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <span className="text-sm text-[#4B5563] transition-colors hover:text-[#111827] cursor-pointer">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-sm font-semibold text-[#111827]">Solutions</h4>
              <ul className="mt-4 space-y-2.5">
                {['Courier Companies', 'Fleet Operators', 'Sourcing Businesses', 'Warehouses', 'Government Fleets'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-[#4B5563] transition-colors hover:text-[#111827] cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Support */}
            <div>
              <h4 className="text-sm font-semibold text-[#111827]">Resources</h4>
              <ul className="mt-4 space-y-2.5">
                {['Documentation', 'Help Center', 'API Reference', 'Blog'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-[#4B5563] transition-colors hover:text-[#111827] cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
              <h4 className="mt-6 text-sm font-semibold text-[#111827]">Support</h4>
              <ul className="mt-4 space-y-2.5">
                {['Contact Us', 'System Status', 'Training'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-[#4B5563] transition-colors hover:text-[#111827] cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company & Legal */}
            <div>
              <h4 className="text-sm font-semibold text-[#111827]">Company</h4>
              <ul className="mt-4 space-y-2.5">
                {['About', 'Careers'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-[#4B5563] transition-colors hover:text-[#111827] cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
              <h4 className="mt-6 text-sm font-semibold text-[#111827]">Legal</h4>
              <ul className="mt-4 space-y-2.5">
                {['Privacy Policy', 'Terms of Service'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-[#4B5563] transition-colors hover:text-[#111827] cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E5E7EB] pt-8 sm:flex-row">
            <p className="text-sm text-[#6B7280]">
              &copy; 2025 SwiftFreight. All rights reserved.
            </p>
            <p className="text-sm text-[#6B7280]">
              Built with care in Maseru, Lesotho
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ BACK TO TOP ═══════════════════ */}
      <motion.button
        initial={false}
        animate={{ opacity: showBackToTop ? 1 : 0, y: showBackToTop ? 0 : 16 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#14532D] text-white shadow-lg shadow-[#14532D]/25 transition-shadow duration-200 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]/50"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </div>
  );
}