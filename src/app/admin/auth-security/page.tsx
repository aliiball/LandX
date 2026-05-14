import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Card, CardBody, CardHeader, Icon, Tabs } from '@/components/ui';
import { getRiskEvents, getUserMfa } from '@/mocks/seed/admin';
import type { MfaMethod, RiskEvent } from '@/types/admin';
import { Fingerprint, KeyRound, ShieldAlert } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MFA_TONE: Record<MfaMethod, 'success' | 'info' | 'warning' | 'danger'> = {
  passkey: 'success',
  totp: 'info',
  sms: 'warning',
  email: 'warning',
  none: 'danger',
};

const ACTION_TONE: Record<RiskEvent['action'], 'success' | 'warning' | 'danger' | 'info'> = {
  allow: 'success',
  review: 'info',
  'step-up': 'warning',
  block: 'danger',
};

export default function AdminAuthSecurityPage() {
  const mfa = getUserMfa();
  const risk = getRiskEvents();

  const methodCounts = (m: MfaMethod) => mfa.filter((u) => u.method === m).length;

  return (
    <AdminPage
      surfaceKey="C · /admin/auth-security"
      module="I03 Auth & Security"
      title="Auth & Güvenlik"
      description="MFA matrisi, risk-based auth (unusual_geo · impossible_travel · TOR · HIBP leak), policy."
      kpis={[
        { label: 'Passkey', value: String(methodCounts('passkey')), tone: 'lime' },
        { label: 'TOTP', value: String(methodCounts('totp')), tone: 'cyan' },
        {
          label: 'SMS/Email',
          value: String(methodCounts('sms') + methodCounts('email')),
          tone: 'amber',
        },
        { label: 'MFA yok', value: String(methodCounts('none')), tone: 'magenta' },
        { label: 'Risk olay (24s)', value: String(risk.length), tone: 'cyan' },
      ]}
    >
      <Tabs
        items={[
          { id: 'overview', label: 'Genel', content: <Overview /> },
          { id: 'mfa', label: `MFA (${mfa.length})`, content: <MfaTab mfa={mfa} /> },
          { id: 'risk', label: `Risk olayları (${risk.length})`, content: <RiskTab risk={risk} /> },
          { id: 'sessions', label: 'Oturumlar', content: <SessionsTab /> },
          { id: 'policies', label: 'Politikalar', content: <PoliciesTab /> },
        ]}
      />
    </AdminPage>
  );
}

function Overview() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Fingerprint} tone="cyan" />
            <span className="font-medium">24sa Login Trend</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend24('Login', 220, 480)}>
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeOpacity={0.15} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="var(--accent-cyan)" fill="url(#lg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={ShieldAlert} tone="magenta" />
            <span className="font-medium">Failed login</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend24('Failed', 4, 28)}>
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
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={KeyRound} tone="amber" />
            <span className="font-medium">Step-up tetik</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend24('Step-up', 0, 12)}>
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
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function MfaTab({ mfa }: { mfa: ReturnType<typeof getUserMfa> }) {
  return (
    <AdminTable
      title="Kullanıcı MFA matrisi"
      columns={[
        { key: 'email', label: 'Email' },
        { key: 'method', label: 'Yöntem' },
        { key: 'passkey', label: 'Passkey #' },
        { key: 'risk', label: 'Risk skor', align: 'right' },
        { key: 'last', label: 'Son giriş' },
      ]}
      rows={mfa.slice(0, 24).map((u) => ({
        email: <span className="font-mono text-xs">{u.email}</span>,
        method: (
          <Badge tone={MFA_TONE[u.method]} size="sm">
            {u.method}
          </Badge>
        ),
        passkey: <span className="tabular-nums">{u.passkeyCount}</span>,
        risk: (
          <span
            className={`tabular-nums ${u.riskScore > 0.7 ? 'text-[var(--accent-magenta)]' : 'text-[var(--text-secondary)]'}`}
          >
            {(u.riskScore * 100).toFixed(0)}
          </span>
        ),
        last: (
          <span className="text-xs text-[var(--text-tertiary)]">
            {new Date(u.lastLoginAt).toLocaleString('tr-TR')}
          </span>
        ),
      }))}
    />
  );
}

function RiskTab({ risk }: { risk: ReturnType<typeof getRiskEvents> }) {
  return (
    <AdminTable
      title="Risk olayları"
      columns={[
        { key: 'ts', label: 'Zaman' },
        { key: 'kind', label: 'Tür' },
        { key: 'email', label: 'Kullanıcı' },
        { key: 'geo', label: 'Geo / IP' },
        { key: 'action', label: 'Aksiyon' },
      ]}
      rows={risk.map((r) => ({
        ts: <span className="font-mono text-xs">{new Date(r.ts).toLocaleTimeString('tr-TR')}</span>,
        kind: (
          <Badge
            tone={r.kind === 'leaked_password' || r.kind === 'tor_exit' ? 'danger' : 'warning'}
            size="sm"
          >
            {r.kind}
          </Badge>
        ),
        email: <span className="font-mono text-xs">{r.userEmail}</span>,
        geo: (
          <span className="text-xs">
            {r.geo} · <span className="font-mono">{r.ip}</span>
          </span>
        ),
        action: (
          <Badge tone={ACTION_TONE[r.action]} size="sm">
            {r.action}
          </Badge>
        ),
      }))}
    />
  );
}

function SessionsTab() {
  return (
    <Card>
      <CardHeader>
        <span className="font-medium">Aktif oturumlar</span>
        <Badge size="sm" tone="info">
          1.2K
        </Badge>
      </CardHeader>
      <CardBody className="grid gap-3 sm:grid-cols-3 text-sm">
        <KV label="Web" value="864" />
        <KV label="Mobile" value="312" />
        <KV label="API token" value="24" />
        <KV label="Median yaş" value="42dk" />
        <KV label="Idle > 2sa" value="184" />
        <KV label="Force-logout policy" value="24sa" />
      </CardBody>
    </Card>
  );
}

function PoliciesTab() {
  return (
    <Card>
      <CardHeader>
        <span className="font-medium">Policy konfigürasyonu</span>
      </CardHeader>
      <CardBody className="grid gap-3 sm:grid-cols-2 text-sm">
        <KV label="Parola min" value="12 char + 1 sembol" />
        <KV label="MFA zorunluluk" value="admin · broker-admin" />
        <KV label="Brute-force eşiği" value="5 başarısız / 5 dk" />
        <KV label="Impossible travel" value="800 km/sa eşik" />
        <KV label="TOR exit list" value="otomatik blok" />
        <KV label="HIBP kontrol" value="aktif (haftalık)" />
        <KV label="Step-up trigger" value="yeni cihaz · yeni geo" />
        <KV label="Session TTL" value="24sa · idle 2sa" />
      </CardBody>
    </Card>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function trend24(_n: string, min: number, max: number): Array<{ label: string; value: number }> {
  return Array.from({ length: 24 }, (_, i) => ({
    label: `${i}:00`,
    value: Math.round(min + ((max - min) * (Math.sin(i / 3) + 1)) / 2),
  }));
}
