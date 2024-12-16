
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Use the function to retrieve a specific parameter
window.onload = () => {
    const id = getQueryParam('OrderId');
    if (id) {
        fetchAndPopulateOrderDetails(id);
        // Add event listener for confirm order button
        const confirmOrderButton = document.getElementById('confirmOrderButton');
        if (confirmOrderButton) {
            confirmOrderButton.addEventListener('click', () => {
                confirmOrder(id);
            });
        }
    } else {
        console.log('No OrderId provided!');
    }
};

function fetchAndPopulateOrderDetails(orderId) {
    // Fetch data from the API using the provided orderId
    fetch(`/static/api/orderDetails.php?id=${orderId}`)
        .then(response => response.json())
        .then(data => {
            if (data.orders && data.orders.length > 0) {
                const order = data.orders[0]; // Assuming we have only one order

                // Populate Order ID and Status
                document.getElementById('orderId').textContent = order.OrderID;
                document.getElementById('orderStatus').textContent = order.status;
                document.getElementById('customer').textContent = order.name;
                // Populate Customer Info
                document.getElementById('name').textContent = order.customer_name;
                document.getElementById('city').textContent = order.city;
                document.getElementById('province').textContent = order.province;
                document.getElementById('zip').textContent = order.zipcode;
                document.getElementById('phone').textContent = order.phone;
                document.getElementById('notes').textContent = order.delivery_instructions;

                // Populate Products List
                const detailsTable = document.getElementById('detailsTable');
                const loadingscreen = document.getElementById('loadingscreen');
                loadingscreen.classList.add('hidden');
                order.items.forEach(item => {
                    const productRow = document.createElement('a');
                    productRow.classList.add('w-full', 'h-fit');
                    productRow.href = `#`;

                    const productRowDiv = document.createElement('div');
                    productRowDiv.classList.add('w-full', 'h-fit', 'flex', 'border-black', 'border-opacity-15', 'border-solid', 'border-t-[2px]', 'border-b-[2px]', 'py-3');

                    const productColumns = [
                        item.product_name, item.product_id, item.product_size, item.quantity, `P${item.product_total_price}`
                    ];

                    productColumns.forEach(text => {
                        const columnDiv = document.createElement('div');
                        columnDiv.classList.add('basis-[20%]', 'h-[20px]', 'flex', 'justify-center', 'items-center');
                        const p = document.createElement('p');
                        p.classList.add('text-black', 'text-[13px]', 'font-[500]', 'truncate', 'text-center');
                        p.textContent = text;
                        columnDiv.appendChild(p);
                        productRowDiv.appendChild(columnDiv);
                    });

                    productRow.appendChild(productRowDiv);
                    detailsTable.appendChild(productRow);
                });

                // Add the "Download Info" button event listener
                const downloadButton = document.getElementById('downloadButton');
                if (downloadButton) {
                    downloadButton.addEventListener('click', function () {
                        // Export the order details as a .txt file
                        exportOrderDetailsToTxt(order);
                    });
                }

            } else {
                //alert("No order data found for the provided order ID.");
            }
        })
        .catch(error => {
            console.error("Error fetching order data:", error);
            alert("Failed to load order details.");
        });
}

