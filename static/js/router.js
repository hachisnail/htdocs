function checkLoginStatus() {
  const username = getCookie("username");
  if (username) {
      // User is logged in, update the global flag
      loggedIn = true;
      console.log("User is logged in as " + username);
  } else {
      // User is not logged in, so you can redirect them to login page
      console.log("User is not logged in");
  }
}


const router = new Navigo("/", { hash: true });

// Function to load a page dynamically
async function loadPage(view, id = null) {
  // Remove any existing scripts for views
  const existingScripts = document.querySelectorAll(`script[data-view]`);
  existingScripts.forEach((script) => script.remove());

  // Fetch the view HTML (without caching)
  try {
    const response = await fetch(`/static/views/${view}.html`);
    if (response.ok) {
      const htmlContent = await response.text();
      document.getElementById("shopContent").innerHTML = htmlContent;

      if (view === "products" && id) {
        loadProductDetails(id);
        resetURL(`/products/${id}`);
      } else {
        resetURL(`/${view}`);
      }
    } else {
      throw new Error(`${view}.html not found`);
    }
  } catch (error) {
    console.error(`${view} failed to load:`, error);
    load404Page();
  }

  // Dynamically load the corresponding script
  fetch(`/static/js/views/${view}.js`, { method: 'POST' })
    .then((response) => {
      if (response.ok) {
        const script = document.createElement("script");
        script.src = `/static/js/views/${view}.js`;
        script.dataset.view = view;
        script.onload = () => console.log(`${view}.js loaded successfully.`);
        script.onerror = () => console.error(`${view}.js failed to load.`);
        document.body.appendChild(script);
      } else {
        console.warn(`${view}.js not found.`);
      }
    });
}

// Function to reset the URL
function resetURL(path) {
  getCurrentLocation();
  history.replaceState(null, "", path);
  router.resolve(); // Ensure the router re-evaluates the current route
}

// Function to load the 404 page
function load404Page() {
  fetch(`/static/views/404.html`)
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`404.html not found`);
      }
    })
    .then((htmlContent) => {
      document.getElementById("shopContent").innerHTML = htmlContent;
    })
    .catch((error) => {
      console.error(`Failed to load 404.html:`, error);
    });
}

// Function to load product details
function loadProductDetails(id) {
  console.log("Product with ID:" + id + " has been loaded.");
  // Example for API fetching (optional to implement):
  // fetch(`/api/products/${id}`)
  //   .then(response => response.json())
  //   .then(product => {
  //     const productContainer = document.getElementById('productDetails');
  //     productContainer.innerHTML = ` 
  //       <h1>${product.name}</h1>
  //       <img src="${product.image}" alt="${product.name}" />
  //       <p>${product.description}</p>
  //       <p>Price: $${product.price}</p>
  //     `;
  //   })
  //   .catch(error => console.error("Failed to load product details:", error));
}

// Function to toggle footer visibility based on the route
function getCurrentLocation() {
  const currentPath = window.location.hash
    ? window.location.hash.replace("#", "")
    : window.location.pathname;

  const footerBanner = document.getElementById("footerBanner");
  if (!footerBanner) return;

  const routesWithoutFooter = new Set(["/account", "/orders"]);
  footerBanner.classList.toggle("hidden", routesWithoutFooter.has(currentPath));
}

// Define routes
router.on({
  "/": () => loadPage("home"),
  "/home": () => loadPage("home"),
  "/anime-cosplay": () => loadPage("anime-cosplay"),
  "/movie-cosplay": () => loadPage("movie-cosplay"),
  "/game-cosplay": () => loadPage("game-cosplay"),
  "/checkout": () => loadPage("checkout"),
  "/account": () => loadPage("account"),
  "/orders": () => loadPage("orders"),
  "/products/:id": ({ data }) => {
    if (data && data.id) {
     
      loadPage("products", data.id);
    } else {
      console.error("ID not found in route data");
      load404Page();
    }
  },
});

// Handle not found routes
router.notFound(() => load404Page());

