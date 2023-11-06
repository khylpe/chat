"use client"
// chat/[roomID]/page.jsx
import { useSocket } from "@/app/contexts/SocketContext"
import { useSession } from "next-auth/react"
import { SocketProvider } from "@/app/contexts/SocketContext";
import React, { useEffect, useState } from "react";
import { Button, Chip, Textarea, User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { FaBars, FaClipboard, FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { HiOutlineStatusOnline, HiStatusOffline } from "react-icons/hi";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import NotAuthorized from "@/app/components/notAuthorized";

const ChatWithSocket = ({ params }) => (
       <SocketProvider>
              <Chat roomID={params.roomID} />
       </SocketProvider>
);

const Chat = ({ roomID }) => {
       const { showSnackbar } = useSnackbar();
       const [messageInput, setMessageInput] = useState("");
       const [editingMessageID, setEditingMessageID] = useState(null);
       const [editedMessage, setEditedMessage] = useState("");
       const [roomInfo, setRoomInfo] = useState();
       const { data: session, status } = useSession();
       const username = session?.user?.username;
       const socket = useSocket();
       const [isUserAuthorized, setIsUserAuthorized] = useState(null);
       const [isUserAdmin, setIsUserAdmin] = useState(false); // TODO: check if the user is admin or not (from the roomInfo)
       const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);

       const handleMouseEnter = (index) => {
              setHoveredMessageIndex(index);
       };

       const handleMouseLeave = () => {
              setHoveredMessageIndex(null);
       };

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
                                   window.location.href = '/CreateOrJoin';
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
                                   window.location.href = '/CreateOrJoin';
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

       const sendMessage = (e) => {
              e.preventDefault();
              const message = messageInput;
              if (!message) return;
              socket.emit('sendMessage', { message: message, roomID: roomID, username: username }, (err, response) => {
                     if (err) {
                            console.log("error : ", err)
                            showSnackbar({ message: `Couldn't send the message: ${err.message}`, color: 'danger' });

                     } else {
                            if (response.status === 'error') {
                                   console.log("real error: ", response.message)
                                   showSnackbar({ message: `Couldn't send the message: ${response.message}`, color: 'warning' });
                            }
                            else if (response.status != 'success') {
                                   showSnackbar({ message: 'Something went wrong', color: 'danger' });

                            } else if (response.status === 'success') {
                                   console.log("message sent")
                                   setMessageInput("");
                            }
                     }
              });
       };

       const deleteMessage = (messageId) => {
              socket.emit('deleteMessage', { messageID: messageId, roomID: roomID, username: username }, (err, response) => {
                     if (err) {
                            showSnackbar({ message: `Couldn't delete the message: ${err.message}`, color: 'danger' });

                     } else {
                            if (response.status === 'error') {
                                   showSnackbar({ message: `Couldn't delete the message: ${response.message}`, color: 'warning' });
                            }
                            // No need to handle success here, as the 'messageDeleted' listener will update the UI
                     }
              });
       };

       const copyMessageToClipboard = (message) => {
              if (navigator.clipboard && window.isSecureContext) {
                     navigator.clipboard.writeText(message)
                            .then(() => {
                                   showSnackbar({ message: `Message copied to clipboard`, color: 'success' });
                            })
                            .catch(err => {
                                   showSnackbar({ message: `Couldn't copy the message to clipboard: ${err.message}`, color: 'danger' });
                            });
              }
       };

       const handleEditMessage = (id, message) => {
              setEditingMessageID(id);
              setEditedMessage(message);
       };

       const handleSubmitEdit = (id, e) => {
              // Emit the updated message to the server
              if (editedMessage === "") { deleteMessage(id); return; }
              socket.emit('editMessage', { messageID: id, roomID: roomID, username: username, newMessage: editedMessage }, (err, response) => {
                     if (err) {
                            showSnackbar({ message: `Couldn't edit the message: ${err.message}`, color: 'danger' });

                     } else {
                            if (response.status === 'error') {
                                   showSnackbar({ message: `Couldn't edit the message: ${response.message}`, color: 'warning' });
                            }
                            // No need to handle success here, as the 'messageDeleted' listener will update the UI
                     }
              });

              setEditingMessageID(null);
              setEditedMessage("");
       };

       return (
              isUserAuthorized ?
                     <div className="flex-grow flex flex-row space-x-7 p-5 h-screen mt-10">
                            <div className="w-3/4 bg-zinc-800 rounded-lg p-3 h-5/6 flex flex-col justify-end">
                                   <div className="overflow-y-auto flex flex-col space-y-1 overflow-x-hidden">
                                          {roomInfo?.messages?.map((message, index) => (
                                                 <div key={index}
                                                        onMouseEnter={() => handleMouseEnter(index)}
                                                        onMouseLeave={handleMouseLeave}
                                                        className="flex flex-col hover:bg-zinc-900 rounded-lg px-3 py-1 items-start">
                                                        <div className="flex justify-between w-full px-2 pt-0 pl-0">
                                                               <Link href={""}>
                                                                      <User
                                                                             className="hover:bg-zinc-800 p-2"
                                                                             name={message.username} // assuming username is part of message
                                                                             description={message.timestamp} // assuming timestamp is part of message
                                                                             isFocusable={true}
                                                                      />
                                                               </Link>
                                                               <Dropdown
                                                                      backdrop="blur"
                                                                      classNames={{
                                                                             base: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                                                                             arrow: "bg-default-200",
                                                                      }}
                                                               >
                                                                      <DropdownTrigger style={{ display: hoveredMessageIndex === index ? 'block' : 'none' }}
                                                                      >
                                                                             <div className="h-fit">
                                                                                    <FaBars className="cursor-pointer"></FaBars>
                                                                             </div>
                                                                      </DropdownTrigger>
                                                                      <DropdownMenu aria-label="Static Actions">
                                                                             <DropdownItem
                                                                                    startContent={<FaClipboard />}
                                                                                    key="copy"
                                                                                    onClick={() => copyMessageToClipboard(roomInfo.messages[index].message)}>
                                                                                    Copy message
                                                                             </DropdownItem>

                                                                             {(message.username === username) &&
                                                                                    <DropdownItem
                                                                                           key="edit"
                                                                                           startContent={<FaEdit />}

                                                                                           onClick={() => { handleEditMessage(message.id, roomInfo.messages[index].message) }}>
                                                                                           Modify message
                                                                                    </DropdownItem>
                                                                             }
                                                                             {(message.username === username || isUserAdmin) &&
                                                                                    <DropdownItem
                                                                                           startContent={<FaTrash />}

                                                                                           key="delete"
                                                                                           className="text-danger"
                                                                                           color="danger" onClick={() => deleteMessage(message.id)}>
                                                                                           Delete message
                                                                                    </DropdownItem>
                                                                             }
                                                                      </DropdownMenu>
                                                               </Dropdown>
                                                        </div>
                                                        {editingMessageID === message.id ? (
                                                               <form className="ml-14 flex flex-row items-center" onSubmit={(e) => handleSubmitEdit(message.id, e)}>
                                                                      <Textarea
                                                                             variant="bordered"
                                                                             color="default"
                                                                             value={editedMessage}
                                                                             minRows={1}
                                                                             onChange={(e) => setEditedMessage(e.target.value)}  // Update the state when the input changes

                                                                             onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key without Shift
                                                                                           e.preventDefault(); // Prevent default to avoid new line in textarea
                                                                                           handleSubmitEdit(message.id, e);
                                                                                    }
                                                                             }}
                                                                      />
                                                                      <div className="flex flex-row space-x-3 ml-5">
                                                                             <Button variant="solid" color="success" type="submit">Save</Button>
                                                                             <Button variant="ghost" color="danger" onClick={() => setEditingMessageID(null)}>Cancel</Button>
                                                                      </div>
                                                               </form>
                                                        ) : (
                                                               <div className="ml-14">{message.message} {message.isModified ? (<span className="ml-1 text-sm font-thin">(modified)</span>) : null}</div>
                                                        )}                                                 </div>
                                          ))}
                                   </div>
                                   <form className="mt-5 flex flex-row items-center space-x-3" onSubmit={sendMessage}>
                                          <Textarea
                                                 placeholder="Enter your message"
                                                 variant="bordered"
                                                 color="default"
                                                 minRows={1}
                                                 isClearable
                                                 autoFocus
                                                 value={messageInput}  // Bind the state to the value of the Textarea
                                                 onChange={(e) => setMessageInput(e.target.value)}  // Update the state when the input changes
                                                 onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key without Shift
                                                               e.preventDefault(); // Prevent default to avoid new line in textarea
                                                               sendMessage(e);
                                                        }
                                                 }}
                                          />
                                          <Button type="submit">Send</Button>
                                   </form>
                            </div>
                            {roomInfo &&
                                   <div className="w-1/4 bg-zinc-800 rounded-lg p-5 h-5/6">
                                          <div className="flex flex-col space-y-5 h-1/2">
                                                 <div className="flex flex-row justify-between space-x-3">
                                                        <span className="text-2xl font-bold break-all">{roomInfo.name}</span>
                                                        <span className="text-lg">Created by <Chip size="lg">{roomInfo.owner}</Chip></span>
                                                 </div>
                                                 <span className="text-lg">{roomInfo.description}</span>
                                                 <div className="space-y-3 h-full">
                                                        <div className="text-xl w-full flex flex-row justify-between">User list <span className="font-bold"> {roomInfo.users.length}/{roomInfo.maxUsers}</span></div>
                                                        <div className="flex flex-col space-y-2 h-full overflow-y-auto">
                                                               {roomInfo.users.map((user, index) => {
                                                                      return (
                                                                             <div key={index} className="flex flex-row items-center">
                                                                                    <Chip color={(roomInfo.owner === user.username) && user.role === "admin" ? "primary" : "default"}>{user.username}</Chip>
                                                                                    {user.status === "online" ? <HiOutlineStatusOnline className="text-green-500 ml-2 text-2xl" /> : <HiStatusOffline className="text-red-500 ml-2 text-2xl" />}
                                                                             </div>
                                                                      )
                                                               })}
                                                        </div>
                                                 </div>



                                          </div>
                                   </div>}
                     </div>
                     :
                     <NotAuthorized></NotAuthorized>
       );
};

export default ChatWithSocket;