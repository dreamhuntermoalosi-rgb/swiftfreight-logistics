// SwiftFreight Type Definitions

// ============ ROLES & AUTH ============
export type UserRole =
  | 'super_admin'
  | 'company_owner'
  | 'operations_manager'
  | 'dispatcher'
  | 'fleet_manager'
  | 'driver'
  | 'customer'
  | 'sourcing_agent'
  | 'trailer_owner'
  | 'warehouse_partner';

export type CompanyPlan = 'starter' | 'professional' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  companyId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: CompanyPlan;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isActive: boolean;
  maxUsers: number;
  createdAt: string;
}

// ============ DELIVERY ============
export type DeliveryStatus =
  | 'request_received'
  | 'awaiting_quote'
  | 'quote_accepted'
  | 'collected'
  | 'at_warehouse'
  | 'in_transit'
  | 'at_border'
  | 'out_for_delivery'
  | 'delivered'
  | 'returned'
  | 'cancelled';

export type DeliveryPriority = 'standard' | 'express' | 'urgent';

export interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface Delivery {
  id: string;
  trackingNumber: string;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  customerId: string;
  customerName: string;
  companyId: string;
  companyName: string;
  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehiclePlate?: string;
  pickup: DeliveryAddress;
  destination: DeliveryAddress;
  packageDescription: string;
  packageWeight: number;
  packageDimensions?: string;
  declaredValue?: number;
  quotedAmount?: number;
  paidAmount?: number;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  notes?: string;
}

export interface DeliveryTimeline {
  id: string;
  deliveryId: string;
  status: DeliveryStatus;
  timestamp: string;
  location: string;
  description: string;
  performedBy?: string;
}

export interface ProofOfDelivery {
  id: string;
  deliveryId: string;
  signatureData?: string;
  photoUrls: string[];
  recipientName: string;
  recipientPhone: string;
  notes?: string;
  timestamp: string;
}

// ============ VEHICLES ============
export type VehicleType = 'motorcycle' | 'van' | 'truck' | 'trailer' | 'pickup';
export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';

export interface Vehicle {
  id: string;
  companyId: string;
  plateNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color: string;
  status: VehicleStatus;
  fuelType: FuelType;
  capacity: number;
  currentMileage: number;
  insuranceExpiry?: string;
  licenseExpiry?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  createdAt: string;
}

// ============ DRIVERS ============
export type DriverStatus = 'available' | 'on_trip' | 'off_duty' | 'suspended';

export interface Driver {
  id: string;
  userId: string;
  companyId: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  licenseNumber: string;
  licenseExpiry?: string;
  status: DriverStatus;
  rating: number;
  totalDeliveries: number;
  successfulDeliveries: number;
  currentVehicleId?: string;
  currentVehiclePlate?: string;
  location?: string;
  joinedAt: string;
}

// ============ CUSTOMERS ============
export interface Customer {
  id: string;
  userId: string;
  companyId?: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address: string;
  city: string;
  country: string;
  totalShipments: number;
  totalSpent: number;
  rating: number;
  joinedAt: string;
}

// ============ SOURCING ============
export type SourcingStatus = 'pending' | 'quoted' | 'accepted' | 'purchased' | 'delivered' | 'cancelled';

export interface SourcingRequest {
  id: string;
  customerId: string;
  customerName: string;
  productName: string;
  description?: string;
  imageUrl?: string;
  storeName?: string;
  productLink?: string;
  budget?: number;
  deadline?: string;
  location: string;
  status: SourcingStatus;
  agentId?: string;
  agentName?: string;
  quotedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

// ============ MESSAGES ============
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  deliveryId?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// ============ NOTIFICATIONS ============
export type NotificationType = 'delivery_update' | 'new_message' | 'quote_received' | 'payment' | 'system' | 'alert';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ============ ANALYTICS ============
export interface AnalyticsData {
  totalRevenue: number;
  revenueGrowth: number;
  totalDeliveries: number;
  deliveriesGrowth: number;
  onTimeRate: number;
  onTimeGrowth: number;
  avgRating: number;
  avgRatingGrowth: number;
  activeDrivers: number;
  totalCustomers: number;
  customersGrowth: number;
  revenueByMonth: { month: string; revenue: number; deliveries: number }[];
  deliveriesByStatus: { status: string; count: number }[];
  topRoutes: { route: string; count: number; revenue: number }[];
  driverPerformance: { name: string; deliveries: number; rating: number; onTime: number }[];
  fleetUtilization: { type: string; total: number; available: number; inUse: number; maintenance: number }[];
}

// ============ APP STATE ============
export type AppView = 'marketing' | 'login' | 'register' | 'forgot-password' | 'dashboard' | 'onboarding' | 'knowledge-base' | 'feature-requests' | 'training';
export type DashboardTab =
  | 'overview'
  | 'deliveries'
  | 'tracking'
  | 'customers'
  | 'drivers'
  | 'fleet'
  | 'dispatch'
  | 'sourcing'
  | 'messages'
  | 'reports'
  | 'invoices'
  | 'warehouse'
  | 'quotations'
  | 'notifications'
  | 'settings'
  | 'safety'
  | 'chain-of-custody';

export interface Quotation {
  id: string;
  deliveryId: string;
  amount: number;
  currency: string;
  estimatedDays: number;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
}

export interface Invoice {
  id: string;
  deliveryId: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  createdAt: string;
}

// ============ PACKAGE DECLARATION ============
export interface PackageDeclaration {
  id: string;
  deliveryId: string;
  packageCategory: string;
  description: string;
  estimatedValue: number;
  weight: number;
  dimensions?: string;
  isDangerousGoods: boolean;
  isFragile: boolean;
  isElectronics: boolean;
  isLiquids: boolean;
  isDocuments: boolean;
  parcelPhotos?: string[];
  declarationText: string;
  acceptedAt: string;
}

// ============ CHAIN OF CUSTODY ============
export interface ChainOfCustodyEntry {
  id: string;
  deliveryId: string;
  fromParty: string;
  toParty: string;
  fromName: string;
  toName: string;
  gpsLocation?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  signatureUrl?: string;
  notes?: string;
  timestamp: string;
}

// ============ INCIDENT REPORT ============
export interface IncidentReport {
  id: string;
  deliveryId?: string;
  reporterId: string;
  reporterName: string;
  reporterRole: 'driver' | 'customer';
  incidentType: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}