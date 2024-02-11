"use server"
import auth from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { FirebaseError } from 'firebase/app';

export default async function signUp(email: string, password: string) {

       try {
              const result = await createUserWithEmailAndPassword(auth, email, password);
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
       // Separated logic for assigning custom claims to users.
       async function assignCustomClaimsIfNeeded(email: string, uid: string) {
              if (process.env.ADMIN_USERS) {
                     const listOfAdminUsers = process.env.ADMIN_USERS.split(',');
                     if (listOfAdminUsers.includes(email)) {
                            const claims = { admin: true };
                            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/setCustomUserClaims`, {
                                   method: 'POST',
                                   headers: {
                                          'Content-Type': 'application/json',
                                   },
                                   body: JSON.stringify({ uid, claims })
                            });
                     }
              }
       }