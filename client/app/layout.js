"use client"
// RootLayout
import { Providers } from "./providers";
import './globals.css';
import Author from "./components/Header";
import { SessionProvider } from "next-auth/react";
import { Raleway } from 'next/font/google';

const raleway = Raleway({
       subsets: ['latin'],
       display: 'swap',
       weight: '700',
})

export default function RootLayout({ children, session }) {
       return (
              <SessionProvider session={session}>
                     <html lang="en" className='dark overflow-y-hidden'>
                            <body className={raleway.className}>
                                   <Author></Author>
                                   <Providers>
                                          {children}
                                   </Providers>
                            </body>
                     </html>
              </SessionProvider>
       );
}

// export const metadata = {
//        title: 'Chat by Arthur CRAHE',
// }