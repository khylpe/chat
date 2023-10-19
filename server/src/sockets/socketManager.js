// socketManager.js

const { addRoom, removeRoom, joinRoom, leaveRoom, getRooms, getUserRoom, isUserAdmin, getRoomInfo, isUserAuthorized, setUserOffline, setUserOnline } = require('./RoomsManager');

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

              socket.on('joinRoom', async ({ username, roomID, password }, callback) => {
                     const response = await joinRoom(username, roomID, password);
                     if (response.status === 'error') {
                            callback(null, response);
                     } else if (response.status === 'success') {
                            callback(null, response);
                     }
                     else {
                            callback(null, { status: "error", message: "An error occured" });
                     }
              });

              socket.on('leaveRoom', ({ roomID, userName }) => {
                     leaveRoom(roomID, userName);
              });

              socket.on('addRoom', async ({ roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username }, callback) => {
                     const addRoomResult = await addRoom(roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username);
                     io.emit("updateRooms", getRooms());
                     callback(addRoomResult); // Returns an object with the status of the operation, and a message if it failed
              });

              socket.on('removeRoom', ({ roomID, userName, isUserAdmin }) => {
                     removeRoom(roomID, userName, isUserAdmin);
              });

              socket.on('checkIfUserInRoom', (userName, callback) => {
                     const userRoom = getUserRoom(userName);

                     if (userRoom) {
                            const roomInfo = getRoomInfo({ roomName: userRoom });
                            if (!roomInfo) return callback({ status: "error", message: "Something went wrong" });
                            callback({ status: "success", value: true, isUserAdmin: isUserAdmin(userName), roomInfo: roomInfo })
                     } else {
                            callback({ status: "success", value: false });
                     }
              });

              socket.on('checkIfUserAuthorized', ({ userName, roomID }, callback) => {
                     if (userName != socket.handshake.auth.username) return callback({ status: "error", message: "You are not authorized to join this room" });

                     const isAuthorized = isUserAuthorized(userName, roomID);
                     if (isAuthorized) {
                            setUserOnline(socket.handshake.auth.username, roomID);
                            callback({ status: "success" });
                     } else {
                            callback({ status: "error", message: "You are not authorized to join this room" });
                     }
              });

              socket.on('disconnect', () => {
                     setUserOffline(socket.handshake.auth.username, socket.id);
              });

              socket.on('getRoomInfo', ({ roomID, username }, callback) => {
                     console.log("🚀 ~ file: socketManager.js:74 ~ socket.on ~ roomID, username:", roomID, username);
                     const roomInfo = getRoomInfo({ roomID: roomID });
                     if (!roomInfo) return callback({ status: "error", message: "Something went wrong" });
                     callback({ status: "success", roomInfo: roomInfo });

              });
       });
};
