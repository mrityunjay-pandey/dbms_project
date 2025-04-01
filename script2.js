document.addEventListener('DOMContentLoaded', function () {
    // Function to show forms based on button click
    window.showForm = function (formId) {
        document.querySelectorAll('.form-container').forEach(form => {
            form.style.display = 'none';
        });
        document.getElementById(formId).style.display = 'block';
    };

    // Hide all forms on page load
    window.onload = function () {
        document.querySelectorAll('.form-container').forEach(form => {
            form.style.display = 'none';
        });
    };

    // Fetch categories dynamically from the server
    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:5000/categories');
            const categories = await response.json();

            // Populate the category dropdowns
            const categoryDropdowns = [
                document.getElementById('update-category'),
                document.getElementById('delete-category')
            ];

            categoryDropdowns.forEach(dropdown => {
                // Clear existing options
                dropdown.innerHTML = '';
                // Add default "Select" option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select a category';
                dropdown.appendChild(defaultOption);

                // Populate new options based on categories
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    dropdown.appendChild(option);
                });
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Failed to load categories.');
        }
    }

    // Call the function to fetch categories on page load
    fetchCategories();

    // CREATE PRODUCT
    document.querySelector('#create form').addEventListener('submit', async function (e) {
        e.preventDefault();

        // Capture form values
        const category = document.getElementById('categories-name').value;
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const imageLink = document.getElementById('product-link').value;

        try {
            const response = await fetch('http://localhost:5000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price, image: imageLink, category })
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product.');
        }
    });

    // UPDATE PRODUCT
    document.querySelector('#update form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = document.getElementById('old-product-name').value;
        const name = document.getElementById('new-product-name').value;
        const price = document.getElementById('new-product-price').value;
        const imageLink = document.getElementById('new-product-link').value;

        try {
            const response = await fetch(`http://localhost:5000/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price, image: imageLink })
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product.');
        }
    });

    // DELETE PRODUCT
// DELETE PRODUCT
document.querySelector('.delete-button').addEventListener('click', async function () {
    const category = document.getElementById('delete-category').value;  // Category input
    const name = document.getElementById('delete-product-name').value;  // Product name input

    if (!category || !name) {
        alert('Please select a category and enter a product name.');
        return;
    }

    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`http://localhost:5000/products/${category}/${name}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
    }
});





async function fetchProduct(category, name) {
    try {
        const response = await fetch(`http://localhost:5000/products/${category}/${name}`);

        if (response.ok) {
            const product = await response.json();
            console.log('Product fetched:', product);
        } else {
            const error = await response.json();
            console.error('Error:', error.message);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

fetchProduct('pro', 'new_product'); // Assuming 'electronics' is your category and 'laptop' is the product name.







});
