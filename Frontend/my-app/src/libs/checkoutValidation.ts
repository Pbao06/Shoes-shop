/**
 * checkoutValidation — field-level validation helpers for the checkout form.
 *
 * These functions mirror the conventions established in RegisterFrom.tsx:
 * trim strings, enforce minimum lengths, and apply domain-specific regex
 * rules. Each validator returns an error message string or `undefined` when
 * the value is valid.
 *
 * The composite `validateCheckout` runs every validator and returns a
 * partial object of field → message pairs so the form can render
 * per-field error messages.
 */

const REQUIRED_MESSAGE = 'This field is required.'

/**
 * Unicode property escapes (`\p{L}`, `\p{M}`) with the `u` flag accept any
 * Unicode letter or combining mark — covering accented Latin, Cyrillic,
 * Vietnamese (ư, ơ, đ, tone marks), CJK, Arabic, etc.
 */
const NAME_REGEX = /^[\p{L}\p{M} .'-]+$/u

const CITY_REGEX = /^[\p{L}\p{M} .'-]+$/u

const POSTAL_CODE_REGEX = /^[\p{L}\p{N} .'#-]+$/u

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface CheckoutErrors {
  firstName?: string
  lastName?: string
  email?: string
  addressLine1?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface CheckoutValues {
  firstName: string
  lastName: string
  email: string
  addressLine1: string
  city: string
  postalCode: string
  country: string
}

function validateRequired(value: string): string | undefined {
  if (!value.trim()) return REQUIRED_MESSAGE
  return undefined
}

function validateMinLength(value: string, min: number, message: string): string | undefined {
  if (value.trim().length < min) return message
  return undefined
}

function validateMaxLength(value: string, max: number, message: string): string | undefined {
  if (value.trim().length > max) return message
  return undefined
}

function validatePattern(value: string, regex: RegExp, message: string): string | undefined {
  if (!regex.test(value)) return message
  return undefined
}

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return REQUIRED_MESSAGE
  if (trimmed.length > 254) return "Email address must be at most 254 characters."
  if (!EMAIL_REGEX.test(trimmed)) return "Please enter a valid email address."
  return undefined
}

export function validateFirstName(value: string): string | undefined {
  const required = validateRequired(value)
  if (required) return required
  const min = validateMinLength(value, 2, 'First name must be at least 2 characters.')
  if (min) return min
  const max = validateMaxLength(value, 50, 'First name must be at most 50 characters.')
  if (max) return max
  return validatePattern(value, NAME_REGEX, "First name may only contain letters, spaces, hyphens, apostrophes, and dots.")
}

export function validateLastName(value: string): string | undefined {
  const required = validateRequired(value)
  if (required) return required
  const min = validateMinLength(value, 2, "Last name must be at least 2 characters.")
  if (min) return min
  const max = validateMaxLength(value, 50, "Last name must be at most 50 characters.")
  if (max) return max
  return validatePattern(value, NAME_REGEX, "Last name may only contain letters, spaces, hyphens, apostrophes, and dots.")
}

export function validateAddressLine1(value: string): string | undefined {
  const required = validateRequired(value)
  if (required) return required
  const min = validateMinLength(value, 5, "Address must be at least 5 characters.")
  if (min) return min
  return validateMaxLength(value, 200, "Address must be at most 200 characters.")
}

export function validateCity(value: string): string | undefined {
  const required = validateRequired(value)
  if (required) return required
  const min = validateMinLength(value, 2, "City must be at least 2 characters.")
  if (min) return min
  const max = validateMaxLength(value, 100, "City must be at most 100 characters.")
  if (max) return max
  return validatePattern(value, CITY_REGEX, "City may only contain letters, spaces, hyphens, apostrophes, and dots.")
}

export function validatePostalCode(value: string): string | undefined {
  const required = validateRequired(value)
  if (required) return required
  const trimmed = value.trim().replace(/\s/g, "")
  if (trimmed.length < 3) return "Postal code must be at least 3 characters."
  const max = validateMaxLength(value, 20, "Postal code must be at most 20 characters.")
  if (max) return max
  return validatePattern(value, POSTAL_CODE_REGEX, "Postal code may only contain letters, numbers, spaces, hyphens, dots, and hash signs.")
}

export function validateCountry(value: string): string | undefined {
  if (!value) return "Please select a country."
  return undefined
}

/**
 * Run all field validators and return an object whose keys are the field
 * names that have errors, mapped to their error messages.  An empty object
 * means the form is valid.
 */
export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  return {
    firstName: validateFirstName(values.firstName),
    lastName: validateLastName(values.lastName),
    email: validateEmail(values.email),
    addressLine1: validateAddressLine1(values.addressLine1),
    city: validateCity(values.city),
    postalCode: validatePostalCode(values.postalCode),
    country: validateCountry(values.country),
  }
}
