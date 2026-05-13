import { Badge, Button, Card, CardBody, CardHeader, Icon, Input, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { apiFetch } from '@/lib/api/client';
import type { BrokerShowcase } from '@/types/broker';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function BrokerShowcaseManagePage() {
  const { data: showcase } = useQuery({
    queryKey: ['broker', 'showcase'],
    queryFn: () => apiFetch<BrokerShowcase>('/broker/showcase'),
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Kamu Vitrini Yönetimi</h1>
        {showcase && (
          <a
            href={`/b/${showcase.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[var(--accent-cyan)] hover:underline"
          >
            Vitrini görüntüle <Icon icon={ExternalLink} size={12} tone="cyan" />
          </a>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <span className="font-medium">Marka kimliği</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <Input label="Ofis adı" defaultValue={showcase?.officeName} />
            <Input
              label="Slug"
              defaultValue={showcase?.slug}
              helpText={`URL: /b/${showcase?.slug}`}
            />
            <Input label="Slogan / Bio" defaultValue={showcase?.bio?.slice(0, 60)} />
            <Button
              tone="agent"
              leftIcon={<Icon icon={Sparkles} size={14} />}
              onClick={() => toast.agent('AI bio önerisi: 3 alternatif hazır')}
            >
              AI bio öneri
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span className="font-medium">İstatistik (son 30 gün)</span>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="Ziyaret" value={`${showcase?.stats.visitsLast30d ?? 0}`} />
            <Stat label="Conv. %" value={`%${showcase?.stats.leadConversion ?? 0}`} />
            <Stat label="Ort. yanıt" value={`${showcase?.stats.avgResponseHours ?? 0}h`} />
            <Stat label="Öne çıkan" value={`${showcase?.featuredListingIds.length ?? 0}`} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={ImageIcon} tone="cyan" />
            <span className="font-medium">Öne çıkarılan ilanlar</span>
          </div>
          <Badge tone="info" size="sm">
            {showcase?.featuredListingIds.length ?? 0} / 12
          </Badge>
        </CardHeader>
        <CardBody className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {showcase?.featuredListingIds.map((id) => (
            <div
              key={id}
              className="aspect-square rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-slate)] p-2 text-center text-xs font-mono"
            >
              {id.slice(-5)}
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Sertifikalar & Uzmanlık</span>
        </CardHeader>
        <CardBody className="flex flex-wrap gap-1.5">
          {showcase?.certifications.map((cert) => (
            <Badge key={cert} tone="success" size="sm" dot>
              {cert}
            </Badge>
          ))}
          {showcase?.specialties.map((s) => (
            <Badge key={s} tone="info" size="sm">
              {s}
            </Badge>
          ))}
        </CardBody>
      </Card>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  );
}
