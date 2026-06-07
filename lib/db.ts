import mongoose from "mongoose";
/*
 * Reads the MongoDB connection string from your .env. 
 *The ! is a non-null assertion — telling TypeScript "trust me, this exists".
*/
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in env variables");
}

/*
 * Reads from global.mongoose which you declared in types.d.ts
 * If nothing is cached yet (first run), initializes it with conn: null, promise: null
 * cached is now a reference to global.mongoose — so updating cached.conn also updates global.mongoose.conn
*/
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn; // reuse existing connection
    }

    /*
        * If no connection attempt is in progress, start one and store the promise in cache
        * Storing the promise prevents duplicate connections if connectToDatabase() is called multiple times simultaneously before the first one resolves
        * .then(() => mongoose.connection) extracts the actual Connection object from the result
    */
    if (!cached.promise) {
        const options = {
            bufferCommands: true, // queue DB operations if connection drops temporarily
            maxPoolSize: 10 // max 10 simultaneous connections in the pool
        }
        // !! cached.promise = is given by claude and not in the youtube video
        cached.promise = mongoose.connect(MONGODB_URI, options).then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null; // reset so next call can retry
        throw error;
    }

    return cached.conn;
}

/*
    * overview of the entire file -----
    * First call  → no conn, no promise → creates promise → awaits it → stores conn
    * Second call → conn exists → returns immediately ✅
    * Concurrent  → no conn, promise exists → both await same promise ✅
    * Error       → promise reset → next call retries fresh ✅
*/