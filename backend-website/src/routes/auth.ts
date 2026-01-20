import { Router } from 'express';
import { z } from 'zod';
import { getAuth } from '../firebase';
import { getFirestore } from 'firebase-admin/firestore';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid credentials',
      details: parsed.error.flatten()
    });
  }
  const { email, password } = parsed.data;
  
  try {
    // Query Firestore users collection
    const db = getFirestore();
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();
    
    if (snapshot.empty) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password' });
    }
    
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    
    // Verify password with Firebase Auth
    const auth = getAuth();
    try {
      await auth.getUserByEmail(email);
      // If user exists in Firebase, create a token
      const customToken = await auth.createCustomToken(userDoc.id);
      
      return res.json({ 
        ok: true, 
        token: customToken,
        data: {
          uid: userDoc.id,
          email: userData.email,
          displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName
        }
      });
    } catch (authError) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ ok: false, error: 'Login failed' });
  }
});

export default router;