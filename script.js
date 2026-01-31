/* LOADER */
window.onload = function () {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";

    // Initialize Cart Logic
    renderCart();

    // Initialize Hero Slider
    initHeroSlider();
}

/* HERO SLIDER LOGIC */
function initHeroSlider() {
    const track = document.querySelector('.hero-track');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');

    // Safety check if dynamic track exists, otherwise fallback to opacity
    if (!track) {
        // Fallback for old HTML if track not present
        const oldSlides = document.querySelectorAll('.hero-slide');
        if (oldSlides.length > 0) {
            // Old logic
            const intervalTime = 4000;
            let current = 0;
            setInterval(() => {
                oldSlides[current].classList.remove('active');
                dots[current]?.classList.remove('active');
                current = (current + 1) % oldSlides.length;
                oldSlides[current].classList.add('active');
                dots[current]?.classList.add('active');
            }, intervalTime);
        }
        return;
    }

    if (slides.length === 0) return;

    let currentSlide = 0;
    const intervalTime = 4000; // 4 seconds
    let slideInterval;

    function updateSlide() {
        // Move Track
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update Dots
        dots.forEach((dot, index) => {
            if (dot) dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide();
    }

    // Auto Slide
    slideInterval = setInterval(nextSlide, intervalTime);

    function resetTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Manual click - Arrows
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    // Manual click - Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlide();
            resetTimer();
        });
    });
}

/* AOS */
AOS.init({
    duration: 1000,
    once: true
});

/* GSAP */
if (typeof gsap !== 'undefined') {
    gsap.from("nav", {
        y: -60,
        opacity: 0,
        duration: 1
    });

    gsap.from(".hero-overlay", {
        scale: 0.6,
        opacity: 0,
        duration: 1.2,
        delay: 0.3
    });
}

/* CART LOGIC */
let cart = JSON.parse(localStorage.getItem('glocafy_cart')) || [];

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

function addToCart(btn) {
    // Find parent card
    const card = btn.closest('.product-card');
    const img = card.querySelector('img').src;
    const title = card.querySelector('.product-title').innerText;
    // Price ignored based on user request "dont mention price"

    // Add to cart object
    const item = {
        title: title,
        price: 0, // No price tracking
        img: img
    };

    cart.push(item);
    updateCart();
    // toggleCart(); // Auto-open DISABLED
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    localStorage.setItem('glocafy_cart', JSON.stringify(cart));
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.innerText = cart.length;
    renderCart();
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');

    if (!cartItemsContainer) return; // Cart sidebar not present in DOM yet

    // Update Badge
    if (cartCountEl) cartCountEl.innerText = cart.length;

    // Clear current items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty-msg">Your cart is empty</div>';
    } else {
        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');

            itemEl.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <!-- Price Removed -->
                </div>
                <div class="remove-item" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </div>
            `;

            cartItemsContainer.appendChild(itemEl);
        });
    }

    // Total Hidden/Ignored - We do not update the total text since price is removed
}

function checkoutWhatsapp() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Hello, I want to order the following posters:\n\n";

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.title}\n`;
    });

    message += `\nPlease confirm my order.`;

    const phoneNumber = "9715556804"; // Replace with actual number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
}

/* MOBILE MENU LOGIC */
function toggleMenu() {
    const sidebar = document.getElementById('menuSidebar');
    const overlay = document.getElementById('menuOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

function toggleDropdown(element) {
    element.classList.toggle('active');
}

// Attach listener to menu icon if not using onclick in HTML
document.addEventListener('DOMContentLoaded', () => {
    const menuIcons = document.querySelectorAll('.menu-icon');
    menuIcons.forEach(icon => {
        icon.addEventListener('click', toggleMenu);
    });
});

/* CONTENT PROTECTION */
document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function (e) {
    if (e.keyCode == 123) { // F12
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { // Ctrl+Shift+I
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { // Ctrl+Shift+C
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { // Ctrl+Shift+J
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { // Ctrl+U
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) { // Ctrl+S
        return false;
    }
}

// Disable drag on images
document.addEventListener('dragstart', function (event) {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
    }
});