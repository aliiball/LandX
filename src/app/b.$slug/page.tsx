import { SurfacePlaceholder } from '@/components/layout/SurfacePlaceholder';
import { useParams } from 'react-router';

export default function BrokerPublicShowcasePlaceholder() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <SurfacePlaceholder
      surfaceKey={`Public Broker Showcase · /b/${slug ?? ''}`}
      title="Emlakçı Kamu Vitrini"
      subtitle="Phase 3.5 + Phase 7'de SSG ile prerender edilecek (PROMPT §7.B'.B'6 + R-08)."
      accent="amber"
    />
  );
}
