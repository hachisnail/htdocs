// Get the current URL
const currentUrl = window.location.href;

// Use a regular expression to match the product ID
const regex = /\/products\/(\d+)/;
const match = currentUrl.match(regex);
var productId;
if (match) {
  productId = match[1]; // This will contain the "37"
  console.log(productId);  // Output: 37
} else {
  console.log('Product ID not found.');
}

fetchProductDetails(productId);

function fetchProductDetails(productId) {
    // Construct the API URL with the ProductID as a query parameter
    const apiUrl = `http://192.168.2.0/static/api/productDetails.php?ProductID=${productId}`;
  
    // Make the API call
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          const product = data.data;
          console.log("Product details:", product);

          // Destructure the product data
          const { Name, Price, Details, Images } = product;

          // Split the images into an array
          const imageUrl = Images.split(',');

          // Update the DOM with product data
          document.getElementById('prodName').textContent = Name;
          document.getElementById('prodPrice').textContent = Price;
          document.getElementById('prodDets').textContent = Details || "No description available";

          // Populate the product images
          for (let i = 0; i < imageUrl.length; i++) {
            const imgElement = document.getElementById(`prodImg${i}`);
            if (imgElement) {
              imgElement.src = `/static/assets/productsImages/${imageUrl[i]}`;
            }
          }

          // Event listeners for product images (moved here inside the function)
          for (let i = 0; i < imageUrl.length; i++) {
            const imgElement = document.getElementById(`prodImg${i}`);
            if (imgElement) {
              imgElement.addEventListener('click', function() {
                openImageGallery(`/static/assets/productsImages/${imageUrl[i]}`);
              });
            }
          }

        } else {
          console.error("Error fetching product details:", data.message);
        }
      })
      .catch(error => {
        console.error("API request failed:", error);
      });
}

// Function to open the modal and display the clicked image
function openImageGallery(imageUrl) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = 'flex'; // Show the modal
    modalImage.src = imageUrl; // Set the source of the image in the modal
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none'; // Hide the modal
}

// Close modal when the user clicks on the close button
document.getElementById('closeModal').addEventListener('click', closeModal);

// Close modal when clicking outside the image
document.getElementById('imageModal').addEventListener('click', function(event) {
    if (event.target === event.currentTarget) {
        closeModal();
    }
});
