import mongoose from 'mongoose';

// Hardcoded MongoDB URI
const MONGODB_URI = `mongodb+srv://manish:OnlyoneLoan%40007@cluster0.vxzgi.mongodb.net/RamLeela?retryWrites=true&w=majority&appName=Cluster0`;

// Check if URI is provided
if (!MONGODB_URI) {
  throw new Error('MongoDB URI is missing!');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
