import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";

export async function getUsersService(
  fastify: FastifyInstance
) {
  try {
    const snapshot = await fastify.db.collection("users").get();
    
  return snapshot.docs.map(doc => {
  const data = doc.data() ?? {};
  delete data.password; 

  return {
    uuid: doc.id,
    firstName: data.firstName ?? null,
    lastName: data.lastName ?? null,
    displayName: data.displayName ?? null,
    email: data.email ?? null,
    emailVerified: data.emailVerified ?? false,
    contactNumber: data.contactNumber ?? null,
    photoUrl: data.photoUrl ?? null,
    address: data.address ?? null,
    devices: Array.isArray(data.devices) ? data.devices : [],
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null
  };
});


  } catch (err) {
    fastify.log.error(err);

    throw new ServiceError(
      500,
      "Unable to retrieve users from database"
    );
  }
}
