import { formatCurrency } from '../utils/productUtils';

function CartItemList({ items, onRemove, emptyText = 'Your cart is empty', className = 'd-flex flex-column gap-2' }) {
  if (items.length === 0) {
    return <p className="text-muted text-center">{emptyText}</p>;
  }

  return (
    <div className={className}>
      {items.map((item) => (
        <div key={item.productId} className="border rounded p-2 mb-2 bg-light">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div>
              <div className="fw-semibold">{item.description}</div>
              <small className="text-muted">{item.productId} | {item.category}</small>
            </div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onRemove(item.productId)}
            >
              Remove
            </button>
          </div>
          <div className="mt-1">{formatCurrency(item.price)}</div>
        </div>
      ))}
    </div>
  );
}

export default CartItemList;