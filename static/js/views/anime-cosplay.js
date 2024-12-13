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




// Function to fetch and display products
function fetchAndDisplayProducts() {
    const category = 'Anime Cosplay'; // Default category

    fetch(`http://192.168.2.0/static/api/productsDisplay.php?categoryName=${category}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.data.length > 0) {
                const productData = data.data;
                totalProductsAnime = productData.length; // Update total products
                updatePaginationInfo(); // Update pagination text

                // Display products for the current page
                displayProducts(productData);
            } else {
                console.log('No products found or error in response');
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
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
