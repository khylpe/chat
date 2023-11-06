import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

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
                            <Button variant="shadow" color="default">Welcome {session.user.username}</Button>
                     ) : !pathname.includes('login') && (
                            <Link href="/login" passHref>
                                   <Button variant="shadow" href="/login" color="default">Login / Signup</Button>
                            </Link>
                     )}
              </div>
       );
}
