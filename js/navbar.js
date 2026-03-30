const NAVBAR_HTML = `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="index.html">Club Portal</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">

            <!-- LEFT NAVBAR -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="index.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="catalogCart.html">Register</a>
                </li>
            </ul>
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="manageUsers.html">Manage Users</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="manageEvents.html">Manage Events</a>
                </li>
            </ul>

            <!-- RIGHT NAVBAR -->
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link position-relative" href="cart.html">Cart<span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
`;

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("event_cart")) || [];
    const countElement = document.getElementById("cartCount");

    if (countElement) {
        countElement.textContent = cart.length;
    }
}

function initNavbar() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    updateCartCount();
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('afterbegin', NAVBAR_HTML);
    initNavbar();
});