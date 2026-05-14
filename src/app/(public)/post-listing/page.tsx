import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Input,
  Select,
  Textarea,
  ThinkingDot,
  TokenStream,
  toast,
  tokenize,
} from '@/components/ui';
import { cn, headingRecipe } from '@/design/recipes';
import { Check, ChevronLeft, ChevronRight, Eye, FileText, Sparkles, Upload } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const STEPS = [
  { id: 1, title: 'Konum' },
  { id: 2, title: 'Tapu & Belge' },
  { id: 3, title: 'Özellikler' },
  { id: 4, title: 'Açıklama' },
  { id: 5, title: 'Fiyat' },
  { id: 6, title: 'Yayın' },
] as const;

type WizardState = {
  city: string;
  district: string;
  hasDeed: boolean;
  ada: string;
  parsel: string;
  areaSqm: string;
  cins: string;
  zoning: string;
  description: string;
  price: string;
  tone: 'profesyonel' | 'sicak' | 'yatirimci';
};

const INITIAL: WizardState = {
  city: '',
  district: '',
  hasDeed: false,
  ada: '',
  parsel: '',
  areaSqm: '',
  cins: '',
  zoning: '',
  description: '',
  price: '',
  tone: 'profesyonel',
};

const SAMPLE_DESC = (s: WizardState) =>
  `${s.city || 'Bursa'} ${s.district || 'Karacabey'} bölgesinde ${s.areaSqm || '2500'} m² ${s.zoning || 'konut imarlı'} arsa. Asfalt yola cephe, imar barışı kapsamında. Yatırımcı için ideal lokasyon — bölgenin gelişim trendi yüksek.`;

