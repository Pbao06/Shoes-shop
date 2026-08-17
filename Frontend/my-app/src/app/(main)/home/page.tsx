import { Hero } from "@/components/main/HeroComponent";
import { FeaturedCollections } from "@/components/main/FeaturedCollections";
import { ProductCollection } from "@/components/main/ProductCollection";
import { BrandStatement } from "@/components/main/Branch_Statement";
import heroCampaign from "@/assets/hero-campaign.jpg";

export default function HomePage() {
  return (
    <>
      <Hero
        image={heroCampaign.src}
        eyebrow="NEW SEASON"
        heading="THE NEW COLLECTION"
        description="Step into the season with our latest arrivals — crafted for comfort, designed for every step."
        ctaLabel="EXPLORE COLLECTION"
        ctaTo="/collections"
      />
      <FeaturedCollections />
      <ProductCollection />
      <BrandStatement />
    </>
  );
}