import { type StaticImageData } from 'next/image'
import womenCollection from '@/assets/women-collection.png'
import menCollection from '@/assets/men-collection.png'
import heroCampaign from '@/assets/hero-campaign.jpg'
import authEditorial from '@/assets/auth-editorial.jpg'

export type Product = {
  id: number
  name: string
  category: string
  brand: string
  price: string
  description: string
  color: string
  sizes: string[]
  image: string | StaticImageData
  gallery: (string | StaticImageData)[]
}

const allAssets = [womenCollection, menCollection, heroCampaign, authEditorial]

const baseProducts = [
  { name: 'Classic Leather Loafer', category: 'Shoes', brand: 'Atelier', price: '$420', image: womenCollection, description: 'A considered loafer defined by a clean silhouette, supple leather, and a quietly polished finish.', color: 'Black' },
  { name: 'Minimal Leather Sneaker', category: 'Shoes', brand: 'Atelier', price: '$360', image: heroCampaign, description: 'A timeless sneaker with a pared-back profile, premium leather, and effortless everyday versatility.', color: 'Ivory' },
  { name: 'Structured Chelsea Boot', category: 'Shoes', brand: 'Atelier', price: '$590', image: menCollection, description: 'A refined Chelsea boot with a structured silhouette and hand-finished details for long-term wear.', color: 'Brown' },
  { name: 'Signature Leather Bag', category: 'Bags', brand: 'Atelier', price: '$680', image: womenCollection, description: 'A structured leather bag crafted with meticulous attention to proportion and finish.', color: 'Black' },
  { name: 'Classic Leather Loafer', category: 'Men', brand: 'Atelier', price: '$420', image: menCollection, description: 'A considered loafer defined by a clean silhouette, supple leather, and a quietly polished finish.', color: 'Black' },
  { name: 'Structured Chelsea Boot', category: 'Men', brand: 'Atelier', price: '$590', image: heroCampaign, description: 'A refined Chelsea boot with a structured silhouette and hand-finished details for long-term wear.', color: 'Brown' },
  { name: 'Signature Leather Bag', category: 'Women', brand: 'Atelier', price: '$680', image: womenCollection, description: 'A structured leather bag crafted with meticulous attention to proportion and finish.', color: 'Black' },
  { name: 'Minimal Leather Sneaker', category: 'Women', brand: 'Atelier', price: '$360', image: heroCampaign, description: 'A timeless sneaker with a pared-back profile, premium leather, and effortless everyday versatility.', color: 'Ivory' },
  { name: 'The Everyday Tote', category: 'Accessories', brand: 'Atelier', price: '$510', image: womenCollection, description: 'A spacious everyday tote designed for a measured wardrobe and long-term wear.', color: 'Black' },
  { name: 'Soft Leather Runner', category: 'Accessories', brand: 'Atelier', price: '$390', image: menCollection, description: 'A lightweight runner in soft leather, combining comfort with a quiet contemporary edge.', color: 'Tan' },
  { name: 'Polished City Boot', category: 'Women', brand: 'Atelier', price: '$610', image: heroCampaign, description: 'A polished city boot built for refined ease and enduring style.', color: 'Black' },
  { name: 'Hand-finished Loafer', category: 'Men', brand: 'Atelier', price: '$450', image: menCollection, description: 'A hand-finished loafer with a classic last and an artisan level of detail.', color: 'Cognac' },
]

const defaultSizes = ['38', '39', '40', '41', '42']

export const products: Product[] = baseProducts.map((product, index) => ({
  ...product,
  id: index + 1,
  sizes: defaultSizes,
  gallery: [product.image, ...allAssets.filter((asset) => asset !== product.image)],
}))

export function getProductById(id: number | string): Product | undefined {
  return products.find((product) => product.id === Number(id))
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  const sameCategory = products.filter((p) => p.id !== product.id && p.category === product.category)
  const others = products.filter((p) => p.id !== product.id && p.category !== product.category)
  return [...sameCategory, ...others].slice(0, count)
}