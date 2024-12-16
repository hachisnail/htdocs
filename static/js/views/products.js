// Get the current URL
const currentUrl = window.location.href;
let productStock = 0;
// Use a regular expression to match the product ID
const regex = /\/products\/(\d+)/;
const match = currentUrl.match(regex);
var productId;
if (match) {
  productId = match[1]; // This will contain the "37"
  console.log(productId); // Output: 37
} else {
  console.log("Product ID not found.");
}

fetchProductDetails(productId);
function fetchProductDetails(productId) {
  // Construct the API URL with the ProductID as a query parameter
  const apiUrl = `/static/api/productDetails.php?ProductID=${productId}`;

  // Make the API call
  fetch(apiUrl)
    .then(response => response.json())
    .then(({ status, data }) => {
      if (status === "success") {
        const screen = document.getElementById("loadingscreen");
        screen.classList.add("hidden");
        const { Name, Price, Details, Images, Stock } = data;
        productStock = Stock;
        const imageUrl = Images.split(",");
        document.getElementById("prodName").textContent = Name;
        document.getElementById("prodPrice").textContent = Price;
        document.getElementById("prodDets").textContent = Details || "No description available";
        document.getElementById("prodStock").textContent = Stock;
        const imgs = document.querySelectorAll('[id^="prodImg"]');
        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          if (i < imageUrl.length) {
            img.src = `/static/assets/productsImages/${imageUrl[i]}`;
          } else {
            img.src = `/static/assets/no image.png`;
          }
        }
        // Add event listeners to product images
        imgs.forEach(img => img.addEventListener('click', () => openImageGallery(`/static/assets/productsImages/${img.src.split('/').pop()}`)));
      } else {
        console.error("Error fetching product details:", data.message);
      }
    })
    .catch(error => console.error("API request failed:", error));
}

// Function to open the modal and display the clicked image
function openImageGallery(imageUrl) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  modal.style.display = "flex"; // Show the modal
  modalImage.src = imageUrl; // Set the source of the image in the modal
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.style.display = "none"; // Hide the modal
}

// Close modal when the user clicks on the close button
document.getElementById("closeModal").addEventListener("click", closeModal);

// Close modal when clicking outside the image
document
  .getElementById("imageModal")
  .addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  });

// Variable to store the selected size and item count
let selectedSize = "";
let itemCountProd = 0;

// Toggle the active size button
function toggleSizeButton(sizeId) {
  // Get all size buttons
  const sizeButtons = document.querySelectorAll(
    'button[id^="XXS"], button[id^="XS"], button[id^="S"], button[id^="M"], button[id^="L"], button[id^="3XL"], button[id^="4XL"]'
  );

  // Reset all buttons to normal state
  sizeButtons.forEach((button) => {
    if (button.id === sizeId) {
      // Set the selected button to the active state
      button.classList.add("bg-[#080226]", "text-white");
      button.classList.remove("bg-[#D9D9D9]", "text-[#626262]");
    } else {
      // Reset button to normal state
      button.classList.add("bg-[#D9D9D9]", "text-[#626262]");
      button.classList.remove("bg-[#080226]", "text-white");
    }
  });

  // Store the selected size
  selectedSize = sizeId;
}

// Update item count based on button clicks
async function updateItemCountProd(increment) {
  if (increment) {
    if (itemCountProd < productStock) {
      itemCountProd++; // Increase count if below the maximum limit
    } else {
      // Optional: Show a message or alert if the limit is reached
      const confirmation = await createConfirmationModal(
        "Total stock limit reached",
        "Alert!",
        2
      );
      if (!confirmation) return; //
    }
  } else {
    if (itemCountProd > 0) itemCountProd--; // Decrease count, but don't go below 0
  }

  // Update the item count display
  document.getElementById("itemCountProd").innerText = itemCountProd;
}


// Create the confirmation modal function
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

// Function to set a cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration date
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

