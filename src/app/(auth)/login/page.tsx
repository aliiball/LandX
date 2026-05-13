import { SurfacePlaceholder } from '@/components/layout/SurfacePlaceholder';

export default function LoginPlaceholder() {
  return (
    <SurfacePlaceholder
      surfaceKey="Auth · Login"
      title="Giriş yap"
      subtitle="Phase 3'te tam giriş ekranı (password, OAuth, magic link, passkey) gelecek (PROMPT §7.A.A11)."
      accent="cyan"
    />
  );
}
