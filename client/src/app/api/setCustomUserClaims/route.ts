import getFirebaseAdmin from '@/firebase/firebaseAdmin'; // Ensure this import path matches your setup
import { type NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
       console.log("where am i?")
       const requestData = await req.json();
       const { uid, claims } = requestData;

       try {
              const admin = await getFirebaseAdmin();
              await admin.auth().setCustomUserClaims(uid, claims);
              return new NextResponse('Custom claims set for user', {
                     status: 200,
                     headers: {
                            'Content-Type': 'text/plain',
                     },
              });
       } catch (error) {
              console.error('Error setting custom claims:', error);
              return new NextResponse('Error setting custom claims', {
                     status: 400,
                     headers: {
                            'Content-Type': 'text/plain',
                     },
              });
       }

}
