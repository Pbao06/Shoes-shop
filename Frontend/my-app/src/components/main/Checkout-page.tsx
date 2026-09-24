'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useOrderApi } from '@/hooks/useOrderApi'
import { useAuth } from '@/context/AuthContext'
import { useModal } from '@/context/ModalContext'
import type { CheckoutRequest } from '@/types/order'
import {
  validateCheckout,
  type CheckoutValues,
  type CheckoutErrors,
} from '@/libs/checkoutValidation'

const initialValues: CheckoutValues = {
  firstName: '',
  lastName: '',
  email: '',
  addressLine1: '',
  city: '',
  postalCode: '',
  country: 'United States',
}

const allTouched: Record<keyof CheckoutErrors, boolean> = {
  firstName: true,
  lastName: true,
  email: true,
  addressLine1: true,
  city: true,
  postalCode: true,
  country: true,
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { openModal } = useModal()
  const { createOrder, loading: isPlacingOrder, error: orderError } = useOrderApi(user?.id ?? 0)

  const [payment, setPayment] = useState('card')
  const [submitted, setSubmitted] = useState(false)
  const [values, setValues] = useState<CheckoutValues>(initialValues)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [touched, setTouched] = useState<Record<keyof CheckoutErrors, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    addressLine1: false,
    city: false,
    postalCode: false,
    country: false,
  })

  const shipping = subtotal >= 500 ? 0 : 20
  const total = subtotal + shipping

  const handleBlur = (field: keyof CheckoutValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldErrors = validateCheckout(values)
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
  }

  const handleChange = (field: keyof CheckoutValues, value: string) => {
    const updated = { ...values, [field]: value }
    setValues(updated)
    if (touched[field]) {
      const fieldErrors = validateCheckout(updated)
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!items.length || isPlacingOrder) return

    const newErrors = validateCheckout(values)
    setErrors(newErrors)
    setTouched(allTouched)
    if (Object.values(newErrors).some(Boolean)) return

    const checkoutRequest: CheckoutRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      address: values.addressLine1.trim(),
      city: values.city.trim(),
      postalCode: values.postalCode.trim(),
      country: values.country,
      payment,
    }

    try {
      const order = await createOrder(checkoutRequest)
      clearCart()
      setSubmitted(true)
      router.push(`/order-success?orderId=${order.orderNumber}`)
    } catch {
      // error is surfaced by useOrderApi.error
    }
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="font-serif text-3xl">Please log in to checkout</p>
      </main>
    )
  }

  if (submitted) return null

  const hasValidationErrors = Object.values(errors).some(Boolean) && Object.values(touched).some(Boolean)

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_380px]">
          <section>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">01 / Delivery</p>
            <h1 className="mb-10 font-serif text-5xl font-normal">Checkout</h1>
            {(orderError || hasValidationErrors) && (
              <p className="mb-6 text-sm text-red-600" role="alert">
                {orderError || 'Please fix the errors below and try again.'}
              </p>
            )}
            <form
              id="checkout-form"
              className="space-y-8"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-widest">
                  First name
                  <input
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground"
                    value={values.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.firstName}
                    </p>
                  )}
                </label>
                <label className="text-xs uppercase tracking-widest">
                  Last name
                  <input
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground"
                    value={values.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.lastName}
                    </p>
                  )}
                </label>
              </div>
              <label className="block text-xs uppercase tracking-widest">
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground"
                  value={values.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </label>
              <label className="block text-xs uppercase tracking-widest">
                Address
                <input
                  type="text"
                  name="address"
                  autoComplete="address-line1"
                  className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground"
                  value={values.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                  onBlur={() => handleBlur('addressLine1')}
                />
                {touched.addressLine1 && errors.addressLine1 && (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {errors.addressLine1}
                  </p>
                )}
              </label>
              <div className="grid gap-5 sm:grid-cols-3">
                <label className="text-xs uppercase tracking-widest">
                  City
                  <input
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground"
                    value={values.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                  />
                  {touched.city && errors.city && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.city}
                    </p>
                  )}
                </label>
                <label className="text-xs uppercase tracking-widest">
                  Postal code
                  <input
                    type="text"
                    name="postalCode"
                    autoComplete="postal-code"
                    className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-foreground"
                    value={values.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    onBlur={() => handleBlur('postalCode')}
                  />
                  {touched.postalCode && errors.postalCode && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.postalCode}
                    </p>
                  )}
                </label>
                <label className="text-xs uppercase tracking-widest">
                  Country
                  <select
                    name="country"
                    className="mt-2 w-full border-b border-border bg-background py-3 text-sm outline-none"
                    value={values.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    onBlur={() => handleBlur('country')}
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>France</option>
                  </select>
                  {touched.country && errors.country && (
                    <p className="mt-1 text-xs text-red-600" role="alert">
                      {errors.country}
                    </p>
                  )}
                </label>
              </div>
              <div className="border-t border-border pt-8">
                <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">02 / Payment</p>
                <div className="space-y-3">
                  {[
                    ['card', 'Credit card'],
                    ['paypal', 'PayPal'],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-3 border border-border p-4 text-sm"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={value}
                        checked={payment === value}
                        onChange={() => setPayment(value)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={!items.length || isPlacingOrder}
                className="w-full bg-foreground py-4 text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPlacingOrder ? 'Placing order...' : 'Place order'}
              </button>
            </form>
          </section>
          <aside className="h-fit border-t border-border pt-6 lg:sticky lg:top-8">
            <p className="mb-8 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Order summary</p>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="mb-6 flex gap-4"
              >
                <div className="relative h-24 w-20 overflow-hidden bg-secondary">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p>{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Size {item.size} · Qty {item.quantity}
                  </p>
                  <p className="mt-3">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping ? `$${shipping.toFixed(2)}` : 'Complimentary'}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4 font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
