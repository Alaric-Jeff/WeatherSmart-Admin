// send-password-reset.service.ts
import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { createAuditFunction } from "../../audit-logs/create-audit-log.js";

export async function sendUserPasswordReset(
  fastify: FastifyInstance,
  body: { adminId: string; userId: string, reason: string }
) {
  try {
    fastify.log.info(`[PASSWORD_RESET] Starting password reset for userId: ${body.userId} by adminId: ${body.adminId}`);
    
    // Check if user exists in Firestore
    const userRef = await fastify.db.collection("users").doc(body.userId).get();
    if (!userRef.exists) {
      fastify.log.error(`[PASSWORD_RESET] User not found: ${body.userId}`);
      throw new ServiceError(404, "User not found");
    }
    fastify.log.info(`[PASSWORD_RESET] User found in Firestore`);

    const userData = userRef.data();
    if (!userData?.email) {
      fastify.log.error(`[PASSWORD_RESET] User has no email: ${body.userId}`);
      throw new ServiceError(400, "User has no email");
    }
    fastify.log.info(`[PASSWORD_RESET] User email found: ${userData.email}`);

    // Generate password reset link via Firebase Admin
    fastify.log.info(`[PASSWORD_RESET] Generating password reset link`);
    const link = await fastify.firebaseAuthSdk.generatePasswordResetLink(userData.email);
    fastify.log.info(`[PASSWORD_RESET] Password reset link generated successfully`);

    fastify.log.info(`[PASSWORD_RESET] Creating audit log`);
    await createAuditFunction(fastify, {
        adminId: body.adminId,
        action: "User send password reset link",
        target: body.userId,
        reason: body.reason
    })
    fastify.log.info(`[PASSWORD_RESET] Audit log created successfully`);
    
    fastify.log.info(`[PASSWORD_RESET] Password reset completed successfully for user ${body.userId}`);

    return { message: "Password reset link generated successfully", link };
  } catch (err: unknown) {
    fastify.log.error(`[PASSWORD_RESET] Error sending password reset: ${err}`);
    if(err instanceof ServiceError){
      throw err;
    }
    throw new ServiceError(500, "Internal Server Error");
  }
}