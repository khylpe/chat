// AuthForm component
"use client"
import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { Switch } from "@nextui-org/react";
import PasswordInput from './PasswordInput';
import { signIn } from 'next-auth/react';
const axios = require('axios');

const AuthForm = () => {
       const [isLoginMode, setIsLoginMode] = useState(true);
       const [formData, setFormData] = useState({
              email: '',
              password: '',
              username: ''
       });

       const handleInputChange = (event) => {
              const { name, value } = event.target;
              setFormData(prevState => ({
                     ...prevState,
                     [name]: value
              }));
       };

       const handleSubmit = async (event) => {
              event.preventDefault();
              const email = formData.email;
              const password = formData.password

              if (isLoginMode) {
                     try {
                            // Use the signIn method with the 'credentials' provider
                            const result = await signIn('credentials', {
                                   redirect: true,
                                   callbackUrl: 'http://localhost:3000/CreateOrJoin',
                                   email,
                                   password
                            });

                            if (result.error) {
                            }
                     } catch (error) {
                            console.error("Error:", error.response?.data?.msg || error.message);
                     }
              } else {
                     try {
                            const username = formData.username;
                            const response = await axios.post('http://localhost:3006/signup', {
                                   username: username,
                                   email: email,
                                   password: password
                            }, {
                                   withCredentials: true
                            });
                     } catch (error) {
                            console.error("Error:", error.response.data.msg);
                     }
              }
       };

       return (
              <div className="w-full max-w-sm mx-auto mt-20">
                     <form onSubmit={handleSubmit} className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className='mb-5 text-center'>Login</h2>
                            {!isLoginMode && (
                                   <div className="mb-4">
                                          <Input
                                                 isRequired
                                                 type="text"
                                                 label="Username"
                                                 name="username"
                                                 value={formData.username}
                                                 onChange={handleInputChange}
                                                 className="max-w-xs"
                                                 color='secondary'
                                          />
                                   </div>
                            )}
                            <div className="mb-4">
                                   <Input
                                          isRequired
                                          type="email"
                                          label="Email"
                                          name="email"
                                          onChange={handleInputChange}
                                          value={formData.email}
                                          className="max-w-xs"
                                          color='secondary'
                                   />
                            </div>
                            <div className="mb-6">
                                   <PasswordInput
                                          isRequired
                                          value={formData.password}
                                          onChange={handleInputChange}
                                          className="max-w-xs"
                                          color='secondary'
                                          disabled={false}
                                          name="password"
                                          
                                   />
                            </div>
                            <div className="flex justify-center">
                                   <Button
                                          size="large"
                                          type="submit"
                                          variant="ghost"
                                          color='secondary'
                                   >
                                          {isLoginMode ? 'Log in' : 'Sign up'}
                                   </Button>
                            </div>
                     </form>
                     <div className="text-center">
                            <Switch defaultSelected={0} onChange={() => setIsLoginMode(prevMode => !prevMode)} color="secondary">I dont have an account</Switch>
                     </div>
              </div>
       );
}

export default AuthForm;
