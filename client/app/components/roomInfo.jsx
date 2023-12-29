"use client"
import React, { useEffect, useState } from 'react';
import { Chip, Button, Tooltip } from "@nextui-org/react"
import { HiOutlineStatusOnline, HiStatusOffline } from "react-icons/hi";
import { useSession } from "next-auth/react"
import { IoIosLogOut } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { useSocket } from "../contexts/SocketContext";
import { useRouter } from 'next/navigation';

export default function RoomInfo({ roomName, owner, description, users, maxUsers, roomID, maxMessages, messageCount, expiryTime, expiryDate }) {
       const [timeRemaining, setTimeRemaining] = useState(Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / 1000));
       const { data: session, status } = useSession();
       const username = session?.user?.username;
       const socket = useSocket();
       const router = useRouter();

       // update time remaining every second
       useEffect(() => {
              const interval = setInterval(() => {
                     setTimeRemaining(prevTime => {
                            if (prevTime <= 0) {
                                   clearInterval(interval);
                                   return 0;
                            } else {
                                   return prevTime - 1;
                            }
                     });
              }, 1000);

              return () => clearInterval(interval);
       }, []);

       // update time remaining when expiry date changes
       useEffect(() => {
              setTimeRemaining(Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / 1000));
       }, [expiryDate]);

       
       const formatTime = seconds => {
              const minutes = Math.floor(seconds / 60);
              const remainingSeconds = seconds % 60;
              return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
       };

       const handleLeaveRoom = () => {
              socket.emit("leaveRoom", { roomID: roomID, username: username })
              router.push('/createOrJoin'); // Redirecting user
       }

       const handleDeleteRoom = () => {
              socket.emit('removeRoom', { roomID: roomID, username: username })
              router.push('/createOrJoin'); // Redirecting user
       }

       return (<>
              <div className="w-1/4 bg-zinc-800 rounded-lg p-5 h-5/6">
                     <div className="flex flex-col space-y-5 h-1/2">
                            <div className="flex flex-row justify-between space-x-3">
                                   <span className="text-2xl font-bold break-all">{roomName}</span>
                                   <span className="text-lg">Created by <Chip size="lg">{owner}</Chip></span>
                            </div>
                            <span className="text-lg">{description}</span>
                            <div className="space-y-3 h-full">
                                   <div className="text-xl w-full flex flex-row justify-between">User list <span className="font-bold"> {users.length}/{maxUsers}</span></div>
                                   <div className="flex flex-col space-y-2 h-full overflow-y-auto">
                                          {users.map((user, index) => {
                                                 return (
                                                        <div key={index} className="flex flex-row items-center">
                                                               <Chip color={(owner === user.username) && user.role === "admin" ? "primary" : "default"}>{user.username}</Chip>
                                                               {user.status === "online" ? <HiOutlineStatusOnline className="text-green-500 ml-2 text-2xl" /> : <HiStatusOffline className="text-red-500 ml-2 text-2xl" />}
                                                        </div>
                                                 )
                                          })}
                                   </div>
                                   <div className="flex flex-col justify-end h-full items-end">
                                          <div className="flex flex-row">
                                                 <span className="text-xl"><span className="font-bold">{messageCount}/{maxMessages}</span></span>
                                                 <span className="text-xl ml-2"><span className="font-bold">{formatTime(timeRemaining)}</span></span>
                                                 {username === owner ? (
                                                        <Tooltip showArrow={true} content="Delete room">
                                                               <Button size="lg" onClick={() => { handleDeleteRoom() }} color="danger" isIconOnly>
                                                                      <FaTrash size={"1.4rem"}>
                                                                      </FaTrash >
                                                               </Button>
                                                        </Tooltip>)
                                                        :
                                                        (<Tooltip showArrow={true} content="Leave room">
                                                               <Button onClick={() => { handleLeaveRoom() }} size="lg" color="danger" isIconOnly>
                                                                      <IoIosLogOut size={"1.4rem"}></IoIosLogOut>
                                                               </Button>
                                                        </Tooltip>)}
                                          </div>
                                   </div>
                            </div>
                     </div>
              </div>
       </>
       )
}