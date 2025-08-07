const mongoose = require('mongoose');
 
const connectDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};
 
module.exports = connectDB;