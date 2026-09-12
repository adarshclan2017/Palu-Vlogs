require('./server/node_modules/dotenv').config({ path: './server/.env' });
const mongoose = require('./server/node_modules/mongoose');

const uri = process.env.MONGODB_URI;

console.log('Testing connection to MongoDB...');
console.log('URI:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'NOT SET');

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in server/.env');
  process.exit(1);
}

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  .then((conn) => {
    console.log('SUCCESS: Successfully connected to MongoDB Atlas!');
    console.log('Host:', conn.connection.host);
    console.log('Database Name:', conn.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILED: Could not connect to MongoDB:');
    console.error(err.message);
    process.exit(1);
  });
