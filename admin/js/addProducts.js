document.getElementById("dropzone-file").addEventListener("change", function(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById("preview-container");
    const modal = document.getElementById("fileLimitModal");
    const closeModalButton = document.getElementById("closeModalButton");

    // Clear previous previews
    previewContainer.innerHTML = '';

    // Limit to 4 files
    const fileLimit = 4;
    let filesToPreview = Array.from(files).slice(0, fileLimit); // Only preview the first 4 files

    const previewCont = document.getElementById("productImagePrev");

    // Check if filesToPreview is not empty
    if (filesToPreview.length > 0) {
        // Set the background image to the first file in the array
        const firstFile = filesToPreview[0];
        const fileUrl = URL.createObjectURL(firstFile); // Generate URL for the file

        // Set the background image style
        previewCont.style.backgroundImage = `url(${fileUrl})`;
        previewCont.style.backgroundSize = "cover";  // Optionally add other background styles
        previewCont.style.backgroundPosition = "center";
    }

    // Loop through the selected files (limited to 4)
    filesToPreview.forEach((file) => {
        const existingPreviews = previewContainer.getElementsByTagName("img");

        // Check if the image is already in the preview container
        let isDuplicate = false;
        Array.from(existingPreviews).forEach((img) => {
            if (img.alt === file.name) {
                isDuplicate = true;
            }
        });

        // Only proceed if it's not a duplicate
        if (!isDuplicate) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const fileUrl = e.target.result;

                const previewCard = document.createElement("div");
                previewCard.classList.add("border", "rounded-lg", "overflow-hidden", "shadow-md", "bg-white", "relative");

                const image = document.createElement("img");
                image.src = fileUrl;
                image.alt = file.name;
                image.classList.add("w-auto", "h-full");

                const fileName = document.createElement("p");
                fileName.textContent = file.name;
                fileName.classList.add("text-center", "p-2", "text-sm", "text-gray-700");

                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.classList.add("absolute", "top-2", "right-2", "px-3", "py-1", "bg-red-500", "text-white", "rounded-[5px]", "text-xs");

                // Store the file and its preview card in a closure
                removeButton.addEventListener("click", function() {
                    // Remove the file from the array
                    filesToPreview = filesToPreview.filter(f => f.name !== file.name);
                    const previewCont = document.getElementById("productImagePrev");
                    previewCont.style.backgroundImage = "none";
                    previewCont.style.backgroundSize = "initial";  // Optional, reset to initial state
                    previewCont.style.backgroundPosition = "initial";

                    // Remove the preview card
                    previewCard.remove();
                });

                previewCard.appendChild(image);
                previewCard.appendChild(fileName);
                previewCard.appendChild(removeButton);

                previewContainer.appendChild(previewCard);
            };

            reader.readAsDataURL(file);
        }
    });

    // If there are more than 4 files selected, show a modal
    if (files.length > fileLimit) {
        modal.classList.remove("hidden");
    }

    closeModalButton.addEventListener("click", function() {
        modal.classList.add("hidden");
    });
});





