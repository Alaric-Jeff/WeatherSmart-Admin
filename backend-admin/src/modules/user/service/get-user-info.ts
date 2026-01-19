import type { FastifyInstance } from "fastify";
import type { userUuidType } from "../schemas/user-uuid.js";
import { ServiceError } from "../../../error/service-error.js";
import { FieldPath } from "firebase-admin/firestore";

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

    let devices: any[] = [];
    if (Array.isArray(data.devices) && data.devices.length > 0) {
      // Trim whitespace from device IDs
      const cleanDeviceIds = data.devices.map((id: string) => id.trim());
      
      const batches: string[][] = [];
      const chunkSize = 10;
      
      for (let i = 0; i < cleanDeviceIds.length; i += chunkSize) {
        batches.push(cleanDeviceIds.slice(i, i + chunkSize));
      }

      const deviceDocs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
      for (const batch of batches) {
        const snap = await fastify.db
          .collection("devices")
          .where(FieldPath.documentId(), "in", batch)
          .get();
        deviceDocs.push(...snap.docs);
      }

      devices = deviceDocs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

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
      devices,
      status: data.status,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null
    };

  } catch (err: unknown) {
    fastify.log.error(err);
    throw new ServiceError(500, "Internal server error");
  }
}