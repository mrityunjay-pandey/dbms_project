document.addEventListener('DOMContentLoaded', function () {
    // Fetch categories from the backend
    fetch('http://localhost:5000/categories')
        .then(response => response.json())
        .then(categories => {
            const categoryList = document.querySelector('.category-list');
            categoryList.innerHTML = '';  // Clear any existing categories

            // Dynamically create categories
            categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('category');

                const categoryImage = document.createElement('img');
                categoryImage.src = `assets/images/${category.toLowerCase().replace(' ', '')}.jpg`; // Assuming image naming convention matches category names
                categoryImage.alt = category;

                const categoryName = document.createElement('p');
                categoryName.textContent = category;

                categoryDiv.appendChild(categoryImage);
                categoryDiv.appendChild(categoryName);

                // Add click event to redirect to category page
                categoryDiv.addEventListener('click', function() {
                    window.location.href = `category.html?category=${encodeURIComponent(category)}`;
                });

                categoryList.appendChild(categoryDiv);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
});
