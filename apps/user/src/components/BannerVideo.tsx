export function BannerVideo({ poster }: { poster: string }) {
  return (
    <section id="top" className="relative h-[60vh] w-full overflow-hidden bg-navy sm:h-[90vh]">
      <video
        className="h-full w-full object-cover"
        src="/video/videoBg.mp4"
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
    </section>
  );
}
