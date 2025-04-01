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

// Get all categories (Fetch collection names dynamically)
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

// Create Product (Dynamically add to the corresponding category collection)
app.post("/products", async (req, res) => {
    try {
        const { category, name, price, link } = req.body;
        if (!category || !name || !price || !link) return res.status(400).json({ message: "Missing fields" });

        const collection = mongoose.connection.db.collection(category);
        await collection.insertOne({ name, price, link });

        res.json({ message: "Product created successfully" });
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ message: "Error creating product", error: err });
    }
});

// Update Product
app.put("/products", async (req, res) => {
    try {
        const { category, oldName, newName, newPrice, newLink } = req.body;
        if (!category || !oldName || !newName || !newPrice || !newLink) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const collection = mongoose.connection.db.collection(category);
        const result = await collection.updateOne(
            { name: oldName },
            { $set: { name: newName, price: newPrice, link: newLink } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully" });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ message: "Error updating product", error: err });
    }
});

// Delete Product
app.delete("/products", async (req, res) => {
    try {
        const { category, name } = req.body;
        if (!category || !name) return res.status(400).json({ message: "Missing fields" });

        const collection = mongoose.connection.db.collection(category);
        const result = await collection.deleteOne({ name });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: "Error deleting product", error: err });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
