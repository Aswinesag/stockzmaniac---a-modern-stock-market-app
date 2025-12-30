import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    };
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null};
}

export const connectToDatabase = async() => {
    if(!MONGODB_URI) throw new Error('MONGODB_URI must be set');
    if(cached.conn) return cached.conn;
    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands: false});
    }
    try {
        cached.conn = await cached.promise;
    } catch(err) {
        cached.promise = null;
        throw err;
    }
    console.log(`MongoDB connected (${process.env.NODE_ENV})`);
}