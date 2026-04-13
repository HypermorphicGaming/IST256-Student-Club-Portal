import { useEffect, useState } from 'react'
import PageShell from './components/PageShell'
import { fetchOrders, formatOrderDate, formatOrderStatus } from './utils/ordersApi'

function OrderHistory() {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'badge bg-success'
      case 'declined':
        return 'badge bg-danger'
      default:
        return 'badge bg-warning text-dark'
    }
  }

  return (
    <PageShell>
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h1 className="h3 mb-1">Order History</h1>
            <p className="text-muted mb-0">All submitted orders from the local file store.</p>
          </div>
        </div>

        {loading && <div className="alert alert-info">Loading orders...</div>}
        {!loading && error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div className="alert alert-warning">No orders found.</div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped align-middle bg-white shadow-sm rounded-3 overflow-hidden">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Order ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-semibold">{order.id}</td>
                    <td>{formatOrderDate(order)}</td>
                    <td>
                      <span className={getStatusBadge(order.status)}>{formatOrderStatus(order.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  )
}

export default OrderHistory
