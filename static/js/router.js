// Create a new Navigo router instance
const router = new Navigo('/');

// Load the page content dynamically
async function loadPage(view) {
  // Remove any previously loaded scripts
  const existingScripts = document.querySelectorAll(`script[data-view]`);
  existingScripts.forEach(script => script.remove());

  // Fetch the HTML content of the view
  fetch(`/static/views/${view}.html`)
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`${view}.html not found`);
      }
    })
    .then(htmlContent => {
      document.getElementById('shopContent').innerHTML = htmlContent;  // Insert HTML into the shopContent div
    })
    .catch(error => {
      console.error(`${view} failed to load:`, error);
      load404Page(); // Show the 404 page if loading fails
    });

  // Optionally load the associated JavaScript file
  const script = document.createElement('script');
  script.src = `/static/js/views/${view}.js`;  // Ensure corresponding JS exists in /static/js/views/
  script.dataset.view = view;  // Add a custom data attribute to identify the script
  script.onload = () => {
    console.log(`${view}.js loaded successfully.`);
  };
  script.onerror = () => {
    console.error(`${view}.js failed to load.`);
  };
  document.body.appendChild(script);
}

// Function to load the 404.html page
function load404Page() {
  fetch(`/static/views/404.html`)
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`404.html not found`);
      }
    })
    .then(htmlContent => {
      document.getElementById('shopContent').innerHTML = htmlContent;  // Display 404.html content
    })
    .catch(error => {
      console.error(`Failed to load 404.html:`, error);
    //   document.getElementById('shopContent').innerHTML = `
    //     <h1>404 - Page Not Found</h1>
    //     <p>The page you are looking for does not exist.</p>
    //     <a href="/">Go back to Home</a>
    //   `; // Fallback if 404.html fails to load
    });
}

// Define routes
router.on({
  '/': function () {
    loadPage('home');  // Load the home view
  },
  '/anime-cosplay': function () {
    loadPage('anime-cosplay');  // Load the anime-cosplay view
  },
  '/movie-cosplay': function () {
    loadPage('movie-cosplay');  // Load the movie-cosplay view
  },
  '/game-cosplay': function () {
    loadPage('game-cosplay');  // Load the game-cosplay view
  }
});

// Handle undefined routes (404)
router.notFound(() => {
  load404Page(); // Load the 404.html file for undefined routes
});

// Initialize the router
router.resolve();
