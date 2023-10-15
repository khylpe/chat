"use client"
// chat/[roomID]/page.jsx
import { useSocket } from "@/app/contexts/SocketContext"
import { useSession } from "next-auth/react"
import { SocketProvider } from "@/app/contexts/SocketContext";
import { useEffect, useState } from "react";
import Snackbar from "@/app/components/snackbar";
import { Textarea } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";
import { FaUserAlt } from "react-icons/fa";
import { User } from "@nextui-org/react";

const ChatWithSocket = ({ params }) => (
       <SocketProvider>
              <Chat roomID={params.roomID} />
       </SocketProvider>
);

const Chat = ({ roomID }) => {
       const { data: session, status } = useSession();
       const username = session?.user?.username;
       const socket = useSocket();
       const [isUserAuthorized, setIsUserAuthorized] = useState(null);

       // For snackbar component
       const [showSnackbar, setShowSnackbar] = useState(false);
       const [sncackbarMessage, setSnackbarMessage] = useState('');
       const [snackbarColor, setSnackbarColor] = useState('primary');
       const [snackbarKey, setSnackbarKey] = useState(0);

       useEffect(() => {
              if (!username || !socket) return;

              const checkAuthorization = async () => {
                     try {
                            const isAuthorizedResponse = await checkIfUserAuthorized(username, roomID, socket);
                            setIsUserAuthorized(isAuthorizedResponse);
                     } catch (error) {
                            setSnackbarMessage(error.message);
                            setSnackbarColor('danger');
                            setShowSnackbar(true);
                            setSnackbarKey(prevKey => prevKey + 1);  // Increment the key
                     }
              };

              checkAuthorization();
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

       if (isUserAuthorized === null) return null;  // or some loading state
       return (
              isUserAuthorized ?
                     <div className="flex-grow flex flex-row space-x-7 p-5 h-screen">
                            <div className="w-3/4 bg-zinc-800 rounded-lg p-5 h-5/6 flex flex-col justify-end">
                                   <div className="overflow-y-auto flex flex-col space-y-7">
                                          <div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div>
                                          <div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div>
                                          <div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
                                          </div><div className="flex flex-col justify-start items-start">
                                                 <User
                                                        name="Khylpe"
                                                        description="15/10/2023"
                                                 />
                                                 <span className="ml-14">Bonjour</span>
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