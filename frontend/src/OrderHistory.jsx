import { useEffect, useState } from 'react';
import Footer from './components/Footer';

const ORDERS_API_URL = 'http://localhost:3000/api/orders';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(ORDERS_API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load orders.');
        }
        return res.json();
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'badge bg-success';
      case 'declined':
        return 'badge bg-danger';
      default:
        return 'badge bg-warning text-dark';
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <h2 className="mb-1">Order History</h2>
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
                  <td>{new Date(order.createdAt || order.date || Date.now()).toLocaleString()}</td>
                  <td>
                    <span className={getStatusBadge(order.status)}>
                      {String(order.status || 'pending').charAt(0).toUpperCase() + String(order.status || 'pending').slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default OrderHistory;