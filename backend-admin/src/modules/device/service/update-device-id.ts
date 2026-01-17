import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { createAuditFunction } from "../../audit-logs/create-audit-log.js";
import type { updateDeviceServiceType } from "../schema/update-device-req.js";
export async function updateDevice(
  fastify: FastifyInstance,
  body: updateDeviceServiceType
) {
  try {
    const deviceRef = fastify.db.collection("devices").doc(body.id);
    const device = await deviceRef.get();

    if (!device.exists) {
      throw new ServiceError(404, "Device not found");
    }

    await deviceRef.update({
      macId: body.macId,
      updatedAt: new Date(),
    });

    await createAuditFunction(fastify, {
      adminId: body.adminId,
      action: "device macId updated",
      target: body.id,
      reason: body.reason,
    });

  } catch (err: unknown) {
    fastify.log.error(err);
    throw new ServiceError(500, "Internal Server Error");
  }
}
