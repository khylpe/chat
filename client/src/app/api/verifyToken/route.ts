"use server"
import getFirebaseAdmin from '@/firebase/firebaseAdmin'; // Ensure this import path matches your setup
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
       const requestData = await req.json();
       const { token } = requestData; // Assuming this is the correct way to access your token

       if (!token) {
              console.log("no token")
              return new NextResponse('Token is missing', {
                     status: 401,
                     statusText: 'Token is missing',
                     headers: { 'Content-Type': 'text/plain' },
              });
       }

       try {
              console.log("we are in try block")
              const admin = await getFirebaseAdmin();
              const decodedToken = await admin.auth().verifyIdToken(token, true);
              
              console.log("🚀 ~ POST ~ decodedToken.exp:", decodedToken.exp);
              console.log("🚀 ~ POST ~ decodedToken.exp:", decodedToken.iat);

              if (!decodedToken) {
                     return new NextResponse('Invalid token', {
                            status: 401,
                            statusText: 'Invalid token',
                            headers: { 'Content-Type': 'text/plain' },
                     });
              }

              // check if mail is verified
              const user = await admin.auth().getUser(decodedToken.uid);
              if (!user.emailVerified) {
                     return new NextResponse('Email not verified', {
                            status: 401,
                            statusText: 'Email not verified',
                            headers: { 'Content-Type': 'text/plain' },
                     });
              }

              const response = new NextResponse(JSON.stringify({ isValidToken: true }), {
                     status: 200,
                     headers: { 'Content-Type': 'application/json' }, // Ensure correct content type for JSON response
              });

              response.cookies.set('token', token, { httpOnly: true, path: '/' });
              response.cookies.set('uid', decodedToken.uid, { httpOnly: true, path: '/' });
              return response;

       } catch (error) {
              return new NextResponse(`Token is invalid: ${error}`, {
                     status: 401,
                     headers: { 'Content-Type': 'text/plain' },
              });
       }
}

