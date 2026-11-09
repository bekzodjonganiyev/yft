import { LANGS } from '@/lib/langs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export interface LocalizedField {
  prefix: string
  label: string
  multiline?: boolean
  /** required in Uzbek (the fallback language) */
  required?: boolean
  rows?: number
  hint?: string
}

interface Props {
  fields: LocalizedField[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

/** One tab per language with the given text fields (title / description / body). */
export function LocalizedFields({ fields, values, onChange }: Props) {
  return (
    <Tabs defaultValue='Uz'>
      <TabsList>
        {LANGS.map((l) => (
          <TabsTrigger key={l.code} value={l.code}>
            {l.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {LANGS.map((l) => (
        <TabsContent
          key={l.code}
          value={l.code}
          forceMount
          className='grid gap-3 data-[state=inactive]:hidden'
        >
          {fields.map((f) => {
            const key = `${f.prefix}${l.code}`
            const required = f.required && l.code === 'Uz'
            const common = {
              id: key,
              dir: l.rtl ? ('rtl' as const) : undefined,
              required,
              value: values[key] ?? '',
            }
            return (
              <div key={key} className='grid gap-2'>
                <Label htmlFor={key}>
                  {f.label} ({l.label})
                  {required && <span className='text-destructive'> *</span>}
                </Label>
                {f.multiline ? (
                  <Textarea
                    {...common}
                    rows={f.rows ?? 4}
                    maxLength={20000}
                    onChange={(e) => onChange(key, e.target.value)}
                  />
                ) : (
                  <Input
                    {...common}
                    maxLength={300}
                    onChange={(e) => onChange(key, e.target.value)}
                  />
                )}
                {f.hint && l.code === 'Uz' && (
                  <p className='text-xs text-muted-foreground'>{f.hint}</p>
                )}
              </div>
            )
          })}
        </TabsContent>
      ))}
    </Tabs>
  )
}
