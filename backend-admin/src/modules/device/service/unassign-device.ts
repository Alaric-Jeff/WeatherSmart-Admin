import type { FastifyInstance } from "fastify";
import { createAuditFunction } from "../../audit-logs/create-audit-log.js";
import { ServiceError } from "../../../error/service-error.js";
import { FieldValue } from "firebase-admin/firestore";
import type { assignDeviceService } from "../schema/assign-device.js";

export async function unassignDevice(
  fastify: FastifyInstance,
  body: assignDeviceService
) {
  try {
    const userRef = fastify.db.collection("users").doc(body.userId);
    const deviceRef = fastify.db.collection("devices").doc(body.deviceId);

    const [userSnap, deviceSnap] = await Promise.all([
      userRef.get(),
      deviceRef.get(),
    ]);

    if (!userSnap.exists) {
      throw new ServiceError(404, "User not found");
    }

    if (!deviceSnap.exists) {
      throw new ServiceError(404, "Device not found");
    }

    const deviceData = deviceSnap.data()!;
    const assignedTo = deviceData.assignedTo ?? [];

    if (!assignedTo.includes(body.userId)) {
      throw new ServiceError(409, "User is not assigned to this device");
    }

    await deviceRef.update({
      assignedTo: FieldValue.arrayRemove(body.userId),
      updatedAt: new Date(),
      status: assignedTo.length === 1 ? "not paired" : "paired",
    });

    await createAuditFunction(fastify, {
      adminId: body.adminId,
      action: "device unassigned",
      target: body.deviceId,
      reason: body.reason ?? "",
    });

  } catch (err: unknown) {
    fastify.log.error(err);
    throw new ServiceError(500, "Internal Server Error");
  }
}
