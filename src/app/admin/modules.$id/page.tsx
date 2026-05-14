import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Card, CardBody, CardHeader, Icon } from '@/components/ui';
import { getModules } from '@/mocks/seed/admin';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router';

export default function ModuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const modules = getModules();
  const m = modules.find((x) => x.id === id) ?? modules[0];
  if (!m) return null;

  return (
    <AdminPage
      surfaceKey={`C · /admin/modules/${m.code}`}
      module={`Module ${m.code}`}
      title={m.name}
      description={m.description}
      actions={
        <Link
          to="/admin/modules"
          className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <Icon icon={ChevronLeft} size={14} /> Modül kataloğu
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <span className="font-medium">Özet</span>
            <Badge
              tone={
                m.implStatus === 'full'
                  ? 'success'
                  : m.implStatus === 'partial'
                    ? 'warning'
                    : 'info'
              }
              size="sm"
            >
              {m.implStatus}
            </Badge>
          </CardHeader>
          <CardBody className="flex flex-col gap-3 text-sm">
            <KV label="Layer" value={m.layer} mono />
            <KV label="Code" value={m.code} mono />
            <KV
              label="AI / MCP"
              value={`${m.aiEnabled ? '✓' : '–'} AI · ${m.mcpEnabled ? '✓' : '–'} MCP`}
            />
            <KV label="Açıklama" value={m.description} />
          </CardBody>
        </Card>

        <Card tone="solid">
          <CardHeader>
            <span className="font-medium">Routes</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-2 text-sm">
            {(m.routes ?? []).length === 0 ? (
              <span className="text-[var(--text-tertiary)]">
                Bu modül için runtime route tanımlı değil.
              </span>
            ) : (
              (m.routes ?? []).map((r) => (
                <Link
                  key={r}
                  to={r}
                  className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2 font-mono text-xs hover:border-[var(--accent-cyan)]"
                >
                  <span>{r}</span>
                  <Icon icon={ExternalLink} size={12} tone="cyan" />
                </Link>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <span className="font-medium">Bağımlılıklar (mock)</span>
        </CardHeader>
        <CardBody className="grid gap-2 sm:grid-cols-2">
          {['K05 Feature Flags', 'D01 Audit Log', 'I02 User & Identity']
            .filter((d) => !d.startsWith(m.code))
            .map((d) => (
              <div
                key={d}
                className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2 text-sm"
              >
                <Badge size="sm" tone="info">
                  →
                </Badge>
                <span className="font-mono text-xs">{d}</span>
              </div>
            ))}
        </CardBody>
      </Card>
    </AdminPage>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className={mono ? 'font-mono text-xs' : 'text-sm'}>{value}</span>
    </div>
  );
}
