//server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbConnection');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const setupSocket = require('./sockets/socketManager');
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
       origin: 'http://localhost:3000',
       credentials: true,
       optionsSuccessStatus: 200
}));

setupSocket(server);
connectDB();

/* Routes */
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');

app.use('/login', loginRoute);
app.use('/signup', signupRoute);

const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
       console.log(`Server started on port ${PORT}`);
});

// Close the MongoDB connection when the Node process ends
process.on('exit', () => {
       mongoose.connection.close(() => {
              console.log('Mongoose connection disconnected on app termination');
              process.exit(0);
       });
});
