// AuthForm component
"use client"
import { useState, useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import { Switch } from "@nextui-org/react";
import PasswordInput from './PasswordInput';
import { signIn } from 'next-auth/react';
const axios = require('axios');
import { useSnackbar } from '../contexts/SnackbarContext';
require('dotenv').config();

const AuthForm = () => {

       const { setSnackbar } = useSnackbar();
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
                            // console.log("received login try in authform. credentials are : " , email , " and : ", password)
                            // Use the signIn method with the 'credentials' provider
                            const result = await signIn('credentials', {
                                   redirect: true,
                                   callbackUrl: `${process.env.NEXT_PUBLIC_CLIENT_URL}/createOrJoin`,
                                   email,
                                   password
                            });

                            if (result.error) {
                                   console.log("an error happened: ", result.error)
                            }
                     } catch (error) {
                            console.error("error while logging : ", error)
                     }
              } else {
                     try {
                            const username = formData.username;
                            console.log("server url : ", process.env.NEXT_PUBLIC_SERVER_URL)
                            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/signup`, {
                                   username: username,
                                   email: email,
                                   password: password
                            }, {
                                   withCredentials: true
                            });

                            if (response.data.status === "success") {
                                   const result = await signIn('credentials', {
                                          redirect: true,
                                          callbackUrl: `${process.env.NEXT_PUBLIC_CLIENT_URL}/createOrJoin`,
                                          email,
                                          password
                                   });
                            }
                            else {
                                   setSnackbar({
                                          message: response.data.msg || "An error occured",
                                          color: 'danger'
                                   })
                            }
                     } catch (error) {
                     }
              }
       };

       return (
              <div className="w-full max-w-sm mx-auto mt-20">
                     <form onSubmit={handleSubmit} className="shadow-md px-8 pt-6 pb-8 mb-4">
                            <h2 className='mb-5 text-center text-2xl'>{isLoginMode ? "Login" : "Signup"}</h2>
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
                                                 color='default'
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
                                          color='default'
                                   />
                            </div>
                            <div className="mb-6">
                                   <PasswordInput
                                          isRequired
                                          value={formData.password}
                                          onChange={handleInputChange}
                                          className="max-w-xs"
                                          color='default'
                                          disabled={false}
                                          name="password"

                                   />
                            </div>
                            <div className="flex justify-center">
                                   <Button
                                          size="large"
                                          type="submit"
                                          variant="ghost"
                                          color='default'
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
