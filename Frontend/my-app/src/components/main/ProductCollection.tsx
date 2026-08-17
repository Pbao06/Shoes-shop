'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import womenCollection from '@/assets/women-collection.png'
import menCollection from '@/assets/men-collection.png'
import heroCampaign from '@/assets/hero-campaign.jpg'

type Product = {
  name: string
  category: string
  price: string
  image: string | StaticImageData
  alt: string
}

const products: Product[] = [
  { name: 'Classic Leather Loafer', category: 'LOAFERS', price: '$320', image: womenCollection, alt: 'Classic black leather loafer on a stone pedestal' },
  { name: 'Minimal Leather Sneaker', category: 'SNEAKERS', price: '$450', image: menCollection, alt: 'Minimal ivory leather sneaker on a stone pedestal' },
  { name: 'Structured Chelsea Boot', category: 'BOOTS', price: '$380', image: heroCampaign, alt: 'Structured dark brown Chelsea boot on a stone pedestal' },
  { name: 'Signature Leather Bag', category: 'BAGS', price: '$520', image: womenCollection, alt: 'Structured black leather handbag on a stone pedestal' },
]

export function ProductCollection() {
  return (
    <section aria-labelledby="collection-heading" className="bg-background px-6 py-24 md:px-12 md:py-36 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <header className="text-center">
          <p className="text-[10px] font-medium tracking-[0.24em] text-muted-foreground">THE COLLECTION</p>
          <h2 id="collection-heading" className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-foreground md:text-7xl">
            Featured Pieces
          </h2>
        </header>

        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-24 md:gap-x-6 md:gap-y-16 lg:grid-cols-4 lg:gap-x-8">
          {products.map((product) => (
            <article key={product.name}>
              <Link href="#collection" className="group block" aria-label={`View ${product.name}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(max-width: 767px) 46vw, (max-width: 1023px) 46vw, 23vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />
                </div>
              </Link>
              <div className="mt-4">
                <h3 className="text-sm leading-5 text-foreground md:text-base">{product.name}</h3>
                <p className="mt-2 text-[10px] font-medium tracking-[0.18em] text-muted-foreground">{product.category}</p>
                <p className="mt-2 text-sm text-foreground">{product.price}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 flex justify-center md:mt-28">
          <Link href="#collection" className="border-b border-foreground/50 pb-2 text-[10px] font-medium tracking-[0.2em] text-foreground transition-colors hover:border-foreground">
            EXPLORE COLLECTION
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProductCollection
