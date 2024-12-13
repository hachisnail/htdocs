function getStockColor(stock) {
    if (stock <= 0) {
        return '#FF0000'; // Red for out of stock
    } else if (stock > 0 && stock <= 50) {
        return '#FFFF00'; // Yellow for low stock
    } else {
        return '#01FF48'; // Green for in stock
    }
}


// Function to handle sorting and category change
function handleDropdownChange() {
    const sortValue = document.getElementById('sortProducts').value; // Get the selected sorting option
    const categoryValue = document.getElementById('sortAnime').value; // Get the selected category
    const searchQuery = document.getElementById('searchBar1').value; // Get the current search query
    loadProducts(searchQuery, categoryValue, sortValue); // Pass search, category, and sort options to loadProducts
}

// Modify the loadProducts function to handle both category and sorting
function loadProducts(searchQuery = '', category = '', sortOption = '') {
    // Build the query string dynamically with filters and sorting
    const queryParams = [];
    if (searchQuery) queryParams.push(`searchTerm=${encodeURIComponent(searchQuery)}`);
    if (category) queryParams.push(`categoryName=${encodeURIComponent(category)}`);
    if (sortOption) queryParams.push(`sort=${encodeURIComponent(sortOption)}`);
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    // Fetch the products data from the API with the filters and sorting option
    fetch(`http://192.168.2.0/static/api/productsDisplay.php${queryString}`)
        .then(response => response.json()) // Parse the JSON response
        .then(response => {
            if (response.status === "success" && Array.isArray(response.data)) {
                const productsTable = document.getElementById('productsTable');
                productsTable.innerHTML = ''; // Clear the existing product cards before adding new ones

                // Sort the products based on the selected sorting option
                let sortedProducts = [...response.data]; // Create a copy of the data to sort
                if (sortOption) {
                    switch (sortOption) {
                        case 'priceHigh':
                            sortedProducts.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price)); // Price: High to Low
                            break;
                        case 'priceLow':
                            sortedProducts.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price)); // Price: Low to High
                            break;
                        case 'stockHigh':
                            sortedProducts.sort((a, b) => b.Stock - a.Stock); // Stock: High to Low
                            break;
                        case 'stockLow':
                            sortedProducts.sort((a, b) => a.Stock - b.Stock); // Stock: Low to High
                            break;
                        case 'nameAZ':
                            sortedProducts.sort((a, b) => a.ProductName.localeCompare(b.ProductName)); // Name: A to Z
                            break;
                        case 'nameZA':
                            sortedProducts.sort((a, b) => b.ProductName.localeCompare(a.ProductName)); // Name: Z to A
                            break;
                    }
                }

                // Loop through the sorted products and create HTML for each
                sortedProducts.forEach(product => {
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
                    <div class="w-full h-fit justify-between flex items-center gap-x-2 md:gap-x-0">
                                <div class="flex w-fit md:w-[290px]  items-center gap-x-1 md:gap-x-4">
                                    <div class="w-10 h-10 md:w-[120px] md:h-[77px] rounded-[10px] bg-[#D9D9D9]">
                                        <img src="/static/assets/productsImages/${firstImage}" alt="${product.ProductName}" class="w-full h-full object-cover rounded-[10px]">
                                    </div>
                                    <div class="w-20 md:w-full h-fit flex flex-col leading-tight">
                                        <p class="text-black text-[10px] md:w-[195px] truncate  md:text-[15px]  font-[700]">${product.ProductName}</p>
                                        <p class="text-[#828282] text-[8px] md:w-[195px] truncate md:text-[12px] font-[600]">${categoryName}</p> 
                                        <p class="text-[#C83E71] text-[8px] md:w-[195px] truncate  md:text-[12px] font-[600]">₱<span>${product.Price}</span></p>
                                    </div>
                                </div>
                                <div class="w-fit md:full h-12 md:h-20 flex flex-col justify-start items-end">
                                    <svg onclick="openContext(${product.ProductID})" class="w-5 h-auto cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                        <g fill="currentColor">
                                            <path d="M240 96v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16V96a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16" opacity="0.2"/>
                                            <path d="M140 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12m56-12a12 12 0 1 0 12 12a12 12 0 0 0-12-12m-136 0a12 12 0 1 0 12 12a12 12 0 0 0-12-12"/>
                                        </g>
                                    </svg>
                                    <div id="${product.ProductID}" class="hidden w-[64px] h-[100px] relative flex flex-col top-0  items-center  z-50 ">
                                        <button onclick="handleEvent('Delete','${product.ProductID}')" class="bg-[#080226] hover:bg-[#eb6b72] text-white w-full px-1 py-1  flex justify-start   md:text-[13px] text-[10px] font-[500]">
                                            Delete
                                        </button>
                                        <div class="w-[95%] h-[1px]  bg-[#cccccc]"></div>
                                        <button onclick="handleEvent('Edit','${product.ProductID}')" class="bg-[#080226] hover:bg-[#eb6b72] text-white w-full px-1 py-1 focus:outline-none flex justify-start  md:text-[13px] text-[10px] font-[500]">
                                            Edit
                                        </button>
                                        <div class="w-[95%] h-[1px] bg-[#cccccc]"></div>
                                        <button onclick="openContext(${product.ProductID})" class="bg-[#080226] hover:bg-[#eb6b72] text-white w-full px-1 py-1 flex justify-start   md:text-[13px] text-[10px] font-[500]">
                                            Cancel
                                        </button>
                                    </div>
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
                    productsTable.appendChild(productCard);
                });
            }
        });
}

