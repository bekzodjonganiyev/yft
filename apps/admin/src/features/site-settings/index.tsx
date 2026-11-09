import { useState } from 'react'
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react'
import { api, toFormData } from '@/lib/api'
import type { Settings } from '@/lib/types'
import { useApiMutation, useApiQuery } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageInput } from '@/components/image-input'
import { PageShell } from '@/components/page-shell'
import { QueryState } from '@/components/query-state'

const KEY = ['settings']

const TEXT_FIELDS: {
  key: string
  label: string
  placeholder?: string
  type?: string
}[] = [
  { key: 'company_name', label: 'Kompaniya nomi' },
  {
    key: 'phone',
    label: 'Telefon',
    placeholder: '+998 71 875 64 56',
    type: 'tel',
  },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'address_uz', label: 'Manzil' },
  { key: 'working_hours', label: 'Ish vaqti' },
]

const LINK_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: 'social.telegram', label: 'Telegram', placeholder: 'https://t.me/…' },
  {
    key: 'social.instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/…',
  },
  {
    key: 'social.facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/…',
  },
  {
    key: 'social.youtube',
    label: 'YouTube',
    placeholder: 'https://youtube.com/…',
  },
  {
    key: 'about_video_url',
    label: '"Biz haqimizda" videosi (YouTube embed)',
    placeholder: 'https://www.youtube.com/embed/…',
  },
  {
    key: 'map_embed_url',
    label: 'Google Maps embed havolasi',
    placeholder: 'https://www.google.com/maps/embed?pb=…',
  },
]

const ASSETS: { key: string; label: string; hint: string }[] = [
  {
    key: 'asset.logo',
    label: 'Logotip',
    hint: 'Header va footerda. Kvadrat PNG tavsiya etiladi.',
  },
  {
    key: 'asset.hero_poster',
    label: 'Video banner posteri',
    hint: 'Video yuklanguncha ko‘rinadi.',
  },
  {
    key: 'asset.about_bg',
    label: '"Biz haqimizda" fon rasmi',
    hint: 'Play tugmasi ostidagi rasm.',
  },
  {
    key: 'asset.partners_bg',
    label: '"Hamkorlar" fon rasmi',
    hint: 'Keng (landshaft) rasm.',
  },
  {
    key: 'asset.contact_image',
    label: 'Kontakt bo‘limi rasmi',
    hint: 'Forma yonidagi rasm.',
  },
]

// Remount a card (resetting its inputs) whenever the saved values change on the server.
const snapshot = (fields: { key: string }[], settings: Settings) =>
  fields.map((f) => settings[f.key] ?? '').join('\u0000')

const isHttpUrl = (v: string) => v === '' || /^https:\/\/[^\s]+$/i.test(v)

export function SiteSettings() {
  const { data, isLoading, error, refetch } = useApiQuery<Settings>(
    KEY,
    '/settings'
  )

  return (
    <PageShell
      title='Sayt sozlamalari'
      description='Kontaktlar, ijtimoiy tarmoqlar va saytdagi bo‘lim rasmlari. O‘zgarishlar saytda 1 daqiqa ichida ko‘rinadi.'
      icon={SettingsIcon}
    >
      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={false}
        emptyText=''
        onRetry={() => refetch()}
      >
        {data && (
          <div className='grid gap-6 xl:grid-cols-2'>
            <TextSettingsCard
              key={snapshot(TEXT_FIELDS, data)}
              title='Kontakt ma’lumotlari'
              description='Top-bar va footerda ko‘rinadi.'
              fields={TEXT_FIELDS}
              settings={data}
            />
            <TextSettingsCard
              key={snapshot(LINK_FIELDS, data)}
              title='Havolalar'
              description='Bo‘sh qoldirilgan ijtimoiy tarmoq saytda ko‘rsatilmaydi. Faqat https:// havolalar.'
              fields={LINK_FIELDS}
              settings={data}
              validate={isHttpUrl}
            />
            <Card className='xl:col-span-2'>
              <CardHeader>
                <CardTitle>Bo‘lim rasmlari</CardTitle>
                <CardDescription>
                  Har bir rasm alohida saqlanadi.
                </CardDescription>
              </CardHeader>
              <CardContent className='grid gap-6 md:grid-cols-2'>
                {ASSETS.map((a) => (
                  <AssetField
                    key={a.key}
                    settingKey={a.key}
                    label={a.label}
                    hint={a.hint}
                    currentUrl={data[a.key]}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </QueryState>
    </PageShell>
  )
}

function TextSettingsCard({
  title,
  description,
  fields,
  settings,
  validate,
}: {
  title: string
  description: string
  fields: { key: string; label: string; placeholder?: string; type?: string }[]
  settings: Settings
  validate?: (value: string) => boolean
}) {
  const initial = () =>
    Object.fromEntries(fields.map((f) => [f.key, settings[f.key] ?? '']))
  const [values, setValues] = useState<Record<string, string>>(initial)
  const [invalid, setInvalid] = useState<string[]>([])

  const changed = fields.filter(
    (f) => (values[f.key] ?? '').trim() !== (settings[f.key] ?? '')
  )

  const save = useApiMutation(
    async (keys: string[]) => {
      for (const key of keys) {
        await api.put(`/settings/${encodeURIComponent(key)}`, {
          value: values[key].trim(),
        })
      }
    },
    { invalidate: [KEY], success: 'Sozlamalar saqlandi' }
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bad = validate
      ? changed.filter((f) => !validate(values[f.key].trim())).map((f) => f.key)
      : []
    setInvalid(bad)
    if (bad.length === 0 && changed.length > 0)
      save.mutate(changed.map((f) => f.key))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='grid gap-4'>
          {fields.map((f) => (
            <div key={f.key} className='grid gap-2'>
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                value={values[f.key] ?? ''}
                aria-invalid={invalid.includes(f.key)}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
              />
              {invalid.includes(f.key) && (
                <p className='text-xs text-destructive'>
                  Havola https:// bilan boshlanishi kerak
                </p>
              )}
            </div>
          ))}
          <Button
            type='submit'
            className='justify-self-start'
            disabled={changed.length === 0 || save.isPending}
          >
            {save.isPending ? <Loader2 className='animate-spin' /> : <Save />}
            Saqlash
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function AssetField({
  settingKey,
  label,
  hint,
  currentUrl,
}: {
  settingKey: string
  label: string
  hint: string
  currentUrl?: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const save = useApiMutation(
    (f: File) =>
      api.put(
        `/settings/${encodeURIComponent(settingKey)}`,
        toFormData({ file: f })
      ),
    { invalidate: [KEY], success: `${label} yangilandi` }
  )

  return (
    <div className='grid gap-2'>
      <ImageInput
        label={label}
        hint={hint}
        currentUrl={currentUrl}
        file={file}
        onFileChange={setFile}
      />
      {file && (
        <Button
          type='button'
          size='sm'
          className='justify-self-start'
          disabled={save.isPending}
          onClick={() => save.mutate(file, { onSuccess: () => setFile(null) })}
        >
          {save.isPending ? <Loader2 className='animate-spin' /> : <Save />}
          Rasmni saqlash
        </Button>
      )}
    </div>
  )
}
