// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
require('dotenv').config();

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
       const [socket, setSocket] = useState(null);
       const { data: session, status } = useSession();
       useEffect(() => {
              const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
                     autoConnect: false,
              });
              setSocket(newSocket);
              return () => newSocket.close(); // Disconnect on cleanup
       }, []);

       useEffect(() => { // Connect/disconnect socket on auth status change
              if (socket == null) return;
              if (status === 'authenticated') {
                     socket.auth = { username: session.user.username };
                     // check if socket is already connected
                     if (!socket.connected) {
                            socket.connect();
                     } else {

                     }

              } else {
                     socket.disconnect();
              }

              // socket.io.on("error", (error) => {
              //        throw new Error(error.message);
              // });

              return () => {
                     socket.off("connect");
              };
       }, [socket, status]);

       return (
              <SocketContext.Provider value={socket}>
                     {children}
              </SocketContext.Provider>
       );
};

export const useSocket = () => {
       return useContext(SocketContext);
};
