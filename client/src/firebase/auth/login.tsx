import { NextResponse } from "next/server";
import auth from "../config";
export default async function logIn(email: string, password: string) {
       console.log("!!!!!!!!!! ", auth)
       try {
              const response = await fetch('http://localhost:3000/api/login', {
                     method: 'POST',
                     headers: {
                            'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({ email, password }),
              });

              if (!response.ok) {
                     let errorMessage = 'Login failed due to server error'; // Default error message
                     switch (response.status) {
                            case 400:
                                   errorMessage = 'Login request was malformed. Please check your input.';
                                   break;
                            case 401:
                                   errorMessage = 'Invalid credentials. Please try again.';
                                   break;
                            case 403:
                                   errorMessage = 'Access denied. You do not have permission to perform this action.';
                                   break;
                            case 404:
                                   errorMessage = 'Login endpoint not found. Please check the URL.';
                                   break;
                            case 500:
                                   errorMessage = 'Internal server error. Please try again later.';
                                   break;
                     }
                     throw new Error(errorMessage);
              }

              const data = await response.json(); // Assuming the response body is in JSON format

              // Access the user value from the parsed data
              const user = data.user;
              return new NextResponse(JSON.stringify(user), {
                     status: 200,
                     headers: {
                            
                            'Content-Type': 'application/json',
                     },
              });
       } catch (e) {
              console.error("🚀 ~ logIn ~ error:", e);

              let statusCode = 500; // Default to internal server error
              let errorMessage = 'An unexpected error occurred'; // Default error message

              if (e instanceof Error) {
                     errorMessage = e.message;

                     // Customize status code and message based on common error scenarios
                     switch (e.message) {
                            case 'Login request was malformed. Please check your input.':
                                   statusCode = 400;
                                   break;
                            case 'Invalid credentials. Please try again.':
                                   statusCode = 401;
                                   break;
                            case 'Access denied. You do not have permission to perform this action.':
                                   statusCode = 403;
                                   break;
                            case 'Login endpoint not found. Please check the URL.':
                                   statusCode = 404;
                                   break;
                            case 'Internal server error. Please try again later.':
                                   break;
                            default:
                                   statusCode = 400;
                     }
              }

              return new NextResponse(`Login failed: ${errorMessage}`, {
                     status: statusCode,
                     headers: {
                            'Content-Type': 'text/plain',
                     },
              });
       }

}
