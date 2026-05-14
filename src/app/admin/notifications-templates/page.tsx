import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { Bell, Mail, MessageCircle, Smartphone } from 'lucide-react';

type Channel = 'email' | 'sms' | 'push' | 'inapp';

const CHANNEL_TONE: Record<Channel, 'info' | 'warning' | 'agent' | 'success'> = {
  email: 'info',
  sms: 'warning',
  push: 'success',
  inapp: 'agent',
};

const CHANNEL_ICON: Record<Channel, typeof Mail> = {
  email: Mail,
  sms: Smartphone,
  push: Bell,
  inapp: MessageCircle,
};

type Template = {
  id: string;
  name: string;
  channels: Channel[];
  variables: string[];
  preview: string;
  active: boolean;
};

const TEMPLATES: Template[] = [
  {
    id: 'tpl_offer_new',
    name: 'Yeni teklif geldi',
    channels: ['email', 'push', 'inapp'],
    variables: ['user.firstName', 'listing.title', 'offer.price'],
    preview:
      'Merhaba {{user.firstName}}, "{{listing.title}}" için ₺{{offer.price}} tutarında yeni teklif aldınız.',
    active: true,
  },
  {
    id: 'tpl_kyc_done',
    name: 'KYC onaylandı',
    channels: ['email', 'inapp'],
    variables: ['user.firstName'],
    preview:
      '{{user.firstName}}, kimlik doğrulamanız tamamlandı. Premium özelliklere erişiminiz açıldı.',
    active: true,
  },
  {
    id: 'tpl_listing_live',
    name: 'İlan yayına alındı',
    channels: ['email', 'push'],
    variables: ['listing.title', 'listing.url'],
    preview: '"{{listing.title}}" ilanınız yayına alındı: {{listing.url}}',
    active: true,
  },
  {
    id: 'tpl_dsar_ack',
    name: 'KVKK / DSAR alındı',
    channels: ['email'],
    variables: ['user.firstName', 'dsar.id', 'dsar.deadline'],
    preview:
      '{{user.firstName}}, KVKK m.11 talebiniz alındı. Takip no: {{dsar.id}}. 30 gün içinde yanıtlanacaktır ({{dsar.deadline}}).',
    active: true,
  },
  {
    id: 'tpl_tkgm_failed',
    name: 'TKGM doğrulama başarısız',
    channels: ['inapp'],
    variables: ['listing.title', 'errorCode'],
    preview:
      '"{{listing.title}}" için TKGM doğrulaması başarısız oldu ({{errorCode}}). Yetkili kontrol sürecinde.',
    active: false,
  },
  {
    id: 'tpl_lead_followup',
    name: 'Lead takip mesajı',
    channels: ['sms', 'inapp'],
    variables: ['client.firstName', 'broker.firstName'],
    preview:
      'Merhaba {{client.firstName}}, ben emlak danışmanınız {{broker.firstName}}. 5 dakika sohbet edebilir miyiz?',
    active: true,
  },
  {
    id: 'tpl_price_alert',
    name: 'Fiyat değişti',
    channels: ['email', 'push', 'inapp'],
    variables: ['listing.title', 'oldPrice', 'newPrice'],
    preview:
      'İzlediğiniz "{{listing.title}}" ilanı ₺{{oldPrice}} → ₺{{newPrice}} fiyatına güncellendi.',
    active: true,
  },
  {
    id: 'tpl_payment_due',
    name: 'Abonelik ödemesi yakın',
    channels: ['email'],
    variables: ['user.firstName', 'amount', 'dueDate'],
    preview:
      '{{user.firstName}}, ${{amount}} aylık aboneliğiniz {{dueDate}} tarihinde yenilenecek.',
    active: true,
  },
];

export default function AdminNotificationsTemplatesPage() {
  return (
    <AdminPage
      surfaceKey="C · /admin/notifications-templates"
      module="S05 Notifications"
      title="Bildirim Şablonları"
      description="Çok kanallı (email/SMS/push/inapp) bildirim şablonları — variable substitution + preview."
      actions={
        <Button tone="primary" size="sm" onClick={() => toast.show('Yeni şablon (mock)')}>
          + Yeni şablon
        </Button>
      }
      kpis={[
        { label: 'Şablon', value: String(TEMPLATES.length), tone: 'cyan' },
        { label: 'Aktif', value: String(TEMPLATES.filter((t) => t.active).length), tone: 'lime' },
        {
          label: 'Kanal × şablon',
          value: String(TEMPLATES.reduce((s, t) => s + t.channels.length, 0)),
          tone: 'violet',
        },
        {
          label: 'Variable',
          value: String(TEMPLATES.reduce((s, t) => s + t.variables.length, 0)),
          tone: 'amber',
        },
      ]}
    >
      <AdminTable
        columns={[
          { key: 'name', label: 'Şablon' },
          { key: 'channels', label: 'Kanallar' },
          { key: 'vars', label: 'Değişkenler' },
          { key: 'preview', label: 'Önizleme' },
          { key: 'state', label: 'Durum' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        rows={TEMPLATES.map((t) => ({
          name: (
            <div className="flex flex-col">
              <span className="font-medium">{t.name}</span>
              <span className="font-mono text-xs text-[var(--text-tertiary)]">{t.id}</span>
            </div>
          ),
          channels: (
            <div className="flex flex-wrap gap-1">
              {t.channels.map((c) => (
                <Badge key={c} tone={CHANNEL_TONE[c]} size="sm">
                  <Icon icon={CHANNEL_ICON[c]} size={12} className="mr-1" />
                  {c}
                </Badge>
              ))}
            </div>
          ),
          vars: <span className="font-mono text-[10px]">{t.variables.join(', ')}</span>,
          preview: <span className="text-xs italic text-[var(--text-secondary)]">{t.preview}</span>,
          state: (
            <Badge tone={t.active ? 'success' : 'warning'} size="sm">
              {t.active ? 'aktif' : 'pasif'}
            </Badge>
          ),
          actions: (
            <Button
              size="sm"
              tone="ghost"
              onClick={() => toast.show(`${t.id} test bildirimi gönderildi`)}
            >
              Test
            </Button>
          ),
        }))}
      />

      <Card tone="solid">
        <CardHeader>
          <span className="font-medium">Kanal istatistikleri (son 7g)</span>
        </CardHeader>
        <CardBody className="grid gap-3 sm:grid-cols-4">
          {(['email', 'sms', 'push', 'inapp'] as Channel[]).map((c) => (
            <div
              key={c}
              className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
            >
              <Icon icon={CHANNEL_ICON[c]} tone="cyan" size={14} />
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  {c}
                </span>
                <span className="text-lg font-semibold tabular-nums">
                  {c === 'email' ? '12.4K' : c === 'sms' ? '1.2K' : c === 'push' ? '8.1K' : '36.4K'}
                </span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </AdminPage>
  );
}