// Attach event listeners to both dropdowns
document.getElementById('sortProducts').addEventListener('change', handleDropdownChange);
document.getElementById('sortAnime').addEventListener('change', handleDropdownChange);


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

function openContext(id){
    const menu = document.getElementById(id);

    menu.classList.toggle("hidden");
}

async function handleEvent(type, id){
    switch(type){
        case "Delete":
            //alert("edit for "+id +" triggered");
            const isConfirmed = await createConfirmationModal("Are you sure you want to delete this item?");
            if (isConfirmed) {
                //console.log(`Item with ID ${id} will be deleted.`);
                deleteProduct(id)

            } else {
                console.log(`Deletion canceled for ID ${id}.`);
            }
            openContext(id);
        break;
        case "Edit":
            //alert("edit for "+id +" triggered");
            openContext(id);
        break;

    }
}

function deleteProduct(productId) {
    

    // Send the delete request
    fetch('http://192.168.2.0/static/api/deletePeoduct.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }), // Pass the ID in the request body
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            //alert(data.message); // Show success message
            // Optionally, refresh the product list or remove the product from the UI
            loadProducts(); // Reload products (assuming you have a function to do this)
        } else {
            //alert(data.message); // Show error message
        }
    })
    .catch(error => {
        console.error('Error:', error);
        //alert('An error occurred while trying to delete the product.');
    });
}

function toggleDropdown(id) {
    const dropdownMenu = document.getElementById(id);
    //console.log(id);
    if(id=="dropdownMenu"){
      const arrowIcon = document.getElementById("arrowIcon");
      
      dropdownMenu.classList.toggle("hidden");

      if (dropdownMenu.classList.contains("hidden")) {
          arrowIcon.style.transform = "rotate(0deg)";
      } else {
          arrowIcon.style.transform = "rotate(180deg)";
      }
    
    }
    else{
      dropdownMenu.classList.toggle("hidden");
    }
  }

  

  async function logout() {
    const isConfirmed = await createConfirmationModal("Are you sure you want to logout?");
    
    if (isConfirmed) {
      // Make a request to the logout PHP script
      fetch('http://192.168.2.0/static/api/adminLogout.php', {
        method: 'GET', // Assuming logout is a simple GET request
      })
      .then(response => {
        if (response.ok) {
          // If the logout was successful, handle the redirection
          return response.text(); // Assuming PHP returns a message on success
        } else {
          throw new Error('Logout failed');
        }
      })
      .then(async data => {
        window.location.href = '/home';// Change to your login page path

      })
      .catch(error => {
        // Handle any errors during the logout process
        console.error('Logout error:', error);
        createConfirmationModal("Error logging out: " + error.message);
      });
    } else {
      console.log("Logout canceled");
    }
  }
  



// Create and append the modal to the document body
function createConfirmationModal(message) {
    return new Promise((resolve) => {
        // Create the modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

        // Modal content
        modalContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-md w-96 p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Confirmation</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <div class="flex justify-end gap-4">
                    <button id="cancelButton" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button id="confirmButton" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Confirm</button>
                </div>
            </div>
        `;

        // Append the modal to the body
        document.body.appendChild(modalContainer);

        // Add event listeners for buttons
        const cancelButton = modalContainer.querySelector('#cancelButton');
        const confirmButton = modalContainer.querySelector('#confirmButton');

        cancelButton.addEventListener('click', () => {
            resolve(false); // Return false when canceled
            document.body.removeChild(modalContainer); // Remove the modal
        });

        confirmButton.addEventListener('click', () => {
            resolve(true); // Return true when confirmed
            document.body.removeChild(modalContainer); // Remove the modal
        });
    });
}