import { Badge, Button, Card, CardBody, Icon } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useRouteHref } from '@/lib/routing/useRouteHref';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

const POSTS: Record<
  string,
  {
    title: string;
    summary: string;
    body: ReadonlyArray<string>;
    tag: string;
    date: string;
  }
> = {
  'imar-bilirkisi-2026': {
    title: 'İmar Barışı 2026: Yeni başlığa ne kadar yakınız?',
    summary: 'Çevre Bakanlığı taslak metni ve sektör beklentileri.',
    body: [
      'İmar Barışı süreci Türkiye genelinde 2018 yılından bu yana 13 milyondan fazla yapıyı kapsayan en büyük yasallaştırma operasyonlarından biri oldu.',
      '2026 yılı taslak metni, kayıt dışı yapıların yeniden değerlendirilmesi ve arsa sahiplerinin tapu kayıtlarındaki tutarsızlıkların giderilmesi yönünde adımlar içeriyor.',
      'arsam.net olarak, her ilanın imar durumunu AI ile kontrol ederek alıcılara şeffaf bir sunum yapıyoruz.',
    ],
    tag: 'Mevzuat',
    date: '2026-05-08',
  },
  'cesme-yatirim-rehberi': {
    title: 'Çeşme arsa yatırımı: 2026 rehberi',
    summary: 'Çiftlikköy, Alaçatı, Ovacık karşılaştırması.',
    body: [
      'Çeşme yarımadası son 5 yılda hem konut hem de turizm imarlı arsalarda %180 üzerinde değer artışı gördü.',
      'Alaçatı merkez bölge fiyatları doyma noktasına ulaşırken, Çiftlikköy ve Ovacık alternatifleri öne çıkıyor.',
      'AI değerleme modelimiz, son 12 aydaki 320+ Çeşme satışını referans alıyor.',
    ],
    tag: 'Yatırım',
    date: '2026-04-22',
  },
  'tapu-dogrulama-akisi': {
    title: 'Tapu hash doğrulama akışı',
    summary: 'arsam.net altyapısı.',
    body: [
      'Her tapu yüklendiğinde SHA-256 hash hesaplıyor, zaman damgalı bir kayıt oluşturuyoruz.',
      'Bu kayıt KVKK gereği şifrelenmiş bir append-only log içine düşer (D01 surface).',
      'Doğrulanan tapular için ilan kartlarında rozet gösterilir; tüm doğrulama akışı şeffaf bir audit trail bırakır.',
    ],
    tag: 'Teknik',
    date: '2026-03-15',
  },
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const blogHref = useRouteHref('blog');
  const post = slug ? POSTS[slug] : undefined;

  if (!post) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-12 md:px-6">
        <h1 className={headingRecipe({ level: 'h3' })}>Yazı bulunamadı.</h1>
        <Button onClick={() => navigate(blogHref)} tone="ghost">
          Blog'a dön
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 md:px-6">
      <Button
        tone="ghost"
        size="sm"
        leftIcon={<Icon icon={ArrowLeft} size={14} />}
        onClick={() => navigate(blogHref)}
      >
        Blog'a dön
      </Button>
      <header className="flex flex-col gap-2">
        <Badge tone="info" size="sm" className="self-start">
          {post.tag}
        </Badge>
        <h1 className={headingRecipe({ level: 'h2' })}>{post.title}</h1>
        <p className="text-sm text-[var(--text-tertiary)]">{post.date}</p>
      </header>
      <Card>
        <CardBody className="flex flex-col gap-3 text-[var(--text-secondary)]">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </CardBody>
      </Card>
    </main>
  );
}
