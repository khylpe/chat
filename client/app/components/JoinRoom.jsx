import React, { useEffect } from 'react';
import { Input, Divider, ScrollShadow, Listbox, ListboxItem, Chip, Button } from "@nextui-org/react";
import io from 'socket.io-client';
import { useSocket } from './../contexts/SocketContext';
import { Accordion, AccordionItem } from "@nextui-org/react";
import { FaLock, FaLockOpen, FaSearch } from "react-icons/fa";

const JoinRoom = () => {
       const [searchTerm, setSearchTerm] = React.useState('');
       const [filteredRooms, setFilteredRooms] = React.useState([]);
       const socket = useSocket();
       const [rooms, setRooms] = React.useState([]);

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
                            console.error(err);
                            return;
                     } else {
                            if (response.status === 'success') {
                                   console.log("rooms from loading : ", response.rooms)
                                   setRooms(response.rooms);
                            } else if(response.status === 'error'){
                                   alert(response.message);
                            } else{
                                   alert('Something went wrong');
                            }
                     }
              });

              socket.on('updateRooms', (rooms) => {
                     console.log("rooms from update : ", rooms)
                     setRooms(rooms);

              });

              return () => {
                     socket.off('updateRooms');
              };
       }, [socket]);

       return (
              <div className="w-full border-small px-4 py-4 rounded-3xl border-default-200 dark:border-default-100">
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
                            color='secondary'
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
                                                        <Chip color="primary">{room.owner}</Chip>
                                                        <span>{room.description}</span>
                                                        <div className="flex flex-row justify-between">
                                                               <span className="text-default-500">{room.creationDateAndTime}</span>
                                                               <Button color={room.requiresPassword ? "warning" : "secondary"} endContent={room.requiresPassword ? <FaLock></FaLock> : <FaLockOpen></FaLockOpen>}>
                                                                      {room.requiresPassword ? 'Join (Password Required)' : 'Join'}
                                                               </Button>
                                                        </div>
                                                 </div>
                                          </AccordionItem>
                                   ))}
                            </Accordion>
                     </ScrollShadow>
              </div>
       );
}

export default JoinRoom;
