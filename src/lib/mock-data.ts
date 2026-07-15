import type {
  User, Company, Delivery, Driver, Customer, Vehicle, Notification,
  Message, SourcingRequest, DeliveryTimeline, AnalyticsData, Invoice, Quotation
} from './types';

// ============ HELPER FUNCTIONS ============
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickN = <T>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
const futureDate = (d: number) => new Date(Date.now() + d * 86400000).toISOString().split('T')[0];
const pastDate = (d: number) => new Date(Date.now() - d * 86400000).toISOString().split('T')[0];

// ============ LESOTHO DATA ============
const basothoNames = [
  'Thabo Mokoena', 'Mpho Letsie', 'Keketso Mohale', 'Tumelo Nkoe', 'Lebo Mosotho',
  'Mmathapelo Mphatsoe', 'Teboho Tlalane', 'Palesa Moahloli', 'Mokhethi Makhetha', 'Limpho Seeiso',
  'Tseliso Monyake', 'Nthabeleng Motsamai', 'Kabelo Khabo', 'Mphoeleng Khetsi', 'Mareka Ramaila',
  'Tsepang Makhaola', 'Malerato Phakoe', 'Mosiuoa Tsiame', 'Nthofeela Mojela', 'Rethabile Nthinya',
  'Thato Mosweu', 'Bokang Tsekiso', 'Kamohelo Mabote', 'Mpho Sekhonyana', 'Tshepo Matela',
  'Lineo Molise', 'Mpeoa Mahao', 'Matsatsi Mokhosi', 'Kopano Tjiane', 'Reitumetse Mokhele',
  'Litšebo Ntšekhe', 'Tlalane Morolong', 'Makhosi Molibeli', 'Rapelang Makhakhe', 'Khotsofalang Lepota',
  'Mamello Sekhoko', 'Nthabiseng Moletsane', 'Tšepo Makhakhe', 'Matseliso Motaung', 'Kabelo Taole',
  'Puleng Phasumane', 'Mphokang Khetheng', 'Tlhokomelo Molise', 'Mahlomola Letsie', 'Kopano Mahlo',
  'Rethabile Tsosane', 'Mpho Mabitso', 'Thabiso Mokone', 'Nteboheleng Hlalele', 'Mosiuoa Maphike',
  'Mphatsoe Fako', 'Kabelo Mokhethi', 'Mareka Sephelane', 'Lehlohonolo Molia', 'Bokang Mosotho',
  'Tšepang Khatala', 'Lineo Pholo', 'Thato Tšeole', 'Matsatsi Nkuebe', 'Rapelang Mokhosi',
];

const lesothoCities = [
  'Maseru', 'Mafeteng', 'Mohales Hoek', 'Quthing', 'Butha Buthe',
  'Leribe', 'Berea', 'Mokhotlong', 'Thaba Tseka', 'Qacha\'s Nek',
];
const lesothoDistricts = ['Maseru', 'Mafeteng', 'Mohales Hoek', 'Quthing', 'Butha Buthe', 'Leribe', 'Berea', 'Mokhotlong', 'Thaba Tseka', 'Qachas Nek'];
const saCities = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Bloemfontein', 'Port Elizabeth', 'East London', 'Polokwane', 'Nelspruit', 'Kimberley'];
const streets = [
  'Kingsway Road', 'Main Street', 'Airport Road', 'Pioneer Road', 'Moshoeshoe Road',
  'Constitution Road', 'Victory Road', 'Independence Avenue', 'Matsieng Road', 'Semonkong Road',
];

const deliveryStatuses = ['request_received', 'awaiting_quote', 'quote_accepted', 'collected', 'at_warehouse', 'in_transit', 'at_border', 'out_for_delivery', 'delivered', 'returned', 'cancelled'] as const;
const weights = [0.5, 1, 2, 3, 5, 8, 10, 15, 20, 25, 30, 50, 75, 100, 150, 200, 500];
const priorities = ['standard', 'express', 'urgent'] as const;
const vehicleMakes = ['Toyota', 'Isuzu', 'Mitsubishi', 'Ford', 'Nissan', 'Hino', 'Mercedes', 'VW'];
const vehicleModels: Record<string, string[]> = {
  'Toyota': ['Hilux', 'Quantum', 'Corolla', 'Land Cruiser', 'Dyn'],
  'Isuzu': ['KB', 'NPR', 'FSR', 'NQR'],
  'Mitsubishi': ['Canter', 'L200', 'Rosa'],
  'Ford': ['Transit', 'Ranger', 'Cargo'],
  'Nissan': ['UD', 'Hardbody', 'NV350'],
  'Hino': ['Dutro', 'Ranger', '500'],
  'Mercedes': ['Sprinter', 'Actros', 'Atego'],
  'VW': ['Caddy', 'Crafter', 'Amarok'],
};
const colors = ['White', 'Silver', 'Black', 'Blue', 'Red', 'Green', 'Grey'];
const vehicleTypes = ['motorcycle', 'van', 'truck', 'trailer', 'pickup'] as const;

