import type { Metadata } from 'next'
import OrdersPage from '@/components/main/orders-page'

export const metadata: Metadata = {
  title: 'My Orders — Atelier',
  description: 'View your Atelier order history.',
}

export default function Page() {
  return <OrdersPage />
}