// Function to export order details as a .txt file
function exportOrderDetailsToTxt(order) {
    let textContent = `========================================\n`;
    textContent += `                RECEIPT\n`;
    textContent += `========================================\n\n`;

    textContent += `Order ID: ${order.OrderID}\n`;
    textContent += `Status: ${order.status}\n`;
    textContent += `----------------------------------------\n`;
    textContent += `Customer Info:\n`;
    textContent += `Name: ${order.customer_name}\n`;
    textContent += `Phone: ${order.phone}\n`;
    textContent += `City: ${order.city}, ${order.province} ${order.zipcode}\n`;
    textContent += `Delivery Instructions: ${order.delivery_instructions}\n`;
    textContent += `----------------------------------------\n\n`;

    // Ordered Products
    textContent += `Ordered Items:\n`;
    textContent += `----------------------------------------\n`;

    let totalPrice = 0; // Variable to accumulate total price
    order.items.forEach(item => {
        textContent += `Product: ${item.product_name}\n`;
        textContent += `ID: ${item.product_id}\n`;
        textContent += `Size: ${item.product_size}\n`;
        textContent += `Quantity: ${item.quantity}\n`;
        textContent += `Price: P${item.product_total_price}\n`;
        textContent += `----------------------------------------\n`;

        // Add the product total price to the overall total
        totalPrice += parseFloat(item.product_total_price); // Ensure the price is parsed as a number
    });

    // Add the total price to the text content
    textContent += `TOTAL: P${totalPrice.toFixed(2)}\n`;
    textContent += `========================================\n`;
    textContent += `Thank you for your purchase!\n`;
    textContent += `========================================\n`;

    // Create a Blob from the text content
    const blob = new Blob([textContent], { type: 'text/plain' });

    // Create an anchor element and trigger a download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `order_${order.OrderID}_receipt.txt`;
    a.click();
}

// Get the orderId from the URL (assuming it's a query parameter


function toggleBurgerMenu() {
    const menu = document.getElementById("burgerMenu");

    menu.classList.toggle("hidden");
    if (menu.classList.contains("hidden")) {
        document.removeEventListener("click", closeMenuOnOutsideClick);
    } else {
        document.addEventListener("click", closeMenuOnOutsideClick);
    }

}

function closeMenuOnOutsideClick(event) {
    const menu = document.getElementById("burgerMenu");
    const content = document.getElementById("content");

    if (menu.contains(event.target) && !content.contains(event.target)) {
        menu.classList.add("hidden");
        document.removeEventListener("click", closeMenuOnOutsideClick);
    }
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

  

  async function adminlogout() {
    const isConfirmed = await createConfirmationModal("Are you sure you want to logout?", "Logout!",1);
    
    if (isConfirmed) {
      document.cookie = "PHPSESSID=;Path=/cv;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.href = '/admin/admin.php'; 
      
    } else {
      console.log("Logout canceled");
    }
  }
  

  function confirmOrder(orderId) {
    // Create a confirmation modal before proceeding
    createConfirmationModal("Are you sure you want to confirm this order?")
        .then(isConfirmed => {
            if (isConfirmed) {
                // Sending a POST request to update the order status if confirmed
                const requestData = {
                    orderId: orderId,
                    newStatus: 'Processing'
                };

                console.log("Sending data:", requestData); // Log the data

                fetch(`/static/api/updateOrderStatus.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show a success confirmation modal
                        createConfirmationModal("Order has been confirmed and status updated to 'Processing'.")
                            .then(() => {
                                window.location='/admin/orders.html'; // Optionally, you can refresh the page or do other tasks
                            });
                    } else {
                        // Show a failure modal
                        createConfirmationModal("Failed to update order status.")
                            .then(() => {
                                // Handle failure (optional)
                            });
                    }
                })
                .catch(error => {
                    console.error("Error updating order status:", error);
                    // Show an error modal
                    createConfirmationModal("An error occurred while updating the order status.")
                        .then(() => {
                            // Handle error (optional)
                        });
                });
            } else {
                console.log("Order confirmation canceled");
            }
        });
}


function createConfirmationModal(message) {
    return new Promise((resolve) => {
      const modalContainer = document.createElement('div');
      modalContainer.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";
  
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
  
      document.body.appendChild(modalContainer);
  
      const cancelButton = modalContainer.querySelector('#cancelButton');
      const confirmButton = modalContainer.querySelector('#confirmButton');
  
      cancelButton.addEventListener('click', () => {
        resolve(false);
        document.body.removeChild(modalContainer);
      });
  
      confirmButton.addEventListener('click', () => {
        resolve(true);
        document.body.removeChild(modalContainer);
      });
    });
  }
  