import type { FastifyInstance } from "fastify";
import type { userUuidType } from "../schemas/user-uuid.js";
import { ServiceError } from "../../../error/service-error.js";

export async function getUserInfoService(
  fastify: FastifyInstance,
  body: userUuidType
) {
  const { userId } = body;

  try {
    const snapshot = await fastify.db.collection("users").doc(userId).get();

    if (!snapshot.exists) {
      throw new ServiceError(404, "User not found");
    }

    const data = snapshot.data() ?? {};
    delete data.password;

    return {
      uuid: snapshot.id,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      displayName: data.displayName ?? null,
      email: data.email ?? null,
      emailVerified: data.emailVerified ?? false,
      contactNumber: data.contactNumber ?? null,
      photoUrl: data.photoUrl ?? null,
      address: data.address ?? null,
      devices: Array.isArray(data.devices) ? data.devices : [],
      status: data.status,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null
    };

  } catch (err: unknown) {
    fastify.log.error(err);
    throw new ServiceError(500, "Internal server error");
  }
}
