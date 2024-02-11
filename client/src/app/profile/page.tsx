"use client";

import React from "react";
import { Button, Input, Link, Divider, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { WhiteLogo, BlackLogo } from "@/components/logos";
import { useTheme } from 'next-themes'
import signUp from "@/firebase/auth/signup";

export default function Component() {
       const { resolvedTheme } = useTheme()
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
              </div>
       );
}
