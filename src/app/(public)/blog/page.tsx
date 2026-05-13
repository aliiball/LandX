import { Badge, Card, CardBody, CardHeader } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useRouteHref } from '@/lib/routing/useRouteHref';
import { useNavigate } from 'react-router';

const POSTS = [
  {
    slug: 'imar-bilirkisi-2026',
    title: 'İmar Barışı 2026: Yeni başlığa ne kadar yakınız?',
    summary:
      'Çevre Bakanlığı taslak metni ve sektör beklentileri — arsa sahipleri için pratik özet.',
    tag: 'Mevzuat',
    date: '2026-05-08',
  },
  {
    slug: 'cesme-yatirim-rehberi',
    title: 'Çeşme arsa yatırımı: 2026 rehberi',
    summary:
      'Çiftlikköy, Alaçatı, Ovacık karşılaştırması; fiyat/m² trendi, AI değerleme örnekleri.',
    tag: 'Yatırım',
    date: '2026-04-22',
  },
  {
    slug: 'tapu-dogrulama-akisi',
    title: 'Tapu hash doğrulama akışı nasıl çalışıyor?',
    summary: 'arsam.net altyapısı: hash + zaman damgası + KVKK uyumu — teknik derinlemesine.',
    tag: 'Teknik',
    date: '2026-03-15',
  },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const postHref = useRouteHref('blogPost', { slug: ':slug' });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12 md:px-6">
      <header>
        <h1 className={headingRecipe({ level: 'h2' })}>Blog</h1>
        <p className="text-[var(--text-secondary)]">
          Yasal güncellemeler, bölgesel analiz, AI özellik notları.
        </p>
      </header>
      <div className="grid gap-3">
        {POSTS.map((post) => (
          <Card
            key={post.slug}
            className="cursor-pointer transition-colors hover:border-[var(--accent-cyan)]"
            onClick={() => navigate(postHref.replace(':slug', post.slug))}
          >
            <CardHeader>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  {post.date}
                </span>
                <span className="text-lg font-medium">{post.title}</span>
              </div>
              <Badge tone="info" size="sm">
                {post.tag}
              </Badge>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-[var(--text-secondary)]">{post.summary}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
