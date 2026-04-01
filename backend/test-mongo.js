const { MongoClient, ServerApiVersion } = require('mongodb');

// Replace <db_password> with your actual password
const uri = "mongodb+srv://dasunithiwanshika_db_user:rRacM0ZvCh0gXJ8k@cluster0.5ma4buc.mongodb.net/?appName=Cluster0";

// Create a MongoClient with Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();  // Connect to Atlas
        await client.db("admin").command({ ping: 1 }); // Test connection
        console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.log("❌ MongoDB connection error:", err);
    } finally {
        await client.close(); // Close connection
    }
}

run();