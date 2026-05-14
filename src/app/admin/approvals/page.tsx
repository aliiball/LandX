import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Checkbox, Icon, toast } from '@/components/ui';
import { CheckCircle2, Sparkles, XCircle } from 'lucide-react';
import { useState } from 'react';

type Item = {
  id: string;
  title: string;
  city: string;
  zoning: string;
  price: number;
  seller: string;
  age: string;
  risk: 'low' | 'medium' | 'high';
};

const ITEMS: Item[] = [
  {
    id: 'lst_pending_001',
    title: 'Beykoz Şile yolu 5.200m² zeytinlik bitişiği',
    city: 'İstanbul',
    zoning: 'tarla',
    price: 2_280_000,
    seller: 'Ali Demir',
    age: '12dk',
    risk: 'low',
  },
  {
    id: 'lst_pending_002',
    title: 'Çeşme Reisdere 1.480m² imarlı',
    city: 'İzmir',
    zoning: 'konut',
    price: 4_650_000,
    seller: 'Selin Demir',
    age: '38dk',
    risk: 'low',
  },
  {
    id: 'lst_pending_003',
    title: 'Bodrum Yalıçiftlik 2.200m² turizm',
    city: 'Muğla',
    zoning: 'turizm',
    price: 8_200_000,
    seller: 'Mert Kıyı',
    age: '1sa',
    risk: 'medium',
  },
  {
    id: 'lst_pending_004',
    title: 'Manavgat hisseli (TKGM E001)',
    city: 'Antalya',
    zoning: 'tarla',
    price: 980_000,
    seller: 'Karaca İsmail',
    age: '2sa',
    risk: 'high',
  },
  {
    id: 'lst_pending_005',
    title: 'Tekirdağ Çorlu sanayi cephe',
    city: 'Tekirdağ',
    zoning: 'sanayi',
    price: 3_120_000,
    seller: 'Burak Akın',
    age: '3sa',
    risk: 'low',
  },
  {
    id: 'lst_pending_006',
    title: 'Mudanya zeytinlik 3.800m² (3573 kontrol)',
    city: 'Bursa',
    zoning: 'zeytinlik',
    price: 1_440_000,
    seller: 'Esra Kaya',
    age: '4sa',
    risk: 'medium',
  },
  {
    id: 'lst_pending_007',
    title: 'Kuşadası Soğucak 920m²',
    city: 'Aydın',
    zoning: 'konut',
    price: 2_140_000,
    seller: 'Onur Çelik',
    age: '6sa',
    risk: 'low',
  },
  {
    id: 'lst_pending_008',
    title: 'Sancaktepe karma 1.250m²',
    city: 'İstanbul',
    zoning: 'karma',
    price: 4_980_000,
    seller: 'Demo User',
    age: '8sa',
    risk: 'medium',
  },
  {
    id: 'lst_pending_009',
    title: 'Kaş Çukurbağ 720m² turizm',
    city: 'Antalya',
    zoning: 'turizm',
    price: 3_240_000,
    seller: 'Pınar Demir',
    age: '12sa',
    risk: 'low',
  },
  {
    id: 'lst_pending_010',
    title: 'Şile hisseli (oran %33)',
    city: 'İstanbul',
    zoning: 'tarla',
    price: 780_000,
    seller: 'Anonim',
    age: '18sa',
    risk: 'high',
  },
  {
    id: 'lst_pending_011',
    title: 'Polatlı tarla 12.500m²',
    city: 'Ankara',
    zoning: 'tarla',
    price: 1_180_000,
    seller: 'Demo Seller',
    age: '20sa',
    risk: 'low',
  },
  {
    id: 'lst_pending_012',
    title: 'Foça turizm 2.100m²',
    city: 'İzmir',
    zoning: 'turizm',
    price: 5_800_000,
    seller: 'Ege Ege',
    age: '1g',
    risk: 'medium',
  },
  {
    id: 'lst_pending_013',
    title: 'Akyazı tarla 8.400m²',
    city: 'Sakarya',
    zoning: 'tarla',
    price: 620_000,
    seller: 'Eski Firma',
    age: '1g',
    risk: 'low',
  },
  {
    id: 'lst_pending_014',
    title: 'Beypazarı arsa şerhli',
    city: 'Ankara',
    zoning: 'konut',
    price: 1_320_000,
    seller: 'Ayşe Anadolu',
    age: '1g',
    risk: 'high',
  },
];

const RISK_TONE = { low: 'success', medium: 'warning', high: 'danger' } as const;

