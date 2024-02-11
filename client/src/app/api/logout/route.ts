"use server"
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
       try {
              const response = new NextResponse('Logout successful ', {
                     status: 200,
                     headers: { 'Content-Type': 'application/json' }, // Ensure correct content type for JSON response
              });

              response.cookies.delete('token');
              response.cookies.delete('uid');
              return response;
       } catch (error) {
              return new NextResponse(`Couldn't remove cookies:  ${error}`, {
                     status: 500,
                     headers: { 'Content-Type': 'text/plain' },
              });
       }
}

