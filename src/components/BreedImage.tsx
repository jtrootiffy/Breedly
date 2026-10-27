import { useState } from 'react'
import { PawPrint } from 'lucide-react'
import { resolveBreedImage } from '@/utils/images'
import type { BreedImage as BreedImageModel } from '@/types/breed.types'
import { cn } from '@/utils/cn'

interface BreedImageProps {
  slug: string
  image?: BreedImageModel | null
  alt: string
  className?: string
  imgClassName?: string
  /** Load eagerly for above-the-fold hero images. */
  priority?: boolean
}

/**
 * Breed photography with a branded fallback. If the API sends no image, or the file
 * fails to load, we show a neutral placeholder instead of a broken-image icon.
 *
 * The failed URL is remembered rather than a boolean, so a different breed rendered in
 * the same slot automatically gets a fresh attempt.
 */
export default function BreedImage({
  slug,
  image,
  alt,
  className,
  imgClassName,
  priority = false,
}: BreedImageProps) {
  const resolved = resolveBreedImage(slug, image)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (!resolved || failedUrl === resolved.url) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-brand-blue-soft via-sand-100 to-brand-cream-soft',
          className,
        )}
        role="img"
        aria-label={`No photo available for ${alt}`}
      >
        <PawPrint className="h-10 w-10 text-brand-blue/60" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={resolved.url}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailedUrl(resolved.url)}
      className={cn('h-full w-full object-cover', imgClassName, className)}
    />
  )
}
