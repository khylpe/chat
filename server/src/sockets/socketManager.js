// socketManager.js
const { addRoom, removeRoom, joinRoom, leaveRoom, getRooms, getUserRoom, isUserAdmin, getRoomInfo, isUserAuthorized, getRoomByID } = require('./RoomsManager');

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
                            status: 'success',
                            rooms: getRooms()
                     });
              });

              socket.on('joinRoom', (roomName, userName) => {
                     joinRoom(roomName, userName);
              });

              socket.on('leaveRoom', ({roomID, userName}) => {
                     leaveRoom(roomID, userName);
              });

              socket.on('addRoom', ({ roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username }, callback) => {
                     const addRoomResult = addRoom(roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username);
                     io.emit("updateRooms", getRooms());
                     callback(addRoomResult); // Returns an object with the status of the operation, and a message if it failed
              });

              socket.on('removeRoom', ({roomID, userName, isUserAdmin}) => {
                     removeRoom(roomID, userName, isUserAdmin);
              });

              socket.on('checkIfUserInRoom', (userName, callback) => {
                     const userRoom = getUserRoom(userName);
                     userRoom ?
                            callback({ value: true, isUserAdmin: isUserAdmin(userName), roomInfo: getRoomInfo(userRoom) })
                            :
                            callback({ value: false });
              });

              socket.on('checkIfUserAuthorized', ({userName, roomID}, callback) => {
                     console.log("🚀 ~ file: socketManager.js:56 ~ socket.on ~ userName, roomID:", userName, roomID);

                     const isAuthorized = isUserAuthorized(userName, roomID);
                     if(isAuthorized){
                            const room = getRoomByID(roomID);
                            joinRoom(getRoomByID(roomID).name, userName);
                            callback({status: "success"});
                     }else{
                            callback({status: "error", message: "You are not authorized to join this room"});
                     }
              });

              socket.on('disconnect', () => {
                     console.log('Client disconnected');
              });
       });
};
