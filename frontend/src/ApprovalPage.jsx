import { useEffect, useState } from "react";

function ApprovalPage() {
  const [orders, setOrders] = useState([]);

  function loadOrders() {
    fetch("http://localhost:3000/registrations")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
      });
  }

  function updateStatus(id, status) {
    fetch(`http://localhost:3000/registrations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    }).then(() => {
      loadOrders();
    });
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Pending Orders</h1>

      {orders
        .filter(order => order.status === "pending")
        .map(order => (
          <div className="card mb-3" key={order.id}>
            <div className="card-body text-dark">
              <h5>{order.customer.name}</h5>
              <p>{order.customer.email}</p>
              <p>Total: ${order.totalCost}</p>

              <button
                className="btn btn-success me-2"
                onClick={() => updateStatus(order.id, "approved")}
              >
                Approve
              </button>

              <button
                className="btn btn-danger"
                onClick={() => updateStatus(order.id, "declined")}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ApprovalPage;
