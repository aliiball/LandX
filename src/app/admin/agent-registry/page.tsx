import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Card, CardBody, CardHeader, Icon, Tabs } from '@/components/ui';
import { getMemoryEntries, getTools, getVectorIndexes } from '@/mocks/seed/agent';
import { Brain, Database, Sparkles, Wrench } from 'lucide-react';

const SCOPE_TONE = {
  read: 'info',
  write: 'warning',
  admin: 'danger',
  agent: 'agent',
} as const;

export default function AdminAgentRegistryPage() {
  const tools = getTools();
  const memory = getMemoryEntries();
  const vectors = getVectorIndexes();

  return (
    <AdminPage
      surfaceKey="C · /admin/agent-registry"
      module="A02 / A04 / A05"
      title="Agent Registry"
      description="Tool registry (A02) · memory layer (A04) · vector store (A05) — tek panel."
      kpis={[
        { label: 'Tool', value: String(tools.length), tone: 'violet' },
        { label: 'Signed', value: String(tools.filter((t) => t.signed).length), tone: 'lime' },
        { label: 'Memory', value: String(memory.length), tone: 'cyan' },
        { label: 'Vector index', value: String(vectors.length), tone: 'magenta' },
      ]}
    >
      <Tabs
        items={[
          {
            id: 'tools',
            label: `Tools (${tools.length})`,
            content: (
              <AdminTable
                title="Tool Registry — LLM exposure"
                columns={[
                  { key: 'name', label: 'Ad' },
                  { key: 'desc', label: 'Açıklama' },
                  { key: 'scope', label: 'Scope' },
                  { key: 'side', label: 'Yan-etki' },
                  { key: 'blast', label: 'Blast' },
                  { key: 'score', label: 'LLM-read.', align: 'right' },
                  { key: 'calls', label: 'Çağrı/gün', align: 'right' },
                  { key: 'err', label: 'Hata %', align: 'right' },
                ]}
                rows={tools.map((t) => ({
                  name: (
                    <span className="flex items-center gap-2">
                      <Icon icon={Wrench} tone="violet" size={14} />
                      <span className="font-mono text-xs">{t.name}</span>
                    </span>
                  ),
                  desc: <span className="text-xs">{t.description}</span>,
                  scope: (
                    <Badge tone={SCOPE_TONE[t.scope]} size="sm">
                      {t.scope}
                    </Badge>
                  ),
                  side: (
                    <Badge
                      tone={
                        t.sideEffect === 'destructive'
                          ? 'danger'
                          : t.sideEffect === 'idempotent'
                            ? 'warning'
                            : 'success'
                      }
                      size="sm"
                    >
                      {t.sideEffect}
                    </Badge>
                  ),
                  blast: <span className="text-xs">{t.blastRadius}</span>,
                  score: <span className="tabular-nums">{t.llmReadabilityScore}</span>,
                  calls: (
                    <span className="tabular-nums">{t.callsPerDay.toLocaleString('tr-TR')}</span>
                  ),
                  err: (
                    <span
                      className={`tabular-nums text-xs ${t.errorRatePercent > 2 ? 'text-[var(--accent-magenta)]' : ''}`}
                    >
                      {t.errorRatePercent.toFixed(1)}
                    </span>
                  ),
                }))}
              />
            ),
          },
          {
            id: 'memory',
            label: `Memory (${memory.length})`,
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon icon={Brain} tone="cyan" />
                    <span className="font-medium">Memory Layer</span>
                    <Badge tone="agent" size="sm">
                      episodic · semantic · preference · tool_use · procedural
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody className="grid gap-2 sm:grid-cols-5">
                  {(['episodic', 'semantic', 'preference', 'tool_use', 'procedural'] as const).map(
                    (kind) => {
                      const items = memory.filter((m) => m.kind === kind);
                      return (
                        <div
                          key={kind}
                          className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
                        >
                          <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                            {kind}
                          </span>
                          <span className="text-2xl font-semibold tabular-nums">
                            {items.length}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)]">
                            ort. önem{' '}
                            {(
                              items.reduce((s, x) => s + x.importance, 0) /
                              Math.max(items.length, 1)
                            ).toFixed(2)}
                          </span>
                        </div>
                      );
                    },
                  )}
                </CardBody>
                <CardBody>
                  <AdminTable
                    columns={[
                      { key: 'kind', label: 'Kind' },
                      { key: 'subject', label: 'Subject' },
                      { key: 'content', label: 'İçerik' },
                      { key: 'imp', label: 'Önem', align: 'right' },
                      { key: 'ttl', label: 'TTL', align: 'right' },
                    ]}
                    rows={memory.slice(0, 14).map((m) => ({
                      kind: (
                        <Badge size="sm" tone="info">
                          {m.kind}
                        </Badge>
                      ),
                      subject: <span className="font-mono text-xs">{m.subjectId}</span>,
                      content: <span className="text-xs">{m.content}</span>,
                      imp: <span className="tabular-nums text-xs">{m.importance.toFixed(2)}</span>,
                      ttl: (
                        <span className="text-xs">
                          {m.ttlDays === 'never' ? '∞' : `${m.ttlDays}g`}
                        </span>
                      ),
                    }))}
                  />
                </CardBody>
              </Card>
            ),
          },
          {
            id: 'vectors',
            label: `Vector (${vectors.length})`,
            content: (
              <div className="grid gap-3">
                {vectors.map((v) => (
                  <Card key={v.id}>
                    <CardBody className="grid gap-3 lg:grid-cols-[2fr_repeat(5,_1fr)] lg:items-center">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Icon icon={Database} tone="magenta" size={14} />
                          <span className="font-mono text-sm">{v.name}</span>
                          {v.hybrid && (
                            <Badge tone="agent" size="sm">
                              hybrid
                            </Badge>
                          )}
                          {v.reindexingAt && (
                            <Badge tone="warning" size="sm">
                              reindexing
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-[var(--text-tertiary)]">{v.collection}</span>
                      </div>
                      <KV label="Dim" value={String(v.dim)} />
                      <KV label="Count" value={v.count.toLocaleString('tr-TR')} />
                      <KV label="Model" value={v.model} mono />
                      <KV label="Size" value={`${v.sizeMb.toFixed(1)} MB`} />
                      <KV label="Reindex" value={v.reindexingAt ? 'devam' : '—'} />
                    </CardBody>
                  </Card>
                ))}
                <Card tone="solid">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon icon={Sparkles} tone="violet" />
                      <span className="font-medium">Hibrit arama playground</span>
                    </div>
                  </CardHeader>
                  <CardBody className="grid gap-2 text-xs text-[var(--text-secondary)]">
                    <p>Vector + BM25 paralel skor; ardından reranker.</p>
                    <code className="block rounded-[var(--radius-md)] bg-[var(--surface-base)] p-3 font-mono text-xs">
                      score = α·cosine(qVec, dVec) + β·bm25(q, d) + γ·recencyBoost(d)
                    </code>
                  </CardBody>
                </Card>
              </div>
            ),
          },
        ]}
      />
    </AdminPage>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className={mono ? 'font-mono text-xs' : 'font-medium text-sm'}>{value}</span>
    </div>
  );
}
