const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the connection string from .env file
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

/**
 * POST /products
 * Inserts a new product into a dynamic collection based on its category.
 * Expects: { name, price, link, category } in the request body.
 */
app.post('/products', async (req, res) => {
    const { name, price, link, category } = req.body;

    // Validate the required fields
    if (!name || !price || !link || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Access the collection dynamically based on category.
        const collection = mongoose.connection.db.collection(category);
        const result = await collection.insertOne({ name, price, link, category });

        // Return the inserted product with its generated _id.
        res.status(200).json({
            message: 'Product created successfully',
            product: { _id: result.insertedId, name, price, link, category }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
});






app.get('/products/:category', async (req, res) => {
    const { category } = req.params;

    if (!category) {
        return res.status(400).json({ message: 'Category is required.' });
    }

    try {
        const collection = mongoose.connection.db.collection(category);
        const products = await collection.find().toArray();

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found in this category.' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
});











app.get('/products/:category/:name', async (req, res) => {
    const { category, name } = req.params;

    // Check if both category and name are present
    if (!category || !name) {
        return res.status(400).json({ message: 'Category and product name are required.' });
    }

    try {
        // Access the collection dynamically based on category
        const collection = mongoose.connection.db.collection(category);

        // Find the product by name within the collection
        const product = await collection.findOne({ name: name });

        if (!product) {
            return res.status(404).json({ message: 'Product not found in this category.' });
        }

        // Return the product found
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch product', error: error.message });
    }
});



















/**
 * GET /categories
 * Dynamically retrieves all collection names from the MongoDB database.
 */
app.get("/categories", async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const categoryNames = collections.map(col => col.name);
        res.json(categoryNames);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ message: "Error fetching categories", error: err });
    }
});

// Define the port (using the PORT environment variable if available, otherwise default to 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
