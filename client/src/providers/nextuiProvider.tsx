"use client"
import { NextUIProvider as OfficialNextUIProvider } from "@nextui-org/react";
import { ReactNode } from "react";
import { useRouter } from 'next/navigation'

export default function NextUIProvider({ children }: { children: ReactNode }) {
       const router = useRouter();
       return <OfficialNextUIProvider navigate={router.push}>{children}</OfficialNextUIProvider>;
}