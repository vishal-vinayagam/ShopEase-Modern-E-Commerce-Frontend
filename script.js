document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Cart Toggle
    const cartIcon = document.getElementById('cartIcon');
    const cartDropdown = document.getElementById('cartDropdown');
    
    cartIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', function() {
        cartDropdown.style.display = 'none';
    });
    
    // Prevent cart from closing when clicking inside
    cartDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Product Data
    const products = [
        {
            id: 1,
            title: 'Wireless Headphones',
            category: 'electronics',
            price: 99.99,
            originalPrice: 129.99,
            rating: 4,
            image: 'images/Wireless Headphones.jpg',
            badge: 'Sale'
        },
        {
            id: 2,
            title: 'Men\'s Casual Shirt',
            category: 'men',
            price: 29.99,
            originalPrice: 39.99,
            rating: 5,
            image: 'images/Men\'s Casual Shirt.jpg',
            badge: 'Popular'
        },
        {
            id: 3,
            title: 'Women\'s Summer Dress',
            category: 'women',
            price: 49.99,
            originalPrice: 59.99,
            rating: 4,
            image: 'images/Women\'s Summer Dress.jpg',
            badge: 'New'
        },
        {
            id: 4,
            title: 'Smart Watch',
            category: 'electronics',
            price: 199.99,
            originalPrice: 249.99,
            rating: 5,
            image: 'images/Smart Watch.jpg',
            badge: 'Bestseller'
        },
        {
            id: 5,
            title: 'Men\'s Running Shoes',
            category: 'men',
            price: 79.99,
            originalPrice: 89.99,
            rating: 4,
            image: 'images/Men\'s Running Shoes.jpg',
            badge: null
        },
        {
            id: 6,
            title: 'Women\'s Handbag',
            category: 'women',
            price: 59.99,
            originalPrice: 79.99,
            rating: 3,
            image: 'images/Women\'s Handbag.jpg',
            badge: 'Sale'
        },
        {
            id: 7,
            title: 'Bluetooth Speaker',
            category: 'electronics',
            price: 69.99,
            originalPrice: 89.99,
            rating: 4,
            image: 'images/Bluetooth Speaker.jpg',
            badge: null
        },
        {
            id: 8,
            title: 'Men\'s Denim Jeans',
            category: 'men',
            price: 49.99,
            originalPrice: 59.99,
            rating: 5,
            image: 'images/Men\'s Denim Jeans.jpg',
            badge: null
        }
    ];
    
    // Display Products
    const productGrid = document.getElementById('productGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    function displayProducts(filter = 'all') {
        productGrid.innerHTML = '';
        
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(product => product.category === filter);
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            let badgeHTML = '';
            if (product.badge) {
                badgeHTML = `<span class="product-badge">${product.badge}</span>`;
            }
            
            const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
            
            productCard.innerHTML = `
                ${badgeHTML}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating">${stars}</div>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Add event listeners to new add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
    
    // Initialize with all products
    displayProducts();
    
    // Filter Products
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter products
            const filter = this.getAttribute('data-filter');
            displayProducts(filter);
        });
    });
    
    // Shopping Cart Functionality
    let cart = [];
    
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification(`${product.title} added to cart`);
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }
    
    function updateCart() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.getElementById('cartTotal');
        
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    <p class="cart-item-price">$${itemTotal.toFixed(2)}</p>
                    <p class="cart-item-remove" data-id="${item.id}">Remove</p>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
        
        // Update total
        cartTotal.textContent = total.toFixed(2);
    }
    
    // Notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonials[index].classList.add('active');
    }
    
    prevBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    nextBtn.addEventListener('click', function() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Form Submission
    const newsletterForm = document.getElementById('newsletterForm');
    const contactForm = document.getElementById('contactForm');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        // Here you would typically send this to your server
        console.log('Subscribed email:', email);
        showNotification('Thanks for subscribing!');
        this.reset();
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the form data to your server
        console.log('Form submitted');
        showNotification('Your message has been sent!');
        this.reset();
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                nav.classList.remove('active');
            }
        });
    });
    
    // Add notification style to the DOM
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--primary-color);
            color: white;
            padding: 12px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(-50%) translateY(0);
        }
    `;
    document.head.appendChild(style);
});