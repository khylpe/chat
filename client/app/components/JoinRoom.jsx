import React, { useEffect, useState } from 'react';
import { Input, Divider, ScrollShadow, Chip, Button } from "@nextui-org/react";
import { useSocket } from './../contexts/SocketContext';
import { Accordion, AccordionItem } from "@nextui-org/react";
import { FaLock, FaLockOpen, FaSearch } from "react-icons/fa";
import { useSession } from 'next-auth/react';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useRouter } from 'next/navigation';

const JoinRoom = () => {
       const { showSnackbar } = useSnackbar();
       const router = useRouter();
       const socket = useSocket();
       const { data: session } = useSession();
       const username = session?.user?.username;
       const [searchTerm, setSearchTerm] = useState('');
       const [filteredRooms, setFilteredRooms] = useState([]);
       const [rooms, setRooms] = useState([]);
       const [passwordInputForRoom, setPasswordInputForRoom] = useState(null);
       const [enteredPassword, setEnteredPassword] = useState('');

       useEffect(() => {
              const result = rooms.filter(room =>
                     room.name.toLowerCase().includes(searchTerm.toLowerCase())
              );
              setFilteredRooms(result);
       }, [searchTerm, rooms]);

       useEffect(() => {
              if (socket == null) return;

              socket.timeout(5000).emit('getRooms', (err, response) => {
                     if (err) {
                            return;
                     } else {
                            if (response.status === 'success') {
                                   setRooms(response.rooms);
                            } else if (response.status === 'error') {
                                   showSnackbar({ message: response.message, color: 'danger' });
                            } else {
                                   showSnackbar({ message: 'Something went wrong', color: 'danger' });
                            }
                     }
              });

              socket.on('updateRooms', (rooms) => {
                     setRooms(rooms);
              });

              socket.on('roomRemoved', (roomID) => {
                     setRooms(rooms.filter(room => room.id !== roomID));
              });

              return () => {
                     socket.off('updateRooms');
                     socket.off('roomRemoved');
              };
       }, [socket]);

       const handleJoin = async (roomID, requiresPassword) => {
              if (requiresPassword) {
                     setPasswordInputForRoom(roomID);
                     return;
              }

              await socket.emit('joinRoom', { roomID: roomID, username: username, password: null }, (err, response) => {
                     if (err) {
                            return;
                     } else {
                            if (response.status === 'success') {
                                   setRooms(response.rooms);
                                   router.push('/chat/' + response.roomID);
                            } else if (response.status === 'error') {
                                   showSnackbar({ message: response.message, color: 'danger' });
                            } else {
                                   showSnackbar({ message: 'Something went wrong', color: 'danger' });
                            }
                     }
              });
       }

       const handlePasswordSubmit = (roomID) => {
              showSnackbar({ message: 'Joining room...', color: 'info' });

              socket.emit('joinRoom', { roomID: roomID, username: username, password: enteredPassword }, (err, response) => {
                     if (err) {
                            showSnackbar({ message: 'Something went wrong', color: 'danger' });
                            return;
                     } else {
                            if (response.status === 'success') {
                                   setRooms(response.rooms);
                                   router.push('/chat/' + response.roomID);
                            } else if (response.status === 'error') {
                                   showSnackbar({ message: response.message, color: 'danger' });
                            } else {
                                   showSnackbar({ message: 'Something went wrong', color: 'danger' });
                            }
                     }
              });
              setEnteredPassword('');
       };

       return (
              <div className="w-full border-small px-4 py-4 rounded-lg border-default-200 dark:border-default-100">
                     <h2 className="text-white text-2xl text-center">Join a room</h2>
                     <Input
                            startContent={<FaSearch></FaSearch>}
                            className='p-3 mt-5'
                            size='lg'
                            variant='flat'
                            type="search"
                            name=""
                            id=""
                            label="Find a room"
                            color='default'
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                     >

                     </Input>
                     <div className='mx-5 my-4'>
                            <Divider className="" />
                     </div>

                     <ScrollShadow size={100} className="h-[400px]">
                            <Accordion variant="splitted">
                                   {filteredRooms.map((room) => (
                                          <AccordionItem
                                                 key={room.id}
                                                 aria-label={room.name}
                                                 title={room.name}
                                                 indicator={<span>{`${room.users ? room.users.length : 0}/${room.maxUsers}`}</span>}
                                          >
                                                 <div className="flex flex-col space-y-5">
                                                        <Chip color="default">{room.owner}</Chip>
                                                        <span>{room.description}</span>
                                                        <div className="flex flex-row justify-between">
                                                               <span className="text-default-500">{room.creationDateAndTime}</span>
                                                               {passwordInputForRoom === room.id ?
                                                                      (<div className='flex flex-row space-x-3'>
                                                                             <Input
                                                                                    className=''
                                                                                    type="password"
                                                                                    placeholder="Enter room password"
                                                                                    value={enteredPassword}
                                                                                    onChange={e => setEnteredPassword(e.target.value)}
                                                                             />
                                                                             <Button onClick={() => handlePasswordSubmit(room.id)}>Join</Button>
                                                                      </div>)
                                                                      :
                                                                      (<Button onClick={() => handleJoin(room.id, room.requiresPassword)} color={room.requiresPassword ? "warning" : "success"} endContent={room.requiresPassword ? <FaLock></FaLock> : <FaLockOpen></FaLockOpen>}>
                                                                             {room.requiresPassword ? 'Join (Password Required)' : 'Join'}
                                                                      </Button>)
                                                               }
                                                        </div>
                                                 </div>
                                          </AccordionItem>
                                   ))}
                            </Accordion>
                     </ScrollShadow>
              </div >
       );
}

export default JoinRoom;
