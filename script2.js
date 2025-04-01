document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
});

function showForm(formId) {
    document.querySelectorAll(".form-container").forEach(form => {
        form.style.display = "none";
    });
    document.getElementById(formId).style.display = "block";
}

// Fetch categories from the server and populate dropdowns
async function loadCategories() {
    try {
        let response = await fetch("http://localhost:5000/categories");
        let categories = await response.json();

        populateCategorySelect("update-category", categories);
        populateCategorySelect("delete-category", categories);
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// Populate category dropdowns
function populateCategorySelect(selectId, categories) {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">Select Category</option>`; // Reset options

    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Create Product
document.querySelector("#create form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        category: document.getElementById("categories-name").value,
        name: document.getElementById("product-name").value,
        price: document.getElementById("product-price").value,
        link: document.getElementById("product-link").value
    };

    try {
        let response = await fetch("http://localhost:5000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        let result = await response.json();
        alert(result.message);
        loadCategories(); // Refresh categories
    } catch (error) {
        console.error("Error creating product:", error);
    }
});

// Update Product
document.querySelector("#update form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        category: document.getElementById("update-category").value,
        oldName: document.getElementById("old-product-name").value,
        newName: document.getElementById("new-product-name").value,
        newPrice: document.getElementById("new-product-price").value,
        newLink: document.getElementById("new-product-link").value
    };

    try {
        let response = await fetch("http://localhost:5000/products", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        let result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error updating product:", error);
    }
});

// Delete Product
document.querySelector(".delete-button").addEventListener("click", async () => {
    const data = {
        category: document.getElementById("delete-category").value,
        name: document.getElementById("delete-product-name").value
    };

    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        let response = await fetch("http://localhost:5000/products", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        let result = await response.json();
        alert(result.message);
        loadCategories(); // Refresh categories
    } catch (error) {
        console.error("Error deleting product:", error);
    }
});
