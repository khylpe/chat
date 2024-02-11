"use client"
import React, { useEffect, useState } from "react"; // Import useState
import { Button, Input, Link, Divider, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { WhiteLogo, BlackLogo } from "@/components/logos";
import { useTheme } from 'next-themes';
import signUp from "@/firebase/auth/signup";
import auth from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth"; // Import the User type

export default function Settings() {
       const { resolvedTheme } = useTheme();
       const [currentUser, setCurrentUser] = useState<User | null>(null);
       const [isAdmin, setIsAdmin] = useState(false);

       useEffect(() => {
              const unsubscribe = onAuthStateChanged(auth, (user) => {
                     if (user) {
                            // User is signed in
                            console.log(user);
                            setCurrentUser(user); // Update state with current user

                            user.getIdTokenResult()
                                   .then((idTokenResult) => {
                                          // Get the custom claims
                                          const claims = idTokenResult.claims;

                                          if (claims.admin) {
                                                 setIsAdmin(true);
                                          }
                                          // You can now use these claims to perform operations or check privileges
                                          console.log(claims);
                                   })
                                   .catch((error) => {
                                          console.log(error);
                                   });

                     } else {
                            // User is signed out
                            console.log("User is not signed in");
                            setCurrentUser(null); // Clear current user in state
                     }
              });
              return () => unsubscribe();
       }, []);

       return (
              <div>
                     {currentUser && (
                            <div>
                            </div>
                     )}
              </div>
       );
}
