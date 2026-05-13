import { FormInput, FormSubmit, useZodForm } from '@/components/forms';
import { Card, CardBody, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

const schema = z
  .object({
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'],
    message: 'Şifreler eşleşmiyor',
  });

type Values = z.input<typeof schema>;

export default function ResetPage() {
  const navigate = useNavigate();
  const form = useZodForm({ schema, defaultValues: { password: '', confirm: '' } });
  const onSubmit = form.handleSubmit(() => {
    toast.success('Şifreniz güncellendi');
    navigate('/login');
  });

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Yeni şifre</h1>
        <p className="text-[var(--text-secondary)]">Yeni şifrenizi belirleyin.</p>
      </header>
      <Card>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} noValidate>
            <CardBody className="flex flex-col gap-4">
              <FormInput<Values, 'password'> name="password" type="password" label="Yeni şifre" />
              <FormInput<Values, 'confirm'> name="confirm" type="password" label="Tekrar" />
              <FormSubmit requireValid={false} block>
                Kaydet
              </FormSubmit>
            </CardBody>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
