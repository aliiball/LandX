import { FormInput, FormSubmit, useZodForm } from '@/components/forms';
import { Button, Card, CardBody, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { Apple, Chrome, KeyRound, Mail } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Geçerli e-posta gir'),
  password: z.string().min(6, 'En az 6 karakter'),
});

type Values = z.input<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const form = useZodForm({ schema, defaultValues: { email: '', password: '' } });

  const onSubmit = form.handleSubmit(() => {
    toast.success({ title: 'Hoş geldin', description: 'Demo modunda otomatik girildi' });
    navigate('/dashboard');
  });

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Giriş yap</h1>
        <p className="text-[var(--text-secondary)]">
          Yeni misin?{' '}
          <Link
            to="/register"
            className="text-[var(--accent-cyan)] underline-offset-4 hover:underline"
          >
            Hesap oluştur
          </Link>
        </p>
      </header>
      <Card>
        <FormProvider {...form}>
          <form onSubmit={onSubmit} noValidate>
            <CardBody className="flex flex-col gap-4">
              <FormInput<Values, 'email'>
                name="email"
                label="E-posta"
                placeholder="ornek@arsam.net"
              />
              <FormInput<Values, 'password'> name="password" type="password" label="Şifre" />
              <FormSubmit requireValid={false} block>
                Giriş yap
              </FormSubmit>
            </CardBody>
          </form>
        </FormProvider>
      </Card>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          tone="neutral"
          leftIcon={<Icon icon={Chrome} size={16} />}
          onClick={() => toast.show('Google OAuth (mock)')}
        >
          Google ile
        </Button>
        <Button
          tone="neutral"
          leftIcon={<Icon icon={Apple} size={16} />}
          onClick={() => toast.show('Apple OAuth (mock)')}
        >
          Apple ile
        </Button>
        <Button
          tone="neutral"
          leftIcon={<Icon icon={Mail} size={16} />}
          onClick={() => toast.show('Magic link e-postaya gönderildi')}
        >
          Magic link
        </Button>
        <Button
          tone="neutral"
          leftIcon={<Icon icon={KeyRound} size={16} />}
          onClick={() => navigate('/passkey-setup')}
        >
          Passkey
        </Button>
      </div>
      <div className="text-center text-sm">
        <Link to="/forgot" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          Şifreni mi unuttun?
        </Link>
      </div>
    </div>
  );
}
