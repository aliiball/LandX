import { cn } from '@/design/recipes';
import maplibregl, { type LngLatLike, type Map as MapLibre, type Marker } from 'maplibre-gl';
import { useEffect, useMemo, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

export type MapMarker = {
  id: string;
  coord: { lat: number; lng: number };
  label?: string;
  color?: string;
  onClick?: () => void;
};

export type MapViewProps = {
  markers?: ReadonlyArray<MapMarker>;
  center?: LngLatLike;
  zoom?: number;
  className?: string;
  interactive?: boolean;
};

// Free CARTO Voyager dark style — no API key needed.
const STYLE_URL = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export function MapView({
  markers = [],
  center = [29.0, 39.5],
  zoom = 5.5,
  className,
  interactive = true,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibre | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());

  const markersKey = useMemo(
    () =>
      markers
        .map((m) => `${m.id}:${m.coord.lat.toFixed(4)},${m.coord.lng.toFixed(4)}:${m.color ?? ''}`)
        .join('|'),
    [markers],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center,
      zoom,
      attributionControl: false,
      interactive,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const existing = markersRef.current;
    const seen = new Set<string>();

    for (const m of markers) {
      seen.add(m.id);
      const prev = existing.get(m.id);
      if (prev) {
        prev.setLngLat([m.coord.lng, m.coord.lat]);
        continue;
      }
      const el = document.createElement('button');
      el.type = 'button';
      el.setAttribute('aria-label', m.label ?? m.id);
      el.className =
        'grid h-7 w-7 cursor-pointer place-items-center rounded-full border-2 border-white/30 shadow-lg outline-none transition-transform hover:scale-110 focus-visible:scale-110';
      el.style.background = m.color ?? 'oklch(0.82 0.16 195)';
      if (m.onClick) el.addEventListener('click', m.onClick);
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([m.coord.lng, m.coord.lat])
        .addTo(map);
      existing.set(m.id, marker);
    }

    for (const [id, marker] of [...existing.entries()]) {
      if (!seen.has(id)) {
        marker.remove();
        existing.delete(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersKey]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || markers.length === 0) return;
    const bounds = new maplibregl.LngLatBounds();
    for (const m of markers) bounds.extend([m.coord.lng, m.coord.lat]);
    map.fitBounds(bounds, { padding: 48, maxZoom: 10, duration: 320 });
  }, [markersKey]);

  return (
    <div
      ref={containerRef}
      className={cn('size-full overflow-hidden rounded-[var(--radius-md)]', className)}
      role="region"
      aria-label="Harita"
    />
  );
}
