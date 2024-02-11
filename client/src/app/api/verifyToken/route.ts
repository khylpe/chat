"use server"
import getFirebaseAdmin from '@/firebase/firebaseAdmin'; // Ensure this import path matches your setup
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
       const requestData = await req.json();
       const { value: token } = requestData.token;

       if (!token) {
              return new NextResponse('Auth token not found',
                     { status: 401, headers: { 'Content-Type': 'text/plain' } }
              );
       }

       try {
              const admin = await getFirebaseAdmin();
              const decodedToken = await admin.auth().verifyIdToken(token);

              if (!decodedToken) {
                     throw new Error('Invalid token');
              }

              return new NextResponse(JSON.stringify({ isValidToken: true, decodedToken }),
                     { status: 200, headers: { 'Content-Type': 'text/plain' }, }
              );

       } catch (error) {
              console.log("🚀 ~ POST ~ error:", error)
              return new NextResponse(`Token is invalid: ${error}`,
                     { status: 401, headers: { 'Content-Type': 'text/plain' } }
              );
       }
}
