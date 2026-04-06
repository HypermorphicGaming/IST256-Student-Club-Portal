import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CatalogCart() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartMessage, setCartMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadCart();
  }, [products]);

  const parsePrice = (value) => {
    if (value === undefined || value === null || value === '') return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const numericValue = Number.parseFloat(String(value).replace(/[^\d.-]/g, ''));
    return Number.isFinite(numericValue) ? numericValue : 0;
  };

  const parseOpenSeats = (value) => {
    const seatCount = Number.parseInt(value, 10);
    return Number.isInteger(seatCount) && seatCount > 0 ? seatCount : 0;
  };

  const createProductDocument = (eventRecord, index) => {
    const baseId = eventRecord.eventId || `event-${index + 1}`;
    const description = eventRecord.eventName || eventRecord.eventDescription || '';

    return {
      productId: String(baseId),
      description: String(description).trim(),
      category: String(eventRecord.eventCategory || 'general').trim(),
      unitOfMeasure: 'seat',
      price: parsePrice(eventRecord.eventCost ?? eventRecord.admissionFee),
      openSeats: parseOpenSeats(eventRecord.openSeats),
      weight: eventRecord.eventDuration || '',
      color: eventRecord.color || '',
      sourceEventId: eventRecord.eventId || null
    };
  };

  const validateProduct = (product) => {
    if (!product.productId || !product.description || !product.category || !product.unitOfMeasure) return false;
    if (typeof product.price !== 'number' || Number.isNaN(product.price) || product.price < 0) return false;
    if (!Number.isInteger(product.openSeats) || product.openSeats < 0) return false;
    return true;
  };

  const loadProducts = () => {
    const events = JSON.parse(localStorage.getItem('club_events') || '[]');
    const productCollection = events.map(createProductDocument).filter(validateProduct);
    setProducts(productCollection);
  };

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('registration_cart') || '[]');
    const validCart = savedCart.filter((item) => {
      const product = products.find((p) => p.productId === item.productId);
      return product && product.openSeats > 0;
    });
    setCart(validCart);
  };

  const saveCart = (newCart) => {
    localStorage.setItem('registration_cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  const addToCart = (productId) => {
    const product = products.find((item) => item.productId === productId);
    if (!product) {
      setCartMessage({ type: 'danger', text: 'Product not found.' });
      return;
    }
    if (product.openSeats <= 0) {
      setCartMessage({ type: 'warning', text: 'No open seats left for this event.' });
      return;
    }
    const existsInCart = cart.some((item) => item.productId === productId);
    if (existsInCart) {
      setCartMessage({ type: 'warning', text: 'That product is already in your cart.' });
      return;
    }
    const newCart = [...cart, product];
    saveCart(newCart);
    setCartMessage({ type: 'success', text: 'Product added to cart.' });
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    saveCart(newCart);
    setCartMessage({ type: 'success', text: 'Product removed from cart.' });
  };

  const filteredProducts = products.filter((product) =>
    product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="container-fluid flex-grow-1">
        <div className="row g-3 mt-3">
          <div className="col-lg-8">
            <section className="catalog-section">
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                {filteredProducts.length === 0 ? (
                  <div className="col-12">
                    <div className="alert alert-info mb-0">No events available.</div>
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const soldOut = product.openSeats <= 0;
                    return (
                      <div key={product.productId} className="col">
                        <div className="card h-100 shadow-sm">
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{product.description}</h5>
                            <p className="mb-1"><strong>ID:</strong> {product.productId}</p>
                            <p className="mb-1"><strong>Category:</strong> {product.category}</p>
                            <p className="mb-1"><strong>Unit:</strong> {product.unitOfMeasure}</p>
                            <p className="mb-1"><strong>Open Seats:</strong> {product.openSeats}</p>
                            <p className="mb-3"><strong>Price:</strong> {formatCurrency(product.price)}</p>
                            <button
                              className="btn btn-primary mt-auto"
                              onClick={() => addToCart(product.productId)}
                              disabled={soldOut}
                            >
                              {soldOut ? 'Sold Out' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
          <div className="col-lg-4">
            <aside className="cart-sidebar sticky-top" style={{ top: '1rem' }}>
              <div className="card cart-card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Registration Cart</h5>
                </div>
                <div className="card-body d-flex flex-column" style={{ minHeight: '140px' }}>
                  <div className="d-flex flex-column gap-2">
                    {cart.length === 0 ? (
                      <p className="text-muted text-center">Your cart is empty</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.productId} className="border rounded p-2 mb-2 bg-light">
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <div>
                              <div className="fw-semibold">{item.description}</div>
                              <small className="text-muted">{item.productId} | {item.category}</small>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-1">{formatCurrency(item.price)}</div>
                        </div>
                      ))
                    )}
                  </div>
                  {cartMessage.text && (
                    <div className={`alert alert-${cartMessage.type} py-2 mb-0`} role="alert">
                      {cartMessage.text}
                    </div>
                  )}
                </div>
                <div className="card-footer bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Total Cost:</span>
                    <span className="fw-bold text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="d-grid">
                  <Link to="/checkout" className="btn btn-success w-100">
                    Checkout
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto d-flex align-items-center justify-content-center">
        <p className="mb-0">&copy; 2026 Student Club Portal | IST 256 Group 1</p>
      </footer>
    </div>
  );
}

export default CatalogCart;