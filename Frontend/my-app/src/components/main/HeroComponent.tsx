/**
 * Hero — the full-bleed editorial campaign hero for the Maison homepage.
 *
 * Design language: quiet luxury / editorial. One immersive full-width image,
 * a restrained dark overlay only to protect text legibility, centered
 * editorial typography, and a single sharp rectangular CTA. No carousel,
 * no indicators, no multiple CTAs, no cards, no badges, no gradients, no
 * heavy shadows.
 *
 * Reusability: every visible string and the image are props, so the same
 * component can drive a seasonal swap or a different landing page later.
 *
 * The CTA uses a plain <a> because the destination route (e.g. /collections)
 * is not yet defined — a typed <Link to> would fail to compile. This matches
 * the Navbar/LoginForm pattern for not-yet-created routes.
 */

export interface HeroProps {
  /** Full-bleed campaign image. Pass an imported asset (import heroImg from "..."). */
  image: string;
  /** Small uppercase eyebrow above the heading. */
  eyebrow?: string;
  /** Large editorial heading. */
  heading: string;
  /** One concise supporting sentence. Omit to hide. */
  description?: string;
  /** Primary CTA label. */
  ctaLabel: string;
  /** Internal route the CTA links to. */
  ctaTo: string;
}

export function Hero({
  image,
  eyebrow = "NEW SEASON",
  heading = "THE NEW COLLECTION",
  description,
  ctaLabel = "EXPLORE COLLECTION",
  ctaTo = "/collections",
}: HeroProps) {
  return (
    <section
      aria-label="Featured campaign"
      className="relative w-full overflow-hidden bg-[#1a1714]"
    >
      {/* Campaign image — full-bleed, object-cover, sharp corners, no radius. */}
      <div className="relative h-[82vh] min-h-[560px] w-full sm:h-[86vh] md:h-[90vh]">
        <img
          src={image}
          alt="Maison — the new collection campaign"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Legibility overlay — a single neutral veil, no gradient. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#1a1714]/30" />
      </div>

      {/* Editorial content — centered over the composition. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          {/* Eyebrow */}
          <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/85 sm:text-xs">
            {eyebrow}
          </p>

          {/* Heading — editorial serif, generous tracking. */}
          <h1 className="mt-6 font-serif text-[2.25rem] leading-[1.08] tracking-[0.06em] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            {heading}
          </h1>

          {/* Supporting line — one sentence only. */}
          {description ? (
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/80 sm:text-base">
              {description}
            </p>
          ) : null}

          {/* Single CTA — sharp rectangular, no radius, no shadow. */}
          <a
            href={ctaTo}
            className="mt-9 inline-flex items-center justify-center border border-white bg-white px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[#1a1714] transition-colors hover:bg-transparent hover:text-white sm:mt-10"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;