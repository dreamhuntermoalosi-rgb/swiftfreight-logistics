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
  Eye,
  TrendingUp,
  PackageSearch,
  LayoutDashboard,
  Navigation,
  ChevronRight,
  Smartphone,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// NAV LINKS
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADING
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-2xl font-bold tracking-tight text-[#212121] sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-[#757575] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PREVIEW (Hero Right Side)
// ─────────────────────────────────────────────────────────────────────────────
function DashboardPreview() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto lg:mx-0">
      {/* Main dashboard card */}
      <div className="rounded-2xl border border-[#E0E0E0] bg-white p-4 shadow-xl shadow-black/[0.06]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#2E7D32] flex items-center justify-center">
              <Truck className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#212121]">Dashboard Overview</span>
          </div>
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#2E7D32]/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#E8F5E9]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#E8F5E9]" />
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { value: '1,248', label: 'Total' },
            { value: '326', label: 'Active' },
            { value: '892', label: 'Done' },
            { value: '98.6%', label: 'On-Time' },
          ].map((m) => (
            <div key={m.label} className="rounded-lg bg-[#E8F5E9] px-2 py-2.5 text-center">
              <div className="text-sm font-bold text-[#2E7D32]">{m.value}</div>
              <div className="text-[10px] text-[#757575] mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="rounded-lg bg-[#E8F5E9] h-32 mb-4 relative overflow-hidden">
          {/* Grid lines for map feel */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="map-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#2E7D32" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>
          {/* Location pins */}
          <div className="absolute top-[25%] left-[30%]">
            <div className="relative">
              <div className="h-4 w-4 rounded-full bg-[#2E7D32] border-2 border-white shadow-md" />
              <div className="absolute -inset-1.5 rounded-full bg-[#2E7D32]/20 animate-ping" />
            </div>
          </div>
          <div className="absolute top-[55%] left-[55%]">
            <div className="h-3.5 w-3.5 rounded-full bg-[#2E7D32] border-2 border-white shadow-md" />
          </div>
          <div className="absolute top-[35%] left-[70%]">
            <div className="h-3.5 w-3.5 rounded-full bg-[#4CAF50] border-2 border-white shadow-md" />
          </div>
          <div className="absolute top-[70%] left-[25%]">
            <div className="h-3 w-3 rounded-full bg-[#4CAF50] border-2 border-white shadow-md" />
          </div>
          <div className="absolute top-[20%] left-[50%]">
            <div className="h-2.5 w-2.5 rounded-full bg-[#81C784] border-2 border-white shadow" />
          </div>
          {/* Map label */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm">
            <span className="text-[10px] font-medium text-[#212121]">Live Tracking</span>
          </div>
        </div>

        {/* Recent deliveries list */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#212121] mb-2">Recent Deliveries</div>
          {[
            { id: '#695201', from: 'Maseru', to: 'Butha-Buthe', status: 'Out for Delivery', color: 'bg-[#FF9800] text-white' },
            { id: '#695198', from: 'Mafikeng', to: 'Maseru', status: 'Delivered', color: 'bg-[#2E7D32] text-white' },
            { id: '#695187', from: 'Leribe', to: 'Qacha\'s Nek', status: 'In Transit', color: 'bg-[#1976D2] text-white' },
          ].map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-2.5">
                <Package className="h-3.5 w-3.5 text-[#757575]" />
                <div>
                  <div className="text-[11px] font-semibold text-[#212121]">Delivery {d.id}</div>
                  <div className="text-[10px] text-[#9E9E9E]">{d.from} → {d.to}</div>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${d.color}`}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating phone mockup */}
      <div className="absolute -bottom-6 -right-6 w-[140px] z-10 hidden sm:block">
        <div className="rounded-2xl border border-[#E0E0E0] bg-white shadow-xl shadow-black/[0.1] overflow-hidden">
          {/* Phone status bar */}
          <div className="bg-[#2E7D32] px-3 py-2 flex items-center justify-between">
            <span className="text-[8px] text-white/80 font-medium">9:41</span>
            <div className="flex gap-1">
              <div className="h-1.5 w-2.5 rounded-sm bg-white/60" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
            </div>
          </div>
          {/* Phone content */}
          <div className="p-2.5">
            <div className="text-[9px] font-bold text-[#212121] mb-2">SwiftFreight</div>
            <div className="space-y-1.5">
              {[
                { icon: Package, label: 'My Deliveries', count: '12' },
                { icon: MapPin, label: 'Track Parcel', count: null },
                { icon: FileText, label: 'My Quotes', count: '3' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <item.icon className="h-3 w-3 text-[#2E7D32]" />
                    <span className="text-[8px] font-medium text-[#212121]">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="rounded-full bg-[#2E7D32] px-1.5 py-0.5 text-[7px] font-bold text-white">{item.count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactCompany('');
    setContactPhone('');
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    scrollTo(href);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">

      {/* ═══════════════════ 1. NAVIGATION ═══════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E0E0E0] bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E7D32]">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#212121]">
              Swift<span className="text-[#2E7D32]">Freight</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-[#212121] transition-colors hover:text-[#2E7D32] focus:outline-none"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="outline"
              className="h-9 border-[#2E7D32] bg-white px-5 text-sm font-medium text-[#2E7D32] hover:bg-[#E8F5E9] hover:border-[#2E7D32] hover:text-[#2E7D32] transition-colors"
              onClick={() => setView('login')}
            >
              Log In
            </Button>
            <Button
              className="h-9 bg-[#2E7D32] px-5 text-sm font-semibold text-white hover:bg-[#1B5E20] transition-colors"
              onClick={() => setView('register')}
            >
              Book a Demo
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#212121]">
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
                      className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-[#212121] transition-colors hover:bg-[#E8F5E9]"
                    >
                      {link.label}
                    </button>
                  ))}
                  <div className="my-4 h-px bg-[#E0E0E0]" />
                  <Button
                    variant="outline"
                    className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]"
                    onClick={() => { setMobileOpen(false); setView('login'); }}
                  >
                    Log In
                  </Button>
                  <Button
                    className="mt-2 bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
                    onClick={() => { setMobileOpen(false); setView('register'); }}
                  >
                    Book a Demo
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ═══════════════════ 2. HERO ═══════════════════ */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left — Copy */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#212121] sm:text-4xl lg:text-5xl leading-[1.15]">
                  Run Logistics.
                  <br />
                  <span className="text-[#2E7D32]">Smarter. Faster. Stronger.</span>
                </h1>
                <p className="mt-5 text-base leading-relaxed text-[#757575] sm:text-lg max-w-lg">
                  SwiftFreight is the all-in-one logistics platform for courier companies, fleet operators and businesses in Lesotho and beyond. Manage deliveries, fleets, drivers, sourcing, tracking and customers from one powerful system.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="h-11 bg-[#2E7D32] px-7 text-sm font-bold text-white hover:bg-[#1B5E20] transition-colors"
                    onClick={() => setView('register')}
                  >
                    Book a Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 border-[#2E7D32] bg-white px-7 text-sm font-semibold text-[#2E7D32] hover:bg-[#E8F5E9] hover:border-[#2E7D32] hover:text-[#2E7D32] transition-colors"
                    onClick={() => scrollTo('#features')}
                  >
                    Explore Platform
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Right — Dashboard Preview */}
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. PLATFORM OVERVIEW ═══════════════════ */}
        <FadeIn>
          <section id="features" className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <SectionHeading
                title="One Platform. Every Logistics Need."
                description="Digitize and automate your entire logistics operation with powerful modules built for the way you work."
              />
              <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {[
                  {
                    icon: Package,
                    title: 'Delivery Management',
                    desc: 'Create, assign, and track every delivery from request to proof of delivery.',
                  },
                  {
                    icon: Car,
                    title: 'Fleet & Driver Management',
                    desc: 'Manage vehicles, maintenance schedules, driver performance and documentation.',
                  },
                  {
                    icon: MapPin,
                    title: 'Real-time Tracking',
                    desc: 'Live status updates and GPS tracking so everyone knows where every parcel is.',
                  },
                  {
                    icon: PackageSearch,
                    title: 'Sourcing Requests',
                    desc: 'Customers request products, agents source and deliver — all tracked in one place.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Analytics Center',
                    desc: 'Revenue, delivery performance, and growth insights to make better decisions.',
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl bg-[#E8F5E9] p-6 transition-all duration-200 hover:shadow-md hover:shadow-[#2E7D32]/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#2E7D32] shadow-sm">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-[#212121]">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#757575]">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 4. HOW IT WORKS ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section id="how-it-works" className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <SectionHeading
                title="From request to delivery in four simple steps"
                description="A seamless workflow that keeps your business and your customers informed at every step."
              />
              <div className="mt-12 grid gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    step: '01',
                    icon: FileText,
                    title: 'Create Request',
                    desc: 'Customer submits a delivery or sourcing request through the platform with all the details.',
                  },
                  {
                    step: '02',
                    icon: Navigation,
                    title: 'Assign & Dispatch',
                    desc: 'Your team reviews the request, assigns a driver and vehicle, and dispatches the job.',
                  },
                  {
                    step: '03',
                    icon: MapPin,
                    title: 'Track in Real-time',
                    desc: 'Both your team and the customer can follow the parcel status at every checkpoint.',
                  },
                  {
                    step: '04',
                    icon: CheckCircle2,
                    title: 'Deliver & Confirm',
                    desc: 'Driver captures proof of delivery with photo and signature. Customer provides feedback.',
                  },
                ].map((item, index) => (
                  <div key={item.step} className="relative text-center">
                    {/* Connector line */}
                    {index < 3 && (
                      <div className="absolute top-8 left-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] lg:block" aria-hidden="true">
                        <div className="h-full w-full bg-[#E0E0E0]" />
                        <div className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rotate-45 border-r-2 border-t-2 border-[#E0E0E0]" />
                      </div>
                    )}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#2E7D32] ring-1 ring-[#2E7D32]/10">
                      <item.icon className="h-6 w-6" />
                      <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2E7D32] text-[9px] font-bold text-white">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-[#212121]">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#757575]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 5. STAKEHOLDER TOOLS ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section className="bg-[#F5F5F5] py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <SectionHeading
                title="Powerful tools for every role"
                description="Whether you run a fleet, drive a vehicle, or need something delivered — SwiftFreight has you covered."
              />
              <div className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {[
                  {
                    icon: Building2,
                    title: 'Couriers & Fleet Owners',
                    desc: 'Manage your entire operation — dispatch, fleet, drivers, customers and revenue from one dashboard.',
                  },
                  {
                    icon: Car,
                    title: 'Drivers',
                    desc: 'Receive assignments, update delivery status, upload proof of delivery and track earnings.',
                  },
                  {
                    icon: Users,
                    title: 'Customers',
                    desc: 'Submit delivery requests, track parcels in real-time, view history and rate deliveries.',
                  },
                  {
                    icon: PackageSearch,
                    title: 'Sourcing Agents',
                    desc: 'Manage sourcing requests, provide quotations and coordinate cross-border procurement.',
                  },
                  {
                    icon: Truck,
                    title: 'Trailer Owners',
                    desc: 'List vehicles, track utilization, manage maintenance and receive rental revenue.',
                  },
                ].map((item) => (
                  <Card
                    key={item.title}
                    className="border-[#E0E0E0] bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="mt-3 text-sm font-semibold text-[#212121]">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs leading-relaxed text-[#757575]">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 6. GROWTH STATS ═══════════════════ */}
        <FadeIn>
          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <SectionHeading
                title="Built to help your business grow"
                description="More efficiency. Happier customers. Higher profits."
              />
              <div className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Clock, metric: '80%', label: 'Faster Operations', desc: 'Automate repetitive tasks and reduce manual work across your entire workflow.' },
                  { icon: Package, metric: '3x', label: 'More Deliveries', desc: 'Handle more orders with the same team by eliminating bottlenecks and delays.' },
                  { icon: Eye, metric: '100%', label: 'Visibility', desc: 'Know where every vehicle, driver, and parcel is at all times — no more guessing.' },
                  { icon: TrendingUp, metric: '10x', label: 'Business Growth', desc: 'Scale from one vehicle to a full fleet without changing systems or adding complexity.' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#2E7D32]">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <div className="mt-4 text-3xl font-bold text-[#2E7D32] sm:text-4xl">
                      {item.metric}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[#212121]">
                      {item.label}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#757575] max-w-[220px] mx-auto">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 7. TESTIMONIALS ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section className="bg-[#F5F5F5] py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <SectionHeading
                title="See what our customers say"
                description="Real feedback from logistics businesses running on SwiftFreight in Lesotho."
              />
              <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-3">
                {[
                  {
                    quote: 'SwiftFreight transformed the way we run our deliveries. We save time, serve more customers and our operations are now fully automated.',
                    name: 'Thabo Mokone',
                    role: 'Operations Manager',
                    company: 'Lesotho Express',
                    stars: 5,
                  },
                  {
                    quote: 'The real-time tracking and dispatch board has been a game changer. Our customers love the visibility and our team spends less time on phone calls.',
                    name: 'Lerato Mahlape',
                    role: 'Director',
                    company: 'Rapid Logistics',
                    stars: 5,
                  },
                  {
                    quote: 'Finally, a system built for Africa, by Africans. It\'s solved all our logistics challenges. The team is responsive and the platform keeps getting better.',
                    name: 'Puleng Radebe',
                    role: 'Owner',
                    company: 'Mountain Couriers',
                    stars: 5,
                  },
                ].map((t) => (
                  <div
                    key={t.name}
                    className="rounded-xl border border-[#E0E0E0] bg-white p-6 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < t.stars ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-[#757575] mb-5">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#E0E0E0]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32] font-semibold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#212121]">{t.name}</p>
                        <p className="text-xs text-[#9E9E9E]">{t.role}, {t.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 8. PRICING ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section id="pricing" className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <SectionHeading
                title="Choose the plan that works for you"
                description="No hidden fees. No long-term contracts."
              />
              <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-3">
                {[
                  {
                    name: 'Starter',
                    price: 'M299',
                    period: '/month',
                    description: 'For small operations getting started with digital logistics.',
                    features: [
                      'Up to 5 Drivers',
                      'Up to 10 Vehicles',
                      'Delivery Management',
                      'Real-time Tracking',
                      'Basic Reports',
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
                      'Up to 20 Drivers',
                      'Up to 30 Vehicles',
                      'Advanced Reports',
                      'Dedicated Support',
                      'Sourcing Requests',
                      'Priority Support',
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
                      'Unlimited Drivers',
                      'Unlimited Vehicles',
                      'Custom Reports',
                      'API Access',
                      'Dedicated Support',
                      'Custom Integrations',
                    ],
                    cta: 'Talk to Sales',
                    highlighted: false,
                  },
                ].map((plan) => (
                  <Card
                    key={plan.name}
                    className={`relative flex flex-col transition-all duration-200 hover:-translate-y-0.5 ${
                      plan.highlighted
                        ? 'border-2 border-[#2E7D32] bg-white shadow-lg shadow-[#2E7D32]/10 scale-[1.02] lg:scale-105'
                        : 'border-[#E0E0E0] bg-white hover:shadow-md'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="rounded-full bg-[#2E7D32] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          <Star className="mr-1 h-3 w-3" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2 pt-8 sm:pt-10">
                      <CardTitle className="text-base font-semibold text-[#212121]">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs text-[#757575]">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className={`text-3xl font-bold ${plan.highlighted ? 'text-[#2E7D32]' : 'text-[#212121]'}`}>
                          {plan.price}
                        </span>
                        <span className="text-sm text-[#9E9E9E]">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col pt-2">
                      <ul className="flex-1 space-y-3">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? 'text-[#2E7D32]' : 'text-[#4CAF50]'}`} />
                            <span className="text-sm text-[#757575]">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`mt-8 h-10 w-full text-sm font-semibold transition-colors ${
                          plan.highlighted
                            ? 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]'
                            : 'bg-white text-[#212121] border border-[#E0E0E0] hover:border-[#2E7D32] hover:text-[#2E7D32]'
                        }`}
                        onClick={() => {
                          if (plan.name === 'Enterprise') {
                            scrollTo('#cta');
                          } else {
                            setView('register');
                          }
                        }}
                      >
                        {plan.cta}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 9. FAQ ═══════════════════ */}
        <FadeIn>
          <section id="faq" className="bg-[#F5F5F5] py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-6">
              <SectionHeading
                title="Everything you need to know"
                description="Common questions about SwiftFreight and how it works for your business."
              />
              <Accordion
                type="single"
                collapsible
                className="mt-10 w-full"
                value={faqOpenIndex}
                onValueChange={(val) => setFaqOpenIndex(val)}
              >
                {[
                  {
                    q: 'Is SwiftFreight suitable for small businesses?',
                    a: 'Absolutely. SwiftFreight is designed to grow with you. The Starter plan is affordable for small operations, and you can upgrade as your business expands. There is no minimum commitment.',
                  },
                  {
                    q: 'Can I track deliveries in real-time?',
                    a: 'Yes. Every delivery gets a live tracking timeline that both your team and your customers can see. Status updates happen automatically as the driver progresses through each stage.',
                  },
                  {
                    q: 'Can I request products from outside Lesotho?',
                    a: 'Yes. SwiftFreight includes a sourcing module that lets your customers request products from anywhere. Sourcing agents manage the procurement, and the entire process — from request to delivery — is tracked on the platform.',
                  },
                  {
                    q: 'Is training provided for my team?',
                    a: 'Yes. Every SwiftFreight plan includes onboarding support. We help you configure your workspace, train your staff on their specific roles, and provide ongoing support to ensure a smooth transition.',
                  },
                  {
                    q: 'Can I import my existing data?',
                    a: 'Yes. We support data import for customer lists, vehicle records, driver information, and delivery history. Our team can assist with migration during onboarding.',
                  },
                  {
                    q: 'Is my data secure on SwiftFreight?',
                    a: 'Absolutely. SwiftFreight uses bank-grade encryption, secure cloud hosting, and multi-tenant data isolation. Your company data is completely separated from other tenants and accessible only to your authorized users.',
                  },
                ].map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className={`border-[#E0E0E0] transition-all duration-200 ${faqOpenIndex === `faq-${index}` ? 'rounded-lg border-l-[3px] border-l-[#2E7D32] bg-white shadow-sm' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <AccordionTrigger className="text-left text-sm font-medium text-[#212121] hover:no-underline sm:text-[15px] hover:text-[#2E7D32] transition-colors">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-[#757575] pl-1">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 10. CTA WITH CONTACT FORM ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section id="cta" className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Left — Copy */}
                <div className="text-white">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    Ready to transform your logistics?
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                    Join growing businesses in Lesotho who are running smarter, faster and stronger with SwiftFreight.
                  </p>
                  <div className="mt-8 space-y-3">
                    {[
                      'Free Demo',
                      'Quick Setup',
                      'Local Support, Always',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white/90">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center gap-6 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>info@swiftfreight.ls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+266 2234 5678</span>
                    </div>
                  </div>
                </div>

                {/* Right — Form */}
                <div>
                  {contactSubmitted ? (
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-sm">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                        <CheckCircle2 className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">
                        Demo Booked!
                      </h3>
                      <p className="mt-2 text-sm text-white/70">
                        We&apos;ll be in touch within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleContactSubmit}
                      className="space-y-3.5 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm sm:p-8"
                    >
                      <div>
                        <Input
                          type="text"
                          placeholder="Your Name"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="h-11 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/30"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Your Email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="h-11 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/30"
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          placeholder="Company Name"
                          value={contactCompany}
                          onChange={(e) => setContactCompany(e.target.value)}
                          className="h-11 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/30"
                        />
                      </div>
                      <div>
                        <Input
                          type="tel"
                          placeholder="Phone Number"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="h-11 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/30"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="h-11 w-full bg-white font-semibold text-[#2E7D32] shadow-lg hover:bg-white/90 transition-colors"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Book My Demo
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>

      {/* ═══════════════════ 11. FOOTER ═══════════════════ */}
      <footer className="border-t border-[#E0E0E0] bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-12 sm:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E7D32]">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-[#212121]">
                  Swift<span className="text-[#2E7D32]">Freight</span>
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#757575]">
                The intelligent logistics operating system built for Africa.
              </p>
              {/* Social */}
              <div className="mt-5 flex gap-2.5">
                {[
                  { label: 'X', icon: 'X' },
                  { label: 'LinkedIn', icon: 'in' },
                  { label: 'Facebook', icon: 'f' },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-xs font-semibold text-[#757575] transition-colors hover:bg-[#E8F5E9] hover:text-[#2E7D32]"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-[#212121]">Product</h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'Modules', href: '#features' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Integrations', href: null },
                ].map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <button
                        className="text-sm text-[#757575] transition-colors hover:text-[#212121]"
                        onClick={() => scrollTo(link.href)}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <span className="text-sm text-[#757575] transition-colors hover:text-[#212121] cursor-pointer">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-sm font-semibold text-[#212121]">Solutions</h4>
              <ul className="mt-4 space-y-2.5">
                {['For Couriers', 'For Drivers', 'For Businesses', 'For Sourcing Agents'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-[#757575] transition-colors hover:text-[#212121] cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-[#212121]">Resources</h4>
              <ul className="mt-4 space-y-2.5">
                {['Help Center', 'Guides', 'Blog', 'Status'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-[#757575] transition-colors hover:text-[#212121] cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-[#212121]">Company</h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: 'About Us', href: null },
                  { label: 'Careers', href: null },
                  { label: 'Contact Us', href: '#cta' },
                ].map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <button
                        className="text-sm text-[#757575] transition-colors hover:text-[#212121]"
                        onClick={() => scrollTo(link.href)}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <span className="text-sm text-[#757575] transition-colors hover:text-[#212121] cursor-pointer">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E0E0E0] pt-8 sm:flex-row">
            <p className="text-sm text-[#9E9E9E]">
              &copy; 2025 SwiftFreight. All rights reserved.
            </p>
            <div className="flex gap-6">
              <span className="text-sm text-[#9E9E9E] cursor-pointer hover:text-[#212121] transition-colors">Privacy Policy</span>
              <span className="text-sm text-[#9E9E9E] cursor-pointer hover:text-[#212121] transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ BACK TO TOP ═══════════════════ */}
      <motion.button
        initial={false}
        animate={{ opacity: showBackToTop ? 1 : 0, y: showBackToTop ? 0 : 16 }}
        transition={{ duration: 0.2 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32] text-white shadow-lg shadow-[#2E7D32]/25 transition-shadow hover:shadow-xl focus:outline-none"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </div>
  );
}