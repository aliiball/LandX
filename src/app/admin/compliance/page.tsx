import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { getComplianceControls, getCompliancePosture, getDsarRequests } from '@/mocks/seed/admin';
import type { ComplianceControl, ComplianceFramework } from '@/types/admin';
import { CheckCircle2, FileDown, FileText, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

const STATUS_TONE: Record<ComplianceControl['status'], 'success' | 'warning' | 'danger' | 'info'> =
  {
    met: 'success',
    partial: 'warning',
    unmet: 'danger',
    na: 'info',
  };

const FW_TONE: Record<ComplianceFramework, 'info' | 'agent' | 'success' | 'warning' | 'danger'> = {
  KVKK: 'agent',
  VERBIS: 'warning',
  GDPR: 'info',
  SOC2: 'success',
  ISO27001: 'info',
  NIS2: 'warning',
  'AI-Act': 'agent',
};

export default function AdminCompliancePage() {
  const controls = getComplianceControls();
  const posture = getCompliancePosture();
  const dsars = getDsarRequests();
  const [fw, setFw] = useState<ComplianceFramework | 'all'>('all');
  const filtered = fw === 'all' ? controls : controls.filter((c) => c.framework === fw);
  const frameworks = Array.from(new Set(controls.map((c) => c.framework))) as ComplianceFramework[];

  return (
    <AdminPage
      surfaceKey="C · /admin/compliance"
      module="D03 Compliance Framework"
      title="Uyum Posture"
      description="KVKK / VERBİS / GDPR / SOC2 / ISO27001 — 13 kontrol, posture skoru, kanıt tazeliği."
      actions={
        <>
          <Button
            tone="ghost"
            size="sm"
            leftIcon={<Icon icon={FileDown} size={14} />}
            onClick={() => toast.success('Yıllık uyum raporu (PDF) hazırlanıyor')}
          >
            Yıllık rapor
          </Button>
          <Button
            tone="primary"
            size="sm"
            leftIcon={<Icon icon={FileText} size={14} />}
            onClick={() => toast.show('Audit hazırlık paketi indiriliyor')}
          >
            Kanıt paketi
          </Button>
        </>
      }
      kpis={[
        { label: 'Overall posture', value: `%${posture.overallScore}`, tone: 'lime' },
        {
          label: 'Met',
          value: String(controls.filter((c) => c.status === 'met').length),
          tone: 'lime',
        },
        {
          label: 'Partial',
          value: String(controls.filter((c) => c.status === 'partial').length),
          tone: 'amber',
        },
        {
          label: 'Unmet',
          value: String(controls.filter((c) => c.status === 'unmet').length),
          tone: 'magenta',
        },
        {
          label: 'DSAR aktif',
          value: String(dsars.filter((d) => d.status !== 'fulfilled').length),
          tone: 'cyan',
        },
      ]}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {posture.byFramework.map((f) => (
          <Card key={f.framework}>
            <CardBody className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  {f.framework}
                </span>
                <Badge size="sm" tone={FW_TONE[f.framework as ComplianceFramework] ?? 'info'}>
                  {f.gaps} gap
                </Badge>
              </div>
              <span className="text-2xl font-semibold tabular-nums">%{f.score}</span>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--accent-lime)]"
                  style={{ width: `${f.score}%` }}
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">Kontroller</span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setFw('all')}
                className={`rounded-full border px-3 py-1 text-xs ${fw === 'all' ? 'border-[var(--accent-cyan)] text-[var(--accent-cyan)]' : 'border-[var(--stroke-subtle)] text-[var(--text-secondary)]'}`}
              >
                Tümü
              </button>
              {frameworks.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFw(f)}
                  className={`rounded-full border px-3 py-1 text-xs ${fw === f ? 'border-[var(--accent-cyan)] text-[var(--accent-cyan)]' : 'border-[var(--stroke-subtle)] text-[var(--text-secondary)]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <AdminTable
            columns={[
              { key: 'fw', label: 'Framework' },
              { key: 'code', label: 'Kod' },
              { key: 'title', label: 'Başlık' },
              { key: 'status', label: 'Durum' },
              { key: 'fresh', label: 'Kanıt yaşı', align: 'right' },
              { key: 'owner', label: 'Sahip' },
              { key: 'next', label: 'Sonraki yenileme' },
            ]}
            rows={filtered.map((c) => ({
              fw: (
                <Badge size="sm" tone={FW_TONE[c.framework]}>
                  {c.framework}
                </Badge>
              ),
              code: <span className="font-mono text-xs">{c.code}</span>,
              title: <span className="text-sm">{c.title}</span>,
              status: (
                <Badge tone={STATUS_TONE[c.status]} size="sm">
                  {c.status}
                </Badge>
              ),
              fresh: (
                <span
                  className={`tabular-nums text-xs ${c.evidenceFreshDays > 180 ? 'text-[var(--accent-magenta)]' : 'text-[var(--text-secondary)]'}`}
                >
                  {c.evidenceFreshDays}g
                </span>
              ),
              owner: <span className="font-mono text-xs">{c.ownerEmail}</span>,
              next: (
                <span className="text-xs">{new Date(c.nextDueAt).toLocaleDateString('tr-TR')}</span>
              ),
            }))}
          />
        </CardBody>
      </Card>

      <Card tone="solid">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={ShieldAlert} tone="magenta" />
            <span className="font-medium">Kritik gaps</span>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          {controls
            .filter((c) => c.status !== 'met')
            .slice(0, 4)
            .map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <Icon icon={CheckCircle2} size={14} tone="amber" />
                <span>
                  <span className="font-mono text-xs">
                    {c.framework} / {c.code}
                  </span>{' '}
                  — {c.title}{' '}
                  {c.notes && <span className="text-[var(--text-tertiary)]">· {c.notes}</span>}
                </span>
              </div>
            ))}
        </CardBody>
      </Card>
    </AdminPage>
  );
}
