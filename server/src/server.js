require('dotenv').config();
const ChatServer = require('./classes/chatServer');

const chatServer = new ChatServer();
chatServer.start();
