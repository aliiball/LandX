import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Input,
  Select,
  ThinkingDot,
  TokenStream,
  toast,
  tokenize,
} from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { formatTL } from '@/lib/format';
import { Download, Sparkles } from 'lucide-react';
import { useState } from 'react';

type ValuationOutput = {
  min: number;
  median: number;
  max: number;
  confidence: number;
  factors: Array<{ label: string; impact: number }>;
};

export default function ValuationToolPage() {
  const [city, setCity] = useState('Bursa');
  const [district, setDistrict] = useState('Karacabey');
  const [areaSqm, setAreaSqm] = useState('2500');
  const [zoning, setZoning] = useState('tarla');
  const [output, setOutput] = useState<ValuationOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setOutput(null);
    setLoading(true);
    window.setTimeout(() => {
      const base = zoning === 'tarla' ? 380 : zoning === 'konut' ? 1500 : 2400;
      const sqm = Number(areaSqm) || 1000;
      const median = sqm * base;
      setOutput({
        min: Math.round(median * 0.85),
        median,
        max: Math.round(median * 1.15),
        confidence: 78,
        factors: [
          { label: 'Bölge yatırım skoru', impact: 12 },
          { label: 'İmar onayı', impact: 8 },
          { label: 'Yola cephe', impact: 4 },
          { label: 'Eğim', impact: -2 },
        ],
      });
      setLoading(false);
      toast.agent('AI değerleme tamamlandı');
    }, 1400);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-8 md:px-6">
      <header>
        <h1 className={headingRecipe({ level: 'h2' })}>AI Değerleme</h1>
        <p className="text-[var(--text-secondary)]">
          Lokasyon + özellik gir, anlık AI değerleme + güven aralığı al.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <span className="font-medium">Girdi</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <Input label="Şehir" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input label="İlçe" value={district} onChange={(e) => setDistrict(e.target.value)} />
            <Input
              label="m²"
              type="number"
              value={areaSqm}
              onChange={(e) => setAreaSqm(e.target.value)}
            />
            <Select
              label="İmar"
              value={zoning}
              onChange={(e) => setZoning(e.currentTarget.value)}
              options={[
                { value: 'konut', label: 'Konut' },
                { value: 'ticari', label: 'Ticari' },
                { value: 'tarla', label: 'Tarla' },
                { value: 'sanayi', label: 'Sanayi' },
              ]}
            />
            <Button
              tone="agent"
              onClick={run}
              loading={loading}
              leftIcon={<Icon icon={Sparkles} size={14} />}
            >
              AI ile değerle
            </Button>
          </CardBody>
        </Card>

        <Card glow={output ? 'violet' : 'none'}>
          <CardHeader>
            <span className="font-medium">Sonuç</span>
            {output && (
              <Badge tone="agent" size="sm" dot>
                %{output.confidence} güven
              </Badge>
            )}
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {loading && (
              <div className="flex flex-col items-center gap-2 py-8 text-sm text-[var(--text-secondary)]">
                <ThinkingDot tone="violet" />
                <span>AI komşu parselleri karşılaştırıyor…</span>
              </div>
            )}
            {output && (
              <>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Stat label="Min" value={formatTL(output.min, true)} />
                  <Stat label="Tahmini" value={formatTL(output.median, true)} highlight />
                  <Stat label="Max" value={formatTL(output.max, true)} />
                </div>
                <TokenStream
                  tokens={tokenize(
                    `${city} ${district} bölgesinde ${areaSqm} m² ${zoning} arsa için AI tahmini ${formatTL(output.median)}. Güven aralığı %${output.confidence}. Karşılaştırılabilir 12 parsel referans alındı.`,
                  )}
                  intervalMs={20}
                />
                <details className="text-sm">
                  <summary className="cursor-pointer text-[var(--text-secondary)]">
                    Neden bu fiyat?
                  </summary>
                  <ul className="mt-2 flex flex-col gap-1">
                    {output.factors.map((f) => (
                      <li key={f.label} className="flex justify-between">
                        <span className="text-[var(--text-tertiary)]">{f.label}</span>
                        <span
                          className={
                            f.impact > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                          }
                        >
                          {f.impact > 0 ? '+' : ''}
                          {f.impact}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
                <Button
                  leftIcon={<Icon icon={Download} size={14} />}
                  onClick={() => toast.success('PDF rapor hazırlandı')}
                >
                  PDF rapor indir
                </Button>
              </>
            )}
            {!output && !loading && (
              <p className="py-8 text-center text-sm text-[var(--text-tertiary)]">
                Sol panelden girdileri doldur ve "AI ile değerle"ye bas.
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border px-2 py-2 ${
        highlight
          ? 'border-[var(--accent-violet)] bg-[oklch(0.70_0.22_290_/_0.10)]'
          : 'border-[var(--stroke-default)]'
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</div>
      <div
        className={`text-base font-semibold tabular-nums ${highlight ? 'text-[var(--accent-violet)]' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}
