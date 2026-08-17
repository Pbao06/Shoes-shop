'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import womenCollection from '@/assets/women-collection.png'
import menCollection from '@/assets/men-collection.png'

type Collection = {
  image: string | StaticImageData
  title: string
  description: string
  link: string
  alt: string
}

const collections: Collection[] = [
  {
    image: womenCollection,
    title: 'Women',
    description: 'A study in quiet structure and softened form.',
    link: '#women',
    alt: 'Model wearing sculptural black and ivory tailoring in a gallery interior',
  },
  {
    image: menCollection,
    title: 'Men',
    description: 'Considered layers for a changing season.',
    link: '#men',
    alt: 'Model wearing a dark tailored wool coat in a warm stone interior',
  },
]

function CollectionItem({ collection, index }: { collection: Collection; index: number }) {
  return (
    <article className={index === 1 ? 'md:mt-40' : ''}>
      <Link href={collection.link} className="group block">
        <div className={index === 0 ? 'relative aspect-[4/5] overflow-hidden' : 'relative aspect-[5/4] overflow-hidden'}>
          <Image
            src={collection.image}
            alt={collection.alt}
            fill
            sizes="(max-width: 767px) 100vw, 48vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-serif text-3xl capitalize tracking-[-0.02em] text-[#f3ede2]">{collection.title}</h3>
          <p className="mt-2 max-w-[18rem] text-sm leading-6 text-[#f3ede2]/60">{collection.description}</p>
        </div>
        <Link
          href={collection.link}
          className="mt-2 shrink-0 border-b border-[#f3ede2]/40 pb-1 text-[10px] font-medium tracking-[0.16em] text-[#f3ede2] transition-colors hover:border-[#f3ede2]"
        >
          EXPLORE COLLECTION
        </Link>
      </div>
    </article>
  )
}

export function FeaturedCollections() {
  return (
    <section aria-labelledby="featured-heading" className="bg-[#16140f] px-6 py-24 md:px-12 md:py-36 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <header className="max-w-xl">
          <p className="text-[10px] font-medium tracking-[0.24em] text-[#f3ede2]/45">FEATURED COLLECTIONS</p>
          <h2 id="featured-heading" className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-[#f3ede2] md:text-7xl">
            The new season
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-6 text-[#f3ede2]/60">
            A refined wardrobe shaped by texture, proportion, and the light of the season.
          </p>
        </header>
        <div className="mt-16 grid gap-20 md:grid-cols-[1.08fr_0.92fr] md:gap-16 lg:mt-24 lg:gap-28">
          {collections.map((collection, index) => (
            <CollectionItem key={collection.title} collection={collection} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollections