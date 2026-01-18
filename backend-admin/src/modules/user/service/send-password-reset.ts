import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { createAuditFunction } from "../../audit-logs/create-audit-log.js";

export async function sendUserPasswordReset(
  fastify: FastifyInstance,
  body: { adminId: string; userId: string, reason: string,  }
) {
  try {
    // Check if user exists in Firestore
    const userRef = await fastify.db.collection("users").doc(body.userId).get();
    if (!userRef.exists) {
      throw new ServiceError(404, "User not found");
    }

    const userData = userRef.data();
    if (!userData?.email) {
      throw new ServiceError(400, "User has no email");
    }

    // Send password reset email via Firebase Admin
    const link = await fastify.firebaseAuthSdk.generatePasswordResetLink(userData.email);

    await createAuditFunction(fastify, {
        adminId: body.adminId,
        action: "User send password reset link",
        target: body.userId,
        reason: body.reason
    })
    fastify.log.info(`Password reset link generated for user ${body.userId}`);

    return { message: "Password reset link generated successfully", link };
  } catch (err: unknown) {
    fastify.log.error(`Error sending password reset: ${err}`);
    throw new ServiceError(500, "Internal Server Error");
  }
}
