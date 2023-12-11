import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, button, DropdownSection } from "@nextui-org/react";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { IoIosLogOut } from "react-icons/io";
import { signOut, signIn } from "next-auth/react";
import { FaGithub, FaHome } from "react-icons/fa";
import Image from 'next/image'
import { MdChat } from "react-icons/md";

export default function Author() {
       const { data: session, status } = useSession();
       const pathname = usePathname();

       return (
              <div className="flex justify-between m-3">
                     <Dropdown
                            showArrow
                            className="w-fit"
                            backdrop="blur"
                            shouldBlockScroll
                            classNames={{
                                   base: "before:bg-default-200", // change arrow background
                                   content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                            }}
                     >
                            <DropdownTrigger>
                                   <div className="flex flex-row items-center space-x-3 text-2xl"><Image className="cursor-pointer" draggable={0} src={"https://crahe-arthur.com/public_files/img/logo.png"} alt="logo" width={60} height={60}></Image >
                                          <span>Chat by Arthur CRAHE</span>
                                   </div>
                            </DropdownTrigger>

                            <DropdownMenu aria-label="user menu" variant="faded">
                                   <DropdownSection>
                                          {pathname == "/" ? (
                                                 <DropdownItem href={"/createOrJoin"} startContent={<MdChat size={"1.4rem"}></MdChat>}>start chatting</DropdownItem>
                                          )
                                                 :
                                                 (<DropdownItem href={"/"} startContent={<FaHome size={"1.4rem"}></FaHome>}>
                                                        Home
                                                 </DropdownItem>)
                                          }
                                          <DropdownItem href={"https://github.com/khylpe/chat"} target="_blank" rel="noopener noreferrer" startContent={<FaGithub size={"1.4rem"}></FaGithub>}>
                                                 Khylpe/Chat
                                          </DropdownItem>
                                   </DropdownSection>
                            </DropdownMenu>
                     </Dropdown>

                     {status === "loading" && !pathname.includes('login') ? (
                            <Button variant="shadow" color="default" isLoading>Loading</Button>
                     ) : status === "authenticated" ? (
                            <Dropdown
                                   className="w-fit"
                                   backdrop="blur"
                                   shouldBlockScroll
                                   classNames={{
                                          base: "before:bg-default-200", // change arrow background
                                          content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                                   }}>
                                   <DropdownTrigger>
                                          <Button variant="shadow" color="default">Welcome {session.user.username}</Button>
                                   </DropdownTrigger>

                                   <DropdownMenu aria-label="user menu" variant="faded">
                                          <DropdownItem key="delete" className="text-danger" color="danger" endContent={<IoIosLogOut size={"1.5rem"}></IoIosLogOut>} onPress={() => { signOut() }}>
                                                 Logout
                                          </DropdownItem>
                                   </DropdownMenu>
                            </Dropdown>
                     ) : !pathname.includes('login') && (
                            <Link href="/login" passHref>
                                   <Button variant="shadow" onClick={() => { signIn() }} color="default">Login / Signup</Button>
                            </Link>
                     )}
              </div>
       );
}
