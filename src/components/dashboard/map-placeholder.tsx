'use client';
import { MapPin, Navigation, Truck, Warehouse, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapPlaceholderProps {
  className?: string;
  height?: string;
  title?: string;
  subtitle?: string;
  markers?: Array<{
    label: string;
    type: 'pickup' | 'destination' | 'driver' | 'warehouse' | 'border';
  }>;
}

export function MapPlaceholder({
  className = '',
  height = 'h-64',
  title = 'Live Map View',
  subtitle = 'Map integration coming soon — GPS tracking will appear here',
  markers = [],
}: MapPlaceholderProps) {
  const typeIcons = {
    pickup: MapPin,
    destination: MapPin,
    driver: Truck,
    warehouse: Warehouse,
    border: Building2,
  };
  const typeColors = {
    pickup: 'bg-blue-500',
    destination: 'bg-orange-500',
    driver: 'bg-orange-500',
    warehouse: 'bg-purple-500',
    border: 'bg-amber-500',
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br from-muted/80 to-muted/40 dark:from-muted/20 dark:to-muted/10 ${className} ${height}`}>
      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Simulated road lines */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 400 300" preserveAspectRatio="none">
        <path d="M0 150 Q100 100 200 150 T400 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 4" className="text-primary" />
        <path d="M50 0 Q150 80 250 50 T400 80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="text-primary/50" />
        <path d="M0 250 Q100 200 200 250 T400 220" fill="none" stroke="currentColor" strokeWidth="1" className="text-orange-500/40" />
      </svg>

      {/* Center content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
        >
          <Navigation className="h-8 w-8 text-primary" />
        </motion.div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
          <MapPin className="h-3 w-3" />
          Maseru, Lesotho
        </span>
      </div>

      {/* Markers */}
      {markers.length > 0 && (
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2">
          {markers.map((m, i) => {
            const Icon = typeIcons[m.type];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-1.5 rounded-full bg-card/90 border px-2.5 py-1 text-[11px] font-medium shadow-sm backdrop-blur-sm"
              >
                <div className={`h-2.5 w-2.5 rounded-full ${typeColors[m.type]}`} />
                <span className="text-foreground">{m.label}</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}