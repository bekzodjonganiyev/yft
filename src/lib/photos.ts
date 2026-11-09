import type { GridPhoto } from "@/components/PhotoGrid";
import type { Dictionary } from "@/i18n/dictionaries";
import { photoImage } from "./site";

/** Resolve photo numbers to images + localized alt text on the server. */
export function gridPhotos(numbers: number[], t: Dictionary): GridPhoto[] {
  const alt = t.photos.alt as Record<string, string>;
  return numbers.map((n) => ({ n, image: photoImage(n), alt: alt[n] }));
}

export const lightboxLabels = (t: Dictionary) => ({
  open: t.photos.open,
  prev: t.photos.prev,
  next: t.photos.next,
  close: t.photos.close,
});
