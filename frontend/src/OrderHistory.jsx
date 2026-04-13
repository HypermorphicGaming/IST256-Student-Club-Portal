import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import { formatCurrency } from './utils/productUtils';

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/registrations')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'declined': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Register History</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">No registrations found.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card mb-3">
            <div className="card-body">
              <h5>ID: {order.id}</h5>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

              <span className={`badge ${getStatusBadge(order.status)}`}>
                {order.status.toUpperCase()}
              </span>

              <hr />

              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>

              <ul>
                {order.items.map(item => (
                  <li key={item.productId}>
                    {item.description} - {formatCurrency(item.price)}
                  </li>
                ))}
              </ul>

              <p><strong>Total:</strong> {formatCurrency(order.totalCost)}</p>
            </div>
          </div>
        ))
      )}
      <Footer />
    </div>
  );
}

export default OrderHistory;