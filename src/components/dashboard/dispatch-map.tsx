'use client';

import { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { deliveries, companies, statusLabels } from '@/lib/mock-data';

// ── City Coordinates ──────────────────────────────────────────
const cityCoords: Record<string, [number, number]> = {
  'Maseru': [-29.31, 27.48],
  'Mafeteng': [-29.82, 27.24],
  'Leribe': [-28.88, 28.05],
  'Mohales Hoek': [-29.93, 27.93],
  'Quthing': [-30.40, 27.71],
  'Butha Buthe': [-28.75, 28.25],
  'Berea': [-29.27, 27.84],
  'Mokhotlong': [-29.29, 29.08],
  'Thaba Tseka': [-29.52, 28.25],
  "Qacha's Nek": [-30.12, 28.69],
  'Johannesburg': [-26.20, 28.05],
  'Cape Town': [-33.93, 18.42],
  'Durban': [-29.86, 31.03],
  'Pretoria': [-25.75, 28.19],
  'Bloemfontein': [-29.12, 26.23],
  'Port Elizabeth': [-33.96, 25.60],
  'East London': [-33.02, 27.91],
  'Polokwane': [-23.90, 29.45],
  'Nelspruit': [-25.47, 30.97],
  'Kimberley': [-28.73, 24.77],
};

// ── Status → marker color mapping ─────────────────────────────
const statusMarkerColors: Record<string, string> = {
  collected: '#14b8a6',       // teal
  at_warehouse: '#6366f1',    // indigo
  in_transit: '#10b981',      // emerald
  at_border: '#f59e0b',       // amber
  out_for_delivery: '#06b6d4', // cyan
};

const activeStatuses = Object.keys(statusMarkerColors) as DeliveryStatus[];

type DeliveryStatus = 'collected' | 'at_warehouse' | 'in_transit' | 'at_border' | 'out_for_delivery';

// ── Company locations ─────────────────────────────────────────
const companyLocations = companies.map((c) => ({
  name: c.name,
  city: c.city,
  coords: cityCoords[c.city] || [-29.31, 27.48],
}));

// ── Maseru Border Post ────────────────────────────────────────
const borderPost = {
  name: 'Maseru Border Post',
  coords: [-29.30, 27.53] as [number, number],
};

// ── Legend component (Leaflet Control) ─────────────────────────
function LegendControl() {
  const map = useMap();
  const controlRef = useRef<L.Control | null>(null);

  useEffect(() => {
    const legendHtml = `
      <div style="
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(8px);
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 11px;
        line-height: 1.6;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        border: 1px solid rgba(0,0,0,0.06);
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="font-weight:700; font-size:12px; margin-bottom:4px; color:#1a1a1a;">Delivery Status</div>
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10b981;"></span>
          <span style="color:#374151;">In Transit</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#f59e0b;"></span>
          <span style="color:#374151;">At Border</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#06b6d4;"></span>
          <span style="color:#374151;">Out for Delivery</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#14b8a6;"></span>
          <span style="color:#374151;">Collected</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#6366f1;"></span>
          <span style="color:#374151;">At Warehouse</span>
        </div>
        <div style="font-weight:700; font-size:12px; margin-bottom:4px; margin-top:6px; border-top:1px solid #e5e7eb; padding-top:6px; color:#1a1a1a;">Locations</div>
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:2px; background:#059669;"></span>
          <span style="color:#374151;">Company HQ</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:2px; background:#dc2626; transform:rotate(45deg);"></span>
          <span style="color:#374151;">Border Post</span>
        </div>
      </div>
    `;

    const control = new L.Control({ position: 'bottomright' });
    control.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-legend');
      div.innerHTML = legendHtml;
      return div;
    };
    control.addTo(map);
    controlRef.current = control;

    return () => {
      map.removeControl(control);
      controlRef.current = null;
    };
  }, [map]);

  return null;
}

// ── Fit-bounds helper ─────────────────────────────────────────
function FitBoundsOnLoad({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 8 });
    }
  }, [map, coords]);
  return null;
}

