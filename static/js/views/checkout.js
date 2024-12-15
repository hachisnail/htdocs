function showBag() {
  let shoppingBagModal = document.getElementById("shoppingBag");

  if (!shoppingBagModal) {
    generateShoppingBagModal();
  } else {
    shoppingBagModal.remove();
  }
}


function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

function fillOrderSummary() {
  const orderSummary = document.getElementById("order-Summary");
  let bagItems = [];

  const cookieValue = getCookie("shoppingBag");
  bagItems = [];
  if (cookieValue) {
    try {
      bagItems = JSON.parse(cookieValue) || [];
    } catch (error) {
      console.error("Failed to parse shopping bag cookie:", error);
    }
  }
  console.log(bagItems);
  let totalPrice = 0;
  bagItems.forEach((item) => {
    totalPrice += item.price * item.count;
  });

  updateOrderSummary(bagItems);
}

function updateOrderSummary(bagItems) {
  const orderSummary = document.getElementById("order-Summary");
  orderSummary.innerHTML = ""; // Clear any existing content

  // Iterate over the items in the bag and generate the HTML content
  bagItems.forEach((item) => {
    const itemHTML = `
            <div class="rounded-[20px] p-2 w-full h-fit flex justify-between bg-white border-solid border-[2px] border-[#D9D9D9]">
                <div class="flex">
                    <div class="rounded-[20px] w-[83px] h-[89px] flex bg-[#D9D9D9]">
                        <img src="${item.img}" alt="Product Image" class="w-full h-full object-cover rounded-[20px]" />
                    </div>
                    <div class="w-fit ml-2 h-[89px] flex flex-col justify-start">
                        <p class="font-[700] w-[110px] truncate text-[16px] text-[#080226]">${item.name}</p>
                        <p class="text-[12px] text-[#828282] font-[400]">Size: <span class="font-[500] text-[#080226]">${item.size}</span></p>
                        <div class="h-[45px] w-fit flex flex-col justify-end">
                            <p class="text-[#C83E71] text-[18px] font-[600]">₱${item.price}</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-end">
                    <div class="h-full w-full flex justify-end">
                        <svg class="hidden fill-[#FF0000]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
                        </svg>
                    </div>
                    <div class="flex gap-x-6 px-3 py-1 rounded-[20px] bg-[#D9D9D9]">
                        <p class="text-[10px] font-[500]">Quantity: ${item.count}</p>
                    </div>
                </div>
            </div>
        `;
    orderSummary.insertAdjacentHTML("beforeend", itemHTML);
  });

  const price = document.getElementById("totalPrice");

  // Optionally, you can update the total price below the items
  const totalPrice = calculateTotalPrice(bagItems);
  price.innerText = "₱" + totalPrice;
}

function calculateTotalPrice(bagItems) {
  return bagItems.reduce((total, item) => total + item.price * item.count, 0);
}

function generateShoppingBagModal() {
  let bagItems = [];
  // Retrieve bag items from cookies
  document.addEventListener("DOMContentLoaded", function () {
    const cookieValue = getCookie("shoppingBag");
    bagItems = [];

    if (cookieValue) {
      try {
        bagItems = JSON.parse(cookieValue) || [];
      } catch (error) {
        console.error("Failed to parse shopping bag cookie:", error);
      }
    }
  });

  const cookieValue = getCookie("shoppingBag");
  bagItems = [];
  if (cookieValue) {
    try {
      bagItems = JSON.parse(cookieValue) || [];
    } catch (error) {
      console.error("Failed to parse shopping bag cookie:", error);
    }
  }
  console.log(bagItems);
  let totalPrice = 0;
  bagItems.forEach((item) => {
    totalPrice += item.price * item.count;
  });

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
                    ${bagItems
                      .map(
                        (item, index) => `
                    <div class="rounded-[20px] p-2 w-full h-fit flex justify-between border-solid border-[2px] border-[#D9D9D9]">
                        <!-- product in bag -->
                        <div class="flex">
                            <div class="rounded-[20px] w-[83px] h-[89px] flex bg-[#D9D9D9]">
                                <img src="${item.img}" alt="Product Image" class="w-full h-full object-cover rounded-[20px]">
                            </div>
                            <div class="w-fit ml-2 h-[89px] flex flex-col justify-start">
                                <!-- prod info -->
                                <p class="font-[700] text-[16px]  text-[#080226]">${item.name}</p>
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

                                <p class="text-[15px] font-[500] cursor-pointer" onclick="updateItemCount(${index}, true)">+</p>
                                    <p class="text-[15px] font-[500]">${item.count}</p>
                                <p class="text-[15px] font-[500] cursor-pointer" onclick="updateItemCount(${index}, false)">-</p>
                            </div>
                        </div>
                    </div>`
                      )
                      .join("")}
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
  document.body.insertAdjacentHTML("beforeend", modalContent);
  document.getElementById("shoppingBag").classList.remove("hidden");
}

