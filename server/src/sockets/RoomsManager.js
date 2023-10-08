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
       room.users.push({
              username: username,
              role: "creator"
       });
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
       const room = getRoomByName(roomName);
       if (room) {
              room.users.push({
                     username: userName,
                     role: "user"
              });
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

module.exports = {
       rooms,
       addRoom,
       removeRoom,
       joinRoom,
       leaveRoom,
       getRooms
};

