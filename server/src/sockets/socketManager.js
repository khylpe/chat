// socketManager.js
const { addRoom, removeRoom, joinRoom, leaveRoom, getRooms, getUserRoom, isUserAdmin, getRoomInfo } = require('./RoomsManager');

module.exports = (server) => {
       const io = require("socket.io")(server, {
              cors: {
                     origin: "http://localhost:3000",
                     credentials: true
              }
       });

       io.on('connection', (socket) => {
              socket.on('getRooms', (callback) => {
                     callback({
                            status: 'ok',
                            rooms: getRooms()
                     });
              });

              socket.on('joinRoom', (roomName, userName) => {
                     joinRoom(roomName, userName);
              });

              socket.on('leaveRoom', (roomName, userName) => {
                     leaveRoom(roomName, userName);
              });

              socket.on('addRoom', ({ roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username }) => {
                     addRoom(roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username);
                     io.emit("updateRooms", getRooms());
              });

              socket.on('removeRoom', (roomName, userName) => {
                     removeRoom(roomName, userName);
              });

              socket.on('checkIfUserInRoom', (userName, callback) => {
                     const userRoom = getUserRoom(userName);
                     userRoom ?
                            callback({ value: true, isUserAdmin: isUserAdmin(userName), roomInfo: getRoomInfo(userRoom)})
                            :
                            callback({ value: false });
              });

              socket.on('disconnect', () => {
                     console.log('Client disconnected');
              });
       });
};
