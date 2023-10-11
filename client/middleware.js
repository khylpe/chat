import withAuth from "next-auth/middleware";

const unauthorizedPages = ['/', '/login'];
const authorizedPages = ['/CreateOrJoin']; // Modify this based on the pages you want to secure

export default withAuth({
       callbacks: {
              authorized: ({ token, req }) => { // Use req here
                     const pathname = req.nextUrl.pathname;

                     if (unauthorizedPages.includes(pathname)) {
                            return true;
                     }

                     if (authorizedPages.includes(pathname) && token) {
                            return true;
                     }

                     // If the current route is neither in the authorizedPages array nor in the unauthorizedPages array, then deny access
                     if (!authorizedPages.includes(pathname) && !unauthorizedPages.includes(pathname) && !token) {
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
       matcher: unauthorizedPages.concat(authorizedPages),
};
