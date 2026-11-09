import type { Metadata } from 'next';
import { PhotoGallery } from '@/components/PhotoGallery';
import { PageTitle } from '@/components/PageTitle';
import { getPhotos } from '@/lib/api';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Fotogaleriya' };

export default async function PhotosPage() {
  const photos = await getPhotos();
  return (
    <>
      <PageTitle section="gallery" />
      <div className="pt-10">
        <PhotoGallery photos={photos} hideHeader />
      </div>
    </>
  );
}
