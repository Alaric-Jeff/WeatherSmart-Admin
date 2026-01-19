import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../error/service-error.js";

export async function getAdmins(fastify: FastifyInstance) {
  try {
    const adminsSnapshot = await fastify.db.collection("admins").get();

    if (adminsSnapshot.empty) {
      return [];
    }

    const admins = adminsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id, // Firebase UID
        adminId: data.adminId,
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        middleName: data.middleName || null,
        role: data.role,
        status: data.status,
        emailVerified: data.emailVerified || false,
        createdDate: data.createdDate || new Date().toISOString(),
        lastLogin: data.lastLogin || new Date().toISOString(),
      };
    });

    return admins;
  } catch (err: unknown) {
    fastify.log.error(err);
    const message = (err as { message?: string })?.message;
    throw new ServiceError(500, message || "Failed to fetch admins");
  }
}
