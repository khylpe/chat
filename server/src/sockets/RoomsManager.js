// chat rooms manager
// We remove rooms only if they are empty or if the admin of the room removes it

const { v4: uuidv4 } = require('uuid');
let rooms = [];

const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password) => {
       return new Promise((resolve, reject) => {
              bcrypt.hash(password, saltRounds, (err, hash) => {
                     if (err) reject(err);
                     resolve(hash);
              });
       });
};
const verifyPassword = async (password, hashedPassword) => {
       return new Promise((resolve, reject) => {
              bcrypt.compare(password, hashedPassword, (err, result) => {
                     if (err) reject(err);
                     resolve(result);
              });
       });
};
const addRoom = async (roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username) => {
       let room = helper_getRoomByName(roomName);
       if (!room) {
              room = {
                     id: uuidv4(),
                     name: roomName,
                     description: roomDescription,
                     maxUsers: roomMaxUser,
                     requiresPassword: requiresPassword,
                     password: requiresPassword ? await hashPassword(roomPassword) : null,
                     users: [],
                     messages: [],
                     owner: username,
                     creationDateAndTime: helper_getDateAndTime()
              };
              rooms.push(room);
       } else {
              return { status: "error", message: "Room name already exists" }
       }

       // check if the user is already in the room before adding
       if (!room.users.some(user => user.username === username)) {
              room.users.push({
                     username: username,
                     role: "admin",
                     status: "online"
              });
              return { status: "success", roomID: room.id }
       } else {
              return { status: "error", message: "You are already in the room" }
       }

};
const removeRoom = (roomID, username, isUserAdmin) => {
       const room = helper_getRoomByID(roomID);
       if (room) {
              if (isUserAdmin) {
                     // Check if the user is the admin of the room (we check this again to avoid spoofing)
                     if (!room.users.some(user => user.username === username && user.role === "admin")) {
                            return; // Return early without removing the room
                     }
              }
              const roomIndex = rooms.findIndex(r => r.id === roomID);
              rooms.splice(roomIndex, 1);
       }
};
const joinRoom = async (username, roomID, password) => {
       // Get the room by its ID
       const room = helper_getRoomByID(roomID);

       if (room) {
              const isUserAlreadyInRoom = room.users.some(user => user.username === username);
              const isUserAdmin = room.users.some(user => user.username === username && user.role === "admin");
              const isRoomFull = room.users.length >= room.maxUsers;

              if (isUserAdmin) return { status: "error", message: "It looks like you are the Admin of this room. You can't join the room this way" };
              if (isUserAlreadyInRoom) return { status: "error", message: "You are already in this room" };
              if (isRoomFull) return { status: "error", message: "This room is full" };

              // If the room requires a password and the provided password is incorrect
              if (room.requiresPassword) {
                     const isPasswordCorrect = await verifyPassword(password, room.password);
                     if (!isPasswordCorrect) return { status: "error", message: "Incorrect password" };
              }

              room.users.push({
                     username: username,
                     role: "user",
                     status: "online"
              });
              return { status: "success", roomID: room.id };
       }
       return { status: "error", message: "Room not found" };
};
const leaveRoom = (username, roomID) => {
       // remove user from room and return status
       const room = helper_getRoomByID(roomID);

       if (room) {
              const userIndex = room.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     room.users.splice(userIndex, 1);
                     return { status: "success", username: username, roomID: roomID };
              }
              return { status: "error", message: "User not found" };
       }
};
const setUserOnline = (username, roomID) => {
       const room = helper_getRoomByID(roomID);
       if (room) {
              // check corresponding socket id
              const userIndex = room.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     room.users[userIndex].status = "online";
              }
       }
};
const setUserOffline = ({ username, roomList }) => {
       if (!username || !roomList) return { status: "error", message: "Missing parameters" };

       for (const roomID of roomList) {
              const room = helper_getRoomByID(roomID);
              if (room) {
                     // check corresponding socket id
                     const userIndex = room.users.findIndex(user => user.username === username);
                     if (userIndex > -1) {
                            room.users[userIndex].status = "offline";
                            return { status: "success", username: username, roomID: roomID };
                     }
                     return { status: "error", message: "User not found" };
              }
       }
       return { status: "error", message: "Room not found" };
};
const getRooms = () => {
       return rooms;
};
// should be a helper function
const getUserRoom = (username) => { // Get the room of a user by his username
       for (let room of rooms) {
              if (room.users.some(user => user.username === username)) {
                     return room.name;
              }
       }
       return false;
};
const isUserAdmin = (username) => {
       if (getUserRoom(username)) {
              const room = helper_getRoomByName(getUserRoom(username));
              if (room.users.some(user => user.username === username && user.role === "admin")) {
                     return true;
              }
       }
};
const getRoomInfo = ({ roomName, roomID }) => {
       if (!roomName && !roomID) return false;
       if (roomName) {
              const room = helper_getRoomByName(roomName);
              if (room) {
                     // Create a copy of the room object to avoid mutating the original
                     const roomWithoutPassword = { ...room };
                     delete roomWithoutPassword.password;
                     return roomWithoutPassword;
              }
       }

       if (roomID) {
              const room = helper_getRoomByID(roomID);
              if (room) {
                     // Create a copy of the room object to avoid mutating the original
                     const roomWithoutPassword = { ...room };
                     delete roomWithoutPassword.password;
                     return roomWithoutPassword;
              }
       }
       return false;
};
const isUserAuthorized = (username, roomID) => {
       const room = helper_getRoomByID(roomID);
       if (room) {
              const userIndex = room.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     return true;
              }
       }
       return false;
};
const addMessage = ({ roomID, username, message }) => {
       const id = uuidv4();
       const room = helper_getRoomByID(roomID);
       if (room) {
              // check if message id already exists
              const messageIndex = room.messages.findIndex(m => m.id === id);
              if (messageIndex > -1) return { status: "error", message: "Message ID already exists" };

              const dateAndTime = helper_getDateAndTime();
              room.messages.push({
                     username: username,
                     message: message,
                     dateAndTime: dateAndTime,
                     id: id,
                     isModified: false
              });
              return { status: "success", messageInfo: { username: username, message: message, dateAndTime: dateAndTime, id: id } };
       }
       return { status: "error", message: "Room not found" }
}
const getUserInfo = ({username, roomID}) => {
       const room = helper_getRoomByID(roomID);
       if (room) {
              const userIndex = room.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     return room.users[userIndex];
              }
       }
       return false;
}
const deleteMessage = ({ roomID, username, messageID }) => {
       const room = helper_getRoomByID(roomID);
       if (room) {
              // check if message id already exists
              const messageIndex = room.messages.findIndex(m => m.id === messageID);
              if (messageIndex > -1) {
                     if (room.messages[messageIndex].username === username || isUserAdmin(username)) {
                            const messageInfo = room.messages[messageIndex];
                            room.messages.splice(messageIndex, 1);
                            return { status: "success", messageInfo: messageInfo };
                     } else {
                            return { status: "error", message: "You are not authorized to delete this message" };
                     }
              } else {
                     return { status: "error", message: "Message not found" };
              }
       }
       return { status: "error", message: "Room not found" }
}
const editMessage = ({ roomID, username, messageID, newMessage }) => {
       console.log("🚀 ~ file: RoomsManager.js:246 ~ editMessage ~ newMessage:", newMessage);
       

       const room = helper_getRoomByID(roomID);
       if (room) {
              // check if message id already exists
              const messageIndex = room.messages.findIndex(m => m.id === messageID);
              if (messageIndex > -1) {
                     if (room.messages[messageIndex].username === username) {
                            room.messages[messageIndex].message = newMessage;
                            room.messages[messageIndex].isModified = true;
                            const messageInfo = room.messages[messageIndex];
                            return { status: "success", messageInfo: messageInfo };
                     } else {
                            return { status: "error", message: "You are not authorized to edit this message" };
                     }
              } else {
                     return { status: "error", message: "Message not found" };
              }
       }
       return { status: "error", message: "Room not found" }
}
// ================
// helper functions

