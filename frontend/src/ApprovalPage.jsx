import { useEffect, useState } from 'react'
import PageShell from './components/PageShell'
import { fetchOrders, formatOrderDate, updateOrderStatus } from './utils/ordersApi'

function ApprovalPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const pendingOrders = orders.filter((order) => order.status === 'pending')

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
        currentOrders.filter((order) => String(order.id) !== String(updatedOrder.id))
      )
    } catch {
      setError('Failed to update order status.')
    }
  }

  return (
    <PageShell>
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h1 className="h3 mb-1">Admin Dashboard</h1>
            <p className="text-muted mb-0">Pending orders waiting for review.</p>
          </div>
        </div>

        {loading && <div className="alert alert-info">Loading pending orders...</div>}
        {!loading && error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && pendingOrders.length === 0 && (
          <div className="alert alert-success">No pending orders right now.</div>
        )}

        {!loading && !error && pendingOrders.length > 0 && (
          <div className="row g-3">
            {pendingOrders.map((order) => (
              <div className="col-12 col-md-6 col-lg-4" key={order.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-2">Order {order.id}</h5>
                    <p className="mb-1">
                      <strong>Date:</strong> {formatOrderDate(order)}
                    </p>
                    <p className="mb-3">
                      <strong>Status:</strong>{' '}
                      <span className="badge bg-warning text-dark">Pending</span>
                    </p>

                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-success flex-grow-1"
                        onClick={() => updateStatus(order.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger flex-grow-1"
                        onClick={() => updateStatus(order.id, 'declined')}
                      >
                        Decline
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
