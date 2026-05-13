import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  toast,
} from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { Check, Sparkles } from 'lucide-react';

const TIERS = [
  {
    name: 'Bireysel',
    price: 'Ücretsiz',
    description: 'Tek kullanıcı, 3 aktif ilan, AI değerleme deneme',
    features: ['3 aktif ilan', 'AI değerleme (ay 5 kez)', 'KVKK arşiv', 'E-posta destek'],
    cta: 'Hemen başla',
    highlighted: false,
  },
  {
    name: 'Profesyonel',
    price: '₺499/ay',
    description: 'Bağımsız emlakçı için temel ofis',
    features: [
      '30 aktif ilan',
      'AI değerleme sınırsız',
      'AI açıklama generator',
      'Lead CRM',
      'Whatsapp entegrasyon',
    ],
    cta: 'Plana geç',
    highlighted: true,
  },
  {
    name: 'Kurumsal',
    price: '₺1.999/ay',
    description: 'Emlakçı ofisi + 5 üye',
    features: [
      '200 aktif ilan',
      'Takım yönetimi',
      'Komisyon raporlama',
      'Custom showcase domain',
      'Advanced analytics',
      'API access',
    ],
    cta: 'Plana geç',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Özel',
    description: 'Holding ölçekli, sınırsız üye',
    features: [
      'Sınırsız ilan',
      'White-label vitrin',
      'Custom AI prompt library',
      'On-premise option',
      'SLA + dedicated CSM',
    ],
    cta: 'Görüşelim',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:px-6">
      <header className="text-center">
        <h1 className={headingRecipe({ level: 'h1' })}>Fiyatlandırma</h1>
        <p className="mt-3 mx-auto max-w-2xl text-[var(--text-lead)] text-[var(--text-secondary)]">
          Bireysel kullanımdan kurumsal ofise — büyüdükçe ölçeklenir. KDV dahil.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-4">
        {TIERS.map((tier) => (
          <Card
            key={tier.name}
            tone={tier.highlighted ? 'strong' : 'default'}
            glow={tier.highlighted ? 'cyan' : 'none'}
            className="flex flex-col"
          >
            <CardHeader>
              <div className="flex flex-col gap-1">
                <span className="font-medium">{tier.name}</span>
                <span className="text-2xl font-semibold tabular-nums">{tier.price}</span>
              </div>
              {tier.highlighted && (
                <Badge tone="info" size="sm">
                  Önerilen
                </Badge>
              )}
            </CardHeader>
            <CardBody className="flex flex-1 flex-col gap-3">
              <p className="text-sm text-[var(--text-secondary)]">{tier.description}</p>
              <ul className="flex flex-col gap-2 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Icon icon={Check} size={16} tone="lime" />
                    <span className="text-[var(--text-primary)]">{f}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
            <CardFooter>
              <Button
                block
                tone={tier.highlighted ? 'primary' : 'neutral'}
                onClick={() =>
                  toast.info({
                    title: `${tier.name} planı seçildi`,
                    description: 'Demo modunda ödeme entegrasyonu pasif. Phase 7+ gerçek billing.',
                  })
                }
              >
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card glow="violet">
        <CardBody className="flex flex-col items-center gap-3 py-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <Icon icon={Sparkles} size={28} tone="violet" />
            <div>
              <h3 className={headingRecipe({ level: 'h5' })}>Emin değil misin?</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                AI önerisi al — kullanım profilinize uygun planı seçelim.
              </p>
            </div>
          </div>
          <Button
            tone="agent"
            onClick={() =>
              toast.agent({
                title: 'AI plan asistanı',
                description: 'Phase 3+ bireysel AI asistan üzerinden çalışacak.',
              })
            }
          >
            AI plan asistanı
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
