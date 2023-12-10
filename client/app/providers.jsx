// provider component to wrap the entire app
"use client"
import React from 'react';
import { SocketProvider } from './contexts/SocketContext';
import { NextUIProvider } from '@nextui-org/react'
import { SnackbarProvider } from './contexts/SnackbarContext';
import { useRouter } from 'next/navigation'
import io from 'socket.io-client';

export function Providers({ children }) {
       const router = useRouter();
       return (
              <NextUIProvider navigate={router.push}>
                     <SocketProvider>
                            <SnackbarProvider>
                                   {children}
                            </SnackbarProvider>
                     </SocketProvider>
              </NextUIProvider>
       )
}