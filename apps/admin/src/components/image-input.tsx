import { useEffect, useId, useMemo, useState } from 'react'
import { ImageIcon, X } from 'lucide-react'
import { mediaUrl } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif'
const MAX_BYTES = 15 * 1024 * 1024

interface ImageInputProps {
  label: string
  /** Currently saved image (relative /uploads path or absolute URL) */
  currentUrl?: string | null
  file: File | null
  onFileChange: (file: File | null) => void
  required?: boolean
  hint?: string
}

/** File picker with preview. The parent sends `file` as multipart; nothing is uploaded until save. */
export function ImageInput({
  label,
  currentUrl,
  file,
  onFileChange,
  required,
  hint,
}: ImageInputProps) {
  const id = useId()
  const [error, setError] = useState('')
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])
  useEffect(
    () => () => (preview ? URL.revokeObjectURL(preview) : undefined),
    [preview]
  )

  const shown = preview || mediaUrl(currentUrl)

  return (
    <div className='grid gap-2'>
      <Label htmlFor={id}>
        {label}
        {required && <span className='text-destructive'> *</span>}
      </Label>
      <div className='flex items-center gap-3'>
        <div className='flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted'>
          {shown ? (
            <img src={shown} alt='' className='h-full w-full object-contain' />
          ) : (
            <ImageIcon className='h-6 w-6 text-muted-foreground' />
          )}
        </div>
        <div className='grid flex-1 gap-1'>
          <input
            id={id}
            type='file'
            accept={ACCEPT}
            required={required && !currentUrl && !file}
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null
              if (f && f.size > MAX_BYTES) {
                setError('Fayl hajmi 15 MB dan oshmasligi kerak')
                e.target.value = ''
                return
              }
              setError('')
              onFileChange(f)
            }}
            className='text-sm file:me-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium'
          />
          <p className='text-xs text-muted-foreground'>
            {hint ?? 'JPEG, PNG, WEBP, GIF yoki AVIF, 15 MB gacha.'}
          </p>
          {error && <p className='text-xs text-destructive'>{error}</p>}
        </div>
        {file && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => onFileChange(null)}
            aria-label='Tanlovni bekor qilish'
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  )
}