export default function AdminApprovalsPage() {
  const [items, setItems] = useState(ITEMS);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const lowRiskUnselected = items.filter((i) => i.risk === 'low').map((i) => i.id);

  return (
    <AdminPage
      surfaceKey="C · /admin/approvals"
      module="S04 Lifecycle / Approvals"
      title="İlan Onay Kuyruğu"
      description="Yeni ilanların moderasyon kuyruğu. AI özet · toplu onay · risk skoru."
      actions={
        <>
          <Button
            tone="agent"
            size="sm"
            leftIcon={<Icon icon={Sparkles} size={14} />}
            onClick={() => {
              setSelected(new Set(lowRiskUnselected));
              toast.agent(`AI: ${lowRiskUnselected.length} düşük riskli ilanı seçtim`);
            }}
          >
            AI: low-risk seç ({lowRiskUnselected.length})
          </Button>
          <Button
            tone="primary"
            size="sm"
            leftIcon={<Icon icon={CheckCircle2} size={14} />}
            disabled={selected.size === 0}
            onClick={() => {
              setItems((prev) => prev.filter((i) => !selected.has(i.id)));
              toast.success(`${selected.size} ilan onaylandı (yayında).`);
              setSelected(new Set());
            }}
          >
            Toplu onayla ({selected.size})
          </Button>
          <Button
            tone="ghost"
            size="sm"
            leftIcon={<Icon icon={XCircle} size={14} />}
            disabled={selected.size === 0}
            onClick={() => {
              setItems((prev) => prev.filter((i) => !selected.has(i.id)));
              toast.show(`${selected.size} ilan reddedildi`);
              setSelected(new Set());
            }}
          >
            Reddet
          </Button>
        </>
      }
      kpis={[
        { label: 'Kuyrukta', value: String(items.length), tone: 'cyan' },
        {
          label: 'Düşük risk',
          value: String(items.filter((i) => i.risk === 'low').length),
          tone: 'lime',
        },
        {
          label: 'Yüksek risk',
          value: String(items.filter((i) => i.risk === 'high').length),
          tone: 'magenta',
        },
        { label: 'Seçili', value: String(selected.size), tone: 'amber' },
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
          Kuyruktaki <span className="font-medium text-[var(--text-primary)]">{items.length}</span>{' '}
          ilandan{' '}
          <span className="font-medium text-[var(--accent-lime)]">
            {items.filter((i) => i.risk === 'low').length}
          </span>{' '}
          tanesi düşük risk (3573 zeytinlik kontrolü temiz, tapu vasfı uygun, fotoğraf yeterli).
          Yüksek riskli{' '}
          <span className="font-medium text-[var(--accent-magenta)]">
            {items.filter((i) => i.risk === 'high').length}
          </span>{' '}
          ilan: TKGM hatası veya hisseli tapuda eksik veri.
        </CardBody>
      </Card>

      <AdminTable
        columns={[
          { key: 'sel', label: '' },
          { key: 'title', label: 'İlan' },
          { key: 'loc', label: 'Şehir' },
          { key: 'zone', label: 'İmar' },
          { key: 'price', label: 'Fiyat', align: 'right' },
          { key: 'seller', label: 'Satıcı' },
          { key: 'age', label: 'Yaş', align: 'right' },
          { key: 'risk', label: 'Risk' },
        ]}
        rows={items.map((i) => ({
          sel: (
            <Checkbox
              checked={selected.has(i.id)}
              onChange={(e) => {
                const next = new Set(selected);
                if (e.currentTarget.checked) next.add(i.id);
                else next.delete(i.id);
                setSelected(next);
              }}
            />
          ),
          title: (
            <div className="flex flex-col">
              <span className="font-medium">{i.title}</span>
              <span className="font-mono text-xs text-[var(--text-tertiary)]">{i.id}</span>
            </div>
          ),
          loc: <span className="text-sm">{i.city}</span>,
          zone: (
            <Badge size="sm" tone="info">
              {i.zoning}
            </Badge>
          ),
          price: <span className="tabular-nums text-sm">₺{i.price.toLocaleString('tr-TR')}</span>,
          seller: <span className="text-xs">{i.seller}</span>,
          age: <span className="text-xs text-[var(--text-tertiary)]">{i.age}</span>,
          risk: (
            <Badge tone={RISK_TONE[i.risk]} size="sm">
              {i.risk}
            </Badge>
          ),
        }))}
      />
    </AdminPage>
  );
}
