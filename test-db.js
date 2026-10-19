
import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;



const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    autoSelectFamily: false,
});

try {
    console.log("Testing MongoDB driver connection...");

    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("SUCCESS: Connected to MongoDB Atlas!");
} catch (error) {
    console.error("FAILED:", error.message);

    if (error.cause) {
        console.error("CAUSE:", error.cause);
    }
} finally {
    await client.close().catch(() => {});
}
