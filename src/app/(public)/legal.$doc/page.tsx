import { Button, Card, CardBody, CardHeader, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useParams } from 'react-router';

const DOCS: Record<
  string,
  { title: string; sections: ReadonlyArray<{ title: string; body: string }> }
> = {
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    sections: [
      {
        title: 'Veri sorumlusu',
        body: 'arsam.net (LandX A.Ş.) Türkiye Cumhuriyeti sınırları içinde faaliyet gösteren bir SaaS platformudur. KVKK madde 10 kapsamında veri sorumlusudur.',
      },
      {
        title: 'İşlenen kişisel veriler',
        body: 'Ad, soyad, e-posta, telefon, kimlik doğrulama belgeleri, tapu görselleri, ilan içerik metadata, IP ve cihaz bilgisi.',
      },
      {
        title: 'İşleme amaçları',
        body: 'Hizmetin sunulması, ilan değerleme, AI öneri sistemi, KVKK madde 5/2 sözleşmenin ifası, suistimal önleme.',
      },
      {
        title: 'Haklarınız',
        body: 'KVKK madde 11 kapsamında erişim, düzeltme, silme, taşınabilirlik haklarınızı /dashboard/profile altından kullanabilirsiniz.',
      },
    ],
  },
  cookies: {
    title: 'Çerez Politikası',
    sections: [
      {
        title: 'Zorunlu çerezler',
        body: 'Oturum kimliği, persona seçimi (demo modu), dil tercihi.',
      },
      {
        title: 'İsteğe bağlı çerezler',
        body: 'Posthog analytics (varsayılan kapalı), reklam ortakları (varsayılan kapalı).',
      },
    ],
  },
  terms: {
    title: 'Kullanım Şartları',
    sections: [
      {
        title: 'Hizmet kapsamı',
        body: 'arsam.net ilan platformu olarak ilan sahibi ile alıcı arasında aracılık yapar; satıştan kaynaklanan hukuki sorumluluk taraflara aittir.',
      },
    ],
  },
  ai: {
    title: 'AI Uyumluluk Beyanı',
    sections: [
      {
        title: 'Kullanılan modeller',
        body: 'Platform; Claude Opus 4.7 (1M context), Sonnet 4.6, Haiku 4.5 başta olmak üzere; GPT-5 Pro, Gemini 2.5 Pro, Llama 4 405B (self-host) ve Mistral Large 3 modellerini routing politikasıyla kullanır. Her çağrı /admin/ai-ops altında izlenebilir.',
      },
      {
        title: 'AI ile karar verilen alanlar',
        body: 'Değerleme önerisi, açıklama üretimi, fiyat tahmini, risk skoru, lead takip önerisi. Bunların hiçbiri otomatik hukuki sonuç doğurmaz; kararlar kullanıcı ile teyit edilir.',
      },
      {
        title: 'KVKK & AI Act uyumu',
        body: 'KVKK m.5/2c sözleşmenin ifası gerekçesiyle işlenen veriler; AI eğitimi için varsayılan olarak kullanılmaz. AI Act (Avrupa) high-risk sınıflandırması platformumuz için uygulanmaz çünkü kredi/sigorta/biometrik otomatik karar yoktur. DPIA /admin/compliance > GDPR Art.35 altında.',
      },
      {
        title: 'Hallucination & error',
        body: 'AI çıktıları "öneri" olarak işaretlenir. Değerleme tahmininde alt/üst sınır ve güven (%) gösterilir. Üretilen açıklama satıcı tarafından düzenlenebilir; otomatik yayına girmez.',
      },
      {
        title: 'İtiraz hakkı (m.11)',
        body: 'AI personalizasyonuna itiraz ederseniz /dashboard/profile altında "AI öneri sistemine itiraz et" kutusunu işaretleyin. Bu durumda dashboard içeriği rastgele kişiselleştirme yerine kronolojik / popülerlik bazlı sunulur.',
      },
      {
        title: 'Eğitim verisi politikası',
        body: 'Kullanıcı verisi (mesaj, ilan, KYC belgesi) hiçbir LLM sağlayıcısının eğitimi için paylaşılmaz. Anthropic, OpenAI, Google, Mistral, Meta için "do-not-train" politikası geçerlidir.',
      },
      {
        title: 'Audit & izlenebilirlik',
        body: 'Tüm AI çağrıları D01 hash-chained audit log içine yazılır. Principal "agent:<model-id>" olarak görünür ve tamper-evident zincirle korunur.',
      },
    ],
  },
};

export default function LegalDocPage() {
  const { doc } = useParams<{ doc: string }>();
  const key = (doc ?? 'kvkk').toLowerCase();
  const docContent = DOCS[key] ?? DOCS.kvkk;
  if (!docContent) return null;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 md:px-6">
      <header className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          /legal/{key}
        </span>
        <h1 className={headingRecipe({ level: 'h2' })}>{docContent.title}</h1>
      </header>

      <div className="flex flex-col gap-3">
        {docContent.sections.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <span className="font-medium">{s.title}</span>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-[var(--text-secondary)]">{s.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card tone="strong">
        <CardBody className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium">Verilerime erişim talep et</p>
            <p className="text-xs text-[var(--text-secondary)]">
              KVKK madde 11 başvurusu — D02 PII Governance kuyruğuna düşer.
            </p>
          </div>
          <Button onClick={() => toast.success('KVKK başvurunuz oluşturuldu')}>Başvur</Button>
        </CardBody>
      </Card>
    </main>
  );
}
