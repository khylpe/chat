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
       const [roomInfo, setRoomInfo] = useState({
              id: '',
              name: '',
              description: '',
              maxUsers: 0,
              requiresPassword: false,
              users: [],
              messages: [],
              owner: '',
              creationDateAndTime: new Date(),
       });
       
       const { data: session, status } = useSession();
       const username = session?.user?.username;
       const socket = useSocket();
       const [isUserAuthorized, setIsUserAuthorized] = useState(null);

       // For snackbar component
       const [showSnackbar, setShowSnackbar] = useState(false);
       const [sncackbarMessage, setSnackbarMessage] = useState('');
       const [snackbarColor, setSnackbarColor] = useState('primary');
       const [snackbarKey, setSnackbarKey] = useState(0);

       const [isHovered, setIsHovered] = useState(false);

       useEffect(() => {
              if (!socket) return;
              if (!username) return;

       }, [socket, username]);

       useEffect(() => {
              if (!username || !socket) return;

              socket.on('connect', () => {
                     console.log('Connected to server');

                     const checkAuthorization = async () => {
                            try {
                                   const isAuthorizedResponse = await checkIfUserAuthorized(username, roomID, socket);
                                   setIsUserAuthorized(isAuthorizedResponse);
                                   if (isAuthorizedResponse) {
                                          const roomInfoResponse = await getRoomInfo(roomID, socket);
                                          if (roomInfoResponse){
                                                 console.log("🚀 ~ file: page.jsx:54 ~ checkAuthorization ~ roomInfoResponse:", roomInfoResponse);
                                                 setRoomInfo(roomInfoResponse);
                                                 console.log("🚀 ~ file: page.jsx:54 ~ checkAuthorization ~ roomInfo:", roomInfo)

                                                 
                                          }
                                   }
                            } catch (error) {
                                   setSnackbarMessage(error.message);
                                   setSnackbarColor('danger');
                                   setShowSnackbar(true);
                                   setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                            }
                     };
                     checkAuthorization();
              });
       }, [username, roomID, socket]);

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
                                          console.log(roomInfo)
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

       if (isUserAuthorized === null) return null;  // or some loading state
       return (
              isUserAuthorized ?
                     <div className="flex-grow flex flex-row space-x-7 p-5 h-screen mt-10">
                            <div className="w-3/4 bg-zinc-800 rounded-lg p-3 h-5/6 flex flex-col justify-end">
                                   <div className="overflow-y-auto flex flex-col space-y-5 overflow-x-hidden">
                                          <div onMouseEnter={() => setIsHovered(true)}
                                                 onMouseLeave={() => setIsHovered(false)} className="flex flex-col hover:bg-zinc-900 rounded-lg p-3 mr-2 items-start">
                                                 <div className="flex justify-between w-full p-2 pt-0 pl-0">
                                                        <Link href={""}>
                                                               <User
                                                                      className="hover:bg-zinc-800 p-2"
                                                                      name="Khylpe"
                                                                      description="15/10/2023"
                                                                      isFocusable={true}
                                                               /></Link>
                                                        <Dropdown
                                                               classNames={{
                                                                      base: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                                                                      arrow: "bg-default-200",
                                                               }}
                                                        >

                                                               <DropdownTrigger style={{ display: isHovered ? 'block' : 'none' }}
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
                                                 <span className="ml-14 mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
                                          </div>
                                   </div>
                                   <div className="mt-5 flex flex-row items-center space-x-3">
                                          <Textarea
                                                 placeholder="Enter your message"
                                                 className=""
                                                 variant="bordered"
                                                 color="secondary"
                                                 minRows={1}
                                          />
                                          <Button type="submit">Send</Button>
                                   </div>
                            </div>
                            <div className="w-1/4 bg-zinc-800 rounded-lg p-5 h-5/6">zz</div>
                     </div>
                     :
                     <h1>Not authorized</h1>);
};

export default ChatWithSocket;