import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import auth from './firebase/config';

const routesForEveryone = [
       '/login',
       '/signup',
       '/forgot-password',
       '/reset-password',
];

const routesForLoggedInUsers = [
       '/dashboard',
       '/profile',
];

export async function middleware(req: NextRequest) {
       console.log("========== : ", auth.currentUser)
       const url = req.nextUrl.clone(); // Clone the request URL to modify it
       const token = req.cookies.get('token');

       let isValidToken = false;

       // Only verify token if one is present
       if (token) {
              const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verifyToken`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ token }),
              });

              if (verifyResponse.ok) {
                     const data = await verifyResponse.json();
                     console.log('We are in middleware, data from verifyToken: ', data);
                     isValidToken = data.isValidToken;
              }
       }

       // Logic for users trying to access routes requiring no login
       if (routesForEveryone.includes(url.pathname)) {
              if (isValidToken) {
                     // User is logged in but trying to access a public route like /login, redirect to /dashboard
                     url.pathname = '/profile';
                     return NextResponse.redirect(url);
              }
              // Proceed as normal for non-logged in users
              return NextResponse.next();
       }

       // Logic for users trying to access routes requiring login
       if (routesForLoggedInUsers.includes(url.pathname)) {
              if (!isValidToken) {
                     // User is not logged in or token is invalid, redirect to /login
                     url.pathname = '/login';
                     return NextResponse.redirect(url);
              }
              // User is authenticated, proceed as normal
              return NextResponse.next();
       }

       // Default action for any other case
       return NextResponse.next();
}

export const config = {
       matcher: '/:path*',
};