// ── Main DispatchMap Component ────────────────────────────────
export function DispatchMap() {
  // Filter active deliveries
  const activeDeliveries = useMemo(
    () => deliveries.filter((d) => activeStatuses.includes(d.status as DeliveryStatus)),
    []
  );

  // Build marker data with coordinates
  const deliveryMarkers = useMemo(() => {
    return activeDeliveries
      .map((d) => {
        const pickupCoord = cityCoords[d.pickup.city];
        const destCoord = cityCoords[d.destination.city];
        if (!pickupCoord || !destCoord) return null;
        return { delivery: d, pickupCoord, destCoord };
      })
      .filter(Boolean) as Array<{
      delivery: typeof activeDeliveries[number];
      pickupCoord: [number, number];
      destCoord: [number, number];
    }>;
  }, [activeDeliveries]);

  // Collect all coords for fit bounds
  const allCoords = useMemo(() => {
    const coords: [number, number][] = [...companyLocations.map((c) => c.coords), borderPost.coords];
    deliveryMarkers.forEach((m) => {
      coords.push(m.pickupCoord, m.destCoord);
    });
    return coords;
  }, [deliveryMarkers]);

  // Unique company locations (deduplicate by city)
  const uniqueCompanyLocations = useMemo(() => {
    const seen = new Set<string>();
    return companyLocations.filter((c) => {
      if (seen.has(c.city)) return false;
      seen.add(c.city);
      return true;
    });
  }, []);

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-xl border">
      <MapContainer
        center={[-29.5, 28.0]}
        zoom={6}
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LegendControl />
        <FitBoundsOnLoad coords={allCoords} />

        {/* Company Warehouse Markers */}
        {uniqueCompanyLocations.map((loc) => (
          <CircleMarker
            key={`warehouse-${loc.city}`}
            center={loc.coords}
            radius={9}
            pathOptions={{
              color: '#059669',
              fillColor: '#059669',
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px' }}>
                <strong style={{ color: '#059669' }}>📦 {loc.name}</strong>
                <br />
                <span style={{ color: '#6b7280' }}>{loc.city}, Lesotho</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Border Post Marker */}
        <CircleMarker
          center={borderPost.coords}
          radius={8}
          pathOptions={{
            color: '#dc2626',
            fillColor: '#dc2626',
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px' }}>
              <strong style={{ color: '#dc2626' }}>🛂 {borderPost.name}</strong>
              <br />
              <span style={{ color: '#6b7280' }}>Lesotho–South Africa Border</span>
            </div>
          </Popup>
        </CircleMarker>

        {/* Delivery Route Polylines & Markers */}
        {deliveryMarkers.map(({ delivery, pickupCoord, destCoord }) => {
          const color = statusMarkerColors[delivery.status] || '#6b7280';
          return (
            <div key={delivery.id}>
              {/* Dashed route line */}
              <Polyline
                positions={[pickupCoord, destCoord]}
                pathOptions={{
                  color,
                  weight: 1.5,
                  opacity: 0.5,
                  dashArray: '6 4',
                }}
              />
              {/* Pickup marker */}
              <CircleMarker
                center={pickupCoord}
                radius={5}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.8,
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', minWidth: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px' }}>{delivery.trackingNumber}</strong>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '9999px',
                          background: color + '20',
                          color: color,
                          fontWeight: 600,
                        }}
                      >
                        {statusLabels[delivery.status]}
                      </span>
                    </div>
                    <div style={{ color: '#6b7280', lineHeight: 1.5 }}>
                      <div><strong>Customer:</strong> {delivery.customerName}</div>
                      <div><strong>Route:</strong> {delivery.pickup.city} → {delivery.destination.city}</div>
                      <div><strong>Driver:</strong> {delivery.driverName || 'Unassigned'}</div>
                      <div><strong>Vehicle:</strong> {delivery.vehiclePlate || 'Unassigned'}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
              {/* Destination marker */}
              <CircleMarker
                center={destCoord}
                radius={5}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.5,
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', minWidth: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px' }}>{delivery.trackingNumber}</strong>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '9999px',
                          background: color + '20',
                          color: color,
                          fontWeight: 600,
                        }}
                      >
                        {statusLabels[delivery.status]}
                      </span>
                    </div>
                    <div style={{ color: '#6b7280', lineHeight: 1.5 }}>
                      <div><strong>Customer:</strong> {delivery.customerName}</div>
                      <div><strong>Destination:</strong> {delivery.destination.city}, {delivery.destination.country}</div>
                      <div><strong>ETA:</strong> {delivery.estimatedDelivery}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default DispatchMap;