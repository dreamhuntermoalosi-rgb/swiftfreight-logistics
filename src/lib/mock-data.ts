import type {
  User, Company, Delivery, Driver, Customer, Vehicle, Notification,
  Message, SourcingRequest, DeliveryTimeline, AnalyticsData, Invoice, Quotation
} from './types';

// ============ HELPER FUNCTIONS ============
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
const futureDate = (d: number) => new Date(Date.now() + d * 86400000).toISOString().split('T')[0];
const pastDate = (d: number) => new Date(Date.now() - d * 86400000).toISOString().split('T')[0];

// ============ LESOTHO DATA ============
const lesothoCities = [
  'Maseru', 'Mafeteng', 'Mohales Hoek', 'Quthing', 'Butha Buthe',
  'Leribe', 'Berea', 'Mokhotlong', 'Thaba Tseka', 'Qacha\'s Nek',
];
const saCities = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Bloemfontein', 'Port Elizabeth', 'Polokwane'];
const streets = [
  'Kingsway Road', 'Main Street', 'Airport Road', 'Pioneer Road', 'Moshoeshoe Road',
  'Constitution Road', 'Victory Road', 'Independence Avenue', 'Matsieng Road', 'Semonkong Road',
];

const deliveryStatuses = ['request_received', 'awaiting_quote', 'quote_accepted', 'collected', 'at_warehouse', 'in_transit', 'at_border', 'out_for_delivery', 'delivered', 'returned', 'cancelled'] as const;
const weights = [0.5, 1, 2, 3, 5, 8, 10, 15, 20, 25, 50, 100];
const priorities = ['standard', 'express', 'urgent'] as const;
const vehicleTypes = ['van', 'truck', 'pickup'] as const;

const productNames = [
  'Samsung Galaxy S24', 'iPhone 15 Pro', 'Dell Laptop', 'Solar Panel', 'Water Pump',
  'Agricultural Seeds', 'Fertilizer 50kg', 'Cement 50kg Bags', 'Steel Rebar', 'PVC Pipes',
  'Electrical Wire', 'LED Lights', 'Power Tools', 'Medical Supplies', 'School Textbooks',
];

// ============ COMPANIES ============
export const companies: Company[] = [
  {
    id: 'comp-001', name: 'Mountain Express', slug: 'mountain-express', plan: 'enterprise',
    email: 'info@mountainexpress.co.ls', phone: '+266 2231 0001',
    address: '12 Kingsway Road', city: 'Maseru', country: 'Lesotho',
    isActive: true, maxUsers: 200, createdAt: daysAgo(730),
  },
  {
    id: 'comp-002', name: 'Lesotho Swift Logistics', slug: 'lesotho-swift', plan: 'professional',
    email: 'ops@lesothoswift.co.ls', phone: '+266 2231 0002',
    address: '45 Pioneer Road', city: 'Maseru', country: 'Lesotho',
    isActive: true, maxUsers: 50, createdAt: daysAgo(540),
  },
];

// ============ USERS (DEMO ACCOUNTS) ============
export const demoUsers: User[] = [
  { id: 'user-sa', email: 'admin@swiftfreight.com', name: 'SwiftFreight Admin', role: 'super_admin', isActive: true, createdAt: daysAgo(730) },
  { id: 'user-co1', email: 'thabo@mountainexpress.co.ls', name: 'Thabo Mokoena', role: 'company_owner', companyId: 'comp-001', isActive: true, createdAt: daysAgo(730) },
  { id: 'user-om1', email: 'mpheleki@mountainexpress.co.ls', name: 'Mpho Letsie', role: 'operations_manager', companyId: 'comp-001', isActive: true, createdAt: daysAgo(700) },
  { id: 'user-di1', email: 'kmosotho@mountainexpress.co.ls', name: 'Keketso Mohale', role: 'dispatcher', companyId: 'comp-001', isActive: true, createdAt: daysAgo(600) },
  { id: 'user-fm1', email: 'tnkoe@mountainexpress.co.ls', name: 'Tumelo Nkoe', role: 'fleet_manager', companyId: 'comp-001', isActive: true, createdAt: daysAgo(650) },
  { id: 'drv-001', email: 'lmosotho@mountainexpress.co.ls', name: 'Lebo Mosotho', role: 'driver', companyId: 'comp-001', isActive: true, createdAt: daysAgo(500) },
  { id: 'cust-0006', email: 'mampho@email.co.ls', name: 'Mmathapelo Mphatsoe', role: 'customer', isActive: true, createdAt: daysAgo(300) },
  { id: 'cust-0007', email: 'teboho@email.co.ls', name: 'Teboho Tlalane', role: 'customer', isActive: true, createdAt: daysAgo(200) },
  { id: 'user-src1', email: 'palesa@sourcing.ls', name: 'Palesa Moahloli', role: 'sourcing_agent', companyId: 'comp-001', isActive: true, createdAt: daysAgo(400) },
  { id: 'user-wh1', email: 'warehouse@highlandhaulage.co.ls', name: 'Mokhethi Makhetha', role: 'warehouse_partner', companyId: 'comp-001', isActive: true, createdAt: daysAgo(250) },
];

