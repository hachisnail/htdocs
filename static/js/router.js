
const router = new Navigo('/', { hash: true});


async function loadPage(view, id = null) {
  const existingScripts = document.querySelectorAll(`script[data-view]`);
  existingScripts.forEach(script => script.remove());

  fetch(`/static/views/${view}.html`)
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`${view}.html not found`);
      }
    })
    .then(htmlContent => {
      document.getElementById('shopContent').innerHTML = htmlContent;

      // Call the data-loading function if it's the products view
      if (view === 'products' && id) {
        
        loadProductDetails(id); // Fetch product data after view is loaded
        resetURL(`/products/${id}`); // Keep the URL with the product ID
      } else {
        resetURL(`/${view}`); // Reset the URL for non-product views
      }
      
    })
    .catch(error => {
      console.error(`${view} failed to load:`, error);
      load404Page(`${view}`);
    });

  const script = document.createElement('script');
  script.src = `/static/js/views/${view}.js`;
  script.dataset.view = view;
  script.onload = () => {
    console.log(`${view}.js loaded successfully.`);
  };
  script.onerror = () => {
    console.error(`${view}.js failed to load.`);
  };
  document.body.appendChild(script);
}

function resetURL(path) {
  console.log(path); // Log for debugging
  history.replaceState(null, '', path); // Replace current history entry with the new path
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
    //     <p>The page you are looking for does not exist.</p >
    //     <a href="/">Go back to Home</a>
    //   `; // Fallback if 404.html fails to load
    });
}

function loadProductDetails(id) {
  console.log("product with id:"+id+" has been loaded");
  //to do fetch specific products api
  // fetch(`/api/products/${id}`) // Replace with your actual API endpoint
  //   .then(response => {
  //     if (response.ok) {
  //       return response.json();
  //     } else {
  //       throw new Error('Product not found');
  //     }
  //   })
  //   .then(product => {
  //     // Populate the data into the loaded products view
  //     console.log("product with id:"+id+" has been loaded");
  //     const productContainer = document.getElementById('productDetails'); // Ensure products.html has this container
  //     if (productContainer) {
  //       productContainer.innerHTML = `
  //         <h1>${product.name}</h1>
  //         <img src="${product.image}" alt="${product.name}" />
  //         <p>${product.description}</p>
  //         <p>Price: $${product.price}</p>
  //       `;
  //     }
  //   })
  //   .catch(error => {
  //     console.error(`Failed to load product details:`, error);
  //     const productContainer = document.getElementById('productDetails');
  //     if (productContainer) {
  //       productContainer.innerHTML = `<p>Product not found</p>`;
  //     }
  //   });
}



// Define routes
router.on({
  '/': function () {
    loadPage('home');  // Load the home view
  },
  '/home': function () {
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
  },
  '/products/:id': function ({ data }) {

    if (data && data.id) {
      loadPage('products', data.id); // Pass the id to loadPage
    } else {
      console.error('ID not found in route data');
      load404Page(); // Optionally handle the error
    }
  }

});

router.notFound(() => {
  load404Page();
});

router.resolve();