// Handle product form submission
document.getElementById("submit-btn").addEventListener("click", async function(e) {
    e.preventDefault();

    // Show loading spinner
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.classList.remove("hidden"); // Show the spinner

    // Get input fields
    const prodNameField = document.getElementById("prodName");
    const prodPriceField = document.getElementById("prodPrice");
    const prodDescField = document.getElementById("prodDescription");
    const prodTagsField = document.getElementById("prodTags");
    const prodQuantField = document.getElementById("prodQuantity");
    const prodCatField = document.getElementById("prodCategory");
    const imagesField = document.getElementById("dropzone-file");
    const imagesFieldLabel = document.querySelector(".imageFieldLabel");
    //console.log(imagesField);
    // Original border color (you can adjust if you want a different color)
    const originalBorderClass = "border-[#242424]";
    const originalBgClass = "bg-white";

    // Function to reset background and border when input is clicked/focused
    const resetInputStyles = (inputField) => {
        inputField.classList.remove("border-2", "border-red-500");
        inputField.classList.add(originalBorderClass, originalBgClass); // Reset to original styles
    };

    // Attach event listeners for each input field to reset the background and border on focus
    prodNameField.addEventListener("focus", () => resetInputStyles(prodNameField));
    prodPriceField.addEventListener("focus", () => resetInputStyles(prodPriceField));
    prodDescField.addEventListener("focus", () => resetInputStyles(prodDescField));
    prodTagsField.addEventListener("focus", () => resetInputStyles(prodTagsField));
    prodQuantField.addEventListener("focus", () => resetInputStyles(prodQuantField));
    prodCatField.addEventListener("focus", () => resetInputStyles(prodCatField));
    //imagesField.addEventListener("focus", () => resetInputStyles(imagesField));
    imagesFieldLabel.addEventListener("click", () => 
        imagesFieldLabel.classList.remove("border-red-500"),
        imagesFieldLabel.classList.add("border-[#242424]")
    );


    // Get input values for validation (same as previous)
    const prodName = prodNameField.value.trim();
    const prodPrice = prodPriceField.value.trim();
    const prodDesc = prodDescField.value.trim();
    const prodTags = prodTagsField.value.trim();
    const prodQuant = prodQuantField.value.trim();
    const prodCat = prodCatField.value.trim();
    const images = imagesField.files;

    // Validation check for empty or invalid fields
    if (
        prodName === "" || 
        prodPrice === "" || 
        prodDesc === "" || 
        prodTags === "" || 
        prodQuant === "" || 
        prodCat === "" || 
        images.length === 0 || 
        parseFloat(prodQuant) < 1 || 
        parseFloat(prodPrice) < 1
    ) {
        // Hide the loading spinner if validation fails
        loadingSpinner.classList.add("hidden");

        const isConfirmed = await createConfirmationModal("Please fill out all the necessary fields?", "Alert!",2);
    
        if (isConfirmed) {

        }

        // Add red border if the field is invalid
        if (prodName === "") prodNameField.classList.add("border-2", "border-red-500");
        else prodNameField.classList.remove("border-2", "border-red-500");

        if (prodPrice === "" || parseFloat(prodPrice) < 1) prodPriceField.classList.add("border-2", "border-red-500");
        else prodPriceField.classList.remove("border-2", "border-red-500");

        if (prodDesc === "") prodDescField.classList.add("border-2", "border-red-500");
        else prodDescField.classList.remove("border-2", "border-red-500");

        if (prodTags === "") prodTagsField.classList.add("border-2", "border-red-500");
        else prodTagsField.classList.remove("border-2", "border-red-500");

        if (prodQuant === "" || parseFloat(prodQuant) < 1) prodQuantField.classList.add("border-2", "border-red-500");
        else prodQuantField.classList.remove("border-2", "border-red-500");

        if (prodCat === "") prodCatField.classList.add("border-2", "border-red-500");
        else prodCatField.classList.remove("border-2", "border-red-500");

        if (images.length === 0) imagesFieldLabel.classList.add("border-2", "border-red-500");
        else imagesField.classList.remove("border-2", "border-red-500");
        

        return; // Exit to prevent further execution
    }

    // Proceed if all inputs are valid
    const productData = {
        Name: prodName,
        Price: prodPrice,
        Details: prodDesc,
        Tags: prodTags,
        Stock: prodQuant,
        CategoryID: prodCat,
    };

    const formData = new FormData();

    // Append images from the input file
    for (let i = 0; i < images.length; i++) {
        formData.append("Images[]", images[i]);
    }

    // Append product data as JSON
    formData.append("productData", JSON.stringify(productData));

    // Send the data via fetch
    fetch(`/static/api/insertProduct.php`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Hide the spinner
        
        loadingSpinner.classList.add("hidden");
        
        // Show success or error modal
        const modalMessage = data.status === 'success' 
            ? "Product added successfully!" 
            : data.message;
    
        const result = createConfirmationModal(modalMessage, data.status === 'success' ? "Success!" : "Error!", 2);
    
        result.then((isConfirmed) => {
            if (isConfirmed && data.status === 'success') {
                // Clear form inputs
                prodNameField.value = '';
                prodPriceField.value = '';
                prodDescField.value = '';
                prodTagsField.value = '';
                prodQuantField.value = '';
                prodCatField.value = '';
                imagesField.value = '';  // Clear file input
                
                // Clear the preview container
                const previewCont = document.getElementById("productImagePrev");
                previewCont.style.backgroundImage = "none";
                previewCont.style.backgroundSize = "initial";  // Reset to initial state
                previewCont.style.backgroundPosition = "initial";
    
                // Optionally clear other fields, like dropzone preview
                const previewContainer = document.getElementById("preview-container");
                previewContainer.innerHTML = ''; // Clear the preview contents
            }
            else {
                // Clear form inputs
                prodNameField.value = '';
                prodPriceField.value = '';
                prodDescField.value = '';
                prodTagsField.value = '';
                prodQuantField.value = '';
                prodCatField.value = '';
                imagesField.value = '';  // Clear file input
                
                // Clear the preview container
                const previewCont = document.getElementById("productImagePrev");
                previewCont.style.backgroundImage = "none";
                previewCont.style.backgroundSize = "initial";  // Reset to initial state
                previewCont.style.backgroundPosition = "initial";
    
                // Optionally clear other fields, like dropzone preview
                const previewContainer = document.getElementById("preview-container");
                previewContainer.innerHTML = ''; // Clear the preview contents
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
        // Hide the spinner
        loadingSpinner.classList.add("hidden");
        createConfirmationModal("An error occurred while submitting the product.", "Error!",2);
    });
    resetProductForm();
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
  


// Create and append the modal to the document body
function createConfirmationModal(message,head,type) {
    return new Promise((resolve) => {
        // Create the modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

        if(type==1){
        // Modal content
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

        }
        else{
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

function resetProductForm() {
    // Get input fields
    const prodNameField = document.getElementById("prodName");
    const prodPriceField = document.getElementById("prodPrice");
    const prodDescField = document.getElementById("prodDescription");
    const prodTagsField = document.getElementById("prodTags");
    const prodQuantField = document.getElementById("prodQuantity");
    const prodCatField = document.getElementById("prodCategory");
    const imagesField = document.getElementById("dropzone-file");
    const previewContainer = document.getElementById("productImagePrev");

    // Clear input values
    prodNameField.value = '';
    prodPriceField.value = '';
    prodDescField.value = '';
    prodTagsField.value = '';
    prodQuantField.value = '';
    prodCatField.value = '';
    imagesField.value = '';  // Clear file input

    // Clear preview container
    previewContainer.style.backgroundImage = "none";
    previewContainer.style.backgroundSize = "initial";  // Reset to initial state
    previewContainer.style.backgroundPosition = "initial";

    // Clear any additional preview-related content
    const imagePreviewContainer = document.getElementById("preview-container");
    imagePreviewContainer.innerHTML = ''; // Clear the preview contents
}
