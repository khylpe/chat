"use server"
import auth from "../config";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
import { FirebaseError } from 'firebase/app';
import assignCustomClaimsIfNeeded from "./assignCustomClaimsIfNeeded";

export default async function signUp(email: string, password: string) {
       try {
              const result = await createUserWithEmailAndPassword(auth, email, password);
              await sendEmailVerification(result.user)
              await assignCustomClaimsIfNeeded(email, result.user.uid);
              return { uid: result.user.uid };
       } catch (error) {
              if (error instanceof FirebaseError) {
                     switch (error.code) {
                            case 'auth/email-already-in-use':
                                   throw new Error('Email already in use');
                            case 'auth/invalid-email':
                                   throw new Error('Invalid email');
                            case 'auth/weak-password':
                                   throw new Error('Weak password');
                            default:
                                   throw new Error('Signup failed');
                     }
              }
       }
}

