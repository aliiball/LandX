import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Input,
  Select,
  Tabs,
  Textarea,
  toast,
} from '@/components/ui';
import { getTkgmQueries } from '@/mocks/seed/admin';
import type { TkgmStatusCode } from '@/types/tkgm';
import { FileSearch, Layers, MapPin, Radar, ScanLine, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';

const STATUS_TONE: Record<TkgmStatusCode, 'success' | 'warning' | 'danger' | 'info'> = {
  OK: 'success',
  E001: 'warning',
  E002: 'danger',
  E003: 'warning',
  E099: 'danger',
};

const STATUS_LABEL: Record<TkgmStatusCode, string> = {
  OK: 'Başarılı',
  E001: 'Geçersiz ada/parsel',
  E002: 'TKGM 504 / timeout',
  E003: 'Yetkisiz / rate-limit',
  E099: 'Bilinmeyen hata',
};

export default function TkgmPage() {
  const queries = getTkgmQueries();
  const breakdown = useMemo(() => {
    const counts: Record<TkgmStatusCode, number> = { OK: 0, E001: 0, E002: 0, E003: 0, E099: 0 };
    for (const q of queries) counts[q.status] += 1;
    return counts;
  }, [queries]);

  return (
    <AdminPage
      surfaceKey="C · /admin/tkgm"
      module="TKGM Gateway"
      title="TKGM Operasyonları"
      description="Tapu/Kadastro doğrulama — manuel · toplu · OCR · hata kod izleme (E001/E002/E003/E099)."
      kpis={[
        { label: 'Toplam sorgu', value: String(queries.length), tone: 'cyan' },
        { label: 'Başarılı', value: String(breakdown.OK), tone: 'lime' },
        { label: 'E002 (timeout)', value: String(breakdown.E002), tone: 'magenta' },
        { label: 'E001 (geçersiz)', value: String(breakdown.E001), tone: 'amber' },
        {
          label: 'Ort. latency',
          value: `${Math.round(queries.reduce((s, q) => s + q.latencyMs, 0) / queries.length)}ms`,
          tone: 'cyan',
        },
      ]}
    >
      <Tabs
        items={[
          { id: 'overview', label: 'Genel', content: <Overview breakdown={breakdown} /> },
          { id: 'verify', label: 'Manuel Sorgu', content: <ManualQuery /> },
          { id: 'bulk', label: 'Toplu Sorgu', content: <BulkQuery /> },
          { id: 'ocr', label: 'OCR (Tapu)', content: <OcrPanel /> },
          {
            id: 'history',
            label: `Geçmiş (${queries.length})`,
            content: <HistoryTable queries={queries.slice(0, 30)} />,
          },
          {
            id: 'monitoring',
            label: 'İzleme',
            content: <Monitoring breakdown={breakdown} queries={queries} />,
          },
        ]}
      />
    </AdminPage>
  );
}

function Overview({ breakdown }: { breakdown: Record<TkgmStatusCode, number> }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Radar} tone="cyan" />
            <span className="font-medium">Durum Dağılımı (60 sorgu)</span>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {(Object.keys(breakdown) as TkgmStatusCode[]).map((code) => {
            const total = Object.values(breakdown).reduce((s, n) => s + n, 0);
            const pct = total ? (breakdown[code] / total) * 100 : 0;
            return (
              <div key={code} className="flex items-center gap-3">
                <Badge tone={STATUS_TONE[code]} size="sm">
                  {code}
                </Badge>
                <span className="w-44 text-xs text-[var(--text-secondary)]">
                  {STATUS_LABEL[code]}
                </span>
                <div className="relative h-2 flex-1 rounded-full bg-[var(--surface-elevated)]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${pct}%`,
                      background:
                        code === 'OK'
                          ? 'var(--accent-lime)'
                          : code === 'E002'
                            ? 'var(--accent-magenta)'
                            : 'var(--accent-amber)',
                    }}
                  />
                </div>
                <span className="w-12 text-right tabular-nums text-sm">{breakdown[code]}</span>
              </div>
            );
          })}
        </CardBody>
      </Card>
      <Card tone="solid">
        <CardHeader>
          <span className="font-medium">Gateway Konfig</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          <KV label="Endpoint" value="https://api.tkgm.gov.tr/v2" mono />
          <KV label="Auth" value="mTLS + JWT (rotated 24sa)" />
          <KV label="Rate limit" value="30 req/dk (tenant başına)" />
          <KV label="Retry" value="exponential backoff (max 3)" />
          <KV label="Cache TTL" value="120sn (idempotent)" />
        </CardBody>
      </Card>
    </div>
  );
}

