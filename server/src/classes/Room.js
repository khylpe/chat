const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = class Room {
       constructor({ id, name, description, maxUsers, requiresPassword, password, username, owner, creationDateAndTime, messageCount, expiryDate, expiryTime, maxMessages }) {
              this.id = id;
              this.name = name;
              this.description = description;
              this.maxUsers = maxUsers;
              this.requiresPassword = requiresPassword;
              this.password = password;
              this.users = [];
              this.messages = [];
              this.owner = owner;
              this.creationDateAndTime = creationDateAndTime;
              this.messageCount = messageCount;
              this.expiryDate = expiryDate;
              this.expiryTime = expiryTime;
              this.maxMessages = maxMessages;
              this.intervalId = setInterval(() => {
                     this.clearRoom();
              }, this.expiryTime);

              this.setupSocketListeners();
       };

       setupSocketListeners() {
              console.log('setting up socket listeners');

              if (this.users.length <= 0) return console.log('no users');
              this.users.forEach(user => {
                     user.socket.removeAllListeners();

                     console.log('setting up socket listeners for user: ' + user.username);
                     user.socket.on('leaveRoom', ({ roomID, username }) => {
                            const leaveRoomResult = this.leaveRoom(username);
                            if (leaveRoomResult.status === "error") return console.log(leaveRoomResult.message);

                            if (leaveRoomResult.status === "success") {
                                   this.socket.leave(roomID);
                                   this.users.forEach(user => {
                                          user.socket.emit('userLeft', this.getUserInfo(username));
                                   });
                            }
                     });
                     user.socket.on('getRoomInfo', ({ roomID, username }, callback) => {
                            const roomInfo = this.getRoomInfo();
                            if (!roomInfo) return callback({ status: "error", message: "Something went wrong" });
                            callback({ status: "success", roomInfo: roomInfo });

                     });
                     user.socket.on('sendMessage', ({ username, message }, callback) => {
                            console.log("sending message")
                            const response = this.addMessage(username, message);
                            if (response.status === "success") {
                                   callback(null, { status: "success" });

                                   this.users.forEach(userToSendMessage => {
                                          
                                          console.log("querying user: ", userToSendMessage)
                                          userToSendMessage.socket.emit('newMessage', response.messageInfo);
                                   });
                            } else {
                                   callback({ status: "error", message: response.message });
                            }
                     });
                     user.socket.on('deleteMessage', ({ roomID, username, messageID }, callback) => {
                            const response = this.deleteMessage(username, messageID);
                            if (response.status === "success") {
                                   callback({ status: "success" });
                                   this.users.forEach(user => {
                                          user.socket.emit('messageDeleted', response.messageInfo);
                                   });
                            } else {
                                   callback({ status: "error", message: response.message });
                            }
                     });
                     user.socket.on("editMessage", ({ roomID, username, messageID, newMessage }, callback) => {
                            const response = this.editMessage(username, messageID, newMessage);
                            if (response.status === "success") {
                                   callback({ status: "success" });
                                   this.users.forEach(user => {
                                          user.socket.emit('messageEdited', response.messageInfo);
                                   });
                            } else {
                                   callback({ status: "error", message: response.message });
                            }
                     });
                     user.socket.on('checkIfUserInRoom', (username, callback) => {
                            const isUserInRoom = this.isUserAuthorized(username);
                            const roomInfo = this.getRoomInfo();
                            callback({ status: "success", value: isUserInRoom, isUserAdmin: this.isUserAdmin(username), roomInfo: roomInfo })
                     });
                     user.socket.on('checkIfUserAuthorized', ({ username, roomID }, callback) => {
                            if (username != user.socket.handshake.auth.username) return callback({ status: "error", message: "You are not authorized to join this room" });

                            const isAuthorized = this.isUserAuthorized(username);
                            if (isAuthorized) {
                                   this.setUserOnline(user.socket.handshake.auth.username);
                                   user.socket.join(this.id);
                                   callback({ status: "success" });

                                   this.users.forEach(user => {
                                          user.socket.emit('roomInfoUpdated', this.getRoomInfo());
                                   });
                            } else {
                                   callback({ status: "error", message: "You are not authorized to join this room" });
                            }
                     });
                     user.socket.on('disconnecting', () => {
                            const info = this.setUserOffline(user.socket.handshake.auth.username); // it will return an object with the roomID and the username, or an error message
                            if (info.status === "success") {
                                   const userInfo = this.getUserInfo(info.username);
                                   if (userInfo) {
                                          this.users.forEach(user => {
                                                 user.socket.emit('userDisconnected', userInfo);
                                          });
                                   };
                            }
                     });
              });
       }

       setUserOnline(username) {
              // check corresponding socket id
              const userIndex = this.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     this.users[userIndex].status = "online";
              }
       };
       setUserOffline(username) {
              if (!username) return { status: "error", message: "Missing parameters" };

              const userIndex = this.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     this.users[userIndex].status = "offline";
                     return { status: "success", username: username, roomID: this.id };
              }
              return { status: "error", message: "User not found" };
       };
       addMessage(username, message) {
              // Check and clear the room if necessary
              this.clearRoom();

              // Check if user is in the room
              if (!this.isUserAuthorized(username)) {
                     return { status: "error", message: "User not in the room" };
              }

              let id, messageIndex, attempts = 0;
              do {
                     // Generate a unique ID for the message
                     id = uuidv4();
                     // Check if message id already exists
                     messageIndex = this.messages.findIndex(m => m.id === id);
                     attempts++;
              } while (messageIndex > -1 && attempts < 20);

              if (attempts === 20) {
                     return { status: "error", message: "Unable to generate a unique message ID" };
              }

              this.messageCount++; // Increment message count
              this.clearRoom() ? this.messageCount++ : null;

              const dateAndTime = this.helper_getDateAndTime();

              this.messages.push({
                     username: username,
                     message: message,
                     dateAndTime: dateAndTime,
                     id: id,
                     isModified: false
              });
              return { status: "success", messageInfo: { username: username, message: message, dateAndTime: dateAndTime, id: id } };
       };
       deleteMessage(username, messageID) {
              // Check if user is in the room
              if (!this.isUserAuthorized(username)) {
                     return { status: "error", message: "User not in the room" };
              }

              // Check if message id exists
              const messageIndex = this.messages.findIndex(m => m.id === messageID);
              if (messageIndex > -1) {
                     // Check if the user is the sender of the message or an admin
                     if (this.messages[messageIndex].username === username || this.isUserAdmin(username)) {
                            const messageInfo = this.messages[messageIndex];
                            this.messages.splice(messageIndex, 1);
                            return { status: "success", messageInfo: messageInfo };
                     } else {
                            return { status: "error", message: "You are not authorized to delete this message" };
                     }
              } else {
                     return { status: "error", message: "Message not found" };
              }
       }
       editMessage(username, messageID, newMessage) {
              // Check if user is in the room
              if (!this.isUserAuthorized(username)) {
                     return { status: "error", message: "User not in the room" };
              }

              // Check if message id exists
              const messageIndex = this.messages.findIndex(m => m.id === messageID);
              if (messageIndex > -1) {
                     // Check if the user is the sender of the message
                     if (this.messages[messageIndex].username === username) {
                            this.messages[messageIndex].message = newMessage;
                            this.messages[messageIndex].isModified = true;
                            const messageInfo = this.messages[messageIndex];
                            return { status: "success", messageInfo: messageInfo };
                     } else {
                            return { status: "error", message: "You are not authorized to edit this message" };
                     }
              } else {
                     return { status: "error", message: "Message not found" };
              }
       }
       isUserAdmin(username) {
              return (this.users.some(user => user.username === username && user.role === "admin")) ? true : false;
       };
       getRoomInfo() {
              // Create a copy of the room object to avoid mutating the original
              const roomCopy = { ...this };
              delete roomCopy.password;
              delete roomCopy.intervalId;

              // Modify the users array to exclude the socket property from each user
              roomCopy.users = roomCopy.users.map(user => {
                     const { socket, ...userWithoutSocket } = user;
                     return userWithoutSocket;
              });

              return roomCopy;
       };

       isUserAuthorized(username) {
              const userIndex = this.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     return true;
              }
              return false;
       };
       getUserInfo(username) {
              const userIndex = this.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     // Destructure to separate out the socket and retain the rest of the properties
                     const { socket, ...userWithoutSocket } = this.users[userIndex];
                     return userWithoutSocket;
              }
              return false;
       }

       async addUserToRoom(username, password, socket) {
              const isUserAlreadyInRoom = this.users.some(user => user.username === username);
              const isUserAdmin = this.users.some(user => user.username === username && user.role === "admin");
              const isRoomFull = this.users.length >= this.maxUsers;

              if (isUserAdmin) return { status: "error", message: "It looks like you are the Admin of this room. You can't join the room this way" };
              if (isUserAlreadyInRoom) return { status: "error", message: "You are already in this room" };
              if (isRoomFull) return { status: "error", message: "This room is full" };

              if (this.requiresPassword) {
                     const isPasswordCorrect = await this.verifyPassword(password, this.password);
                     if (!isPasswordCorrect) return { status: "error", message: "Incorrect password" };
              }

              this.users.push({
                     username: username,
                     socket: socket,
                     role: "user",
                     status: "online"
              });
              return { status: "success", roomID: this.id };
       };
       leaveRoom(username) {
              // remove user from room and return status
              const userIndex = this.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     this.users.splice(userIndex, 1);
                     return { status: "success", username: username, roomID: this.id };
              }
              return { status: "error", message: "User not found" };
       };
       async verifyPassword(password) {
              return new Promise((resolve, reject) => {
                     bcrypt.compare(password, this.password, (err, result) => {
                            if (err) reject(err);
                            resolve(result);
                     });
              });
       };
       clearRoom() {
              if (Date.now() > this.expiryDate || this.messageCount >= this.maxMessages) {
                     console.log('clearing room');
                     this.messages = []; // Clear all messages
                     this.messageCount = 0; // Reset message count
                     this.expiryDate = Date.now() + this.expiryTime; // Reset expiry time


                     clearInterval(this.intervalId);

                     this.intervalId = setInterval(() => {
                            this.clearRoom();
                     }, this.expiryTime);

                     this.users.forEach(user => {
                            user.socket.emit('roomInfoUpdated', this.getRoomInfo());
                     });
                     return true;
              }
              return false;
       };

       updateSocket(username, socket) {
              console.log("old socket: " + this.users.find(user => user.username === username).socket.id)
              console.log("resetting socket for user: " + username)
              const userIndex = this.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     this.users[userIndex].socket = socket;
                     console.log("new socket: " + this.users.find(user => user.username === username).socket.id)
                     this.setupSocketListeners();
              }
       }

       helper_getDateAndTime() {
              const date = new Date();
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
              const year = date.getFullYear();
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');

              return `${day}/${month}/${year} ${hours}:${minutes}`;
       }
}