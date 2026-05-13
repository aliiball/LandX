import { Badge, Button, Card, CardBody, CardHeader, Icon, Tabs, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { Bot, Fingerprint, Key, Monitor, Smartphone } from 'lucide-react';

const SESSIONS = [
  {
    id: 's1',
    device: 'MacBook Pro · Chrome 124',
    location: 'İstanbul, TR',
    current: true,
    icon: Monitor,
  },
  {
    id: 's2',
    device: 'iPhone 15 · Safari',
    location: 'İstanbul, TR',
    current: false,
    icon: Smartphone,
  },
  { id: 's3', device: 'iPad · Safari', location: 'Bodrum, TR', current: false, icon: Smartphone },
];

const PASSKEYS = [
  { id: 'p1', label: 'MacBook Touch ID', addedAt: '2026-02-12' },
  { id: 'p2', label: 'iPhone Face ID', addedAt: '2026-03-04' },
];

const AGENT_TOKENS = [
  { id: 'a1', name: 'AI Asistan token', scope: ['search', 'valuation'], lastUsed: '2 saat önce' },
  { id: 'a2', name: 'Q&A bot', scope: ['qa.ask'], lastUsed: '4 gün önce' },
];

export default function SecurityPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Güvenlik</h1>
      </header>

      <Tabs
        items={[
          {
            id: 'sessions',
            label: 'Oturumlar',
            content: (
              <Card>
                <CardBody className="flex flex-col gap-2">
                  {SESSIONS.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Icon icon={s.icon} tone="cyan" />
                        <div>
                          <p className="font-medium">{s.device}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{s.location}</p>
                        </div>
                      </div>
                      {s.current ? (
                        <Badge tone="success" size="sm">
                          Bu cihaz
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          tone="ghost"
                          onClick={() => toast.success(`${s.device} oturumu sonlandırıldı`)}
                        >
                          Çıkış yap
                        </Button>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>
            ),
          },
          {
            id: 'passkeys',
            label: 'Passkeys',
            content: (
              <Card>
                <CardHeader>
                  <span className="font-medium">Kayıtlı passkey'ler</span>
                  <Button
                    size="sm"
                    leftIcon={<Icon icon={Fingerprint} size={14} />}
                    onClick={() => toast.success('Yeni passkey eklendi')}
                  >
                    Ekle
                  </Button>
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                  {PASSKEYS.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon={Key} tone="cyan" size={16} />
                        <span>{p.label}</span>
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)]">{p.addedAt}</span>
                    </div>
                  ))}
                </CardBody>
              </Card>
            ),
          },
          {
            id: 'agents',
            label: 'Agent Token',
            content: (
              <Card>
                <CardHeader>
                  <span className="font-medium">Agent token'larım (I03)</span>
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                  {AGENT_TOKENS.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Icon icon={Bot} tone="magenta" />
                        <div>
                          <p className="font-medium">{a.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">
                            scope: {a.scope.join(', ')} · son: {a.lastUsed}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        tone="ghost"
                        onClick={() => toast.error(`${a.name} iptal edildi`)}
                      >
                        İptal
                      </Button>
                    </div>
                  ))}
                </CardBody>
              </Card>
            ),
          },
        ]}
      />
    </main>
  );
}
