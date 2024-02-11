import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
              apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY as string,
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN as string,
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID as string,
              storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET as string,
              messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID as string,
              appId: process.env.NEXT_PUBLIC_FIREBASE_APPID as string,
              measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID as string
       };

// New function to get Auth instance
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// const analytics = getAnalytics(app);
export default auth;
