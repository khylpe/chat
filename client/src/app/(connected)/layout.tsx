"use client";
import React from "react";
import { Avatar, Button, Spacer, useDisclosure } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import ConnectedHeader from "@/components/connectedHeader";
import { sectionItems } from "@/components/connectedDrawer/sidebar-items";
import { adminSectionItems } from "@/components/connectedDrawer/admin-sidebar-items";
import SidebarDrawer from "@/components/connectedDrawer/sidebar-drawer";
import Sidebar from "@/components/connectedDrawer/sidebar";
import auth from "@/firebase/config";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { useTheme } from 'next-themes';
import logOut from "@/firebase/auth/logout";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
       const router = useRouter();
       const { resolvedTheme } = useTheme();
       const [isAdmin, setIsAdmin] = useState(false);
       const { isOpen, onOpen, onOpenChange } = useDisclosure();
       const [currentUser, setCurrentUser] = useState<User | null>(null);
       const pathname = usePathname();
       const currentPath = pathname.split("/")[1] || "home";

       useEffect(() => {
              onIdTokenChanged(auth, (user) => {
                     if (user) {
                            setCurrentUser(user);
       
                            user.getIdTokenResult()
                                   .then((idTokenResult) => {
                                          const claims = idTokenResult.claims;
                                          setIsAdmin(!!claims.admin);
                                   })
                                   .catch((error) => {
                                          setIsAdmin(false);
                                   });
                     } else {
                            setCurrentUser(null);
                            setIsAdmin(false);
                     }
              });
       }, []);
       const handleLogOut = async () => {
              const response = await logOut();
              if (response.code === "success") {
                     toast.success("Logout successful", { theme: resolvedTheme });
                     router.push("/login");
              } else {
                     toast.error(response.message);
              }
       };
       const content = (
              <div className="relative flex h-full w-72 flex-1 flex-col p-6 overflow-x-hidden">
                     <div className="flex items-center gap-3 px-3">
                            <Avatar isBordered size="md" src={currentUser?.photoURL || ""} />
                            <div className="flex flex-col">
                                   <p className="text-small font-medium text-default-600">{currentUser?.displayName || currentUser?.email}</p>
                                   {isAdmin && <p className="text-small text-default-500">Admin</p>}
                            </div>
                     </div>

                     <Spacer y={8} />
                     <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} items={isAdmin ? adminSectionItems : sectionItems} />

                     <Spacer y={8} />
                     <div className="mt-auto flex flex-col">
                            <Button
                                   as={Link}
                                   href="/settings"
                                   fullWidth
                                   className={`justify-start text-default-500`}
                                   startContent={
                                          <Icon className="text-default-500" icon="solar:settings-outline" width={24} />
                                   }
                                   variant={currentPath === "settings" ? "flat" : "light"}
                            >
                                   Settings
                            </Button>
                            <Button
                                   color="danger"
                                   onClick={handleLogOut}
                                   className="justify-start text-default-500 data-[hover=true]:text-foreground"
                                   startContent={
                                          <Icon
                                                 className="rotate-180 text-default-500"
                                                 icon="solar:minus-circle-line-duotone"
                                                 width={24}
                                          />
                                   }
                                   variant="light"
                            >
                                   Log Out
                            </Button>
                     </div>
              </div>
       );
       return (
              <div className="flex h-dvh w-full overflow-x-hidden">
                     <SidebarDrawer
                            className={`!border-r-small overflow-auto border-divider ${isOpen ? "" : ""}`}
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                     >
                            {content}
                     </SidebarDrawer>
                     <div className="w-full flex-1 flex-col">
                            <Button isIconOnly className="fixed m-4 flex sm:hidden" size="sm" variant="light" onPress={onOpen}>
                                   <Icon
                                          className="text-default-500"
                                          height={24}
                                          icon="solar:hamburger-menu-outline"
                                          width={24}
                                   />
                            </Button>
                            <div
                                   className="flex h-screen items-center overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-4 bg-transparent"
                                   style={{
                                          backgroundImage:
                                                 resolvedTheme === "light"
                                                        ? "url(/images/login-light-bg.jpg)"
                                                        : isAdmin
                                                               ? "url(/images/sun.jpg)"
                                                               : "url(/images/login-dark-bg.jpg)",
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                   }}
                            >
                                   <div
                                          className={`overflow-y-auto h-full w-full mt-20 ${resolvedTheme === "light" ? "text-black" : "text-white"}`}
                                   >
                                          {children}
                                   </div>
                            </div>
                     </div>
              </div>
       );
}




/**
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */