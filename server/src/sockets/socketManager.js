// socketManager.js
require('dotenv').config();

const { addRoom,
       removeRoom,
       joinRoom,
       leaveRoom,
       getRooms,
       getUserRoom,
       isUserAdmin,
       getRoomInfo,
       isUserAuthorized,
       setUserOffline,
       setUserOnline,
       addMessage,
       getUserInfo,
       deleteMessage,
       editMessage } = require('./RoomsManager');

module.exports = (server) => {
       const io = require("socket.io")(server, {
              cors: { origin: process.env.CLIENT_URL},
       });

       io.on('connection', (socket) => {
              console.log("user connected")
              socket.on('getRooms', (callback) => {
                     console.log("getting rooms")
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
                            const userInfo = getUserInfo({ username: username, roomID: roomID });

                            if (userInfo) io.to(roomID).emit('userJoined', userInfo);
                     }
                     else {
                            callback(null, { status: "error", message: "An error occured" });
                     }
              });
              socket.on('leaveRoom', ({ roomID, username }) => {
                     const leaveRoomResult = leaveRoom(username, roomID);
                     if (leaveRoomResult.status === "error") return console.log(leaveRoomResult.message);

                     if (leaveRoomResult.status === "success") {
                            socket.leave(roomID);
                            io.to(roomID).emit('userLeft', { username: username, roomID: roomID });
                     }
              });
              socket.on('addRoom', async ({ roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username }, callback) => {
                     const addRoomResult = await addRoom(roomName, roomDescription, roomMaxUser, requiresPassword, roomPassword, username);
                     io.emit("updateRooms", getRooms());
                     callback(addRoomResult); // Returns an object with the status of the operation, and a message if it failed
              });
              socket.on('removeRoom', ({ roomID, username }) => {
                     removeRoom(roomID, username);
                     io.emit("roomRemoved", roomID);
              });
              socket.on('checkIfUserInRoom', (username, callback) => {
                     const userRoom = getUserRoom(username);

                     if (userRoom) {
                            const roomInfo = getRoomInfo({ roomName: userRoom });
                            if (!roomInfo) return callback({ status: "error", message: "Something went wrong" });
                            callback({ status: "success", value: true, isUserAdmin: isUserAdmin(username), roomInfo: roomInfo })
                     } else {
                            callback({ status: "success", value: false });
                     }
              });
              socket.on('checkIfUserAuthorized', ({ username, roomID }, callback) => {
                     if (username != socket.handshake.auth.username) return callback({ status: "error", message: "You are not authorized to join this room" });

                     const isAuthorized = isUserAuthorized(username, roomID);
                     if (isAuthorized) {
                            setUserOnline(socket.handshake.auth.username, roomID);
                            socket.join(roomID);
                            callback({ status: "success" });
                            const userInfo = getUserInfo({ username: socket.handshake.auth.username, roomID: roomID });
                            io.to(roomID).emit('userConnected', userInfo);
                     } else {
                            callback({ status: "error", message: "You are not authorized to join this room" });
                     }
              });
              socket.on('disconnecting', () => {
                     console.log("user disconnecting")
                     const info = setUserOffline({ username: socket.handshake.auth.username, roomList: socket.rooms }); // it will return an object with the roomID and the username, or an error message
                     if (info.status === "success") {
                            const userInfo = getUserInfo({ username: info.username, roomID: info.roomID });
                            if (userInfo) io.to(info.roomID).emit('userDisconnected', userInfo);
                     }
              });
              socket.on('disconnect', () => {
                     console.log("socket disconnect")
              });
              socket.on('getRoomInfo', ({ roomID, username }, callback) => {
                     const roomInfo = getRoomInfo({ roomID: roomID });
                     if (!roomInfo) return callback({ status: "error", message: "Something went wrong" });
                     callback({ status: "success", roomInfo: roomInfo });

              });
              socket.on('sendMessage', ({ roomID, username, message }, callback) => {
                     const response = addMessage({ roomID, username, message });
                     if (response.status === "success") {
                            callback(null, { status: "success" });
                            io.to(roomID).emit('newMessage', response.messageInfo);
                     } else {
                            callback({ status: "error", message: response.message });
                     }
              });
              socket.on('deleteMessage', ({ roomID, username, messageID }, callback) => {
                     const response = deleteMessage({ roomID: roomID, username: username, messageID: messageID });
                     if (response.status === "success") {
                            callback({ status: "success" });
                            io.to(roomID).emit('messageDeleted', response.messageInfo);
                     } else {
                            callback({ status: "error", message: response.message });
                     }
              });
              socket.on("editMessage", ({ roomID, username, messageID, newMessage }, callback) => {
                     const response = editMessage({ roomID: roomID, username: username, messageID: messageID, newMessage: newMessage });
                     if (response.status === "success") {
                            callback({ status: "success" });
                            io.to(roomID).emit('messageEdited', response.messageInfo);
                     } else {
                            callback({ status: "error", message: response.message });
                     }
              });
       });
};
