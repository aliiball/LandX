import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Card, CardBody, Icon, Input, Select } from '@/components/ui';
import { getModules } from '@/mocks/seed/admin';
import type { ModuleLayer } from '@/types/admin';
import { Layers, Search, Sparkles, ZapOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

const LAYERS: ModuleLayer[] = [
  'L0-Kernel',
  'L1-Identity',
  'L2-AI-Runtime',
  'L3-Application',
  'L4-Data-Compliance',
  'L5-Operations',
];

const LAYER_COLOR: Record<ModuleLayer, string> = {
  'L0-Kernel': 'var(--accent-cyan)',
  'L1-Identity': 'var(--accent-violet)',
  'L2-AI-Runtime': 'var(--accent-magenta)',
  'L3-Application': 'var(--accent-lime)',
  'L4-Data-Compliance': 'var(--accent-amber)',
  'L5-Operations': 'var(--accent-cyan)',
};

export default function AdminModulesPage() {
  const modules = getModules();
  const [layer, setLayer] = useState<'all' | ModuleLayer>('all');
  const [impl, setImpl] = useState<'all' | 'full' | 'partial' | 'planned'>('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(
    () =>
      modules.filter((m) => {
        if (layer !== 'all' && m.layer !== layer) return false;
        if (impl !== 'all' && m.implStatus !== impl) return false;
        if (
          q &&
          !m.name.toLowerCase().includes(q.toLowerCase()) &&
          !m.code.toLowerCase().includes(q.toLowerCase())
        )
          return false;
        return true;
      }),
    [modules, layer, impl, q],
  );

  return (
    <AdminPage
      surfaceKey="C · /admin/modules"
      module="Modules Catalog"
      title="Modüller (33)"
      description="Excel’den türetilmiş modül kataloğu. 6 katman, implStatus & AI/MCP filtre."
      kpis={[
        { label: 'Modül', value: String(modules.length), tone: 'cyan' },
        {
          label: 'Full',
          value: String(modules.filter((m) => m.implStatus === 'full').length),
          tone: 'lime',
        },
        {
          label: 'Partial',
          value: String(modules.filter((m) => m.implStatus === 'partial').length),
          tone: 'amber',
        },
        {
          label: 'AI / MCP',
          value: `${modules.filter((m) => m.aiEnabled).length} / ${modules.filter((m) => m.mcpEnabled).length}`,
          tone: 'violet',
        },
      ]}
      actions={
        <>
          <Input
            size="sm"
            placeholder="Modül ara"
            leftSlot={<Icon icon={Search} size={14} />}
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
          />
          <Select
            size="sm"
            value={layer}
            onChange={(e) => setLayer(e.currentTarget.value as 'all' | ModuleLayer)}
            options={[
              { value: 'all', label: 'Tüm katman' },
              ...LAYERS.map((l) => ({ value: l, label: l })),
            ]}
          />
          <Select
            size="sm"
            value={impl}
            onChange={(e) =>
              setImpl(e.currentTarget.value as 'all' | 'full' | 'partial' | 'planned')
            }
            options={[
              { value: 'all', label: 'Tüm durum' },
              { value: 'full', label: 'Full' },
              { value: 'partial', label: 'Partial' },
              { value: 'planned', label: 'Planned' },
            ]}
          />
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((m) => (
          <Link key={m.id} to={`/admin/modules/${m.id}`}>
            <Card className="h-full">
              <CardBody className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-xs uppercase tracking-wider"
                    style={{ color: LAYER_COLOR[m.layer] }}
                  >
                    {m.code}
                  </span>
                  <div className="flex gap-1">
                    {m.aiEnabled && (
                      <Badge size="sm" tone="agent">
                        AI
                      </Badge>
                    )}
                    {m.mcpEnabled && (
                      <Badge size="sm" tone="info">
                        MCP
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon={m.implStatus === 'planned' ? ZapOff : m.aiEnabled ? Sparkles : Layers}
                    tone="cyan"
                    size={14}
                  />
                  <span className="font-medium">{m.name}</span>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">{m.description}</span>
                <div className="flex items-center justify-between text-xs">
                  <Badge
                    size="sm"
                    tone={
                      m.implStatus === 'full'
                        ? 'success'
                        : m.implStatus === 'partial'
                          ? 'warning'
                          : 'info'
                    }
                  >
                    {m.implStatus}
                  </Badge>
                  <span className="text-[var(--text-tertiary)]">{m.layer}</span>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card>
          <CardBody className="py-8 text-center text-sm text-[var(--text-tertiary)]">
            Filtreye uyan modül bulunamadı.
          </CardBody>
        </Card>
      )}
    </AdminPage>
  );
}
