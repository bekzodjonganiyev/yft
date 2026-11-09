import { Hero } from '@/components/Hero';
import { AboutUs } from '@/components/AboutUs';
import { PhotoGallery } from '@/components/PhotoGallery';
import { PostsSection } from '@/components/PostsSection';
import { Products } from '@/components/Products';
import { Faq } from '@/components/Faq';
import { Partners } from '@/components/Partners';
import { ContactForm } from '@/components/ContactForm';
import { assetUrl, DEFAULTS, getHomeData } from '@/lib/api';

// Re-read content from the backend at most once a minute.
export const revalidate = 60;

/** Section order follows version_2_1_0 pages/home/Home.jsx */
export default async function Home() {
  const { banners, mottos, faqs, photos, news, products, vacancies, partners, settings } = await getHomeData();

  return (
    <>
      <Hero banners={banners} mottos={mottos} />
      <AboutUs
        background={assetUrl(settings['asset.about_bg'], DEFAULTS.aboutBg)}
        videoUrl={settings.about_video_url || DEFAULTS.aboutVideo}
      />
      <PhotoGallery photos={photos} limit={8} />
      <PostsSection kind="news" posts={news} />
      <Products products={products} />
      <PostsSection kind="vacancies" posts={vacancies} />
      <Faq items={faqs} />
      <Partners partners={partners} />
      <ContactForm mapUrl={settings.map_embed_url || DEFAULTS.mapEmbed} />
    </>
  );
}
