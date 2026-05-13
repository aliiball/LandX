import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { CheckCircle2, ClipboardCheck, Clock, FileText, Upload } from 'lucide-react';
import { useState } from 'react';

type DocStatus = 'pending' | 'uploaded' | 'verified';

const INITIAL_DOCS: Array<{ id: string; name: string; description: string; status: DocStatus }> = [
  {
    id: 'tc',
    name: 'TC Kimlik (Ön/Arka)',
    description: 'Bireysel kullanıcılar için zorunlu',
    status: 'verified',
  },
  {
    id: 'tapu',
    name: 'Tapu Belgesi',
    description: 'İlan vermek için zorunlu',
    status: 'uploaded',
  },
  {
    id: 'vergi',
    name: 'Vergi Levhası',
    description: 'Profesyonel/Kurumsal hesap',
    status: 'pending',
  },
];

const STATUS_META: Record<
  DocStatus,
  {
    icon: React.ComponentProps<typeof Icon>['icon'];
    tone: React.ComponentProps<typeof Icon>['tone'];
    label: string;
  }
> = {
  pending: { icon: Clock, tone: 'tertiary', label: 'Bekliyor' },
  uploaded: { icon: ClipboardCheck, tone: 'amber', label: 'İnceleniyor' },
  verified: { icon: CheckCircle2, tone: 'lime', label: 'Doğrulandı' },
};

export default function KycPage() {
  const [docs, setDocs] = useState(INITIAL_DOCS);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Kimlik & Tapu Doğrulama</h1>
        <p className="text-[var(--text-secondary)]">
          KVKK uyumlu, hash chain'li audit trail ile saklanır.
        </p>
      </header>

      <Card>
        <CardBody className="flex flex-col gap-3">
          {docs.map((d) => {
            const meta = STATUS_META[d.status];
            return (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <Icon icon={FileText} tone="cyan" />
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{d.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    tone={
                      d.status === 'verified'
                        ? 'success'
                        : d.status === 'uploaded'
                          ? 'warning'
                          : 'neutral'
                    }
                    size="sm"
                    dot
                  >
                    <Icon icon={meta.icon} tone={meta.tone} size={12} />
                    <span>{meta.label}</span>
                  </Badge>
                  {d.status !== 'verified' && (
                    <Button
                      size="sm"
                      tone="ghost"
                      leftIcon={<Icon icon={Upload} size={14} />}
                      onClick={() => {
                        setDocs((prev) =>
                          prev.map((doc) =>
                            doc.id === d.id ? { ...doc, status: 'uploaded' } : doc,
                          ),
                        );
                        toast.success(`${d.name} yüklendi, inceleme kuyruğuna alındı`);
                      }}
                    >
                      Yükle
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      <Card tone="strong">
        <CardHeader>
          <span className="font-medium">Tapu OCR (AI)</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          <p className="text-[var(--text-secondary)]">
            Tapu PDF/foto yükleyin — AI otomatik olarak ada/parsel/yüzölçümü/cins alanlarını
            çıkarır.
          </p>
          <Button tone="agent" onClick={() => toast.agent('OCR çalıştı, alanlar doldu')}>
            Tapuyu OCR ile oku
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
