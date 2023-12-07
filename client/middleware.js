import withAuth from "next-auth/middleware";

const unprotectedPages = ['/', '/login', '/errorLogin'];
const protectedPages = ['/createOrJoin']; 

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
                     if (protectedPages.includes(pathname) && !token) {
                            return false;
                     }

                     return !!token;
              },
       },
       pages: {
              signIn: '/login',
              error: '/errorLogin',
       },
});

// export const config = {
//        matcher: unprotectedPages,
// };
