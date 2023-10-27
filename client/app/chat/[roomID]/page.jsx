"use client"
// chat/[roomID]/page.jsx
import { useSocket } from "@/app/contexts/SocketContext"
import { useSession } from "next-auth/react"
import { SocketProvider } from "@/app/contexts/SocketContext";
import React, { useEffect, useState } from "react";
import Snackbar from "@/app/components/snackbar";
import { Textarea } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";
import { FaUserAlt, FaBars } from "react-icons/fa";
import { User } from "@nextui-org/react";
import Link from "next/link";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/react";

const ChatWithSocket = ({ params }) => (
       <SocketProvider>
              <Chat roomID={params.roomID} />
       </SocketProvider>
);

const Chat = ({ roomID }) => {
       const [roomInfo, setRoomInfo] = useState();
       const { data: session, status } = useSession();
       const username = session?.user?.username;
       const socket = useSocket();
       const [isUserAuthorized, setIsUserAuthorized] = useState(null);

       // For snackbar component
       const [showSnackbar, setShowSnackbar] = useState(false);
       const [sncackbarMessage, setSnackbarMessage] = useState('');
       const [snackbarColor, setSnackbarColor] = useState('primary');
       const [snackbarKey, setSnackbarKey] = useState(0);

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

              // Socket connection for authorization check
              socket.on('connect', () => {
                     checkAuthorization();
              });

              socket.on('newMessage', (messageInfo) => {
                     console.log("message received: ", messageInfo);
                     setRoomInfo(prevRoomInfo => { // Not so sure why, but we get here twice. So we need to check if the message already exists in the array before adding it again
                            const messageAlreadyExists = prevRoomInfo.messages.some(message => message.id === messageInfo.id);
                            if (messageAlreadyExists) {
                                   console.log("message already exists")
                                   return prevRoomInfo;
                            }

                            const newRoomInfo = { ...prevRoomInfo };
                            newRoomInfo.messages.push(messageInfo);
                            return newRoomInfo;
                     });

                     setSnackbarMessage(`New message from ${messageInfo.username}`);
                     setSnackbarColor('success');
                     setSnackbarKey(prevKey => prevKey + 1);  // Increment the key

                     setShowSnackbar(true);
              });
              return () => {
                     socket.off('newMessage');
                     socket.off('connect');
              };
       }, [socket, username]); // Dependencies array to ensure this effect runs only when socket or username changes


       const checkAuthorization = async () => {
              try {
                     const isAuthorizedResponse = await checkIfUserAuthorized(username, roomID, socket);
                     setIsUserAuthorized(isAuthorizedResponse);
                     if (isAuthorizedResponse) {
                            const roomInfoResponse = await getRoomInfo(roomID, socket);

                            if (roomInfoResponse) {
                                   setRoomInfo(roomInfoResponse);
                            }
                     }
              } catch (error) {
                     setSnackbarMessage(error.message);
                     setSnackbarColor('danger');
                     setShowSnackbar(true);
                     setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
              }
       };

       const checkIfUserAuthorized = (username, roomID, socket) => {
              return new Promise((resolve, reject) => {
                     socket.timeout(5000).emit('checkIfUserAuthorized', { userName: username, roomID: roomID }, (err, response) => {
                            if (err) {
                                   setSnackbarMessage(err.message);
                                   setSnackbarColor('danger');
                                   setShowSnackbar(true);
                                   setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                                   reject(err);
                            } else {
                                   if (response.status === 'success') {
                                          setSnackbarMessage(`Welcome ${username} !`);
                                          setSnackbarColor('success');
                                          setShowSnackbar(true);
                                          setSnackbarKey(prevKey => prevKey + 1);
                                   }
                                   else if (response.status === 'error') {
                                          setSnackbarMessage(response.message);
                                          setSnackbarColor('warning');
                                          setShowSnackbar(true);
                                          setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                                   }
                                   else {
                                          setSnackbarMessage('Something went wrong');
                                          setSnackbarColor('danger');
                                          setShowSnackbar(true);
                                          setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
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
                                   setSnackbarMessage(err.message);
                                   setSnackbarColor('danger');
                                   setShowSnackbar(true);
                                   setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                                   reject(err);
                            } else {
                                   if (response.status === 'success') {
                                          setSnackbarMessage(`Welcome ${username} !`);
                                          setSnackbarColor('success');
                                          setShowSnackbar(true);
                                          setSnackbarKey(prevKey => prevKey + 1);
                                          setRoomInfo(response.roomInfo);
                                          resolve(response.roomInfo);
                                   }
                                   else if (response.status === 'error') {
                                          setSnackbarMessage(response.message);
                                          setSnackbarColor('warning');
                                          setShowSnackbar(true);
                                          setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                                   }
                                   else {
                                          setSnackbarMessage('Something went wrong');
                                          setSnackbarColor('danger');
                                          setShowSnackbar(true);
                                          setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                                   }
                                   resolve(response.status === 'success');
                            }
                     });
              });
       };

       const sendMessage = (e) => {
              console.log("sending message")

              e.preventDefault();
              const message = e.target[0].value;
              if (!message) return;
              socket.emit('sendMessage', { message: message, roomID: roomID, username: username }, (err, response) => {
                     if (err) {
                            setSnackbarMessage(err.message);
                            setSnackbarColor('danger');
                            setShowSnackbar(true);
                            setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                     } else {
                            if (response.status === 'error') {
                                   setSnackbarMessage(response.message);
                                   setSnackbarColor('warning');
                                   setShowSnackbar(true);
                                   setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                            }
                            else if (response.status != 'success') {
                                   setSnackbarMessage('Something went wrong');
                                   setSnackbarColor('danger');
                                   setShowSnackbar(true);
                                   setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                            }
                     }

              });
       };

       if (isUserAuthorized === null) return null;  // or some loading state
       return (
              isUserAuthorized ?
                     <div className="flex-grow flex flex-row space-x-7 p-5 h-screen mt-10">
                            <div className="w-3/4 bg-zinc-800 rounded-lg p-3 h-5/6 flex flex-col justify-end">
                                   <div className="h-full overflow-y-scroll flex flex-col space-y-5 overflow-x-hidden">

                                          {roomInfo?.messages?.map((message, index) => (
                                                 <div key={index}
                                                        onMouseEnter={() => handleMouseEnter(index)}
                                                        onMouseLeave={handleMouseLeave}
                                                        className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 items-start">
                                                        <div className="flex justify-between w-full p-2 pt-0 pl-0">
                                                               <Link href={""}>
                                                                      <User
                                                                             className="hover:bg-zinc-800 p-2"
                                                                             name={message.username} // assuming username is part of message
                                                                             description={message.timestamp} // assuming timestamp is part of message
                                                                             isFocusable={true}
                                                                      />
                                                               </Link>
                                                               <Dropdown
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
                                                                             <DropdownItem key="new">New file</DropdownItem>
                                                                             <DropdownItem key="copy">Copy link</DropdownItem>
                                                                             <DropdownItem key="edit">Edit file</DropdownItem>
                                                                             <DropdownItem key="delete" className="text-danger" color="danger">
                                                                                    Delete file
                                                                             </DropdownItem>
                                                                      </DropdownMenu>
                                                               </Dropdown>
                                                        </div>
                                                        <span className="ml-14 mt-2">{message.message}</span>
                                                 </div>
                                          ))}
                                   </div>
                                   <form className="mt-5 flex flex-row items-center space-x-3" onSubmit={sendMessage}>
                                          <Textarea
                                                 placeholder="Enter your message"
                                                 className=""
                                                 variant="bordered"
                                                 color="secondary"
                                                 minRows={1}
                                          />
                                          <Button type="submit">Send</Button>
                                   </form>
                            </div>
                            <div className="w-1/4 bg-zinc-800 rounded-lg p-5 h-5/6">zz</div>
                            {showSnackbar && (
                                   <Snackbar
                                          key={snackbarKey}  // Add this key prop
                                          message={sncackbarMessage}
                                          duration={10000}
                                          color={snackbarColor}
                                   />
                            )}
                     </div>
                     :
                     <h1>Not authorized</h1>);
};

export default ChatWithSocket;