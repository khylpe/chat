"use client"
import JoinRoom from './../components/JoinRoom';
import CreateRoom from './../components/CreateRoom';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useSession } from 'next-auth/react';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Chip, Accordion, AccordionItem } from "@nextui-org/react";
import { FaLock, FaLockOpen, FaSearch } from "react-icons/fa";


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

       const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
              <div className="">
                     {isUserInRoom ? (
                            <div>
                                   <Modal isOpen={true} isDismissable={false} scrollBehavior="inside" backdrop="blur" defaultOpen hideCloseButton>
                                          <ModalContent>
                                                 {(onClose) => (
                                                        <>
                                                               <ModalHeader className="flex flex-col gap-1">Room Found !</ModalHeader>
                                                               <ModalBody>
                                                                      More information :

                                                                      {/* Display all properties of roomInfo */}
                                                                      <Accordion variant='bordered'>
                                                                             <AccordionItem
                                                                                    key={roomInfo.id}
                                                                                    aria-label={roomInfo.name}
                                                                                    title={roomInfo.name}
                                                                                    indicator={<span>{`${roomInfo.users ? roomInfo.users.length : 0}/${roomInfo.maxUsers}`}</span>}
                                                                             >

                                                                                    <div className="flex flex-col space-y-5">
                                                                                           {isUserAdmin ? (
                                                                                                  <div>You are the <span className='font-extrabold'>admin</span> of this room</div>
                                                                                           ) : (
                                                                                                  <div className='space-y-3'>
                                                                                                         <div>The owner of the room is<Chip color="primary">{roomInfo.owner}</Chip>
                                                                                                         </div>
                                                                                                  </div>
                                                                                           )}
                                                                                           <span>{roomInfo.description}</span>
                                                                                           <div className="flex flex-row justify-between">
                                                                                                  <span className="text-default-500">{roomInfo.creationDateAndTime}</span>
                                                                                                  <Button disableRipple disableAnimation color={roomInfo.requiresPassword ? "warning" : "secondary"} endContent={roomInfo.requiresPassword ? <FaLock></FaLock> : <FaLockOpen></FaLockOpen>}>
                                                                                                         {roomInfo.requiresPassword ? 'Password Required' : 'No password'}
                                                                                                  </Button>
                                                                                           </div>
                                                                                    </div>
                                                                             </AccordionItem>
                                                                      </Accordion>

                                                               </ModalBody>

                                                               <ModalFooter>
                                                                      <Button color="danger" variant="light" onPress={onClose}>
                                                                             Delete room
                                                                      </Button>
                                                                      <Button color="primary" onPress={onClose}>
                                                                             Join
                                                                      </Button>
                                                               </ModalFooter>
                                                        </>
                                                 )}
                                          </ModalContent>
                                   </Modal>

                            </div>
                     ) : (
                            <div className="flex flex-row mt-20 justify-center m-20 space-x-10">
                                   <JoinRoom />
                                   <CreateRoom /></div>

                     )}
                     {/* I'll add modal later */}
              </div>
       );
}