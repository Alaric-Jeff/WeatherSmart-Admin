import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../error/service-error.js";

interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phoneNumber?: string;
  address?: string;
}

export async function updateAdminProfile(
  fastify: FastifyInstance,
  adminId: string,
  updates: UpdateProfilePayload
) {
  try {
    const adminRef = await fastify.db
      .collection("admins")
      .doc(adminId)
      .get();

    if (!adminRef.exists) {
      throw new ServiceError(404, "Admin not found");
    }

    // Build update object with only provided fields that are not empty
    const updateData: any = {};

    if (updates.firstName && updates.firstName.trim()) updateData.firstName = updates.firstName;
    if (updates.lastName && updates.lastName.trim()) updateData.lastName = updates.lastName;
    if (updates.middleName && updates.middleName.trim()) updateData.middleName = updates.middleName;
    if (updates.phoneNumber && updates.phoneNumber.trim()) updateData.phoneNumber = updates.phoneNumber;
    if (updates.address && updates.address.trim()) updateData.address = updates.address;

    // Update Firestore only if there are fields to update
    if (Object.keys(updateData).length > 0) {
      await fastify.db.collection("admins").doc(adminId).update(updateData);
    }

    // Return updated admin data
    const updatedAdminRef = await fastify.db
      .collection("admins")
      .doc(adminId)
      .get();

    return updatedAdminRef.data();
  } catch (err: unknown) {
    if (err instanceof ServiceError) {
      throw err;
    }
    throw new ServiceError(500, "Failed to update admin profile");
  }
}
