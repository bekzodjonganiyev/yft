import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutUs } from '@/components/AboutUs';
import { Products } from '@/components/Products';
import { FlourRecommender } from '@/components/FlourRecommender';
import { Gallery } from '@/components/Gallery';
import { Partners } from '@/components/Partners';
import { ContactUs } from '@/components/ContactUs';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <AboutUs />
      <Products />
      <FlourRecommender />
      <Gallery />
      <Partners />
      <ContactUs />
      <Footer />
    </main>
  );
}
