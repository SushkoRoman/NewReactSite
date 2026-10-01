

document.addEventListener('DOMContentLoaded', () => {
    

    const productsDB = [
        { id: 1, title: "Крісло Royal Velvet", price: 5600, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600" },
        { id: 2, title: "Диван Scandi Gray", price: 15900, image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600" },
        { id: 3, title: "Торшер Industrial", price: 2400, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8_i5JocbuGtvOWY2U8bGwqFr6x6mIDjNgFQ&s" },
        { id: 4, title: "Стіл Oak Wood", price: 8900, image: "https://drevych.ua/image/cache/catalog/table/%D0%9C%D0%B0%D0%BB%D1%96%20%D0%B7%20%D0%B2%D0%BE%D1%82%D0%B5%D1%80%D0%BC%D0%B0%D1%80%D0%BA%D0%B0%D0%BC%D0%B8%20%D1%81%D1%82%D0%BE%D0%BB%D0%B8/U%20shyrokolamelnyy%20rustik/AND_1947-800x534.22281521014.jpg" },
        { id: 5, title: "Ліжко King Size", price: 22000, image: "https://m.matrason.ua/uploaded/Content_foto/blog_foto/queen-size-bed-2.jpg" },
        { id: 6, title: "Ваза Ceramic Art", price: 1200, image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600" }
    ];

    let cart = JSON.parse(localStorage.getItem('superFurnCart')) || [];
    let currentUser = localStorage.getItem('superFurnUser') || null;

    
    const productsContainer = document.getElementById('products-container');
    const authContainer = document.getElementById('auth-container');
    const cartCountElement = document.getElementById('cart-count');
    
    
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsWrapper = document.getElementById('cart-items-wrapper');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

 
    const paymentModal = document.getElementById('payment-modal');
    const closePaymentBtn = document.getElementById('close-payment');
    const paymentForm = document.getElementById('payment-form');
    const finalPriceEl = document.getElementById('final-price');

  
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const closeLoginBtn = document.querySelector('#login-modal .close-modal');

    
    function renderProducts() {
        if (!productsContainer) return;
        productsContainer.innerHTML = productsDB.map(product => `
            <div class="product-card">
                <div class="card-img"><img src="${product.image}" alt="${product.title}"></div>
                <div class="card-info">
                    <h3 class="card-title">${product.title}</h3>
                    <span class="card-price">${formatPrice(product.price)}</span>
                    <button class="main-btn full-width js-buy-btn" data-id="${product.id}">
                        ${isInCart(product.id) ? 'У кошику' : 'У кошик'}
                    </button>
                </div>
            </div>
        `).join('');
        
       
        document.querySelectorAll('.js-buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const product = productsDB.find(p => p.id === id);
                addToCart(product, btn);
            });
        });
    }

   

  
    function openCart() {
        renderCartItems(); 
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsWrapper.innerHTML = '<p class="empty-cart-msg" style="text-align:center; margin-top:50px; color:#999;">Ваш кошик порожній :(</p>';
            cartTotalPrice.innerText = '0 ₴';
            return;
        }

        let total = 0;
        cartItemsWrapper.innerHTML = cart.map((item, index) => {
            total += item.price;
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-details">
                        <h4>${item.title}</h4>
                        <div class="item-price">${formatPrice(item.price)}</div>
                        <button class="remove-item" onclick="removeItem(${index})">Видалити</button>
                    </div>
                </div>
            `;
        }).join('');

        cartTotalPrice.innerText = formatPrice(total);
        finalPriceEl.innerText = formatPrice(total); 
    }

   
    window.removeItem = function(index) {
        cart.splice(index, 1); 
        localStorage.setItem('superFurnCart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
        renderProducts();
    }

    function addToCart(product, btnElement) {
        if (!currentUser) {
            alert("❗ Увійдіть, щоб купувати!");
            loginModal.classList.add('active');
            return;
        }
        if (isInCart(product.id)) {
            openCart();
            return;
        }

        cart.push(product);
        localStorage.setItem('superFurnCart', JSON.stringify(cart));
        
        updateCartCount();
        btnElement.innerText = "У кошику";
        btnElement.style.backgroundColor = "#2c2c2c";
        
        openCart();
    }

    function isInCart(id) {
        return cart.some(item => item.id === id);
    }

    function updateCartCount() {
        if(cartCountElement) cartCountElement.innerText = cart.length;
    }

    
    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0) {
            alert("Кошик порожній!");
            return;
        }
        closeCart();
        setTimeout(() => {
            paymentModal.classList.add('active');
        }, 300);
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        
        const payBtn = paymentForm.querySelector('button[type="submit"]');
        const oldText = payBtn.innerText;
        payBtn.innerText = "Обробка...";
        payBtn.disabled = true;

        setTimeout(() => {
            alert(`✅ Дякуємо, ${currentUser}! Оплата пройшла успішно.\nМенеджер зв'яжеться з вами для доставки.`);
            
            
            cart = [];
            localStorage.setItem('superFurnCart', JSON.stringify(cart));
            updateCartCount();
            renderProducts();
            
            paymentModal.classList.remove('active');
            payBtn.innerText = oldText;
            payBtn.disabled = false;
            paymentForm.reset();
        }, 2000);
    });

   
    function updateAuthUI() {
        if (currentUser) {
            authContainer.innerHTML = `
                <span style="font-size:0.9rem; margin-right:10px;"><b>${currentUser}</b></span>
                <button id="logout-btn" class="auth-btn" style="border-color:red; color:red;">Вийти</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
                if(confirm("Вийти?")) {
                    currentUser = null;
                    localStorage.removeItem('superFurnUser');
                    updateAuthUI();
                    cart = []; 
                    updateCartCount();
                    renderProducts();
                }
            });
        } else {
            authContainer.innerHTML = `<button id="login-open" class="auth-btn">Вхід</button>`;
            document.getElementById('login-open').addEventListener('click', () => loginModal.classList.add('active'));
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if(email) {
            currentUser = email.split('@')[0];
            localStorage.setItem('superFurnUser', currentUser);
            updateAuthUI();
            loginModal.classList.remove('active');
        }
    });

   
    
    
    if(cartBtn) cartBtn.addEventListener('click', openCart);
    
    
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCart);

    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            paymentModal.classList.remove('active');
            loginModal.classList.remove('active');
        });
    });

    
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₴";
    }

    
    renderProducts();
    updateAuthUI();
    updateCartCount();
});