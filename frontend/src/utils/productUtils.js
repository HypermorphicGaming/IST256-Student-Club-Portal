export const safeReadArray = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const normalizeText = (value) => String(value || '').trim()

export const parsePrice = (value) => {
  if (value === undefined || value === null || value === '') return 0
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const numericValue = Number.parseFloat(String(value).replace(/[^\d.-]/g, ''))
  return Number.isFinite(numericValue) ? numericValue : 0
}

export const parseOpenSeats = (value) => {
  const seatCount = Number.parseInt(value, 10)
  return Number.isInteger(seatCount) && seatCount > 0 ? seatCount : 0
}

export const formatCurrency = (amount) => `$${parsePrice(amount).toFixed(2)}`

export const createProductDocument = (eventRecord, index) => {
  const baseId = eventRecord?.eventId || `event-${index + 1}`
  const description = eventRecord?.eventName || eventRecord?.eventDescription || ''

  return {
    productId: String(baseId),
    description: String(description).trim(),
    category: String(eventRecord?.eventCategory || 'general').trim(),
    unitOfMeasure: 'seat',
    price: parsePrice(eventRecord?.eventCost ?? eventRecord?.admissionFee),
    openSeats: parseOpenSeats(eventRecord?.openSeats),
    sourceEventId: eventRecord?.eventId || null,
  }
}

export const validateProduct = (product) => {
  if (!product.productId || !product.description || !product.category || !product.unitOfMeasure)
    return false
  if (typeof product.price !== 'number' || Number.isNaN(product.price) || product.price < 0)
    return false
  if (!Number.isInteger(product.openSeats) || product.openSeats < 0) return false
  return true
}

export const buildProductsFromEvents = (events) =>
  events.map(createProductDocument).filter(validateProduct)

export const buildValidCart = (savedCart, products) => {
  const productsById = new Map(products.map((product) => [product.productId, product]))
  return savedCart.filter((item) => {
    const product = productsById.get(item.productId)
    return Boolean(product && product.openSeats > 0)
  })
}
