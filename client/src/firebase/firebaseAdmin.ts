"use server"
import * as admin from 'firebase-admin';

var serviceAccount = require("./serviceAccountKey.json");

export async function initializeFirebaseAdmin(){
       if (!admin.apps.length) {
              try {
                     admin.initializeApp({
                            credential: admin.credential.cert(serviceAccount)
                     });
              } catch (error) {
                     console.log("Firebase admin initialization error", error);
              }
       }
};

export default async function getFirebaseAdmin(){
       await initializeFirebaseAdmin();
       return admin;
};