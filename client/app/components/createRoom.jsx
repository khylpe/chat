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
              roomMaxUsers: 2,
              roomMaxMessages: 50, // Default value for roomMaxMessages
              roomExpiryTime: 5,   // Default value for roomExpiryTime
       });

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
              await socket.timeout(50000).emit('addRoom', dataToSend, (err, response) => {
                     if (err) {
                            console.error("error while creating room: ", err)
                            return;
                     } else {
                            if (response.status === 'error') {
                                   showSnackbar({ message: response.message, color: 'danger' });
                            } else if (response.status === 'success') {
                                   setFormData({
                                          roomName: '',
                                          roomPassword: '',
                                          roomDescription: '',
                                          requiresPassword: false,
                                          roomMaxUsers: 2,
                                          roomMaxMessages: 50,
                                          roomExpiryTime: 5,
                                   });
                                   event.target.reset();
                                   router.push('/chat/' + response.roomID);
                            } else {
                                   showSnackbar({ message: 'Something went wrong', color: 'danger' });
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
                                   <Input min={2} max={30} onChange={handleInputChange} value={formData.roomMaxUsers} color='default' name='roomMaxUsers' isRequired className='w-24' type="number" placeholder="2" label="Max Users" labelPlacement="outside" />
                            </div>
                            <div className="flex flex-col mt-8 space-y-5">
                                   <Textarea minRows={3} maxRows={8} maxLength={1000} labelPlacement="outside" color='default' onChange={handleInputChange} value={formData.roomDescription} name="roomDescription" label="Description" placeholder='Your description'></Textarea>
                                   <Input onChange={handleInputChange} value={formData.roomMaxMessages} defaultValue='50' min={10} max={200} name='roomMaxMessages' isRequired type="number" placeholder="50" label="Max Messages" labelPlacement="outside-left" ></Input>
                                   <Input min={1} max={60} defaultValue='5' name='roomExpiryTime' onChange={handleInputChange} value={formData.roomExpiryTime} isRequired type="number" placeholder="min" label="Expiry time" labelPlacement="outside-left"></Input>

                                   <div className="flex flex-row mt-14 justify-between items-center">
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
                                                 name="roomPassword"
                                                 placeholder="Password"
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
