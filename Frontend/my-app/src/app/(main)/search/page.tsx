import { Suspense } from 'react'
import SearchPage from '@/components/main/search-page'

export const metadata = {
  title: 'Search — Atelier',
  description: 'Search the Atelier collection.',
}

export default function SearchRoute() {
  return <Suspense fallback={<main className="min-h-screen bg-background" />}><SearchPage /></Suspense>
}
