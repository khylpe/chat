interface CustomReturnType {
       code: string;
       message: string;
       statusCode: number;
}

export default function translateFirebaseErrorCode(errorCode: string): CustomReturnType {
       let message = 'An unexpected error occurred';
       let statusCode = 400; // Default to Bad Request for other Firebase errors

       switch (errorCode) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
              case 'auth/id-token-expired':
              case 'auth/id-token-revoked':
                     message = errorCode === 'auth/user-not-found' ? 'User not found' :
                            errorCode === 'auth/wrong-password' ? 'Invalid password' :
                                   errorCode === 'auth/id-token-expired' ? 'The Firebase ID token has expired.' :
                                          'The Firebase ID token has been revoked.';
                     statusCode = 401; // Unauthorized
                     break;
              case 'auth/user-disabled':
                     message = "The user account has been disabled by an administrator.";
                     statusCode = 403; // Forbidden, as the account is disabled and thus forbidden access
                     break;
              case 'auth/email-already-exists':
              case 'auth/phone-number-already-exists':
              case 'auth/uid-already-exists':
                     message = errorCode === 'auth/email-already-exists' ? "The provided email is already in use by an existing user. Each user must have a unique email." :
                            errorCode === 'auth/phone-number-already-exists' ? "The phone number is already in use by an existing user." :
                                   'The UID is already in use by an existing user.';
                     statusCode = 409; // Conflict
                     break;
              case 'auth/insufficient-permission':
              case 'auth/operation-not-allowed':
                     message = errorCode === 'auth/insufficient-permission' ? "The credentials used to initialize the Admin SDK do not have sufficient permissions to access the requested authentication resource." :
                            'The operation is not allowed.';
                     statusCode = 403; // Forbidden
                     break;
              case 'auth/internal-error':
                     message = 'The authentication server encountered an unexpected error.';
                     statusCode = 500; // Internal Server Error
                     break;
              case 'auth/too-many-requests':
                     message = 'Too many requests have been made to the authentication server.';
                     statusCode = 429; // Too Many Requests
                     break;
              case 'auth/invalid-credential':
                     message = "Invalid credential. Please try again.";
                     statusCode = 401; // Unauthorized
                     break;
              // Include other cases as necessary
              default:
                     message = 'An unexpected error occurred with error code: ' + errorCode;
                     break;
       }

       return { code: errorCode, message, statusCode };
}