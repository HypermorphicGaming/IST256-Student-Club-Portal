import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import {
  deleteOrder,
  fetchOrders,
  formatOrderDate,
  formatOrderStatus,
  getOrderStatusBadgeClass,
  updateOrderStatus,
} from '../utils/ordersApi'

function ApprovalPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOrders() {
      try {
        setError('')
        setOrders(await fetchOrders())
      } catch {
        setError('Failed to load orders.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  async function updateStatus(id, status) {
    try {
      setError('')
      const updatedOrder = await updateOrderStatus(id, status)
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          String(order.id) === String(updatedOrder.id) ? updatedOrder : order
        )
      )
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : 'Failed to update order status.'
      )
    }
  }

  async function removeOrder(id) {
    try {
      setError('')
      await deleteOrder(id)
      setOrders((currentOrders) => currentOrders.filter((order) => String(order.id) !== String(id)))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to delete order.')
    }
  }

  return (
    <PageShell>
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h1 className="h3 mb-1">Admin Dashboard</h1>
            <p className="text-muted mb-0">All registrations remain visible until deleted.</p>
          </div>
        </div>

        {loading && <div className="alert alert-info">Loading registrations...</div>}
        {!loading && error && <div className="alert alert-danger">{error}</div>}
        {!loading && orders.length === 0 && (
          <div className="alert alert-success">No registrations found.</div>
        )}

        {!loading && orders.length > 0 && (
          <div className="row g-3">
            {orders.map((order) => (
              <div className="col-12 col-md-6 col-lg-4" key={order.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-2">Order {order.id}</h5>
                    <p className="mb-1">
                      <strong>Date:</strong> {formatOrderDate(order)}
                    </p>
                    <p className="mb-3">
                      <strong>Status:</strong>{' '}
                      <span className={getOrderStatusBadgeClass(order.status)}>
                        {formatOrderStatus(order.status)}
                      </span>
                    </p>

                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-success flex-grow-1"
                        onClick={() => updateStatus(order.id, 'approved')}
                        disabled={order.status === 'approved'}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger flex-grow-1"
                        onClick={() => updateStatus(order.id, 'declined')}
                        disabled={order.status === 'declined'}
                      >
                        Decline
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => removeOrder(order.id)}
                        aria-label={`Delete order ${order.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}

export default ApprovalPage
