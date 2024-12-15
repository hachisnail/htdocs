function toggleFilter(filter, arrow) {
    const dropdownMenu = document.getElementById(filter); const arrowIcon = document.getElementById(arrow); dropdownMenu.classList.toggle("hidden");

    if (dropdownMenu.classList.contains("hidden")) {
        arrowIcon.style.transform = "rotate(0deg)";
    } else {
        arrowIcon.style.transform = "rotate(180deg)";
    }
}

function hide() {
    const menu = document.getElementById("filters");

    menu.classList.toggle("hidden");
}

function toggleFilters() {
    const menu = document.getElementById("filters");

    menu.classList.toggle("hidden");
    if (menu.classList.contains("hidden")) {
        document.removeEventListener("click", closeMenuOutsideClick);
    } else {
        document.addEventListener("click", closeMenuOutsideClick);
    }

}

function closeMenuOutsideClick(event) {
    const filter = document.getElementById("filters");
    const content = document.getElementById("content");

    if (filter.contains(event.target) && !content.contains(event.target)) {
        filter.classList.add("hidden");
        document.removeEventListener("click", closeMenuOutsideClick);
    }
}

if (typeof currentPageAnime === 'undefined') {
    var currentPageAnime = 1; // Track the current page
}
if (typeof productsPerPageAnime === 'undefined') {
    var productsPerPageAnime = 6; // Number of products to display per page
}
if (typeof totalProductsAnime === 'undefined') {
    var totalProductsAnime = 0; // Total number of products
}


// Declare a variable to store the timeout ID

// Event listener for the input field (search bar)
document.getElementById('animeSearchBar').addEventListener('input', function() {
    // Clear the previous timeout (if any)
    let searchTimeout;
    clearTimeout(searchTimeout);

    // Set a new timeout to trigger the search after 500ms of no typing
    searchTimeout = setTimeout(() => {
        const searchTerm = this.value.trim();
        const sortOption = document.getElementById('sortAnime').value; // Get the selected sort option

        // Fetch and display products based on the search term and selected sort option
        fetchAndDisplayProducts(searchTerm, sortOption);
    }, 500); // 500ms delay after user stops typing
});

// Event listener for the sort dropdown
document.getElementById('sortAnime').addEventListener('change', function() {
    const searchTerm = document.getElementById('animeSearchBar').value.trim(); // Get current search term
    const sortOption = this.value; // Get selected sort option

    // Fetch and display products based on the search term and selected sort option
    fetchAndDisplayProducts(searchTerm, sortOption);
});

function fetchAndDisplayProducts(searchTerm = '', sortOption = '') {
    const category = 'Anime Cosplay'; // Default category
    const url = new URL('/static/api/productsDisplay.php', window.location.origin);

    // Build the query parameters with category, search term
    url.searchParams.append('categoryName', category);
    if (searchTerm) url.searchParams.append('searchTerm', searchTerm);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.data.length > 0) {
                let productData = data.data;

                // Sort the product data based on the selected sort option
                if (sortOption) {
                    productData = sortProducts(productData, sortOption);
                }

                totalProductsAnime = productData.length; // Update total products
                updatePaginationInfo(); // Update pagination text

                // Display products for the current page
                displayProducts(productData);
            } else {
                console.log('No products found or error in response');
                displayNoResultsMessage();
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Function to sort products based on the selected sort option
function sortProducts(products, sortOption) {
    switch (sortOption) {
        case 'priceHigh':
            return products.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
        case 'priceLow':
            return products.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
        case 'stockHigh':
            return products.sort((a, b) => b.Stock - a.Stock);
        case 'stockLow':
            return products.sort((a, b) => a.Stock - b.Stock);
        case 'nameAZ':
            return products.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
        case 'nameXS':
            return products.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
        default:
            return products; // Return the original order if no sort is selected
    }
}

function displayNoResultsMessage() {
    const animeTable = document.getElementById("animeTable");
    animeTable.innerHTML = '<p class="text-center text-gray-500">No products found.</p>';
}

// Function to display products for the current page
function displayProducts(productData) {
    const animeTable = document.getElementById("animeTable");
    animeTable.innerHTML = ''; // Clear existing products

    const startIndex = (currentPageAnime - 1) * productsPerPageAnime;
    const endIndex = Math.min(startIndex + productsPerPageAnime, productData.length);

    const visibleProducts = productData.slice(startIndex, endIndex);

    visibleProducts.forEach(product => {
        const productCard = createProductCard(product);
        animeTable.appendChild(productCard);
    });
}

// Function to create a product card element
function createProductCard(product) {
    const imagesArray = product.Images ? product.Images.split(',') : [];
    const imageUrl = imagesArray.length > 0 ? imagesArray[0] : '';

    const anchor = document.createElement('a');
    anchor.href = `/products/${product.ProductID}`;
    anchor.setAttribute('data-navigo', '');

    const cardHTML = `
        <div class="flex flex-col justify-center">
            <div class="w-[158px] h-[142px] md:w-[250px] md:h-[237px] rounded-[20px] bg-[#D9D9D9] overflow-hidden">
                <img src="/static/assets/productsImages/${imageUrl}" class="w-full h-full object-cover">
            </div>
            <p class="font-[600] truncate w-[158px] md:w-[250px] text-[12px]">${product.ProductName}</p>
            <p class="text-[#C83E71] truncate w-[158px] md:w-[250px] font-[600] text-[14px]">₱<span>${product.Price}</span></p>
        </div>
    `;

    anchor.innerHTML = cardHTML;
    return anchor;
}


// Function to update pagination text
function updatePaginationInfo() {
    const prodRange = document.getElementById("prodRange");
    const prodTotal = document.getElementById("prodTotal");

    const start = (currentPageAnime - 1) * productsPerPageAnime + 1;
    const end = Math.min(currentPageAnime * productsPerPageAnime, totalProductsAnime);

    prodRange.textContent = `${start}-${end}`;
    prodTotal.textContent = totalProductsAnime;
}

// Event listeners for Next and Previous buttons
document.querySelector(".previous-btn").addEventListener("click", () => {
    if (currentPageAnime > 1) {
        currentPageAnime--;
        fetchAndDisplayProducts();
    }
});

document.querySelector(".next-btn").addEventListener("click", () => {
    if (currentPageAnime * productsPerPageAnime < totalProductsAnime) {
        currentPageAnime++;
        fetchAndDisplayProducts();
    }
});

// Call the function to fetch and display products
fetchAndDisplayProducts();
