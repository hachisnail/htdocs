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
