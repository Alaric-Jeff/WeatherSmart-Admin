import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";

interface UpdateUserBody {
  userId: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  contactNumber?: string;
  address?: string;
  photoUrl?: string;
}

export async function updateUserService(
  fastify: FastifyInstance,
  body: UpdateUserBody
) {
  const { userId, ...updates } = body;

  try {
    const userRef = fastify.db.collection("users").doc(userId);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      throw new ServiceError(404, "User not found");
    }

    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        payload[key] = value;
      }
    }

    if (Object.keys(payload).length === 0) {
      throw new ServiceError(400, "No fields to update");
    }

    payload.updatedAt = new Date();

    await userRef.update(payload);

    const updated = await userRef.get();
    const data = updated.data() ?? {};
    delete (data as any).password;

    return {
      uuid: updated.id,
      ...data,
    };
  } catch (err) {
    if (err instanceof ServiceError) {
      throw err;
    }
    fastify.log.error(err);
    throw new ServiceError(500, "Internal Server Error");
  }
}