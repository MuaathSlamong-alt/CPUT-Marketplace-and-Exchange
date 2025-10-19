window.addEventListener('DOMContentLoaded', async () => {
    // API base: when using Live Server, set window.__API_BASE__ to your backend (e.g. 'http://localhost:3000')
    const API_BASE = window.__API_BASE__ || '';
    // Menu item click handlers
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // In a real app, this would filter products
            console.log('Filtering by:', this.textContent);
        });
    });

    // Fetch and render approved products dynamically
    const grid = document.querySelector('.products-grid');
    if (grid) {
        try {
            const res = await fetch(API_BASE + '/products');
            const products = await res.json();
            grid.innerHTML = '';
            products.forEach(product => {
                grid.innerHTML += `
                    <div class="product-card">
                        <div class="product-image-container">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                        </div>
                        <div class="product-price">R${product.price}</div>
                        <div class="product-name">${product.name}</div>
                    </div>
                `;
            });
        } catch (e) {
            grid.innerHTML = '<div style="color:red">Failed to load products.</div>';
        }
    }

    // Product card click handlers (after rendering)
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.product-card');
        if (card) {
            const name = card.querySelector('.product-name').textContent;
            console.log('Viewing product:', name);
        }
    });

    // Review button click handler
    const reviewBtn = document.querySelector('.review-us-btn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', function() {
            console.log('Review button clicked');
            // Would open a review modal or page
        });
    }
});