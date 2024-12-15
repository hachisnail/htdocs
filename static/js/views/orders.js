
function initializeOrder() {
    const allButton = document.getElementById("allButton");
    if (allButton) {
        allButton.classList.add("border-b-[5px]", "border-[#EB6B72]");
    }

    const allTable = document.querySelector(".allTable");
    if (allTable) {
        allTable.classList.remove("hidden");
    }
}



function handleTabClick(tabId) {
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(button => {
        button.classList.remove("border-b-[5px]", "border-[#EB6B72]");
    });

    document.getElementById(tabId).classList.add("border-b-[5px]", "border-[#EB6B72]");

    const tables = document.querySelectorAll(".allTable, .pndTable, .opTable, .compTable, .cnclTable");
    tables.forEach(table => {
        table.classList.add("hidden");
    });

    switch (tabId) {
        case "allButton":
            document.querySelector(".allTable").classList.remove("hidden");
            break;
        case "pendingButton":
            document.querySelector(".pndTable").classList.remove("hidden");
            break;
        case "processButton":
            document.querySelector(".opTable").classList.remove("hidden");
            break;
        case "completedButton":
            document.querySelector(".compTable").classList.remove("hidden");
            break;
        case "cancelledButton":
            document.querySelector(".cnclTable").classList.remove("hidden");
            break;
    }
}

