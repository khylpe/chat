// provider component to wrap the entire app
"use client"
import React from 'react';
import { SocketProvider } from './contexts/SocketContext';
import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }) {
       return (
              <NextUIProvider>
                     <SocketProvider>
                            {children}
                     </SocketProvider>
              </NextUIProvider>
       )
}