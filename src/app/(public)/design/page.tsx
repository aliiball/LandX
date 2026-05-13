import {
  FormCheckbox,
  FormInput,
  FormSelect,
  FormSubmit,
  FormSwitch,
  FormTextarea,
  useZodForm,
} from '@/components/forms';
import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Dropdown,
  Icon,
  Input,
  Link,
  Modal,
  Pagination,
  Select,
  Sheet,
  Skeleton,
  Switch,
  Tabs,
  Textarea,
  ThinkingDot,
  TokenStream,
  Tooltip,
  toast,
  tokenize,
} from '@/components/ui';
import { cn, headingRecipe } from '@/design/recipes';
import { Bell, Heart, Loader, Plus, Search, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const SAMPLE_AI_TEXT =
  'AI değerleme tamamlandı. Karacabey bölgesinde 1.250.000 ₺ tahmini, %12 güven aralığı. Komşu parsellerde son 6 ayda ortalama 1.180.000 ₺ — bu fiyat üst çeyrekte konumlanıyor.';

const demoSchema = z.object({
  name: z.string().min(2, 'En az 2 karakter'),
  email: z.string().email('Geçerli bir e-posta gir'),
  role: z.enum(['buyer', 'seller', 'broker'], {
    message: 'Bir rol seç',
  }),
  bio: z.string().max(280, 'Maksimum 280 karakter').optional(),
  agree: z.literal(true, { message: 'KVKK onayı zorunlu' }),
  subscribe: z.boolean(),
});

type DemoFormValues = z.input<typeof demoSchema>;

const SECTIONS = [
  { id: 'tokens', label: 'Tokens' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'toggles', label: 'Toggles' },
  { id: 'cards', label: 'Cards' },
  { id: 'badges', label: 'Badges' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'ai', label: 'AI' },
  { id: 'form', label: 'Form' },
] as const;

const COLOR_TOKENS = [
  { name: 'surface-void', cssVar: '--surface-void' },
  { name: 'surface-obsidian', cssVar: '--surface-obsidian' },
  { name: 'surface-slate', cssVar: '--surface-slate' },
  { name: 'surface-elevated', cssVar: '--surface-elevated' },
  { name: 'accent-cyan', cssVar: '--accent-cyan' },
  { name: 'accent-lime', cssVar: '--accent-lime' },
  { name: 'accent-magenta', cssVar: '--accent-magenta' },
  { name: 'accent-amber', cssVar: '--accent-amber' },
  { name: 'accent-violet', cssVar: '--accent-violet' },
  { name: 'danger', cssVar: '--danger' },
];

export default function DesignSystemPage() {
  const { t } = useTranslation('design');
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [streamKey, setStreamKey] = useState(0);
  const [page, setPage] = useState(3);

  const form = useZodForm({
    schema: demoSchema,
    defaultValues: {
      name: '',
      email: '',
      role: undefined as unknown as 'buyer',
      bio: '',
      agree: false as unknown as true,
      subscribe: true,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    toast.success({
      title: t('form.successTitle'),
      description: `${values.name} · ${values.email} · ${values.role}`,
    });
    form.reset();
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 md:px-6">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          /design
        </span>
        <h1 className={headingRecipe({ level: 'h2' })}>{t('title')}</h1>
        <p className="max-w-2xl text-[var(--text-secondary)]">{t('subtitle')}</p>
      </header>

      <nav
        aria-label="Bölümler"
        className="sticky top-16 z-30 flex flex-wrap gap-1 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-obsidian)]/80 px-2 py-1.5 backdrop-blur-xl"
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-[var(--radius-sm)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-slate)] hover:text-[var(--text-primary)]"
          >
            {t(`sections.${s.id}`)}
          </a>
        ))}
      </nav>

      <section id="tokens" aria-labelledby="tokens-h" className="flex flex-col gap-4">
        <h2 id="tokens-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.tokens')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {COLOR_TOKENS.map((token) => (
            <Card key={token.name} tone="solid" className="overflow-hidden">
              <div className="h-16" style={{ background: `var(${token.cssVar})` }} aria-hidden />
              <CardBody className="text-xs font-mono">
                <div className="text-[var(--text-primary)]">{token.name}</div>
                <div className="text-[var(--text-tertiary)]">{token.cssVar}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section id="buttons" aria-labelledby="buttons-h" className="flex flex-col gap-4">
        <h2 id="buttons-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.buttons')}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button tone="neutral">Neutral</Button>
          <Button tone="outline">Outline</Button>
          <Button tone="ghost">Ghost</Button>
          <Button tone="danger">Danger</Button>
          <Button tone="agent" leftIcon={<Icon icon={Sparkles} size={16} />}>
            Agent
          </Button>
          <Button loading>Loading</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Plus">
            <Icon icon={Plus} size={20} />
          </Button>
          <Button rightIcon={<Icon icon={Send} size={16} />} onClick={() => toast.show('Tıklandı')}>
            Tıkla → toast
          </Button>
        </div>
      </section>

      <section id="inputs" aria-labelledby="inputs-h" className="flex flex-col gap-4">
        <h2 id="inputs-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.inputs')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="E-posta"
            placeholder="ornek@arsam.net"
            leftSlot={<Icon icon={Search} size={16} />}
          />
          <Input label="Şifre" type="password" placeholder="••••••••" />
          <Input label="Hatalı" error errorText="Geçersiz değer" defaultValue="abc" />
          <Input label="Devre dışı" disabled defaultValue="readonly" />
          <Textarea label="Açıklama" placeholder="Birkaç cümle yaz…" />
          <Select
            label="Bölge"
            placeholder="Seç…"
            options={[
              { value: 'marmara', label: 'Marmara' },
              { value: 'ege', label: 'Ege' },
              { value: 'akdeniz', label: 'Akdeniz' },
            ]}
          />
        </div>
      </section>

      <section id="toggles" aria-labelledby="toggles-h" className="flex flex-col gap-4">
        <h2 id="toggles-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.toggles')}
        </h2>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Standart" />
          <Checkbox label="İşaretli" defaultChecked />
          <Checkbox label="Belirsiz" indeterminate />
          <Checkbox label="Devre dışı" disabled />
          <Switch label="Bildirim" defaultChecked />
          <Switch label="Otomatik kaydet" />
        </div>
      </section>

      <section id="cards" aria-labelledby="cards-h" className="flex flex-col gap-4">
        <h2 id="cards-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.cards')}
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardHeader>
              <span className="font-medium">Default Glass</span>
              <Badge tone="info" size="sm">
                yeni
              </Badge>
            </CardHeader>
            <CardBody>Glassmorphism tonu — sayfanın çoğunda kullanılır.</CardBody>
            <CardFooter>
              <Button size="sm" tone="ghost">
                Aç
              </Button>
            </CardFooter>
          </Card>
          <Card tone="strong" glow="cyan">
            <CardHeader>Strong + Cyan glow</CardHeader>
            <CardBody>Vurgulanmış kart — CTA bölümlerinde.</CardBody>
          </Card>
          <Card tone="solid" glow="violet">
            <CardHeader>Solid + Violet</CardHeader>
            <CardBody>Admin tablolar için solid yüzey.</CardBody>
          </Card>
        </div>
      </section>

      <section id="badges" aria-labelledby="badges-h" className="flex flex-col gap-4">
        <h2 id="badges-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.badges')}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="success">Onaylı</Badge>
          <Badge tone="warning" dot>
            Bekliyor
          </Badge>
          <Badge tone="danger">Reddedildi</Badge>
          <Badge tone="info">Yeni</Badge>
          <Badge tone="agent">AI</Badge>
          <Badge tone="premium">Premium</Badge>
          <Badge tone="violet" size="sm">
            v1.1
          </Badge>
        </div>
      </section>

      <section id="overlays" aria-labelledby="overlays-h" className="flex flex-col gap-4">
        <h2 id="overlays-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.overlays')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setModalOpen(true)}>Modal aç</Button>
          <Button tone="neutral" onClick={() => setSheetOpen(true)}>
            Sheet aç (sağ)
          </Button>
          <Tooltip content="Bu mono fontlu bir tooltip — 350ms gecikmeli.">
            <Button tone="ghost">Hover et</Button>
          </Tooltip>
          <Dropdown
            trigger={<Button tone="outline">Dropdown ▾</Button>}
            items={[
              { id: 'a', label: 'Aksiyon A', onSelect: () => toast.show('A seçildi') },
              { id: 'b', label: 'Aksiyon B', onSelect: () => toast.show('B seçildi') },
              'separator',
              { id: 'd', label: 'Sil', destructive: true, onSelect: () => toast.error('Silindi') },
            ]}
          />
        </div>
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={t('modal.title')}
          description={t('modal.description')}
          footer={
            <>
              <Button tone="ghost" onClick={() => setModalOpen(false)}>
                İptal
              </Button>
              <Button
                onClick={() => {
                  toast.success(t('modal.title'));
                  setModalOpen(false);
                }}
              >
                Onayla
              </Button>
            </>
          }
        >
          <p>{t('modal.body')}</p>
        </Modal>
        <Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          side="right"
          title="Filtreler"
          description="Sağ-edge sheet (desktop)"
        >
          <div className="flex flex-col gap-3">
            <Checkbox label="İmar barışlı" />
            <Checkbox label="Tapulu" />
            <Switch label="Sadece AI değerlemeli" />
            <Button block onClick={() => setSheetOpen(false)}>
              Uygula
            </Button>
          </div>
        </Sheet>
      </section>

      <section id="feedback" aria-labelledby="feedback-h" className="flex flex-col gap-4">
        <h2 id="feedback-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.feedback')}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" tone="ghost" onClick={() => toast.show(t('toast.default'))}>
            default
          </Button>
          <Button size="sm" tone="ghost" onClick={() => toast.success(t('toast.success'))}>
            success
          </Button>
          <Button size="sm" tone="ghost" onClick={() => toast.error(t('toast.error'))}>
            error
          </Button>
          <Button size="sm" tone="ghost" onClick={() => toast.info(t('toast.info'))}>
            info
          </Button>
          <Button size="sm" tone="ghost" onClick={() => toast.warning(t('toast.warning'))}>
            warning
          </Button>
          <Button size="sm" tone="ghost" onClick={() => toast.agent(t('toast.agent'))}>
            agent
          </Button>
          <Button size="sm" tone="ghost" onClick={() => toast.system(t('toast.system'))}>
            system
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardBody className="flex flex-col gap-3">
              <span className="text-sm text-[var(--text-secondary)]">Text skeleton</span>
              <Skeleton variant="text" lines={3} />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-col gap-3">
              <span className="text-sm text-[var(--text-secondary)]">Rect skeleton</span>
              <Skeleton variant="rect" height={80} />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center justify-center gap-3 py-6">
              <ThinkingDot tone="cyan" />
              <ThinkingDot tone="violet" />
              <ThinkingDot tone="magenta" />
            </CardBody>
          </Card>
        </div>
      </section>

      <section id="navigation" aria-labelledby="navigation-h" className="flex flex-col gap-4">
        <h2 id="navigation-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.navigation')}
        </h2>
        <Tabs
          items={[
            { id: 'a', label: 'Genel', content: <div className="py-3">Genel içerik</div> },
            { id: 'b', label: 'Detay', content: <div className="py-3">Detay içerik</div> },
            { id: 'c', label: 'Ayarlar', content: <div className="py-3">Ayarlar</div> },
          ]}
        />
        <Accordion
          items={[
            { id: 'q1', title: 'Bu nedir?', content: <p>Obsidian Grid — LandX design system.</p> },
            {
              id: 'q2',
              title: 'Neden Vaul + Sonner + Radix Tooltip?',
              content: <p>Doğru a11y + portal davranışı için.</p>,
            },
          ]}
        />
        <Pagination page={page} pageCount={12} onPageChange={setPage} />
        <div className="flex flex-wrap items-center gap-3">
          <Avatar name="Ayşe Demir" size="sm" />
          <Avatar name="Mehmet Yılmaz" size="md" ring="cyan" />
          <Avatar name="Karaca Ofis" size="lg" ring="amber" />
          <Avatar name="Agent Bot" size="md" ring="agent" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/" tone="default">
            Internal default
          </Link>
          <Link to="/" tone="subtle">
            Internal subtle
          </Link>
          <Link external href="https://github.com/anthropics/claude-code" tone="neon">
            External neon ↗
          </Link>
        </div>
      </section>

      <section id="ai" aria-labelledby="ai-h" className="flex flex-col gap-4">
        <h2 id="ai-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.ai')}
        </h2>
        <Card glow="violet">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={Sparkles} tone="violet" />
              <span className="font-medium">AI Değerleme</span>
            </div>
            <Button
              size="sm"
              tone="ghost"
              leftIcon={<Icon icon={Loader} size={12} />}
              onClick={() => setStreamKey((k) => k + 1)}
            >
              Yeniden oynat
            </Button>
          </CardHeader>
          <CardBody>
            <TokenStream key={streamKey} tokens={tokenize(SAMPLE_AI_TEXT)} intervalMs={28} />
          </CardBody>
        </Card>
      </section>

      <section id="form" aria-labelledby="form-h" className="flex flex-col gap-4">
        <h2 id="form-h" className={headingRecipe({ level: 'h4' })}>
          {t('sections.form')}
        </h2>
        <Card tone="solid">
          <CardHeader>
            <span className="font-medium">{t('form.title')}</span>
            <Badge dot tone="agent" size="sm">
              demo
            </Badge>
          </CardHeader>
          <FormProvider {...form}>
            <form onSubmit={onSubmit} noValidate>
              <CardBody className="grid gap-4 md:grid-cols-2">
                <FormInput<DemoFormValues, 'name'>
                  name="name"
                  label={t('form.name')}
                  placeholder={t('form.namePlaceholder')}
                />
                <FormInput<DemoFormValues, 'email'>
                  name="email"
                  type="email"
                  label={t('form.email')}
                  placeholder={t('form.emailPlaceholder')}
                />
                <FormSelect<DemoFormValues, 'role'>
                  name="role"
                  label={t('form.role')}
                  placeholder={t('form.rolePicker')}
                  options={[
                    { value: 'buyer', label: t('form.roles.buyer') },
                    { value: 'seller', label: t('form.roles.seller') },
                    { value: 'broker', label: t('form.roles.broker') },
                  ]}
                />
                <FormTextarea<DemoFormValues, 'bio'>
                  name="bio"
                  label={t('form.bio')}
                  placeholder={t('form.bioPlaceholder')}
                  optional
                  rows={3}
                  className="md:col-span-2"
                />
                <FormCheckbox<DemoFormValues, 'agree'> name="agree" label={t('form.agree')} />
                <FormSwitch<DemoFormValues, 'subscribe'>
                  name="subscribe"
                  label={t('form.subscribe')}
                />
              </CardBody>
              <CardFooter>
                <Button tone="ghost" type="button" onClick={() => form.reset()}>
                  Sıfırla
                </Button>
                <FormSubmit leftIcon={<Icon icon={Heart} size={16} />} requireValid={false}>
                  {t('form.submit')}
                </FormSubmit>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
      </section>

      <footer className="flex items-center justify-between border-t border-[var(--stroke-subtle)] pt-6 text-xs text-[var(--text-tertiary)]">
        <span>arsam.net · Design System v0.1</span>
        <Tooltip content="Reduce-motion aktifse animasyonlar kısalır.">
          <span className={cn('flex items-center gap-1.5 font-mono')}>
            <Icon icon={Bell} size={12} tone="tertiary" />
            keyboard: Tab · Enter · ESC · Arrows
          </span>
        </Tooltip>
      </footer>
    </div>
  );
}