// ============ CUSTOMERS (20) ============
const customerData: { name: string; city: string }[] = [
  { name: 'Mmathapelo Mphatsoe', city: 'Maseru' },
  { name: 'Teboho Tlalane', city: 'Mafeteng' },
  { name: 'Palesa Moahloli', city: 'Maseru' },
  { name: 'Mokhethi Makhetha', city: 'Leribe' },
  { name: 'Tsepang Makhaola', city: 'Butha Buthe' },
  { name: 'Malerato Phakoe', city: 'Maseru' },
  { name: 'Mosiuoa Tsiame', city: 'Mohales Hoek' },
  { name: 'Rethabile Nthinya', city: 'Quthing' },
  { name: 'Thato Mosweu', city: 'Berea' },
  { name: 'Kamohelo Mabote', city: 'Maseru' },
  { name: 'Lineo Molise', city: 'Mokhotlong' },
  { name: 'Kopano Tjiane', city: 'Thaba Tseka' },
  { name: 'Tšepo Makhakhe', city: 'Maseru' },
  { name: 'Mamello Sekhoko', city: 'Qacha\'s Nek' },
  { name: 'Nthabiseng Moletsane', city: 'Mafeteng' },
  { name: 'Thabiso Mokone', city: 'Leribe' },
  { name: 'Mphatsoe Fako', city: 'Maseru' },
  { name: 'Lehlohonolo Molia', city: 'Berea' },
  { name: 'Bokang Mosotho', city: 'Maseru' },
  { name: 'Rapelang Mokhosi', city: 'Mohales Hoek' },
];

