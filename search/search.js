
const API_BASE = globalThis.__API_BASE__ || '';
const sidebarSearchInput = document.getElementById('sidebarSearchInput');
const sidebarSearchButton = document.getElementById('sidebarSearchButton');
const searchResults = document.getElementById('searchResults');

async function renderProducts(products) {
    if (!searchResults) return;
    searchResults.innerHTML = '';
    products.forEach(product => {
        searchResults.innerHTML += `
            <div class="product-card" data-product-id="${product.id}" data-seller-id="${product.seller_id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-price">R${product.price}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-seller">Seller: ${product.seller_username}</div>
                <div class="product-actions"><a href="../chat/chat.html?to=${product.seller_id}">Message seller</a></div>
            </div>
        `;
    });
}

async function fetchAndRenderProducts(q = '') {
    try {
        const url = q ? `${API_BASE}/products?q=${encodeURIComponent(q)}` : `${API_BASE}/products`;
        const res = await fetch(url);
        const products = await res.json();
        await renderProducts(products);
    } catch (e) {
        if (searchResults) searchResults.innerHTML = '<div style="color:red">Failed to load products.</div>';
    }
}

// Initial load
fetchAndRenderProducts();

// Sidebar search event
if (sidebarSearchButton && sidebarSearchInput) {
    sidebarSearchButton.onclick = () => {
        const q = sidebarSearchInput.value.trim();
        fetchAndRenderProducts(q);
    };
    sidebarSearchInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const q = sidebarSearchInput.value.trim();
            fetchAndRenderProducts(q);
        }
    };
}

