let salesChart; // Declare salesChart globally to maintain the reference

async function fetchSalesData(timePeriod) {
  try {
      // Fetch the data from the PHP API
      const response = await fetch('/static/api/adminTopSelling.php');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const products = await response.json();

      // Prepare the sales data for the chart
      const salesData = {
          months: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 },
          weeks: [0, 0, 0, 0, 0, 0, 0, 0], // Assuming 7 weeks in the last 7 days for simplicity
          year: 0 // Yearly sales will be aggregated
      };

      // Loop through the products to map sales data by month, week, or year
      products.forEach(product => {
          const lastSoldAt = new Date(product.LastSoldAt);
          const sales = product.Sales;
          
          // Check which time period to aggregate the data for
          if (timePeriod === 'M') { // Monthly
              const month = lastSoldAt.toLocaleString('default', { month: 'short' });
              salesData.months[month] += sales;
          } else if (timePeriod === 'W') { // Weekly (using lastSoldAt)
              const week = Math.floor((lastSoldAt.getDate() - 1) / 7); // Approximate week number
              salesData.weeks[week] += sales;
          } else if (timePeriod === 'Y') { // Yearly
              salesData.year += sales;
          }
      });

      return salesData;
  } catch (error) {
      console.error('Error loading sales data:', error);
      return null;
  }
}

async function updateChartData(timePeriod) {
  // Fetch data for the selected time period
  const salesData = await fetchSalesData(timePeriod);
  if (!salesData) return;

  let labels, data;

  if (timePeriod === 'M') { // Monthly
      labels = Object.keys(salesData.months); // ['Jan', 'Feb', ...]
      data = Object.values(salesData.months); // [sales for Jan, Feb, ...]
  } else if (timePeriod === 'W') { // Weekly
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
      data = salesData.weeks;
  } else if (timePeriod === 'Y') { // Yearly
      labels = ['Year'];
      data = [salesData.year];
  }

  // If salesChart has been initialized, update the chart
  if (salesChart) {
      salesChart.data.labels = labels;
      salesChart.data.datasets[0].data = data;
      salesChart.update();
  } else {
      // Initialize the chart if it doesn't exist
      const ctx = document.getElementById('salesChart').getContext('2d');
      salesChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: [{
                  label: 'Sales',
                  data: data,
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  borderWidth: 2,
                  tension: 0.4,
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: { display: false }
              },
              scales: {
                  x: {
                      grid: { display: false },
                      ticks: { color: '#6b7280' },
                  },
                  y: {
                      grid: { color: '#e5e7eb' },
                      ticks: { color: '#6b7280' },
                  },
              },
          },
      });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the chart with monthly data by default
  updateChartData('M');

  // Event listeners for the time period buttons
  document.querySelectorAll('.timePeriodButton').forEach(button => {
    button.addEventListener('click', (e) => {
      const timePeriod = e.target.dataset.timePeriod; // 'M', 'W', or 'Y'
      updateChartData(timePeriod);

      // Remove active class and reset styles for all buttons
      document.querySelectorAll('.timePeriodButton').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white'); // Remove active class
        btn.classList.add('text-gray-700', 'bg-white', 'border-gray-300'); // Reset to inactive state
      });

      // Add active class to the clicked button
      e.target.classList.add('bg-blue-600', 'text-white'); // Active state: blue bg, white text
      e.target.classList.remove('text-gray-700', 'bg-white', 'border-gray-300'); // Remove inactive state
    });
  });
});


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
    
    //jhasvfjavhk
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
      const response = await fetch('/static/api/getOrdersDash.php');
      const orders = await response.json();

      // Target the order table div
      const orderTable = document.getElementById('orderTableHead');
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

async function loadTopSellingProducts() {
  try {
      // Fetch the data from the API
      const response = await fetch('/static/api/adminTopSelling.php');
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const products = await response.json();

      // Get the container for the products
      const topSellingContainer = document.getElementById('topSelling');

      // Clear existing content (if any)
      topSellingContainer.innerHTML = '';

      // Loop through the products and create HTML elements
      products.forEach(product => {
          const productElement = `
              <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                      <!-- Product Image -->
                      <div class="w-[69px] h-[69px] rounded overflow-hidden bg-gray-300">
                          <img 
                              src="/static/assets/productsImages/${product.Image}" 
                              alt="${product.Name}" 
                              class="w-full h-full object-cover"
                          />
                      </div>
                      <!-- Product Details -->
                      <div>
                          <p class="font-semibold">${product.Name}</p>
                          <p class="text-gray-500">₱${parseFloat(product.Price).toLocaleString()}</p>
                      </div>
                  </div>
                  <!-- Product Price and Sales -->
                  <div class="text-right">
                      <p class="text-pink-500 font-semibold">₱${parseFloat(product.Price).toLocaleString()}</p>
                      <p class="text-gray-500 text-sm">${product.Sales} Sales</p>
                  </div>
              </div>
          `;
          // Append the product element to the container
          topSellingContainer.insertAdjacentHTML('beforeend', productElement);
      });
  } catch (error) {
      console.error('Error loading top-selling products:', error);
      const topSellingContainer = document.getElementById('topSelling');
      topSellingContainer.innerHTML = `<p class="text-red-500">Failed to load products.</p>`;
  }
}


document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Fetch data from the PHP API
    const response = await fetch('/static/api/adminDashboard.php'); // Adjust the path to your PHP file
    const data = await response.json();

    // Populate the HTML elements with the fetched data
    document.getElementById('totalGuest').textContent = data.totalGuests;
    document.getElementById('totalCustomers').textContent = data.totalCustomers;
    document.getElementById('totalOrders').textContent = data.totalOrders;
    document.getElementById('totalProducts').textContent = data.totalProducts;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Load products when the page is ready
document.addEventListener('DOMContentLoaded', loadTopSellingProducts);


// Fetch orders when the page loads
document.addEventListener('DOMContentLoaded', fetchOrders);
fetchOrders();


