document.addEventListener('DOMContentLoaded', function () {
    // Get the category name from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');

    // Display the category name on the page
    const categoryHeader = document.getElementById('category-name');
    categoryHeader.textContent = categoryName;

    // Fetch products for the selected category
    fetch(`http://localhost:5000/products/${categoryName}`)
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';  // Clear any existing products

            // Dynamically create product items
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                const productImage = document.createElement('img');
                productImage.src = product.image;
                productImage.alt = product.name;

                const productName = document.createElement('h3');
                productName.textContent = product.name;

                const productPrice = document.createElement('p');
                productPrice.textContent = `₹${product.price}`;

                const addToCartButton = document.createElement('button');
                addToCartButton.textContent = 'Add to Cart';

                productDiv.appendChild(productImage);
                productDiv.appendChild(productName);
                productDiv.appendChild(productPrice);
                productDiv.appendChild(addToCartButton);

                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
