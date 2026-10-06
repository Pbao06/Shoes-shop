/**
 * adminProductValidation — field-level validation for the admin edit product form.
 *
 * Each validator returns an error message string or `undefined` when valid.
 * The composite `validateProductForm` runs every validator and returns a
 * partial object of field → message pairs for the form to render per-field
 * error messages.
 */

const REQUIRED_MESSAGE = 'This field is required.'

const NAME_REGEX = /^[\p{L}\p{N} .'\-&]+$/u
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MAX_PRICE = 999999.99

export interface ProductFormErrors {
  name?: string
  slug?: string
  description?: string
  price?: string
  salePrice?: string
  color?: string
  brandId?: string
  categoryId?: string
  isActive?: string
}

export function validateName(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return REQUIRED_MESSAGE
  if (trimmed.length < 3) return 'Name must be at least 3 characters.'
  if (trimmed.length > 100) return 'Name must be at most 100 characters.'
  if (!NAME_REGEX.test(trimmed)) return "Name may only contain letters, numbers, spaces, hyphens, apostrophes, and dots."
  return undefined
}

export function validateSlug(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (trimmed.length < 3) return 'Slug must be at least 3 characters.'
  if (trimmed.length > 100) return 'Slug must be at most 100 characters.'
  if (!SLUG_REGEX.test(trimmed)) return 'Slug may only contain lowercase letters, numbers, and hyphens (e.g. "blue-suede-shoes").'
  return undefined
}

export function validateDescription(value: string): string | undefined {
  if (value.length > 2000) return 'Description must be at most 2,000 characters.'
  return undefined
}

function validateNonNegativeNumber(
  value: string,
  fieldName: string,
): string | undefined {
  if (value.trim() === '') return REQUIRED_MESSAGE
  const num = Number(value)
  if (Number.isNaN(num)) return `${fieldName} must be a valid number.`
  if (num < 0) return `${fieldName} must be non-negative.`
  if (num > MAX_PRICE) return `${fieldName} must be at most ${MAX_PRICE.toFixed(2)}.`
  return undefined
}

export function validatePrice(value: string): string | undefined {
  return validateNonNegativeNumber(value, 'Price')
}

export function validateSalePrice(
  value: string,
  priceValue: string,
): string | undefined {
  if (value.trim() === '') return undefined
  const err = validateNonNegativeNumber(value, 'Sale price')
  if (err) return err
  const saleNum = Number(value)
  const priceNum = Number(priceValue)
  if (!Number.isNaN(priceNum) && saleNum > priceNum) {
    return 'Sale price cannot exceed the regular price.'
  }
  return undefined
}

export function validateColor(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (trimmed.length > 50) return 'Color must be at most 50 characters.'
  if (!NAME_REGEX.test(trimmed)) return 'Color may only contain letters, spaces, and hyphens.'
  return undefined
}

export function validateBrand(value: string): string | undefined {
  if (!value) return 'Please select a brand.'
  return undefined
}

export function validateCategory(value: string): string | undefined {
  if (!value) return 'Please select a category.'
  return undefined
}

export function validateIsActive(value: string): string | undefined {
  if (!value) return 'Please select a status.'
  return undefined
}

export interface ProductFormValues {
  name: string
  slug: string
  description: string
  price: string
  salePrice: string
  color: string
  brandId: string
  categoryId: string
  isActive: string
}

export function validateProductForm(
  values: ProductFormValues,
): ProductFormErrors {
  return {
    name: validateName(values.name),
    slug: validateSlug(values.slug),
    description: validateDescription(values.description),
    price: validatePrice(values.price),
    salePrice: validateSalePrice(values.salePrice, values.price),
    color: validateColor(values.color),
    brandId: validateBrand(values.brandId),
    categoryId: validateCategory(values.categoryId),
    isActive: validateIsActive(values.isActive),
  }
}
