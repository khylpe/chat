// provider component to wrap the entire app
"use client"
import React from 'react';
import { SocketProvider } from './contexts/SocketContext';
import { NextUIProvider } from '@nextui-org/react'
import { SnackbarProvider } from './contexts/SnackbarContext';

export function Providers({ children }) {
       return (
              <NextUIProvider>
                     <SocketProvider>
                            <SnackbarProvider>
                            {children}
                            </SnackbarProvider>
                     </SocketProvider>
              </NextUIProvider>
       )
}