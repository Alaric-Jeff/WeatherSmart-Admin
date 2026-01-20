"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebase = initializeFirebase;
exports.getAuth = getAuth;
exports.getFirestore = getFirestore;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
let initialized = false;
function initializeFirebase() {
    if (initialized)
        return;
    // Check if all required Firebase credentials are provided
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        console.warn('[Firebase] WARNING: Firebase credentials not found in .env. Auth endpoints will not work.');
        console.warn('[Firebase] Please configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env');
        return;
    }
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
    initialized = true;
    console.log('[Firebase] Admin SDK initialized');
}
function getAuth() {
    const auth = firebase_admin_1.default.auth();
    console.log('[Firebase] getAuth called, auth available:', !!auth);
    return auth;
}
function getFirestore() {
    const db = firebase_admin_1.default.firestore();
    console.log('[Firebase] getFirestore called, db available:', !!db);
    return db;
}
