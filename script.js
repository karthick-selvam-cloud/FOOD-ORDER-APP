document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginSection = document.getElementById('loginSection');
    const appSection = document.getElementById('appSection');
    const guestLoginBtn = document.getElementById('guestLoginBtn');
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const orderConfirmationModal = document.getElementById('orderConfirmationModal');
    const continueOrderingBtn = document.getElementById('continueOrderingBtn');
    const restaurantsList = document.getElementById('restaurantsList');

    // Sample food data
    const foodItems = [
        {
            id: 1,
            name: "Margherita Pizza",
            cuisine: "Italian",
            price: 12.99,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            name: "Cheeseburger",
            cuisine: "American",
            price: 8.99,
            rating: 4.2,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3,
            name: "Chicken Wings",
            cuisine: "American",
            price: 10.99,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 4,
            name: "Sushi Platter",
            cuisine: "Japanese",
            price: 18.99,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 5,
            name: "Caesar Salad",
            cuisine: "Mediterranean",
            price: 9.99,
            rating: 4.3,
            image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 6,
            name: "Chocolate Cake",
            cuisine: "Dessert",
            price: 6.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        }
    ];

    // Cart state
    let cart = [];

    // Initialize the app
    function init() {
        renderFoodItems();
        setupEventListeners();
    }

    // Render food items
    function renderFoodItems() {
        restaurantsList.innerHTML = '';
        
        foodItems.forEach(item => {
            const foodItemElement = document.createElement('div');
            foodItemElement.className = 'restaurant-card';
            foodItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="restaurant-img">
                <div class="restaurant-info">
                    <h3 class="restaurant-name">${item.name}</h3>
                    <p class="restaurant-cuisine">${item.cuisine}</p>
                    <div class="restaurant-footer">
                        <div class="restaurant-rating">
                            <i class="fas fa-star"></i>
                            <span>${item.rating}</span>
                        </div>
                        <span class="restaurant-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
                </div>
            `;
            
            restaurantsList.appendChild(foodItemElement);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Guest login
        guestLoginBtn.addEventListener('click', function() {
            const email = document.getElementById('email').value;
            loginAsGuest(email);
        });

        // Cart button
        cartBtn.addEventListener('click', openCartModal);

        // Close cart modal
        closeCartBtn.addEventListener('click', closeCartModal);

        // Checkout button
        checkoutBtn.addEventListener('click', openCheckoutModal);

        // Close checkout modal
        closeCheckoutBtn.addEventListener('click', closeCheckoutModal);

        // Place order button
        placeOrderBtn.addEventListener('click', placeOrder);

        // Continue ordering button
        continueOrderingBtn.addEventListener('click', continueOrdering);

        // Add to cart buttons (delegated event)
        restaurantsList.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                addToCart(itemId);
            }
        });

        // Remove item from cart (delegated event)
        cartItems.addEventListener('click', function(e) {
            if (e.target.classList.contains('cart-item-remove')) {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(itemId);
            }
        });
    }

    // Login as guest
    function loginAsGuest(email) {
        loginSection.style.display = 'none';
        appSection.style.display = 'block';
        
        if (email) {
            document.getElementById('deliveryLocation').textContent = `Deliver to ${email}`;
        }
    }

    // Add item to cart
    function addToCart(itemId) {
        const item = foodItems.find(i => i.id === itemId);
        
        if (item) {
            const existingItem = cart.find(i => i.id === itemId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...item,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Show a quick confirmation
            const addButton = document.querySelector(`.add-to-cart[data-id="${itemId}"]`);
            addButton.textContent = 'Added!';
            addButton.style.backgroundColor = '#4caf50';
            
            setTimeout(() => {
                addButton.textContent = 'Add to Cart';
                addButton.style.backgroundColor = '#ff6b6b';
            }, 1000);
        }
    }

    // Remove item from cart
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        updateCart();
    }

    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items list
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = '';
            
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div>
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="cart-item-controls">
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                
                cartItems.appendChild(cartItemElement);
            });
        }
        
        // Update cart total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Open cart modal
    function openCartModal() {
        cartModal.style.display = 'block';
    }

    // Close cart modal
    function closeCartModal() {
        cartModal.style.display = 'none';
    }

    // Open checkout modal
    function openCheckoutModal() {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items to proceed to checkout.');
            return;
        }
        
        // Update checkout total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
        
        closeCartModal();
        checkoutModal.style.display = 'block';
    }

    // Close checkout modal
    function closeCheckoutModal() {
        checkoutModal.style.display = 'none';
    }

    // Place order
    function placeOrder() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        
        if (!name || !phone || !address) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // In a real app, you would send this data to a server
        console.log('Order placed:', {
            customer: { name, phone, address },
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
        
        closeCheckoutModal();
        orderConfirmationModal.style.display = 'block';
    }

    // Continue ordering
    function continueOrdering() {
        orderConfirmationModal.style.display = 'none';
        cart = [];
        updateCart();
        
        // Clear form fields
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('address').value = '';
        document.getElementById('payment').value = 'cash';
    }

    // Initialize the app
    init();
});