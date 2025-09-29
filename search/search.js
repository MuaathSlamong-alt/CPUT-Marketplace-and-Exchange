const categories = [
    { name: "LAPTOPS", img: "images/laptops.jpg" },
    { name: "HAIR", img: "images/hair.jpg" },
    { name: "TEXTBOOKS", img: "images/textbooks.jpg" },
    { name: "CLOTHES", img: "images/clothes.jpg" },
    { name: "NAILS", img: "images/nails.jpg" },
    { name: "PHONES & TABLETS", img: "images/phones.jpg" },
    { name: "STATIONARY", img: "images/stationary.jpg" },
    { name: "GRADUATION ATTIRE", img: "images/graduation.jpg" },
    { name: "PHOTOSHOOT", img: "images/photoshoot.jpg" },
    { name: "GOODS", img: "images/goods.jpg" }
];

let currentPage = 1;
const totalPages = 6;
const itemsPerPage = 5;

const grid = document.getElementById('categoriesGrid');
const paginationText = document.getElementById('paginationText');

function renderCategories(page) {
    grid.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = categories.slice(start, end);

    pageItems.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
      <img src="${cat.img}" alt="${cat.name}"/>
      <span class="category-label">${cat.name}</span>
    `;
        div.addEventListener('click', () => {
            alert(`Opening ${cat.name} category...`);
        });
        grid.appendChild(div);
    });

    paginationText.innerHTML = "<<<<<<<<<<< <" + page + " of " + totalPages + "> >>>>>>>>>>>>";
}

document.getElementById('nextPageButton').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderCategories(currentPage);
    } else {
        alert('You are on the last page.');
    }
});

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    } else {
        alert('Please enter a search term.');
    }
});

document.getElementById('backButton').addEventListener('click', () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "index.html";
    }
});

document.getElementById('messageIcon').addEventListener('click', () => {
    window.location.href = "chat.html";
});

// Initial load
renderCategories(currentPage);
