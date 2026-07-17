'use client';

import { useState, useMemo } from 'react';
import { useNavStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Truck,
  Package,
  Users,
  Shield,
  DollarSign,
  Lock,
  FileText,
  ChevronLeft,
  ArrowRight,
  Plus,
  Calendar,
  Wrench,
  BarChart3,
  Warehouse,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE DATA
// ─────────────────────────────────────────────────────────────────────────────

interface Article {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  content: string[];
  lastUpdated: string;
}

const CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started', icon: <BookOpen className="h-4 w-4" />, count: 4 },
  { id: 'deliveries', label: 'Deliveries', icon: <Package className="h-4 w-4" />, count: 4 },
  { id: 'for-drivers', label: 'For Drivers', icon: <Truck className="h-4 w-4" />, count: 3 },
  { id: 'sourcing', label: 'Sourcing', icon: <FileText className="h-4 w-4" />, count: 2 },
  { id: 'fleet-management', label: 'Fleet Management', icon: <Wrench className="h-4 w-4" />, count: 2 },
  { id: 'safety-compliance', label: 'Safety & Compliance', icon: <Shield className="h-4 w-4" />, count: 4 },
  { id: 'billing-pricing', label: 'Billing & Pricing', icon: <DollarSign className="h-4 w-4" />, count: 2 },
  { id: 'account-security', label: 'Account & Security', icon: <Lock className="h-4 w-4" />, count: 2 },
] as const;

