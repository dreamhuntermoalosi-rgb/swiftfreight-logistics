'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PackageCheck,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  Info,
  CheckCheck,
  Inbox,
} from 'lucide-react';
import { useNotificationStore, useAuthStore } from '@/lib/store';
import { notifications as mockNotifications } from '@/lib/mock-data';
import type { NotificationType } from '@/lib/types';

// ============ Filter Types ============
type NotificationFilter = 'all' | 'unread' | 'deliveries' | 'system' | 'payments';

const FILTER_OPTIONS: { key: NotificationFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'deliveries', label: 'Deliveries' },
  { key: 'system', label: 'System' },
  { key: 'payments', label: 'Payments' },
];

// ============ Helpers ============
function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'delivery_update':
      return PackageCheck;
    case 'new_message':
      return MessageSquare;
    case 'quote_received':
    case 'payment':
      return CreditCard;
    case 'alert':
      return AlertTriangle;
    case 'system':
    default:
      return Info;
  }
}

function getNotificationIconBg(type: NotificationType) {
  switch (type) {
    case 'delivery_update':
      return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600';
    case 'new_message':
      return 'bg-primary/10 text-primary';
    case 'quote_received':
    case 'payment':
      return 'bg-teal-50 dark:bg-teal-950/50 text-teal-600';
    case 'alert':
      return 'bg-amber-50 dark:bg-amber-950/50 text-amber-600';
    case 'system':
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function matchesFilter(type: NotificationType, filter: NotificationFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'unread':
      return true; // handled separately via isRead
    case 'deliveries':
      return type === 'delivery_update' || type === 'quote_received';
    case 'system':
      return type === 'system' || type === 'alert';
    case 'payments':
      return type === 'payment';
    default:
      return true;
  }
}

// ============ Notifications Tab ============
export function NotificationsTab() {
  const { currentUser } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationStore();

  // Use store notifications if loaded, otherwise fall back to mock data
  const allNotifications = useMemo(() => {
    if (notifications.length > 0) return notifications;
    if (currentUser) {
      return mockNotifications.filter((n) => n.userId === currentUser.id);
    }
    return mockNotifications;
  }, [notifications, currentUser]);

  const [filter, setFilter] = useState<NotificationFilter>('all');

  const handleFilterChange = useCallback((f: NotificationFilter) => {
    setFilter(f);
  }, []);

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((n) => {
      if (filter === 'unread' && n.isRead) return false;
      if (!matchesFilter(n.type, filter)) return false;
      return true;
    });
  }, [allNotifications, filter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-primary hover:text-primary"
            onClick={markAllAsRead}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <NotificationFilters
          current={filter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Notification List */}
      <ScrollArea className="max-h-[calc(100vh-320px)]">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
              <Inbox className="h-8 w-8 opacity-40" />
            </div>
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm mt-1">
              {filter === 'unread'
                ? 'You&apos;re all caught up!'
                : 'No notifications match this filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const iconBg = getNotificationIconBg(notification.type);

              return (
                <button
                  key={notification.id}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                  }}
                  className={`group flex w-full items-start gap-4 rounded-lg px-4 py-4 text-left transition-all duration-200 hover:bg-muted/50 ${
                    !notification.isRead ? 'bg-primary/[0.03]' : ''
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-medium truncate ${
                          !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p
                      className={`mt-1 text-sm leading-relaxed ${
                        !notification.isRead ? 'text-foreground/80' : 'text-muted-foreground'
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground/70">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ============ Filter Buttons ============
function NotificationFilters({
  current,
  onChange,
}: {
  current: NotificationFilter;
  onChange: (f: NotificationFilter) => void;
}) {
  return (
    <>
      {FILTER_OPTIONS.map((opt) => (
        <Button
          key={opt.key}
          variant={current === opt.key ? 'default' : 'outline'}
          size="sm"
          className={`rounded-full transition-all duration-200 ${
            current === opt.key
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              : 'hover:bg-muted'
          }`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </Button>
      ))}
    </>
  );
}