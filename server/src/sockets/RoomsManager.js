// chat rooms manager
const { v4: uuidv4 } = require('uuid');

let rooms = [];

const addRoom = (roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username) => {
       let room = getRoomByName(roomName);
       if (!room) {
              room = {
                     id: uuidv4(),
                     name: roomName,
                     description: roomDescription,
                     maxUsers: roomMaxUser,
                     requiresPassword: requiresPassword,
                     password: roomPassword,
                     users: [],
                     messages: [],
                     owner: username,
                     creationDateAndTime: getDateAndTime()
              };
              rooms.push(room);
       }

       // check if the user is already in the room before adding
       if (!room.users.some(user => user.username === username)) {
              room.users.push({
                     username: username,
                     role: "creator"
              });
       }
};

const removeRoom = (roomName, userName) => {
       const room = getRoomByName(roomName);
       if (room) {
              const userIndex = room.users.findIndex(user => user.username === userName);
              if (userIndex > -1) room.users.splice(userIndex, 1);
              if (room.users.length === 0) {
                     const roomIndex = rooms.findIndex(r => r.name === roomName);
                     rooms.splice(roomIndex, 1);
              }
       }
};

const joinRoom = (roomName, userName) => {
       // Get the room by its name
       const room = getRoomByName(roomName);

       if (room) {
              // Check if the user is already in the room before adding
              const isUserAlreadyInRoom = room.users.some(user => user.username === userName);
              const isUserAdmin = room.users.some(user => user.username === userName && user.role === "admin");
              const isRoomAlmostFull = room.users.length >= room.maxUsers - 1; // Check if the room is at (maxUsers - 1)

              // Check if the user is the admin of the room, if he is not and the room is almost full, don't add him
              if (!isUserAdmin && (isRoomAlmostFull || isUserAlreadyInRoom)) {
                     return; // Return early without adding the user
              }

              if (!isUserAlreadyInRoom) {
                     room.users.push({
                            username: userName,
                            role: "user"
                     });
              }
       }
};


const leaveRoom = (roomName, userName) => {
       const room = getRoomByName(roomName);
       if (room) {
              const userIndex = room.users.findIndex(user => user.username === userName);
              if (userIndex > -1) {
                     room.users.splice(userIndex, 1);
                     if (room.users.length === 0) {
                            const roomIndex = rooms.findIndex(r => r.name === roomName);
                            rooms.splice(roomIndex, 1);
                     }
              }
       }
};

// ================
// helper functions

const getRooms = () => {
       return rooms;
};
const getRoomByName = (roomName) => {
       return rooms.find(room => room.name === roomName);
};
function getDateAndTime() {
       const date = new Date();
       const day = String(date.getDate()).padStart(2, '0');
       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
       const year = date.getFullYear();
       const hours = String(date.getHours()).padStart(2, '0');
       const minutes = String(date.getMinutes()).padStart(2, '0');

       return `${day}/${month}/${year} ${hours}:${minutes}`;
}
const getUserRoom = (userName) => {
       for (let room of rooms) {
              if (room.users.some(user => user.username === userName)) {
                     return room.name;
              }
       }
       return false;
};

const isUserAdmin = (username) => {
       if (getUserRoom(username)) {
              const room = getRoomByName(getUserRoom(username));
              if (room.users.some(user => user.username === username && user.role === "creator")) {
                     return true;
              }
       }
}

const getRoomInfo = (roomName) => {
       const room = getRoomByName(roomName);
       if (room) {
              // Create a copy of the room object to avoid mutating the original
              const roomWithoutPassword = { ...room };
              delete roomWithoutPassword.password;
              return roomWithoutPassword;
       }
};


module.exports = {
       rooms,
       addRoom,
       removeRoom,
       joinRoom,
       leaveRoom,
       getRooms,
       getUserRoom,
       getRoomInfo,
       isUserAdmin,
       getRoomInfo
};

