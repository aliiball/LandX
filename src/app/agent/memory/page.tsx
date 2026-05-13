import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Card, CardBody, CardHeader, Tabs } from '@/components/ui';

const ENTRIES = [
  {
    id: 'mem_001',
    text: 'Kullanıcı Çeşme bölgesine ilgi gösteriyor (12 görüntüleme, 4 favori)',
    score: 0.92,
  },
  { id: 'mem_002', text: 'Tercih: imarlı tarla, max 5 milyon ₺', score: 0.88 },
  {
    id: 'mem_003',
    text: 'Geçen ay AI değerleme yaptırdığı 3 ilan üst çeyrek tahminde',
    score: 0.81,
  },
  { id: 'mem_004', text: 'Mesajlaşma stili kısa ve teknik', score: 0.74 },
];

export default function AgentMemoryPage() {
  const renderList = (subset: typeof ENTRIES) => (
    <Card>
      <CardBody className="flex flex-col gap-2 text-sm">
        {subset.map((e) => (
          <div
            key={e.id}
            className="flex items-start justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-2"
          >
            <div>
              <p className="font-mono text-xs text-[var(--text-tertiary)]">{e.id}</p>
              <p>{e.text}</p>
            </div>
            <Badge tone="violet" size="sm">
              {e.score.toFixed(2)}
            </Badge>
          </div>
        ))}
      </CardBody>
    </Card>
  );

  return (
    <AgentPage surfaceKey="D5 · /agent/memory" module="A04 Agent Memory" title="Memory Layers">
      <Tabs
        items={[
          { id: 'short', label: 'Short-term', content: renderList(ENTRIES.slice(0, 2)) },
          { id: 'long', label: 'Long-term', content: renderList(ENTRIES) },
          { id: 'episodic', label: 'Episodic', content: renderList(ENTRIES.slice(1, 3)) },
          { id: 'procedural', label: 'Procedural', content: renderList(ENTRIES.slice(0, 1)) },
        ]}
      />
      <Card>
        <CardHeader>
          <span className="font-medium">Embedding viz (UMAP 2D)</span>
        </CardHeader>
        <CardBody>
          <div className="relative h-48 overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-slate)]">
            {ENTRIES.map((e, i) => (
              <div
                key={e.id}
                className="absolute size-2 rounded-full bg-[var(--accent-violet)]"
                style={{
                  left: `${20 + ((i * 17) % 70)}%`,
                  top: `${30 + ((i * 23) % 50)}%`,
                  opacity: 0.4 + e.score * 0.6,
                }}
                aria-label={e.id}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </AgentPage>
  );
}
