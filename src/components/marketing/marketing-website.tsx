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
  Shield,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

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
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
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
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xl shadow-black/[0.06]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <Truck className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Dashboard Overview</span>
          </div>
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-primary/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-primary/10" />
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
            <div key={m.label} className="rounded-lg bg-primary/10 px-2 py-2.5 text-center">
              <div className="text-sm font-bold text-primary">{m.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="rounded-lg bg-primary/10 h-32 mb-4 relative overflow-hidden">
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
              <div className="h-4 w-4 rounded-full bg-primary border-2 border-background shadow-md" />
              <div className="absolute -inset-1.5 rounded-full bg-primary/20 animate-ping" />
            </div>
          </div>
          <div className="absolute top-[55%] left-[55%]">
            <div className="h-3.5 w-3.5 rounded-full bg-primary border-2 border-background shadow-md" />
          </div>
          <div className="absolute top-[35%] left-[70%]">
            <div className="h-3.5 w-3.5 rounded-full bg-primary border-2 border-background shadow-md" />
          </div>
          <div className="absolute top-[70%] left-[25%]">
            <div className="h-3 w-3 rounded-full bg-primary border-2 border-background shadow-md" />
          </div>
          <div className="absolute top-[20%] left-[50%]">
            <div className="h-2.5 w-2.5 rounded-full bg-primary/70 border-2 border-background shadow" />
          </div>
          {/* Map label */}
          <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm">
            <span className="text-[10px] font-medium text-foreground">Live Tracking</span>
          </div>
        </div>

        {/* Recent deliveries list */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-foreground mb-2">Recent Deliveries</div>
          {[
            { id: '#695201', from: 'Maseru', to: 'Butha-Buthe', status: 'Out for Delivery', color: 'bg-[#FF9800] text-white' },
            { id: '#695198', from: 'Mafeteng', to: 'Maseru', status: 'Delivered', color: 'bg-primary text-primary-foreground' },
            { id: '#695187', from: 'Leribe', to: 'Qacha\'s Nek', status: 'In Transit', color: 'bg-[#1976D2] text-white' },
          ].map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <div className="flex items-center gap-2.5">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <div className="text-[11px] font-semibold text-foreground">Delivery {d.id}</div>
                  <div className="text-[10px] text-muted-foreground">{d.from} → {d.to}</div>
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
        <div className="rounded-2xl border border-border bg-card shadow-xl shadow-black/[0.1] overflow-hidden">
          {/* Phone status bar */}
          <div className="bg-primary px-3 py-2 flex items-center justify-between">
            <span className="text-[8px] text-primary-foreground/80 font-medium">9:41</span>
            <div className="flex gap-1">
              <div className="h-1.5 w-2.5 rounded-sm bg-primary-foreground/60" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60" />
            </div>
          </div>
          {/* Phone content */}
          <div className="p-2.5">
            <div className="text-[9px] font-bold text-foreground mb-2">SwiftFreight</div>
            <div className="space-y-1.5">
              {[
                { icon: Package, label: 'My Deliveries', count: '12' },
                { icon: MapPin, label: 'Track Parcel', count: null },
                { icon: FileText, label: 'My Quotes', count: '3' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-md bg-muted px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <item.icon className="h-3 w-3 text-primary" />
                    <span className="text-[8px] font-medium text-foreground">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[7px] font-bold text-primary-foreground">{item.count}</span>
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
    <div className="flex min-h-screen flex-col bg-background">

      {/* ═══════════════════ 1. NAVIGATION ═══════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Swift<span className="text-primary">Freight</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus:outline-none"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button
              variant="outline"
              className="h-9 border-primary bg-background px-5 text-sm font-medium text-primary hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors"
              onClick={() => setView('login')}
            >
              Log In
            </Button>
            <Button
              className="h-9 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={() => setView('register')}
            >
              Book a Demo
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground">
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
                      className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-primary/10"
                    >
                      {link.label}
                    </button>
                  ))}
                  <div className="my-4 h-px bg-border" />
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={() => { setMobileOpen(false); setView('login'); }}
                  >
                    Log In
                  </Button>
                  <Button
                    className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
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
        <section className="bg-background py-12 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Left — Copy */}
              <div className="text-center lg:text-left">
                <h1 className="mx-auto text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:mx-0 leading-[1.15]">
                  Run Logistics.
                  <br />
                  <span className="text-primary">Smarter. Faster. Stronger.</span>
                </h1>
                <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                  SwiftFreight is the all-in-one logistics platform for courier companies, fleet operators and businesses in Lesotho and beyond. Manage deliveries, fleets, drivers, sourcing, tracking and customers from one powerful system.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="h-11 bg-primary px-7 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                    onClick={() => setView('register')}
                  >
                    Book a Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 border-primary bg-background px-7 text-sm font-semibold text-primary hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors"
                    onClick={() => scrollTo('#features')}
                  >
                    Explore Platform
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Right — Dashboard Preview — hidden on small screens, visible on lg+ */}
              <div className="hidden lg:block">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ 3. PLATFORM OVERVIEW ═══════════════════ */}
        <FadeIn>
          <section id="features" className="bg-background py-16 sm:py-20">
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
                    className="rounded-xl bg-primary/10 p-6 transition-all duration-200 hover:shadow-md hover:shadow-primary/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
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
          <section id="how-it-works" className="bg-background py-16 sm:py-20">
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
                        <div className="h-full w-full bg-border" />
                        <div className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rotate-45 border-r-2 border-t-2 border-border" />
                      </div>
                    )}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
                      <item.icon className="h-6 w-6" />
                      <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 5. STAKEHOLDER TOOLS ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section className="bg-[#1B3A1B] py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Powerful tools for every role
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg">
                  Whether you run a fleet, drive a vehicle, or need something delivered — SwiftFreight has you covered.
                </p>
              </div>
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
                    className="border-border bg-card transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="mt-3 text-sm font-semibold text-foreground">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 6. GROWTH STATS ═══════════════════ */}
        <FadeIn>
          <section className="bg-background py-16 sm:py-20">
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
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <div className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
                      {item.metric}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-foreground">
                      {item.label}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground max-w-[220px] mx-auto">
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
          <section className="bg-[#1B3A1B] py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  See what our customers say
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg">
                  Real feedback from logistics businesses running on SwiftFreight in Lesotho.
                </p>
              </div>
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
                    className="rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < t.stars ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground mb-5">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
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
          <section id="pricing" className="bg-background py-16 sm:py-20">
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
                        ? 'border-2 border-primary bg-card shadow-lg shadow-primary/10 scale-[1.02] lg:scale-105'
                        : 'border-border bg-card hover:shadow-md'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                          <Star className="mr-1 h-3 w-3" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2 pt-8 sm:pt-10">
                      <CardTitle className="text-base font-semibold text-foreground">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs text-muted-foreground">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className={`text-3xl font-bold ${plan.highlighted ? 'text-primary' : 'text-foreground'}`}>
                          {plan.price}
                        </span>
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col pt-2">
                      <ul className="flex-1 space-y-3">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <Check className={`mt-0.5 h-4 w-4 shrink-0 text-primary`} />
                            <span className="text-sm text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`mt-8 h-10 w-full text-sm font-semibold transition-colors ${
                          plan.highlighted
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-background text-foreground border border-border hover:border-primary hover:text-primary'
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
          <section id="faq" className="bg-muted py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-6">
              <SectionHeading
                title="Everything you need to know"
                description="Common questions about SwiftFreight and how it works for your business."
              />
              <div className="mt-12 space-y-3">
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
                    a: 'Yes. SwiftFreight includes a sourcing module that lets your customers request products from anywhere. Sourcing agents manage the procurement, and the entire process \u2014 from request to delivery \u2014 is tracked on the platform.',
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
                ].map((item, index) => {
                  const isOpen = faqOpenIndex === `faq-${index}`;
                  return (
                    <div
                      key={index}
                      className={`rounded-xl border bg-card px-5 transition-all duration-200 ${
                        isOpen
                          ? 'border-primary/30 shadow-sm'
                          : 'border-border hover:border-primary/20'
                      }`}
                    >
                      <button
                        className="flex w-full items-center justify-between py-4 text-left"
                        onClick={() => setFaqOpenIndex(isOpen ? undefined : `faq-${index}`)}
                      >
                        <span className={`text-[15px] font-medium transition-colors ${isOpen ? 'text-primary' : 'text-foreground'}`}>
                          {item.q}
                        </span>
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                            isOpen ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="pb-4 text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ═══════════════════ 10. CTA WITH CONTACT FORM ═══════════════════ */}
        <FadeIn delay={0.05}>
          <section id="cta" className="bg-primary py-16 sm:py-20">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Left — Copy */}
                <div className="text-primary-foreground">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    Ready to transform your logistics?
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
                    Join growing businesses in Lesotho who are running smarter, faster and stronger with SwiftFreight.
                  </p>
                  <div className="mt-8 space-y-3">
                    {[
                      'Free Demo',
                      'Quick Setup',
                      'Local Support, Always',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/15">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-medium text-primary-foreground/90">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center gap-6 text-sm text-primary-foreground/60">
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
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-8 text-center backdrop-blur-sm">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20">
                        <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-primary-foreground">
                        Demo Booked!
                      </h3>
                      <p className="mt-2 text-sm text-primary-foreground/70">
                        We&apos;ll be in touch within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleContactSubmit}
                      className="space-y-3.5 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-6 backdrop-blur-sm sm:p-8"
                    >
                      <div>
                        <Input
                          type="text"
                          placeholder="Your Name"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="h-11 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:border-primary-foreground/40 focus-visible:ring-primary-foreground/30"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Your Email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="h-11 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:border-primary-foreground/40 focus-visible:ring-primary-foreground/30"
                        />
                      </div>
                      <div>
                        <Input
                          type="text"
                          placeholder="Company Name"
                          value={contactCompany}
                          onChange={(e) => setContactCompany(e.target.value)}
                          className="h-11 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:border-primary-foreground/40 focus-visible:ring-primary-foreground/30"
                        />
                      </div>
                      <div>
                        <Input
                          type="tel"
                          placeholder="Phone Number"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="h-11 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:border-primary-foreground/40 focus-visible:ring-primary-foreground/30"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="h-11 w-full bg-primary-foreground font-semibold text-primary shadow-lg hover:bg-primary-foreground/90 transition-colors"
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

        {/* ═══════════════════ LEGAL DISCLAIMER ═══════════════════ */}
        <section className="bg-muted border-y border-border py-8">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning mt-0.5">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Platform Disclaimer &amp; Liability Notice</h3>
                <p className="text-xs leading-relaxed text-muted-foreground max-w-3xl">
                  SwiftFreight provides the technology platform that connects logistics companies, drivers, and customers in Lesotho. 
                  SwiftFreight does NOT operate as a logistics company, courier service, or freight carrier. All logistics services — including parcel collection, 
                  transportation, and delivery — are provided by independent third-party logistics companies registered on the platform. 
                  SwiftFreight is not a party to any delivery contract between customers and logistics providers and shall not be held liable for 
                  loss, damage, delay, or misdelivery of parcels. Each logistics company operating on the platform is solely responsible for their 
                  own operations, insurance, regulatory compliance, and customer service. Customers are required to declare all parcel contents 
                  accurately and comply with Lesotho laws and regulations. By using this platform, you acknowledge and accept these terms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════ 11. FOOTER ═══════════════════ */}
      <footer className="border-t border-[#2E4A2E] bg-[#1B3A1B]">
        <div className="mx-auto max-w-[1200px] px-6 py-12 sm:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E7D32]">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Swift<span className="text-[#4CAF50]">Freight</span>
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                The intelligent logistics operating system built for Lesotho.
              </p>
              {/* Social Icons — Real SVGs */}
              <div className="mt-5 flex gap-3">
                {/* X / Twitter */}
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-[#2E7D32] hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-[#2E7D32] hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-[#2E7D32] hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-[#2E7D32] hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                {/* WhatsApp */}
                <a
                  href="#"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-[#2E7D32] hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white">Product</h4>
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
                        className="text-sm text-white/50 transition-colors hover:text-white"
                        onClick={() => scrollTo(link.href)}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <span className="text-sm text-white/50 transition-colors hover:text-white cursor-pointer">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-sm font-semibold text-white">Solutions</h4>
              <ul className="mt-4 space-y-2.5">
                {['For Couriers', 'For Drivers', 'For Businesses', 'For Sourcing Agents'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-white/50 transition-colors hover:text-white cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-white">Resources</h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: 'Help Center', action: () => setView('knowledge-base') },
                  { label: 'Knowledgebase', action: () => setView('knowledge-base') },
                  { label: 'Training', action: () => setView('training') },
                  { label: 'Feature Requests', action: () => setView('feature-requests') },
                  { label: 'Onboarding Guide', action: () => setView('onboarding') },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      className="text-sm text-white/50 transition-colors hover:text-white"
                      onClick={link.action}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white">Company</h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: 'About Us', href: null },
                  { label: 'Careers', href: null },
                  { label: 'Contact Us', href: '#cta' },
                ].map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <button
                        className="text-sm text-white/50 transition-colors hover:text-white"
                        onClick={() => scrollTo(link.href)}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <span className="text-sm text-white/50 transition-colors hover:text-white cursor-pointer">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-white/40">
              &copy; 2025 SwiftFreight. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span className="text-sm text-white/40 cursor-pointer hover:text-white/70 transition-colors">Privacy Policy</span>
              <span className="text-sm text-white/40 cursor-pointer hover:text-white/70 transition-colors">Terms of Service</span>
              <span className="text-sm text-white/40 cursor-pointer hover:text-white/70 transition-colors">Platform Disclaimer</span>
              <span className="text-sm text-white/40 cursor-pointer hover:text-white/70 transition-colors">Liability Notice</span>
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
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl focus:outline-none"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </div>
  );
}