// Every image goes through vite-imagetools: `as=picture` returns
// { sources: { avif, webp }, img: { src, w, h } } with ready-made srcsets.
// Originals are at most 1280px wide, so we never upscale past that.

import hero from "../assets/photos/mill-24.jpg?w=640;960;1280&format=avif;webp;jpg&as=picture";

import sofra from "../assets/brands/sofra.png?w=220;440&format=avif;webp;png&as=picture";
import mashrab from "../assets/brands/mashrab.png?w=220;353&format=avif;webp;png&as=picture";
import alHayot from "../assets/brands/al-hayot.png?w=220;416&format=avif;webp;png&as=picture";
import salam from "../assets/brands/salam.png?w=220;345&format=avif;webp;png&as=picture";

export const heroImage = hero;

// Brand bags, in the order they stand on the shelf. `id` is also the value sent with the inquiry form.
export const brands = [
  { id: "sofra", name: "SO‘FRA", image: sofra },
  { id: "mashrab", name: "MASHRAB", image: mashrab },
  { id: "al-hayot", name: "AL HAYOT", image: alHayot },
  { id: "salam", name: "SALAM", image: salam },
];

// All mill photos, eagerly resolved into responsive sets.
const photoModules = import.meta.glob("../assets/photos/mill-*.jpg", {
  eager: true,
  import: "default",
  query: { w: "480;960;1280", format: "avif;webp;jpg", as: "picture" },
});

const photoByNumber = Object.fromEntries(
  Object.entries(photoModules).map(([file, pic]) => [Number(file.match(/mill-(\d+)/)[1]), pic])
);

/** Photo n (1–26) with its translation key for the alt text. */
export const photo = (n) => ({ n, pic: photoByNumber[n], altKey: `photos.alt.${n}` });

// Production is a real sequence, so these steps are numbered in the UI.
export const processSteps = [
  { key: "lab", photo: photo(17) },
  { key: "milling", photo: photo(11) },
  { key: "packing", photo: photo(20) },
  { key: "loading", photo: photo(26) },
];

// Shown on the home page; /photos shows all 26.
// 1 large (2×2) + 8 small fills the 4-column and 2-column grids without gaps.
export const galleryPreview = [1, 12, 15, 9, 3, 19, 14, 25, 23].map(photo);
export const galleryAll = Array.from({ length: 26 }, (_, i) => photo(i + 1));
