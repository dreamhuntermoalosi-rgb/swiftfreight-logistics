'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuthStore, useMessageStore, useNavStore } from '@/lib/store';
import { messages as mockMessages, deliveries, statusLabels, statusColors } from '@/lib/mock-data';
import type { Message } from '@/lib/types';
import {
  Search, Send, Paperclip, MessageSquare, Package, MapPin,
  ChevronRight, Truck, Clock, ExternalLink, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Helpers ──────────────────────────────────────────────────
function formatMessageTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// ── Conversation type ────────────────────────────────────────
interface Conversation {
  contactId: string;
  contactName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
  linkedDeliveryId?: string;
}

// ── Main Component ──────────────────────────────────────────
export function MessagesTab() {
  const { currentUser } = useAuthStore();
  const { activeConversation, setActiveConversation, addMessage } = useMessageStore();
  const { setDashboardTab, selectDelivery } = useNavStore();
  const [search, setSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>(mockMessages);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Build conversations from messages, grouped by contact
  const conversations = useMemo(() => {
    const userId = currentUser?.id || 'user-co1';
    const convMap = new Map<string, Message[]>();

    for (const msg of localMessages) {
      const isSender = msg.senderId === userId;
      const contactId = isSender ? msg.recipientId : msg.senderId;
      const contactName = isSender ? msg.recipientName : msg.senderName;
      const key = contactId;
      if (!convMap.has(key)) convMap.set(key, []);
      convMap.get(key)!.push(msg);
    }

    const convs: Conversation[] = [];
    for (const [contactId, msgs] of convMap) {
      const sorted = [...msgs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const lastMsg = sorted[sorted.length - 1];
      const unread = sorted.filter(m => m.recipientId === userId && !m.isRead).length;
      const linkedDeliveryId = sorted.find(m => m.deliveryId)?.deliveryId;
      convs.push({
        contactId,
        contactName: lastMsg.senderId === userId ? lastMsg.recipientName : lastMsg.senderName,
        lastMessage: lastMsg.content,
        lastMessageTime: lastMsg.createdAt,
        unreadCount: unread,
        messages: sorted,
        linkedDeliveryId,
      });
    }

    return convs.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  }, [localMessages, currentUser]);

  const filteredConversations = useMemo(() => {
    if (!search) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(c => c.contactName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q));
  }, [conversations, search]);

  const activeConv = useMemo(() => {
    if (!activeConversation) return null;
    return conversations.find(c => c.contactId === activeConversation) || null;
  }, [activeConversation, conversations]);

  const linkedDelivery = useMemo(() => {
    if (!activeConv?.linkedDeliveryId) return null;
    return deliveries.find(d => d.id === activeConv.linkedDeliveryId) || null;
  }, [activeConv]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConv?.messages.length]);

  function handleSelectConversation(contactId: string) {
    setActiveConversation(contactId);
    const userId = currentUser?.id || 'user-co1';
    setLocalMessages(prev => prev.map(m =>
      m.recipientId === userId && m.senderId === contactId && !m.isRead
        ? { ...m, isRead: true }
        : m
    ));
  }

  function handleSend() {
    if (!messageInput.trim() || !activeConversation) return;
    const userId = currentUser?.id || 'user-co1';
    const userName = currentUser?.name || 'Current User';
    const conv = conversations.find(c => c.contactId === activeConversation);
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      senderName: userName,
      recipientId: activeConversation,
      recipientName: conv?.contactName || 'Contact',
      deliveryId: conv?.linkedDeliveryId,
      content: messageInput.trim(),
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    setLocalMessages(prev => [...prev, newMsg]);
    addMessage(newMsg);
    setMessageInput('');

    // Simulate reply after 2s
    if (conv) {
      setTimeout(() => {
        const replies = [
          'Got it, thanks for the update!',
          'I will check on that right away.',
          'Noted. I will get back to you shortly.',
          'Thank you for letting me know.',
          'Sure, I will handle it.',
        ];
        const replyMsg: Message = {
          id: `msg-reply-${Date.now()}`,
          senderId: conv.contactId,
          senderName: conv.contactName,
          recipientId: userId,
          recipientName: userName,
          deliveryId: conv.linkedDeliveryId,
          content: replies[Math.floor(Math.random() * replies.length)],
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setLocalMessages(prev => [...prev, replyMsg]);
        addMessage(replyMsg);
      }, 2000);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleViewDelivery() {
    if (linkedDelivery) {
      selectDelivery(linkedDelivery.id);
      setDashboardTab('deliveries');
    }
  }

  const userId = currentUser?.id || 'user-co1';

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[500px] flex-col overflow-hidden rounded-lg border lg:h-[calc(100vh-10rem)]">
      {/* Mobile: show conversation list or chat, not both */}
      {/* Desktop: 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Conversations List */}
        <div className={`w-full shrink-0 flex-col border-r md:w-80 lg:flex ${activeConv ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-3">
            <h2 className="mb-3 text-base font-bold">Messages</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-2 pb-2">
              {filteredConversations.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No conversations found
                </div>
              )}
              {filteredConversations.map(conv => (
                <button
                  key={conv.contactId}
                  onClick={() => handleSelectConversation(conv.contactId)}
                  className={`mb-1 flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-all duration-150 ${
                    activeConversation === conv.contactId
                      ? 'bg-primary/10 text-foreground'
                      : 'hover:bg-muted/50 active:bg-muted'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                        {getInitials(conv.contactName)}
                      </AvatarFallback>
                    </Avatar>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-medium">{conv.contactName}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {timeAgo(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="truncate text-xs text-muted-foreground">{conv.lastMessage}</p>
                    </div>
                    {conv.linkedDeliveryId && (
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-primary/70">
                        <Package className="h-3 w-3" />
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-medium">Linked to delivery</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Middle Panel: Chat Area */}
        <div className={`flex flex-1 flex-col ${!activeConv ? 'hidden lg:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setActiveConversation(null)}
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {getInitials(activeConv.contactName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{activeConv.contactName}</p>
                    {activeConv.linkedDeliveryId && (
                      <button
                        onClick={handleViewDelivery}
                        className="flex items-center gap-1 text-[10px] text-primary hover:underline"
                      >
                        <Package className="h-3 w-3" />
                        View linked delivery
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="mx-auto max-w-2xl space-y-3">
                  <AnimatePresence>
                    {activeConv.messages.map((msg, i) => {
                      const isSent = msg.senderId === userId;
                      const showAvatar = i === 0 || activeConv.messages[i - 1]?.senderId !== msg.senderId;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isSent && showAvatar && (
                            <Avatar className="mt-1 h-7 w-7 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                                {getInitials(msg.senderName)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {!isSent && !showAvatar && <div className="w-7 shrink-0" />}
                          <div className={`max-w-[75%] ${isSent ? 'items-end' : 'items-start'}`}>
                            <div
                              className={`rounded-2xl px-3.5 py-2 ${
                                isSent
                                  ? 'rounded-br-sm bg-primary text-primary-foreground'
                                  : 'rounded-bl-sm bg-muted'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                            <p className={`mt-1 text-[10px] text-muted-foreground ${isSent ? 'text-right' : 'text-left'}`}>
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-3">
                <div className="mx-auto flex max-w-2xl items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0" onClick={() => toast.info('Attachments coming soon')}>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    size="icon"
                    className="shrink-0 bg-green-600 hover:bg-green-700"
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Select a conversation</h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>

        {/* Right Panel: Delivery Context */}
        {linkedDelivery && activeConv && (
          <div className="hidden w-64 shrink-0 flex-col border-l xl:flex">
            <div className="border-b p-3">
              <p className="text-xs font-medium text-muted-foreground">Context</p>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                <Card className="border-0 shadow-none">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="flex items-center gap-2 text-xs font-medium">
                      <Package className="h-3.5 w-3.5 text-primary" />
                      Linked Delivery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-3 pt-0">
                    <div>
                      <p className="font-mono text-xs font-bold text-primary">{linkedDelivery.trackingNumber}</p>
                    </div>
                    <Badge className={statusColors[linkedDelivery.status]}>
                      {statusLabels[linkedDelivery.status]}
                    </Badge>
                    <Separator />
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                        <div>
                          <p className="font-medium">Pickup</p>
                          <p className="text-muted-foreground">{linkedDelivery.pickup.city}, {linkedDelivery.pickup.country}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                        <div>
                          <p className="font-medium">Destination</p>
                          <p className="text-muted-foreground">{linkedDelivery.destination.city}, {linkedDelivery.destination.country}</p>
                        </div>
                      </div>
                    </div>
                    {linkedDelivery.driverName && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-2 text-xs">
                          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{linkedDelivery.driverName}</span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs" onClick={handleViewDelivery}>
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Delivery
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1.5 text-xs"
                        onClick={() => {
                          toast.success('Status Updated', { description: 'Status update sent' });
                        }}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        Update Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}