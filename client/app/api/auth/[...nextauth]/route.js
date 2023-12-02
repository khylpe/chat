// api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
const axios = require('axios');
require('dotenv').config();

const handler = NextAuth({
       secret: process.env.NEXTAUTH_SECRET,
       providers: [
              CredentialsProvider({
                     name: 'Credentials',                     
                     async authorize(credentials, req) {
                            try {
                                   const response = await axios.post('http://localhost:3006/login', {
                                          email: credentials.email,
                                          password: credentials.password
                                   }, {
                                          withCredentials: true
                                   });

                                   const user = response.data.user;
                                   return user;                                   
                            } catch (error) {
                                   return null;
                            }
                     }
              })
       ],
       callbacks: {
              async jwt({ token, user }) {
                     if (user) {
                            token.user = user;
                     }
                     return token;
              },
              async session({ session, token }) {
                     session.user = token.user;
                     return session;
              }
       },
       pages: {
              signIn: '/../../../login', // /../../../../../.. (lol)
              error: '/../../../errorLogin',
       }
});

export { handler as GET, handler as POST }
