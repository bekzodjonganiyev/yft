/**
 * Renders a vite-imagetools `as=picture` object as <picture> with AVIF/WebP sources.
 * width/height come from the image itself, so the browser reserves space (no layout shift).
 */
export function Picture({ pic, alt, sizes, className, imgClassName, style, loading = "lazy", fetchPriority }) {
  const { sources, img } = pic;
  return (
    <picture className={className} style={style}>
      {sources.avif && <source type="image/avif" srcSet={sources.avif} sizes={sizes} />}
      {sources.webp && <source type="image/webp" srcSet={sources.webp} sizes={sizes} />}
      <img
        src={img.src}
        width={img.w}
        height={img.h}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchpriority={fetchPriority}
        className={imgClassName}
      />
    </picture>
  );
}

/** Turn a "url 480w, url 960w" srcset into lightbox-friendly entries. */
export function toSrcSet(pic) {
  const ratio = pic.img.h / pic.img.w;
  return (pic.sources.webp || "")
    .split(",")
    .map((part) => part.trim().split(/\s+/))
    .filter(([src, w]) => src && w)
    .map(([src, w]) => {
      const width = parseInt(w, 10);
      return { src, width, height: Math.round(width * ratio) };
    });
}
