import React, { useState, useEffect } from 'react';
import { Input, Textarea, Checkbox, Button } from "@nextui-org/react";
import PasswordInput from '../components/PasswordInput';
import { useSession } from 'next-auth/react';
import { useSocket } from './../contexts/SocketContext';

const CreateRoom = () => {
       const socket = useSocket();
       const { data: session, status } = useSession();
       const [formData, setFormData] = useState({
              roomName: '',
              roomPassword: '',
              roomDescription: '',
              requiresPassword: false,
              roomMaxUser: 2
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
              await socket.timeout(50000).emit('addRoom', dataToSend, (err, reponse) => {
                     if (err) {
                            console.error("test", err);
                            return;
                     } else {
                            if (reponse.status === 'error') {
                                   alert(reponse.message);
                            } else if (reponse.status === 'success') {
                                   setFormData({
                                          roomName: '',
                                          roomPassword: '',
                                          roomDescription: '',
                                          requiresPassword: false,
                                          roomMaxUser: 2
                                   });
                                   event.target.reset();
                                   window.location.href = '/chat/'+reponse.roomID;
                            } else {
                                   alert('Something went wrong regerg');
                            }
                     }
              });
       };

       return (
              <div className="w-full border-small px-4 py-4 rounded-3xl border-default-200 dark:border-default-100">
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
                                                 color='default'
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
