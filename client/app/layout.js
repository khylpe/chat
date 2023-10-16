"use client"
// RootLayout
import { Providers } from "./providers";
import { Inter } from 'next/font/google';
import './globals.css';
import Author from "./components/Header";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children, session }) {

       return (
              <SessionProvider session={session}>
                     <html lang="en" className='dark overflow-y-hidden'>
                            <body className={inter.className}>
                                   <Author></Author>
                                   <Providers>
                                          {children}
                                   </Providers>
                            </body>
                     </html>
              </SessionProvider>

       );
}
