"use client"
import JoinRoom from './../components/JoinRoom';
import CreateRoom from './../components/CreateRoom';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useSession } from 'next-auth/react';
import UserAlreadyInRoom from '../components/userAlreadyInRoom';


export default function CreateOrJoin() {
       const socket = useSocket();
       const [isUserInRoom, setIsUserInRoom] = useState(false);
       const [isUserAdmin, setIsUserAdmin] = useState(false);
       const [roomInfo, setRoomInfo] = useState({
              id: String,
              name: String,
              description: String,
              maxUsers: Number,
              requiresPassword: Boolean,
              users: Array,
              messages: Array,
              owner: String,
              creationDateAndTime: Date,
       });
       const { data: session, status } = useSession();
       const username = session?.user?.username;

       const removeOrLeaveRoom = () => {
              isUserAdmin ?
                     socket.emit('removeRoom', { roomID: roomInfo.id, userName: username, isUserAdmin: isUserAdmin })
                     :
                     socket.emit('leaveRoom', { roomID: roomInfo.id, userName: username });
              
              setIsUserInRoom(false);
       };

       useEffect(() => {
              if (socket == null || status === "loading" || status === "unauthenticated") return;
              socket.timeout(5000).emit('checkIfUserInRoom', session.user.username, (err, response) => {
                     console.log("response from checkIfUserInRoom : ", response)
                     if (err) {
                            console.error(err);
                     } else if (response.value) {
                            setIsUserInRoom(true);
                            setRoomInfo(response.roomInfo);
                            setIsUserAdmin(response.isUserAdmin);
                     }
              });

       }, [socket, status]);

       return (
              <div>
                     {isUserInRoom ? (
                            <UserAlreadyInRoom roomInfo={roomInfo} isUserAdmin={isUserAdmin} removeOrLeaveRoom={removeOrLeaveRoom}></UserAlreadyInRoom>
                     ) : (
                            <div className="flex flex-row mt-20 justify-center m-20 space-x-10">
                                   <JoinRoom />
                                   <CreateRoom /></div>

                     )}
                     {/* I'll add modal later */}
              </div>
       );
}