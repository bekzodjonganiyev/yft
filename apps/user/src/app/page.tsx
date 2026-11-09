import { TopHeader } from '@/components/TopHeader';
import { Header } from '@/components/Header';
import { BannerVideo } from '@/components/BannerVideo';
import { AboutUs } from '@/components/AboutUs';
import { Products } from '@/components/Products';
import { Gallery } from '@/components/Gallery';
import { Partners } from '@/components/Partners';
import { ContactUs } from '@/components/ContactUs';
import { Footer } from '@/components/Footer';
import { assetUrl, DEFAULTS, getSiteData } from '@/lib/api';

// Re-read content from the backend at most once a minute.
export const revalidate = 60;

export default async function Home() {
  const { products, photos, partners, settings } = await getSiteData();
  const logo = assetUrl(settings['asset.logo'], DEFAULTS.logo);

  return (
    <>
      <TopHeader settings={settings} />
      <Header logo={logo} />
      <main className="flex-auto">
        <BannerVideo poster={assetUrl(settings['asset.hero_poster'], DEFAULTS.heroPoster)} />
        <AboutUs
          background={assetUrl(settings['asset.about_bg'], DEFAULTS.aboutBg)}
          videoUrl={settings.about_video_url || DEFAULTS.aboutVideo}
        />
        <Products products={products} />
        <Gallery photos={photos} />
        <Partners partners={partners} background={assetUrl(settings['asset.partners_bg'], DEFAULTS.partnersBg)} />
        <ContactUs image={assetUrl(settings['asset.contact_image'], DEFAULTS.contactImage)} />
      </main>
      <Footer settings={settings} logo={logo} />
    </>
  );
}
