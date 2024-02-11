"use client";

import React from "react";
import {
       Navbar,
       NavbarBrand,
       NavbarContent,
       NavbarItem,
       NavbarMenu,
       NavbarMenuItem,
       NavbarMenuToggle,
       Link,
       Button,
       Dropdown,
       DropdownTrigger,
       DropdownMenu,
       DropdownItem,
       Popover,
       PopoverContent,
       PopoverTrigger,
       Tabs,
       Tab,
       AvatarGroup,
       Avatar,
       Chip,
       Tooltip,
       ScrollShadow,
       Divider,
       Breadcrumbs,
       BreadcrumbItem,
       Input,
       Badge,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import auth from "@/firebase/config";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth"; // Import the User type
import logOut from "@/firebase/auth/logout";

export default function ConnectedHeader() {
       const [currentUser, setCurrentUser] = useState<User | null>(null);
       useEffect(() => {
              const unsubscribe = onAuthStateChanged(auth, (user) => {
                     if (user) {
                            // User is signed in
                            console.log(user);
                            setCurrentUser(user);
                     } else {
                            // User is signed out
                            console.log("User is not signed in");
                            setCurrentUser(null);
                     }
              });
              return () => unsubscribe();
       }, []);
       return (
              <div className="w-full">
                     <Navbar
                            isBordered
                            classNames={{
                                   item: "data-[active=true]:text-primary",
                                   wrapper: "px-4 sm:px-6",
                            }}
                            height="64px"
                     >
                            <NavbarBrand>
                                   <NavbarMenuToggle className="mr-2 h-6 sm:hidden" />
                                   <p className="font-bold text-inherit">ACME</p>
                            </NavbarBrand>

                            {/* Right Menu */}
                            <NavbarContent className="ml-auto h-12 max-w-fit items-center gap-0" justify="end">
                                   {/* Theme change */}
                                   <NavbarItem className="hidden lg:flex">
                                          <Button isIconOnly radius="full" variant="light">
                                                 <Icon className="text-default-500" icon="solar:sun-linear" width={24} />
                                          </Button>
                                   </NavbarItem>
                                   {/* Settings */}
                                   <NavbarItem className="hidden lg:flex">
                                          <Button isIconOnly radius="full" variant="light">
                                                 <Icon className="text-default-500" icon="solar:settings-linear" width={24} />
                                          </Button>
                                   </NavbarItem>

                                   {/* User Menu */}
                                   <NavbarItem className="px-2">
                                          <Dropdown placement="bottom-end">
                                                 <DropdownTrigger>
                                                        <button className="mt-1 h-8 w-8 transition-transform">
                                                               {currentUser && (
                                                                      <Avatar size="sm" src={currentUser.photoURL ?? ''} />
                                                               )}
                                                        </button>
                                                 </DropdownTrigger>
                                                 <DropdownMenu aria-label="Profile Actions" variant="flat">
                                                        <DropdownItem key="profile" className="h-14 gap-2">
                                                               <p className="font-semibold">Signed in as</p>
                                                               {currentUser ? (
                                                                      <p className="font-semibold">
                                                                             {currentUser.displayName || currentUser.email || "Anonymous User"}
                                                                      </p>
                                                               ) : null}

                                                        </DropdownItem>
                                                        <DropdownItem key="settings">My Settings</DropdownItem>
                                                        <DropdownItem key="logout" color="danger" 
                                                        onClick={() => logOut()}>
                                                               Log Out
                                                        </DropdownItem>
                                                 </DropdownMenu>
                                          </Dropdown>
                                   </NavbarItem>
                            </NavbarContent>

                            {/* Mobile Menu */}
                            <NavbarMenu>
                                   <NavbarMenuItem>
                                          <Link className="w-full" color="foreground" href="#">
                                                 Dashboard
                                          </Link>
                                   </NavbarMenuItem>
                                   <NavbarMenuItem isActive>
                                          <Link aria-current="page" className="w-full" color="primary" href="#">
                                                 Deployments
                                          </Link>
                                   </NavbarMenuItem>
                                   <NavbarMenuItem>
                                          <Link className="w-full" color="foreground" href="#">
                                                 Analytics
                                          </Link>
                                   </NavbarMenuItem>
                                   <NavbarMenuItem>
                                          <Link className="w-full" color="foreground" href="#">
                                                 Team
                                          </Link>
                                   </NavbarMenuItem>
                                   <NavbarMenuItem>
                                          <Link className="w-full" color="foreground" href="#">
                                                 Settings
                                          </Link>
                                   </NavbarMenuItem>
                            </NavbarMenu>
                     </Navbar>
              </div>
       );
}
