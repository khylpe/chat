const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const RoomManager = require('./RoomManager'); // Import RoomManager
const connectDB = require('./../config/dbConnection');

class ChatServer {
       constructor() {
              if (!this.instance) {
                     this.app = express();
                     this.server = http.createServer(this.app);
                     this.io = socketIo(this.server, {
                            cors: { origin: process.env.CLIENT_URL, credentials: true }
                     });
                     this.port = process.env.PORT || 3006;

                     this.setupMiddleware();
                     this.setupRoutes();
                     this.connectToDatabase();
                     this.handleUncaughtExceptions();
                     this.initializeSocketIo();

                     this.instance = this;
              }

              return this.instance;
       }

       getIoServer() {
              return this.io;
       }

       setupMiddleware() {
              this.app.use(express.json());
              this.app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
       }

       setupRoutes() {
              const loginRoute = require('./../routes/login');
              const signupRoute = require('./../routes/signup');

              this.app.use('/login', loginRoute);
              this.app.use('/signup', signupRoute);
       }

       connectToDatabase() {
              connectDB();
       }

       handleUncaughtExceptions() {
              process.on('uncaughtException', err => console.log(err));
              process.on('exit', e => {
                     console.log("Closing Node connection.", e);
                     mongoose.connection.close(() => process.exit(0));
              });
       }

       initializeSocketIo() {
              new RoomManager(this.io);

              this.io.on('connection', (socket) => {
                     console.log("User connected");
                     
                     socket.on('disconnect', () => {
                            console.log("User disconnected");
                     });

                     socket.on('disconnecting', () => {
                            console.log("user disconnecting");
                     });
              });
       }

       start() {
              this.server.listen(this.port, () => {
                     console.log(`Server listening on port ${this.port}`);
              });
       }
}

module.exports = ChatServer;