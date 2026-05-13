import { FormInput, FormSubmit, useZodForm } from '@/components/forms';
import { Card, CardBody, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { FormProvider } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';

const schema = z.object({ email: z.string().email('Geçerli e-posta') });
type Values = z.input<typeof schema>;

export default function ForgotPage() {
  const form = useZodForm({ schema, defaultValues: { email: '' } });
  const onSubmit = form.handleSubmit(() => toast.success('Sıfırlama linki e-postaya gönderildi'));

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Şifremi unuttum</h1>
        <p className="text-[var(--text-secondary)]">E-postanı gir, sıfırlama linki gönderelim.</p>
      </header>
      <Card>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} noValidate>
            <CardBody className="flex flex-col gap-4">
              <FormInput<Values, 'email'> name="email" type="email" label="E-posta" />
              <FormSubmit requireValid={false} block>
                Sıfırlama linki gönder
              </FormSubmit>
            </CardBody>
          </form>
        </FormProvider>
      </Card>
      <Link
        to="/login"
        className="text-center text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
      >
        Girişe dön
      </Link>
    </div>
  );
}
