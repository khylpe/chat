"use client";

import React from "react";
import { Button, Input, Link, Divider, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { WhiteLogo, BlackLogo } from "@/components/logos";
import { useTheme } from 'next-themes'
import signUp from "@/firebase/auth/signup";
import { toast } from 'react-toastify';
import signIn from "@/firebase/auth/login";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth"; // Make sure to import these
import auth from "@/firebase/config"; // Ensure you have a reference to your Firebase auth object
import { useRouter } from "next/navigation"; import { FirebaseError } from 'firebase/app';

export default function Component() {
       const router = useRouter();
       const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
       const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);
       const [email, setEmail] = React.useState("");
       const [password, setPassword] = React.useState("");
       const [confirmPassword, setConfirmPassword] = React.useState("");
       const [[page, direction], setPage] = React.useState([0, 0]);
       const [isEmailValid, setIsEmailValid] = React.useState(true);
       const [isPasswordValid, setIsPasswordValid] = React.useState(true);
       const [isConfirmPasswordValid, setIsConfirmPasswordValid] = React.useState(true);
       const { resolvedTheme } = useTheme()

       const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
       const toggleConfirmPasswordVisibility = () =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

       const variants = {
              enter: (direction: number) => ({
                     x: direction > 0 ? 20 : -20,
                     opacity: 0,
              }),
              center: {
                     zIndex: 1,
                     x: 0,
                     opacity: 1,
              },
              exit: (direction: number) => ({
                     zIndex: 0,
                     x: direction < 0 ? 20 : -20,
                     opacity: 0,
              }),
       };

       const paginate = (newDirection: number) => {
              setPage([page + newDirection, newDirection]);
       };

       const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              if (page === 0) {
                     handleEmailSubmit();
              } else if (page === 1) {
                     handlePasswordSubmit();
              } else {
                     handleConfirmPasswordSubmit();
              }
       };

       const handleEmailSubmit = () => {
              if (!email.length) {
                     setIsEmailValid(false);
                     return;
              }
              setIsEmailValid(true);
              paginate(1);
       };

       const handlePasswordSubmit = () => {
              if (!password.length) {
                     setIsPasswordValid(false);
                     return;
              }
              setIsPasswordValid(true);
              paginate(1);
       };

       const handleConfirmPasswordSubmit = async () => {
              if (!confirmPassword.length || confirmPassword !== password) {
                     setIsConfirmPasswordValid(false);
                     return;
              }
              setIsConfirmPasswordValid(true);

              try {
                     const response = await signUp(email, password);
                     if (response && response.uid) {
                            try {
                                   const userCredential = await signIn(email, password);
                                   if (!userCredential.ok) {
                                          switch (userCredential.status) {
                                                 case 400:
                                                        throw new Error('Login request was malformed. Please check your input.');
                                                 case 401:
                                                        throw new Error('Invalid credentials. Please try again.');
                                                 case 403:
                                                        throw new Error('Access denied. You do not have permission to perform this action.');
                                                 case 404:
                                                        throw new Error('Login endpoint not found. Please check the URL.');
                                                 case 500:
                                                        throw new Error('Internal server error. Please try again later.');
                                                 default:
                                                        throw new Error('Login failed due to server error');
                                          }
                                   } else {
                                          toast.success('Login successful', { position: 'top-right', theme: resolvedTheme });
                                          router.replace('/profile');
                                   }
                            } catch (error) {
                                   let errorMessage = 'An unexpected error occurred during login.';
                                   if (error instanceof Error) {
                                          errorMessage = error.message;
                                   }
                                   toast.error(errorMessage, { position: 'top-right', theme: resolvedTheme }); // Use the local variable instead
                            }
                     }
              } catch (error) {
                     if (error instanceof Error) {
                            toast.error(error.message, { position: 'top-right', theme: resolvedTheme });
                     } else {
                            toast.error('An unexpected error occurred', { position: 'top-right', theme: resolvedTheme });
                     }
              }
       };

       const handleGoogleSignUp = async () => {
              try {
                  // Ensure this call properly awaits the Firebase Auth instance
                  const provider = new GoogleAuthProvider();
                  const result = await signInWithPopup(auth, provider);
                  // Handle successful authentication
                  toast.success('Login successful', { position: 'top-right', theme: resolvedTheme });
                  router.replace('/profile');
              } catch (error) {
                  // Handle errors appropriately
                  if (error instanceof FirebaseError) {
                      toast.error(`Login failed: ${error.message}`, { position: 'top-right', theme: resolvedTheme });
                  } else {
                      toast.error('Login failed: An unexpected error occurred', { position: 'top-right', theme: resolvedTheme });
                  }
              }
          };

       return (
              <div
                     className="flex h-screen w-screen items-center justify-end overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-8"
                     style={{
                            backgroundImage:
                                   resolvedTheme === "light"
                                          ? "url(/images/login-light-bg.jpg)"
                                          : "url(/images/login-dark-bg.jpg)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                     }}
              >
                     {/* Brand Logo */}
                     <div className="absolute left-10 top-10">
                            <div className="flex items-center">
                                   {resolvedTheme === "light" ? (
                                          <BlackLogo width={60} height={60} /> // Show the WhiteLogo component
                                   ) : (
                                          <WhiteLogo width={60} height={60} /> // Show the BlackLogo component
                                   )}
                            </div>
                     </div>

                     <motion.div
                            layout
                            className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small"
                     >
                            <div className="flex min-h-[40px] items-center gap-3 pb-2">
                                   {page >= 1 && (
                                          <Tooltip content="Go back" delay={3000}>
                                                 <Button isIconOnly size="sm" variant="flat" onPress={() => paginate(-1)}>
                                                        <Icon className="text-default-500" icon="solar:alt-arrow-left-linear" width={16} />
                                                 </Button>
                                          </Tooltip>
                                   )}
                                   <p className="text-3xl font-medium">Sign Up</p>
                            </div>

                            <AnimatePresence custom={direction} initial={false} mode="wait">
                                   <motion.form
                                          key={page}
                                          animate="center"
                                          className="flex flex-col gap-3"
                                          custom={direction}
                                          exit="exit"
                                          initial="enter"
                                          variants={variants}
                                          onSubmit={handleSubmit}
                                   >
                                          {page === 0 && (
                                                 <Input
                                                        isRequired
                                                        label="Email Address"
                                                        name="email"
                                                        type="email"
                                                        validationState={isEmailValid ? "valid" : "invalid"}
                                                        value={email}
                                                        onValueChange={(value) => {
                                                               setIsEmailValid(true);
                                                               setEmail(value);
                                                        }}
                                                        size="lg"
                                                 />
                                          )}
                                          {page === 1 && (
                                                 <Input
                                                        autoFocus
                                                        isRequired
                                                        endContent={
                                                               <button type="button" onClick={togglePasswordVisibility}>
                                                                      {isPasswordVisible ? (
                                                                             <Icon
                                                                                    className="pointer-events-none text-2xl text-default-400"
                                                                                    icon="solar:eye-closed-linear"
                                                                             />
                                                                      ) : (
                                                                             <Icon
                                                                                    className="pointer-events-none text-2xl text-default-400"
                                                                                    icon="solar:eye-bold"
                                                                             />
                                                                      )}
                                                               </button>
                                                        }
                                                        label="Password"
                                                        name="password"
                                                        type={isPasswordVisible ? "text" : "password"}
                                                        validationState={isPasswordValid ? "valid" : "invalid"}
                                                        value={password}
                                                        onValueChange={(value) => {
                                                               setIsPasswordValid(true);
                                                               setPassword(value);
                                                        }}
                                                        size="lg"
                                                 />
                                          )}
                                          {page === 2 && (
                                                 <Input
                                                        autoFocus
                                                        isRequired
                                                        endContent={
                                                               <button type="button" onClick={toggleConfirmPasswordVisibility}>
                                                                      {isConfirmPasswordVisible ? (
                                                                             <Icon
                                                                                    className="pointer-events-none text-2xl text-default-400"
                                                                                    icon="solar:eye-closed-linear"
                                                                             />
                                                                      ) : (
                                                                             <Icon
                                                                                    className="pointer-events-none text-2xl text-default-400"
                                                                                    icon="solar:eye-bold"
                                                                             />
                                                                      )}
                                                               </button>
                                                        }
                                                        errorMessage={!isConfirmPasswordValid ? "Passwords do not match" : undefined}
                                                        label="Confirm Password"
                                                        name="confirmPassword"
                                                        type={isConfirmPasswordVisible ? "text" : "password"}
                                                        validationState={isConfirmPasswordValid ? "valid" : "invalid"}
                                                        value={confirmPassword}
                                                        onValueChange={(value) => {
                                                               setIsConfirmPasswordValid(true);
                                                               setConfirmPassword(value);
                                                        }}
                                                        size="lg"
                                                 />
                                          )}
                                          <Button fullWidth color="primary" type="submit" size="lg">
                                                 {page === 0
                                                        ? "Continue with Email"
                                                        : page === 1
                                                               ? "Enter Password"
                                                               : "Confirm Password"}
                                          </Button>
                                   </motion.form>
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                   {page === 0 && (
                                          <motion.div
                                                 animate={{ opacity: 1 }}
                                                 exit={{ opacity: 0 }}
                                                 initial={{ opacity: 1 }}
                                                 transition={{ duration: 0.2 }}
                                          >
                                                 <div className="flex items-center gap-4 py-2">
                                                        <Divider className="flex-1" />
                                                        <p className="shrink-0 text-tiny text-default-500">OR</p>
                                                        <Divider className="flex-1" />
                                                 </div>
                                                 <div className="flex flex-col gap-3">
                                                        <Button
                                                               startContent={<Icon icon="flat-color-icons:google" width={24} />}
                                                               variant="bordered"
                                                               size="lg"
                                                               onClick={handleGoogleSignUp} // Add this line
                                                        >
                                                               Continue with Google
                                                        </Button>
                                                        <Button
                                                               startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
                                                               variant="bordered"
                                                               size="lg"
                                                        >
                                                               Continue with Github
                                                        </Button>
                                                 </div>
                                          </motion.div>
                                   )}
                            </AnimatePresence>

                            <p className="text-center text-large">
                                   {`Already have an account? `}
                                   <Link href="/login" size="lg">
                                          Log In
                                   </Link>
                            </p>
                     </motion.div>
              </div>
       );
}
