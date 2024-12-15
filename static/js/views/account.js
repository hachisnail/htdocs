// Function to get a cookie by name and decode its value
user();

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            const cookieValue = c.substring(nameEQ.length, c.length);
            return decodeCookie(cookieValue);  // Decode before returning the cookie value
        }
    }
    return null;
}

// Example of checking if the user is logged in when the page loads
function user() {
    const username = getCookie("username");
    const email = getCookie("email");
    if (username) {
      const usernameC = document.getElementById("usernameAcc");
      const emailC =  document.getElementById("emailAcc");
        usernameC.textContent = atob(username);
        emailC.textContent = atob(email);
        //console.log("User is logged in as " + username);
    } else {
        // User is not logged in, so you can redirect them to login page
        console.log("User is not logged in");
    }
}



// Function to show or hide the shopping bag modal
function showBag() {
    let shoppingBagModal = document.getElementById("shoppingBag");

    if (!shoppingBagModal) {
        // If the modal doesn't exist, generate and show it
        generateShoppingBagModal();
    } else {
        // If the modal exists, remove it (hide and delete it from the DOM)
        shoppingBagModal.remove();
    }
}

// Function to get a cookie value by name
function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

// Function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
}

// Function to generate the shopping bag modal dynamically
function generateShoppingBagModal() {
    let bagItems = [];

    document.addEventListener('DOMContentLoaded', function () {
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
    bagItems.forEach(item => {
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
                    ${bagItems.map((item, index) => `
                    <div class="rounded-[20px] p-2 w-full h-fit flex justify-between border-solid border-[2px] border-[#D9D9D9]">
                        <!-- product in bag -->
                        <div class="flex">
                            <div class="rounded-[20px] w-[83px] h-[89px] flex bg-[#D9D9D9]">
                                <img src="${item.img}" alt="Product Image" class="w-full h-full object-cover rounded-[20px]">
                            </div>
                            <div class="w-fit md:w-[115px] ml-2 h-[89px] flex flex-col justify-start">
                                <!-- prod info -->
                                <p class="font-[700] md:w-[115px] text-ellipsis overflow-hidden text-[16px] text-[#080226]">${item.name}</p>
                                <p class="text-[12px] text-[#828282] font-[400]">Size: <span class="font-[500] text-[#080226]">${item.size}</span></p>
                                <div class="h-[45px] w-fit flex flex-col justify-end">
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
                                <p class="text-[15px] font-[500] cursor-pointer" onclick="updateItemCount(${index}, false)">-</p>
                                <p class="text-[15px] font-[500]">${item.count}</p>
                                <p class="text-[15px] font-[500] cursor-pointer" onclick="updateItemCount(${index}, true)">+</p>
                            </div>
                        </div>
                    </div>`).join('')}
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

    // Inject the modal into the body
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Make the modal visible
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
  const availableStock = bagItems[index].stock;  // Convert stock to an integer
  console.log(availableStock);
  if(availableStock > bagItems[index].count && increase) {
    bagItems[index].count += 1;
    
  }

  else if(bagItems[index].count <= 0 && !increase) {
    //bagItems[index].count = 0;
    removeItem(index);
  }
  else if((availableStock >= bagItems[index].count && !increase)){
    bagItems[index].count -= 1;
  }
  setCookie("shoppingBag", JSON.stringify(bagItems), 7);
  document.getElementById("shoppingBag").remove();
  generateShoppingBagModal();
  }
  function removeItem(index) {
  let bagItems = JSON.parse(getCookie("shoppingBag")) || [];
  bagItems.splice(index, 1);
  setCookie("shoppingBag", JSON.stringify(bagItems), 7);
  document.getElementById("shoppingBag").remove();
  generateShoppingBagModal();
  }
