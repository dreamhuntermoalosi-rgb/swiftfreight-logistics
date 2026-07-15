import { create } from 'zustand';
import type { User, AppView, DashboardTab, Notification, Message, Delivery } from './types';

// ============ AUTH STORE ============
interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  selectedCompanyId: string | null;
  login: (user: User) => void;
  logout: () => void;
  switchCompany: (companyId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  selectedCompanyId: null,
  login: (user) => set({ isAuthenticated: true, currentUser: user, selectedCompanyId: user.companyId || null }),
  logout: () => set({ isAuthenticated: false, currentUser: null, selectedCompanyId: null }),
  switchCompany: (companyId) => set({ selectedCompanyId: companyId }),
}));

// ============ NAVIGATION STORE ============
interface NavigationState {
  currentView: AppView;
  dashboardTab: DashboardTab;
  selectedDeliveryId: string | null;
  trackingNumber: string;
  sidebarOpen: boolean;
  setView: (view: AppView) => void;
  setDashboardTab: (tab: DashboardTab) => void;
  selectDelivery: (id: string | null) => void;
  setTrackingNumber: (num: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useNavStore = create<NavigationState>((set) => ({
  currentView: 'marketing',
  dashboardTab: 'overview',
  selectedDeliveryId: null,
  trackingNumber: '',
  sidebarOpen: true,
  setView: (view) => set({ currentView: view }),
  setDashboardTab: (tab) => set({ dashboardTab: tab, selectedDeliveryId: null }),
  selectDelivery: (id) => set({ selectedDeliveryId: id }),
  setTrackingNumber: (num) => set({ trackingNumber: num }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

// ============ NOTIFICATION STORE ============
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));

// ============ MESSAGE STORE ============
interface MessageState {
  conversations: Message[];
  activeConversation: string | null;
  setActiveConversation: (userId: string | null) => void;
  addMessage: (msg: Message) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: [],
  activeConversation: null,
  setActiveConversation: (userId) => set({ activeConversation: userId }),
  addMessage: (msg) => set((s) => ({ conversations: [...s.conversations, msg] })),
}));

// ============ DELIVERY STORE ============
interface DeliveryState {
  deliveries: Delivery[];
  filters: {
    status: string;
    priority: string;
    search: string;
    dateRange: string;
  };
  setDeliveries: (deliveries: Delivery[]) => void;
  updateDeliveryStatus: (id: string, status: Delivery['status']) => void;
  setFilter: (key: string, value: string) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  deliveries: [],
  filters: { status: 'all', priority: 'all', search: '', dateRange: 'all' },
  setDeliveries: (deliveries) => set({ deliveries }),
  updateDeliveryStatus: (id, status) =>
    set((s) => ({
      deliveries: s.deliveries.map((d) => (d.id === id ? { ...d, status } : d)),
    })),
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
}));