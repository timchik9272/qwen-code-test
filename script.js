// Product data
const products = [
    {
        id: 1,
        title: "Creality Ender 3 V2",
        category: "fdm",
        price: 25990,
        description: "Популярный FDM принтер для начинающих и энтузиастов. Отличное соотношение цены и качества.",
        specs: {
            area: "220x220x250 мм",
            layer: "0.1-0.4 мм"
        },
        icon: "fa-cube"
    },
    {
        id: 2,
        title: "Anycubic Photon Mono X",
        category: "sla",
        price: 42990,
        description: "Высокоточный SLA принтер с 4K экраном для создания детализированных моделей.",
        specs: {
            area: "192x120x245 мм",
            layer: "0.01-0.2 мм"
        },
        icon: "fa-gem"
    },
    {
        id: 3,
        title: "Prusa i3 MK3S+",
        category: "fdm",
        price: 89990,
        description: "Профессиональный FDM принтер с автоматической калибровкой и высочайшей надежностью.",
        specs: {
            area: "250x210x210 мм",
            layer: "0.05-0.35 мм"
        },
        icon: "fa-print"
    },
    {
        id: 4,
        title: "Formlabs Form 3",
        category: "professional",
        price: 349990,
        description: "Профессиональный SLA принтер для стоматологии, ювелирного дела и инженерии.",
        specs: {
            area: "145x145x185 мм",
            layer: "0.025-0.1 мм"
        },
        icon: "fa-microchip"
    },
    {
        id: 5,
        title: "Ultimaker S3",
        category: "professional",
        price: 459990,
        description: "Двухэкструдерный профессиональный принтер для бизнеса и образования.",
        specs: {
            area: "230x190x200 мм",
            layer: "0.15-0.4 мм"
        },
        icon: "fa-layer-group"
    },
    {
        id: 6,
        title: "Elegoo Mars 3 Pro",
        category: "sla",
        price: 32990,
        description: "Компактный фотополимерный принтер с 4K разрешением для домашнего использования.",
        specs: {
            area: "143x89x175 мм",
            layer: "0.01-0.2 мм"
        },
        icon: "fa-box"
    },
    {
        id: 7,
        title: "Flashforge Creator Pro 2",
        category: "fdm",
        price: 64990,
        description: "Надежный двухэкструдерный принтер закрытого типа для печати ABS и PLA.",
        specs: {
            area: "200x148x150 мм",
            layer: "0.1-0.4 мм"
        },
        icon: "fa-cubes"
    },
    {
        id: 8,
        title: "Raise3D Pro2 Plus",
        category: "professional",
        price: 549990,
        description: "Промышленный 3D принтер с большим объемом печати и высокой точностью.",
        specs: {
            area: "305x305x605 мм",
            layer: "0.05-0.35 мм"
        },
        icon: "fa-industry"
    }
];

// Cart state
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const orderSummary = document.getElementById('orderSummary');
const successModal = document.getElementById('successModal');
const closeSuccess = document.getElementById('closeSuccess');
const contactForm = document.getElementById('contactForm');
const filterTabs = document.querySelectorAll('.filter-tab');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts('all');
    updateCartCount();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadProducts(tab.dataset.filter);
        });
    });

    // Cart modal
    cartBtn.addEventListener('click', () => {
        renderCart();
        cartModal.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Checkout modal
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста');
            return;
        }
        cartModal.classList.remove('active');
        renderOrderSummary();
        checkoutModal.classList.add('active');
    });

    closeCheckout.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });

    // Success modal
    closeSuccess.addEventListener('click', () => {
        successModal.classList.remove('active');
        cart = [];
        updateCartCount();
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
        if (e.target === checkoutModal) checkoutModal.classList.remove('active');
        if (e.target === successModal) successModal.classList.remove('active');
    });

    // Checkout form submit
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        checkoutModal.classList.remove('active');
        successModal.classList.add('active');
    });

    // Contact form submit
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        contactForm.reset();
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Load and render products
function loadProducts(filter) {
    let filteredProducts = products;
    
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-specs">
                    <span><i class="fas fa-ruler-combined"></i> ${product.specs.area}</span>
                    <span><i class="fas fa-layer-group"></i> ${product.specs.layer}</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get category name in Russian
function getCategoryName(category) {
    const categories = {
        fdm: 'FDM принтер',
        sla: 'SLA принтер',
        professional: 'Профессиональный'
    };
    return categories[category] || category;
}

// Format price
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        
        // Show animation
        const btn = event.target.closest('.add-to-cart');
        btn.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        btn.style.background = '#10b981';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> В корзину';
            btn.style.background = '';
        }, 1500);
    }
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Render cart
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        cartTotal.textContent = '0 ₽';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatPrice(total);
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

// Render order summary
function renderOrderSummary() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    orderSummary.innerHTML = `
        <h4 style="margin-bottom: 10px;">Ваш заказ:</h4>
        ${cart.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px;">
                <span>${item.title}</span>
                <span>${formatPrice(item.price)}</span>
            </div>
        `).join('')}
        <div style="border-top: 1px solid #e2e8f0; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: 600;">
            <span>Итого:</span>
            <span>${formatPrice(total)}</span>
        </div>
    `;
}
