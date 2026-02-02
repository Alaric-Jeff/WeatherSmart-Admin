import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";

export async function frontendSignIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user) throw new Error("Login failed");

    const idToken = await user.getIdToken(); 

    return idToken;
  } catch (err: any) {
    const errorCode = err?.code || '';
    let userFriendlyMessage = 'Wrong email or password.';

    // Map Firebase error codes to user-friendly messages
    if (errorCode.includes('user-not-found') || errorCode.includes('invalid-credential')) {
      userFriendlyMessage = 'Wrong email or password.';
    } else if (errorCode.includes('wrong-password')) {
      userFriendlyMessage = 'Wrong email or password.';
    } else if (errorCode.includes('invalid-email')) {
      userFriendlyMessage = 'Invalid email address.';
    } else if (errorCode.includes('user-disabled')) {
      userFriendlyMessage = 'This account has been disabled.';
    } else if (errorCode.includes('too-many-requests')) {
      userFriendlyMessage = 'Too many login attempts. Please try again later.';
    } else if (errorCode.includes('network-request-failed')) {
      userFriendlyMessage = 'Network error. Please check your connection.';
    } else if (err?.message) {
      // Strip Firebase prefix if present
      let message = err.message;
      if (message.includes('Firebase:')) {
        message = message.replace(/^Firebase:\s*Error\s*\([^)]*\)\.\s*/, '');
      }
      userFriendlyMessage = message || 'Wrong email or password.';
    }

    throw new Error(userFriendlyMessage);
  }
}
