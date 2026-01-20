"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const firebase_1 = require("../firebase");
const router = (0, express_1.Router)();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(100)
});
router.post('/login', async (req, res) => {
    console.log('[Auth] Login attempt:', req.body.email);
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            console.log('[Auth] Validation failed');
            res.status(400).json({
                ok: false,
                error: 'Invalid input',
                details: parsed.error.flatten()
            });
            return;
        }
        const { email, password } = parsed.data;
        console.log('[Auth] Validated email:', email);
        // Get Firestore
        const db = (0, firebase_1.getFirestore)();
        if (!db) {
            console.error('[Auth] Firestore not initialized');
            res.status(500).json({ ok: false, error: 'Database not available' });
            return;
        }
        console.log('[Auth] Querying users collection...');
        const usersRef = db.collection('users');
        // Try top-level email
        let snapshot = await usersRef.where('email', '==', email).limit(1).get();
        console.log('[Auth] Top-level email search found:', !snapshot.empty);
        // Try nested email
        if (snapshot.empty) {
            snapshot = await usersRef.where('devices.email', '==', email).limit(1).get();
            console.log('[Auth] Nested email search found:', !snapshot.empty);
        }
        if (snapshot.empty) {
            console.log('[Auth] User not found');
            res.status(401).json({ ok: false, error: 'Invalid email or password' });
            return;
        }
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        console.log('[Auth] User found, UID:', userDoc.id);
        // Get Auth
        const auth = (0, firebase_1.getAuth)();
        if (!auth) {
            console.error('[Auth] Auth not initialized');
            res.status(500).json({ ok: false, error: 'Auth not available' });
            return;
        }
        console.log('[Auth] Creating custom token...');
        const customToken = await auth.createCustomToken(userDoc.id);
        console.log('[Auth] Token created successfully');
        res.json({
            ok: true,
            token: customToken,
            user: {
                uid: userDoc.id,
                email: userData.email ?? userData.devices?.email,
                displayName: userData.displayName ?? `${userData.firstName ?? userData.devices?.firstName ?? ''} ${userData.lastName ?? userData.devices?.lastName ?? ''}`.trim(),
                firstName: userData.firstName ?? userData.devices?.firstName,
                lastName: userData.lastName ?? userData.devices?.lastName
            }
        });
    }
    catch (error) {
        console.error('[Auth] Unexpected error:', error.message, error.stack);
        res.status(500).json({ ok: false, error: 'Login failed', details: error.message });
    }
});
exports.default = router;
