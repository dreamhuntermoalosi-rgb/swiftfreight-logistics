'use client';

import { useState, type FormEvent } from 'react';
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
import {
  Truck,
  Menu,
  ArrowRight,
  Play,
  Workflow,
  Building2,
  MapPin,
  Brain,
  Activity,
  Car,
  ShoppingBag,
  BarChart3,
  MessageSquare,
  FileText,
  Zap,
  Eye,
  TrendingUp,
  Package,
  Users,
  Warehouse,
  Search,
  ClipboardList,
  Quote,
  Route,
  CheckCircle2,
  Phone,
  Mail,
  MapPinned,
  Send,
  Check,
  Star,
  ChevronRight,
  X,
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
// SECTION HEADING COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeading({
  badge,
  title,
  description,
}: {
  badge?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {badge && (
        <Badge
          variant="secondary"
          className="mb-4 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary"
        >
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARKETING WEBSITE
// ═══════════════════════════════════════════════════════════════════════════════
export function MarketingWebsite() {
  const { setView } = useNavStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setContactSubmitted(false), 4000);
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    scrollTo(href);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* ─────────── 1. NAVIGATION BAR ─────────── */}
      <header className="glass sticky top-0 z-50 w-full border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Swift<span className="gradient-text">Freight</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-md px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              className="h-9 text-sm font-medium"
              onClick={() => setView('login')}
            >
              Sign In
            </Button>
            <Button
              className="h-9 bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() => setView('register')}
            >
              Get Started
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
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
                      className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </button>
                  ))}
                  <div className="my-4 h-px bg-border" />
                  <Button
                    variant="ghost"
                    className="justify-start px-3 text-sm font-medium"
                    onClick={() => {
                      setMobileOpen(false);
                      setView('login');
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      setMobileOpen(false);
                      setView('register');
                    }}
                  >
                    Get Started
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─────────── 2. HERO SECTION ─────────── */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
          {/* Abstract geometric background */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-emerald/5 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/5 blur-3xl" />
            {/* Grid pattern */}
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.03]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>
            {/* Diagonal lines */}
            <div className="absolute top-0 right-0 h-full w-1/2">
              <div className="absolute top-20 right-20 h-px w-60 rotate-45 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
              <div className="absolute top-40 right-10 h-px w-48 rotate-45 bg-gradient-to-r from-transparent via-emerald/10 to-transparent" />
              <div className="absolute top-60 right-32 h-px w-72 rotate-45 bg-gradient-to-r from-transparent via-teal/8 to-transparent" />
            </div>
            {/* Floating shapes */}
            <div className="absolute top-32 left-[15%] h-2.5 w-2.5 rotate-12 rounded-sm bg-primary/15" />
            <div className="absolute top-48 right-[20%] h-3 w-3 rotate-45 rounded-full bg-emerald/12" />
            <div className="absolute bottom-40 left-[25%] h-2 w-2 rounded-full bg-teal/15" />
            <div className="absolute bottom-60 right-[30%] h-4 w-1 rotate-12 rounded-full bg-primary/10" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <Badge
                variant="secondary"
                className="mb-6 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary"
              >
                Built for Lesotho &middot; Ready for Southern Africa
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                The Intelligent Logistics{' '}
                <span className="gradient-text">Operating System</span> for Africa
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                SwiftFreight connects courier companies, drivers, warehouses, and
                customers in one powerful ecosystem. Built for Lesotho, ready for
                Southern Africa.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 w-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto"
                  onClick={() => setView('register')}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-border/60 px-8 text-base font-semibold sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4 sm:gap-8">
              {[
                { value: '500+', label: 'Deliveries' },
                { value: '3', label: 'Companies' },
                { value: '60', label: 'Drivers' },
                { value: '98%', label: 'On-Time' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── 3. PRODUCT OVERVIEW ─────────── */}
        <section className="border-t border-border/50 bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Product Overview"
              title="One Platform. Every Logistics Need."
              description="From the first delivery request to proof of delivery, SwiftFreight handles your entire logistics operation in one unified system."
            />
            <div className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-3">
              {[
                {
                  icon: Workflow,
                  title: 'Complete Workflow',
                  description:
                    'From request to delivery and proof of delivery — manage every step of the logistics chain without switching tools.',
                },
                {
                  icon: Building2,
                  title: 'Multi-Tenant SaaS',
                  description:
                    'Each company gets its own isolated workspace with custom branding, users, vehicles, and data — all on one platform.',
                },
                {
                  icon: MapPin,
                  title: 'Real-Time Tracking',
                  description:
                    'Track every parcel with live status updates. Customers and operators see the same real-time view of all shipments.',
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="group border-border/50 bg-background transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardHeader className="pb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="mt-2 text-lg font-semibold">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── 4. FEATURES SECTION ─────────── */}
        <section id="features" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Features"
              title="Everything you need to run logistics"
              description="Powerful tools designed for the realities of logistics in Lesotho and Southern Africa."
            />
            <div className="mt-14 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Brain,
                  title: 'Smart Dispatch',
                  description:
                    'AI-powered driver and vehicle assignment optimizes routes and reduces empty miles for every delivery.',
                },
                {
                  icon: Activity,
                  title: 'Live Tracking',
                  description:
                    'Real-time parcel tracking with full status timeline. Know exactly where every shipment is at all times.',
                },
                {
                  icon: Car,
                  title: 'Fleet Management',
                  description:
                    'Vehicle maintenance schedules, insurance tracking, and utilization analytics to maximize fleet performance.',
                },
                {
                  icon: ShoppingBag,
                  title: 'Sourcing Services',
                  description:
                    'Source products from South Africa with dedicated agent assistance. Cross-border logistics made simple.',
                },
                {
                  icon: BarChart3,
                  title: 'Analytics Dashboard',
                  description:
                    'Revenue, performance, and growth insights at a glance. Make data-driven decisions with powerful reporting.',
                },
                {
                  icon: MessageSquare,
                  title: 'Communication Hub',
                  description:
                    'Integrated messaging linked directly to deliveries. All conversations organized and traceable per shipment.',
                },
              ].map((feature) => (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border-border/50 bg-background transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardHeader className="pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="mt-3 text-base font-semibold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── 5. HOW IT WORKS ─────────── */}
        <section id="how-it-works" className="border-t border-border/50 bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="How It Works"
              title="From request to delivery in four steps"
              description="SwiftFreight streamlines the entire logistics process into a simple, intuitive workflow."
            />
            <div className="mt-14 grid gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: '01',
                  icon: FileText,
                  title: 'Submit Request',
                  description:
                    'Customer submits a delivery or sourcing request through the platform with all required details.',
                },
                {
                  step: '02',
                  icon: Quote,
                  title: 'Get Quote',
                  description:
                    'Receive competitive quotations instantly. Compare pricing, timelines, and service levels at a glance.',
                },
                {
                  step: '03',
                  icon: Route,
                  title: 'Track & Monitor',
                  description:
                    'Real-time tracking from pickup to delivery. Get status updates at every checkpoint along the route.',
                },
                {
                  step: '04',
                  icon: CheckCircle2,
                  title: 'Delivered',
                  description:
                    'Proof of delivery with photos and digital signatures. Complete audit trail for every shipment.',
                },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  {/* Connector line */}
                  {index < 3 && (
                    <div
                      className="absolute top-8 left-[calc(50%+28px)] hidden h-px w-[calc(100%-56px)] bg-gradient-to-r from-primary/30 to-primary/5 lg:block"
                      aria-hidden="true"
                    />
                  )}
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-background shadow-sm">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-widest text-primary/60">
                      Step {item.step}
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── 6. CUSTOMER TYPES ─────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="For Everyone"
              title="Built for every logistics stakeholder"
              description="Whether you run a courier company, drive a truck, or ship goods — SwiftFreight has a role for you."
            />
            <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Building2,
                  title: 'Courier Companies',
                  description:
                    'Manage your entire fleet, drivers, and deliveries from a single dashboard with multi-branch support.',
                },
                {
                  icon: Users,
                  title: 'Independent Drivers',
                  description:
                    'Accept delivery assignments, update shipment status, and manage your earnings — all from your phone.',
                },
                {
                  icon: Warehouse,
                  title: 'Warehouse Partners',
                  description:
                    'Receive incoming parcels, organize storage, and coordinate outbound dispatches seamlessly.',
                },
                {
                  icon: Search,
                  title: 'Sourcing Agents',
                  description:
                    'Help customers source products from South Africa with built-in request and quotation management.',
                },
                {
                  icon: Car,
                  title: 'Trailer Owners',
                  description:
                    'List your vehicles for hire, track utilization, and manage maintenance schedules.',
                },
                {
                  icon: Package,
                  title: 'Customers',
                  description:
                    'Submit delivery requests, track parcels in real-time, and receive notifications every step of the way.',
                },
              ].map((type) => (
                <Card
                  key={type.title}
                  className="group border-border/50 bg-background transition-all duration-300 hover:border-primary/20 hover:shadow-md"
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {type.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── 7. BENEFITS SECTION ─────────── */}
        <section className="border-t border-border/50 bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Benefits"
              title="Why companies choose SwiftFreight"
              description="Real operational improvements that translate directly to your bottom line."
            />
            <div className="mt-14 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: FileText,
                  title: 'Reduce Paperwork',
                  description:
                    'Digital workflows replace manual processes. No more lost forms, delayed approvals, or manual data entry.',
                  stat: '80%',
                  statLabel: 'less paperwork',
                },
                {
                  icon: Zap,
                  title: 'Faster Deliveries',
                  description:
                    'Smart dispatch reduces transit times by optimizing driver and vehicle assignments automatically.',
                  stat: '3x',
                  statLabel: 'faster dispatch',
                },
                {
                  icon: Eye,
                  title: 'Complete Visibility',
                  description:
                    'Track everything in real-time. Customers, operators, and management all share the same live view.',
                  stat: '100%',
                  statLabel: 'visibility',
                },
                {
                  icon: TrendingUp,
                  title: 'Scale Easily',
                  description:
                    'From 1 to 1,000 deliveries per day — SwiftFreight grows with your business without missing a beat.',
                  stat: '10x',
                  statLabel: 'growth capacity',
                },
              ].map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-3xl font-bold tracking-tight text-primary">
                    {benefit.stat}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {benefit.statLabel}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── 8. PRICING SECTION ─────────── */}
        <section id="pricing" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Pricing"
              title="Simple, transparent pricing"
              description="No hidden fees. No per-delivery charges. Choose the plan that fits your operation."
            />
            <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  name: 'Starter',
                  price: 'M299',
                  period: '/month',
                  description: 'Perfect for small operations getting started with digital logistics.',
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
                    'Advanced dispatch',
                    'Real-time GPS tracking',
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
                  cta: 'Contact Sales',
                  highlighted: false,
                },
              ].map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col border transition-all duration-300 ${
                    plan.highlighted
                      ? 'border-primary bg-background shadow-xl shadow-primary/10 scale-[1.02] lg:scale-105'
                      : 'border-border/50 bg-background hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                        <Star className="mr-1 h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-2 pt-8 sm:pt-10">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col pt-2">
                    <ul className="flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`mt-8 h-11 w-full font-semibold ${
                        plan.highlighted
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90'
                          : 'bg-background text-foreground border border-border hover:bg-muted'
                      }`}
                      onClick={() => setView('register')}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── 9. FAQ SECTION ─────────── */}
        <section id="faq" className="border-t border-border/50 bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="FAQ"
              title="Frequently asked questions"
              description="Everything you need to know about SwiftFreight. Can't find the answer? Contact our team."
            />
            <Accordion
              type="single"
              collapsible
              className="mt-12 w-full"
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
                  className="border-border/50"
                >
                  <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline sm:text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ─────────── 10. CONTACT SECTION ─────────── */}
        <section id="contact" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
              {/* Background decoration */}
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
                <svg
                  className="absolute inset-0 h-full w-full opacity-[0.04]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="contact-grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#contact-grid)" />
                </svg>
              </div>

              <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Left - CTA */}
                <div className="flex flex-col justify-center text-white">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Ready to Transform Your Logistics?
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                    Join the growing network of logistics companies in Lesotho
                    already using SwiftFreight to streamline their operations.
                  </p>
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-white/90">
                      <Mail className="h-5 w-5 shrink-0 text-white/70" />
                      <span>info@swiftfreight.ls</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Phone className="h-5 w-5 shrink-0 text-white/70" />
                      <span>+266 2234 5678</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <MapPinned className="h-5 w-5 shrink-0 text-white/70" />
                      <span>Kingsway Road, Maseru, Lesotho</span>
                    </div>
                  </div>
                </div>

                {/* Right - Form */}
                <div>
                  {contactSubmitted ? (
                    <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-sm">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                        <CheckCircle2 className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">
                        Message Sent!
                      </h3>
                      <p className="mt-2 text-sm text-white/70">
                        We&apos;ll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleContactSubmit}
                      className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm sm:p-8"
                    >
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-name"
                          className="text-sm font-medium text-white/80"
                        >
                          Full Name
                        </label>
                        <Input
                          id="contact-name"
                          type="text"
                          placeholder="John Mokoena"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-email"
                          className="text-sm font-medium text-white/80"
                        >
                          Email Address
                        </label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="john@company.co.ls"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-message"
                          className="text-sm font-medium text-white/80"
                        >
                          Message
                        </label>
                        <Textarea
                          id="contact-message"
                          placeholder="Tell us about your logistics needs..."
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="h-11 w-full bg-white font-semibold text-primary shadow-lg hover:bg-white/90"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────── 11. FOOTER ─────────── */}
      <footer className="mt-auto border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Truck className="h-4.5 w-4.5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Swift<span className="gradient-text">Freight</span>
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                The intelligent logistics operating system for Lesotho and
                Southern Africa. Connecting every link in the supply chain.
              </p>
              {/* Social Links */}
              <div className="mt-5 flex gap-3">
                {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                  <button
                    key={social}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary"
                    aria-label={social}
                  >
                    <span className="text-xs font-semibold">
                      {social[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <ul className="mt-4 space-y-2.5">
                {['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'].map(
                  (link) => (
                    <li key={link}>
                      <button
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => {
                          if (link === 'Pricing') scrollTo('#pricing');
                          if (link === 'Features') scrollTo('#features');
                        }}
                      >
                        {link}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-foreground">Company</h4>
              <ul className="mt-4 space-y-2.5">
                {['About', 'Careers', 'Blog', 'Contact'].map((link) => (
                  <li key={link}>
                    <button
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => {
                        if (link === 'Contact') scrollTo('#contact');
                      }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Legal */}
            <div>
              <h4 className="text-sm font-semibold text-foreground">Resources</h4>
              <ul className="mt-4 space-y-2.5">
                {['Documentation', 'Help Center', 'API Reference'].map(
                  (link) => (
                    <li key={link}>
                      <span className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                        {link}
                      </span>
                    </li>
                  )
                )}
              </ul>
              <h4 className="mt-6 text-sm font-semibold text-foreground">Legal</h4>
              <ul className="mt-4 space-y-2.5">
                {['Privacy Policy', 'Terms of Service'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 SwiftFreight. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with care in Maseru, Lesotho
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}