// Function to get a cookie by name
function getCookie(name) {
  const cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    const cookie = cookieArr[i].trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

// Function to delete a cookie
function deleteCookie(name) {
  setCookie(name, '', -1);
}


// Add to Bag function
async function addToBag() {
  if (!selectedSize) {
    const confirmation = await createConfirmationModal(
      "Please select a size before adding to bag",
      "Size Selection",
      2
    );
    if (!confirmation) return; // If user clicks 'Ok' to acknowledge the message, proceed
  }

  // Get the item ID (for simplicity, we use the productId here)
  const itemId = productId;

  // Get the price from the element with ID "prodPrice"
  const price = parseFloat(document.getElementById("prodPrice").textContent);

  // Check if the price is valid
  if (isNaN(price)) {
    const confirmation = await createConfirmationModal(
      "Invalid price value",
      "Error",
      2
    );
    if (!confirmation) return; // If user clicks 'Ok' to acknowledge the message, proceed
  }

  // Get the image cover from the element with ID "prodImg0"
  const imgSrc = document.getElementById("prodImg0").src;
  const prodName = document.getElementById("prodName").textContent;
  const prodStock = document.getElementById("prodStock").textContent;
  // Create a new item object to store the selected size, item count, price, and image source
  const bagItem = {
    name: prodName,
    size: selectedSize,
    count: itemCountProd,
    id: itemId, // Using itemId as the ID (could be a unique product ID if needed)
    price: price, // Store the price of the item
    img: imgSrc, // Store the image source
    stock: prodStock
  };

  // Retrieve existing bag from cookies (or initialize an empty array if it doesn't exist)
  let bagItems = JSON.parse(getCookie("shoppingBag")) || [];

  // Check if the item already exists in the shopping bag
  const existingItemIndex = bagItems.findIndex(
    (item) => item.id === itemId && item.size === selectedSize
  );

  if (existingItemIndex !== -1) {
    // If the item exists, update the count
    bagItems[existingItemIndex].count += itemCountProd;
  } else {
    // If the item does not exist, add it to the array
    bagItems.push(bagItem);
  }

  // Store the updated shopping bag array in cookies
  setCookie("shoppingBag", JSON.stringify(bagItems), 7); // Cookie expires in 7 days

  // Display a confirmation modal for the addition
  const confirmation = await createConfirmationModal(
    `Added ${itemCountProd} items of size ${selectedSize} to your bag`,
    "Item Added",
    2
  );
  if (!confirmation) return; // If user clicks 'Ok', proceed with reset

  // Log the shopping bag contents to the console
  console.log("Shopping Bag Contents:", bagItems);

  // Reset the values after adding the item
  selectedSize = null; // Reset selected size
  itemCountProd = 0; // Reset item count

  // Optionally, update the UI (you can clear the selected size button or item count display)
  document.getElementById("itemCountProd").textContent = itemCountProd; // Reset item count display
  document
    .querySelectorAll(
      'button[id^="xx"], button[id^="x"], button[id^="small"], button[id^="medium"], button[id^="large"], button[id^="3xl"], button[id^="4xl"]'
    )
    .forEach((button) => {
      button.classList.remove("bg-[#080226]", "text-white"); // Remove active hover background and text color
      button.classList.add("bg-[#D9D9D9]", "text-[#626262]");
      
    }); // Remove active size button styles (reset)
}

// Event Listeners
document
  .querySelectorAll(
    'button[id^="XXS"], button[id^="XS"], button[id^="S"], button[id^="M"], button[id^="L"], button[id^="3XL"], button[id^="4XL"]'
  )
  .forEach((button) => {
    button.addEventListener("click", (e) => {
      toggleSizeButton(e.target.id);
    });
  });

document
  .getElementById("itemAdd")
  .addEventListener("click", () => updateItemCountProd(true)); // Increase item count
document
  .getElementById("itemDec")
  .addEventListener("click", () => updateItemCountProd(false)); // Decrease item count
document.getElementById("addBag").addEventListener("click", addToBag); // Add to bag


