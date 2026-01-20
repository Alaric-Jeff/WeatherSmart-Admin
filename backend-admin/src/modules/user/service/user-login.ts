import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";

interface UserLoginBody {
  email: string;
  password: string;
}

export async function userLoginService(
  fastify: FastifyInstance,
  body: UserLoginBody
) {
  try {
    // Get user by email from Firestore
    const usersSnapshot = await fastify.db
      .collection("users")
      .where("email", "==", body.email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      throw new ServiceError(401, "Invalid email or password");
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Check if user account is activated
    if (userData.status !== "activated") {
      throw new ServiceError(403, "Account is not activated");
    }

    // Get Firebase user record
    try {
      const userRecord = await fastify.firebaseAdmin.auth().getUserByEmail(body.email);
      
      // Create a custom token for the user
      const customToken = await fastify.firebaseAdmin.auth().createCustomToken(userRecord.uid);
      
      return {
        token: customToken,
        user: {
          uid: userDoc.id,
          email: userData.email,
          displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          emailVerified: userData.emailVerified || false,
          photoUrl: userData.photoUrl || null,
          contactNumber: userData.contactNumber || null,
          address: userData.address || null,
          status: userData.status,
          devices: userData.devices || []
        }
      };
    } catch (authError) {
      fastify.log.error(authError);
      throw new ServiceError(401, "Invalid email or password");
    }

  } catch (err) {
    if (err instanceof ServiceError) {
      throw err;
    }
    fastify.log.error(err);
    throw new ServiceError(500, "Internal Server Error");
  }
}
