import { Badge, Icon } from '@/components/ui';
import { Command } from 'cmdk';
import {
  Bell,
  Bot,
  Building2,
  ChartArea,
  FileSearch,
  FlaskConical,
  GitBranch,
  Globe2,
  Heart,
  HelpCircle,
  KeyRound,
  Layers,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Plus,
  Search,
  ServerCog,
  Settings,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

type Item = {
  id: string;
  label: string;
  hint?: string;
  href?: string;
  icon: typeof Search;
  group: string;
  keywords?: string;
  action?: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const ITEMS: Item[] = [
    {
      id: 'go-home',
      label: 'Ana sayfa',
      icon: Globe2,
      group: 'Git',
      href: '/',
      keywords: 'home landing',
    },
    { id: 'go-search', label: 'Arama', icon: Search, group: 'Git', href: '/search' },
    { id: 'go-compare', label: 'Karşılaştır', icon: Layers, group: 'Git', href: '/compare' },
    { id: 'go-post', label: 'İlan ver (Wizard)', icon: Plus, group: 'Git', href: '/post-listing' },
    {
      id: 'go-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      group: 'Git',
      href: '/dashboard',
    },
    {
      id: 'go-favorites',
      label: 'Favoriler',
      icon: Heart,
      group: 'Git',
      href: '/dashboard/favorites',
    },
    {
      id: 'go-ai-history',
      label: 'AI Sohbet Geçmişi',
      icon: Sparkles,
      group: 'Git',
      href: '/dashboard/ai-history',
    },
    {
      id: 'go-messages',
      label: 'Mesajlar',
      icon: MessageSquare,
      group: 'Git',
      href: '/dashboard/messages',
    },
    { id: 'go-broker', label: 'Broker Paneli', icon: Building2, group: 'Git', href: '/broker' },
    {
      id: 'go-broker-leads',
      label: 'Lead / CRM',
      icon: ListChecks,
      group: 'Git',
      href: '/broker/leads',
    },
    {
      id: 'go-broker-perf',
      label: 'Broker Performans (Heatmap)',
      icon: ChartArea,
      group: 'Git',
      href: '/broker/performance',
    },
    { id: 'go-admin', label: 'Admin Paneli', icon: ShieldCheck, group: 'Git', href: '/admin' },
    { id: 'go-admin-mcp', label: 'MCP Server', icon: ServerCog, group: 'Git', href: '/admin/mcp' },
    {
      id: 'go-admin-doctype',
      label: 'DocType Studio',
      icon: FileSearch,
      group: 'Git',
      href: '/admin/doctype-studio',
    },
    {
      id: 'go-admin-tkgm',
      label: 'TKGM Operasyonları',
      icon: FileSearch,
      group: 'Git',
      href: '/admin/tkgm',
    },
    {
      id: 'go-admin-audit',
      label: 'Audit + Hash Chain',
      icon: ShieldCheck,
      group: 'Git',
      href: '/admin/audit',
    },
    {
      id: 'go-admin-flags',
      label: 'Feature Flags',
      icon: FlaskConical,
      group: 'Git',
      href: '/admin/feature-flags',
    },
    {
      id: 'go-admin-workflow',
      label: 'Workflow Designer',
      icon: GitBranch,
      group: 'Git',
      href: '/admin/workflow-designer',
    },
    {
      id: 'go-admin-reports',
      label: 'Raporlar',
      icon: ChartArea,
      group: 'Git',
      href: '/admin/reports',
    },
    {
      id: 'go-admin-modules',
      label: 'Modüller (33)',
      icon: Layers,
      group: 'Git',
      href: '/admin/modules',
    },
    { id: 'go-agent', label: 'Agent / MCP Debugger', icon: Bot, group: 'Git', href: '/agent' },
    {
      id: 'go-agent-tools',
      label: 'Tool Registry',
      icon: Wrench,
      group: 'Git',
      href: '/agent/tools',
    },
    {
      id: 'go-notifications',
      label: 'Bildirimler',
      icon: Bell,
      group: 'Git',
      href: '/notifications',
    },
    { id: 'go-help', label: 'Yardım & Kısayollar', icon: HelpCircle, group: 'Git', href: '/help' },
    { id: 'go-design', label: 'Design System', icon: Settings, group: 'Git', href: '/design' },
    {
      id: 'go-legal-ai',
      label: 'AI Uyumluluk Beyanı',
      icon: ShieldCheck,
      group: 'Git',
      href: '/legal/ai',
    },
    {
      id: 'go-legal-kvkk',
      label: 'KVKK Aydınlatma',
      icon: ShieldCheck,
      group: 'Git',
      href: '/legal/kvkk',
    },
    {
      id: 'act-persona',
      label: 'Persona değiştir',
      hint: 'Ctrl+Shift+P',
      icon: KeyRound,
      group: 'Eylem',
      action: () => window.dispatchEvent(new CustomEvent('landx:open-persona')),
    },
    {
      id: 'act-ai',
      label: 'AI asistana sor…',
      hint: 'Sonraki: panel',
      icon: Sparkles,
      group: 'Eylem',
      action: () => window.dispatchEvent(new CustomEvent('landx:open-assistant')),
    },
    { id: 'act-login', label: 'Giriş yap', icon: KeyRound, group: 'Eylem', href: '/login' },
    {
      id: 'act-register',
      label: 'Hesap oluştur',
      icon: KeyRound,
      group: 'Eylem',
      href: '/register',
    },
  ];

  const groups = Array.from(new Set(ITEMS.map((i) => i.group)));

  if (!open) return null;
  return (
    <>
      <button
        type="button"
        aria-label="Komut paletini kapat"
        className="fixed inset-0 z-[80] bg-[var(--surface-void)]/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-[12vh] z-[81] w-[min(640px,_92vw)] -translate-x-1/2">
        <Command
          label="Komut paleti"
          className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--stroke-default)] bg-[var(--surface-elevated)] shadow-[var(--glow-cyan)]"
        >
          <div className="flex items-center gap-2 border-b border-[var(--stroke-subtle)] px-3 py-2">
            <Icon icon={Search} size={14} tone="cyan" />
            <Command.Input
              autoFocus
              placeholder="Komut, sayfa veya niyet ara…"
              className="flex-1 bg-transparent text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none"
            />
            <Badge size="sm" tone="info">
              Cmd+K
            </Badge>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--text-tertiary)]">
              Sonuç bulunamadı.
            </Command.Empty>
            {groups.map((g) => (
              <Command.Group
                key={g}
                heading={g}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-[var(--text-tertiary)]"
              >
                {ITEMS.filter((i) => i.group === g).map((i) => (
                  <Command.Item
                    key={i.id}
                    value={`${i.label} ${i.keywords ?? ''}`}
                    onSelect={() => {
                      if (i.href) {
                        go(i.href);
                      } else {
                        i.action?.();
                        setOpen(false);
                      }
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-2 py-2 text-sm aria-selected:bg-[var(--surface-elevated)]/80 data-[selected=true]:bg-[var(--surface-base)] data-[selected=true]:text-[var(--text-primary)]"
                  >
                    <Icon icon={i.icon} size={14} tone="cyan" />
                    <span className="flex-1">{i.label}</span>
                    {i.hint && (
                      <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                        {i.hint}
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
          <div className="flex items-center justify-between gap-2 border-t border-[var(--stroke-subtle)] px-3 py-2 text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
            <span>↑↓ gez · ↵ aç · Esc kapat</span>
            <span>AI önerisi: Cmd+K → "kvkk" yazıp deneyin</span>
          </div>
        </Command>
      </div>
    </>
  );
}
