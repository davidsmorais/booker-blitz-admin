import { useRef, useCallback } from 'react'
import { ImageIcon, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value: string | undefined
  onChange: (dataUrl: string | undefined) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') onChange(result)
      }
      reader.readAsDataURL(file)
    },
    [onChange]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const item = Array.from(e.clipboardData.items).find((i) =>
        i.type.startsWith('image/')
      )
      if (item) {
        const file = item.getAsFile()
        if (file) processFile(file)
      }
    },
    [processFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  if (value) {
    return (
      <div className={`relative rounded-md overflow-hidden border ${className ?? ''}`}>
        <img
          src={value}
          alt="Upload preview"
          className="w-full max-h-48 object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={() => onChange(undefined)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-5 text-center cursor-pointer transition-colors hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${className ?? ''}`}
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      role="button"
      aria-label="Upload image"
    >
      <div className="rounded-full bg-muted p-2">
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs font-medium text-foreground flex items-center gap-1.5 justify-center">
          <Upload className="h-3 w-3" />
          Upload or paste image
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Click, drag & drop, or Ctrl+V to paste
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
