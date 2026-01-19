import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";

export async function frontendSignIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (!user) throw new Error("Login failed");

  const idToken = await user.getIdToken(); 

  return idToken;
}
