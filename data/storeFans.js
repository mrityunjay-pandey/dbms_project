const { MongoClient } = require("mongodb");
const fs = require("fs");

// MongoDB connection URL (Change if needed)
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database and Collection Name
const dbName = "havells_fans";
const collectionName = "smartHomes";

// Function to store data in MongoDB
async function storeData() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Read data from JSON file
        const filePath = "smartHomes.json";
        const fanData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        if (fanData.length === 0) {
            console.log("⚠️ No data found to insert.");
            return;
        }

        // Insert data into MongoDB
        await collection.insertMany(fanData);
        console.log(`✅ Inserted ${fanData.length} fans into MongoDB`);

        // Verify the insertion
        const sample = await collection.findOne();
        console.log("🔍 Sample Record:", sample);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await client.close();
        console.log("🔌 MongoDB Connection Closed.");
    }
}

// Run the function
storeData();
