import { FormInput, FormSubmit, FormTextarea, useZodForm } from '@/components/forms';
import { ListingCard } from '@/components/listings/ListingCard';
import { Badge, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { apiFetch } from '@/lib/api/client';
import { useFeaturedListings } from '@/lib/api/listings';
import type { BrokerShowcase } from '@/types/broker';
import { useQuery } from '@tanstack/react-query';
import { Award, Building2, Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  message: z.string().min(10),
});
type ContactValues = z.input<typeof contactSchema>;

export default function BrokerPublicShowcasePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: showcase } = useQuery({
    queryKey: ['broker', 'showcase', slug],
    queryFn: () => apiFetch<BrokerShowcase>('/broker/showcase'),
  });
  const featured = useFeaturedListings();
  const form = useZodForm({
    schema: contactSchema,
    defaultValues: { name: '', phone: '', message: '' },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success({
      title: 'Mesajınız iletildi',
      description: `${showcase?.officeName} 24 saat içinde dönecek.`,
    });
    form.reset();
  });

  if (!showcase) return null;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
        <div
          className="grid h-20 w-20 shrink-0 place-items-center rounded-[var(--radius-lg)] text-3xl font-semibold text-[var(--surface-void)]"
          style={{ background: showcase.brandColor }}
          aria-hidden
        >
          {showcase.logoInitial}
        </div>
        <div className="flex-1">
          <Badge tone="success" size="sm" dot>
            Doğrulanmış emlakçı
          </Badge>
          <h1 className={`${headingRecipe({ level: 'h2' })} mt-1`}>{showcase.officeName}</h1>
          <p className="mt-1 text-[var(--text-secondary)]">{showcase.bio}</p>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Ziyaret (30g)"
          value={String(showcase.stats.visitsLast30d)}
          icon={Building2}
        />
        <StatCard label="Dönüşüm" value={`%${showcase.stats.leadConversion}`} icon={Award} />
        <StatCard
          label="Ort. yanıt"
          value={`${showcase.stats.avgResponseHours}h`}
          icon={ShieldCheck}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={headingRecipe({ level: 'h4' })}>Öne çıkan portföy</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.data?.items.slice(0, 6).map((l) => (
            <ListingCard key={l.id} listing={l} compact />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <span className="font-medium">İletişim</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-3 text-sm">
            <p className="flex items-center gap-2">
              <Icon icon={Phone} size={14} tone="cyan" />
              <span>{showcase.contact.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Icon icon={Mail} size={14} tone="cyan" />
              <a
                href={`mailto:${showcase.contact.email}`}
                className="hover:text-[var(--accent-cyan)]"
              >
                {showcase.contact.email}
              </a>
            </p>
            <p className="flex items-start gap-2">
              <Icon icon={MapPin} size={14} tone="cyan" />
              <span>{showcase.contact.address}</span>
            </p>
            <div className="border-t border-[var(--stroke-subtle)] pt-3">
              <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                Uzmanlık
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {showcase.specialties.map((s) => (
                  <Badge key={s} tone="info" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span className="font-medium">Mesaj gönder</span>
          </CardHeader>
          <FormProvider {...form}>
            <form onSubmit={onSubmit} noValidate>
              <CardBody className="grid gap-3 md:grid-cols-2">
                <FormInput<ContactValues, 'name'> name="name" label="Ad" />
                <FormInput<ContactValues, 'phone'> name="phone" label="Telefon" />
                <FormTextarea<ContactValues, 'message'>
                  name="message"
                  label="Mesaj"
                  rows={3}
                  className="md:col-span-2"
                />
              </CardBody>
              <CardBody className="border-t border-[var(--stroke-subtle)] pt-3">
                <FormSubmit requireValid={false} leftIcon={<Icon icon={Send} size={14} />}>
                  Gönder
                </FormSubmit>
              </CardBody>
            </form>
          </FormProvider>
        </Card>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: { label: string; value: string; icon: React.ComponentProps<typeof Icon>['icon'] }) {
  return (
    <Card tone="solid">
      <CardBody className="flex items-center gap-3">
        <Icon icon={icon} tone="cyan" size={24} />
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</p>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}
