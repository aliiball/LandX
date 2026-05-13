import { LayoutTopBar } from '@/components/layout/LayoutTopBar';
import { Outlet } from 'react-router';

export default function AgentLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LayoutTopBar surfaceLabel="Agent · MCP Debugger" envBadge="dev" />
      <div className="grid flex-1 grid-cols-1 gap-px bg-[var(--stroke-subtle)] lg:grid-cols-[260px_1fr_320px]">
        <aside className="bg-[var(--surface-obsidian)] p-4 font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
          Conversations · Tools · Prompts · Agents
        </aside>
        <main className="flex flex-col bg-[var(--surface-void)]">
          <Outlet />
        </main>
        <aside className="hidden bg-[var(--surface-obsidian)] p-4 font-mono text-xs uppercase tracking-wider text-[var(--text-tertiary)] lg:block">
          Inspector · Live Stream
        </aside>
      </div>
    </div>
  );
}
