import { Button, Card, CardBody, Icon, ThinkingDot, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { Fingerprint, KeyRound, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function PasskeySetupPage() {
  const [step, setStep] = useState<'idle' | 'progress' | 'done'>('idle');
  const navigate = useNavigate();

  const register = () => {
    setStep('progress');
    window.setTimeout(() => {
      setStep('done');
      toast.success('Passkey başarıyla kaydedildi');
    }, 1400);
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Passkey kur</h1>
        <p className="text-[var(--text-secondary)]">
          Şifresiz, biyometrik ile güvenli giriş. WebAuthn destekli.
        </p>
      </header>
      <Card>
        <CardBody className="flex flex-col items-center gap-4 py-8">
          {step === 'idle' && (
            <>
              <Icon icon={Fingerprint} size={48} tone="cyan" />
              <p className="text-center text-sm text-[var(--text-secondary)]">
                Cihaz parmak izi, Face ID veya güvenlik anahtarı kullanılarak passkey oluşturulacak.
              </p>
              <Button onClick={register} block leftIcon={<Icon icon={KeyRound} size={16} />}>
                Passkey oluştur
              </Button>
            </>
          )}
          {step === 'progress' && (
            <>
              <ThinkingDot tone="violet" />
              <p className="text-sm text-[var(--text-secondary)]">Cihaz iletişim kuruyor…</p>
            </>
          )}
          {step === 'done' && (
            <>
              <Icon icon={ShieldCheck} size={48} tone="lime" />
              <p className="text-center text-sm text-[var(--text-secondary)]">
                Artık şifre olmadan giriş yapabilirsin.
              </p>
              <Button onClick={() => navigate('/dashboard')} block>
                Devam et
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
