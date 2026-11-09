import type { StaticImageData } from "next/image";

import hero from "@/assets/photos/mill-24.jpg";
import sofra from "@/assets/brands/sofra.png";
import mashrab from "@/assets/brands/mashrab.png";
import alHayot from "@/assets/brands/al-hayot.png";
import salam from "@/assets/brands/salam.png";

import p1 from "@/assets/photos/mill-1.jpg";
import p2 from "@/assets/photos/mill-2.jpg";
import p3 from "@/assets/photos/mill-3.jpg";
import p4 from "@/assets/photos/mill-4.jpg";
import p5 from "@/assets/photos/mill-5.jpg";
import p6 from "@/assets/photos/mill-6.jpg";
import p7 from "@/assets/photos/mill-7.jpg";
import p8 from "@/assets/photos/mill-8.jpg";
import p9 from "@/assets/photos/mill-9.jpg";
import p10 from "@/assets/photos/mill-10.jpg";
import p11 from "@/assets/photos/mill-11.jpg";
import p12 from "@/assets/photos/mill-12.jpg";
import p13 from "@/assets/photos/mill-13.jpg";
import p14 from "@/assets/photos/mill-14.jpg";
import p15 from "@/assets/photos/mill-15.jpg";
import p16 from "@/assets/photos/mill-16.jpg";
import p17 from "@/assets/photos/mill-17.jpg";
import p18 from "@/assets/photos/mill-18.jpg";
import p19 from "@/assets/photos/mill-19.jpg";
import p20 from "@/assets/photos/mill-20.jpg";
import p21 from "@/assets/photos/mill-21.jpg";
import p22 from "@/assets/photos/mill-22.jpg";
import p23 from "@/assets/photos/mill-23.jpg";
import p25 from "@/assets/photos/mill-25.jpg";
import p26 from "@/assets/photos/mill-26.jpg";

export const SITE_URL = "https://www.yangiyerflourtrading.uz";

export const heroImage = hero;

// Brand bags. `id` is also the value the inquiry form sends.
// Only what is printed on each bag: every one is first grade, 50 kg; MASHRAB and AL HAYOT state
// Kazakh wheat; SO‘FRA states bread-baking flour.
export const brands = [
  { id: "sofra", name: "SO‘FRA", image: sofra, kazakhWheat: false, bakery: true },
  { id: "mashrab", name: "MASHRAB", image: mashrab, kazakhWheat: true, bakery: false },
  { id: "al-hayot", name: "AL HAYOT", image: alHayot, kazakhWheat: true, bakery: false },
  { id: "salam", name: "SALAM", image: salam, kazakhWheat: false, bakery: false },
] as const;
export type BrandId = (typeof brands)[number]["id"];

/** Photo number → image. The number is also the key of its alt text in `photos.alt`. */
const photoImages: Record<number, StaticImageData> = {
  1: p1, 2: p2, 3: p3, 4: p4, 5: p5, 6: p6, 7: p7, 8: p8, 9: p9, 10: p10, 11: p11, 12: p12, 13: p13,
  14: p14, 15: p15, 16: p16, 17: p17, 18: p18, 19: p19, 20: p20, 21: p21, 22: p22, 23: p23, 24: hero,
  25: p25, 26: p26,
};
export const photoImage = (n: number) => photoImages[n];
export const allPhotoNumbers = Object.keys(photoImages).map(Number);

// Production is a real sequence, so these steps are numbered in the UI.
export const processSteps = [
  { key: "lab", photo: 17 },
  { key: "milling", photo: 11 },
  { key: "packing", photo: 20 },
  { key: "loading", photo: 26 },
] as const;

// The figures board. Every value is already stated elsewhere on the site (company facts, bag
// print, phone numbers); `unit` is set after the number in a smaller size.
export const figures = [
  { key: "founded", value: "1991" },
  { key: "years", value: "30+" },
  { key: "brands", value: String(brands.length) },
  { key: "bag", value: "50", unit: "kg" },
  { key: "grades", value: "1–3" },
  { key: "countries", value: "2" },
] as const;

/** Where the mill is: the live clock on the figures board runs in this zone. */
export const timeZone = "Asia/Tashkent";

// Home page gallery: none of these appear elsewhere on the page.
export const galleryPreview = [12, 9, 15, 3, 25, 14, 23, 5];
export const companyPhoto = 1;

// The company film from the previous site, played on demand in the About section.
export const aboutVideo = {
  embedUrl: "https://www.youtube-nocookie.com/embed/G0zm9TybxpU",
  title: "Yangiyer Flour Trading",
} as const;

// Contact details as printed on the live site and on the brand bags.
export const contacts = {
  phones: [
    { key: "uz", display: "+998 90 979 50 55", href: "tel:+998909795055" },
    { key: "kz", display: "+7 702 155 15 55", href: "tel:+77021551555" },
  ],
  email: "mirza.kohkan@gmail.com",
  telegram: "https://t.me/+998909795055",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1181.1895909939317!2d69.21878063797728!3d41.2875452257138!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8be0fdfbfecd%3A0x6c5afd84eb8438a6!2sLLC%20%22YANGIYER%20FLOUR%20TRADING%22!5e0!3m2!1suz!2s!4v1684500868007!5m2!1suz!2s",
  mapLink: "https://www.google.com/maps/search/?api=1&query=LLC+YANGIYER+FLOUR+TRADING",
} as const;

export const primaryPhone = contacts.phones[0];
