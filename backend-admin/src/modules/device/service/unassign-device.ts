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

    // Check device data - ensure we're working with an array
    const deviceData = deviceSnap.data()!;
    const connectedUsers = Array.isArray(deviceData.connectedUsers) 
      ? deviceData.connectedUsers 
      : [];

    if (!connectedUsers.includes(body.userId)) {
      throw new ServiceError(409, "User is not assigned to this device");
    }

    // Check user data - ensure we're working with an array
    const userData = userSnap.data()!;
    const userDevices = Array.isArray(userData.devices) 
      ? userData.devices 
      : [];

    if (!userDevices.includes(body.deviceId)) {
      throw new ServiceError(409, "Device is not assigned to this user");
    }

    // Update both collections atomically using a batch
    const batch = fastify.db.batch();

    // Update device: remove user from connectedUsers array
    batch.update(deviceRef, {
      connectedUsers: FieldValue.arrayRemove(body.userId),
      updatedAt: new Date(),
      // Set status to "not paired" only if this was the last user
      status: connectedUsers.length === 1 ? "not paired" : "paired",
    });

    // Update user: remove device from devices array
    batch.update(userRef, {
      devices: FieldValue.arrayRemove(body.deviceId),
      updatedAt: new Date(),
    });

    // Commit the batch
    await batch.commit();

    // Create audit log
    await createAuditFunction(fastify, {
      adminId: body.adminId,
      action: "device unassigned",
      target: body.deviceId,
      reason: body.reason ?? "",
    });

  } catch (err: unknown) {
    if (err instanceof ServiceError) {
      throw err;
    }
    fastify.log.error(err);
    throw new ServiceError(500, "Internal Server Error");
  }
}