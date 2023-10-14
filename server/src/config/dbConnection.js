const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const connectDB = async () => {
       try {
              await mongoose.connect(uri, {
                     useNewUrlParser: true,
                     useUnifiedTopology: true,
              });
       } catch (error) {
              console.error('Could not connect to MongoDB', error);
              process.exit(1); // Arrête le processus si la connexion échoue
       }
};

module.exports = connectDB;
