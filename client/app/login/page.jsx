"use client"
// app/page.tsx
import AuthForm from './../components/AuthForm'
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'

function Login() {
       const { showSnackbar } = useSnackbar();
       const { data: session, status } = useSession();
       const router = useRouter()

       if (status === "authenticated") { // Should be done from middleware or next-auth itself
              showSnackbar({
                     message: "You are already logged in",
                     color: "success"
              })
              router.push('/', { scroll: false })
       }

       return (
              <div>
                     <AuthForm></AuthForm>
              </div>
       )
}
export default Login
