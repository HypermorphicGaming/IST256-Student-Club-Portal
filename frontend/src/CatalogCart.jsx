import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartItemList from './components/CartItemList';
import {
  buildProductsFromEvents,
  buildValidCart,
  formatCurrency,
  parsePrice,
  safeReadArray
} from './utils/productUtils';
import PageShell from './components/PageShell';

function CatalogCart() {
  const [products] = useState(() => {
    const events = safeReadArray('club_events');
    return buildProductsFromEvents(events);
  });
  const [cart, setCart] = useState(() => {
    const events = safeReadArray('club_events');
    const savedCart = safeReadArray('registration_cart');
    const productCollection = buildProductsFromEvents(events);
    const validCart = buildValidCart(savedCart, productCollection);
    localStorage.setItem('registration_cart', JSON.stringify(validCart));
    return validCart;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [cartMessage, setCartMessage] = useState({ type: '', text: '' });

  const saveCart = (newCart) => {
    localStorage.setItem('registration_cart', JSON.stringify(newCart));
    setCart(newCart);
  };

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
    <PageShell>
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
                  <CartItemList items={cart} onRemove={removeFromCart} />
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
    </PageShell>
  );
}

export default CatalogCart;