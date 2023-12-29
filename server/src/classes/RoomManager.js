// RoomsManager.js

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Room = require('./Room'); // Import RoomManager

module.exports = class RoomManager {
       constructor(io) {
              this.io = io;
              this.rooms = [];
              this.setupSocketListeners();
       }

       setupSocketListeners() {
              this.io.on('connection', (socket) => {
                     if(socket.handshake.query.username){
                            let roomOfUser = this.getUserRoom(socket.handshake.query.username);
                            if(roomOfUser){
                                   roomOfUser.updateSocket(socket.handshake.query.username, socket)
                            }
                     }
                     socket.on('getRooms', (callback) => {
                            console.log("getting rooms")
                            callback({
                                   status: 'success',
                                   rooms: this.getRooms()
                            });
                     });
                     socket.on('addRoom', async ({ roomName, roomDescription, roomMaxUsers: roomMaxUsers, requiresPassword, roomPassword, username, roomExpiryTime, roomMaxMessages }, callback) => {
                            const addRoomResult = await this.addRoom(socket, { roomName: roomName, roomDescription: roomDescription, roomMaxUsers: roomMaxUsers, requiresPassword: requiresPassword, roomPassword: roomPassword, username: username, roomExpiryTime: roomExpiryTime, roomMaxMessages: roomMaxMessages });
                            this.io.emit("updateRooms", this.getRooms());
                            console.log("====================================================================================================")
                            callback(addRoomResult); // Returns an object with the status of the operation, and a message if it failed
                     });
                     socket.on('joinRoom', async ({ username, roomID, password }, callback) => {
                            // Find the room by ID
                            const room = this.getRoomByID(roomID);
                            if (!room) {
                                   return callback({ status: 'error', message: 'Room not found' });
                            }

                            // Add user to the room
                            try {
                                   const addUserResponse = await room.addUserToRoom(username, password, socket);
                                   callback(addUserResponse); // Assuming addUserToRoom returns a response object

                                   // Emit event to the room about the new user
                                   if (addUserResponse.status === 'success') {
                                          const userInfo = getUserInfo({ username: username, roomID: roomID });
                                          if (userInfo) this.io.to(roomID).emit('userJoined', userInfo);
                                   }
                            } catch (error) {
                                   callback({ status: 'error', message: 'An error occurred while joining the room' });
                            }
                     });
                     socket.on('removeRoom', ({ roomID, username }) => {
                            this.removeRoom(roomID, username);
                            this.io.emit("roomRemoved", roomID);
                     });
              });
       }
       async addRoom(socket, { roomName, roomDescription, roomMaxUsers, requiresPassword, roomPassword, username, roomMaxMessages, roomExpiryTime }) {
              let room = this.getRoomByName(roomName);
              roomExpiryTime = roomExpiryTime * 60 * 1000; // Convert minutes to milliseconds
              if (!room) {
                     room = new Room({
                            id: uuidv4(),
                            name: roomName,
                            description: roomDescription,
                            maxUsers: roomMaxUsers,
                            requiresPassword: requiresPassword,
                            password: requiresPassword ? await hashPassword(roomPassword) : null,
                            users: [],
                            messages: [],
                            owner: username,
                            creationDateAndTime: helper_getDateAndTime(),
                            messageCount: 0, // Initialize message count
                            expiryDate: Date.now() + roomExpiryTime,
                            expiryTime: roomExpiryTime, //                     
                            maxMessages: roomMaxMessages // Maximum number of messages before clearing
                     });

                     if (!room.users.some(user => user.username === username)) {
                            room.users.push({
                                   username: username,
                                   role: "admin",
                                   status: "online",
                                   socket: socket
                            });
                            this.rooms.push(room);
                            return { status: "success", roomID: room.id }
                     } else {
                            return { status: "error", message: "You are already in the room" }
                     }
              } else {
                     return { status: "error", message: "Room name already exists" }
              }

       };
       removeRoom(roomID, username) {
              const room = getRoomByID(roomID);
              if (room) {
                     // Check if the user is the admin of the room
                     if (!room.users.some(user => user.username === username && user.role === "admin")) {
                            return; // Return early without removing the room
                     }
                     const roomIndex = this.rooms.findIndex(r => r.id === roomID);
                     this.rooms.splice(roomIndex, 1);
                     clearInterval(room.intervalId);
              }
       };
       getRooms() {
              // Iterate over each room and modify the structure
              const roomsWithoutSocketsAndIntervalId = this.rooms.map(room => {
                     // Destructure to separate intervalId and the rest of the room properties
                     const { intervalId, users, ...roomWithoutIntervalId } = room;

                     // Create a new room object without the intervalId
                     return {
                            ...roomWithoutIntervalId, // Spread all other room properties
                            users: users.map(user => {
                                   // Return a new user object without the socket property
                                   const { socket, ...userWithoutSocket } = user;
                                   return userWithoutSocket;
                            })
                     };
              });

              console.log("getting rooms", roomsWithoutSocketsAndIntervalId);
              return roomsWithoutSocketsAndIntervalId;
       };


       getUserRoom(username) { // Get the room of a user by his username
              for (let room of this.rooms) {
                     if (room.users.some(user => user.username === username)) {
                            return room;
                     }
              }
              return false;
       };
       getRoomByName(roomName) {
              return this.rooms.find(room => room.name === roomName);
       };
       getRoomByID(roomID) {
              return this.rooms.find(room => room.id === roomID);
       }
}

const hashPassword = async (password) => {
       return new Promise((resolve, reject) => {
              bcrypt.hash(password, saltRounds, (err, hash) => {
                     if (err) reject(err);
                     resolve(hash);
              });
       });
};

// ================
// helper functions

const helper_getDateAndTime = () => {
       const date = new Date();
       const day = String(date.getDate()).padStart(2, '0');
       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
       const year = date.getFullYear();
       const hours = String(date.getHours()).padStart(2, '0');
       const minutes = String(date.getMinutes()).padStart(2, '0');

       return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const helper_removeRoom = (roomID) => { // Does not check if the room is empty or if the user is the admin
       const roomIndex = this.rooms.findIndex(r => r.id === roomID);
       this.rooms.splice(roomIndex, 1);
}


// setInterval(() => { // Check if there are empty rooms and remove them. Check if there are rooms with no admin and remove them
//        for (let room of this.rooms) if (room.users.length === 0 || !room.users.some(user => user.role === "admin")) helper_removeRoom(room.id);
// }, 10000)