export const customers: Customer[] = customerData.map((c, i) => ({
  id: `cust-${String(i + 1).padStart(4, '0')}`,
  userId: `user-cust-${i}`,
  name: c.name,
  email: c.name.toLowerCase().replace(/\s|'/g, '.') + '@email.co.ls',
  phone: `+266 ${rand(2000, 7999)} ${rand(1000, 9999)}`,
  address: `${rand(1, 200)} ${pick(streets)}`,
  city: c.city,
  country: 'Lesotho',
  totalShipments: rand(1, 12),
  totalSpent: rand(200, 8500),
  rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
  joinedAt: daysAgo(rand(30, 400)),
}));

// ============ VEHICLES (10) ============
export const vehicles: Vehicle[] = [
  { id: 'veh-0001', companyId: 'comp-001', plateNumber: 'LP 342 AB 567', type: 'truck', make: 'Toyota', model: 'Hilux', year: 2022, color: 'White', status: 'in_use', fuelType: 'diesel', capacity: 5000, currentMileage: 85000, insuranceExpiry: futureDate(180), licenseExpiry: futureDate(240), lastServiceDate: pastDate(15), nextServiceDate: futureDate(45), createdAt: daysAgo(500) },
  { id: 'veh-0002', companyId: 'comp-001', plateNumber: 'LP 567 CD 890', type: 'van', make: 'VW', model: 'Crafter', year: 2023, color: 'Silver', status: 'in_use', fuelType: 'diesel', capacity: 2000, currentMileage: 45000, insuranceExpiry: futureDate(200), licenseExpiry: futureDate(300), lastServiceDate: pastDate(10), nextServiceDate: futureDate(60), createdAt: daysAgo(400) },
  { id: 'veh-0003', companyId: 'comp-001', plateNumber: 'LP 123 EF 456', type: 'pickup', make: 'Toyota', model: 'Hilux', year: 2021, color: 'Black', status: 'available', fuelType: 'diesel', capacity: 1000, currentMileage: 120000, insuranceExpiry: futureDate(90), licenseExpiry: futureDate(180), lastServiceDate: pastDate(5), nextServiceDate: futureDate(30), createdAt: daysAgo(600) },
  { id: 'veh-0004', companyId: 'comp-001', plateNumber: 'LP 789 GH 123', type: 'truck', make: 'Isuzu', model: 'NPR', year: 2020, color: 'White', status: 'maintenance', fuelType: 'diesel', capacity: 8000, currentMileage: 200000, insuranceExpiry: futureDate(60), licenseExpiry: futureDate(120), lastServiceDate: pastDate(2), nextServiceDate: pastDate(-5), createdAt: daysAgo(700) },
  { id: 'veh-0005', companyId: 'comp-001', plateNumber: 'LP 234 IJ 789', type: 'van', make: 'Mercedes', model: 'Sprinter', year: 2023, color: 'White', status: 'in_use', fuelType: 'diesel', capacity: 2500, currentMileage: 35000, insuranceExpiry: futureDate(250), licenseExpiry: futureDate(350), lastServiceDate: pastDate(20), nextServiceDate: futureDate(70), createdAt: daysAgo(300) },
  { id: 'veh-0006', companyId: 'comp-002', plateNumber: 'LP 456 KL 234', type: 'truck', make: 'Hino', model: 'Dutro', year: 2022, color: 'Blue', status: 'available', fuelType: 'diesel', capacity: 10000, currentMileage: 95000, insuranceExpiry: futureDate(150), licenseExpiry: futureDate(200), lastServiceDate: pastDate(12), nextServiceDate: futureDate(50), createdAt: daysAgo(450) },
  { id: 'veh-0007', companyId: 'comp-002', plateNumber: 'LP 678 MN 567', type: 'pickup', make: 'Ford', model: 'Ranger', year: 2021, color: 'Grey', status: 'in_use', fuelType: 'diesel', capacity: 800, currentMileage: 110000, insuranceExpiry: futureDate(100), licenseExpiry: futureDate(160), lastServiceDate: pastDate(8), nextServiceDate: futureDate(40), createdAt: daysAgo(500) },
  { id: 'veh-0008', companyId: 'comp-001', plateNumber: 'LP 890 OP 890', type: 'van', make: 'Nissan', model: 'NV350', year: 2024, color: 'White', status: 'available', fuelType: 'diesel', capacity: 1500, currentMileage: 12000, insuranceExpiry: futureDate(365), licenseExpiry: futureDate(365), lastServiceDate: pastDate(30), nextServiceDate: futureDate(90), createdAt: daysAgo(120) },
  { id: 'veh-0009', companyId: 'comp-001', plateNumber: 'LP 321 QR 321', type: 'truck', make: 'Mitsubishi', model: 'Canter', year: 2023, color: 'White', status: 'available', fuelType: 'diesel', capacity: 6000, currentMileage: 55000, insuranceExpiry: futureDate(220), licenseExpiry: futureDate(280), lastServiceDate: pastDate(18), nextServiceDate: futureDate(55), createdAt: daysAgo(350) },
  { id: 'veh-0010', companyId: 'comp-002', plateNumber: 'LP 654 ST 654', type: 'van', make: 'VW', model: 'Caddy', year: 2022, color: 'Silver', status: 'maintenance', fuelType: 'petrol', capacity: 800, currentMileage: 78000, insuranceExpiry: futureDate(45), licenseExpiry: futureDate(90), lastServiceDate: pastDate(1), nextServiceDate: pastDate(-3), createdAt: daysAgo(480) },
];

// ============ DRIVERS (12) ============
const driverData: { name: string; companyId: string; status: Driver['status']; vehicleId?: string; location?: string }[] = [
  { name: 'Lebo Mosotho', companyId: 'comp-001', status: 'on_trip', vehicleId: 'veh-0001', location: 'Maseru' },
  { name: 'Keketso Mohale', companyId: 'comp-001', status: 'on_trip', vehicleId: 'veh-0002', location: 'Butha Buthe' },
  { name: 'Tumelo Nkoe', companyId: 'comp-001', status: 'on_trip', vehicleId: 'veh-0005', location: 'Mafeteng' },
  { name: 'Malerato Phakoe', companyId: 'comp-001', status: 'available' },
  { name: 'Mosiuoa Tsiame', companyId: 'comp-001', status: 'on_trip', vehicleId: 'veh-0008', location: 'Leribe' },
  { name: 'Tsepang Makhaola', companyId: 'comp-001', status: 'off_duty' },
  { name: 'Lineo Molise', companyId: 'comp-001', status: 'available' },
  { name: 'Rapelang Makhakhe', companyId: 'comp-002', status: 'on_trip', vehicleId: 'veh-0007', location: 'Mohales Hoek' },
  { name: 'Mamello Sekhoko', companyId: 'comp-002', status: 'available' },
  { name: 'Nthabiseng Moletsane', companyId: 'comp-001', status: 'available' },
  { name: 'Thabiso Mokone', companyId: 'comp-002', status: 'on_trip', vehicleId: 'veh-0006', location: 'Quthing' },
  { name: 'Bokang Mosotho', companyId: 'comp-001', status: 'off_duty' },
];

export const drivers: Driver[] = driverData.map((d, i) => {
  const totalDel = rand(15, 120);
  return {
    id: `drv-${String(i + 1).padStart(3, '0')}`,
    userId: `user-drv-${i}`,
    companyId: d.companyId,
    name: d.name,
    phone: `+266 ${rand(2000, 7999)} ${rand(1000, 9999)}`,
    email: d.name.toLowerCase().replace(/\s/g, '.') + '@driver.co.ls',
    licenseNumber: `LD${rand(100000, 999999)}`,
    licenseExpiry: futureDate(rand(60, 730)),
    status: d.status,
    rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
    totalDeliveries: totalDel,
    successfulDeliveries: Math.floor(totalDel * (0.88 + Math.random() * 0.11)),
    currentVehicleId: d.vehicleId,
    currentVehiclePlate: d.vehicleId ? vehicles.find(v => v.id === d.vehicleId)?.plateNumber : undefined,
    location: d.location,
    joinedAt: daysAgo(rand(60, 500)),
  };
});

// ============ DELIVERIES (25 random + demo) ============
const statusWeights: [string, number][] = [
  ['delivered', 0.35], ['in_transit', 0.18], ['collected', 0.10], ['at_warehouse', 0.08],
  ['quote_accepted', 0.08], ['out_for_delivery', 0.08], ['awaiting_quote', 0.05],
  ['at_border', 0.04], ['request_received', 0.02], ['cancelled', 0.02],
];

function getWeightedStatus(): Delivery['status'] {
  let r = Math.random(), cum = 0;
  for (const [status, weight] of statusWeights) {
    cum += weight;
    if (r <= cum) return status as Delivery['status'];
  }
  return 'request_received';
}

export const deliveries: Delivery[] = [];
for (let i = 0; i < 25; i++) {
  const status = getWeightedStatus();
  const company = pick(companies);
  const customer = pick(customers);
  const driver = pick(drivers.filter(d => d.companyId === company.id));
  const vehicle = pick(vehicles.filter(v => v.companyId === company.id));
  const isFromSA = Math.random() > 0.3;
  const fromCity = isFromSA ? pick(saCities) : pick(lesothoCities);
  const toCity = pick(lesothoCities.filter(c => c !== fromCity));
  const priority = pick(priorities);
  const weight = pick(weights);
  const amount = Math.round((weight * (priority === 'urgent' ? 25 : priority === 'express' ? 18 : 12) + rand(20, 150)));
  const createdAtDays = rand(0, 60);

  deliveries.push({
    id: `del-${String(i + 1).padStart(5, '0')}`,
    trackingNumber: `SF${String(2025000001 + i)}LS`,
    status,
    priority,
    customerId: customer.id,
    customerName: customer.name,
    companyId: company.id,
    companyName: company.name,
    driverId: !['request_received', 'awaiting_quote'].includes(status) ? driver.id : undefined,
    driverName: !['request_received', 'awaiting_quote'].includes(status) ? driver.name : undefined,
    vehicleId: !['request_received', 'awaiting_quote', 'quote_accepted'].includes(status) ? vehicle.id : undefined,
    vehiclePlate: !['request_received', 'awaiting_quote', 'quote_accepted'].includes(status) ? vehicle.plateNumber : undefined,
    pickup: { name: customer.name, phone: customer.phone, address: `${rand(1, 200)} ${pick(streets)}`, city: fromCity, country: isFromSA ? 'South Africa' : 'Lesotho' },
    destination: { name: customer.name, phone: customer.phone, address: `${rand(1, 200)} ${pick(streets)}`, city: toCity, country: 'Lesotho' },
    packageDescription: pick(productNames) + (Math.random() > 0.6 ? ` x${rand(2, 5)}` : ''),
    packageWeight: weight,
    quotedAmount: amount,
    paidAmount: !['request_received', 'awaiting_quote'].includes(status) ? amount : undefined,
    estimatedDelivery: futureDate(rand(1, 10)),
    actualDelivery: status === 'delivered' ? pastDate(rand(0, 3)) : undefined,
    createdAt: daysAgo(createdAtDays),
    updatedAt: hoursAgo(rand(1, createdAtDays * 24)),
    rating: status === 'delivered' ? (Math.random() > 0.25 ? Number((3.5 + Math.random() * 1.5).toFixed(1)) : undefined) : undefined,
  });
}

// ============ GUARANTEED DEMO DELIVERIES ============
const demoDeliveries: Delivery[] = [
  { id: 'del-demo-c1', trackingNumber: 'SF2025000501LS', status: 'delivered', priority: 'standard', customerId: 'cust-0001', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '45 Pioneer Road', city: 'Johannesburg', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '12 Kingsway Road', city: 'Maseru', country: 'Lesotho' }, packageDescription: 'Samsung Galaxy S24 x2', packageWeight: 0.8, quotedAmount: 350, paidAmount: 350, estimatedDelivery: pastDate(3), actualDelivery: pastDate(2), createdAt: daysAgo(5), updatedAt: hoursAgo(48), rating: 4.8 },
  { id: 'del-demo-c2', trackingNumber: 'SF2025000502LS', status: 'in_transit', priority: 'express', customerId: 'cust-0001', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-002', driverName: 'Keketso Mohale', vehicleId: 'veh-0002', vehiclePlate: 'LP 567 CD 890', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '100 Main Street', city: 'Durban', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '8 Airport Road', city: 'Mafeteng', country: 'Lesotho' }, packageDescription: 'Office Chair x4', packageWeight: 60, quotedAmount: 890, paidAmount: 890, estimatedDelivery: futureDate(2), createdAt: daysAgo(2), updatedAt: hoursAgo(6) },
  { id: 'del-demo-c3', trackingNumber: 'SF2025000503LS', status: 'out_for_delivery', priority: 'standard', customerId: 'cust-0001', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-003', driverName: 'Tumelo Nkoe', vehicleId: 'veh-0005', vehiclePlate: 'LP 234 IJ 789', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '200 Pioneer Road', city: 'Cape Town', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '15 Moshoeshoe Road', city: 'Maseru', country: 'Lesotho' }, packageDescription: 'Solar Panel 400W x3', packageWeight: 60, quotedAmount: 1850, paidAmount: 1850, estimatedDelivery: pastDate(1), createdAt: daysAgo(3), updatedAt: hoursAgo(2) },
  { id: 'del-demo-c4', trackingNumber: 'SF2025000504LS', status: 'delivered', priority: 'urgent', customerId: 'cust-0001', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '50 Kingsway Road', city: 'Maseru', country: 'Lesotho' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '23 Constitution Road', city: 'Leribe', country: 'Lesotho' }, packageDescription: 'Medical Supplies', packageWeight: 15, quotedAmount: 520, paidAmount: 520, estimatedDelivery: pastDate(1), actualDelivery: pastDate(1), createdAt: daysAgo(2), updatedAt: hoursAgo(24), rating: 5.0 },
  { id: 'del-demo-c5', trackingNumber: 'SF2025000505LS', status: 'quote_accepted', priority: 'standard', customerId: 'cust-0001', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '78 Victory Road', city: 'Pretoria', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '9 Independence Avenue', city: 'Berea', country: 'Lesotho' }, packageDescription: 'School Textbooks x20', packageWeight: 45, quotedAmount: 780, paidAmount: undefined, estimatedDelivery: futureDate(5), createdAt: daysAgo(1), updatedAt: hoursAgo(12) },
  { id: 'del-demo-c6', trackingNumber: 'SF2025000506LS', status: 'at_border', priority: 'express', customerId: 'cust-0001', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-004', driverName: 'Malerato Phakoe', vehicleId: 'veh-0008', vehiclePlate: 'LP 890 OP 890', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '320 Main Street', city: 'Johannesburg', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '5 Matsieng Road', city: 'Maseru', country: 'Lesotho' }, packageDescription: 'Dell Laptop x3', packageWeight: 6, quotedAmount: 1150, paidAmount: 1150, estimatedDelivery: futureDate(1), createdAt: daysAgo(2), updatedAt: hoursAgo(8) },
  { id: 'del-demo-d1', trackingNumber: 'SF2025000601LS', status: 'in_transit', priority: 'express', customerId: 'cust-0005', customerName: 'Tsepang Makhaola', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Tsepang Makhaola', phone: '+266 3456 7890', address: '55 Main Street', city: 'Johannesburg', country: 'South Africa' }, destination: { name: 'Tsepang Makhaola', phone: '+266 3456 7890', address: '10 Airport Road', city: 'Butha Buthe', country: 'Lesotho' }, packageDescription: 'Building Materials', packageWeight: 200, quotedAmount: 3800, paidAmount: 3800, estimatedDelivery: futureDate(1), createdAt: daysAgo(2), updatedAt: hoursAgo(4) },
  { id: 'del-demo-d2', trackingNumber: 'SF2025000602LS', status: 'out_for_delivery', priority: 'standard', customerId: 'cust-0010', customerName: 'Rapelang Mokhosi', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Rapelang Mokhosi', phone: '+266 4567 8901', address: '200 Kingsway Road', city: 'Maseru', country: 'Lesotho' }, destination: { name: 'Rapelang Mokhosi', phone: '+266 4567 8901', address: '33 Victory Road', city: 'Maseru', country: 'Lesotho' }, packageDescription: 'Kitchen Appliances', packageWeight: 80, quotedAmount: 450, paidAmount: 450, estimatedDelivery: pastDate(0), createdAt: daysAgo(1), updatedAt: hoursAgo(1) },
];

deliveries.push(...demoDeliveries);

// ============ TIMELINES ============
export function getDeliveryTimeline(delivery: Delivery): DeliveryTimeline[] {
  const statusOrder: Delivery['status'][] = ['request_received', 'awaiting_quote', 'quote_accepted', 'collected', 'at_warehouse', 'in_transit', 'at_border', 'out_for_delivery', 'delivered'];
  const currentIdx = statusOrder.indexOf(delivery.status);
  if (currentIdx < 0) return [];
  const timelines: DeliveryTimeline[] = [];
  const createdDate = new Date(delivery.createdAt);
  const locations = [delivery.pickup.city, 'Maseru Hub', delivery.destination.city];
  const descriptions: Record<string, string> = {
    request_received: 'Delivery request has been received and is being reviewed',
    awaiting_quote: 'Quote is being prepared based on package details',
    quote_accepted: 'Customer has accepted the quotation',
    collected: 'Package has been collected from the pickup location',
    at_warehouse: 'Package arrived at the sorting warehouse',
    in_transit: 'Package is now in transit to destination',
    at_border: 'Package is processing at the border crossing',
    out_for_delivery: 'Package is out for final delivery',
    delivered: 'Package has been successfully delivered',
  };

  function daysSinceCreation(): number {
    return Math.floor((Date.now() - createdDate.getTime()) / 86400000);
  }

  for (let i = 0; i <= Math.min(currentIdx, statusOrder.length - 1); i++) {
    const status = statusOrder[i];
    const offset = Math.floor((i / (currentIdx + 1)) * Math.min(daysSinceCreation(), 120));
    timelines.push({
      id: `tl-${delivery.id}-${i}`,
      deliveryId: delivery.id,
      status,
      timestamp: new Date(createdDate.getTime() + offset * 3600000).toISOString(),
      location: i < locations.length ? locations[i] : delivery.destination.city,
      description: descriptions[status] || 'Status updated',
      performedBy: delivery.driverName || 'System',
    });
  }
  return timelines;
}

// ============ NOTIFICATIONS (6) ============
export const notifications: Notification[] = [
  { id: 'not-1', userId: 'user-co1', type: 'delivery_update', title: 'Delivery Completed', message: 'SF2025000504LS has been delivered successfully to Leribe', isRead: false, link: 'del-demo-c4', createdAt: hoursAgo(1) },
  { id: 'not-2', userId: 'user-co1', type: 'new_message', title: 'New Message', message: 'Mmathapelo sent you a message about delivery SF2025000502LS', isRead: false, createdAt: hoursAgo(2) },
  { id: 'not-3', userId: 'user-co1', type: 'alert', title: 'Vehicle Maintenance Due', message: 'Vehicle LP 456 KL 234 is due for service in 3 days', isRead: false, link: 'fleet', createdAt: hoursAgo(5) },
  { id: 'not-4', userId: 'user-co1', type: 'payment', title: 'Payment Received', message: 'M350.00 received for delivery SF2025000501LS', isRead: true, createdAt: hoursAgo(8) },
  { id: 'not-5', userId: 'user-co1', type: 'delivery_update', title: 'Border Crossing', message: 'SF2025000506LS is currently at the Maseru border post', isRead: true, createdAt: hoursAgo(18) },
  { id: 'not-6', userId: 'user-co1', type: 'system', title: 'Driver License Expiring', message: 'Bokang Mosotho\'s license expires in 30 days', isRead: true, link: 'drivers', createdAt: hoursAgo(36) },
];

// ============ MESSAGES (6) ============
export const messages: Message[] = [
  { id: 'msg-1', senderId: 'user-cust1', senderName: 'Mmathapelo Mphatsoe', recipientId: 'user-co1', recipientName: 'Thabo Mokoena', deliveryId: 'del-demo-c2', content: 'Hi, when will my package arrive? It shows at the border.', isRead: true, createdAt: hoursAgo(2) },
  { id: 'msg-2', senderId: 'user-co1', senderName: 'Thabo Mokoena', recipientId: 'user-cust1', recipientName: 'Mmathapelo Mphatsoe', deliveryId: 'del-demo-c2', content: 'It should clear customs by tomorrow morning. We\'ll update you.', isRead: true, createdAt: hoursAgo(1.5) },
  { id: 'msg-3', senderId: 'user-cust2', senderName: 'Teboho Tlalane', recipientId: 'user-co1', recipientName: 'Thabo Mokoena', content: 'I need a quote for 20 bags of cement from Johannesburg to Mafeteng.', isRead: false, createdAt: hoursAgo(4) },
  { id: 'msg-4', senderId: 'user-drv1', senderName: 'Lebo Mosotho', recipientId: 'user-di1', recipientName: 'Keketso Mohale', content: 'I\'ve picked up the 3 packages. Heading to Butha Buthe now.', isRead: true, createdAt: hoursAgo(3) },
  { id: 'msg-5', senderId: 'user-di1', senderName: 'Keketso Mohale', recipientId: 'user-drv1', recipientName: 'Lebo Mosotho', content: 'Great! Send photo confirmation when you arrive.', isRead: true, createdAt: hoursAgo(2.5) },
  { id: 'msg-6', senderId: 'user-src1', senderName: 'Palesa Moahloli', recipientId: 'user-co1', recipientName: 'Thabo Mokoena', content: 'Found the Samsung Galaxy S24 at Takealot for M8,999. Proceed?', isRead: false, createdAt: hoursAgo(5) },
];

// ============ SOURCING REQUESTS ============
export const sourcingRequests: SourcingRequest[] = [
  { id: 'src-001', customerId: 'cust-0001', customerName: 'Mmathapelo Mphatsoe', productName: 'Samsung Galaxy S24', description: '256GB, Black color', storeName: 'Takealot', productLink: 'https://takealot.com/samsung-s24', budget: 9500, deadline: futureDate(7), location: 'Maseru', status: 'quoted', agentId: 'user-src1', agentName: 'Palesa Moahloli', quotedPrice: 8999, createdAt: daysAgo(2), updatedAt: daysAgo(1) },
  { id: 'src-002', customerId: 'cust-0005', customerName: 'Tsepang Makhaola', productName: 'Dell Latitude 5540', description: '16GB RAM, 512GB SSD', storeName: 'Incredible Connection', budget: 18000, deadline: futureDate(14), location: 'Maseru', status: 'pending', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'src-003', customerId: 'cust-0011', customerName: 'Lineo Molise', productName: 'Solar Panel 400W', description: 'Monocrystalline, with mounting brackets', storeName: 'China Mall JHB', budget: 5000, deadline: futureDate(10), location: 'Mokhotlong', status: 'accepted', agentId: 'user-src1', agentName: 'Palesa Moahloli', quotedPrice: 4200, createdAt: daysAgo(5), updatedAt: daysAgo(2) },
  { id: 'src-004', customerId: 'cust-0014', customerName: 'Mamello Sekhoko', productName: 'Standing Desk Electric', description: 'Adjustable height, 150x75cm', storeName: 'Takealot', budget: 6000, deadline: futureDate(14), location: 'Qacha\'s Nek', status: 'pending', createdAt: hoursAgo(6), updatedAt: hoursAgo(6) },
];

// ============ INVOICES ============
export const invoices: Invoice[] = deliveries.filter(d => d.paidAmount).slice(0, 15).map((d, i) => ({
  id: `inv-${String(i + 1).padStart(4, '0')}`,
  deliveryId: d.id,
  customerId: d.customerId,
  customerName: d.customerName,
  amount: d.paidAmount!,
  currency: 'M',
  status: Math.random() > 0.15 ? 'paid' : Math.random() > 0.5 ? 'pending' : 'overdue',
  dueDate: futureDate(rand(-10, 30)),
  createdAt: d.createdAt,
}));

// ============ QUOTATIONS ============
export const quotations: Quotation[] = [
  ...deliveries.filter(d => ['awaiting_quote', 'quote_accepted'].includes(d.status)).slice(0, 8).map((d, i) => ({
    id: `quo-${String(i + 1).padStart(4, '0')}`,
    deliveryId: d.id,
    amount: d.quotedAmount || 0,
    currency: 'M',
    estimatedDays: d.priority === 'urgent' ? 2 : d.priority === 'express' ? 4 : 7,
    validUntil: futureDate(3),
    status: d.status === 'quote_accepted' ? 'accepted' as const : 'pending' as const,
    createdAt: d.createdAt,
  })),
  ...deliveries.filter(d => d.status === 'cancelled').slice(0, 1).map((d, i) => ({
    id: `quo-${String(9 + i).padStart(4, '0')}`,
    deliveryId: d.id,
    amount: d.quotedAmount || 0,
    currency: 'M',
    estimatedDays: d.priority === 'urgent' ? 2 : d.priority === 'express' ? 4 : 7,
    validUntil: pastDate(2),
    status: 'rejected' as const,
    createdAt: d.createdAt,
  })),
];

// ============ ANALYTICS ============
export const analyticsData: AnalyticsData = {
  totalRevenue: 48520,
  revenueGrowth: 12.5,
  totalDeliveries: 156,
  deliveriesGrowth: 8.3,
  onTimeRate: 94.6,
  onTimeGrowth: 2.1,
  avgRating: 4.4,
  avgRatingGrowth: 0.2,
  activeDrivers: 7,
  totalCustomers: 20,
  customersGrowth: 15.7,
  revenueByMonth: [
    { month: 'Jan', revenue: 2800, deliveries: 10 },
    { month: 'Feb', revenue: 3200, deliveries: 11 },
    { month: 'Mar', revenue: 3500, deliveries: 13 },
    { month: 'Apr', revenue: 4100, deliveries: 14 },
    { month: 'May', revenue: 3800, deliveries: 12 },
    { month: 'Jun', revenue: 4600, deliveries: 16 },
    { month: 'Jul', revenue: 4200, deliveries: 15 },
    { month: 'Aug', revenue: 4900, deliveries: 17 },
    { month: 'Sep', revenue: 4400, deliveries: 14 },
    { month: 'Oct', revenue: 5100, deliveries: 18 },
    { month: 'Nov', revenue: 5400, deliveries: 19 },
    { month: 'Dec', revenue: 5820, deliveries: 20 },
  ],
  deliveriesByStatus: [
    { status: 'Delivered', count: 22 },
    { status: 'In Transit', count: 8 },
    { status: 'Collected', count: 4 },
    { status: 'At Warehouse', count: 3 },
    { status: 'Out for Delivery', count: 5 },
    { status: 'Quote Accepted', count: 4 },
    { status: 'Awaiting Quote', count: 3 },
    { status: 'At Border', count: 3 },
    { status: 'Request Received', count: 2 },
    { status: 'Cancelled', count: 1 },
    { status: 'Returned', count: 1 },
  ],
  topRoutes: [
    { route: 'Johannesburg → Maseru', count: 38, revenue: 15200 },
    { route: 'Cape Town → Maseru', count: 22, revenue: 9100 },
    { route: 'Durban → Mafeteng', count: 15, revenue: 5800 },
    { route: 'Maseru → Leribe', count: 28, revenue: 5600 },
    { route: 'Pretoria → Butha Buthe', count: 12, revenue: 4800 },
  ],
  driverPerformance: drivers.slice(0, 8).map(d => ({
    name: d.name,
    deliveries: d.totalDeliveries,
    rating: d.rating as unknown as number,
    onTime: Math.round(88 + Math.random() * 11),
  })),
  fleetUtilization: [
    { type: 'Trucks', total: 3, available: 1, inUse: 1, maintenance: 1 },
    { type: 'Vans', total: 5, available: 2, inUse: 2, maintenance: 1 },
    { type: 'Pickups', total: 2, available: 1, inUse: 1, maintenance: 0 },
  ],
};

// ============ HELPER EXPORTS ============
export const statusLabels: Record<string, string> = {
  request_received: 'Request Received',
  awaiting_quote: 'Awaiting Quote',
  quote_accepted: 'Quote Accepted',
  collected: 'Collected',
  at_warehouse: 'At Warehouse',
  in_transit: 'In Transit',
  at_border: 'At Border',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  returned: 'Returned',
  cancelled: 'Cancelled',
};

export const statusColors: Record<string, string> = {
  request_received: 'bg-zinc-500/15 text-zinc-400 dark:bg-zinc-500/20 dark:text-zinc-300',
  awaiting_quote: 'bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  quote_accepted: 'bg-sky-500/15 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
  collected: 'bg-teal-500/15 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
  at_warehouse: 'bg-violet-500/15 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400',
  in_transit: 'bg-primary/15 text-primary dark:bg-primary/20',
  at_border: 'bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
  out_for_delivery: 'bg-cyan-500/15 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400',
  delivered: 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  returned: 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
  cancelled: 'bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400',
};

export const priorityColors: Record<string, string> = {
  standard: 'bg-zinc-500/15 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400',
  express: 'bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  urgent: 'bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400',
};

export const roleLabels: Record<string, string> = {
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