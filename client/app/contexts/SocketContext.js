"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
       const [socket, setSocket] = useState(null);
       const { data: session, status } = useSession();

       useEffect(() => {
              const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
                     path: process.env.NEXT_PUBLIC_SOCKET_PATH,
                     // withCredentials: true,
              });

              setSocket(newSocket);

              // Event listeners
              newSocket.on('connect', () => {
                     console.log('Connected to socket server, socket: ', socket);
              });

              // Clean up the connection
              return () => {
                     newSocket.disconnect();
              };
       }, []);

       useEffect(() => {
              if (!socket) return;

              const handleConnect = () => console.log("Socket connected.");
              const handleError = error => console.error("Socket error:", error);
              const handleReconnectAttempt = () => console.log("Attempting to reconnect...");
              const handleReconnect = () => console.log("Socket reconnected.");
              const handleReconnectError = error => console.error("Reconnect error:", error);
              const handleReconnectFailed = () => console.log("Reconnection failed.");

              socket.on("connect", handleConnect);
              socket.on("error", handleError);
              socket.on("reconnect_attempt", handleReconnectAttempt);
              socket.on("reconnect", handleReconnect);
              socket.on("reconnect_error", handleReconnectError);
              socket.on("reconnect_failed", handleReconnectFailed);

              if (session?.user?.username && status === "authenticated") {
                     socket.auth = { username: session.user.username };
                     if (!socket.connected) {
                            console.log("socket not connected yet, connecting it.")
                            socket.connect();
                     }
              } else {
                     console.log("user not authenticated. Disconnecting socket.")
                     socket.disconnect();
              }

              return () => {
                     console.log("unbinding listeners")
                     socket.off("connect", handleConnect);
                     socket.off("error", handleError);
                     socket.off("reconnect_attempt", handleReconnectAttempt);
                     socket.off("reconnect", handleReconnect);
                     socket.off("reconnect_error", handleReconnectError);
                     socket.off("reconnect_failed", handleReconnectFailed);
              };
       }, [socket, session]);

       return (
              <SocketContext.Provider value={socket}>
                     {children}
              </SocketContext.Provider>
       );
};

export const useSocket = () => {
       return useContext(SocketContext);
};
