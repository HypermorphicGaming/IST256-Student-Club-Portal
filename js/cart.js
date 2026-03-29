function getEventCart() {
    return JSON.parse(localStorage.getItem("event_cart")) || [];
}

function saveEventCart(cart) {
    localStorage.setItem("event_cart", JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();
    const container = $("#cartItems");
    container.empty();

    if (cart.length === 0) {
        container.html("<p>No events selected.</p>");
        return;
    }

    cart.forEach((event, index) => {
        const card = `
        <div class="card mb-3">
            <div class="card-body">
                <h5>${event.eventName}</h5>
                <p><strong>Category:</strong> ${event.eventCategory}</p>
                <p><strong>Location:</strong> ${event.locationRoomNumber}</p>
                <button class="btn btn-danger removeEventBtn" data-index="${index}">Remove</button>
            </div>
        </div>
        `;
        container.append(card);
    });
    updateCartCount()
}

$(document).on("click", ".removeEventBtn", function () {
    const index = $(this).data("index");
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    if (typeof updateCartCount === "function") updateCartCount();
});

$("#submitRegistration").on("click", function () {
    const cart = getCart();
    if (cart.length === 0) {
        alert("No events selected");
        return;
    }

    $.ajax({
        url: "https://jsonplaceholder.typicode.com/posts",
        method: "POST",
        data: JSON.stringify({ registrations: cart }),
        contentType: "application/json"
    }).done(function () {
        alert("Registration submitted successfully!");
        localStorage.removeItem("event_cart");
        renderCart();
        if (typeof updateCartCount === "function") updateCartCount();
    }).fail(function () {
        alert("Failed to submit registration. Try again.");
    });
});

$(document).ready(function () {
    renderCart();
});