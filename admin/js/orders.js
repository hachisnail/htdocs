
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



async function fetchOrders() {
    try {
        // Fetch data from the backend
        const response = await fetch('/static/api/getOrders.php');
        const orders = await response.json();

        // Target the order table div
        const orderTable = document.getElementById('orderTable');
        orderTable.innerHTML = ''; // Clear existing data

        // Check if there are orders
        if (orders.length > 0) {
            orders.forEach(order => {
                // Format createdAt and total
                const createdAt = new Date(order.CreatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                const total = parseFloat(order.Total).toFixed(2);

                // Create a new row for each order
                const orderRow = `
                    <a class="w-full h-fit" href="/admin/orderDetails.html?OrderId=${order.OrderID}"> 
                    <div class="w-full h-fit flex border-black border-opacity-15 border-solid border-t-[2px] border-b-[2px] py-3">
                        <div class="basis-[20%] h-[20px] flex justify-center items-center">
                            <p class="text-black text-[13px] font-[500] truncate text-center">${order.OrderID}</p>
                        </div>
                        <div class="basis-[20%] h-[20px] flex justify-center items-center">
                            <p class="text-black text-[13px] font-[500] truncate text-center">${createdAt}</p>
                        </div>
                        <div class="basis-[20%] h-[20px] flex justify-center items-center">
                            <p class="text-black text-[13px] font-[500] truncate text-center">${order.Name}</p>
                        </div>
                        <div class="basis-[20%] h-[20px] flex justify-center items-center">
                            <p class="text-black text-[13px] font-[500] truncate text-center">${total}</p>
                        </div>
                        <div class="basis-[20%] h-[20px] flex justify-center items-center">
                            <p class="text-black text-[13px] font-[500] truncate text-center">${order.Status}</p>
                        </div>
                    </div>
                </a>
                `;
                // Append the row to the table
                orderTable.innerHTML += orderRow;
            });
        } else {
            orderTable.innerHTML = '<p class="text-center text-gray-500">No orders available.</p>';
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        document.getElementById('orderTable').innerHTML = '<p class="text-center text-red-500">Failed to load orders.</p>';
    }
}

// Fetch orders when the page loads
document.addEventListener('DOMContentLoaded', fetchOrders);
fetchOrders();



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
  