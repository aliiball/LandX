import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Card, CardBody, CardHeader, Icon, Tabs } from '@/components/ui';
import { Check, X } from 'lucide-react';

const ROLES = ['individual', 'broker', 'broker-admin', 'broker-agent', 'system-operator'];
const ACTIONS = [
  'listing:view',
  'listing:create',
  'listing:update',
  'listing:delete',
  'lead:assign',
  'broker:invite',
  'admin:all',
  'agent:debug',
];

const MATRIX: Record<string, Set<string>> = {
  individual: new Set(['listing:view']),
  broker: new Set(['listing:view', 'listing:create', 'listing:update']),
  'broker-admin': new Set([
    'listing:view',
    'listing:create',
    'listing:update',
    'listing:delete',
    'lead:assign',
    'broker:invite',
  ]),
  'broker-agent': new Set(['listing:view', 'listing:update']),
  'system-operator': new Set(ACTIONS),
};

export default function AdminRolesPage() {
  return (
    <AdminPage
      surfaceKey="C4 · /admin/roles"
      module="I04 Permission Framework"
      title="Roles & Permissions (RBAC)"
      kpis={[
        { label: 'Rol', value: '5', tone: 'cyan' },
        { label: 'Action', value: `${ACTIONS.length}`, tone: 'lime' },
        { label: 'Agent Cap.', value: '24', tone: 'violet' },
        { label: 'İhlal (7g)', value: '0', tone: 'lime' },
      ]}
    >
      <Tabs
        items={[
          {
            id: 'rbac',
            label: 'RBAC Matrix',
            content: (
              <Card>
                <CardHeader>
                  <span className="font-medium">Action × Role</span>
                </CardHeader>
                <CardBody className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--stroke-subtle)]">
                        <th className="py-2 pr-3 text-left text-xs uppercase text-[var(--text-tertiary)]">
                          Action
                        </th>
                        {ROLES.map((r) => (
                          <th
                            key={r}
                            className="py-2 pr-3 text-center text-xs uppercase text-[var(--text-tertiary)]"
                          >
                            {r}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ACTIONS.map((a) => (
                        <tr key={a} className="border-b border-[var(--stroke-subtle)]/40">
                          <td className="py-2 pr-3 font-mono text-xs">{a}</td>
                          {ROLES.map((r) => {
                            const allowed = MATRIX[r]?.has(a) ?? false;
                            return (
                              <td key={r} className="py-2 pr-3 text-center">
                                {allowed ? (
                                  <Icon icon={Check} tone="lime" size={16} />
                                ) : (
                                  <Icon icon={X} tone="tertiary" size={16} />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            ),
          },
          {
            id: 'agent',
            label: 'Agent Capability Scope',
            content: (
              <Card>
                <CardBody className="flex flex-col gap-2">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Agent kimlikleri için tool-level scope binding. A03 surface'inden senkronize.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      'search.*',
                      'valuation.estimate',
                      'description.generate',
                      'post_listing',
                      'send_message',
                    ].map((s) => (
                      <div
                        key={s}
                        className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2 text-sm"
                      >
                        <span className="font-mono">{s}</span>
                        <Badge tone="agent" size="sm">
                          12 agent
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ),
          },
        ]}
      />
    </AdminPage>
  );
}