const productNames = [
  'Samsung Galaxy S24', 'iPhone 15 Pro', 'Dell Laptop', 'HP Monitor', 'Office Chair',
  'Standing Desk', 'Printer Toner', 'Networking Switch', 'Solar Panel', 'Water Pump',
  'Agricultural Seeds', 'Fertilizer 50kg', 'Cement 50kg Bags', 'Steel Rebar', 'PVC Pipes',
  'Electrical Wire', 'LED Lights Bulk', 'Power Tools Set', 'Safety Equipment', 'Medical Supplies',
  'School Textbooks', 'Uniforms Bundle', 'Kitchen Appliances', 'Building Materials', 'Auto Parts',
];

const storeNames = [
  'Takealot', 'Leratong Wholesale', 'Metro Cash & Carry', 'Shoprite', 'Pick n Pay',
  'Game Stores', ' Builders Warehouse', 'China Mall JHB', 'Hi-Fi Corporation', 'Incredible Connection',
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
  {
    id: 'comp-003', name: 'Highland Haulage', slug: 'highland-haulage', plan: 'starter',
    email: 'contact@highlandhaulage.co.ls', phone: '+266 2231 0003',
    address: '8 Moshoeshoe Road', city: 'Mafeteng', country: 'Lesotho',
    isActive: true, maxUsers: 20, createdAt: daysAgo(365),
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
  { id: 'user-wh1', email: 'warehouse@highlandhaulage.co.ls', name: 'Mokhethi Makhetha', role: 'warehouse_partner', companyId: 'comp-003', isActive: true, createdAt: daysAgo(250) },
];

// ============ CUSTOMERS ============
export const customers: Customer[] = basothoNames.slice(0, 300).map((name, i) => ({
  id: `cust-${String(i + 1).padStart(4, '0')}`,
  userId: `user-cust-${i}`,
  name,
  email: name.toLowerCase().replace(/\s/g, '.') + `@email.co.ls`,
  phone: `+266 ${rand(2000, 7999)} ${rand(1000, 9999)}`,
  address: `${rand(1, 500)} ${pick(streets)}`,
  city: pick(lesothoCities),
  country: 'Lesotho',
  totalShipments: rand(1, 45),
  totalSpent: rand(50, 25000),
  rating: Number((3 + Math.random() * 2).toFixed(1)),
  joinedAt: daysAgo(rand(30, 700)),
}));

// ============ VEHICLES ============
let vehicleCounter = 0;
export const vehicles: Vehicle[] = [];
const vehicleCounts = [15, 14, 11]; // per company
vehicleCounts.forEach((count, ci) => {
  for (let v = 0; v < count; v++) {
    const type = pick(vehicleTypes);
    const make = pick(vehicleMakes);
    const models = vehicleModels[make] || ['Model X'];
    const statuses: Vehicle['status'][] = ['available', 'in_use', 'maintenance', 'out_of_service'];
    const statusWeights = [0.35, 0.4, 0.15, 0.1];
    let r = Math.random(), status: Vehicle['status'] = 'available';
    let cumulative = 0;
    for (let s = 0; s < statuses.length; s++) {
      cumulative += statusWeights[s];
      if (r <= cumulative) { status = statuses[s]; break; }
    }
    const fuelTypes: Vehicle['fuelType'][] = ['petrol', 'diesel', 'diesel', 'diesel', 'petrol'];
    vehicleCounter++;
    vehicles.push({
      id: `veh-${String(vehicleCounter).padStart(4, '0')}`,
      companyId: companies[ci].id,
      plateNumber: `LP ${rand(100, 999)} ${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))} ${rand(100, 999)}`,
      type, make, model: pick(models), year: rand(2015, 2024),
      color: pick(colors), status, fuelType: pick(fuelTypes),
      capacity: type === 'motorcycle' ? rand(10, 50) : type === 'van' ? rand(500, 2000) : type === 'pickup' ? rand(500, 1500) : rand(2000, 15000),
      currentMileage: rand(10000, 250000),
      insuranceExpiry: futureDate(rand(30, 365)),
      licenseExpiry: futureDate(rand(30, 365)),
      lastServiceDate: pastDate(rand(5, 60)),
      nextServiceDate: futureDate(rand(10, 90)),
      createdAt: daysAgo(rand(100, 700)),
    });
  }
});

// ============ DRIVERS ============
export const drivers: Driver[] = basothoNames.slice(0, 60).map((name, i) => {
  const companyId = i < 22 ? 'comp-001' : i < 42 ? 'comp-002' : 'comp-003';
  const statuses: Driver['status'][] = ['available', 'on_trip', 'off_duty', 'suspended'];
  const sw = [0.3, 0.4, 0.25, 0.05];
  let r = Math.random(), status: Driver['status'] = 'available';
  let cum = 0;
  for (let s = 0; s < statuses.length; s++) { cum += sw[s]; if (r <= cum) { status = statuses[s]; break; } }
  const totalDel = rand(20, 800);
  return {
    id: `drv-${String(i + 1).padStart(3, '0')}`,
    userId: `user-drv-${i}`,
    companyId,
    name,
    phone: `+266 ${rand(2000, 7999)} ${rand(1000, 9999)}`,
    email: name.toLowerCase().replace(/\s/g, '.') + `@driver.co.ls`,
    licenseNumber: `LD${rand(100000, 999999)}`,
    licenseExpiry: futureDate(rand(30, 730)),
    status,
    rating: Number((3.2 + Math.random() * 1.8).toFixed(1)),
    totalDeliveries: totalDel,
    successfulDeliveries: Math.floor(totalDel * (0.85 + Math.random() * 0.14)),
    currentVehicleId: status === 'on_trip' ? `veh-${String(rand(1, 40)).padStart(4, '0')}` : undefined,
    currentVehiclePlate: status === 'on_trip' ? `LP ${rand(100, 999)} AB ${rand(100, 999)}` : undefined,
    location: status === 'on_trip' ? pick(lesothoCities) : undefined,
    joinedAt: daysAgo(rand(60, 600)),
  };
});

// ============ DELIVERIES ============
const statusWeights: [string, number][] = [
  ['delivered', 0.35], ['in_transit', 0.15], ['collected', 0.1], ['at_warehouse', 0.08],
  ['quote_accepted', 0.07], ['out_for_delivery', 0.08], ['awaiting_quote', 0.05],
  ['at_border', 0.05], ['request_received', 0.03], ['cancelled', 0.02], ['returned', 0.02],
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
for (let i = 0; i < 500; i++) {
  const status = getWeightedStatus();
  const company = pick(companies);
  const customer = pick(customers);
  const driver = pick(drivers.filter(d => d.companyId === company.id));
  const vehicle = pick(vehicles.filter(v => v.companyId === company.id));
  const isLocal = Math.random() > 0.35;
  const fromCity = isLocal ? pick(saCities) : pick(lesothoCities);
  const toCity = isLocal ? pick(lesothoCities) : pick(lesothoCities);
  const priority = pick(priorities);
  const weight = pick(weights);
  const amount = Math.round((weight * (priority === 'urgent' ? 25 : priority === 'express' ? 18 : 12) + rand(20, 200)));
  const createdAtDays = rand(0, 90);

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
    pickup: { name: customer.name, phone: customer.phone, address: `${rand(1, 500)} ${pick(streets)}`, city: fromCity, country: isLocal ? 'South Africa' : 'Lesotho' },
    destination: { name: customer.name, phone: customer.phone, address: `${rand(1, 500)} ${pick(streets)}`, city: toCity, country: isLocal ? 'Lesotho' : 'Lesotho' },
    packageDescription: pick(productNames) + (Math.random() > 0.5 ? ` x${rand(1, 10)}` : ''),
    packageWeight: weight,
    quotedAmount: amount,
    paidAmount: !['request_received', 'awaiting_quote'].includes(status) ? amount : undefined,
    estimatedDelivery: futureDate(rand(1, 14)),
    actualDelivery: status === 'delivered' ? pastDate(rand(0, 5)) : undefined,
    createdAt: daysAgo(createdAtDays),
    updatedAt: hoursAgo(rand(1, createdAtDays * 24)),
    rating: status === 'delivered' ? Number((3 + Math.random() * 2).toFixed(1)) : undefined,
  });
}

