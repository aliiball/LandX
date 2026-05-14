import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, Tabs, toast } from '@/components/ui';
import {
  Activity,
  Banknote,
  ChartArea,
  FileBarChart2,
  FileSpreadsheet,
  Filter,
  Globe2,
  Sparkles,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  FunnelChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Funnel as RFunnel,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export const REPORT_SECTIONS = [
  'overview',
  'financial',
  'conversion',
  'cohort',
  'geographic',
  'ai',
  'slo',
] as const;

export type ReportSection = (typeof REPORT_SECTIONS)[number];

const SECTION_LABELS: Record<ReportSection, string> = {
  overview: 'Genel',
  financial: 'Finansal',
  conversion: 'Conversion Funnel',
  cohort: 'Cohort & Retention',
  geographic: 'Coğrafi',
  ai: 'AI Kullanım',
  slo: 'SLO & Sağlık',
};

const SECTION_ICON: Record<ReportSection, typeof FileBarChart2> = {
  overview: FileBarChart2,
  financial: Banknote,
  conversion: Filter,
  cohort: Target,
  geographic: Globe2,
  ai: Sparkles,
  slo: Activity,
};

const CHART_COLORS = [
  'var(--accent-cyan)',
  'var(--accent-lime)',
  'var(--accent-violet)',
  'var(--accent-amber)',
  'var(--accent-magenta)',
  '#7dd3fc',
  '#f472b6',
];

export function ReportsPanel({ section }: { section: ReportSection }) {
  const navigate = useNavigate();

  const content: Record<ReportSection, React.ReactNode> = {
    overview: <OverviewTab />,
    financial: <FinancialTab />,
    conversion: <ConversionTab />,
    cohort: <CohortTab />,
    geographic: <GeographicTab />,
    ai: <AiUsageTab />,
    slo: <SloTab />,
  };

  return (
    <AdminPage
      surfaceKey="C · /admin/reports"
      module="A08 + O01 Reports"
      title="Raporlar"
      description="Yönetimsel raporlar — finans, conversion, cohort, coğrafi, AI maliyet, SLO sağlığı."
      actions={
        <>
          <Button
            tone="ghost"
            size="sm"
            leftIcon={<Icon icon={FileSpreadsheet} size={14} />}
            onClick={() => toast.show('CSV indirme başlatıldı')}
          >
            CSV
          </Button>
          <Button
            tone="primary"
            size="sm"
            leftIcon={<Icon icon={ChartArea} size={14} />}
            onClick={() => toast.show('PDF rapor hazırlanıyor')}
          >
            PDF
          </Button>
        </>
      }
      kpis={[
        { label: 'GMV (30g)', value: '₺48.2M', tone: 'lime' },
        { label: 'Conversion', value: '%4.2', tone: 'cyan' },
        { label: 'Active brokers', value: '124', tone: 'violet' },
        { label: 'AI cost (30g)', value: '$8.4K', tone: 'magenta' },
      ]}
    >
      <Tabs
        active={section}
        onActiveChange={(id) => navigate(`/admin/reports/${id}`)}
        items={REPORT_SECTIONS.map((s) => ({
          id: s,
          label: (
            <span className="flex items-center gap-2">
              <Icon icon={SECTION_ICON[s]} size={14} />
              {SECTION_LABELS[s]}
            </span>
          ),
          content: content[s],
        }))}
      />
    </AdminPage>
  );
}

// --- Tabs ---

function OverviewTab() {
  const data = makeMonthSeries(180);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Chart title="Toplam ilan (30g)" hint="A08 platform">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="ovGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="var(--accent-cyan)" fill="url(#ovGrad)" />
        </AreaChart>
      </Chart>
      <Chart title="Aktif Tenant" hint="rolling 30g">
        <BarChart data={makeBars(8, 'Tenant', 80, 180)}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--accent-lime)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </Chart>
      <Chart title="GMV Trend" hint="₺M">
        <LineChart data={makeMonthSeries(30, 1.2, 2.4)}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="var(--accent-violet)" strokeWidth={2} />
        </LineChart>
      </Chart>
      <Chart title="Mesajlaşma" hint="thread/gün">
        <AreaChart data={makeMonthSeries(30, 220, 380)}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--accent-amber)"
            fill="var(--accent-amber)"
            fillOpacity={0.2}
          />
        </AreaChart>
      </Chart>
    </div>
  );
}

function FinancialTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Chart title="Aylık GMV / Komisyon (₺)" hint="composed">
        <ComposedChart data={makeFinancial()}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="gmv" fill="var(--accent-cyan)" radius={[3, 3, 0, 0]} />
          <Line dataKey="komisyon" stroke="var(--accent-magenta)" strokeWidth={2} />
        </ComposedChart>
      </Chart>
      <Chart title="Subscription tier dağılımı" hint="aktif">
        <PieChart>
          <Pie
            data={makePie('Demo', 'Starter', 'Pro', 'Enterprise')}
            dataKey="value"
            nameKey="label"
            outerRadius={80}
          >
            {makePie('a', 'b', 'c', 'd').map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Chart>
      <Chart title="MRR Trend (₺)" hint="aylık">
        <AreaChart data={makeMonthSeries(12, 380000, 920000)}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--accent-lime)"
            fill="var(--accent-lime)"
            fillOpacity={0.18}
          />
        </AreaChart>
      </Chart>
      <Chart title="Refund / Iade" hint="adet">
        <BarChart data={makeBars(6, 'M', 4, 18)}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--accent-amber)" />
        </BarChart>
      </Chart>
    </div>
  );
}

function ConversionTab() {
  const funnel = [
    { name: 'Görüntüleme', value: 100_000, fill: CHART_COLORS[0] },
    { name: 'Detay', value: 38_000, fill: CHART_COLORS[1] },
    { name: 'Favori', value: 9_200, fill: CHART_COLORS[2] },
    { name: 'İnceleme/Mesaj', value: 4_600, fill: CHART_COLORS[3] },
    { name: 'Teklif', value: 1_800, fill: CHART_COLORS[4] },
    { name: 'Satış', value: 420, fill: CHART_COLORS[5] },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Chart title="Conversion Funnel (30g)">
        <FunnelChart>
          <Tooltip />
          <RFunnel dataKey="value" data={funnel} isAnimationActive />
        </FunnelChart>
      </Chart>
      <Chart title="Conversion rate (%)" hint="haftalık">
        <LineChart
          data={[1.8, 2.1, 2.7, 3.2, 3.5, 4.2, 4.0, 4.4].map((v, i) => ({
            label: `H${i + 1}`,
            value: v,
          }))}
        >
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="var(--accent-cyan)" strokeWidth={2} />
        </LineChart>
      </Chart>
    </div>
  );
}

