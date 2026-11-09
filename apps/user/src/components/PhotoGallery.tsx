'use client';

import { useState } from 'react';
import { ColumnsPhotoAlbum, type Photo as AlbumPhoto } from 'react-photo-album';
import 'react-photo-album/columns.css';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { useLanguage } from '@/context/LanguageContext';
import { assetUrl, type Photo } from '@/lib/api';
import { pickLocalized } from '@/lib/i18n';
import { MobileAllButton, SectionHeader } from './SectionHeader';

// Widths Next.js' image optimizer accepts by default (deviceSizes / imageSizes).
const WIDTHS = [384, 640, 828, 1080, 1920, 3840];

/** URL of a resized copy served by Next's image optimizer (same thing <Image> uses). */
const optimized = (src: string, width: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;

const toAlbumPhoto = (p: Photo, alt: string): AlbumPhoto & { id: string } => {
  const src = assetUrl(p.photoUrl);
  const width = p.width || 1200;
  const height = p.height || 800;
  const widths = WIDTHS.filter((w) => w < width);
  return {
    id: p.id,
    key: p.id,
    src: optimized(src, widths.at(-1) ?? 1080),
    width,
    height,
    alt,
    label: alt,
    srcSet: [...widths, width].map((w) => ({
      src: optimized(src, WIDTHS.find((x) => x >= w) ?? 3840),
      width: w,
      height: Math.round((height / width) * w),
    })),
  };
};

/**
 * Masonry gallery + lightbox, same libraries and settings as version_2_1_0 ImageGalary.jsx:
 * react-photo-album "columns" layout (1 / 3 / 4 columns, 20px spacing) and
 * yet-another-react-lightbox with Fullscreen, Slideshow, Thumbnails and Zoom.
 * `limit` shows a preview with an "All" link to /photos.
 */
export function PhotoGallery({
  photos,
  limit,
  hideHeader,
}: {
  photos: Photo[];
  limit?: number;
  hideHeader?: boolean;
}) {
  const { t, locale } = useLanguage();
  const [index, setIndex] = useState(-1);

  if (photos.length === 0) {
    return hideHeader ? <p className="container mx-auto w-[90%] py-10 text-secondary/70">{t.sections.empty}</p> : null;
  }

  const shown = limit ? photos.slice(0, limit) : photos;
  const album = shown.map((p) => toAlbumPhoto(p, pickLocalized(p, 'title', locale) || 'Yangiyer Flour Trading'));

  return (
    <section className="container mx-auto mb-24 w-[90%]">
      {!hideHeader && <SectionHeader title={t.sections.gallery} href={limit ? '/photos' : undefined} />}

      <ColumnsPhotoAlbum
        photos={album}
        spacing={20}
        columns={(containerWidth) => (containerWidth < 400 ? 1 : containerWidth < 800 ? 3 : 4)}
        defaultContainerWidth={1200}
        sizes={{
          size: '1168px',
          sizes: [
            { viewport: '(max-width: 640px)', size: '90vw' },
            { viewport: '(max-width: 1024px)', size: '30vw' },
            { viewport: '(max-width: 1300px)', size: '22vw' },
          ],
        }}
        onClick={({ index: i }) => setIndex(i)}
        componentsProps={{ image: { loading: 'lazy' } }}
      />
      {limit && <MobileAllButton href="/photos" />}

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={album.map(({ src, width, height, srcSet, alt }) => ({ src, width, height, srcSet, alt }))}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        labels={{ Previous: t.gallery.prev, Next: t.gallery.next, Close: t.gallery.close }}
      />
    </section>
  );
}
