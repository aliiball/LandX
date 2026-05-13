import { FormInput, FormSubmit, FormTextarea, useZodForm } from '@/components/forms';
import { Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Ad zorunlu'),
  email: z.string().email('Geçerli bir e-posta yaz'),
  subject: z.string().min(3, 'Konu çok kısa'),
  message: z.string().min(10, 'Mesaj en az 10 karakter'),
});

type Values = z.input<typeof schema>;

export default function ContactPage() {
  const form = useZodForm({
    schema,
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success({
      title: 'Mesaj alındı',
      description: '24 saat içinde dönüş yapacağız.',
    });
    form.reset();
  });

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-12 md:grid-cols-[1fr_1.4fr] md:px-6">
      <aside className="flex flex-col gap-3">
        <h1 className={headingRecipe({ level: 'h2' })}>İletişim</h1>
        <p className="text-[var(--text-secondary)]">
          Demo, partner, basın veya teknik destek talepleriniz için.
        </p>
        <Card tone="strong">
          <CardBody className="flex flex-col gap-3 text-sm">
            <p className="flex items-center gap-2">
              <Icon icon={Mail} tone="cyan" />
              <a href="mailto:hello@arsam.net" className="hover:text-[var(--accent-cyan)]">
                hello@arsam.net
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Icon icon={Phone} tone="cyan" />
              <span>+90 850 000 00 00</span>
            </p>
            <p className="flex items-center gap-2">
              <Icon icon={MapPin} tone="cyan" />
              <span>Maslak, İstanbul (demo)</span>
            </p>
          </CardBody>
        </Card>
      </aside>

      <Card>
        <CardHeader>
          <span className="font-medium">Mesaj gönder</span>
        </CardHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} noValidate>
            <CardBody className="grid gap-4 md:grid-cols-2">
              <FormInput<Values, 'name'> name="name" label="Ad" placeholder="Ali Veli" />
              <FormInput<Values, 'email'>
                name="email"
                type="email"
                label="E-posta"
                placeholder="ornek@arsam.net"
              />
              <FormInput<Values, 'subject'> name="subject" label="Konu" className="md:col-span-2" />
              <FormTextarea<Values, 'message'>
                name="message"
                label="Mesaj"
                rows={5}
                className="md:col-span-2"
              />
            </CardBody>
            <CardBody className="border-t border-[var(--stroke-subtle)] pt-3">
              <FormSubmit requireValid={false}>Gönder</FormSubmit>
            </CardBody>
          </form>
        </FormProvider>
      </Card>
    </main>
  );
}
