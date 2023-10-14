"use client"
// chat/[roomID]/page.jsx
import { useSocket } from "@/app/contexts/SocketContext"
import { useSession } from "next-auth/react"
import { SocketProvider } from "@/app/contexts/SocketContext";
import { useEffect, useState } from "react";

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

       useEffect(() => {
              if (!username || !socket) return;

              const checkAuthorization = async () => {
                     try {
                            const isAuthorizedResponse = await checkIfUserAuthorized(username, roomID, socket);
                            setIsUserAuthorized(isAuthorizedResponse);
                     } catch (error) {
                            console.error(error);
                     }
              };

              checkAuthorization();
       }, [username, roomID, socket]);

       const checkIfUserAuthorized = (username, roomID, socket) => {
              return new Promise((resolve, reject) => {
                     socket.timeout(5000).emit('checkIfUserAuthorized', { userName: username, roomID: roomID }, (err, response) => {

                            if (err) {
                                   reject(err);
                            } else {
                                   resolve(response.status === 'success');
                            }
                     });
              });
       };

       if (isUserAuthorized === null) return null;  // or some loading state
       return isUserAuthorized ? <h1>Authorized</h1> : <h1>Not authorized</h1>;
};

export default ChatWithSocket;