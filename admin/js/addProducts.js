// Function to handle the file input and preview
document.getElementById("dropzone-file").addEventListener("change", function(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById("preview-container");
    const modal = document.getElementById("fileLimitModal");
    const closeModalButton = document.getElementById("closeModalButton");

    // Clear previous previews
    previewContainer.innerHTML = '';

    // Limit to 4 files
    const fileLimit = 4;
    const filesToPreview = Array.from(files).slice(0, fileLimit); // Only preview the first 4 files

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
                image.classList.add("w-full", "h-auto");

                const fileName = document.createElement("p");
                fileName.textContent = file.name;
                fileName.classList.add("text-center", "p-2", "text-sm", "text-gray-700");

                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.classList.add("absolute", "top-2", "right-2", "px-3", "py-1", "bg-red-500", "text-white", "rounded-[5px]", "text-xs");
                removeButton.addEventListener("click", function() {
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
document.getElementById("submit-btn").addEventListener("click", function(e) {
    e.preventDefault();

    // Show loading spinner
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.classList.remove("hidden"); // Show the spinner

    const productData = {
        Name: document.getElementById("prodName").value,
        Price: document.getElementById("prodPrice").value,
        Details: document.getElementById("prodDescription").value,
        Tags: document.getElementById("prodTags").value,
        Stock: document.getElementById("prodQuantity").value,
        CategoryID: document.getElementById("prodCategory").value,
    };

    const formData = new FormData();

    // Append images from the input file
    const images = document.getElementById("dropzone-file").files;
    for (let i = 0; i < images.length; i++) {
        formData.append("Images[]", images[i]);
    }

    // Append product data as JSON
    formData.append("productData", JSON.stringify(productData));

    // Send the data via fetch
    fetch('http://192.168.2.0/static/api/insertProduct.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Hide the spinner
        loadingSpinner.classList.add("hidden");

        // Show success or error modal
        const modalMessage = document.getElementById("modalMessage");
        const modalTitle = document.getElementById("modalTitle");
        const modalCloseButton = document.getElementById("modalCloseButton");

        if (data.status === 'success') {
            modalTitle.textContent = "Success";
            modalMessage.textContent = "Product added successfully!";
            document.getElementById("successModal").classList.remove("hidden");

            // Clear form inputs
            document.getElementById("prodName").value = '';
            document.getElementById("prodPrice").value = '';
            document.getElementById("prodDescription").value = '';
            document.getElementById("prodTags").value = '';
            document.getElementById("prodQuantity").value = '';
            document.getElementById("prodCategory").value = '';
            document.getElementById("dropzone-file").value = '';  // Clear file input
            document.getElementById("preview-container").innerHTML = '';  // Clear preview container
        } else {
            modalTitle.textContent = "Error";
            modalMessage.textContent = data.message;
            document.getElementById("errorModal").classList.remove("hidden");
        }

        modalCloseButton.addEventListener("click", function() {
            document.getElementById("successModal").classList.add("hidden");
            document.getElementById("errorModal").classList.add("hidden");
        });
    })
    .catch(error => {
        // Hide the spinner in case of error
        loadingSpinner.classList.add("hidden");

        // Show error modal
        const modalMessage = document.getElementById("modalMessage");
        const modalTitle = document.getElementById("modalTitle");
        const modalCloseButton = document.getElementById("modalCloseButton");

        modalTitle.textContent = "Error";
        modalMessage.textContent = "An error occurred while uploading. Please try again.";
        document.getElementById("errorModal").classList.remove("hidden");

        modalCloseButton.addEventListener("click", function() {
            document.getElementById("errorModal").classList.add("hidden");
        });
    });
});