function ManualQuery() {
  const [il, setIl] = useState('İstanbul');
  const [ilce, setIlce] = useState('Beykoz');
  const [ada, setAda] = useState('');
  const [parsel, setParsel] = useState('');
  const [result, setResult] = useState<{ status: TkgmStatusCode; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon={MapPin} tone="cyan" />
          <span className="font-medium">Tek Sorgu</span>
        </div>
      </CardHeader>
      <CardBody className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <Input value={il} onChange={(e) => setIl(e.currentTarget.value)} label="İl" />
        <Input value={ilce} onChange={(e) => setIlce(e.currentTarget.value)} label="İlçe" />
        <Input
          value={ada}
          onChange={(e) => setAda(e.currentTarget.value)}
          label="Ada"
          placeholder="örn. 1234"
        />
        <Input
          value={parsel}
          onChange={(e) => setParsel(e.currentTarget.value)}
          label="Parsel"
          placeholder="örn. 56"
        />
        <Button
          tone="primary"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await new Promise((r) => setTimeout(r, 600));
            const status: TkgmStatusCode =
              ada === '0000' ? 'E001' : parsel === '999' ? 'E002' : ada === '7777' ? 'E003' : 'OK';
            setResult({
              status,
              message:
                status === 'OK'
                  ? `Ada ${ada}, Parsel ${parsel} doğrulandı. 4.200m² arsa.`
                  : STATUS_LABEL[status],
            });
            setLoading(false);
            toast.show(`TKGM yanıt: ${status}`);
          }}
        >
          Sorgula
        </Button>
        {result && (
          <div className="col-span-full flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3">
            <Badge tone={STATUS_TONE[result.status]} size="md">
              {result.status}
            </Badge>
            <span className="text-sm">{result.message}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function BulkQuery() {
  const [raw, setRaw] = useState('34;Beykoz;1234;56\n07;Manavgat;2090;14\n09;Bodrum;3320;9');
  const [progress, setProgress] = useState(0);
  const lines = raw.split('\n').filter(Boolean);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon={Layers} tone="violet" />
          <span className="font-medium">Toplu Sorgu — il;ilçe;ada;parsel (her satır)</span>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-3">
        <Textarea rows={6} value={raw} onChange={(e) => setRaw(e.currentTarget.value)} />
        <div className="flex items-center gap-3">
          <Button
            tone="agent"
            onClick={async () => {
              setProgress(0);
              for (let i = 1; i <= 100; i += 5) {
                await new Promise((r) => setTimeout(r, 60));
                setProgress(i);
              }
              toast.success(`${lines.length} sorgu tamamlandı`);
            }}
          >
            {lines.length} satır işle
          </Button>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
            <div
              className="absolute inset-y-0 left-0 bg-[var(--accent-cyan)] transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm tabular-nums">{progress}%</span>
        </div>
      </CardBody>
    </Card>
  );
}

function OcrPanel() {
  const [uploaded, setUploaded] = useState(false);
  const [extracted, setExtracted] = useState<
    { field: string; value: string; confidence: number }[]
  >([]);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon={ScanLine} tone="amber" />
          <span className="font-medium">Tapu Senedi OCR — AI Extract</span>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-3">
        <button
          type="button"
          onClick={async () => {
            setUploaded(true);
            await new Promise((r) => setTimeout(r, 1100));
            setExtracted([
              { field: 'Mal sahibi', value: 'Ali Demir', confidence: 0.96 },
              { field: 'Hisse oranı', value: '100%', confidence: 0.99 },
              { field: 'Ada / Parsel', value: '1234 / 56', confidence: 0.94 },
              { field: 'Yüzölçümü', value: '4.200 m²', confidence: 0.97 },
              { field: 'Nitelik', value: 'Arsa', confidence: 0.92 },
              { field: 'Edinme sebebi', value: 'Satış (29.04.2018)', confidence: 0.88 },
            ]);
            toast.agent('OCR + AI çıkarım tamamlandı');
          }}
          className="flex h-32 items-center justify-center rounded-[var(--radius-md)] border-2 border-dashed border-[var(--stroke-subtle)] text-sm hover:border-[var(--accent-cyan)]"
        >
          <div className="flex flex-col items-center gap-1 text-[var(--text-secondary)]">
            <Icon icon={Upload} tone="cyan" />
            <span>{uploaded ? 'tapu-sened.pdf' : 'Tapu senedi PDF yükle (mock)'}</span>
          </div>
        </button>

        {extracted.length > 0 && (
          <AdminTable
            title="Çıkarılan alanlar"
            columns={[
              { key: 'field', label: 'Alan' },
              { key: 'value', label: 'Değer' },
              { key: 'conf', label: 'Güven', align: 'right' },
            ]}
            rows={extracted.map((e) => ({
              field: <span className="text-sm">{e.field}</span>,
              value: <span className="font-medium">{e.value}</span>,
              conf: (
                <Badge
                  tone={e.confidence > 0.9 ? 'success' : e.confidence > 0.8 ? 'warning' : 'danger'}
                  size="sm"
                >
                  {(e.confidence * 100).toFixed(0)}%
                </Badge>
              ),
            }))}
          />
        )}
      </CardBody>
    </Card>
  );
}

