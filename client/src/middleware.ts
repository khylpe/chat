import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const routesForEveryone = [
       '/login',
       '/signup',
       '/forgot-password',
       '/reset-password',
];

const routesForLoggedInUsers = [
       '/dashboard',
       '/home',
       '/settings'
];

export async function middleware(req: NextRequest) {
       const url = req.nextUrl.clone(); // Clone the request URL to modify it

       let isValidToken = false;

       // Only verify token if one is present
       if (req.cookies.get('token')) {
              const token = req.cookies.get('token')?.value;
              const verifyResponse = await fetch(`http://localhost:3000/api/verifyToken`, {
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
                     url.pathname = '/home';
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
