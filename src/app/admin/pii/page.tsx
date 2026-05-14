import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, Tabs, toast } from '@/components/ui';
import { getDsarRequests, getPiiFields } from '@/mocks/seed/admin';
import type { DsarStatus, PiiClassification } from '@/types/admin';
import { EyeOff, ScanLine, ShieldHalf, UserCheck } from 'lucide-react';

const CLASS_TONE: Record<PiiClassification, 'info' | 'warning' | 'danger' | 'success'> = {
  public: 'success',
  internal: 'info',
  pii: 'warning',
  'sensitive-pii': 'danger',
  special: 'danger',
};

const STATUS_TONE: Record<DsarStatus, 'info' | 'warning' | 'danger' | 'success'> = {
  open: 'warning',
  'in-progress': 'info',
  fulfilled: 'success',
  rejected: 'danger',
  expired: 'danger',
};

export default function AdminPiiPage() {
  const fields = getPiiFields();
  const dsars = getDsarRequests();

  const byClass = (cls: PiiClassification) => fields.filter((f) => f.classification === cls).length;

  return (
    <AdminPage
      surfaceKey="C · /admin/pii"
      module="D02 PII Governance"
      title="PII / DSAR"
      description="KVKK m.5/2c · m.6 · m.11 — alan bazlı sınıflandırma, DSAR akışı, masking, AI rediscovery."
      actions={
        <Button
          tone="agent"
          size="sm"
          leftIcon={<Icon icon={ScanLine} size={14} />}
          onClick={() => toast.agent('AI rediscovery başlatıldı — 3 yeni alan adayı bulundu')}
        >
          AI ile yeniden tara
        </Button>
      }
      kpis={[
        { label: 'PII alanı', value: String(byClass('pii')), tone: 'amber' },
        {
          label: 'Hassas PII',
          value: String(byClass('sensitive-pii') + byClass('special')),
          tone: 'magenta',
        },
        {
          label: 'DSAR açık',
          value: String(
            dsars.filter((d) => d.status !== 'fulfilled' && d.status !== 'rejected').length,
          ),
          tone: 'cyan',
        },
        { label: '30g uyum', value: '4/5', tone: 'lime' },
      ]}
    >
      <Tabs
        items={[
          {
            id: 'classification',
            label: 'Classification',
            content: (
              <AdminTable
                title={`Alan sınıflandırma (${fields.length})`}
                columns={[
                  { key: 'col', label: 'Alan' },
                  { key: 'cls', label: 'Sınıf' },
                  { key: 'basis', label: 'KVKK Hukuki Sebebi' },
                  { key: 'retention', label: 'Saklama', align: 'right' },
                  { key: 'mask', label: 'Mask Kuralı' },
                ]}
                rows={fields.map((f) => ({
                  col: (
                    <span className="font-mono text-xs">
                      {f.table}.{f.column}
                    </span>
                  ),
                  cls: (
                    <Badge tone={CLASS_TONE[f.classification]} size="sm">
                      {f.classification}
                    </Badge>
                  ),
                  basis: <span className="text-xs">{f.kvkkBasis}</span>,
                  retention: <span className="tabular-nums">{f.retentionYears}y</span>,
                  mask: <span className="font-mono text-xs">{f.maskRule}</span>,
                }))}
              />
            ),
          },
          {
            id: 'dsar',
            label: `DSAR (${dsars.length})`,
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon icon={UserCheck} tone="cyan" />
                    <span className="font-medium">KVKK m.11 talepleri</span>
                  </div>
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                  {dsars.map((d) => {
                    const dlMs = new Date(d.deadline).getTime() - Date.now();
                    const dlDays = Math.round(dlMs / (24 * 60 * 60 * 1000));
                    return (
                      <div
                        key={d.id}
                        className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Badge tone={STATUS_TONE[d.status]} size="sm">
                              {d.status}
                            </Badge>
                            <Badge tone="info" size="sm">
                              {d.kind}
                            </Badge>
                            <span className="font-medium">{d.subjectName}</span>
                            <span className="text-xs text-[var(--text-tertiary)]">
                              {d.subjectEmail}
                            </span>
                          </div>
                          <span className="text-xs text-[var(--text-secondary)]">
                            Kapsam: {d.scopeTables.join(', ')}
                          </span>
                          {d.notes && <span className="text-xs italic">{d.notes}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs ${dlDays < 7 ? 'text-[var(--accent-magenta)]' : 'text-[var(--text-tertiary)]'}`}
                          >
                            {dlDays > 0 ? `${dlDays}g kaldı` : `${Math.abs(dlDays)}g aşıldı`}
                          </span>
                          <Button
                            size="sm"
                            tone="ghost"
                            onClick={() => toast.show(`${d.id} işleme alındı`)}
                          >
                            İşle
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardBody>
              </Card>
            ),
          },
          {
            id: 'masking',
            label: 'Masking',
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon icon={EyeOff} tone="amber" />
                    <span className="font-medium">Mask politikaları</span>
                  </div>
                </CardHeader>
                <CardBody className="grid gap-3 sm:grid-cols-2">
                  {fields.slice(0, 8).map((f) => (
                    <div
                      key={f.id}
                      className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs">
                          {f.table}.{f.column}
                        </span>
                        <Badge tone={CLASS_TONE[f.classification]} size="sm">
                          {f.classification}
                        </Badge>
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)]">Mask kuralı:</span>
                      <span className="font-mono text-sm">{f.maskRule}</span>
                    </div>
                  ))}
                </CardBody>
              </Card>
            ),
          },
          {
            id: 'discovery',
            label: 'AI Discovery',
            content: (
              <Card tone="solid">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon icon={ShieldHalf} tone="violet" />
                    <span className="font-medium">AI ile yeniden sınıflandırma</span>
                  </div>
                </CardHeader>
                <CardBody className="flex flex-col gap-3 text-sm">
                  <p>
                    Son tarama:{' '}
                    <span className="font-mono text-xs text-[var(--text-tertiary)]">
                      2026-05-13 22:14 UTC+3
                    </span>
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2">
                      <Badge tone="warning" size="sm">
                        PII
                      </Badge>
                      <span>
                        <span className="font-mono text-xs">listings.ownerNote</span> içinde 7
                        satırda telefon regex eşleşmesi
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge tone="danger" size="sm">
                        SENSITIVE
                      </Badge>
                      <span>
                        <span className="font-mono text-xs">messages.body</span> içinde 2 satırda
                        TCKN eşleşmesi
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge tone="info" size="sm">
                        INTERNAL
                      </Badge>
                      <span>
                        <span className="font-mono text-xs">audit.meta</span> içinde IP
                        fragment'ları — son-oktet truncate önerisi
                      </span>
                    </li>
                  </ul>
                  <Button
                    tone="agent"
                    size="sm"
                    onClick={() =>
                      toast.agent('Önerilen kurallar oluşturuldu, gözden geçirme bekleniyor')
                    }
                  >
                    Önerileri uygula
                  </Button>
                </CardBody>
              </Card>
            ),
          },
        ]}
      />
    </AdminPage>
  );
}
