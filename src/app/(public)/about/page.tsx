import { Card, CardBody, Icon } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { Brain, Map as MapIcon, Shield, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12 md:px-6">
      <header>
        <h1 className={headingRecipe({ level: 'h1' })}>arsam.net hakkında</h1>
        <p className="mt-3 max-w-2xl text-[var(--text-lead)] text-[var(--text-secondary)]">
          AI-native, mobile-first, arsa-odaklı marketplace. LandX agent meta-framework'ü üzerine
          inşa edilen birinci uygulama.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: Brain,
            title: 'AI-first deneyim',
            body: 'Doğal dil arama, AI değerleme, AI Q&A, AI açıklama — her ekranda LLM co-pilot.',
            tone: 'violet' as const,
          },
          {
            icon: MapIcon,
            title: 'Sadece arsa',
            body: 'Konut/işyeri değil; konut imarlı, ticari, tarla, sanayi, turizm — derinleşmiş arsa vertikali.',
            tone: 'cyan' as const,
          },
          {
            icon: Shield,
            title: 'KVKK + tapu doğrulama',
            body: 'Hash chain ile tapu kanıtı, KVKK uyumlu mesajlaşma, audit trail.',
            tone: 'lime' as const,
          },
          {
            icon: Users,
            title: 'Multi-tenant SaaS',
            body: 'Bireysel kullanıcı, emlakçı ofisi, kurumsal — aynı platform, ayrı bağlam.',
            tone: 'amber' as const,
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardBody className="flex flex-col gap-2">
              <Icon icon={item.icon} size={24} tone={item.tone} />
              <h2 className="text-lg font-medium">{item.title}</h2>
              <p className="text-sm text-[var(--text-secondary)]">{item.body}</p>
            </CardBody>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={headingRecipe({ level: 'h3' })}>Misyon</h2>
        <p className="text-[var(--text-secondary)]">
          Türkiye'de arsa alım-satım sürecini şeffaf, AI-asistanlı ve mobile-first hale getirmek.
          Her tıklamanın gerçek bir aksiyon ürettiği, her cevabın kaynaklı olduğu, her veri
          noktasının KVKK uyumlu yönetildiği bir marketplace.
        </p>
      </section>
    </main>
  );
}
