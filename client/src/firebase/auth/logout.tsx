import { signOut } from "firebase/auth";
import auth from "../config";
import { FirebaseError } from 'firebase/app';
import { CustomReturnType } from "@/interfaces/customError";
import translateFirebaseErrorCode from "../translateFirebaseErrorCode";

export default async function logOut(): Promise<CustomReturnType> {  
       try {
              await signOut(auth);
              const response = await fetch('http://localhost:3000/api/logout', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
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