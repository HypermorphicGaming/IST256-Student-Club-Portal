import { useState } from 'react';
import CartItemList from './components/CartItemList';
import {
  buildProductsFromEvents,
  buildValidCart,
  formatCurrency,
  parseOpenSeats,
  parsePrice,
  safeReadArray
} from './utils/productUtils';
import PageShell from './components/PageShell';

const ORDERS_API_URL = 'http://localhost:3000/api/orders';

function Checkout() {
  const [cart, setCart] = useState(() => {
    const events = safeReadArray('club_events');
    const savedCart = safeReadArray('registration_cart');
    const productCollection = buildProductsFromEvents(events);
    const validCart = buildValidCart(savedCart, productCollection);
    localStorage.setItem('registration_cart', JSON.stringify(validCart));
    return validCart;
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  function hydrateCheckoutState() {
    const events = safeReadArray('club_events');
    const savedCart = safeReadArray('registration_cart');
    const productCollection = buildProductsFromEvents(events);
    const validCart = buildValidCart(savedCart, productCollection);

    setCart(validCart);
    localStorage.setItem('registration_cart', JSON.stringify(validCart));
  }

  const saveCart = (newCart) => {
    localStorage.setItem('registration_cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    saveCart(newCart);
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.trim().length < 2) newErrors.name = 'Please provide a valid name.';
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (formData.address.trim().length < 5) newErrors.address = 'Please provide a valid address.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyRegistrationToOpenSeats = () => {
    const events = safeReadArray('club_events');
    const eventById = new Map(
      events.map((eventRecord) => [String(eventRecord.eventId || ''), eventRecord])
    );

    for (const cartItem of cart) {
      const eventId = String(cartItem.sourceEventId || cartItem.productId);
      const matchingEvent = eventById.get(eventId);
      if (!matchingEvent || parseOpenSeats(matchingEvent.openSeats) < 1) return false;
    }

    const updatedEvents = events.map((eventRecord) => {
      const eventId = String(eventRecord.eventId || '');
      const isRegistered = cart.some((item) => String(item.sourceEventId || item.productId) === eventId);
      if (!isRegistered) return eventRecord;
      return {
        ...eventRecord,
        openSeats: parseOpenSeats(eventRecord.openSeats) - 1
      };
    });

    localStorage.setItem('club_events', JSON.stringify(updatedEvents));
    return true;
  };

  const total = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setMessage({ type: 'warning', text: 'Add at least one product before checkout.' });
      return;
    }

    if (!validateForm()) {
      setMessage({ type: 'danger', text: 'Please correct the highlighted fields.' });
      return;
    }

    const seatsUpdated = applyRegistrationToOpenSeats();
    if (!seatsUpdated) {
      hydrateCheckoutState();
      setMessage({ type: 'warning', text: 'One or more events are sold out. Please review open seats.' });
      return;
    }

    // Clear cart and form
    saveCart([]);
    setFormData({ name: '', email: '', address: '' });
    setErrors({});
    setMessage({ type: 'success', text: 'Registration submitted. Open seats updated.' });

    const orderPayload = {
      customer: formData,
      items: cart,
      totalCost: total,
      date: new Date().toISOString()
    };

    fetch(ORDERS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Saved to server:', data);
      })
      .catch((err) => {
        console.error('Server error:', err);
      });
    hydrateCheckoutState();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <PageShell>
      <main className="container-fluid flex-grow-1">
        <div className="row g-3 mt-3">
          <div className="col-lg-4">
            <aside className="cart-sidebar sticky-top" style={{ top: '1rem' }}>
              <div className="card mb-3 cart-card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Registration Cart</h5>
                </div>
                <div className="card-body">
                  <div className="cart-items mb-3">
                    <CartItemList items={cart} onRemove={removeFromCart} />
                  </div>

                </div>

                <div className="card-footer bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Total Cost:</span>
                    <span className="fw-bold text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="card checkout-card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Complete Registration</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : formData.name && !errors.name ? 'is-valid' : ''}`}
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : formData.email && !errors.email ? 'is-valid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Contact Address</label>
                      <textarea
                        className={`form-control ${errors.address ? 'is-invalid' : formData.address && !errors.address ? 'is-valid' : ''}`}
                        id="address"
                        name="address"
                        rows="3"
                        placeholder="123 Main St, City, State 12345"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                      Reserve Seats
                    </button>
                  </form>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show position-fixed`} 
             style={{ top: '20px', right: '20px', zIndex: 1050 }} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

    </PageShell>
  );
}

export default Checkout;