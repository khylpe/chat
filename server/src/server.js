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

console.log("test");
process.on('uncaughtException', function (err) {
       console.log(err);
});

app.use(express.json());
app.use(cors({
       origin: process.env.CLIENT_URL, // Your client's URL
       credentials: true
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
       console.log("listening on portt ", PORT)
});

// Close the MongoDB connection when the Node process ends
process.on('exit', (e) => {
       console.log("closing node connection. ", e)
       mongoose.connection.close(() => {
              process.exit(0);
       });
});
