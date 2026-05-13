import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { CheckCircle2, Clock, FileText } from 'lucide-react';

const CONTROLS = [
  { framework: 'KVKK', total: 32, passing: 31, expired: 1 },
  { framework: 'GDPR', total: 28, passing: 27, expired: 1 },
  { framework: 'SOC2', total: 64, passing: 60, expired: 4 },
];

const TICKETS = [
  { id: 'tic_001', title: 'KVKK madde 12 — yıllık denetim', status: 'open', due: '2026-06-15' },
  {
    id: 'tic_002',
    title: 'SOC2 erişim kontrolü kanıt yenile',
    status: 'in_progress',
    due: '2026-05-30',
  },
  { id: 'tic_003', title: 'GDPR DPIA güncelle', status: 'open', due: '2026-07-01' },
];

export default function AdminCompliancePage() {
  return (
    <AdminPage
      surfaceKey="C14 · /admin/compliance"
      module="D03 Compliance"
      title="Compliance"
      actions={
        <Button
          leftIcon={<Icon icon={FileText} size={14} />}
          onClick={() => toast.success('Audit hazırlık raporu PDF')}
        >
          Audit raporu
        </Button>
      }
      kpis={[
        { label: 'KVKK', value: '%97', tone: 'lime' },
        { label: 'GDPR', value: '%96', tone: 'lime' },
        { label: 'SOC2', value: '%94', tone: 'amber' },
        { label: 'Açık ticket', value: '6', tone: 'amber' },
      ]}
    >
      <div className="grid gap-3 md:grid-cols-3">
        {CONTROLS.map((c) => (
          <Card key={c.framework}>
            <CardHeader>
              <span className="font-medium">{c.framework}</span>
              <Badge tone={c.expired === 0 ? 'success' : 'warning'} size="sm">
                {c.passing}/{c.total}
              </Badge>
            </CardHeader>
            <CardBody className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Icon icon={CheckCircle2} size={14} tone="lime" />
                <span>{c.passing} pass</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon={Clock} size={14} tone="amber" />
                <span>{c.expired} kanıt taze değil</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <span className="font-medium">Ticket'lar</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          {TICKETS.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-2"
            >
              <div>
                <p className="font-mono text-xs text-[var(--text-tertiary)]">{t.id}</p>
                <p>{t.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={t.status === 'open' ? 'warning' : 'info'} size="sm">
                  {t.status}
                </Badge>
                <span className="text-xs text-[var(--text-tertiary)]">{t.due}</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </AdminPage>
  );
}
