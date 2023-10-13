import withAuth from "next-auth/middleware";

const unprotectedPages = ['/', '/login'];
const protectedPages = ['/CreateOrJoin']; // Modify this based on the pages you want to secure
const onlyIfNotAuthenticated = ['/login']; // Modify this based on the pages you want to secure

// Check if all onlyIfNotAuthenticated routes are unprotected
const isUnprotectedRoutesUnprotected = onlyIfNotAuthenticated.every((route) => unprotectedPages.includes(route));

if(!isUnprotectedRoutesUnprotected) {
       throw new Error('Some of the onlyIfNotAuthenticated routes are protected. Please check your configuration.');
}

export default withAuth({
       callbacks: {
              authorized: ({ token, req }) => { // Use req here
                     const pathname = req.nextUrl.pathname;

                     if (unprotectedPages.includes(pathname)) {
                            return true;
                     }

                     if (protectedPages.includes(pathname) && token) {
                            return true;
                     }

                     // If the current route is neither in the authorizedPages array nor in the unauthorizedPages array, then deny access
                     if (!protectedPages.includes(pathname) && !unprotectedPages.includes(pathname) && !token) {
                            return false;
                     }

                     return !!token;
              },
       },
       pages: {
              signIn: '/login',
       },
});

export const config = {
       matcher: unprotectedPages.concat(protectedPages),
};
