import React, { useState, useEffect } from 'react';
import { Input, Textarea, Checkbox, Button } from "@nextui-org/react";
import PasswordInput from '../components/PasswordInput';
import { useSession } from 'next-auth/react';
import { useSocket } from './../contexts/SocketContext';

const CreateRoom = () => {
       const socket = useSocket();
       useEffect(() => {
              if (socket == null) return;

              return () => {
                     // remove listeners
              };
       }, [socket]);

       const { data: session, status } = useSession();
       const [isDisabled, setIsDisabled] = useState(true);
       const [formData, setFormData] = useState({
              roomName: '',
              roomPassword: '',
              roomDescription: '',
              requiresPassword: !isDisabled,
              roomMaxUser: 2
       });

       const handleInputChange = (event) => {
              const { name, value, type, checked } = event.target;

              setFormData(prevState => ({
                     ...prevState,
                     [name]: type === "checkbox" ? checked : value
              }));

              if (name === 'requiresPassword') {
                     setIsDisabled(!checked);
              }
       };

       const handleSubmit = (event) => {
              event.preventDefault();
              let dataToSend = formData;
              dataToSend['username'] = session.user.username;
              socket.emit('addRoom', (dataToSend));
              event.target.reset();
       };

       return (
              <div className="w-full border-small px-4 py-4 rounded-3xl border-default-200 dark:border-default-100">
                     <h2 className="text-white text-2xl text-center">Create a room</h2>

                     <form onSubmit={handleSubmit}>
                            <div className="flex space-x-4 mt-5">
                                   <Input color='secondary' name='roomName' onChange={handleInputChange} value={formData.roomName} isRequired type="text" placeholder="My Room" label="Room Name" labelPlacement="outside"></Input>
                                   <Input min={2} onChange={handleInputChange}  value={formData.roomMaxUser} color='secondary' name='roomMaxUser' isRequired className='w-fit' type="number" placeholder="2" label="Max User" labelPlacement="outside" />
                            </div>
                            <div className="flex flex-col mt-8">
                                   <Textarea minRows={10} labelPlacement="outside" color='secondary' onChange={handleInputChange} value={formData.roomDescription} name="roomDescription" id="" cols="30" rows="10" label="description" placeholder='Your description'></Textarea>
                                   <div className="flex flex-row mt-14 justify-between">
                                          <Checkbox
                                                 checked={!isDisabled}
                                                 onChange={handleInputChange}
                                                 color='secondary'
                                                 name='requiresPassword'
                                          >
                                                 Require a password
                                          </Checkbox>
                                          <PasswordInput
                                                 labelPlacement="outside"
                                                 name="roomPassword"
                                                 placeholder=""
                                                 value={formData.roomPassword}
                                                 onChange={handleInputChange}
                                                 className="max-w-xs w-fit"
                                                 color='secondary'
                                                 disabled={isDisabled}
                                          />
                                   </div>
                                   <Button className='mt-10' color='secondary' type='submit'>Create</Button>
                            </div>
                     </form>
              </div>
       );
}

export default CreateRoom;