function HistoryTable({ queries }: { queries: ReturnType<typeof getTkgmQueries> }) {
  const [filter, setFilter] = useState<'all' | TkgmStatusCode>('all');
  const filtered = queries.filter((q) => filter === 'all' || q.status === filter);
  return (
    <>
      <div className="mb-2 flex justify-end">
        <Select
          size="sm"
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value as 'all' | TkgmStatusCode)}
          options={[
            { value: 'all', label: 'Tümü' },
            { value: 'OK', label: 'OK' },
            { value: 'E001', label: 'E001' },
            { value: 'E002', label: 'E002' },
            { value: 'E003', label: 'E003' },
            { value: 'E099', label: 'E099' },
          ]}
        />
      </div>
      <AdminTable
        title="Son sorgular"
        columns={[
          { key: 'ts', label: 'Zaman' },
          { key: 'principal', label: 'Sorgulayan' },
          { key: 'loc', label: 'Lokasyon' },
          { key: 'ap', label: 'Ada/Parsel' },
          { key: 'status', label: 'Durum' },
          { key: 'latency', label: 'Latency', align: 'right' },
        ]}
        rows={filtered.map((q) => ({
          ts: <span className="font-mono text-xs">{new Date(q.ts).toLocaleString('tr-TR')}</span>,
          principal: <span className="font-mono text-xs">{q.principal}</span>,
          loc: (
            <span className="text-sm">
              {q.il} / {q.ilce}
            </span>
          ),
          ap: (
            <span className="font-mono text-xs">
              {q.ada} / {q.parsel}
            </span>
          ),
          status: (
            <Badge tone={STATUS_TONE[q.status]} size="sm">
              {q.status}
            </Badge>
          ),
          latency: <span className="tabular-nums text-xs">{q.latencyMs}ms</span>,
        }))}
      />
    </>
  );
}

function Monitoring({
  breakdown,
  queries,
}: { breakdown: Record<TkgmStatusCode, number>; queries: ReturnType<typeof getTkgmQueries> }) {
  const points = queries.slice(0, 24).map((q) => q.latencyMs);
  const max = Math.max(...points);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={FileSearch} tone="magenta" />
            <span className="font-medium">Hata kodu dağılımı (pie)</span>
          </div>
        </CardHeader>
        <CardBody>
          <DonutChart data={Object.entries(breakdown).map(([k, v]) => ({ label: k, value: v }))} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <span className="font-medium">Latency (son 24 sorgu)</span>
        </CardHeader>
        <CardBody>
          <svg
            viewBox="0 0 240 100"
            className="h-32 w-full"
            role="img"
            aria-label="TKGM latency bar chart"
          >
            <title>TKGM latency bar chart</title>
            {points.map((p, i) => {
              const x = (i / points.length) * 240;
              const h = (p / max) * 90;
              return (
                <rect
                  key={i}
                  x={x}
                  y={100 - h}
                  width={240 / points.length - 1}
                  height={h}
                  fill="var(--accent-cyan)"
                  opacity={0.7}
                />
              );
            })}
          </svg>
          <div className="mt-2 flex justify-between font-mono text-xs text-[var(--text-tertiary)]">
            <span>min {Math.min(...points)}ms</span>
            <span>p95 {Math.round(max * 0.9)}ms</span>
            <span>max {max}ms</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function DonutChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cursor = 0;
  const colors = [
    'var(--accent-lime)',
    'var(--accent-amber)',
    'var(--accent-magenta)',
    'var(--accent-violet)',
    'var(--accent-cyan)',
  ];
  return (
    <div className="flex items-center gap-4">
      <svg
        viewBox="0 0 32 32"
        className="h-32 w-32 -rotate-90"
        role="img"
        aria-label="TKGM durum donut chart"
      >
        <title>TKGM durum donut chart</title>
        {data.map((d, i) => {
          const pct = (d.value / total) * 100;
          const dashArr = `${pct} ${100 - pct}`;
          const off = -cursor;
          cursor += pct;
          return (
            <circle
              key={d.label}
              cx={16}
              cy={16}
              r={15.9155}
              fill="transparent"
              stroke={colors[i % colors.length]}
              strokeWidth={6}
              strokeDasharray={dashArr}
              strokeDashoffset={off}
              pathLength={100}
            />
          );
        })}
      </svg>
      <div className="flex flex-col gap-1 text-sm">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: colors[i % colors.length] }}
            />
            <span className="font-mono text-xs">{d.label}</span>
            <span className="text-[var(--text-tertiary)]">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm font-medium'}>{value}</span>
    </div>
  );
}
