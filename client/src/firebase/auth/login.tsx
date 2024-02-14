import { NextResponse } from "next/server";
import auth from "../config";
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from "firebase/auth";
import translateFirebaseErrorCode from "@/firebase/translateFirebaseErrorCode";
import {CustomReturnType} from "@/interfaces/customError";
import { use } from "react";

export default async function logIn(email: string, password: string): Promise<CustomReturnType> {
       try {
              const userCredential = await signInWithEmailAndPassword(auth, email, password);
              console.log(userCredential.user.emailVerified);
              if (!userCredential.user.emailVerified) {
                     return { code: 'auth/email-not-verified', message: 'Email not verified', statusCode: 400 };
              }
              const token = await userCredential.user.getIdToken();
              const response = await fetch('http://localhost:3000/api/verifyToken', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({token}),
              });

              if (!response.ok) {
                     return { code: 'internal-server-error', message: response.statusText, statusCode: response.status };
              }

              return { code: 'success', message: 'Login successful', statusCode: 200 };
       } catch (error) {
              if (error instanceof FirebaseError) {
                     return translateFirebaseErrorCode(error.code);
              } else if (error instanceof Error) {
                     return { code: 'internal-server-error', message: error.message, statusCode: 500 };
              } else {
                     return { code: 'unknown', message: 'An unexpected error occurred', statusCode: 500 };
              }
       }
}