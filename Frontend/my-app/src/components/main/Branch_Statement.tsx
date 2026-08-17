import Link from 'next/link'

export function BrandStatement() {
  return (
    <section aria-labelledby="brand-statement-heading" className="flex min-h-[52vh] items-center justify-center bg-background px-6 py-32 text-center md:min-h-[60vh] md:px-12 md:py-44 lg:px-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <h2 id="brand-statement-heading" className="font-serif text-5xl leading-[0.95] tracking-[-0.045em] text-foreground sm:text-6xl md:text-8xl">
          THE ART OF MODERN CRAFT
        </h2>
        <p className="mt-8 text-sm leading-6 text-muted-foreground md:mt-10 md:text-base">
          Designed with intention. Made to last.
        </p>
        <Link href="#featured-heading" className="mt-12 border-b border-foreground/50 pb-2 text-[10px] font-medium tracking-[0.2em] text-foreground transition-colors hover:border-foreground md:mt-16">
          DISCOVER MORE →
        </Link>
      </div>
    </section>
  )
}

export default BrandStatement