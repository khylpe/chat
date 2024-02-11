// Ensure you import FirebaseError from Firebase to handle specific Firebase errors.
import { FirebaseError } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import auth from '@/firebase/config'; // Assuming this is a custom module for initializing Firebase
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
       try {
              const requestData = await request.json();
              const { email, password } = requestData;

              const userCredential = await signInWithEmailAndPassword(auth, email, password);
              const token = await userCredential.user.getIdToken();
              const uid = userCredential.user.uid;

              const response = new NextResponse(JSON.stringify({ user: userCredential.user }), {
                     status: 200,
                     headers: {
                            'Content-Type': 'application/json',
                     },
              });

              response.cookies.set('token', token, { httpOnly: true, path: '/' });
              response.cookies.set('uid', uid, { httpOnly: true, path: '/' });
              return response;
       } catch (error) {
              if (error instanceof FirebaseError) {
                     const status = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential'
                            ? 401 // Unauthorized
                            : 400; // Bad Request for other types of Firebase errors

                     return new NextResponse(`Login failed: ${error.message}`, {
                            status: status,
                            headers: {
                                   'Content-Type': 'text/plain',
                            },
                     });
              }
              return new NextResponse(`Login failed: An unexpected error occurred`, {
                     status: 500, // Internal Server Error for generic or unknown errors
                     headers: {
                            'Content-Type': 'text/plain',
                     },
              });
       }
}