// Function to get a cookie by name and decode its value

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            const cookieValue = c.substring(nameEQ.length, c.length);
            return decodeCookie(cookieValue);  // Decode before returning the cookie value
        }
    }
    return null;
}
async function loadOrders() {
    const encodedUsername = getCookie('username');
    const decodedUsername = atob(encodedUsername);
    try {
        // Fetch data from the API
        const response = await fetch(`/static/api/fetchOrders.php?username=${encodeURIComponent(decodedUsername)}`);

        // Check if response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`Failed to fetch orders. Status: ${response.status}`);
        }

        const data = await response.json();

        // Handle case where no orders are found
        if (data.message && data.message === "No orders found") {
            console.log('No orders found for this user');
            document.querySelector('.table-content').innerHTML = '<p class="error-message">No orders found.</p>';
            return; // Exit early if no orders are found
        }

        // Check if orders is present and is an array
        let orders = data.orders;

        // If orders is not an array, log the error and handle it
        if (!Array.isArray(orders)) {
            console.error('Expected orders array, but received:', data);
            throw new Error('Fetched data is not in the expected format');
        }

        console.log('Fetched orders:', orders); // Log the fetched data for debugging

        // Clear existing tables
        document.querySelectorAll('.table-content').forEach(table => {
            table.innerHTML = ''; // Clear previous table rows
        });

        // Map orders to their respective tables
        orders.forEach(order => {
            const orderTotal = order.items.reduce((total, item) => total + parseFloat(item.product_total_price), 0);

            // Create order card
            const orderCard = `
                <div class="pl-3 w-[395px] md:w-full pr-3 pb-3 pt-4 flex justify-between bg-white">
                    <!-- Product details -->
                    <div class="flex w-fit h-fit">
                        <div class="mt-2 rounded-[20px] bg-[#D9D9D9] w-[95px] h-[92px] md:w-[150px] md:h-[141px]">
                            <!-- Image placeholder -->
                            <img src="/static/assets/productsImages/${order.items[0].product_images || 'default_image.jpg'}" alt="${order.items[0].product_name}" class="w-full h-full object-cover rounded-[20px]" />
                        </div>
                        <div class="w-fit h-fit mt-3 pt-3 pb-2 px-2 flex flex-col">
                            <p class="text-[#080226] md:text-[16px] text-[13px] font-[600]">${order.items[0].product_name}</p>
                            <p class="text-[#828282] md:text-[12px] text-[8px] font-[400]">
                                Size: <span class="text-[#080226]">${order.items[0].product_size}</span>
                            </p>
                            <p class="text-[#828282] md:text-[12px] text-[8px] font-[400]">
                                Quantity: <span class="text-[#080226]">${order.items[0].quantity}</span>
                            </p>
                            <p class="text-[#C83E71] md:text-[24px] text-[18px] font-[600]">₱${order.items[0].product_price}</p>
                        </div>
                    </div>

                    <!-- Order status and actions -->
                    <div class="w-fit h-fit flex flex-col items-end">
                        <p class="mb-6 ${getStatusClass(order.status)} md:text-[15px] text-[12px] font-[600]">${order.status}</p>
                        <p class="text-black md:text-[12px] text-[8px] font-[700]">ORDER TOTAL</p>
                        <p class="mb-6 text-[#C83E71] md:text-[24px] text-[18px] font-[600]">₱${orderTotal.toFixed(2)}</p>
                        ${getActionButton(order.status, order.OrderID)}
                    </div>
                </div>
            `;

            // Append order card to the "all" table
            const allTable = document.getElementById('allTable');
            allTable.innerHTML += orderCard;

            // Also append order to its specific status table
            const statusTableId = mapStatusToTable(order.status);
            const statusTable = document.getElementById(statusTableId);
            statusTable.innerHTML += orderCard;
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        // Optionally display an error message to the user
        document.querySelector('.table-content').innerHTML = '<p class="error-message">An error occurred while fetching your orders. Please try again later.</p>';
    }
}

// Map order status to table ID
function mapStatusToTable(status) {
    switch (status.toUpperCase()) {
        case 'PENDING': return 'pendingTable';
        case 'PROCESSING': return 'onprocessTable';
        case 'CONFIRMED': return 'completedTable';
        case 'CANCELLED': return 'cancelledTable';
        default: return 'allTable';
    }
}

// Get CSS class for status text
function getStatusClass(status) {
    switch (status.toUpperCase()) {
        case 'PENDING': return 'text-[#FF8A01]';
        case 'PROCESSING': return 'text-[#4A69E2]';
        case 'CONFIRMED': return 'text-[#01FF48]';
        case 'CANCELLED': return 'text-[#FF0000]';
        default: return 'text-[#000]';
    }
}

// Get action button for each status
function getActionButton(status, orderId) {
    switch (status.toUpperCase()) {
        case 'PENDING':
            return `<button 
                        class="text-black md:text-[12px] text-[10px] font-[600] border-[1px] border-black border-solid px-10 md:px-12 py-2"
                        data-order-id="${orderId}" 
                        onclick="handleCancelOrder(${orderId})">
                        Cancel Order
                    </button>`;
        case 'PROCESSING':
            return `<button 
                        class="text-black md:text-[12px] text-[10px] font-[600] bg-[#EFE391] px-10 py-2"
                        data-order-id="${orderId}"
                        onclick="handleConfirmDelivery(${orderId})">
                        Confirm Delivery
                    </button>`;
        default:
            return ''; // No action button for COMPLETED or CANCELLED
    }
}


// Handle the Cancel Order action
async function handleConfirmDelivery(orderId) {
    // Show the custom confirmation modal
    const confirmed = await createConfirmationModal(
        'Are you sure you want to confirm the delivery of this order?',
        'Confirm Delivery',
        1 // Type 1 indicates a confirm/cancel modal
    );

    if (confirmed) {
        try {
            const response = await fetch(`/static/api/confirmDelivery.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: orderId }) // Send the order ID to confirm delivery
            });

            const result = await response.json();

            if (result.success) {
                // Notify the user about the delivery confirmation success
                await createConfirmationModal(
                    'Delivery has been confirmed successfully.',
                    'Delivery Confirmed',
                    2 // Type 2 indicates a simple confirmation message
                );
                loadOrders(); // Reload the orders to reflect the confirmation
            } else {
                // Notify the user about the confirmation failure
                await createConfirmationModal(
                    'Failed to confirm the delivery. Please try again.',
                    'Error',
                    2 // Type 2 indicates a simple confirmation message
                );
            }
        } catch (error) {
            console.error('Error confirming delivery:', error);
            await createConfirmationModal(
                'An error occurred while confirming the delivery.',
                'Error',
                2 // Type 2 indicates a simple confirmation message
            );
        }
    }
}



// Handle the Confirm Delivery action
async function handleCancelOrder(orderId) {
    // Show the custom confirmation modal
    const confirmed = await createConfirmationModal(
        'Are you sure you want to cancel this order?',
        'Cancel Order',
        1 // Type 1 indicates a confirm/cancel modal
    );

    if (confirmed) {
        try {
            const response = await fetch(`/static/api/cancelOrder.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: orderId }) // Send the order ID to cancel
            });

            const result = await response.json();
            if (result.success) {
                // Notify the user about the cancellation success
                await createConfirmationModal(
                    'Your order has been cancelled successfully.',
                    'Order Cancelled',
                    2 // Type 2 indicates a simple confirmation message
                );
                loadOrders(); // Reload the orders to reflect the cancellation
            } else {
                // Notify the user about the cancellation failure
                await createConfirmationModal(
                    'Failed to cancel the order. Please try again.',
                    'Error',
                    2 // Type 2 indicates a simple confirmation message
                );
            }
        } catch (error) {
            console.error('Error canceling order:', error);
            await createConfirmationModal(
                'An error occurred while canceling the order.',
                'Error',
                2 // Type 2 indicates a simple confirmation message
            );
        }
    }
}



