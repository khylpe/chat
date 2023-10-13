// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
       const [socket, setSocket] = useState(null);

       useEffect(() => {
              const newSocket = io('http://localhost:3006');
              setSocket(newSocket);
              return () => newSocket.close(); // Disconnect on cleanup
       }, []);

       return (
              <SocketContext.Provider value={socket}>
                     {children}
              </SocketContext.Provider>
       );
};

export const useSocket = () => {
       return useContext(SocketContext);
};
