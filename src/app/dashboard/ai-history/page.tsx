import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { Bot, Brain, MessageCircle, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Conv = {
  id: string;
  title: string;
  model: string;
  preview: string;
  messages: number;
  totalTokens: number;
  cost: number;
  startedAt: string;
};

const INITIAL: Conv[] = [
  {
    id: 'cv_001',
    title: 'Beykoz arsa karşılaştırma',
    model: 'claude-sonnet-4-6',
    preview:
      '"Beykoz’da 5000+ m² imarlı 2.5M altı arsa öner" — 3 sonuç bulundu, lst_00214 önerildi.',
    messages: 8,
    totalTokens: 1840,
    cost: 0.04,
    startedAt: minAgo(18),
  },
  {
    id: 'cv_002',
    title: 'Çeşme bölgesi yatırım analizi',
    model: 'claude-opus-4-7',
    preview: 'Son 12 ay Çeşme/Reisdere bölgesi %18 değer artışı. Lst_00321 değerleme güven %92.',
    messages: 14,
    totalTokens: 6240,
    cost: 0.42,
    startedAt: minAgo(72),
  },
  {
    id: 'cv_003',
    title: 'TKGM hata neden başarısız?',
    model: 'claude-haiku-4-5',
    preview: 'E001: ada/parsel kombinasyonu geçersiz. Pafta bilgisi de gerekli — kontrol edin.',
    messages: 4,
    totalTokens: 480,
    cost: 0.01,
    startedAt: minAgo(180),
  },
  {
    id: 'cv_004',
    title: 'KVKK DSAR şablonu yaz',
    model: 'claude-haiku-4-5',
    preview: 'DSAR ack mesajı v1.0.0 ile yazıldı. 30g sayaç başlatıldı.',
    messages: 3,
    totalTokens: 620,
    cost: 0.01,
    startedAt: minAgo(560),
  },
  {
    id: 'cv_005',
    title: 'Listing açıklaması — Bodrum',
    model: 'claude-sonnet-4-6',
    preview: '"Yalıçiftlik 2.200m² turizm imarlı" → 6 paragraflık satıcı odaklı açıklama.',
    messages: 6,
    totalTokens: 1240,
    cost: 0.06,
    startedAt: minAgo(1440),
  },
  {
    id: 'cv_006',
    title: 'Risk skoru açıkla',
    model: 'claude-opus-4-7',
    preview:
      'lst_00102 için risk skoru 0.34 → düşük. Yüksek faktör: imar onaylı + tapu doğrulandı.',
    messages: 5,
    totalTokens: 2480,
    cost: 0.18,
    startedAt: minAgo(2880),
  },
  {
    id: 'cv_007',
    title: 'Hisseli tapu nedir?',
    model: 'claude-haiku-4-5',
    preview:
      'Hisseli tapuda parsel tek mülk, mülkiyet hisseler halinde paylaşılmış. Hisse oranı önemli.',
    messages: 4,
    totalTokens: 380,
    cost: 0.01,
    startedAt: minAgo(4320),
  },
];

function minAgo(m: number) {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}

export default function DashboardAiHistoryPage() {
  const [convs, setConvs] = useState(INITIAL);
  return (
    <AdminPage
      surfaceKey="B · /dashboard/ai-history"
      module="B6 AI History"
      title="AI Sohbet Geçmişi"
      description="AI ile yaptığınız tüm sohbetler — model · token · maliyet bazında tam kayıt."
      actions={
        <Button
          tone="ghost"
          size="sm"
          leftIcon={<Icon icon={Trash2} size={14} />}
          onClick={() => {
            setConvs([]);
            toast.success('Tüm geçmiş silindi (KVKK m.11 silme hakkı)');
          }}
        >
          Hepsini sil
        </Button>
      }
      kpis={[
        { label: 'Sohbet', value: String(convs.length), tone: 'cyan' },
        {
          label: 'Toplam token',
          value: convs.reduce((s, c) => s + c.totalTokens, 0).toLocaleString('tr-TR'),
          tone: 'violet',
        },
        {
          label: 'Toplam maliyet',
          value: `$${convs.reduce((s, c) => s + c.cost, 0).toFixed(2)}`,
          tone: 'magenta',
        },
        { label: 'En sevdiği model', value: 'Sonnet 4.6', tone: 'lime' },
      ]}
    >
      <Card tone="solid">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Sparkles} tone="violet" />
            <span className="font-medium">AI özet</span>
          </div>
        </CardHeader>
        <CardBody className="text-sm text-[var(--text-secondary)]">
          Son 7 günde <span className="font-medium">{convs.length} sohbet</span>, ortalama{' '}
          <span className="font-medium">
            {Math.round(convs.reduce((s, c) => s + c.messages, 0) / Math.max(convs.length, 1))}{' '}
            mesaj/sohbet
          </span>
          . En çok değerleme + karşılaştırma sorduğunuz görülüyor.
        </CardBody>
      </Card>

      <div className="flex flex-col gap-2">
        {convs.map((c) => (
          <Card key={c.id}>
            <CardBody className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon={MessageCircle} tone="cyan" size={14} />
                  <span className="font-medium">{c.title}</span>
                  <Badge size="sm" tone="agent">
                    {c.model}
                  </Badge>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">{c.preview}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Icon icon={Bot} size={12} />
                  {c.messages} msg
                </span>
                <span className="flex items-center gap-1">
                  <Icon icon={Brain} size={12} />
                  {c.totalTokens.toLocaleString('tr-TR')} tok
                </span>
                <span className="tabular-nums">${c.cost.toFixed(2)}</span>
                <span>{new Date(c.startedAt).toLocaleString('tr-TR')}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
