import ProductDetail from "@/components/main/ProductDetailComponent"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductDetail id={id} />
}