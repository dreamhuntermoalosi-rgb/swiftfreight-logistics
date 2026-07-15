'use client';

import { Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardTab } from '@/lib/types';

// Real tab components
import { OverviewTab as OverviewTabReal } from './overview-tab';
import { ReportsTab as ReportsTabReal } from './reports-tab';
import { DeliveriesTab as DeliveriesTabReal } from './deliveries-tab';
import { TrackingTab as TrackingTabReal } from './tracking-tab';
import { CustomersTab as CustomersTabReal } from './customers-tab';
import { DriversTab as DriversTabReal } from './drivers-tab';
import { FleetTab as FleetTabReal } from './fleet-tab';
import { DispatchTab as DispatchTabReal } from './dispatch-tab';
import { SourcingTab as SourcingTabReal } from './sourcing-tab';
import { MessagesTab as MessagesTabReal } from './messages-tab';
import { SettingsTab as SettingsTabReal } from './settings-tab';
import { InvoicesTab as InvoicesTabReal } from './invoices-tab';

/**
 * Tab component barrel file.
 *
 * Each tab exports a named component. When the real tab component is built,
 * replace the placeholder export below with the real import.
 */

// ── Tab exports ──────────────────────────────────────────────────
export const OverviewTab = OverviewTabReal;
export const DeliveriesTab = DeliveriesTabReal;
export const TrackingTab = TrackingTabReal;
export const CustomersTab = CustomersTabReal;
export const DriversTab = DriversTabReal;
export const FleetTab = FleetTabReal;
export const DispatchTab = DispatchTabReal;
export const SourcingTab = SourcingTabReal;
export const MessagesTab = MessagesTabReal;
export const ReportsTab = ReportsTabReal;
export const InvoicesTab = InvoicesTabReal;
export const SettingsTab = SettingsTabReal;

// Map for dynamic lookup
export const tabComponentMap: Record<DashboardTab, React.ComponentType> = {
  overview: OverviewTab,
  deliveries: DeliveriesTab,
  tracking: TrackingTab,
  customers: CustomersTab,
  drivers: DriversTab,
  fleet: FleetTab,
  dispatch: DispatchTab,
  sourcing: SourcingTab,
  messages: MessagesTab,
  reports: ReportsTab,
  invoices: InvoicesTab,
  settings: SettingsTab,
};