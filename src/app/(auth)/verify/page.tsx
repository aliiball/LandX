import { Button, Card, CardBody, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useNavigate } from 'react-router';

export default function VerifyPage() {
  const navigate = useNavigate();
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>E-postanı doğrula</h1>
        <p className="text-[var(--text-secondary)]">
          E-postandaki bağlantıya tıkla. Bu sayfa demo modunda direkt geçer.
        </p>
      </header>
      <Card>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-[var(--text-secondary)]">Hâlâ gelmediyse:</p>
          <div className="flex gap-2">
            <Button block onClick={() => toast.success('Doğrulama e-postası tekrar gönderildi')}>
              Tekrar gönder
            </Button>
            <Button tone="ghost" onClick={() => navigate('/dashboard')}>
              Demo: panele git
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
