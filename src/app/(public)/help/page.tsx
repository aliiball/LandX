import { Badge, Card, CardBody, CardHeader, Icon, Input } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { BookOpen, Command, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], desc: 'Komut paleti aç' },
  { keys: ['Ctrl', 'Shift', 'P'], desc: 'Persona değiştirici' },
  { keys: ['/'], desc: 'Arama kutusu' },
  { keys: ['G', 'D'], desc: "Dashboard'a git" },
  { keys: ['G', 'B'], desc: 'Broker paneline git' },
  { keys: ['G', 'A'], desc: 'Admin paneline git' },
  { keys: ['F'], desc: 'Favori ekle / kaldır' },
  { keys: ['?'], desc: 'Bu sayfayı aç' },
  { keys: ['Esc'], desc: 'Modal/menü kapat' },
];

const FAQ = [
  {
    q: 'TKGM doğrulaması ne yapar?',
    a: 'TKGM gateway üzerinden tapu kaydını sorgular. Başarılı sorgu OK, geçersiz ada/parselde E001, sistem timeoutunda E002, rate-limit aşımında E003 döner. Detaylar /admin/tkgm altında.',
  },
  {
    q: 'KVKK m.11 hakkımı nasıl kullanırım?',
    a: 'Profil sayfanızdan "Verilerimi indir" veya "Hesabı sil" düğmesine basabilirsiniz. Talep otomatik olarak D02 PII Governance kuyruğuna düşer ve 30 gün içinde yanıtlanır.',
  },
  {
    q: 'AI değerlemeye nasıl güvenebilirim?',
    a: 'Her değerleme min/tahmini/max + güven (%) gösterir. Faktörler kartında "Neden bu fiyat?" detayını açabilirsiniz. AI çıktıları öneri niteliğindedir — otomatik hukuki sonuç doğurmaz.',
  },
  {
    q: 'Persona switcher nedir?',
    a: 'Demo modunda Ctrl+Shift+P kısayolu ile 5 farklı kullanıcı rolü arasında (buyer / seller / broker / admin / agent) anlık geçiş yapabilirsiniz. Veriler URL ve sessionStorage ile senkronize.',
  },
  {
    q: 'Zeytinlik nasıl bir kategori?',
    a: '3573 sayılı kanun gereği 100\'den fazla zeytin ağacı olan parseller "zeytinlik" sayılır ve inşaat kısıtlamasına tabidir. İlan filtrelerinde ayrı imar tipi olarak gösterilir.',
  },
  {
    q: 'Şerh ve tedbir farkı?',
    a: 'TMK m.1010 kapsamında şerh, m.1011 kapsamında tedbir kaydı bulunur. Şerh çoğunlukla irade beyanlarına, tedbir mahkeme kararlarına dayanır. Listing detay sayfasında ayrı gösterilir.',
  },
];

export default function HelpPage() {
  const [q, setQ] = useState('');
  const filtered = FAQ.filter(
    (f) =>
      !q ||
      f.q.toLowerCase().includes(q.toLowerCase()) ||
      f.a.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <header className="flex flex-col gap-2">
        <h1 className={headingRecipe({ level: 'h2' })}>Yardım & Kısayollar</h1>
        <p className="text-[var(--text-secondary)]">
          Sıkça sorulanlar, klavye kısayolları, KVKK hakları, AI rehberi.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Search} tone="cyan" />
            <span className="font-medium">Yardımda ara</span>
          </div>
        </CardHeader>
        <CardBody>
          <Input
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            placeholder="Soru / anahtar kelime"
            leftSlot={<Icon icon={Search} size={14} />}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Command} tone="violet" />
            <span className="font-medium">Klavye Kısayolları</span>
          </div>
          <Badge size="sm" tone="info">
            {SHORTCUTS.length}
          </Badge>
        </CardHeader>
        <CardBody className="grid gap-2 sm:grid-cols-2">
          {SHORTCUTS.map((s) => (
            <div
              key={s.desc}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2"
            >
              <span className="text-sm">{s.desc}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="rounded-[var(--radius-sm)] border border-[var(--stroke-default)] bg-[var(--surface-elevated)] px-1.5 py-0.5 font-mono text-[10px]"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={BookOpen} tone="amber" />
            <span className="font-medium">Sıkça Sorulanlar</span>
          </div>
          <Badge size="sm" tone="info">
            {filtered.length}
          </Badge>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {filtered.map((item) => (
            <details
              key={item.q}
              className="group rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
            >
              <summary className="cursor-pointer list-none font-medium">
                <span className="mr-2 text-[var(--text-tertiary)] group-open:rotate-90 inline-block transition-transform">
                  ›
                </span>
                {item.q}
              </summary>
              <p className="mt-2 pl-5 text-sm text-[var(--text-secondary)]">{item.a}</p>
            </details>
          ))}
        </CardBody>
      </Card>

      <Card tone="solid">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Sparkles} tone="violet" />
            <span className="font-medium">AI yardım asistanı</span>
          </div>
        </CardHeader>
        <CardBody className="text-sm text-[var(--text-secondary)]">
          Aradığınızı bulamadıysanız, dashboard'daki AI asistana sorabilirsiniz.{' '}
          <span className="font-mono text-[var(--accent-cyan)]">/dashboard/ai</span> → "Yardım: ..."
          şeklinde başlayan sorular yardım indeksini öncelikli kaynak olarak kullanır.
        </CardBody>
      </Card>
    </main>
  );
}