const ARTICLES: Article[] = [
  // Getting Started
  {
    id: 'creating-account',
    title: 'Creating Your Account',
    category: 'getting-started',
    icon: <Users className="h-5 w-5" />,
    lastUpdated: '2025-01-15',
    content: [
      'Getting started with SwiftFreight is straightforward. Visit the registration page and select your role — whether you are a customer looking to ship parcels, a driver seeking delivery assignments, or a company owner managing a fleet. Each role has a tailored experience with features designed specifically for your needs.',
      'During registration, you will need to provide your full name, email address, phone number, and create a secure password. If you are registering as a company, you will also need to enter your company name, physical address in Lesotho, and select a subscription plan. All new accounts require email verification before you can access the full platform.',
      'After verifying your email, you will be guided through a brief onboarding wizard that introduces you to the platform features relevant to your role. You can skip this at any time and return to it later from your settings. We recommend completing the onboarding to get the most out of SwiftFreight from day one.',
    ],
  },
  {
    id: 'setting-up-company',
    title: 'Setting Up Your Company',
    category: 'getting-started',
    icon: <Warehouse className="h-5 w-5" />,
    lastUpdated: '2025-01-20',
    content: [
      'If you are a logistics company, courier service, or fleet operator, setting up your company profile is the first step to unlocking SwiftFreight\'s full potential. Navigate to Settings > Company Profile and fill in your business details including your registered business name, physical address, contact information, and Lesotho Revenue Authority (LRA) tax registration number if applicable.',
      'You can configure your service areas by selecting the districts you operate in. SwiftFreight supports all 10 districts of Lesotho: Maseru, Leribe, Berea, Mafeteng, Mohale\'s Hoek, Quthing, Qacha\'s Nek, Mokhotlong, Thaba-Tseka, and Butha-Buthe. You can also set up cross-border routes to South African cities like Johannesburg, Durban, and Bloemfontein.',
      'Company owners can invite team members by entering their email addresses and assigning roles such as Operations Manager, Dispatcher, or Fleet Manager. Each role comes with specific permissions that limit access to only the features they need. You can manage your team and update roles at any time from the Users section in Settings.',
    ],
  },
  {
    id: 'understanding-dashboard',
    title: 'Understanding the Dashboard',
    category: 'getting-started',
    icon: <BarChart3 className="h-5 w-5" />,
    lastUpdated: '2025-02-01',
    content: [
      'The SwiftFreight dashboard is your command center — a single screen that gives you an at-a-glance view of everything happening in your logistics operation. Depending on your role, you will see different metrics and widgets. Company owners and operations managers see revenue figures, delivery volumes, and on-time rates, while drivers see their active assignments and daily earnings.',
      'The dashboard is organized into cards that display key performance indicators (KPIs). The main metrics card shows your total deliveries, revenue, and growth compared to the previous period. Below that, you will find a delivery status breakdown, recent activity feed, and quick-action buttons for common tasks like creating a new delivery request or dispatching a driver.',
      'You can customize your dashboard layout by dragging and dropping widgets to rearrange them. Click on any metric card to drill down into detailed analytics. The dashboard refreshes automatically, so you always have the latest data without needing to refresh the page. Use the date range selector in the top-right corner to view data for specific time periods.',
    ],
  },
  {
    id: 'managing-profile',
    title: 'Managing Your Profile',
    category: 'getting-started',
    icon: <Users className="h-5 w-5" />,
    lastUpdated: '2025-01-18',
    content: [
      'Your personal profile contains information that helps SwiftFreight provide you with a personalized experience. To access it, click on your avatar in the top-right corner and select "Profile" from the dropdown menu. Here you can update your display name, phone number, profile photo, and notification preferences.',
      'For drivers, the profile section also includes your driver\'s license details, vehicle assignment, and performance statistics. Keeping your license information up-to-date is important for compliance. For customers, you can manage your default delivery addresses, which makes creating new delivery requests faster.',
      'Notification settings allow you to control how and when you receive alerts. You can choose between in-app notifications, email notifications, and SMS notifications for different event types. For example, drivers might want SMS alerts for new assignments, while customers may prefer email updates on delivery status changes. You can also set quiet hours to avoid receiving non-urgent notifications during specific times.',
    ],
  },
  // Deliveries
  {
    id: 'creating-delivery-request',
    title: 'Creating a Delivery Request',
    category: 'deliveries',
    icon: <Package className="h-5 w-5" />,
    lastUpdated: '2025-02-05',
    content: [
      'Creating a delivery request on SwiftFreight is designed to be quick and intuitive. From your dashboard, click the "New Delivery" button. You will be prompted to enter the pickup location (with address, city, and recipient contact details) and the delivery destination. SwiftFreight uses location autocomplete to help you quickly find addresses across Lesotho.',
      'Next, describe your package by entering the type of goods, estimated weight, dimensions, and declared value. The declared value is important for insurance purposes — SwiftFreight provides basic coverage, and you can purchase additional insurance for high-value items. You will also select a delivery priority: Standard (3-5 business days), Express (1-2 business days), or Urgent (same-day or next-day where available).',
      'After submitting your request, you will receive an automated quotation based on the distance, package weight, and selected priority. The quote is valid for 24 hours. Once you accept the quote and complete payment, your delivery enters the dispatch queue and will be assigned to an available driver. You can track the entire journey from your delivery tracking page.',
    ],
  },
  {
    id: 'tracking-parcel',
    title: 'Tracking Your Parcel',
    category: 'deliveries',
    icon: <BarChart3 className="h-5 w-5" />,
    lastUpdated: '2025-02-10',
    content: [
      'SwiftFreight provides real-time tracking for every delivery. As a customer, you can track your parcel by entering the tracking number (e.g., SF-2025-001234) on the tracking page, or simply view all your active deliveries from your dashboard. Each delivery has a detailed timeline showing every status update with timestamps and location information.',
      'The tracking timeline includes key milestones: Request Received, Quote Accepted, Collected, At Warehouse, In Transit, At Border (for cross-border deliveries), Out for Delivery, and Delivered. You will receive automatic notifications at each stage. For cross-border deliveries, the "At Border" status includes information about customs clearance progress.',
      'You can also share the tracking link with the recipient so they can monitor the delivery without needing a SwiftFreight account. The shared tracking page shows the current status, estimated delivery time, and a map view of the delivery route. This is especially useful for business customers who need to keep their clients informed about shipment progress.',
    ],
  },
  {
    id: 'understanding-delivery-statuses',
    title: 'Understanding Delivery Statuses',
    category: 'deliveries',
    icon: <FileText className="h-5 w-5" />,
    lastUpdated: '2025-01-25',
    content: [
      'Every delivery on SwiftFreight goes through a defined lifecycle with clear status indicators. "Request Received" means your order has been submitted and is awaiting quotation. "Awaiting Quote" indicates the system is calculating the delivery cost. "Quote Accepted" means you have approved the pricing and the delivery is being prepared for dispatch.',
      'Once a driver picks up your parcel, the status changes to "Collected." For logistics companies using warehouse staging, the parcel may move to "At Warehouse" before being loaded onto a vehicle for transit. "In Transit" means the parcel is on its way. Cross-border deliveries will show "At Border" when the package reaches the Maseru Bridge or Ficksburg border post for customs processing.',
      '"Out for Delivery" indicates the driver is on the final leg of the journey to the recipient. "Delivered" is the final status, confirmed when the driver uploads proof of delivery (photo and/or signature). If a delivery cannot be completed, it may be marked as "Returned" or "Cancelled" with a reason provided. Understanding these statuses helps you know exactly where your parcel is at all times.',
    ],
  },
  {
    id: 'proof-of-delivery',
    title: 'Proof of Delivery',
    category: 'deliveries',
    icon: <Shield className="h-5 w-5" />,
    lastUpdated: '2025-02-08',
    content: [
      'Proof of Delivery (POD) is a critical part of the delivery process on SwiftFreight. When a driver completes a delivery, they are required to capture proof before the system marks the delivery as complete. This typically includes a photo of the package at the delivery location and, when possible, a digital signature from the recipient.',
      'The POD system helps resolve disputes, provides evidence for insurance claims, and gives customers confidence that their parcel was delivered successfully. Drivers can upload multiple photos if needed — for example, showing the package from different angles or capturing the condition of goods upon delivery. GPS coordinates are automatically captured at the time of upload.',
      'Customers can view the POD for any completed delivery by clicking on the delivery in their history and selecting the "Proof of Delivery" tab. If there is an issue with a delivery, you can use the POD as evidence when filing a claim. The POD is stored securely and is accessible for up to 12 months after delivery completion.',
    ],
  },
  // For Drivers
  {
    id: 'accepting-assignments',
    title: 'Accepting Assignments',
    category: 'for-drivers',
    icon: <Truck className="h-5 w-5" />,
    lastUpdated: '2025-02-03',
    content: [
      'As a driver on SwiftFreight, you will receive delivery assignments from your dispatcher or company. When a new assignment is available, you will see a notification on your dashboard and, if enabled, receive an SMS alert. Each assignment shows the pickup location, delivery destination, package details, and the estimated earnings for that delivery.',
      'To accept an assignment, simply tap "Accept" on the notification or navigate to your "Pending Assignments" section. Before accepting, review the details carefully — check the pickup address, delivery address, and package weight to ensure your vehicle can handle the load. Once accepted, the assignment moves to your "Active Deliveries" list and you will see navigation instructions.',
      'If you are unable to accept an assignment (due to vehicle issues, location, or schedule conflicts), you can decline it. Declining too many assignments may affect your driver rating and the frequency of future assignments. If you encounter issues during a delivery, use the in-app messaging system to contact your dispatcher immediately for guidance.',
    ],
  },
  {
    id: 'updating-delivery-status',
    title: 'Updating Delivery Status',
    category: 'for-drivers',
    icon: <FileText className="h-5 w-5" />,
    lastUpdated: '2025-01-28',
    content: [
      'Keeping delivery statuses up-to-date is one of your most important responsibilities as a driver. SwiftFreight makes this easy with one-tap status updates. When you arrive at the pickup location, tap "Arrived at Pickup." Once you have collected the package, tap "Picked Up." During transit, the app may automatically update your location via GPS.',
      'For cross-border deliveries, there is a specific "At Border" status. When you reach the border post (Maseru Bridge or Ficksburg), update the status so the operations team and customer know the parcel is undergoing customs processing. This is especially important because border delays are common and customers appreciate being kept informed.',
      'The final status update happens when you reach the delivery destination. Tap "Arrived at Destination" and then proceed to collect proof of delivery. After uploading the POD (photo and/or signature), tap "Delivered" to complete the delivery. The system will prompt you if any required fields are missing before allowing you to mark the delivery as complete.',
    ],
  },
  {
    id: 'uploading-proof-of-delivery',
    title: 'Uploading Proof of Delivery',
    category: 'for-drivers',
    icon: <Shield className="h-5 w-5" />,
    lastUpdated: '2025-02-06',
    content: [
      'Uploading Proof of Delivery (POD) is the final step in completing a delivery. After arriving at the delivery location, open the delivery in your active list and tap "Upload POD." You will be prompted to take a photo of the package at the delivery location. Ensure the photo clearly shows the package and, if possible, the recipient or the delivery address.',
      'If the recipient is available, you can also collect a digital signature. Hand your phone to the recipient and they can sign directly on the screen using their finger. The recipient\'s name and phone number should also be entered for verification purposes. This information is stored alongside the delivery record for reference.',
      'In cases where the recipient is not available, take a photo of the package at the door or designated drop-off point. Add a note explaining the situation (e.g., "Left at front gate per recipient\'s instruction"). If the delivery cannot be completed, do not mark it as delivered — instead, contact your dispatcher to arrange a re-delivery or return.',
    ],
  },
  // Sourcing
  {
    id: 'how-sourcing-works',
    title: 'How Sourcing Works',
    category: 'sourcing',
    icon: <FileText className="h-5 w-5" />,
    lastUpdated: '2025-01-22',
    content: [
      'SwiftFreight\'s sourcing service connects Lesotho customers with products available in South Africa. Many products are either unavailable or significantly more expensive in Lesotho, so our sourcing agents help customers find, purchase, and import goods from South African retailers and wholesalers. This service is particularly popular for electronics, clothing, building materials, and automotive parts.',
      'To use the sourcing service, submit a sourcing request with details about the product you need, including a description, product link (if you found one online), preferred store, and your budget. A sourcing agent will review your request, search for the best price, and provide you with a quotation that includes the product cost, agent fees, and estimated delivery charges.',
      'Once you accept the quotation, the sourcing agent purchases the product on your behalf and arranges for it to be transported to Lesotho. The entire process is tracked through SwiftFreight, and you receive updates at every stage — from purchase confirmation to delivery at your doorstep. Typical sourcing turnaround times range from 3 to 10 business days depending on product availability and customs clearance.',
    ],
  },
  {
    id: 'managing-sourcing-requests',
    title: 'Managing Sourcing Requests',
    category: 'sourcing',
    icon: <BarChart3 className="h-5 w-5" />,
    lastUpdated: '2025-02-12',
    content: [
      'Both customers and sourcing agents can manage sourcing requests through the Sourcing section of the dashboard. Customers can view all their requests in a pipeline view showing the current status: Pending, Quoted, Accepted, Purchased, In Transit, Delivered, or Cancelled. Each request card shows the product name, agent assigned, and current status.',
      'Sourcing agents have a dedicated queue showing all pending requests that need attention. Agents can filter by product category, budget range, or urgency. When quoting a request, agents provide a detailed breakdown including the product price, agent commission, transport cost to the border, customs duties (if applicable), and final delivery cost in Lesotho.',
      'Communication between customers and agents happens through the built-in messaging system. Agents can send photos of products found, alternative options, and pricing details. Customers can ask questions, negotiate, or request changes. All messages are tied to the sourcing request for easy reference. Once a sourcing request is fulfilled, customers can rate the agent\'s service.',
    ],
  },
  // Fleet Management
  {
    id: 'adding-vehicles',
    title: 'Adding Vehicles',
    category: 'fleet-management',
    icon: <Truck className="h-5 w-5" />,
    lastUpdated: '2025-01-30',
    content: [
      'To add a vehicle to your fleet on SwiftFreight, navigate to Fleet > Vehicles and click "Add Vehicle." You will need to enter the vehicle\'s registration plate number, make, model, year, color, and type (motorcycle, van, truck, trailer, or pickup). The system uses the plate number as the primary identifier, so ensure it is entered correctly.',
      'Additional details include the vehicle\'s fuel type (petrol, diesel, electric, or hybrid), cargo capacity in kilograms, current mileage, and insurance expiry date. You can also upload photos of the vehicle and attach copies of the registration certificate and roadworthiness certificate. These documents are important for compliance tracking and can be set to trigger renewal reminders.',
      'After adding a vehicle, it appears in your fleet list with a status of "Available." You can assign a driver to the vehicle, which will automatically update the driver\'s profile as well. Vehicles can be assigned to different delivery zones or routes. The fleet manager can view vehicle utilization rates, maintenance history, and cost-per-kilometer metrics for each vehicle in the fleet.',
    ],
  },
  {
    id: 'maintenance-scheduling',
    title: 'Maintenance Scheduling',
    category: 'fleet-management',
    icon: <Wrench className="h-5 w-5" />,
    lastUpdated: '2025-02-02',
    content: [
      'Regular vehicle maintenance is essential for a reliable logistics operation. SwiftFreight\'s maintenance scheduling feature helps fleet managers stay on top of service intervals, repairs, and inspections. You can create maintenance schedules based on mileage intervals (e.g., every 10,000 km) or time intervals (e.g., every 3 months).',
      'To schedule maintenance, go to Fleet > Maintenance and click "Schedule Service." Select the vehicle, choose the service type (oil change, tire rotation, brake inspection, full service, etc.), set the date or mileage threshold, and assign a preferred service provider. The system will send automatic reminders to the fleet manager and assigned driver as the service date approaches.',
      'The maintenance history for each vehicle is tracked in a timeline view, showing all past services, repairs, and associated costs. This data feeds into fleet analytics, allowing you to calculate total cost of ownership, compare maintenance costs across vehicles, and identify vehicles that may need replacement. You can also track warranty information and recall notices for each vehicle in your fleet.',
    ],
  },
  // Safety & Compliance
  {
    id: 'package-declaration',
    title: 'Package Declaration Requirements',
    category: 'safety-compliance',
    icon: <FileText className="h-5 w-5" />,
    lastUpdated: '2025-02-14',
    content: [
      'All packages shipped through SwiftFreight require a proper declaration. This is both a legal requirement and a safety measure. When creating a delivery request, you must accurately describe the contents of your package, including the type of goods, quantity, and estimated value. For cross-border shipments, additional customs declarations are required.',
      'Lesotho Customs and the South African Revenue Service (SARS) require specific documentation for goods crossing the border. This includes a commercial invoice (for commercial goods), a packing list, and proof of payment. SwiftFreight generates these documents automatically based on the information you provide, but it is your responsibility to ensure all details are accurate.',
      'Incorrect or incomplete declarations can result in delays at the border, fines, or seizure of goods. Prohibited items will be flagged by the system during the declaration process. We strongly recommend that customers familiarize themselves with the list of restricted and prohibited items before shipping. If you are unsure whether an item requires special documentation, contact our support team for guidance.',
    ],
  },
  {
    id: 'what-can-ship',
    title: 'What You Can and Cannot Ship',
    category: 'safety-compliance',
    icon: <Shield className="h-5 w-5" />,
    lastUpdated: '2025-02-11',
    content: [
      'SwiftFreight handles a wide range of goods, but there are restrictions on certain items for safety and legal reasons. Permitted items include documents, clothing, electronics (with proper packaging), household goods, building materials, and non-perishable food items. All items must be properly packaged and declared.',
      'Prohibited items include: illegal substances, weapons and ammunition, explosives, flammable materials, perishable food (without proper cold chain), live animals, counterfeit goods, and any item that violates Lesotho or South African law. Additionally, some items require special handling or permits, such as pharmaceuticals, chemicals, and certain electronics with lithium batteries.',
      'If you attempt to ship a prohibited item, your delivery will be rejected and you may be subject to penalties. For items that require special permits, ensure you have the necessary documentation before creating a delivery request. When in doubt, contact our compliance team who can advise you on the requirements for your specific shipment.',
    ],
  },
  {
    id: 'reporting-incidents',
    title: 'Reporting Incidents',
    category: 'safety-compliance',
    icon: <BarChart3 className="h-5 w-5" />,
    lastUpdated: '2025-01-19',
    content: [
      'In the logistics industry, incidents can range from minor delays to serious accidents. SwiftFreight provides a structured incident reporting system to ensure all events are properly documented and resolved. If you are a driver involved in an incident (accident, vehicle breakdown, theft, or damage to goods), you must report it immediately through the app.',
      'To report an incident, go to the affected delivery and tap "Report Incident." Select the incident type, provide a detailed description, and upload photos if available. The report is immediately sent to your operations manager and dispatcher. For serious incidents (accidents, injuries), also call the emergency services and your company\'s safety officer.',
      'All incident reports are tracked in the system and contribute to safety analytics. Operations managers can view incident trends, identify high-risk routes or times, and implement preventive measures. Incident reports also serve as official documentation for insurance claims. Drivers who report incidents promptly and accurately contribute to a safer logistics ecosystem for everyone.',
    ],
  },
  {
    id: 'kyc-verification',
    title: 'KYC Verification Levels',
    category: 'safety-compliance',
    icon: <Lock className="h-5 w-5" />,
    lastUpdated: '2025-02-15',
    content: [
      'Know Your Customer (KYC) verification is a regulatory requirement for logistics companies operating in Lesotho. SwiftFreight implements a tiered KYC system with three levels: Basic, Standard, and Enhanced. All users start at the Basic level, which requires a valid email address and phone number.',
      'Standard verification requires uploading a government-issued ID (Lesotho ID card, passport, or driver\'s license) and proof of address (utility bill or bank statement not older than 3 months). This level is required for customers who wish to send parcels valued above M500 or make cross-border shipments. Drivers and company staff must complete Standard verification before they can accept deliveries.',
      'Enhanced verification is required for high-volume shippers and business accounts. This includes all Standard requirements plus a Lesotho Revenue Authority tax clearance certificate, business registration documents (for companies), and a physical address verification visit. Enhanced-verified accounts enjoy higher transaction limits, priority support, and access to premium features.',
    ],
  },
  // Billing & Pricing
  {
    id: 'understanding-invoice',
    title: 'Understanding Your Invoice',
    category: 'billing-pricing',
    icon: <DollarSign className="h-5 w-5" />,
    lastUpdated: '2025-02-07',
    content: [
      'SwiftFreight generates invoices automatically for every completed delivery. Your invoice includes a breakdown of all charges: the base delivery fee (calculated by distance and weight), priority surcharge (for Express or Urgent deliveries), insurance premium (if applicable), and any additional services such as warehouse storage or special handling.',
      'Invoices are available in PDF format from the Invoices section of your dashboard. Each invoice has a unique invoice number, the delivery tracking number, pickup and delivery addresses, a detailed charge breakdown, applicable taxes (VAT at 15%), and the total amount due. Payment is typically due within 7 days for standard accounts and 30 days for enterprise accounts with approved credit terms.',
      'For cross-border deliveries, your invoice may include separate line items for customs duties, border processing fees, and any storage fees incurred during customs clearance. If you believe an invoice is incorrect, you can dispute it within 14 days of issue by contacting our billing team through the in-app messaging system. All disputes are investigated within 3 business days.',
    ],
  },
  {
    id: 'pricing-plans',
    title: 'Pricing Plans',
    category: 'billing-pricing',
    icon: <BarChart3 className="h-5 w-5" />,
    lastUpdated: '2025-02-09',
    content: [
      'SwiftFreight offers three subscription plans designed to scale with your business. The Starter plan (M299/month) is ideal for small operators and includes up to 5 team members, 50 deliveries per month, basic analytics, and email support. It is perfect for individual drivers or small courier services just getting started.',
      'The Professional plan (M799/month) is our most popular option, designed for growing logistics companies. It includes up to 20 team members, 500 deliveries per month, advanced analytics and reporting, priority support, and access to the sourcing module. Fleet management features, including maintenance scheduling and vehicle tracking, are also included.',
      'The Enterprise plan (M1,999/month) is built for large operations with unlimited team members, unlimited deliveries, dedicated account management, custom integrations, API access, and white-label options. Enterprise customers also get access to the warehouse management module, advanced route optimization, and SLA-backed support with a guaranteed 1-hour response time.',
    ],
  },
  // Account & Security
  {
    id: 'two-factor-auth',
    title: 'Two-Factor Authentication',
    category: 'account-security',
    icon: <Lock className="h-5 w-5" />,
    lastUpdated: '2025-02-13',
    content: [
      'Two-Factor Authentication (2FA) adds an extra layer of security to your SwiftFreight account. When enabled, you will need to enter a verification code from your authenticator app (such as Google Authenticator or Authy) in addition to your password when logging in. This prevents unauthorized access even if someone obtains your password.',
      'To enable 2FA, go to Settings > Security > Two-Factor Authentication and click "Enable." Scan the QR code with your authenticator app and enter the 6-digit code to confirm setup. You will also receive backup codes — store these in a safe place as they can be used to access your account if you lose your authenticator device.',
      'We strongly recommend enabling 2FA for all accounts, especially for company owners, operations managers, and anyone with administrative access. Drivers and dispatchers who access the system from shared devices should also use 2FA. If you lose access to your authenticator, contact support with your backup codes or verify your identity through our account recovery process.',
    ],
  },
  {
    id: 'managing-users',
    title: 'Managing Users',
    category: 'account-security',
    icon: <Users className="h-5 w-5" />,
    lastUpdated: '2025-02-04',
    content: [
      'Company owners and administrators can manage all users within their organization from Settings > Users. From this section, you can invite new team members by entering their email address and assigning a role. Each role (Operations Manager, Dispatcher, Fleet Manager, Driver, etc.) comes with predefined permissions that control what the user can see and do.',
      'The user management panel displays all team members with their status (Active, Invited, or Deactivated), role, and last login time. You can edit a user\'s role, reset their password, or deactivate their account if they leave the organization. Deactivated users retain their historical data but cannot log in or perform any actions.',
      'For larger organizations, SwiftFreight supports team-based user groups. For example, you can create a "Maseru Dispatch Team" group and assign specific users to it, then configure permissions and notification settings at the group level. This simplifies management when you have multiple teams operating in different districts or with different responsibilities.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function KnowledgeBasePage() {
  const { setView } = useNavStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    let articles = ARTICLES;

    if (selectedCategory !== 'all') {
      articles = articles.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.content.some((p) => p.toLowerCase().includes(query))
      );
    }

    return articles;
  }, [selectedCategory, searchQuery]);

  const activeArticle = selectedArticle
    ? ARTICLES.find((a) => a.id === selectedArticle)
    : null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b" style={{ borderColor: '#E0E0E0' }}>
        <button
          onClick={() => {
            if (activeArticle) {
              setSelectedArticle(null);
            } else {
              setView('marketing');
            }
          }}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70"
          style={{ color: '#fd7714' }}
        >
          <ChevronLeft className="h-4 w-4" />
          {activeArticle ? 'Back to Articles' : 'Back to Home'}
        </button>
        <h1 className="text-lg font-bold hidden sm:block" style={{ color: '#212121' }}>
          Knowledge Base
        </h1>
        <Button
          size="sm"
          className="font-medium"
          style={{ background: '#fd7714', color: '#FFFFFF' }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Article
        </Button>
      </header>

      {/* Search Bar */}
      {!activeArticle && (
        <div className="px-4 sm:px-6 py-4 border-b" style={{ borderColor: '#E0E0E0', background: '#F5F5F5' }}>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#757575' }} />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              style={{ borderColor: '#E0E0E0' }}
            />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar */}
        {!activeArticle && (
          <aside
            className="w-full lg:w-64 xl:w-72 border-b lg:border-b-0 lg:border-r p-4 lg:p-6 overflow-y-auto"
            style={{ borderColor: '#E0E0E0' }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#757575' }}>
              Categories
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: selectedCategory === 'all' ? '#fff3e8' : 'transparent',
                  color: selectedCategory === 'all' ? '#fd7714' : '#212121',
                }}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  All Articles
                </span>
                <span className="text-xs" style={{ color: '#757575' }}>{ARTICLES.length}</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: selectedCategory === cat.id ? '#fff3e8' : 'transparent',
                    color: selectedCategory === cat.id ? '#fd7714' : '#212121',
                  }}
                >
                  <span className="flex items-center gap-2">
                    {cat.icon}
                    {cat.label}
                  </span>
                  <span className="text-xs" style={{ color: '#757575' }}>{cat.count}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeArticle ? (
              <motion.div
                key="article-detail"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl mx-auto"
              >
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-1 text-sm font-medium mb-6 hover:opacity-70"
                  style={{ color: '#fd7714' }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to articles
                </button>

                <Badge
                  className="text-xs font-medium px-3 py-1 mb-4"
                  style={{ background: '#fff3e8', color: '#fd7714' }}
                >
                  {CATEGORIES.find((c) => c.id === activeArticle.category)?.label}
                </Badge>

                <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#212121' }}>
                  {activeArticle.title}
                </h1>

                <div className="flex items-center gap-2 mb-8">
                  <Calendar className="h-4 w-4" style={{ color: '#757575' }} />
                  <span className="text-xs" style={{ color: '#757575' }}>
                    Last updated: {activeArticle.lastUpdated}
                  </span>
                </div>

                <div className="space-y-5">
                  {activeArticle.content.map((paragraph, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: '#424242' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t" style={{ borderColor: '#E0E0E0' }}>
                  <p className="text-xs" style={{ color: '#757575' }}>
                    Was this article helpful? Contact our support team if you need further assistance.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="article-list"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl mx-auto"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-bold" style={{ color: '#212121' }}>
                    {selectedCategory === 'all'
                      ? 'All Articles'
                      : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#757575' }}>
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="h-12 w-12 mx-auto mb-4" style={{ color: '#E0E0E0' }} />
                    <p className="text-sm font-medium" style={{ color: '#757575' }}>
                      No articles found matching your search.
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#9E9E9E' }}>
                      Try a different search term or browse categories.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        style={{ background: '#F5F5F5' }}
                        onClick={() => setSelectedArticle(article.id)}
                      >
                        <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                          <div
                            className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                            style={{ background: '#fff3e8' }}
                          >
                            <span style={{ color: '#fd7714' }}>{article.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold mb-1" style={{ color: '#212121' }}>
                              {article.title}
                            </h3>
                            <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: '#757575' }}>
                              {article.content[0]}
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge
                                className="text-xs px-2 py-0.5"
                                style={{ background: '#fff3e8', color: '#fd7714' }}
                              >
                                {CATEGORIES.find((c) => c.id === article.category)?.label}
                              </Badge>
                              <span className="text-xs" style={{ color: '#9E9E9E' }}>
                                {article.lastUpdated}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 mt-1" style={{ color: '#E0E0E0' }} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}