// lib/mongoose.js
import mongoose from 'mongoose';

// const MONGODB_URI = `mongodb+srv://manish:OnlyoneLoan%40007@cluster0.vxzgi.mongodb.net/RamLeela?retryWrites=true&w=majority&appName=Cluster0`;

// if (!MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

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

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
