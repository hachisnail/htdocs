async function fetchNewest(){
    const newArrivalsContainer = document.getElementById('newArrivals');

        // Fetch data from the PHP script
        fetch('/static/api/fetchNewest.php')
            .then(response => response.json())
            .then(products => {
                newArrivalsContainer.innerHTML = ''; // Clear existing content

                products.forEach(product => {
                    const productCard = document.createElement('a');
                    productCard.href = `/products/${product.ProductID}`;
                    productCard.setAttribute('data-navigo', '');

                    productCard.innerHTML = `
                        <div class="card w-[216px] h-fit flex-col justify-start">
                            <div class="w-[216px] h-[224px] rounded-[20px] bg-[#D9D9D9]">
                                <img src="/static/assets/productsImages/${product.Image || '/static/assets/productsImages/no image,jpg'}" alt="${product.Name}" class="w-full h-full rounded-[20px] object-cover">
                            </div>
                            <p class="my-[2px] text-[16px] font-[600]">${product.Name}</p>
                            <p class="text-[24px] font-[600] text-[#C83E71]">₱<span>${parseFloat(product.Price).toLocaleString()}</span></p>
                        </div>
                    `;

                    newArrivalsContainer.appendChild(productCard);
                });
            })
            .catch(error => console.error('Error fetching new arrivals:', error));
}

async function fetchPopular(){
    const newArrivalsContainer = document.getElementById('popularProducts');

        // Fetch data from the PHP script
        fetch('/static/api/fetchPopular.php')
            .then(response => response.json())
            .then(products => {
                newArrivalsContainer.innerHTML = ''; // Clear existing content

                products.forEach(product => {
                    const productCard = document.createElement('a');
                    productCard.href = `/products/${product.ProductID}`;
                    productCard.setAttribute('data-navigo', '');

                    productCard.innerHTML = `
                        <div class="card w-[216px] h-fit flex-col justify-start">
                            <div class="w-[216px] h-[224px] rounded-[20px] bg-[#D9D9D9]">
                                <img src="/static/assets/productsImages/${product.Image || '/static/assets/productsImages/no image,jpg'}" alt="${product.Name}" class="w-full h-full rounded-[20px] object-cover">
                            </div>
                            <p class="my-[2px] text-[16px] font-[600]">${product.Name}</p>
                            <p class="text-[24px] font-[600] text-[#C83E71]">₱<span>${parseFloat(product.Price).toLocaleString()}</span></p>
                        </div>
                    `;

                    newArrivalsContainer.appendChild(productCard);
                });
            })
            .catch(error => console.error('Error fetching new arrivals:', error));
}


fetchPopular();

fetchNewest();