// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
       const [socket, setSocket] = useState(null);
       const { data: session, status } = useSession();
       useEffect(() => {
              const newSocket = io('http://localhost:3006', {
                     autoConnect: false,
              });
              setSocket(newSocket);
              return () => newSocket.close(); // Disconnect on cleanup
       }, []);

       useEffect(() => { // Connect/disconnect socket on auth status change
              if (socket == null) return;
              if (status === 'authenticated') {
                     console.log(session.user.username)
                     socket.auth = { username: session.user.username };
                     console.log("auth : ",socket.auth)
                     socket.connect();
              } else {
                     socket.disconnect();
              }
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
