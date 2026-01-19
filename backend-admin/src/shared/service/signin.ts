import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../error/service-error.js";
import type { SigninReq } from "../schema.js";

export async function signin(
  fastify: FastifyInstance,
  body: SigninReq
) {
  try {
    const decoded = await fastify.firebaseAdmin.auth().verifyIdToken(body.idToken);

    if (!decoded.email) {
      throw new ServiceError(401, "Invalid token");
    }
    if (!decoded.email_verified) {
      throw new ServiceError(403, "Email not verified");
    }

    const uid = decoded.uid;
    const adminDoc = await fastify.db.collection("admins").doc(uid).get();

    if (!adminDoc.exists) {
      throw new ServiceError(403, "Not an admin");
    }

    const adminData = adminDoc.data()!;
    fastify.log.info(`current role: ${adminData.role}`)
    if(adminData.role != "admin" && adminData.role != "super-admin"){
        throw new ServiceError(403, "Invalid admin role")
    }

    return {
      uid,
      firstName: adminData.firstName ?? "",
      lastName: adminData.lastName ?? "",
      middleName: adminData.middleName ?? "",
      email: decoded.email,
      role: adminData.role,
      displayName: `${adminData.firstName} ${adminData.lastName}`,
      emailVerified: true,
      status: adminData.status
    };

  } catch (err) {
    fastify.log.error(err);
    throw new ServiceError(500, "Internal Server Error");
  }
}
