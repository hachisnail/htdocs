const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        datasets: [{
          label: 'Sales',
          data: [50, 60, 70, 90, 350, 400],
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
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6b7280',
            },
          },
          y: {
            grid: {
              color: '#e5e7eb',
            },
            ticks: {
              color: '#6b7280',
            },
          },
        },
      },
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

    

    async function logout() {
      const isConfirmed = await createConfirmationModal("Are you sure you want to logout?");
      
      if (isConfirmed) {
        // Make a request to the logout PHP script
        fetch(`/api/adminLogout.php`, {
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
          window.location.href = '/home'; // This will handle the redirection

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
    