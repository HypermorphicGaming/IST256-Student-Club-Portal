const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
const ORDERS_API_URL = `${API_BASE_URL}/orders`

async function requestOrders(endpoint = '', options = {}) {
  const response = await fetch(`${ORDERS_API_URL}${endpoint}`, options)
  const contentType = response.headers.get('content-type') || ''
  const isJsonResponse = contentType.includes('application/json')

  if (!response.ok) {
    let errorMessage = 'Order request failed.'

    if (isJsonResponse) {
      const errorData = await response.json()
      if (errorData && typeof errorData.error === 'string' && errorData.error.trim()) {
        errorMessage = errorData.error
      }
    } else {
      const textBody = await response.text()
      if (typeof textBody === 'string' && textBody.trim()) {
        const match = textBody.match(/<pre>(.*?)<\/pre>/i)
        errorMessage = match?.[1]?.trim() || textBody.trim()
      }
    }

    throw new Error(errorMessage)
  }

  if (!isJsonResponse || response.status === 204) {
    return null
  }

  return response.json()
}

export async function fetchOrders() {
  const data = await requestOrders()
  return Array.isArray(data) ? data : []
}

export async function createOrder(orderPayload) {
  return requestOrders('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderPayload),
  })
}

export async function updateOrderStatus(orderId, status) {
  return requestOrders(`/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
}

export async function deleteOrder(orderId) {
  return requestOrders(`/${orderId}`, {
    method: 'DELETE',
  })
}

export function formatOrderDate(order) {
  const rawDate = order.createdAt || order.date
  if (!rawDate) {
    return 'N/A'
  }

  const parsedDate = new Date(rawDate)
  return Number.isNaN(parsedDate.getTime()) ? 'N/A' : parsedDate.toLocaleString()
}

export function formatOrderStatus(status) {
  const normalizedStatus = String(status || 'pending')
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)
}

export function getOrderStatusBadgeClass(status) {
  switch (status) {
    case 'approved':
      return 'badge bg-success'
    case 'declined':
      return 'badge bg-danger'
    default:
      return 'badge bg-warning text-dark'
  }
}
