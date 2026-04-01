const EVENT_STORAGE_KEY = 'club_events';
const CART_STORAGE_KEY = 'registration_cart';

let productCollection = [];
let cart = [];

function parsePrice(value) {
    if (value === undefined || value === null || value === '') {
        return 0;
    }

    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }

    const numericValue = Number.parseFloat(String(value).replace(/[^\d.-]/g, ''));
    return Number.isFinite(numericValue) ? numericValue : 0;
}

function parseOpenSeats(value) {
    const seatCount = Number.parseInt(value, 10);
    return Number.isInteger(seatCount) && seatCount > 0 ? seatCount : 0;
}

function createProductDocument(eventRecord, index) {
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
}

function validateProduct(product) {
    if (!product.productId || !product.description || !product.category || !product.unitOfMeasure) {
        return false;
    }

    if (typeof product.price !== 'number' || Number.isNaN(product.price) || product.price < 0) {
        return false;
    }

    if (!Number.isInteger(product.openSeats) || product.openSeats < 0) {
        return false;
    }

    return true;
}

function loadProducts() {
    const events = JSON.parse(localStorage.getItem(EVENT_STORAGE_KEY)) || [];

    productCollection = events
        .map(createProductDocument)
        .filter(validateProduct);
}

function loadCart() {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

    cart = savedCart.filter((item) => {
        const product = productCollection.find((p) => p.productId === item.productId);
        return product && product.openSeats > 0;
    });

    saveCart();
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

function renderProducts(productsToRender) {
    const $grid = $('#productGrid');

    if (!productsToRender.length) {
        $grid.html('<div class="col-12"><div class="alert alert-info mb-0">No events available.</div></div>');
        return;
    }

    const cardsHtml = productsToRender
        .map((product) => {
            const soldOut = product.openSeats <= 0;
            return `
          <div class="col">
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.description}</h5>
                <p class="mb-1"><strong>ID:</strong> ${product.productId}</p>
                <p class="mb-1"><strong>Category:</strong> ${product.category}</p>
                <p class="mb-1"><strong>Unit:</strong> ${product.unitOfMeasure}</p>
                <p class="mb-1"><strong>Open Seats:</strong> ${product.openSeats}</p>
                <p class="mb-3"><strong>Price:</strong> ${formatCurrency(product.price)}</p>
                <button class="btn btn-primary mt-auto add-to-cart" data-product-id="${product.productId}" ${soldOut ? 'disabled' : ''}>${soldOut ? 'Sold Out' : 'Add to Cart'}</button>
              </div>
            </div>
          </div>
        `;
        })
        .join('');

    $grid.html(cardsHtml);
}

function renderCart() {
    const $cartItems = $('#cartItems');

    clearCartMessage();
    
    if (!cart.length) {
        $cartItems.empty();
        $('#cartTotal').text('$0.00');
        showCartMessage('secondary', 'Your cart is empty');
        return;
    }

    const itemHtml = cart
        .map((item) => {
            return `
          <div class="border rounded p-2 mb-2 bg-light">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div>
                <div class="fw-semibold">${item.description}</div>
                <small class="text-muted">${item.productId} | ${item.category}</small>
              </div>
              <button class="btn btn-sm btn-outline-danger remove-from-cart" data-product-id="${item.productId}">Remove</button>
            </div>
            <div class="mt-1">${formatCurrency(item.price)}</div>
          </div>
        `;
        })
        .join('');

    const total = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);

    $cartItems.html(itemHtml);
    $('#cartTotal').text(formatCurrency(total));
}

function showCartMessage(type, message) {
    const html = `<div class="alert alert-${type} py-2 mb-0" role="alert">${message}</div>`;
    $('#cartMessage').html(html);
}

function clearCartMessage() {
    $('#cartMessage').empty();
}

function addToCart(productId) {
    const product = productCollection.find((item) => item.productId === productId);

    if (!product) {
        showCartMessage('danger', 'Product not found.');
        return;
    }

    if (product.openSeats <= 0) {
        showCartMessage('warning', 'No open seats left for this event.');
        return;
    }

    const existsInCart = cart.some((item) => item.productId === productId);
    if (existsInCart) {
        showCartMessage('warning', 'That product is already in your cart.');
        return;
    }

    cart.push(product);
    saveCart();
    renderCart();
    showCartMessage('success', 'Product added to cart.');
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.productId !== productId);
    saveCart();
    renderCart();
    showCartMessage('success', 'Product removed from cart.');
}

function bindEvents() {
    $('#productSearch').on('input', function () {
        const searchValue = $(this).val().trim().toLowerCase();

        if (!searchValue) {
            renderProducts(productCollection);
            return;
        }

        const filtered = productCollection.filter((product) => {
            return (
                product.productId.toLowerCase().includes(searchValue) ||
                product.description.toLowerCase().includes(searchValue) ||
                product.category.toLowerCase().includes(searchValue)
            );
        });

        renderProducts(filtered);
    });

    $('#productGrid').on('click', '.add-to-cart', function () {
        const productId = $(this).data('productId');
        addToCart(String(productId));
    });

    $('#cartItems').on('click', '.remove-from-cart', function () {
        const productId = $(this).data('productId');
        removeFromCart(String(productId));
    });
}

function initCatalogCartPage() {
    if (!$('#productGrid').length) {
        return;
    }

    loadProducts();
    loadCart();
    renderProducts(productCollection);
    renderCart();
    bindEvents();
}

$(initCatalogCartPage);