// Initialize the orders when the page loads
loadOrders();



// Function to show or hide the shopping bag modal
function showBag() {
    let shoppingBagModal = document.getElementById("shoppingBag");

    if (!shoppingBagModal) {
        // If the modal doesn't exist, generate and show it
        generateShoppingBagModal();
    } else {
        // If the modal exists, remove it (hide and delete it from the DOM)
        shoppingBagModal.remove();
    }
}

// Function to get a cookie value by name
function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

// Function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

// Function to generate the shopping bag modal dynamically
function generateShoppingBagModal() {
    let bagItems = [];

    document.addEventListener('DOMContentLoaded', function () {
        const cookieValue = getCookie("shoppingBag");
        bagItems = [];

        if (cookieValue) {
            try {
                bagItems = JSON.parse(cookieValue) || [];
            } catch (error) {
                console.error("Failed to parse shopping bag cookie:", error);
            }
        }
    });

    const cookieValue = getCookie("shoppingBag");
    bagItems = [];
    if (cookieValue) {
        try {
            bagItems = JSON.parse(cookieValue) || [];
        } catch (error) {
            console.error("Failed to parse shopping bag cookie:", error);
        }
    }
    console.log(bagItems);

    let totalPrice = 0;
    bagItems.forEach(item => {
        totalPrice += item.price * item.count;
    });

    const modalContent = `
        <div id="shoppingBag"
            class="hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-50 flex items-end md:justify-end">
            <div id="content"
                class="w-full md:w-[24rem] relative h-[44rem] md:h-full bg-white md:rounded-l-[30px] md:rounded-tr-[0px] rounded-t-[30px] z-50 py-[30px] flex flex-col items-center">
                <div class="w-[90%] h-fit flex justify-between items-center">
                    <!-- Header -->
                    <p class="text-[20px] font-[700]">Shopping Bag</p>
                    <svg onclick="showBag()" class="hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z" />
                    </svg>
                </div>
                <div id="shoppingBagContent" class="w-[90%] h-[493px] md:h-[607px] overflow-y-auto my-2 flex flex-col gap-y-2">
                    <!-- Shopping bag content -->
                    ${bagItems.map((item, index) => `
                    <div class="rounded-[20px] p-2 w-full h-fit flex justify-between border-solid border-[2px] border-[#D9D9D9]">
                        <!-- product in bag -->
                        <div class="flex">
                            <div class="rounded-[20px] w-[83px] h-[89px] flex bg-[#D9D9D9]">
                                <img src="${item.img}" alt="Product Image" class="w-full h-full object-cover rounded-[20px]">
                            </div>
                            <div class="w-fit md:w-[115px] ml-2 h-[89px] flex flex-col justify-start">
                                <!-- prod info -->
                                <p class="font-[700] md:w-[115px] text-ellipsis overflow-hidden text-[16px] text-[#080226]">${item.name}</p>
                                <p class="text-[12px] text-[#828282] font-[400]">Size: <span class="font-[500] text-[#080226]">${item.size}</span></p>
                                <div class="h-[45px] w-fit flex flex-col justify-end">
                                    <p class="text-[#C83E71] text-[18px] font-[600]">₱${item.price}</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col items-end">
                            <div class="h-full w-full flex justify-end">
                                <svg onclick="removeItem(${index})" class="fill-[#FF0000] cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
                                </svg>
                            </div>
                            <div class="flex gap-x-6 px-3 py-1 rounded-[20px] bg-[#D9D9D9]">
                                <p class="text-[15px] font-[500] cursor-pointer" onclick="updateItemCount(${index}, false)">-</p>
                                <p class="text-[15px] font-[500]">${item.count}</p>
                                <p class="text-[15px] font-[500] cursor-pointer" onclick="updateItemCount(${index}, true)">+</p>
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
                <div class="w-[90%] flex flex-col items-center">
                    <!-- Footer -->
                    <div class="w-full h-[1px] bg-[#08022630] "></div>
                    <div class="w-full my-3 px-1 flex justify-between">
                        <p class="text-[25px] text-[#080226] font-[700]">Total</p>
                        <p id="totalPrice" class="text-[25px] text-[#C83E71] font-[600]">₱${totalPrice}</p>
                    </div>
                    <a class="w-full" href="/checkout" data-navigo>
                        <button class="w-full py-2 rounded-[20px] bg-[#EFE391] text-[18px] font-[500]">
                            Checkout
                        </button>
                    </a>
                </div>
            </div>
        </div>
    `;

    // Inject the modal into the body
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Make the modal visible
    document.getElementById("shoppingBag").classList.remove("hidden");
}

// Function to remove an item from the shopping bag (by index)
function removeItem(index) {
    let bagItems = JSON.parse(getCookie("shoppingBag")) || [];
    bagItems.splice(index, 1);
    setCookie("shoppingBag", JSON.stringify(bagItems), 7);
    document.getElementById("shoppingBag").remove();
    generateShoppingBagModal();
}


function updateItemCount(index, increase) {
    let bagItems = JSON.parse(getCookie("shoppingBag")) || [];
    const availableStock = bagItems[index].stock;  // Convert stock to an integer
    console.log(availableStock);
    if (availableStock > bagItems[index].count && increase) {
        bagItems[index].count += 1;

    }

    else if (bagItems[index].count <= 0 && !increase) {
        //bagItems[index].count = 0;
        removeItem(index);
    }
    else if ((availableStock >= bagItems[index].count && !increase)) {
        bagItems[index].count -= 1;
    }

    // Update the shopping bag in cookies
    setCookie("shoppingBag", JSON.stringify(bagItems), 7);

    // Re-render the modal with updated data
    document.getElementById("shoppingBag").remove();
    generateShoppingBagModal();
}





// Function to remove item from the bag (by index)
function removeItem(index) {
    // Get the current shopping bag items from cookies
    let bagItems = JSON.parse(getCookie("shoppingBag")) || [];

    // Remove the item from the array
    bagItems.splice(index, 1);

    // Update the shopping bag in cookies
    setCookie("shoppingBag", JSON.stringify(bagItems), 7);

    // Update the modal content (re-render the modal)
    document.getElementById("shoppingBag").remove();
    generateShoppingBagModal();
}





function user() {
    const username = getCookie("username");
    const email = getCookie("email");
    if (username) {
        const usernameC = document.getElementById("usernameAcc");
        const emailC = document.getElementById("emailAcc");
        usernameC.textContent = atob(username);
        emailC.textContent = atob(email);
        //console.log("User is logged in as " + username);
    } else {
        // User is not logged in, so you can redirect them to login page
        console.log("User is not logged in");
    }
}

user();

initializeOrder();



function createConfirmationModal(message, head, type) {
    return new Promise((resolve) => {
        // Create the modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

        if (type == 1) {
            // Modal content for confirmation
            modalContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-md w-96 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">${head}</h3>
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

        } else {
            // Modal content for just a confirmation message
            modalContainer.innerHTML = `
                <div class="bg-white rounded-lg shadow-md w-96 p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">${head}</h3>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <div class="flex justify-end gap-4">
                        <button id="confirmButton" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Ok</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalContainer);
            const confirmButton = modalContainer.querySelector('#confirmButton');

            confirmButton.addEventListener('click', () => {
                resolve(false); // Return false when canceled
                document.body.removeChild(modalContainer); // Remove the modal
            });
        }
    });
}
