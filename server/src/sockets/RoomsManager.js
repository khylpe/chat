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
              console.log("🚀 ~ file: RoomsManager.js:30 ~ addRoom ~ rooms", rooms)
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

const leaveRoom = (username, socketID) => {
       const userRoom = getUserRoom(username);
       if (userRoom) {
              const room = helper_getRoomByName(userRoom);
              if (room) {
                     // check corresponding socket id
                     const userIndex = room.users.findIndex(user => user.username === username);
                     if (userIndex > -1) {
                            const socketIndex = room.users.findIndex(user => user.id === socketID);
                            if (socketIndex > -1) {
                                   room.users.splice(socketIndex, 1);
                            }
                     }
              }
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
const setUserOffline = (username, roomID) => {
       const room = helper_getRoomByID(roomID);
       if (room) {
              // check corresponding socket id
              const userIndex = room.users.findIndex(user => user.username === username);
              if (userIndex > -1) {
                     room.users[userIndex].status = "offline";
              }
       }
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
const getRoomInfo = (roomName) => {
       const room = helper_getRoomByName(roomName);
       if (room) {
              // Create a copy of the room object to avoid mutating the original
              const roomWithoutPassword = { ...room };
              delete roomWithoutPassword.password;
              return roomWithoutPassword;
       }
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
       setUserOnline
};

setInterval(() => { // Check if there are empty rooms and remove them. Check if there are rooms with no admin and remove them
       for (let room of rooms) if (room.users.length === 0 || !room.users.some(user => user.role === "admin")) helper_removeRoom(room.id);
}, 10000)