"use client"
// chat/[roomID]/page.jsx
import { useSocket } from "@/app/contexts/SocketContext"
import { useSession } from "next-auth/react"
import { SocketProvider } from "@/app/contexts/SocketContext";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import NotAuthorized from "@/app/components/notAuthorized";

import RoomInfo from "@/app/components/roomInfo";
import ChatLogs from "@/app/components/chatLogs";

const ChatWithSocket = ({ params }) => (
       <SocketProvider>
              <Chat roomID={params.roomID} />
       </SocketProvider>
);

const Chat = ({ roomID }) => {
       const { showSnackbar } = useSnackbar();
       const [roomInfo, setRoomInfo] = useState();
       const { data: session, status } = useSession();
       const username = session?.user?.username;
       const socket = useSocket();
       const [isUserAuthorized, setIsUserAuthorized] = useState(null);
       const [isUserAdmin, setIsUserAdmin] = useState(false); // TODO: check if the user is admin or not (from the roomInfo)

       useEffect(() => {
              if (!socket) return;
              if (!username) return;

              socket.on('connect', () => {
                     checkAuthorizationAndFetchRoomInfo();
              });
              socket.on('newMessage', (messageInfo) => {
                     setRoomInfo(prevRoomInfo => { // Not so sure why, but we get here twice. So we need to check if the message already exists in the array before adding it again
                            const messageAlreadyExists = prevRoomInfo.messages.some(message => message.id === messageInfo.id);
                            if (messageAlreadyExists) {
                                   return prevRoomInfo;
                            }
                            const newRoomInfo = { ...prevRoomInfo };
                            newRoomInfo.messages.push(messageInfo);
                            return newRoomInfo;
                     });
                     messageInfo.username !== username && showSnackbar({ message: `${messageInfo.username} sent a new message`, color: 'success' });
              });
              socket.on('userJoined', (userJoinedInfo) => {
                     setRoomInfo(prevRoomInfo => {
                            // Check if the user already exists in the array
                            const userAlreadyExists = prevRoomInfo.users.some(user => user.username === userJoinedInfo.username);
                            if (userAlreadyExists) {
                                   return prevRoomInfo;
                            }

                            const newRoomInfo = { ...prevRoomInfo };
                            newRoomInfo.users.push(userJoinedInfo);
                            return newRoomInfo;
                     });
                     showSnackbar({ message: `${userJoinedInfo.username} joined the room`, color: 'success' });
              });
              socket.on('userLeft', (userLeftInfo) => {
                     setRoomInfo(prevRoomInfo => {
                            const newRoomInfo = { ...prevRoomInfo };
                            newRoomInfo.users = newRoomInfo.users.filter(user => user.username !== userLeftInfo.username);
                            return newRoomInfo;
                     });
                     showSnackbar({ message: `${userLeftInfo.username} left the room`, color: 'warning' });
              });
              socket.on('userConnected', (userConnectedInfo) => {
                     if (userConnectedInfo.username === username) return; // Don't show the snackbar if it's the current user (because he already knows he's connected

                     setRoomInfo(prevRoomInfo => {
                            // update the user's status
                            const newRoomInfo = { ...prevRoomInfo };
                            const userIndex = newRoomInfo.users.findIndex(user => user.username === userConnectedInfo.username);
                            newRoomInfo.users[userIndex].status = userConnectedInfo.status;
                            return newRoomInfo;
                     });
                     showSnackbar({ message: `${userConnectedInfo.username} connected`, color: 'success' });
              });
              socket.on('userDisconnected', (userConnectedInfo) => {
                     setRoomInfo(prevRoomInfo => {
                            // update the user's status
                            const newRoomInfo = { ...prevRoomInfo };
                            const userIndex = newRoomInfo.users.findIndex(user => user.username === userConnectedInfo.username);
                            newRoomInfo.users[userIndex].status = userConnectedInfo.status;
                            return newRoomInfo;
                     });

                     showSnackbar({ message: `${userConnectedInfo.username} disconnected`, color: 'warning' });
              });
              socket.on('messageDeleted', (deletedMessageInfo) => {
                     setRoomInfo(prevRoomInfo => {
                            const newRoomInfo = { ...prevRoomInfo };
                            newRoomInfo.messages = newRoomInfo.messages.filter(message => message.id !== deletedMessageInfo.id);
                            return newRoomInfo;
                     });

                     showSnackbar({ message: `${deletedMessageInfo.username} deleted the following message : ${deletedMessageInfo.message}`, color: 'warning' });
              });
              socket.on('messageEdited', (editedMessageInfo) => {
                     setRoomInfo(prevRoomInfo => {
                            const newRoomInfo = { ...prevRoomInfo };
                            const messageIndex = newRoomInfo.messages.findIndex(message => message.id === editedMessageInfo.id);
                            newRoomInfo.messages[messageIndex] = editedMessageInfo;
                            return newRoomInfo;
                     });
                     showSnackbar({ message: `${editedMessageInfo.username} edited the following message : ${editedMessageInfo.message}`, color: 'success' });
              });
              socket.on('roomRemoved', (removedRoomID) => {
                     if (removedRoomID === roomID) { // Replace `currentRoomID` with the actual variable that holds the current room ID
                            showSnackbar({ message: `The room you were in has been removed`, color: 'danger' });
                            const timer = setTimeout(() => {
                                   window.location.href = '/createOrJoin';
                            }, 5000);
                            return () => clearTimeout(timer);
                     }
              });

              return () => {
                     socket.off('newMessage');
                     socket.off('connect');
                     socket.off('userLeft');
                     socket.off('userJoined');
                     socket.off('userConnected');
                     socket.off('userDisconnected');
                     socket.off('messageDeleted');
                     socket.off('messageEdited');
              };
       }, [socket, username]); // Dependencies array to ensure this effect runs only when socket or username changes


       const checkAuthorizationAndFetchRoomInfo = async () => {
              try {
                     const isAuthorizedResponse = await checkIfUserAuthorized(username, roomID, socket);
                     setIsUserAuthorized(isAuthorizedResponse);
                     if (isAuthorizedResponse) {
                            // add the roomID to the socket auth object
                            socket.auth = { ...socket.auth, roomID: roomID };
                            const roomInfoResponse = await getRoomInfo(roomID, socket);

                            if (roomInfoResponse) {
                                   setRoomInfo(roomInfoResponse);
                            }
                     } else {
                            showSnackbar({ message: `You are not authorized to join this room`, color: 'danger' });

                            const timer = setTimeout(() => {
                                   window.location.href = '/createOrJoin';
                            }, 5000);
                            return () => clearTimeout(timer);
                     }
              }
              catch (error) {
                     showSnackbar({ message: `Couldn't connect to the server : ${err.message}`, color: 'danger' });
              }
       };

       const checkIfUserAuthorized = (username, roomID, socket) => {
              return new Promise((resolve, reject) => {
                     socket.timeout(5000).emit('checkIfUserAuthorized', { username: username, roomID: roomID }, (err, response) => {
                            if (err) {
                                   reject(err);
                                   showSnackbar({ message: `Couldn't connect to the server : ${err.message}`, color: 'danger' });
                            }
                            else {
                                   if (response.status === 'success') {
                                          showSnackbar({ message: `Welcome ${username} !`, color: 'success' }); resolve(true);
                                   }
                                   else if (response.status === 'error') {
                                          showSnackbar({ message: response.message, color: 'warning' }); resolve(false);
                                   }
                                   else {
                                          showSnackbar({ message: 'Something went wrong', color: 'danger' }); resolve(false);
                                   }
                                   resolve(response.status === 'success');
                            }
                     });
              });
       };

       const getRoomInfo = (roomID, socket) => {
              return new Promise((resolve, reject) => {
                     socket.timeout(5000).emit('getRoomInfo', { roomID: roomID, username: username }, (err, response) => {
                            if (err) {
                                   showSnackbar({ message: `Couldn't connect to the server : ${err.message}`, color: 'danger' });

                                   reject(err);
                            } else {
                                   if (response.status === 'success') {
                                          showSnackbar({ message: `Room info fetched successfully`, color: 'success' });
                                          setRoomInfo(response.roomInfo);

                                          // Check if the user is admin
                                          const userIndex = response.roomInfo.users.findIndex(user => user.username === username);
                                          if (response.roomInfo.users[userIndex].role === "admin") {
                                                 setIsUserAdmin(true);
                                          }
                                          resolve(response.roomInfo);
                                   }
                                   else if (response.status === 'error') {
                                          showSnackbar({ message: response.message, color: 'warning' });
                                   }
                                   else {
                                          showSnackbar({ message: 'Something went wrong', color: 'danger' });
                                   }
                                   resolve(response.status === 'success');
                            }
                     });
              });
       };

       return (
              isUserAuthorized && roomInfo ?
                     <div className="flex-grow flex flex-row space-x-7 p-5 h-screen mt-10">
                            <ChatLogs messages={roomInfo.messages} isUserAdmin={isUserAdmin} roomID={roomID}></ChatLogs>
                            <RoomInfo roomName={roomInfo.name} owner={roomInfo.owner} description={roomInfo.description} maxUsers={roomInfo.maxUsers} messages={roomInfo.messages} users={roomInfo.users}></RoomInfo>
                     </div>

                     :
                     (isUserAuthorized != null && <NotAuthorized></NotAuthorized>)

       );
};

export default ChatWithSocket;