const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Category Schema (No longer used, as we are fetching collection names dynamically)
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }
});

// Product Schema (No longer used, as we are fetching products from dynamic collections)
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
});

// Get all categories (Now dynamically fetch collection names)
app.get("/categories", async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const categoryNames = collections.map(col => col.name); // Extract collection names
        res.json(categoryNames);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ message: "Error fetching categories", error: err });
    }
});

// Get products by category (Fetch products from dynamic collection)
app.get("/products/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const collection = mongoose.connection.db.collection(category); // Access collection dynamically
        const products = await collection.find({}).toArray(); // Fetch all documents
        res.json(products);
    } catch (err) {
        console.error(`Error fetching products from ${category}:`, err);
        res.status(500).json({ message: `Error fetching products from ${category}`, error: err });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
