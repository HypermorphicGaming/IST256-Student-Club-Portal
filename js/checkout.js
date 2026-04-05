const EVENT_STORAGE_KEY = 'club_events';
const CART_STORAGE_KEY = 'registration_cart';
const REGISTRATION_ENDPOINT = 'https://example.com/api/registrations';

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

function renderCart() {
    const $cartItems = $('#cartItems');
    const $emptyMessage = $('#emptyCartMessage');

    if (!cart.length) {
        $cartItems.html('<p class="text-muted text-center">Your cart is empty</p>');
        $emptyMessage.removeClass('d-none');
        $('#cartTotal').text('$0.00');
        return;
    }

    $emptyMessage.addClass('d-none');

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

function showCheckoutMessage(type, message) {
    const html = `
      <div class="alert alert-${type} py-2 mb-3" role="alert">${message}</div>
    `;

    $('#checkoutForm').find('.alert').remove();
    $('#checkoutForm').prepend(html);
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.productId !== productId);
    saveCart();
    renderCart();
}

function applyFieldValidity($field, isValid) {
    $field.toggleClass('is-valid', isValid);
    $field.toggleClass('is-invalid', !isValid);
}

function validateCheckoutForm() {
    const $name = $('#customerName');
    const $email = $('#customerEmail');
    const $address = $('#customerAddress');

    const nameValid = $name.val().trim().length >= 2;
    const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test($email.val().trim());
    const addressValid = $address.val().trim().length >= 5;

    applyFieldValidity($name, nameValid);
    applyFieldValidity($email, emailValid);
    applyFieldValidity($address, addressValid);

    return nameValid && emailValid && addressValid;
}

function buildCheckoutPayload() {
    const total = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);

    return {
        customer: {
            name: $('#customerName').val().trim(),
            email: $('#customerEmail').val().trim(),
            address: $('#customerAddress').val().trim()
        },
        products: cart,
        total,
        createdAt: new Date().toISOString()
    };
}

function submitCheckout(payload) {
    return $.ajax({
        url: REGISTRATION_ENDPOINT,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        timeout: 8000
    });
}

function applyRegistrationToOpenSeats() {
    const events = JSON.parse(localStorage.getItem(EVENT_STORAGE_KEY)) || [];

    const eventById = new Map(
        events.map((eventRecord) => [String(eventRecord.eventId || ''), eventRecord])
    );

    for (const cartItem of cart) {
        const eventId = String(cartItem.sourceEventId || cartItem.productId);
        const matchingEvent = eventById.get(eventId);

        if (!matchingEvent || parseOpenSeats(matchingEvent.openSeats) < 1) {
            return false;
        }
    }

    const updatedEvents = events.map((eventRecord) => {
        const eventId = String(eventRecord.eventId || '');
        const isRegistered = cart.some((item) => String(item.sourceEventId || item.productId) === eventId);

        if (!isRegistered) {
            return eventRecord;
        }

        return {
            ...eventRecord,
            openSeats: parseOpenSeats(eventRecord.openSeats) - 1
        };
    });

    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(updatedEvents));
    return true;
}

function bindEvents() {
    $('#cartItems').on('click', '.remove-from-cart', function () {
        const productId = $(this).data('productId');
        removeFromCart(String(productId));
    });

    $('#checkoutForm').on('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const formValid = validateCheckoutForm();
        const cartValid = cart.length > 0;

        if (!cartValid) {
            showCheckoutMessage('warning', 'Add at least one product before checkout.');
            return;
        }

        if (!formValid) {
            showCheckoutMessage('danger', 'Please correct the highlighted fields.');
            return;
        }

        const seatsUpdated = applyRegistrationToOpenSeats();
        if (!seatsUpdated) {
            loadProducts();
            loadCart();
            renderCart();
            showCheckoutMessage('warning', 'One or more events are sold out. Please review open seats.');
            return;
        }

        const payload = buildCheckoutPayload();

        cart = [];
        saveCart();
        renderCart();
        $('#checkoutForm')[0].reset();
        $('#checkoutForm').find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
        showCheckoutMessage('success', 'Registration submitted. Open seats updated.');

        submitCheckout(payload).fail(function () {
            showCheckoutMessage('warning', 'Registration saved, but API transport failed.');
        });
    });
}

function initCatalogCartPage() {
    if (!$('#checkoutForm').length) {
        return;
    }

    loadProducts();
    loadCart();
    renderCart();
    bindEvents();
}

$(initCatalogCartPage);