function removeItem(index) {
  let bagItems = JSON.parse(getCookie("shoppingBag")) || [];

  bagItems.splice(index, 1);

  setCookie("shoppingBag", JSON.stringify(bagItems), 7);

  document.getElementById("shoppingBag").remove();
  generateShoppingBagModal();
}

function updateItemCount(index, increase) {
  let bagItems = JSON.parse(getCookie("shoppingBag")) || [];
   const availableStock = bagItems[index].stock;
  //console.log(availableStock);
  if (availableStock > bagItems[index].count && increase) {
    bagItems[index].count += 1;
  } else if (bagItems[index].count <= 0 && !increase) {
    //bagItems[index].count = 0;
    removeItem(index);
  } else if (availableStock >= bagItems[index].count && !increase) {
    bagItems[index].count -= 1;
  }

  setCookie("shoppingBag", JSON.stringify(bagItems), 7);

  document.getElementById("shoppingBag").remove();
  generateShoppingBagModal();
}


function getCookie(name) {
  const cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookie = cookieArr[i].trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

  // Function to retrieve a cookie value by name
  function getCookieO(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

 // Prepare the data payload before sending it to the API
function prepareShoppingBag(shoppingBag) {
  return shoppingBag.map(item => {
    return {
      ProductID: item.id,            // Ensure ProductID is included
      Quantity: item.count,          // Ensure Quantity is included
      Subtotal: item.price * item.count, // Calculate Subtotal (price * count)
      size: item.size                // If needed, include size
    };
  });
}

async function submitOrder() {
  // Retrieve shipping information from input fields
  const fullName = document.getElementById("Fname").value.trim();
  const fullAddress = document.getElementById("Faddress").value.trim();
  const city = document.getElementById("Fcity").value.trim();
  const province = document.getElementById("Fprovince").value.trim();
  const zipCode = document.getElementById("Fzip").value.trim();
  const phoneNumber = document.getElementById("Fphone").value.trim();
  const deliveryInstructions = document.getElementById("Finstructions").value.trim();

  // Validate shipping information
  if (!fullName || !fullAddress || !city || !province || !zipCode || !phoneNumber) {
    alert("Please fill in all required shipping information.");
    return;
  }

  // Retrieve shopping bag from cookies
  const shoppingBagCookie = getCookieO("shoppingBag");
  let shoppingBag = [];

  if (shoppingBagCookie) {
    try {
      shoppingBag = JSON.parse(decodeURIComponent(shoppingBagCookie));
    } catch (error) {
      console.error("Failed to parse shopping bag cookie:", error);
      alert("Invalid shopping bag data. Please try again.");
      return;
    }
  }

  // Validate shopping bag contents
  if (!Array.isArray(shoppingBag) || shoppingBag.length === 0) {
    alert("Your shopping bag is empty. Add items to proceed.");
    return;
  }

  // Ensure all necessary fields (ProductID, Quantity, Subtotal) are present
  shoppingBag = prepareShoppingBag(shoppingBag);  // Process the shopping bag

  const usernameCookie = getCookieO("username");
  const userId = usernameCookie ? atob(usernameCookie) : "guest"; 

  // Prepare the data payload
  const payload = {
    fullName,
    fullAddress,
    city,
    province,
    zipCode,
    phoneNumber,
    deliveryInstructions,
    userId,
    shoppingBag
  };

  // Send the data to the server using the API endpoint
  try {
    const response = await fetch("/static/api/submitOrder.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log(result);  // Log the result to see what is being returned

    if (response.ok && result.orderId) {
      alert(`Order successfully placed! Order ID: ${result.orderId}`);
      // Clear shopping bag and redirect user
      document.cookie = "shoppingBag=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/order-success.html"; // Redirect to a success page
    } else {
      alert(`Failed to place order: ${result.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error submitting order:", error);
    alert("An error occurred while submitting your order. Please try again.");
  }
}

// Add event listener to the Confirm Order button
const confirmOrderButton = document.getElementById("FireInstructions");
if (confirmOrderButton) {
  confirmOrderButton.addEventListener("click", submitOrder);
}


fillOrderSummary();
