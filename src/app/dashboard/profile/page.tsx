import { FormInput, FormSelect, FormSubmit, FormSwitch, useZodForm } from '@/components/forms';
import { Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useDemoIdentity } from '@/lib/auth/useDemoIdentity';
import { Download, Trash2 } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  lang: z.enum(['tr', 'en']),
  notifyEmail: z.boolean(),
  notifyPush: z.boolean(),
});
type Values = z.input<typeof schema>;

export default function ProfilePage() {
  const { identity } = useDemoIdentity();
  const form = useZodForm({
    schema,
    defaultValues: {
      name: identity.displayName,
      email: `${identity.key}@arsam.net.demo`,
      lang: 'tr',
      notifyEmail: true,
      notifyPush: false,
    },
  });

  const onSubmit = form.handleSubmit(() => toast.success('Profil güncellendi'));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Profil & Tercihler</h1>
      </header>

      <Card>
        <CardHeader>
          <span className="font-medium">Hesap bilgileri</span>
        </CardHeader>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} noValidate>
            <CardBody className="grid gap-4 md:grid-cols-2">
              <FormInput<Values, 'name'> name="name" label="Ad" />
              <FormInput<Values, 'email'> name="email" label="E-posta" type="email" />
              <FormSelect<Values, 'lang'>
                name="lang"
                label="Dil"
                options={[
                  { value: 'tr', label: 'Türkçe' },
                  { value: 'en', label: 'English' },
                ]}
              />
              <div className="grid gap-2">
                <FormSwitch<Values, 'notifyEmail'> name="notifyEmail" label="E-posta bildirimi" />
                <FormSwitch<Values, 'notifyPush'> name="notifyPush" label="Push bildirim" />
              </div>
            </CardBody>
            <CardBody className="border-t border-[var(--stroke-subtle)] pt-3">
              <FormSubmit requireValid={false}>Kaydet</FormSubmit>
            </CardBody>
          </form>
        </FormProvider>
      </Card>

      <Card tone="strong">
        <CardHeader>
          <span className="font-medium">KVKK haklarım</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          <p className="text-[var(--text-secondary)]">
            KVKK madde 11 kapsamında verilerinize erişme, düzeltme, silme hakkınız vardır.
          </p>
          <div className="flex gap-2">
            <Button
              tone="neutral"
              leftIcon={<Icon icon={Download} size={14} />}
              onClick={() => toast.success('Veri paketi 24 saat içinde e-postanıza gönderilecek')}
            >
              Verilerimi indir
            </Button>
            <Button
              tone="danger"
              leftIcon={<Icon icon={Trash2} size={14} />}
              onClick={() => toast.error('Silme talebiniz D02 DSAR kuyruğuna eklendi')}
            >
              Hesabı sil
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