// ============ GUARANTEED DEMO DELIVERIES ============
// Ensure demo customer (cust-0006) and driver (drv-001) have enough deliveries for a good demo
const demoCustomerDeliveries: Delivery[] = [
  { id: 'del-demo-c1', trackingNumber: 'SF2025000501LS', status: 'delivered', priority: 'standard', customerId: 'cust-0006', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '45 Pioneer Road', city: 'Johannesburg', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '12 Kingsway Road', city: 'Maseru', country: 'Lesotho' }, packageDescription: 'Samsung Galaxy S24 x2', packageWeight: 0.8, quotedAmount: 350, paidAmount: 350, estimatedDelivery: pastDate(3), actualDelivery: pastDate(2), createdAt: daysAgo(5), updatedAt: hoursAgo(48), rating: 4.8 },
  { id: 'del-demo-c2', trackingNumber: 'SF2025000502LS', status: 'in_transit', priority: 'express', customerId: 'cust-0006', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-003', driverName: 'Keketso Mohale', vehicleId: 'veh-0002', vehiclePlate: 'LP 567 CD 890', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '100 Main Street', city: 'Durban', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '8 Airport Road', city: 'Mafeteng', country: 'Lesotho' }, packageDescription: 'Office Chair x4', packageWeight: 60, quotedAmount: 890, paidAmount: 890, estimatedDelivery: futureDate(2), createdAt: daysAgo(2), updatedAt: hoursAgo(6) },
  { id: 'del-demo-c3', trackingNumber: 'SF2025000503LS', status: 'out_for_delivery', priority: 'standard', customerId: 'cust-0006', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-005', driverName: 'Tumelo Nkoe', vehicleId: 'veh-0005', vehiclePlate: 'LP 234 EF 123', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '200 Pioneer Road', city: 'Cape Town', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '15 Moshoeshoe Road', city: 'Maseru', country: 'Lesotho' }, packageDescription: 'Solar Panel 400W x5', packageWeight: 100, quotedAmount: 2450, paidAmount: 2450, estimatedDelivery: pastDate(1), createdAt: daysAgo(3), updatedAt: hoursAgo(2) },
  { id: 'del-demo-c4', trackingNumber: 'SF2025000504LS', status: 'delivered', priority: 'urgent', customerId: 'cust-0006', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '50 Kingsway Road', city: 'Maseru', country: 'Lesotho' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '23 Constitution Road', city: 'Leribe', country: 'Lesotho' }, packageDescription: 'Medical Supplies', packageWeight: 15, quotedAmount: 520, paidAmount: 520, estimatedDelivery: pastDate(1), actualDelivery: pastDate(1), createdAt: daysAgo(2), updatedAt: hoursAgo(24), rating: 5.0 },
  { id: 'del-demo-c5', trackingNumber: 'SF2025000505LS', status: 'quote_accepted', priority: 'standard', customerId: 'cust-0006', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '78 Victory Road', city: 'Pretoria', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '9 Independence Avenue', city: 'Berea', country: 'Lesotho' }, packageDescription: 'School Textbooks x20', packageWeight: 45, quotedAmount: 780, paidAmount: undefined, estimatedDelivery: futureDate(5), createdAt: daysAgo(1), updatedAt: hoursAgo(12) },
  { id: 'del-demo-c6', trackingNumber: 'SF2025000506LS', status: 'at_border', priority: 'express', customerId: 'cust-0006', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-008', driverName: 'Malerato Phakoe', vehicleId: 'veh-0008', vehiclePlate: 'LP 789 GH 456', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '320 Main Street', city: 'Johannesburg', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '5 Matsieng Road', city: 'Maseru', country: 'Lesotho' }, packageDescription: 'Dell Laptop x3', packageWeight: 6, quotedAmount: 1150, paidAmount: 1150, estimatedDelivery: futureDate(1), createdAt: daysAgo(2), updatedAt: hoursAgo(8) },
  { id: 'del-demo-c7', trackingNumber: 'SF2025000507LS', status: 'delivered', priority: 'standard', customerId: 'cust-0006', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-012', driverName: 'Tsepang Makhaola', vehicleId: 'veh-0012', vehiclePlate: 'LP 456 IJ 789', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '150 Airport Road', city: 'Bloemfontein', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '42 Semonkong Road', city: 'Quthing', country: 'Lesotho' }, packageDescription: 'Fertilizer 50kg x10', packageWeight: 500, quotedAmount: 3200, paidAmount: 3200, estimatedDelivery: pastDate(5), actualDelivery: pastDate(4), createdAt: daysAgo(7), updatedAt: hoursAgo(96), rating: 4.2 },
  { id: 'del-demo-c8', trackingNumber: 'SF2025000508LS', status: 'collected', priority: 'standard', customerId: 'cust-0006', customerName: 'Mmathapelo Mphatsoe', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-015', driverName: 'Mosiuoa Tsiame', vehicleId: 'veh-0015', vehiclePlate: 'LP 678 KL 234', pickup: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '88 Pioneer Road', city: 'Port Elizabeth', country: 'South Africa' }, destination: { name: 'Mmathapelo Mphatsoe', phone: '+266 5123 4567', address: '17 Kingsway Road', city: 'Mohales Hoek', country: 'Lesotho' }, packageDescription: 'LED Lights Bulk x50', packageWeight: 25, quotedAmount: 680, paidAmount: 680, estimatedDelivery: futureDate(4), createdAt: daysAgo(1), updatedAt: hoursAgo(3) },
];

const demoDriverDeliveries: Delivery[] = [
  { id: 'del-demo-d1', trackingNumber: 'SF2025000601LS', status: 'in_transit', priority: 'express', customerId: 'cust-0015', customerName: 'Tsepang Makhaola', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Tsepang Makhaola', phone: '+266 3456 7890', address: '55 Main Street', city: 'Johannesburg', country: 'South Africa' }, destination: { name: 'Tsepang Makhaola', phone: '+266 3456 7890', address: '10 Airport Road', city: 'Butha Buthe', country: 'Lesotho' }, packageDescription: 'Building Materials', packageWeight: 200, quotedAmount: 3800, paidAmount: 3800, estimatedDelivery: futureDate(1), createdAt: daysAgo(2), updatedAt: hoursAgo(4) },
  { id: 'del-demo-d2', trackingNumber: 'SF2025000602LS', status: 'out_for_delivery', priority: 'standard', customerId: 'cust-0023', customerName: 'Rapelang Mokhosi', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Rapelang Mokhosi', phone: '+266 4567 8901', address: '200 Kingsway Road', city: 'Maseru', country: 'Lesotho' }, destination: { name: 'Rapelang Mokhosi', phone: '+266 4567 8901', address: '33 Victory Road', city: 'Maseru', country: 'Lesotho' }, packageDescription: 'Kitchen Appliances', packageWeight: 80, quotedAmount: 450, paidAmount: 450, estimatedDelivery: pastDate(0), createdAt: daysAgo(1), updatedAt: hoursAgo(1) },
  { id: 'del-demo-d3', trackingNumber: 'SF2025000603LS', status: 'delivered', priority: 'urgent', customerId: 'cust-0031', customerName: 'Mamello Sekhoko', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Mamello Sekhoko', phone: '+266 5678 9012', address: '77 Pioneer Road', city: 'Nelspruit', country: 'South Africa' }, destination: { name: 'Mamello Sekhoko', phone: '+266 5678 9012', address: '19 Moshoeshoe Road', city: 'Leribe', country: 'Lesotho' }, packageDescription: 'Auto Parts x8', packageWeight: 45, quotedAmount: 1250, paidAmount: 1250, estimatedDelivery: pastDate(1), actualDelivery: pastDate(0), createdAt: daysAgo(2), updatedAt: hoursAgo(12), rating: 4.5 },
  { id: 'del-demo-d4', trackingNumber: 'SF2025000604LS', status: 'collected', priority: 'standard', customerId: 'cust-0042', customerName: 'Mahlomola Letsie', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Mahlomola Letsie', phone: '+266 6789 0123', address: '120 Main Street', city: 'Pretoria', country: 'South Africa' }, destination: { name: 'Mahlomola Letsie', phone: '+266 6789 0123', address: '44 Constitution Road', city: 'Berea', country: 'Lesotho' }, packageDescription: 'Cement 50kg Bags x20', packageWeight: 1000, quotedAmount: 4500, paidAmount: 4500, estimatedDelivery: futureDate(3), createdAt: daysAgo(0), updatedAt: hoursAgo(2) },
  { id: 'del-demo-d5', trackingNumber: 'SF2025000605LS', status: 'delivered', priority: 'express', customerId: 'cust-0008', customerName: 'Mokhethi Makhetha', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Mokhethi Makhetha', phone: '+266 7890 1234', address: '90 Airport Road', city: 'Durban', country: 'South Africa' }, destination: { name: 'Mokhethi Makhetha', phone: '+266 7890 1234', address: '7 Independence Avenue', city: 'Mafeteng', country: 'Lesotho' }, packageDescription: 'Networking Switch x4', packageWeight: 12, quotedAmount: 920, paidAmount: 920, estimatedDelivery: pastDate(2), actualDelivery: pastDate(1), createdAt: daysAgo(3), updatedAt: hoursAgo(24), rating: 4.9 },
  { id: 'del-demo-d6', trackingNumber: 'SF2025000606LS', status: 'delivered', priority: 'standard', customerId: 'cust-0019', customerName: 'Rethabile Nthinya', companyId: 'comp-001', companyName: 'Mountain Express', driverId: 'drv-001', driverName: 'Lebo Mosotho', vehicleId: 'veh-0001', vehiclePlate: 'LP 342 AB 567', pickup: { name: 'Rethabile Nthinya', phone: '+266 8901 2345', address: '165 Pioneer Road', city: 'Cape Town', country: 'South Africa' }, destination: { name: 'Rethabile Nthinya', phone: '+266 8901 2345', address: '28 Victory Road', city: 'Qacha\'s Nek', country: 'Lesotho' }, packageDescription: 'Agricultural Seeds x30', packageWeight: 150, quotedAmount: 2100, paidAmount: 2100, estimatedDelivery: pastDate(4), actualDelivery: pastDate(3), createdAt: daysAgo(6), updatedAt: hoursAgo(72), rating: 4.0 },
];

deliveries.push(...demoCustomerDeliveries, ...demoDriverDeliveries);

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

  for (let i = 0; i <= Math.min(currentIdx, statusOrder.length - 1); i++) {
    const status = statusOrder[i];
    const offset = Math.floor((i / (currentIdx + 1)) * Math.min(createdAtDays(new Date(delivery.createdAt)), 120));
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

function createdAtDays(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / 86400000);
}

// ============ NOTIFICATIONS ============
export const notifications: Notification[] = [
  { id: 'not-1', userId: 'user-co1', type: 'delivery_update', title: 'Delivery Completed', message: 'SF2025001005LS has been delivered successfully to Maseru', isRead: false, link: 'del-00100', createdAt: hoursAgo(1) },
  { id: 'not-2', userId: 'user-co1', type: 'new_message', title: 'New Message', message: 'Thabo sent you a message about delivery SF2025001098LS', isRead: false, createdAt: hoursAgo(2) },
  { id: 'not-3', userId: 'user-co1', type: 'quote_received', title: 'Quote Request', message: 'New quote request from Palesa Moahloli for Samsung Galaxy S24', isRead: false, createdAt: hoursAgo(3) },
  { id: 'not-4', userId: 'user-co1', type: 'system', title: 'Driver License Expiring', message: 'Lebo Mosotho\'s license expires in 15 days', isRead: false, link: 'drivers', createdAt: hoursAgo(5) },
  { id: 'not-5', userId: 'user-co1', type: 'payment', title: 'Payment Received', message: 'M350.00 received for delivery SF2025000876LS', isRead: true, createdAt: hoursAgo(8) },
  { id: 'not-6', userId: 'user-co1', type: 'alert', title: 'Vehicle Maintenance Due', message: 'Vehicle LP 456 AB 789 is due for service in 3 days', isRead: true, link: 'fleet', createdAt: hoursAgo(12) },
  { id: 'not-7', userId: 'user-co1', type: 'delivery_update', title: 'Border Crossing', message: '3 deliveries are currently at the Maseru border post', isRead: true, createdAt: hoursAgo(18) },
  { id: 'not-8', userId: 'user-co1', type: 'new_message', title: 'New Sourcing Request', message: 'Mmathapelo Mphatsoe requested sourcing for Dell Laptop', isRead: true, createdAt: hoursAgo(24) },
  { id: 'not-9', userId: 'user-co1', type: 'system', title: 'Monthly Report Ready', message: 'Your June 2025 performance report is ready for review', isRead: true, createdAt: hoursAgo(36) },
  { id: 'not-10', userId: 'user-co1', type: 'delivery_update', title: 'Delivery Delayed', message: 'SF2025001045LS delayed at border - customs clearance pending', isRead: true, createdAt: hoursAgo(48) },
];

// ============ MESSAGES ============
export const messages: Message[] = [
  { id: 'msg-1', senderId: 'user-cust1', senderName: 'Mmathapelo Mphatsoe', recipientId: 'user-co1', recipientName: 'Thabo Mokoena', deliveryId: 'del-00100', content: 'Hi, when will my package arrive? The tracking shows it\'s at the border.', isRead: true, createdAt: hoursAgo(2) },
  { id: 'msg-2', senderId: 'user-co1', senderName: 'Thabo Mokoena', recipientId: 'user-cust1', recipientName: 'Mmathapelo Mphatsoe', deliveryId: 'del-00100', content: 'It should clear customs by tomorrow morning. We\'ll update you once it\'s through.', isRead: true, createdAt: hoursAgo(1.5) },
  { id: 'msg-3', senderId: 'user-cust1', senderName: 'Mmathapelo Mphatsoe', recipientId: 'user-co1', recipientName: 'Thabo Mokoena', deliveryId: 'del-00100', content: 'Thank you! Please keep me updated.', isRead: true, createdAt: hoursAgo(1) },
  { id: 'msg-4', senderId: 'user-cust2', senderName: 'Teboho Tlalane', recipientId: 'user-co1', recipientName: 'Thabo Mokoena', content: 'I need a quote for 20 bags of cement from Johannesburg to Mafeteng.', isRead: false, createdAt: hoursAgo(4) },
  { id: 'msg-5', senderId: 'user-drv1', senderName: 'Lebo Mosotho', recipientId: 'user-di1', recipientName: 'Keketso Mohale', content: 'I\'ve picked up the 3 packages from the warehouse. Heading to Butha Buthe now.', isRead: true, createdAt: hoursAgo(3) },
  { id: 'msg-6', senderId: 'user-di1', senderName: 'Keketso Mohale', recipientId: 'user-drv1', recipientName: 'Lebo Mosotho', content: 'Great! Please send photo confirmation when you arrive. Watch out for road construction near Pitseng.', isRead: true, createdAt: hoursAgo(2.5) },
  { id: 'msg-7', senderId: 'user-src1', senderName: 'Palesa Moahloli', recipientId: 'user-co1', recipientName: 'Thabo Mokoena', content: 'Found the Samsung Galaxy S24 at Takealot for M8,999. Shall I proceed with the purchase?', isRead: false, createdAt: hoursAgo(5) },
  { id: 'msg-8', senderId: 'user-om1', senderName: 'Mpho Letsie', recipientId: 'user-fm1', recipientName: 'Tumelo Nkoe', content: 'We need to schedule maintenance for 3 trucks this week. Can you check availability?', isRead: true, createdAt: hoursAgo(6) },
];

// ============ SOURCING REQUESTS ============
export const sourcingRequests: SourcingRequest[] = [
  { id: 'src-001', customerId: 'cust-0001', customerName: 'Thabo Mokoena', productName: 'Samsung Galaxy S24', description: '256GB, Black color', storeName: 'Takealot', productLink: 'https://takealot.com/samsung-s24', budget: 9500, deadline: futureDate(7), location: 'Maseru', status: 'quoted', agentId: 'user-src1', agentName: 'Palesa Moahloli', quotedPrice: 8999, createdAt: daysAgo(2), updatedAt: daysAgo(1) },
  { id: 'src-002', customerId: 'cust-0005', customerName: 'Tumelo Nkoe', productName: 'Dell Latitude 5540', description: '16GB RAM, 512GB SSD', storeName: 'Incredible Connection', budget: 18000, deadline: futureDate(14), location: 'Maseru', status: 'pending', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'src-003', customerId: 'cust-0012', customerName: 'Lineo Molise', productName: 'Solar Panel 400W', description: 'Monocrystalline, with mounting brackets', storeName: 'China Mall JHB', budget: 5000, deadline: futureDate(10), location: 'Mafeteng', status: 'accepted', agentId: 'user-src1', agentName: 'Palesa Moahloli', quotedPrice: 4200, createdAt: daysAgo(5), updatedAt: daysAgo(2) },
  { id: 'src-004', customerId: 'cust-0018', customerName: 'Matsatsi Mokhosi', productName: 'Cement 50kg Bags x20', description: 'PPC or equivalent brand', storeName: 'Builders Warehouse', budget: 4000, deadline: futureDate(5), location: 'Leribe', status: 'purchased', agentId: 'user-src1', agentName: 'Palesa Moahloli', quotedPrice: 3800, createdAt: daysAgo(7), updatedAt: daysAgo(3) },
  { id: 'src-005', customerId: 'cust-0025', customerName: 'Rapelang Makhakhe', productName: 'HP LaserJet Printer', description: 'M404dn, with extra toner', storeName: 'Hi-Fi Corporation', budget: 8000, deadline: futureDate(21), location: 'Quthing', status: 'quoted', agentId: 'user-src1', agentName: 'Palesa Moahloli', quotedPrice: 7200, createdAt: daysAgo(3), updatedAt: daysAgo(1) },
  { id: 'src-006', customerId: 'cust-0031', customerName: 'Mamello Sekhoko', productName: 'Standing Desk Electric', description: 'Adjustable height, 150x75cm', storeName: 'Takealot', budget: 6000, deadline: futureDate(14), location: 'Butha Buthe', status: 'pending', createdAt: hoursAgo(6), updatedAt: hoursAgo(6) },
];

// ============ INVOICES ============
export const invoices: Invoice[] = deliveries.filter(d => d.paidAmount).slice(0, 50).map((d, i) => ({
  id: `inv-${String(i + 1).padStart(5, '0')}`,
  deliveryId: d.id,
  customerId: d.customerId,
  customerName: d.customerName,
  amount: d.paidAmount!,
  currency: 'M',
  status: Math.random() > 0.2 ? 'paid' : Math.random() > 0.5 ? 'pending' : 'overdue',
  dueDate: futureDate(rand(-10, 30)),
  createdAt: d.createdAt,
}));

// ============ QUOTATIONS ============
export const quotations: Quotation[] = [
  ...deliveries.filter(d => ['awaiting_quote', 'quote_accepted'].includes(d.status)).slice(0, 16).map((d, i) => ({
    id: `quo-${String(i + 1).padStart(4, '0')}`,
    deliveryId: d.id,
    amount: d.quotedAmount || 0,
    currency: 'M',
    estimatedDays: d.priority === 'urgent' ? 2 : d.priority === 'express' ? 4 : 7,
    validUntil: futureDate(3),
    status: d.status === 'quote_accepted' ? 'accepted' as const : 'pending' as const,
    createdAt: d.createdAt,
  })),
  // Rejected quotations
  ...deliveries.filter(d => d.status === 'cancelled').slice(0, 2).map((d, i) => ({
    id: `quo-${String(17 + i).padStart(4, '0')}`,
    deliveryId: d.id,
    amount: d.quotedAmount || 0,
    currency: 'M',
    estimatedDays: d.priority === 'urgent' ? 2 : d.priority === 'express' ? 4 : 7,
    validUntil: pastDate(2),
    status: 'rejected' as const,
    createdAt: d.createdAt,
  })),
  // Expired quotations
  ...deliveries.filter(d => ['awaiting_quote'].includes(d.status)).slice(4, 7).map((d, i) => ({
    id: `quo-${String(19 + i).padStart(4, '0')}`,
    deliveryId: d.id,
    amount: d.quotedAmount || 0,
    currency: 'M',
    estimatedDays: d.priority === 'urgent' ? 2 : d.priority === 'express' ? 4 : 7,
    validUntil: pastDate(5),
    status: 'expired' as const,
    createdAt: d.createdAt,
  })),
];

// ============ ANALYTICS ============
export const analyticsData: AnalyticsData = {
  totalRevenue: 245680,
  revenueGrowth: 12.5,
  totalDeliveries: 1248,
  deliveriesGrowth: 8.3,
  onTimeRate: 94.6,
  onTimeGrowth: 2.1,
  avgRating: 4.3,
  avgRatingGrowth: 0.2,
  activeDrivers: 42,
  totalCustomers: 312,
  customersGrowth: 15.7,
  revenueByMonth: [
    { month: 'Jan', revenue: 18200, deliveries: 85 },
    { month: 'Feb', revenue: 21500, deliveries: 98 },
    { month: 'Mar', revenue: 19800, deliveries: 91 },
    { month: 'Apr', revenue: 24300, deliveries: 112 },
    { month: 'May', revenue: 22100, deliveries: 105 },
    { month: 'Jun', revenue: 26800, deliveries: 124 },
    { month: 'Jul', revenue: 28500, deliveries: 132 },
    { month: 'Aug', revenue: 31200, deliveries: 145 },
    { month: 'Sep', revenue: 27600, deliveries: 128 },
    { month: 'Oct', revenue: 29400, deliveries: 136 },
    { month: 'Nov', revenue: 33100, deliveries: 153 },
    { month: 'Dec', revenue: 35600, deliveries: 164 },
  ],
  deliveriesByStatus: [
    { status: 'Delivered', count: 175 },
    { status: 'In Transit', count: 45 },
    { status: 'Collected', count: 28 },
    { status: 'At Warehouse', count: 22 },
    { status: 'Out for Delivery', count: 35 },
    { status: 'Quote Accepted', count: 18 },
    { status: 'Awaiting Quote', count: 12 },
    { status: 'At Border', count: 15 },
    { status: 'Request Received', count: 8 },
    { status: 'Cancelled', count: 5 },
    { status: 'Returned', count: 4 },
  ],
  topRoutes: [
    { route: 'Johannesburg → Maseru', count: 245, revenue: 78500 },
    { route: 'Cape Town → Maseru', count: 128, revenue: 45200 },
    { route: 'Durban → Maseru', count: 95, revenue: 32100 },
    { route: 'Maseru → Mafeteng', count: 180, revenue: 28400 },
    { route: 'Pretoria → Leribe', count: 85, revenue: 22500 },
    { route: 'Bloemfontein → Maseru', count: 72, revenue: 18900 },
  ],
  driverPerformance: drivers.slice(0, 10).map(d => ({
    name: d.name,
    deliveries: d.totalDeliveries,
    rating: d.rating as unknown as number,
    onTime: Math.round(85 + Math.random() * 14),
  })),
  fleetUtilization: [
    { type: 'Trucks', total: 18, available: 5, inUse: 10, maintenance: 3 },
    { type: 'Vans', total: 12, available: 4, inUse: 6, maintenance: 2 },
    { type: 'Pickups', total: 6, available: 2, inUse: 3, maintenance: 1 },
    { type: 'Trailers', total: 4, available: 1, inUse: 2, maintenance: 1 },
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
  request_received: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  awaiting_quote: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  quote_accepted: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  collected: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  at_warehouse: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  in_transit: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  at_border: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  out_for_delivery: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  delivered: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  returned: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const priorityColors: Record<string, string> = {
  standard: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  express: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  urgent: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
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