export default function PostListingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [aiDescLoading, setAiDescLoading] = useState(false);

  const set = (patch: Partial<WizardState>) => setState((s) => ({ ...s, ...patch }));

  const runOcr = () => {
    setOcrLoading(true);
    window.setTimeout(() => {
      set({ ada: '1842', parsel: '47', areaSqm: '2500', cins: 'Tarla', hasDeed: true });
      setOcrLoading(false);
      toast.agent('Tapu OCR tamamlandı — alanlar dolduruldu');
    }, 1500);
  };

  const runAiDesc = () => {
    setAiDescLoading(true);
    window.setTimeout(() => {
      set({ description: SAMPLE_DESC(state) });
      setAiDescLoading(false);
      toast.agent('AI açıklama üretildi — düzenleyebilirsin');
    }, 1200);
  };

  const next = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8 md:px-6">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>İlan Ver</h1>
        <p className="text-[var(--text-secondary)]">AI rehberli 6 adım — arsa, belge, fiyat.</p>
      </header>

      <nav aria-label="Adımlar" className="flex items-center gap-1 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button
            type="button"
            key={s.id}
            onClick={() => setStep(s.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs transition-colors',
              step === s.id
                ? 'border-[var(--accent-cyan)] bg-[var(--surface-elevated)] text-[var(--text-primary)]'
                : step > s.id
                  ? 'border-[var(--accent-lime)] bg-[oklch(0.88_0.20_135_/_0.10)] text-[var(--accent-lime)]'
                  : 'border-[var(--stroke-default)] bg-[var(--surface-slate)] text-[var(--text-tertiary)]',
            )}
          >
            <span className="font-mono">{i + 1}</span>
            <span>{s.title}</span>
            {step > s.id && <Icon icon={Check} size={12} tone="lime" />}
          </button>
        ))}
      </nav>

      <Card>
        <CardHeader>
          <span className="font-medium">
            Adım {step}: {STEPS[step - 1]?.title}
          </span>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          {step === 1 && (
            <>
              <Input
                label="Şehir"
                value={state.city}
                onChange={(e) => set({ city: e.target.value })}
                placeholder="Bursa"
              />
              <Input
                label="İlçe"
                value={state.district}
                onChange={(e) => set({ district: e.target.value })}
                placeholder="Karacabey"
              />
              <Button tone="ghost" onClick={() => toast.show('Haritadan pin seçimi')}>
                Haritadan pin
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3">
                <div>
                  <p className="font-medium">Tapu PDF/Foto</p>
                  <p className="text-xs text-[var(--text-tertiary)]">AI OCR ile alanları doldur</p>
                </div>
                <Button
                  tone="agent"
                  leftIcon={<Icon icon={ocrLoading ? Sparkles : Upload} size={14} />}
                  onClick={runOcr}
                  loading={ocrLoading}
                >
                  {ocrLoading ? 'Okunuyor…' : 'Yükle & OCR'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Ada"
                  value={state.ada}
                  onChange={(e) => set({ ada: e.target.value })}
                />
                <Input
                  label="Parsel"
                  value={state.parsel}
                  onChange={(e) => set({ parsel: e.target.value })}
                />
                <Input
                  label="m²"
                  value={state.areaSqm}
                  onChange={(e) => set({ areaSqm: e.target.value })}
                />
                <Input
                  label="Cins"
                  value={state.cins}
                  onChange={(e) => set({ cins: e.target.value })}
                />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <Select
                label="İmar"
                value={state.zoning}
                onChange={(e) => set({ zoning: e.currentTarget.value })}
                options={[
                  { value: 'konut', label: 'Konut' },
                  { value: 'ticari', label: 'Ticari' },
                  { value: 'tarla', label: 'Tarla' },
                  { value: 'sanayi', label: 'Sanayi' },
                  { value: 'turizm', label: 'Turizm' },
                  { value: 'zeytinlik', label: 'Zeytinlik (3573 sayılı kanun)' },
                  { value: 'karma', label: 'Karma' },
                  { value: 'imarsiz', label: 'İmarsız' },
                ]}
                placeholder="Seç…"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Cephe (m)" placeholder="örn: 20" />
                <Input label="Eğim (%)" placeholder="örn: 5" />
              </div>
              <p className="rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-slate)]/40 p-2 text-xs text-[var(--text-secondary)]">
                <Icon icon={Sparkles} size={12} tone="violet" /> AI önerisi: imar yapısı için
                "konut" en yaygın seçim.
              </p>
            </>
          )}
          {step === 4 && (
            <>
              <Select
                label="Ton"
                value={state.tone}
                onChange={(e) => set({ tone: e.currentTarget.value as WizardState['tone'] })}
                options={[
                  { value: 'profesyonel', label: 'Profesyonel' },
                  { value: 'sicak', label: 'Sıcak' },
                  { value: 'yatirimci', label: 'Yatırımcı' },
                ]}
              />
              <Button
                tone="agent"
                leftIcon={<Icon icon={Sparkles} size={14} />}
                onClick={runAiDesc}
                loading={aiDescLoading}
              >
                AI açıklama üret
              </Button>
              {aiDescLoading ? (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <ThinkingDot tone="violet" /> AI yazıyor…
                </div>
              ) : state.description ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--accent-violet)]/30 bg-[oklch(0.70_0.22_290_/_0.08)] p-3 text-sm">
                  <TokenStream tokens={tokenize(state.description)} intervalMs={20} />
                </div>
              ) : null}
              <Textarea
                label="Düzenle"
                value={state.description}
                onChange={(e) => set({ description: e.target.value })}
                rows={4}
              />
            </>
          )}
          {step === 5 && (
            <>
              <Input
                label="Liste fiyatı (₺)"
                type="number"
                value={state.price}
                onChange={(e) => set({ price: e.target.value })}
              />
              <Card glow="violet">
                <CardBody className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">AI değerleme önerisi</p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Karşılaştırılabilir 12 parsel
                    </p>
                  </div>
                  <Button
                    tone="agent"
                    size="sm"
                    leftIcon={<Icon icon={Sparkles} size={12} />}
                    onClick={() => {
                      set({ price: '4500000' });
                      toast.agent('AI önerisi: 4.500.000 ₺ (±%8 güven)');
                    }}
                  >
                    Öneriyi uygula
                  </Button>
                </CardBody>
              </Card>
            </>
          )}
          {step === 6 && (
            <div className="flex flex-col gap-3">
              <Badge tone="success" size="md" dot>
                Önizleme hazır
              </Badge>
              <div className="rounded-[var(--radius-md)] border border-[var(--stroke-default)] bg-[var(--surface-slate)] p-3 text-sm">
                <p className="font-medium">
                  {state.city || 'Bursa'} {state.district || 'Karacabey'} ·{' '}
                  {state.areaSqm || '2500'} m²
                </p>
                <p className="mt-1 text-[var(--text-secondary)]">
                  {state.description || SAMPLE_DESC(state)}
                </p>
                <p className="mt-2 font-mono text-sm text-[var(--accent-lime)]">
                  {state.price ? `${Number(state.price).toLocaleString('tr-TR')} ₺` : '—'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  block
                  onClick={() => {
                    toast.success('İlan yayınlandı');
                    navigate('/dashboard/listings');
                  }}
                >
                  Yayınla
                </Button>
                <Button
                  tone="ghost"
                  leftIcon={<Icon icon={Eye} size={14} />}
                  onClick={() => toast.show('Önizleme açıldı')}
                >
                  Önizle
                </Button>
                <Button
                  tone="neutral"
                  leftIcon={<Icon icon={FileText} size={14} />}
                  onClick={() => toast.success('Taslak kaydedildi')}
                >
                  Taslak kaydet
                </Button>
              </div>
            </div>
          )}
        </CardBody>
        <CardBody className="border-t border-[var(--stroke-subtle)] pt-3">
          <div className="flex justify-between">
            <Button
              tone="ghost"
              onClick={prev}
              disabled={step === 1}
              leftIcon={<Icon icon={ChevronLeft} size={14} />}
            >
              Geri
            </Button>
            {step < STEPS.length && (
              <Button onClick={next} rightIcon={<Icon icon={ChevronRight} size={14} />}>
                İleri
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
