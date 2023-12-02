import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { IoIosLogOut } from "react-icons/io";
import { signOut, signIn } from "next-auth/react";

export default function Author() {
       const { data: session, status } = useSession();
       const pathname = usePathname();

       return (
              <div className="flex justify-between m-3">
                     <a href="https://github.com/khylpe/chat" target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" color="default">
                                   <h1 className="text-3xl">Chat by Arthur CRAHE</h1>
                            </Button>
                     </a>

                     {status === "loading" && !pathname.includes('login') ? (
                            <Button variant="shadow" color="default" isLoading>Loading</Button>
                     ) : status === "authenticated" ? (
                            <Dropdown
                                   className="w-fit"
                                   backdrop="blur"
                                   shouldBlockScroll>
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
