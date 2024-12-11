function getStockColor(stock) {
    if (stock <= 0) {
        return '#FF0000'; // Red for out of stock
    } else if (stock > 0 && stock <= 50) {
        return '#FFFF00'; // Yellow for low stock
    } else {
        return '#01FF48'; // Green for in stock
    }
}



// Function to fetch products from the API and append them to the productsTable
function loadProducts(searchQuery = '', category = '') {
    // Build the query string dynamically
    const queryParams = [];
    if (searchQuery) queryParams.push(`searchTerm=${encodeURIComponent(searchQuery)}`);
    if (category) queryParams.push(`categoryName=${encodeURIComponent(category)}`);
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    // Fetch the products data from the API with the filters
    fetch(`http://192.168.2.0/static/api/adminProductsDisplay.php${queryString}`)
        .then(response => response.json()) // Parse the JSON response
        .then(response => {
            // Check if the response is successful and contains data
            if (response.status === "success" && Array.isArray(response.data)) {
                const productsTable = document.getElementById('productsTable');
                productsTable.innerHTML = ''; // Clear the existing product cards before adding new ones

                // Loop through the products and create HTML for each product
                response.data.forEach(product => {
                    const categoryName = product.CategoryName || 'Unknown Category'; // Use CategoryName from the response
                
                    // Handle images properly
                    const productImages = product.Images ? product.Images.split(',') : [];
                    const firstImage = productImages.length > 0 ? productImages[0] : ''; // Use the first image for preview
                
                    // Create the product card
                    const productCard = document.createElement('div');
                    productCard.classList.add(
                        'rounded-[20px]',
                        'w-[190px]',
                        'md:w-[385px]',
                        'h-fit',
                        'flex',
                        'flex-col',
                        'bg-white',
                        'shadow-md',
                        'p-2',
                        'gap-y-2',
                        'md:p-4'
                    );
                
                    productCard.innerHTML = `
                        <div class="w-full h-fit justify-between flex items-center gap-x-2">
                            <div class="flex items-center gap-x-1 md:gap-x-4">
                                <div class="w-10 h-10 md:w-[77px] md:h-[77px] rounded-[10px] bg-[#D9D9D9]">
                                    <img src="/static/assets/productsImages/${firstImage}" alt="${product.ProductName}" class="w-full h-full object-cover rounded-[10px]">
                                </div>
                                <div class="w-fit h-fit flex flex-col leading-tight">
                                    <p class="text-black text-[10px] md:text-[15px] font-[700]">${product.ProductName}</p>
                                    <p class="text-[#828282] text-[8px] md:text-[12px] font-[600]">${categoryName}</p> 
                                    <p class="text-[#C83E71] text-[8px] md:text-[12px] font-[600]">${product.Price}</p>
                                </div>
                            </div>
                            <div class="w-fit h-12 md:h-20 flex flex-col justify-start">
                                <svg class="w-5 h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                    <g fill="currentColor">
                                        <path d="M240 96v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16V96a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16" opacity="0.2"/>
                                        <path d="M140 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12m56-12a12 12 0 1 0 12 12a12 12 0 0 0-12-12m-136 0a12 12 0 1 0 12 12a12 12 0 0 0-12-12"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div class="p-2 w-full h-fit flex flex-col items-center rounded-[10px] border-[2px] border-solid border-[#D9D9D9]">
                            <div class="w-full h-fit flex justify-between items-center">
                                <p class="text-[8px] md:text-[13px] font-[400]">Sales</p>
                                <div class="w-fit h-fit flex gap-x-2">
                                    <svg class="w-3 fill-[#FF8A01]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="m13 5.586l-4.707 4.707a.999.999 0 1 0 1.414 1.414L12 9.414V17a1 1 0 1 0 2 0V9.414l2.293 2.293a.997.997 0 0 0 1.414 0a1 1 0 0 0 0-1.414z"/>
                                    </svg>
                                    <p class="text-[#828282] md:text-[13px] text-[8px] font-[600]">${product.Sales}</p>
                                </div>
                            </div>
                            <div class="w-full h-[2px] bg-[#D9D9D9] my-2"></div>
                            <div class="w-full h-fit flex justify-between items-center">
                                <p class="text-[8px] md:text-[13px] font-[400]">Remaining Stocks</p>
                                <div class="w-fit h-fit items-center flex gap-x-2">
                                    <div class="w-3 h-1" style="background-color: ${getStockColor(product.Stock)};"></div>
                                    <p class="text-[#828282] md:text-[13px] text-[8px] font-[600]">${product.Stock}</p>
                                </div>
                            </div>
                        </div>
                    `;
                
                    // Append the product card to the productsTable
                    productsTable.appendChild(productCard);
                });
            } else {
                console.error("No products data found or invalid response structure.");
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Debounce function to limit the number of function calls
let debounceTimeout;
function debounceSearch(event) {
    const searchQuery = event.target.value;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const category = document.getElementById('sortAnime').value;
        loadProducts(searchQuery, category); // Fetch products based on search query and category filter
    }, 500); // Wait for 500ms after the user stops typing
}

// Function to clear search inputs when switching views
function clearSearchInputs() {
    const searchBar1 = document.getElementById('searchBar1');
    const mobileSearchBar = document.getElementById('mobileSearchBar');
    
    // Clear both search inputs
    searchBar1.value = '';
    mobileSearchBar.value = '';
    
    // Reload all products (no search filter)
    loadProducts();
}

// Call the function to load products on page load (without any filter)
window.onload = function() {
    loadProducts(); // Load all products initially
};

// Add event listener for both desktop and mobile search inputs with debouncing
document.getElementById('searchBar1').addEventListener('input', debounceSearch);
document.getElementById('mobileSearchBar').addEventListener('input', debounceSearch);

// Add event listener for category filter dropdown change
document.getElementById('sortAnime').addEventListener('change', function() {
    const searchQuery = document.getElementById('searchBar1').value; // Get current search value
    const category = this.value; // Get selected category from dropdown
    loadProducts(searchQuery, category); // Fetch products based on search and category
});