function CohortTab() {
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
  const cohort = months.map((m, i) => ({
    cohort: m,
    w0: 100,
    w1: 78 - i,
    w2: 62 - i,
    w3: 48 - i,
    w4: 36 - i,
    w5: 28 - i,
  }));
  return (
    <Card>
      <CardHeader>
        <span className="font-medium">Cohort Retention (%)</span>
        <Badge tone="info" size="sm">
          aylık
        </Badge>
      </CardHeader>
      <CardBody className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-[var(--text-tertiary)]">
            <tr>
              <th className="pr-3 py-2 text-left">Cohort</th>
              {[0, 1, 2, 3, 4, 5].map((w) => (
                <th key={w} className="pr-3 py-2 text-right">
                  W{w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohort.map((row) => (
              <tr key={row.cohort} className="border-t border-[var(--stroke-subtle)]">
                <td className="py-1 pr-3 font-medium">{row.cohort}</td>
                {[row.w0, row.w1, row.w2, row.w3, row.w4, row.w5].map((v, i) => (
                  <td key={i} className="py-1 pr-3 text-right">
                    <span
                      className="inline-block w-12 rounded px-1 py-0.5 text-xs"
                      style={{
                        background:
                          v >= 80
                            ? 'rgba(132, 204, 22, 0.25)'
                            : v >= 50
                              ? 'rgba(34, 211, 238, 0.18)'
                              : v >= 30
                                ? 'rgba(245, 158, 11, 0.18)'
                                : 'rgba(244, 63, 94, 0.18)',
                      }}
                    >
                      {v}%
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

function GeographicTab() {
  const cities = ['İstanbul', 'İzmir', 'Antalya', 'Muğla', 'Bursa', 'Ankara', 'Aydın', 'Mersin'];
  const data = cities.map((c, i) => ({ label: c, listings: 280 - i * 24, gmv: 14 - i * 1.2 }));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Chart title="İl bazlı ilan sayısı" hint="top 8">
        <BarChart data={data} layout="vertical" margin={{ left: 30 }}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis type="number" tick={{ fontSize: 10 }} />
          <YAxis dataKey="label" type="category" tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="listings" fill="var(--accent-cyan)" />
        </BarChart>
      </Chart>
      <Chart title="GMV / İl (₺M)">
        <BarChart data={data}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="gmv" fill="var(--accent-lime)" />
        </BarChart>
      </Chart>
    </div>
  );
}

function AiUsageTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Chart title="Provider tokens (M)" hint="ay">
        <BarChart
          data={[
            { label: 'Sonnet 4.6', value: 240 },
            { label: 'Haiku 4.5', value: 1840 },
            { label: 'Opus 4.7', value: 86 },
            { label: 'GPT-5', value: 124 },
            { label: 'Gemini 2.5', value: 78 },
            { label: 'Llama 4', value: 220 },
            { label: 'Mistral 3', value: 48 },
          ]}
        >
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--accent-violet)" />
        </BarChart>
      </Chart>
      <Chart title="AI Maliyet ($)" hint="günlük">
        <AreaChart data={makeMonthSeries(30, 160, 360)}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--accent-magenta)"
            fill="var(--accent-magenta)"
            fillOpacity={0.2}
          />
        </AreaChart>
      </Chart>
    </div>
  );
}

function SloTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Chart title="API p95 latency (ms)">
        <LineChart data={makeMonthSeries(30, 140, 220)}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="var(--accent-cyan)" strokeWidth={2} />
        </LineChart>
      </Chart>
      <Chart title="Error budget (%)">
        <AreaChart data={makeMonthSeries(28, 60, 95)}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--accent-lime)"
            fill="var(--accent-lime)"
            fillOpacity={0.18}
          />
        </AreaChart>
      </Chart>
    </div>
  );
}

function Chart({
  title,
  hint,
  children,
}: { title: string; hint?: string; children: React.ReactElement }) {
  return (
    <Card>
      <CardHeader>
        <span className="font-medium">{title}</span>
        {hint && (
          <Badge tone="info" size="sm">
            {hint}
          </Badge>
        )}
      </CardHeader>
      <CardBody>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

// --- Data helpers (deterministic-ish) ---

function makeMonthSeries(n: number, min = 60, max = 240): Array<{ label: string; value: number }> {
  const out: Array<{ label: string; value: number }> = [];
  for (let i = 0; i < n; i += 1) {
    const base = min + ((max - min) * (Math.sin(i / 3) + 1)) / 2;
    out.push({ label: String(i + 1), value: Math.round(base + (i % 7) * 4) });
  }
  return out;
}

function makeBars(
  n: number,
  prefix: string,
  min: number,
  max: number,
): Array<{ label: string; value: number }> {
  return Array.from({ length: n }, (_, i) => ({
    label: `${prefix}${i + 1}`,
    value: Math.round(min + ((max - min) * (Math.cos(i / 2) + 1)) / 2),
  }));
}

function makeFinancial() {
  return [
    { label: 'Oca', gmv: 32, komisyon: 1.4 },
    { label: 'Şub', gmv: 38, komisyon: 1.8 },
    { label: 'Mar', gmv: 42, komisyon: 2.0 },
    { label: 'Nis', gmv: 46, komisyon: 2.3 },
    { label: 'May', gmv: 48, komisyon: 2.5 },
    { label: 'Haz', gmv: 52, komisyon: 2.7 },
  ];
}

function makePie(...labels: string[]): Array<{ label: string; value: number }> {
  const base = [12, 48, 56, 12];
  return labels.map((l, i) => ({ label: l, value: base[i % base.length] ?? 10 }));
}