const helper_getRoomByName = (roomName) => {
       return rooms.find(room => room.name === roomName);
};
const helper_getDateAndTime = () => {
       const date = new Date();
       const day = String(date.getDate()).padStart(2, '0');
       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
       const year = date.getFullYear();
       const hours = String(date.getHours()).padStart(2, '0');
       const minutes = String(date.getMinutes()).padStart(2, '0');

       return `${day}/${month}/${year} ${hours}:${minutes}`;
}
const helper_getRoomByID = (roomID) => {
       return rooms.find(room => room.id === roomID);
}
const helper_removeRoom = (roomID) => { // Does not check if the room is empty or if the user is the admin
       const roomIndex = rooms.findIndex(r => r.id === roomID);
       rooms.splice(roomIndex, 1);
}

module.exports = {
       addRoom,
       removeRoom,
       joinRoom,
       leaveRoom,
       getRooms,
       getUserRoom,
       getRoomInfo,
       isUserAdmin,
       isUserAuthorized,
       setUserOffline,
       setUserOnline,
       addMessage,
       getUserInfo,
       deleteMessage,
       editMessage
};

setInterval(() => { // Check if there are empty rooms and remove them. Check if there are rooms with no admin and remove them
       for (let room of rooms) if (room.users.length === 0 || !room.users.some(user => user.role === "admin")) helper_removeRoom(room.id);
}, 10000)