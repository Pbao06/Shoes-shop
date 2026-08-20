import type { Metadata } from 'next'
import CheckoutPage from '@/components/main/Checkout-page'

export const metadata: Metadata = { title: 'Checkout — Atelier', description: 'Complete your Atelier order.' }

export default function Page() {
  return <CheckoutPage />
}
