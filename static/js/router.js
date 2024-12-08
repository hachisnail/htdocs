const router = new Navigo("/", { hash: true });

async function loadPage(view, id = null) {
  const existingScripts = document.querySelectorAll(`script[data-view]`);
  existingScripts.forEach((script) => script.remove());

  fetch(`/static/views/${view}.html`)
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`${view}.html not found`);
      }
    })
    .then((htmlContent) => {
      document.getElementById("shopContent").innerHTML = htmlContent;


      if (view === "products" && id) {
        loadProductDetails(id);
        resetURL(`/products/${id}`);
      } else {
        resetURL(`/${view}`);
      }

      
    })
    .catch((error) => {
      console.error(`${view} failed to load:`, error);
      load404Page(`${view}`);
    });

  const script = document.createElement("script");
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
  getCurrentLocation();
  history.replaceState(null, "", path);
}

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
      document.getElementById("shopContent").innerHTML = htmlContent; // Display 404.html content
    })
    .catch((error) => {
      console.error(`Failed to load 404.html:`, error);
    });
}

function getCurrentLocation() {
  const currentPath = window.location.hash
    ? window.location.hash.replace("#", "")
    : window.location.pathname;

  const footerBanner = document.getElementById("footerBanner");
  if (!footerBanner) {
    console.warn("Footer banner element not found.");
    return;
  }

  const shouldHideBanner =
    currentPath === "/account" || currentPath === "/orders";

  //console.log("Current Path:", currentPath);
  //console.log("Should Hide Banner:", shouldHideBanner);

  footerBanner.classList.toggle("hidden", shouldHideBanner);
}

function loadProductDetails(id) {
  console.log("product with id:" + id + " has been loaded");
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
  "/": function () {
    loadPage("home");
  },
  "/home": function () {
    loadPage("home");
  },
  "/anime-cosplay": function () {
    loadPage("anime-cosplay");
  },
  "/movie-cosplay": function () {
    loadPage("movie-cosplay");
  },
  "/game-cosplay": function () {
    loadPage("game-cosplay");
  },
  "/checkout": function () {
    loadPage("checkout");
  },
  "/account": function () {
    loadPage("account");
  },
  "/orders": function () {
    loadPage("orders");
  },
  "/products/:id": function ({ data }) {
    if (data && data.id) {
      loadPage("products", data.id);
    } else {
      console.error("ID not found in route data");
      load404Page();
    }
  },
});

router.on('/orders', () => {
  //initializeOrder();
});


router.notFound(() => {
  load404Page();
});

router.resolve();
