import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Button, Card, CardBody, CardHeader, Input, toast } from '@/components/ui';
import { useState } from 'react';

const INDEXES = [
  { name: 'listings-content', model: 'text-embedding-3-large', vectors: 240_000, queue: 12 },
  { name: 'broker-profiles', model: 'text-embedding-3-large', vectors: 1_200, queue: 0 },
  { name: 'audit-logs', model: 'text-embedding-3-small', vectors: 18_400, queue: 0 },
];

export default function AgentVectorsPage() {
  const [query, setQuery] = useState('');
  return (
    <AgentPage surfaceKey="D6 · /agent/vectors" module="A05 Vector Store" title="Vectors">
      <Card>
        <CardHeader>
          <span className="font-medium">Index'ler</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {INDEXES.map((idx) => (
            <div
              key={idx.name}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
            >
              <div>
                <p className="font-medium">{idx.name}</p>
                <p className="font-mono text-xs text-[var(--text-tertiary)]">{idx.model}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="tabular-nums">{idx.vectors.toLocaleString('tr-TR')} vector</span>
                <Badge tone={idx.queue > 0 ? 'warning' : 'success'} size="sm">
                  Queue: {idx.queue}
                </Badge>
                <Button
                  size="sm"
                  tone="ghost"
                  onClick={() => toast.success(`${idx.name} reindex başlatıldı`)}
                >
                  Reindex
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Hibrit arama playground</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="örn: Çeşme imarlı tarla"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => toast.success(`Vector + BM25 sorgu: "${query || '...'}" — 24 sonuç`)}
            >
              Çalıştır
            </Button>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <Card tone="solid">
              <CardHeader>
                <span className="font-medium text-sm">Vector skoru</span>
              </CardHeader>
              <CardBody>
                <ul className="flex flex-col gap-1 font-mono text-xs">
                  <li>lst_00042 — 0.91</li>
                  <li>lst_00018 — 0.87</li>
                  <li>lst_00104 — 0.84</li>
                </ul>
              </CardBody>
            </Card>
            <Card tone="solid">
              <CardHeader>
                <span className="font-medium text-sm">BM25 skoru</span>
              </CardHeader>
              <CardBody>
                <ul className="flex flex-col gap-1 font-mono text-xs">
                  <li>lst_00018 — 12.4</li>
                  <li>lst_00042 — 11.8</li>
                  <li>lst_00077 — 10.2</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </AgentPage>
  );
}
