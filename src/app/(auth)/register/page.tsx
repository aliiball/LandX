import { FormCheckbox, FormInput, FormSubmit, useZodForm } from '@/components/forms';
import { Card, CardBody, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Adın çok kısa'),
  email: z.string().email('Geçerli e-posta'),
  password: z.string().min(8, 'En az 8 karakter'),
  agree: z.literal(true, { message: 'KVKK onayı zorunlu' }),
});

type Values = z.input<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const form = useZodForm({
    schema,
    defaultValues: { name: '', email: '', password: '', agree: false as unknown as true },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success('Hesap oluşturuldu — doğrulama e-postası gönderildi');
    navigate('/verify');
  });

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Hesap oluştur</h1>
        <p className="text-[var(--text-secondary)]">
          Zaten hesabın var mı?{' '}
          <Link
            to="/login"
            className="text-[var(--accent-cyan)] underline-offset-4 hover:underline"
          >
            Giriş yap
          </Link>
        </p>
      </header>
      <Card>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} noValidate>
            <CardBody className="flex flex-col gap-4">
              <FormInput<Values, 'name'> name="name" label="Ad Soyad" />
              <FormInput<Values, 'email'> name="email" type="email" label="E-posta" />
              <FormInput<Values, 'password'>
                name="password"
                type="password"
                label="Şifre"
                description="En az 8 karakter, 1 büyük harf, 1 rakam"
              />
              <FormCheckbox<Values, 'agree'>
                name="agree"
                label="KVKK aydınlatma metnini okudum, kabul ediyorum"
              />
              <FormSubmit requireValid={false} block>
                Kayıt ol
              </FormSubmit>
            </CardBody>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
