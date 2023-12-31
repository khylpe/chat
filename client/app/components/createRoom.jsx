"use client"
import React, { useState, useEffect } from 'react';
import { Input, Textarea, Checkbox, Button, user } from "@nextui-org/react";
import PasswordInput from '../components/PasswordInput';
import { useSession } from 'next-auth/react';
import { useSocket } from './../contexts/SocketContext';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '../contexts/SnackbarContext';

const CreateRoom = () => {
       const socket = useSocket();
       const router = useRouter();
       const { showSnackbar } = useSnackbar();
       const { data: session, status } = useSession();
       const [formData, setFormData] = useState({
              roomName: '',
              roomPassword: '',
              roomDescription: '',
              requiresPassword: false,
              roomMaxUser: 2
       });
       console.log("socket in create: ", socket)

       const handleInputChange = (event) => {
              const { name, value, type, checked } = event.target;

              setFormData(prevState => ({
                     ...prevState,
                     [name]: type === "checkbox" ? checked : value
              }));
       };

       const handleSubmit = async (event) => {
              event.preventDefault();
              let dataToSend = { ...formData, username: session.user.username };
              console.log("socket: ", socket)
              await socket.timeout(50000).emit('addRoom', dataToSend, (err, reponse) => {
                     if (err) {
                            console.error("error while creating room: ", err)
                            return;
                     } else {
                            if (reponse.status === 'error') {
                                   showSnackbar({message: reponse.message, color: 'danger'});
                            } else if (reponse.status === 'success') {
                                   setFormData({
                                          roomName: '',
                                          roomPassword: '',
                                          roomDescription: '',
                                          requiresPassword: false,
                                          roomMaxUser: 2
                                   });
                                   event.target.reset();
                                   router.push('/chat/'+reponse.roomID);
                            } else {
                                   showSnackbar({message: 'Something went wrong', color: 'danger'});
                            }
                     }
              });
       };

       return (
              <div className="w-full border-small px-4 py-4 rounded-lg border-default-200 dark:border-default-100">
                     <h2 className="text-white text-2xl text-center">Create a room</h2>
                     <form onSubmit={handleSubmit}>
                            <div className="flex space-x-4 mt-5">
                                   <Input color='default' name='roomName' onChange={handleInputChange} value={formData.roomName} isRequired type="text" placeholder="My Room" label="Room Name" labelPlacement="outside"></Input>
                                   <Input min={2} onChange={handleInputChange} value={formData.roomMaxUser} color='default' name='roomMaxUser' isRequired className='w-fit' type="number" placeholder="2" label="Max User" labelPlacement="outside" />
                            </div>
                            <div className="flex flex-col mt-8">
                                   <Textarea minRows={10} labelPlacement="outside" color='default' onChange={handleInputChange} value={formData.roomDescription} name="roomDescription" id="" cols="30" rows="10" label="description" placeholder='Your description'></Textarea>
                                   <div className="flex flex-row mt-14 justify-between">
                                          <Checkbox
                                                 checked={formData.requiresPassword}
                                                 onChange={handleInputChange}
                                                 color='secondary'
                                                 name='requiresPassword'
                                          >
                                                 Require a password
                                          </Checkbox>
                                          <PasswordInput
                                                 // if checkbox is checked, make it required, else not required
                                                 isRequired={formData.requiresPassword}
                                                 labelPlacement="outside"
                                                 name="roomPassword"
                                                 placeholder=""
                                                 value={formData.roomPassword}
                                                 onChange={handleInputChange}
                                                 className="max-w-xs w-fit"
                                                 color='default'
                                                 // ... other props
                                                 disabled={!formData.requiresPassword}
                                          />
                                   </div>
                                   <Button className='mt-10' color='default' type='submit'>Create</Button>
                            </div>
                     </form>
              </div>
       );
}

export default CreateRoom;