// Resolve the router
router.resolve();






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

  // Function to set cookies
  function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
  }

  // Function to generate the shopping bag modal dynamically
  function generateShoppingBagModal() {
  // Retrieve bag items from cookies
  let bagItems = JSON.parse(getCookie("shoppingBag")) || [];

  // Calculate total price
  let totalPrice = 0;
  bagItems.forEach(item => {
      totalPrice += item.price * item.count;
  });

  // Create modal content
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

                          <div class="w-fit ml-2 h-[89px] flex flex-col justify-start">
                              <!-- prod info -->
                              <p class="font-[700] text-[16px] text-[#080226]">${item.name}</p>
                              <p class="text-[12px] text-[#828282] font-[400]">Size: <span class="font-[500] text-[#080226]">${item.size}</span></p>
                              <div class="h-full w-fit flex flex-col justify-end">
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

  // Inject the modal into the body or specific container
  document.body.insertAdjacentHTML('beforeend', modalContent);

  // Make the modal visible
  document.getElementById("shoppingBag").classList.remove("hidden");
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

  // Function to update item count
  function updateItemCount(index, increase) {
  let bagItems = JSON.parse(getCookie("shoppingBag")) || [];

  if (increase) {
      bagItems[index].count += 1;
  } else if (bagItems[index].count > 1) {
      bagItems[index].count -= 1;
  }

  // Update the shopping bag in cookies
  setCookie("shoppingBag", JSON.stringify(bagItems), 7);

  // Re-render the modal with updated data
  document.getElementById("shoppingBag").remove();
  generateShoppingBagModal();
  }



  

// Function to create a login cookie with Base64 encoding
function createLoginCookie(username, email) {
    // Base64 encode the username and email to make the cookie value unreadable
    const encodedUsername = btoa(username);  // Base64 encode username
    const encodedEmail = btoa(email);        // Base64 encode email

    // Set cookies with the encoded values (username and email)
    document.cookie = `username=${encodedUsername}; path=/; max-age=86400`; // 1 day expiry
    document.cookie = `email=${encodedEmail}; path=/; max-age=86400`; // 1 day expiry
}

// Function to decode Base64 encoded cookies
function decodeCookie(cookieValue) {
    try {
        return atob(cookieValue);  // Base64 decode the cookie value
    } catch (e) {
        return null;  // Return null if decoding fails
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

// Example of checking if the user is logged in when the page loads


// Call checkLoginStatus when the page loads to verify login status
window.onload = checkLoginStatus;

// Function to log the user out
function logout() {
    // Clear the cookies
    document.cookie = "username=; path=/; max-age=0";  // Remove the username cookie
    document.cookie = "email=; path=/; max-age=0";     // Remove the email cookie
    document.cookie = "shoppingBag=; path=/; max-age=0"; 
    // Set the loggedIn flag to false
    loggedIn = false;

    // Redirect user to login page or update UI based on logout
    window.location.href = '/home';  // This will refresh the page and reset the state
}

// Example logout button click event
//document.getElementById("logoutBtn").addEventListener("click", logout);











document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('contentAdmin');
  const messageDiv = document.getElementById('message');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const username = document.getElementById('username').value.trim();
          const password = document.getElementById('password').value.trim();

          if (!username || !password) {
              messageDiv.textContent = 'Please enter both username and password.';
              return;
          }

          try {
              const response = await fetch(`/static/api/adminLogin.php`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password }),
                  credentials: 'include' // Include cookies in the request
              });

              const result = await response.json();

              if (result.status === 'success') {
                  messageDiv.textContent = result.message;
                  messageDiv.style.color = 'green';
                  setTimeout(() => {
                      window.location.href = '/admin/admin.html';
                  }, 1000);
              } else {
                  messageDiv.textContent = result.message;
                  messageDiv.style.color = 'red';
              }
          } catch (error) {
              console.error('Error during login:', error);
              messageDiv.textContent = 'An error occurred. Please try again later.';
              messageDiv.style.color = 'red';
          }
      });
  }
});
