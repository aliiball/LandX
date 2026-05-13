import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { FileText, MessageSquare, Sparkles, TrendingUp, Users } from 'lucide-react';

const TOOLS = [
  {
    id: 'rewrite',
    icon: FileText,
    title: 'Toplu açıklama yeniden yazma',
    body: 'Seçili ilanlar için AI yeni açıklama üretir. Tonu seçilebilir.',
    cta: 'Çalıştır',
    tone: 'violet' as const,
    onRun: () => toast.agent('12 ilan için açıklamalar hazırlandı, onayınız bekleniyor'),
  },
  {
    id: 'price',
    icon: TrendingUp,
    title: 'Toplu fiyat optimizasyonu',
    body: 'AI değerleme ile fiyat sapması raporu (over/under-priced).',
    cta: 'Rapor üret',
    tone: 'cyan' as const,
    onRun: () => toast.agent('4 ilan over-priced, 2 ilan under-priced tespit edildi'),
  },
  {
    id: 'segment',
    icon: Users,
    title: 'Müşteri segmentasyonu',
    body: 'Clients tablosundan AI ile segment çıkarma (yatırımcı / yerleşim / tarımsal / ticari).',
    cta: 'Segment et',
    tone: 'amber' as const,
    onRun: () =>
      toast.agent('4 segment oluşturuldu: 8 yatırımcı, 5 yerleşim, 3 tarımsal, 2 ticari'),
  },
  {
    id: 'followup',
    icon: MessageSquare,
    title: 'Otomatik takip mesajı',
    body: "Segment-aware AI mesaj şablonu — onay sonrası B5 messaging'e gönderim.",
    cta: 'Şablon üret',
    tone: 'magenta' as const,
    onRun: () => toast.agent('18 müşteri için takip mesajı hazır, onayınız bekleniyor'),
  },
  {
    id: 'priority',
    icon: Sparkles,
    title: 'AI Lead Prioritizer',
    body: "Günün en sıcak 5 lead'ini sıralar, broker-admin için.",
    cta: 'Sırala',
    tone: 'lime' as const,
    onRun: () =>
      toast.agent("Bugünün top 5 lead'i: Cenk B., Defne K., Mert A., Hasan T., Sevgi P."),
  },
];

export default function BrokerAiToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Broker AI Araçları</h1>
        <p className="text-[var(--text-secondary)]">
          Toplu operasyonlar — her biri onay gerektiren AI tool çağrısı.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {TOOLS.map((tool) => (
          <Card key={tool.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon icon={tool.icon} tone={tool.tone} />
                <span className="font-medium">{tool.title}</span>
              </div>
              <Badge tone="agent" size="sm" dot>
                AI
              </Badge>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              <p className="text-sm text-[var(--text-secondary)]">{tool.body}</p>
              <Button onClick={tool.onRun} tone="agent">
                {tool.cta}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
