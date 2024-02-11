"use client";
import React, { useState } from "react";
import { Button, Input, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { WhiteLogo, BlackLogo } from "@/components/logos";
import { useTheme } from 'next-themes';
import signIn from "@/firebase/auth/login";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { on } from "events";
import auth from "@/firebase/config";
import signInWithGoogle from "@/firebase/auth/google";
interface CustomError {
       code: string;
       message: string;
       statusCode: number;
}
export default function LoginComponent() {
       const router = useRouter();
       const { resolvedTheme } = useTheme();
       const [email, setEmail] = useState("");
       const [password, setPassword] = useState("");
       const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
       const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

       const [loginError, setLoginError] = useState('');
       const [isLoading, setIsLoading] = useState(false);

       const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              setIsLoading(true);
              setLoginError('');

              if (!email || !password || email === '' || password === '' || email === null || password === null || email === undefined || password === undefined || email.trim() === '' || password.trim() === '' || email.length === 0 || password.length === 0) {
                     setIsLoading(false);
                     return toast.error('Please fill in all the fields', { position: 'top-left', theme: resolvedTheme });
              }

              try {
                     const response = await signIn(email, password);
                     if (response.statusCode !== 200) {
                            toast.error(response.message, { position: 'top-left', theme: resolvedTheme });
                     } else {
                            const currentUser = auth.currentUser;
                            const displayName = currentUser?.displayName;
                            const email = currentUser?.email;

                            let welcomeMessage = "Welcome!";
                            if (displayName) {
                                   welcomeMessage = `Welcome ${displayName}!`;
                            } else if (email) {
                                   welcomeMessage = `Welcome ${email}!`;
                            }

                            if (welcomeMessage) {
                                   toast.success(welcomeMessage, { position: 'top-left', theme: resolvedTheme });
                            }
                            router.replace('/home');
                     }
              } catch (error) {
                     let errorMessage = 'An unexpected error occurred during login.';

                     if (error instanceof Error) {
                            console.log("🚀 ~ handleLogin ~ error:", error);
                            errorMessage = error.message;
                     }
                     setLoginError(errorMessage); // Update the state for other uses, if necessary
                     toast.error(errorMessage, { position: 'top-left', theme: resolvedTheme }); // Use the local variable instead
              }

              finally {
                     setIsLoading(false);
              }
       };

       const handleGoogleLogin = async () => {
              setIsLoading(true);
              try {
                     const response = await signInWithGoogle();
                     if (response.statusCode !== 200) {
                            toast.error(response.message, { position: 'top-left', theme: resolvedTheme });
                     } else {
                            const currentUser = auth.currentUser;
                            const displayName = currentUser?.displayName;
                            const email = currentUser?.email;

                            let welcomeMessage = "Welcome!";
                            if (displayName) {
                                   welcomeMessage = `Welcome ${displayName}!`;
                            } else if (email) {
                                   welcomeMessage = `Welcome ${email}!`;
                            }

                            if (welcomeMessage) {
                                   toast.success(welcomeMessage, { position: 'top-left', theme: resolvedTheme });
                            }
                            router.replace('/home');
                     }
              } catch (error) {
                     let errorMessage = 'An unexpected error occurred during login.';

                     if (error instanceof Error) {
                            console.log("🚀 ~ handleGoogleLogin ~ error:", error);
                            errorMessage = error.message;
                     }
                     setLoginError(errorMessage); // Update the state for other uses, if necessary
                     toast.error(errorMessage, { position: 'top-left', theme: resolvedTheme }); // Use the local variable instead
              }

              finally {
                     setIsLoading(false);
              }
       }

       return (
              <div
                     className="flex h-screen w-screen items-center justify-start overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-8"
                     style={{
                            backgroundImage: resolvedTheme === "light" ? "url(/images/login-light-bg.jpg)" : "url(/images/login-dark-bg.jpg)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                     }}
              >
                     {/* Brand Logo */}
                     <div className="absolute right-10 top-10">
                            <div className="flex items-center">
                                   {resolvedTheme === "light" ? <BlackLogo width={60} height={60} /> : <WhiteLogo width={60} height={60} />}
                            </div>
                     </div>

                     {/* Login Form */}
                     <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-2xl">
                            <p className="pb-2 text-3xl font-medium">Log In</p>
                            <form className="flex flex-col gap-3" onSubmit={handleLogin}>
                                   <Input
                                          label="Email Address"
                                          name="email"
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                          type="email"
                                          variant="bordered"
                                          isRequired
                                          isDisabled={isLoading}
                                          size="lg"
                                   />
                                   <Input
                                          endContent={
                                                 <button type="button" onClick={togglePasswordVisibility}>
                                                        {isPasswordVisible ? (
                                                               <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
                                                        ) : (
                                                               <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
                                                        )}
                                                 </button>
                                          }
                                          label="Password"
                                          isRequired
                                          isDisabled={isLoading}
                                          name="password"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          type={isPasswordVisible ? "text" : "password"}
                                          variant="bordered"
                                          size="lg"
                                   />
                                   <Button isLoading={isLoading} isDisabled={isLoading} color="primary" type="submit" size="lg">
                                          Log In
                                   </Button>
                            </form>
                            <div className="flex items-center gap-4 py-2">
                                   <Divider className="flex-1" />
                                   <p className="shrink-0 text-tiny text-default-500">OR</p>
                                   <Divider className="flex-1" />
                            </div>
                            <Button
                                   startContent={<Icon icon="flat-color-icons:google" width={24} />}
                                   variant="bordered"
                                   size="lg"
                                   onClick={handleGoogleLogin}
                            >
                                   Continue with Google
                            </Button>
                            {/* <Button
                                   startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
                                   variant="bordered"
                                   size="lg"
                            >
                                   Continue with Github
                            </Button> */}
                            <p className="text-center text-large">
                                   Need to create an account?&nbsp;
                                   <Link href="/signup" size="lg">
                                          Sign Up
                                   </Link>
                            </p>
                     </div>
              </div>
       );
}
