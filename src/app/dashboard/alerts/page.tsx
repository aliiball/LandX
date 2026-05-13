import { Badge, Button, Card, CardBody, CardHeader, Icon, Switch, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { apiFetch } from '@/lib/api/client';
import type { Alert } from '@/types/messaging';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';

export default function AlertsPage() {
  const { data } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => apiFetch<{ items: Alert[] }>('/alerts'),
  });
  const alerts = data?.items ?? [];

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Kayıtlı Aramalar & Uyarılar</h1>
        <Button onClick={() => toast.success('Arama oluştur — kriter seç')}>+ Yeni</Button>
      </header>

      <div className="grid gap-3">
        {alerts.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Icon icon={Bell} tone={a.enabled ? 'cyan' : 'tertiary'} />
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {Object.entries(a.filters)
                      .map(([k, v]) => `${k}=${v}`)
                      .join(' · ')}
                  </p>
                </div>
              </div>
              <Switch
                defaultChecked={a.enabled}
                onChange={() => toast.show(a.enabled ? `${a.name} devre dışı` : `${a.name} aktif`)}
              />
            </CardHeader>
            <CardBody className="flex items-center justify-between text-sm">
              <div className="flex flex-wrap gap-1.5">
                {a.channels.map((c) => (
                  <Badge key={c} tone="neutral" size="sm">
                    {c}
                  </Badge>
                ))}
              </div>
              <span className="text-[var(--text-tertiary)]">{a.matchCount} eşleşme bulundu</span>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
